import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS for API routes
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// Initialize database tables
const initDB = async (db: D1Database) => {
  try {
    // Create tables one by one
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        email TEXT UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    await db.prepare(`
      CREATE TABLE IF NOT EXISTS daily_prompts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        prompt_text TEXT NOT NULL,
        date_assigned DATE UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    await db.prepare(`
      CREATE TABLE IF NOT EXISTS journal_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        prompt_id INTEGER,
        entry_text TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (prompt_id) REFERENCES daily_prompts(id)
      )
    `).run();

    // Create indexes
    await db.prepare(`CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON journal_entries(user_id)`).run();
    await db.prepare(`CREATE INDEX IF NOT EXISTS idx_journal_entries_created_at ON journal_entries(created_at)`).run();
    await db.prepare(`CREATE INDEX IF NOT EXISTS idx_daily_prompts_date ON daily_prompts(date_assigned)`).run();

    // Create analytics tables
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS user_analytics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        session_id TEXT NOT NULL,
        action_type TEXT NOT NULL,
        action_data TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        ip_address TEXT,
        user_agent TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `).run();

    await db.prepare(`
      CREATE TABLE IF NOT EXISTS user_patterns (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        pattern_type TEXT NOT NULL,
        pattern_data TEXT NOT NULL,
        confidence_score REAL,
        first_detected DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `).run();

    await db.prepare(`
      CREATE TABLE IF NOT EXISTS mood_tracking (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        entry_id INTEGER,
        mood_rating INTEGER NOT NULL,
        mood_tags TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (entry_id) REFERENCES journal_entries(id)
      )
    `).run();

    // Create indexes for analytics
    await db.prepare(`CREATE INDEX IF NOT EXISTS idx_user_analytics_user_id ON user_analytics(user_id)`).run();
    await db.prepare(`CREATE INDEX IF NOT EXISTS idx_user_analytics_timestamp ON user_analytics(timestamp)`).run();
    await db.prepare(`CREATE INDEX IF NOT EXISTS idx_user_patterns_user_id ON user_patterns(user_id)`).run();
    await db.prepare(`CREATE INDEX IF NOT EXISTS idx_mood_tracking_user_id ON mood_tracking(user_id)`).run();

    // Insert default prompts
    const prompts = [
      'What are you afraid to say out loud today?',
      'What pattern in your life are you ready to break?',
      'What would you tell your younger self right now?',
      'What truth about yourself have you been avoiding?',
      'What boundaries do you need to set today?',
      'What are you pretending not to know?',
      'How are you sabotaging your own growth?'
    ];

    for (let i = 0; i < prompts.length; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      await db.prepare(`INSERT OR IGNORE INTO daily_prompts (prompt_text, date_assigned) VALUES (?, ?)`)
        .bind(prompts[i], dateStr)
        .run();
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// Analytics Tracking Functions
const trackUserAction = async (db: D1Database, userId: number, sessionId: string, actionType: string, actionData: any, request: Request) => {
  try {
    await db.prepare(`
      INSERT INTO user_analytics (user_id, session_id, action_type, action_data, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      userId,
      sessionId,
      actionType,
      JSON.stringify(actionData),
      request.headers.get('cf-connecting-ip') || 'unknown',
      request.headers.get('user-agent') || 'unknown'
    ).run();
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
};

const generateSessionId = () => {
  return 'session_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Pattern Analysis Functions
const analyzeWordFrequency = (text: string) => {
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const frequency: { [key: string]: number } = {};
  
  // Emotional keywords to track
  const emotionalWords = ['overwhelmed', 'anxious', 'stressed', 'angry', 'sad', 'happy', 'excited', 'grateful', 'afraid', 'worried', 'frustrated', 'lonely', 'confident', 'hopeful'];
  
  words.forEach(word => {
    if (emotionalWords.includes(word)) {
      frequency[word] = (frequency[word] || 0) + 1;
    }
  });
  
  return frequency;
};

const detectMoodPattern = async (db: D1Database, userId: number) => {
  try {
    const recentMoods = await db.prepare(`
      SELECT mood_rating, timestamp 
      FROM mood_tracking 
      WHERE user_id = ? 
      ORDER BY timestamp DESC 
      LIMIT 30
    `).bind(userId).all();

    if (recentMoods.results && recentMoods.results.length >= 7) {
      const moods = recentMoods.results as Array<{mood_rating: number, timestamp: string}>;
      const avgMood = moods.reduce((sum, m) => sum + m.mood_rating, 0) / moods.length;
      
      // Detect patterns (simplified)
      const trend = moods.slice(0, 7).reduce((sum, m) => sum + m.mood_rating, 0) / 7;
      const isImproving = trend > avgMood;
      
      return {
        averageMood: avgMood,
        recentTrend: trend,
        isImproving: isImproving,
        dataPoints: moods.length
      };
    }
    
    return null;
  } catch (error) {
    console.error('Mood pattern analysis error:', error);
    return null;
  }
};

// API Routes

// Create user (onboarding)
app.post('/api/users', async (c) => {
  const { first_name, email } = await c.req.json();
  
  if (!first_name) {
    return c.json({ error: 'First name is required' }, 400);
  }

  try {
    const result = await c.env.DB.prepare(`
      INSERT INTO users (first_name, email) VALUES (?, ?)
    `).bind(first_name, email || null).run();

    const userId = result.meta.last_row_id as number;
    const sessionId = generateSessionId();

    // Track user creation
    await trackUserAction(c.env.DB, userId, sessionId, 'user_created', {
      first_name: first_name,
      has_email: !!email,
      onboarding_completed: true
    }, c.req.raw);

    return c.json({ 
      id: userId, 
      first_name,
      session_id: sessionId,
      message: 'Welcome to MIM!' 
    });
  } catch (error) {
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

// Get today's prompt  
app.get('/api/prompt/today', async (c) => {
  const today = new Date().toISOString().split('T')[0];
  const userId = c.req.query('user_id');
  const sessionId = c.req.query('session_id') || generateSessionId();
  
  try {
    const prompt = await c.env.DB.prepare(`
      SELECT * FROM daily_prompts WHERE date_assigned = ? LIMIT 1
    `).bind(today).first();

    const promptData = prompt || { 
      prompt_text: 'What are you reflecting on today?',
      date_assigned: today,
      id: null 
    };

    // Track prompt view
    if (userId) {
      await trackUserAction(c.env.DB, parseInt(userId), sessionId, 'prompt_viewed', {
        prompt_id: promptData.id,
        prompt_text: promptData.prompt_text,
        date: today
      }, c.req.raw);
    }

    return c.json(promptData);
  } catch (error) {
    return c.json({ error: 'Failed to get prompt' }, 500);
  }
});

// Submit journal entry
app.post('/api/entries', async (c) => {
  const { user_id, entry_text, prompt_id, mood_rating, session_id } = await c.req.json();
  
  if (!user_id || !entry_text) {
    return c.json({ error: 'User ID and entry text are required' }, 400);
  }

  try {
    const result = await c.env.DB.prepare(`
      INSERT INTO journal_entries (user_id, prompt_id, entry_text) VALUES (?, ?, ?)
    `).bind(user_id, prompt_id || null, entry_text).run();

    const entryId = result.meta.last_row_id as number;

    // Analyze entry for patterns
    const wordFreq = analyzeWordFrequency(entry_text);
    const entryLength = entry_text.length;
    const wordCount = entry_text.split(/\s+/).length;

    // Save mood rating if provided
    if (mood_rating) {
      await c.env.DB.prepare(`
        INSERT INTO mood_tracking (user_id, entry_id, mood_rating) VALUES (?, ?, ?)
      `).bind(user_id, entryId, mood_rating).run();
    }

    // Track entry creation with analytics
    await trackUserAction(c.env.DB, user_id, session_id || generateSessionId(), 'entry_created', {
      entry_id: entryId,
      prompt_id: prompt_id,
      entry_length: entryLength,
      word_count: wordCount,
      emotional_words: wordFreq,
      mood_rating: mood_rating,
      time_to_write: null // Can be calculated on frontend
    }, c.req.raw);

    // Update user patterns (simplified pattern detection)
    if (Object.keys(wordFreq).length > 0) {
      const existingPattern = await c.env.DB.prepare(`
        SELECT * FROM user_patterns WHERE user_id = ? AND pattern_type = 'emotional_words'
      `).bind(user_id).first();

      if (existingPattern) {
        const currentData = JSON.parse(existingPattern.pattern_data as string);
        Object.keys(wordFreq).forEach(word => {
          currentData[word] = (currentData[word] || 0) + wordFreq[word];
        });
        
        await c.env.DB.prepare(`
          UPDATE user_patterns SET pattern_data = ?, last_updated = CURRENT_TIMESTAMP 
          WHERE user_id = ? AND pattern_type = 'emotional_words'
        `).bind(JSON.stringify(currentData), user_id).run();
      } else {
        await c.env.DB.prepare(`
          INSERT INTO user_patterns (user_id, pattern_type, pattern_data, confidence_score)
          VALUES (?, 'emotional_words', ?, 1.0)
        `).bind(user_id, JSON.stringify(wordFreq)).run();
      }
    }

    return c.json({ 
      id: entryId,
      message: 'Entry saved successfully',
      patterns_detected: Object.keys(wordFreq).length > 0 ? wordFreq : null
    });
  } catch (error) {
    return c.json({ error: 'Failed to save entry' }, 500);
  }
});

// Get user's entries
app.get('/api/entries/:user_id', async (c) => {
  const user_id = c.req.param('user_id');
  const sessionId = c.req.query('session_id') || generateSessionId();
  
  try {
    const entries = await c.env.DB.prepare(`
      SELECT je.*, dp.prompt_text, mt.mood_rating
      FROM journal_entries je
      LEFT JOIN daily_prompts dp ON je.prompt_id = dp.id
      LEFT JOIN mood_tracking mt ON je.id = mt.entry_id
      WHERE je.user_id = ?
      ORDER BY je.created_at DESC
    `).bind(user_id).all();

    // Track vault access
    await trackUserAction(c.env.DB, parseInt(user_id), sessionId, 'vault_accessed', {
      entries_count: entries.results?.length || 0
    }, c.req.raw);

    return c.json(entries);
  } catch (error) {
    return c.json({ error: 'Failed to get entries' }, 500);
  }
});

// Get user analytics dashboard
app.get('/api/analytics/:user_id', async (c) => {
  const user_id = c.req.param('user_id');
  
  try {
    // Get user patterns
    const patterns = await c.env.DB.prepare(`
      SELECT pattern_type, pattern_data, confidence_score, last_updated
      FROM user_patterns 
      WHERE user_id = ?
    `).bind(user_id).all();

    // Get mood trends
    const moodPattern = await detectMoodPattern(c.env.DB, parseInt(user_id));

    // Get activity summary
    const activitySummary = await c.env.DB.prepare(`
      SELECT 
        COUNT(*) as total_entries,
        COUNT(DISTINCT DATE(created_at)) as days_active,
        AVG(LENGTH(entry_text)) as avg_entry_length
      FROM journal_entries 
      WHERE user_id = ?
    `).bind(user_id).first();

    // Get recent activity
    const recentActivity = await c.env.DB.prepare(`
      SELECT action_type, action_data, timestamp
      FROM user_analytics 
      WHERE user_id = ? 
      ORDER BY timestamp DESC 
      LIMIT 20
    `).bind(user_id).all();

    return c.json({
      patterns: patterns.results || [],
      moodTrend: moodPattern,
      activity: activitySummary,
      recentActivity: recentActivity.results || []
    });
  } catch (error) {
    return c.json({ error: 'Failed to get analytics' }, 500);
  }
});

// Track specific user actions (mood rating, prompt skips, etc.)
app.post('/api/track', async (c) => {
  const { user_id, session_id, action_type, action_data } = await c.req.json();
  
  if (!user_id || !action_type) {
    return c.json({ error: 'User ID and action type are required' }, 400);
  }

  try {
    await trackUserAction(
      c.env.DB, 
      user_id, 
      session_id || generateSessionId(), 
      action_type, 
      action_data || {}, 
      c.req.raw
    );

    return c.json({ message: 'Action tracked successfully' });
  } catch (error) {
    return c.json({ error: 'Failed to track action' }, 500);
  }
});

// Main app route
app.get('/', async (c) => {
  // Initialize database on first load
  if (c.env.DB) {
    await initDB(c.env.DB);
  }

  return c.html(`
    <!DOCTYPE html>
    <html lang="en" class="dark">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>My Inner Mirror (MIM)</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script>
          tailwind.config = {
            darkMode: 'class',
            theme: {
              extend: {
                colors: {
                  'mim-blue': '#1e3a8a',
                  'mim-purple': '#581c87',
                  'mim-gray': '#374151'
                }
              }
            }
          }
        </script>
    </head>
    <body class="bg-gray-900 text-white min-h-screen">
        <div id="app" class="container mx-auto px-4 py-8 max-w-2xl">
            <!-- App content will be loaded here -->
        </div>
        
        <script src="/static/app.js"></script>
    </body>
    </html>
  `);
});

export default app
