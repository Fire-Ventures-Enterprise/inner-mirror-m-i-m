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
  // Create tables if they don't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      email TEXT UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS daily_prompts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      prompt_text TEXT NOT NULL,
      date_assigned DATE UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS journal_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      prompt_id INTEGER,
      entry_text TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (prompt_id) REFERENCES daily_prompts(id)
    );

    CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON journal_entries(user_id);
    CREATE INDEX IF NOT EXISTS idx_journal_entries_created_at ON journal_entries(created_at);
    CREATE INDEX IF NOT EXISTS idx_daily_prompts_date ON daily_prompts(date_assigned);
  `);

  // Insert default prompts
  const today = new Date().toISOString().split('T')[0];
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

    return c.json({ 
      id: result.meta.last_row_id, 
      first_name,
      message: 'Welcome to MIM!' 
    });
  } catch (error) {
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

// Get today's prompt
app.get('/api/prompt/today', async (c) => {
  const today = new Date().toISOString().split('T')[0];
  
  try {
    const prompt = await c.env.DB.prepare(`
      SELECT * FROM daily_prompts WHERE date_assigned = ? LIMIT 1
    `).bind(today).first();

    if (!prompt) {
      return c.json({ 
        prompt_text: 'What are you reflecting on today?',
        date_assigned: today,
        id: null 
      });
    }

    return c.json(prompt);
  } catch (error) {
    return c.json({ error: 'Failed to get prompt' }, 500);
  }
});

// Submit journal entry
app.post('/api/entries', async (c) => {
  const { user_id, entry_text, prompt_id } = await c.req.json();
  
  if (!user_id || !entry_text) {
    return c.json({ error: 'User ID and entry text are required' }, 400);
  }

  try {
    const result = await c.env.DB.prepare(`
      INSERT INTO journal_entries (user_id, prompt_id, entry_text) VALUES (?, ?, ?)
    `).bind(user_id, prompt_id || null, entry_text).run();

    return c.json({ 
      id: result.meta.last_row_id,
      message: 'Entry saved successfully' 
    });
  } catch (error) {
    return c.json({ error: 'Failed to save entry' }, 500);
  }
});

// Get user's entries
app.get('/api/entries/:user_id', async (c) => {
  const user_id = c.req.param('user_id');
  
  try {
    const entries = await c.env.DB.prepare(`
      SELECT je.*, dp.prompt_text 
      FROM journal_entries je
      LEFT JOIN daily_prompts dp ON je.prompt_id = dp.id
      WHERE je.user_id = ?
      ORDER BY je.created_at DESC
    `).bind(user_id).all();

    return c.json(entries);
  } catch (error) {
    return c.json({ error: 'Failed to get entries' }, 500);
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
