# College Dorm Decorator

An AI-powered room decorator web app for college students. Chat with an AI assistant to describe your dorm room vibe and budget — it instantly generates a moodboard of real products styled to match.

## Tech Stack

- **Frontend & Backend**: Next.js 16 (App Router, Turbopack)
- **Styling**: Tailwind CSS
- **AI**: OpenAI API (GPT-4o-mini) — chat, room info extraction, refinements
- **Products**: Etsy API (falls back to curated seed products if no key)
- **Auth & Database**: Supabase (optional — falls back to localStorage)
- **Deployment**: Vercel

## Features

- **AI Chat Assistant**: Conversational UI that collects room type, dimensions, theme, colors, and budget
- **Smart Moodboard**: Auto-generates a product grid based on your preferences
- **Live Refinements**: Refine on the fly — "more plants", "make it more pastel", "reduce cost"
- **Layout View**: Drag-and-drop room layout planner
- **Save & Share Boards**: Save multiple boards, reload them, and share with roommates
- **Roommate Sharing**: Share boards via link with Supabase auth
- **Budget Tracker**: Tracks total cost with budget alerts
- **Inspiration Gallery**: Browse curated room inspiration photos by style tag
- **Etsy Integration**: Real product listings with prices, shop names, and direct links

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the project root:

```env
# Required for AI features
OPENAI_API_KEY=sk-...

# Optional: real Etsy products (falls back to seed data if not set)
ETSY_API_KEY=...

# Optional: save boards + auth (falls back to localStorage if not set)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Optional: Unsplash images
UNSPLASH_ACCESS_KEY=...
```

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment (Vercel)

1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add all environment variables under **Settings → Environment Variables**
4. Deploy

## Project Structure

```
src/
  app/
    api/
      chat/          # AI chat endpoint
      recommend/     # Product recommendation engine
      extract-room-info/  # AI room info extractor
      etsy-products/ # Etsy API + seed product fallback
      boards/        # Supabase board CRUD
  components/
    EtsyProductsSection   # Product grid
    SavedBoardsSidebar    # Board management
    ShareBoardModal       # Roommate sharing
    AuthModal             # Supabase auth
  data/
    products.json         # Curated seed products
    inspiration-tags.json # Style tags for inspiration gallery
```
