-- Run this in your Supabase SQL editor to enable board persistence with user accounts and sharing

-- Boards table
create table if not exists boards (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  room_info jsonb default '{}',
  products jsonb default '[]',
  total_cost numeric default 0,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Board shares table (must exist before boards policies that reference it)
create table if not exists board_shares (
  id uuid default gen_random_uuid() primary key,
  board_id uuid references boards(id) on delete cascade not null,
  shared_with_email text not null,
  shared_by_user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique (board_id, shared_with_email)
);

-- Enable RLS
alter table boards enable row level security;
alter table board_shares enable row level security;

-- Boards policies
create policy "Users can manage their own boards"
  on boards for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can view shared boards"
  on boards for select
  using (
    exists (
      select 1 from board_shares
      where board_shares.board_id = boards.id
        and board_shares.shared_with_email = auth.jwt() ->> 'email'
    )
  );

-- Board shares policies
create policy "Board owners can manage shares"
  on board_shares for all
  using (auth.uid() = shared_by_user_id)
  with check (auth.uid() = shared_by_user_id);

create policy "Users can view shares for their email"
  on board_shares for select
  using (shared_with_email = auth.jwt() ->> 'email');

-- Helper: auto-update updated_at on boards
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger boards_updated_at
  before update on boards
  for each row execute procedure update_updated_at();

