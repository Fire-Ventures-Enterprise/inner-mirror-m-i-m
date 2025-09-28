# My Inner Mirror (MIM) - MVP

## Project Overview
- **Name**: My Inner Mirror (MIM)
- **Goal**: Help users break emotional cycles through honest self-reflection and daily truth prompts
- **Features**: Personalized daily prompts, journal entries, private vault, dark mode interface

## URLs
- **Development**: https://3000-ix0gidul9ikav1z69jr1e-6532622b.e2b.dev
- **API Base**: https://3000-ix0gidul9ikav1z69jr1e-6532622b.e2b.dev/api
- **GitHub**: Will be connected after deployment

## Current Features (MVP v1.0) ✅
1. **Personalized Onboarding**: Collects user's first name for personalized experience
2. **Daily Truth Prompts**: Thought-provoking questions updated daily
3. **Journal Entry System**: Text-based reflection input with timestamp
4. **Personal Vault**: View and browse all past journal entries
5. **Dark Mode Interface**: Calming, emotional-safe design with deep blues and earth tones
6. **Responsive Design**: Works on desktop and mobile devices

## API Endpoints
- `GET /` - Main application interface
- `POST /api/users` - Create new user (onboarding)
- `GET /api/prompt/today` - Get today's reflection prompt
- `POST /api/entries` - Save journal entry
- `GET /api/entries/:user_id` - Get user's journal entries

## Data Architecture
- **Data Models**: Users, Daily Prompts, Journal Entries
- **Storage Services**: Cloudflare D1 SQLite database (local development mode)
- **Data Flow**: User → Daily Prompt → Journal Entry → Personal Vault
- **Persistence**: All entries stored with timestamps and prompt associations

## User Guide
1. **First Visit**: Enter your first name to create your MIM profile
2. **Daily Reflection**: Answer the personalized daily prompt with honest thoughts
3. **Save Entry**: Your reflection is privately saved to your personal vault
4. **View History**: Access "My Vault" to browse all past reflections and track growth
5. **Continue Journey**: Return daily for new prompts and continued self-discovery

## Technology Stack
- **Backend**: Hono framework with TypeScript
- **Database**: Cloudflare D1 (SQLite) with local development mode
- **Frontend**: Vanilla JavaScript with TailwindCSS
- **Deployment**: Cloudflare Pages (ready for production)
- **Development**: PM2 process manager with hot reload

## Features NOT Yet Implemented ⏳
1. **Voice Journaling**: Audio recording for journal entries
2. **On-Demand Avatar**: Personal coaching avatar with voice interaction
3. **Inner Child Tool**: Photo upload and message system for younger self
4. **Cycle Breaker Reminders**: Push notifications and daily affirmations
5. **Advanced Analytics**: Pattern recognition and growth tracking
6. **Export Features**: PDF export of journal entries
7. **Custom Domain**: MyInnerMirror.app connection

## Recommended Next Steps
1. **Deploy to Production**: Set up Cloudflare API and deploy to MyInnerMirror.app
2. **Add Voice Input**: Implement speech-to-text for journal entries
3. **Create Avatar Foundation**: Basic conversational interface for user support
4. **Implement Notifications**: Web push notifications for daily engagement
5. **Add User Authentication**: Email-based login system
6. **Create Onboarding Flow**: Multi-step setup with preferences

## Development Status
- **Platform**: Cloudflare Pages (local development)
- **Status**: ✅ Active MVP
- **Last Updated**: September 28, 2025
- **Version**: 1.0.0 MVP

## Core Philosophy
MIM provides a **safe, private space** for honest self-reflection. Every interaction is designed to feel supportive and non-judgmental, helping users break emotional cycles through consistent, guided introspection.

---

*"Your inner mirror reflects not who you are, but who you're becoming."*