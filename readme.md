# AI Schedule Assistant

A full-stack voice and chat powered AI assistant that manages your personal schedule. Built with Express.js, MongoDB, Socket.io, and the Claude AI API.

## Live Demo

https://ai-schedule-assistant-jqr0.onrender.com

## Features

- **Secure Authentication** — Register and login with bcrypt password hashing and JWT tokens
- **AI Chat Interface** — Type naturally to manage your schedule. Ask things like "add a meeting tomorrow at 3pm" or "what do I have this week"
- **Voice Input** — Speak directly to the assistant using the Web Speech API
- **Smart Scheduling** — AI interprets natural language and automatically creates, updates, or deletes events
- **Real-time Reminders** — WebSocket-powered notifications that alert you 20 minutes before events
- **Full CRUD** — View, create, edit, and delete events manually
- **PWA Support** — Installable on mobile devices, works like a native app

## Tech Stack

**Frontend**
- HTML, CSS, JavaScript
- Socket.io client
- Web Speech API (voice input)
- PWA (manifest + service worker)

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- bcrypt (password hashing)
- JSON Web Tokens (authentication)
- Socket.io (WebSockets)
- node-cron (reminder scheduler)
- Anthropic Claude API (AI)

## Project Structure

```
ai-schedule-assistant/
├── client/
│   ├── css/style.css
│   ├── js/
│   │   ├── auth.js
│   │   ├── chat.js
│   │   ├── events.js
│   │   └── socket.js
│   ├── icons/
│   ├── app.html
│   ├── index.html
│   ├── manifest.json
│   └── sw.js
├── server/
│   ├── middleware/auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Event.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── events.js
│   │   └── chat.js
│   ├── services/
│   │   ├── ai.js
│   │   └── scheduler.js
│   ├── db.js
│   └── index.js
├── .env.example
├── .gitignore
└── package.json
```

## Running Locally

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier)
- Anthropic API key

### Setup

1. Clone the repository
```bash
git clone https://github.com/akoK3/ai-schedule-assistant.git
cd ai-schedule-assistant
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory
```
PORT=3000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_random_secret_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

4. Start the development server
```bash
npm run dev
```

5. Open your browser and go to `http://localhost:3000`

## How It Works

### Authentication
Users register with email and password. Passwords are hashed with bcrypt before storing in MongoDB. On login, a JWT token is issued and stored in localStorage. Every protected API request includes this token in the Authorization header, verified by middleware before reaching the route handler.

### AI Integration
When a user sends a message, the server fetches their existing events from MongoDB and sends both the message and events to the Claude API. Claude returns a structured JSON object with an action (create_event, delete_event, update_event, query, or none) and a friendly reply. The server executes the action and returns the reply to the frontend.

### Real-time Reminders
A node-cron job runs every minute checking for events starting within 20 minutes. When found, it emits a reminder via Socket.io to the specific user's room. The frontend displays a toast notification instantly without any page refresh.

### PWA
A manifest.json defines the app name, colors, and icons for installation. A service worker handles the PWA lifecycle, making the app installable on mobile devices.

## Environment Variables

| Variable | Description |
|----------|-------------|
| PORT | Server port (default 3000) |
| MONGODB_URI | MongoDB Atlas connection string |
| JWT_SECRET | Secret key for signing JWT tokens |
| ANTHROPIC_API_KEY | Anthropic Claude API key |