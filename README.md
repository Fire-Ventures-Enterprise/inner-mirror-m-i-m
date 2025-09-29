# My Inner Mirror (MIM) - MVP with Analytics

## Project Overview
- **Name**: My Inner Mirror (MIM)
- **Goal**: Help users break emotional cycles through honest self-reflection and daily truth prompts
- **Features**: Personalized daily prompts, journal entries, private vault, dark mode interface, **comprehensive analytics tracking**

## URLs
- **Development**: https://3000-ix0gidul9ikav1z69jr1e-6532622b.e2b.dev
- **API Base**: https://3000-ix0gidul9ikav1z69jr1e-6532622b.e2b.dev/api
- **GitHub**: Will be connected after deployment

## Current Features (MVP v1.1) ✅

### **Core Functionality**
1. **Personalized Onboarding**: Collects user's first name for personalized experience
2. **Daily Truth Prompts**: Thought-provoking questions updated daily
3. **Journal Entry System**: Text-based reflection input with timestamp
4. **Personal Vault**: View and browse all past journal entries
5. **Dark Mode Interface**: Calming, emotional-safe design with deep blues and earth tones
6. **Responsive Design**: Works on desktop and mobile devices

### **NEW: Analytics & Pattern Recognition (Phase 1) 🔥**
1. **Comprehensive User Tracking**: Every interaction tracked for pattern analysis
2. **Mood Rating System**: 1-5 scale mood tracking with each entry
3. **Emotional Word Analysis**: Automatic detection of emotional language patterns
4. **User Behavior Analytics**: Entry timing, length, frequency patterns
5. **Personal Insights Dashboard**: Visual analytics showing growth trends
6. **Pattern Storage**: Database tracks emotional cycles and behavioral patterns

## API Endpoints

### **Core Functionality**
- `GET /` - Main application interface
- `POST /api/users` - Create new user (onboarding)
- `GET /api/prompt/today` - Get today's reflection prompt
- `POST /api/entries` - Save journal entry
- `GET /api/entries/:user_id` - Get user's journal entries

### **NEW: Analytics Endpoints**
- `GET /api/analytics/:user_id` - Get user's comprehensive analytics dashboard
- `POST /api/track` - Track specific user actions and behaviors
- **Auto-tracking**: All major actions automatically tracked (entry creation, vault access, mood ratings, etc.)

## Data Architecture

### **Core Data Models**
- **Users**: Basic profile and personalization data
- **Daily Prompts**: Psychological prompts with categories and difficulty levels
- **Journal Entries**: User reflections with mood ratings and timestamps

### **NEW: Analytics Data Models**
- **User Analytics**: Comprehensive behavior tracking (action type, timing, metadata)
- **User Patterns**: Detected emotional and behavioral patterns with confidence scores  
- **Mood Tracking**: Detailed mood progression with trend analysis
- **Pattern Detection**: Emotional word frequency, timing patterns, avoidance detection

### **Storage Services**
- **Primary**: Cloudflare D1 SQLite database (local development mode)
- **Analytics Processing**: Real-time pattern detection and storage
- **Data Flow**: User → Daily Prompt → Journal Entry → Analytics Processing → Pattern Storage

## Pattern Recognition System (Phase 1)

### **What MIM Currently Tracks:**
```javascript
// Behavioral Analytics
- Entry creation timing and frequency
- Time spent writing each entry  
- Mood ratings progression over time
- Vault access patterns and frequency
- Prompt engagement vs. skipping patterns

// Content Analytics  
- Emotional word frequency ("overwhelmed", "anxious", "grateful", etc.)
- Entry length and word count trends
- Response timing to different prompt categories
- Mood correlation with entry content

// Pattern Detection
- Weekly/monthly emotional cycles
- Trigger identification (what causes mood drops)
- Growth moment recognition (breakthrough language)
- Avoidance patterns (consistently skipped topics)
```

### **Real-Time Analytics Dashboard:**
- **Journey Stats**: Total entries, active days, writing habits
- **Mood Insights**: Average mood, trend analysis, improvement tracking
- **Emotional Patterns**: Most-used emotional words with frequency
- **Growth Recognition**: Celebrates progress and breakthrough moments

