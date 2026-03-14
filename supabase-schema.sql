-- Run this in your Supabase SQL editor to enable board persistence

create table if not exists boards (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  room_info jsonb default '{}',
  products jsonb default '[]',
  total_cost numeric default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table boards enable row level security;

-- Allow all operations for hackathon demo (replace with proper auth for production)
create policy "Allow all" on boards for all using (true) with check (true);
