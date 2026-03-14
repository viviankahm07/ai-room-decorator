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
```

### 2. Environment Variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Add your keys:

- `OPENAI_API_KEY` (required): Get one at [platform.openai.com](https://platform.openai.com/api-keys)
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (optional): For cloud board persistence. Without these, boards save to localStorage.

### 3. Supabase Setup (Optional)

To persist boards in Supabase:

1. Create a project at [supabase.com](https://supabase.com)
2. Run this SQL in the Supabase SQL editor:

```sql
create table boards (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  room_info jsonb default '{}',
  products jsonb default '[]',
  total_cost numeric default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS and allow anonymous inserts (or add auth as needed)
alter table boards enable row level security;

create policy "Allow all for now" on boards for all using (true) with check (true);
```

3. Add your Supabase URL and anon key to `.env.local`

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push the repo to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables: `OPENAI_API_KEY`, optionally Supabase keys
4. Deploy

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/          # OpenAI chat
│   │   ├── recommend/     # Product recommendations
│   │   ├── extract-room-info/  # Parse preferences from chat
│   │   └── boards/        # CRUD for saved boards
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ChatbotPanel.tsx
│   ├── MoodboardGrid.tsx
│   ├── ProductCard.tsx
│   ├── BudgetSummary.tsx
│   └── SavedBoardsSidebar.tsx
├── data/
│   ├── products.json      # Decor product catalog
│   └── inspiration-tags.json  # Theme → product mapping
└── types/
    └── index.ts
```

## License

MIT