## User Guide

### **Basic Reflection Flow:**
1. **Daily Check-in**: Get personalized prompt with your name
2. **Honest Writing**: Reflect freely with timer tracking writing time
3. **Mood Rating**: Rate your emotional state (1-5 scale)
4. **Pattern Recognition**: MIM automatically analyzes your entry for patterns
5. **Insights Access**: View your growth analytics in "Insights" tab

### **Analytics Features:**
- **Real-time Feedback**: See patterns as they develop
- **Privacy-First**: All analytics processed locally, never shared
- **Growth Tracking**: Visual progress over days, weeks, months
- **Pattern Awareness**: Spot cycles you couldn't see before

## Technology Stack
- **Backend**: Hono framework with TypeScript
- **Database**: Cloudflare D1 (SQLite) with comprehensive analytics schema
- **Frontend**: Vanilla JavaScript with TailwindCSS
- **Analytics**: Real-time pattern detection and user behavior tracking
- **Deployment**: Cloudflare Pages (ready for production)
- **Development**: PM2 process manager with hot reload

## What's Next: AI-Powered Features (Phase 2)

### **Coming Soon (Phase 2 - Weeks 2-4):**
1. **Adaptive Prompting**: AI generates personalized prompts based on your patterns
2. **Cycle Interruption**: Real-time alerts when patterns are detected
3. **Breakthrough Recognition**: AI celebrates growth moments automatically
4. **Personalized Insights**: "Sarah, you've mentioned 'overwhelmed' 12 times this month..."
5. **Smart Timing**: Prompts delivered when you're most likely to engage

### **Pattern-Based Intelligence Example:**
```javascript
// What MIM will be able to do:
if (user.emotionalWords.overwhelmed >= 10 && user.moodTrend.declining) {
  generatePrompt("What boundary do you need to set, Sarah?");
}

if (user.skipPattern.includes("relationships") && user.mood > 3) {
  generatePrompt("How did you show up in your relationships today, Sarah?");  
}

if (user.breakthrough.detected) {
  celebrateGrowth("Sarah, this feels like a shift from how you talked about this last month!");
}
```

## Development Progress

### **Phase 1: Analytics Foundation ✅ COMPLETED**
- [x] User behavior tracking system
- [x] Emotional pattern recognition  
- [x] Mood tracking and trend analysis
- [x] Analytics dashboard with insights
- [x] Real-time data processing

### **Phase 2: AI Intelligence (Starting Week 2)**
- [ ] OpenAI integration for pattern analysis
- [ ] Adaptive prompt generation based on user data
- [ ] Real-time cycle interruption system
- [ ] Personalized breakthrough recognition

### **Phase 3: Advanced Features (Weeks 3-4)**
- [ ] Voice journaling with emotional analysis
- [ ] Predictive mood analysis
- [ ] Social platform foundation (MIM Social)
- [ ] Advanced pattern matching algorithms

## Development Status
- **Platform**: Cloudflare Pages (local development with analytics)
- **Status**: ✅ Active MVP with Analytics Tracking
- **Last Updated**: September 28, 2025
- **Version**: 1.1.0 (Analytics Phase 1)

## Core Philosophy
MIM provides a **safe, private space** for honest self-reflection while intelligently learning from your patterns to accelerate emotional healing. Every interaction builds a deeper understanding of your emotional cycles, empowering you to break patterns that no longer serve you.

**The magic happens when technology meets psychology** - MIM becomes your emotional detective, spotting patterns you can't see from inside them, then asking exactly the right questions at exactly the right time.

---

*"Your inner mirror reflects not who you are, but who you're becoming - and now it remembers everything."*

## Next Development Session

**Ready to build Phase 2: AI-Powered Pattern Recognition**
- OpenAI integration for intelligent prompt generation
- Real-time pattern analysis and user insights
- Adaptive conversation based on emotional history
- Cycle interruption and breakthrough recognition

**The foundation is built. Time to make it intelligent.** 🧠✨