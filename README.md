# AI Room Decorator

A full-stack hackathon web app that helps users decorate a room by chatting with an AI assistant. The app generates a moodboard of products that fit the user's vibe and budget, with real-time updates as they refine their preferences.

## Tech Stack

- **Frontend & Backend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **AI**: OpenAI API (GPT-4o-mini)
- **Database**: Supabase (optional) or localStorage
- **Deployment**: Vercel

## Features

- **Chatbot Panel**: Conversational AI that gathers room dimensions, type, theme, colors, and budget
- **Follow-up Refinements**: "make it more green", "add more plants", "more minimalist", "reduce cost"
- **Moodboard Grid**: Visual grid of decor items (rugs, tables, lamps, plants, wall decor, etc.)
- **Multiple Saved Boards**: Create, save, and reopen past boards
- **Budget Summary**: Total cost tracking with budget alerts

## Getting Started

### 1. Install Dependencies

```bash
cd ai-room-decorator
npm install