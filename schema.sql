-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES TABLE
create table public.profiles (
  id uuid references auth.users not null primary key,
  name text,
  role text check (role in ('admin', 'user')) default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- EVENTS TABLE
create table public.events (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  location text not null,
  date timestamp with time zone not null,
  tech_stack text[],
  created_by uuid references public.profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- REGISTRATIONS TABLE
create table public.registrations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  event_id uuid references public.events(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, event_id)
);

-- RLS POLICIES

-- Profiles:
-- Users can read their own profile.
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Events:
-- Everyone can read events.
-- Only admins can insert/update/delete.
alter table public.events enable row level security;

create policy "Events are viewable by everyone."
  on events for select
  using ( true );

create policy "Admins can insert events."
  on events for insert
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Admins can update events."
  on events for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Admins can delete events."
  on events for delete
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Registrations:
-- Users can see their own registrations.
-- Admins can see all registrations.
-- Users can register themselves.
alter table public.registrations enable row level security;

create policy "Users can view own registrations"
  on registrations for select
  using (
    auth.uid() = user_id
    or
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Users can register themselves"
  on registrations for insert
  with check ( auth.uid() = user_id );

-- TRIGGER FOR NEW USERS
-- Automatically create a profile entry when a new user signs up via Supabase Auth.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, role)
  values (new.id, new.raw_user_meta_data ->> 'name', 'user');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
