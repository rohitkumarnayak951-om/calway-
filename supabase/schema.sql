-- ==============================================================================
-- CALWAY SUPABASE DATABASE SCHEMA
-- Execute this script in your Supabase Project SQL Editor (supabase.com/dashboard)
-- ==============================================================================

-- 1. EXTENSIONS
create extension if not exists "pgcrypto";

-- 2. CATEGORIES TABLE
create table if not exists public.categories (
  id text primary key,
  name text not null,
  slug text unique not null,
  icon_url text,
  display_order integer default 0,
  created_at timestamptz default now()
);

-- 3. PRODUCTS TABLE
create table if not exists public.products (
  id text primary key,
  category_id text references public.categories(id) on delete set null,
  name text not null,
  slug text not null,
  bengali_name text,
  description text,
  price numeric not null,
  discounted_price numeric,
  unit text default '500g',
  image_url text,
  is_available boolean default true,
  is_featured boolean default false,
  stock_quantity integer default 100,
  mandi_source text,
  arrival_status text,
  rating numeric default 4.8,
  reviews_count integer default 120,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. CUSTOMERS TABLE (Linked to Supabase auth.users)
create table if not exists public.customers (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone_number text,
  email text,
  created_at timestamptz default now()
);

-- 5. ADDRESSES TABLE
create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  label text default 'Home',
  full_address text not null,
  area text,
  city text default 'Kolkata',
  pincode text,
  is_default boolean default false,
  created_at timestamptz default now()
);

-- 6. ORDERS TABLE
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_id uuid not null references public.customers(id) on delete cascade,
  address_id uuid references public.addresses(id) on delete set null,
  status text default 'pending' check (status in ('pending', 'confirmed', 'out_for_delivery', 'delivered', 'cancelled')),
  delivery_slot text,
  subtotal numeric not null,
  discount numeric default 0,
  total numeric not null,
  payment_status text default 'pending',
  delivery_address_snapshot jsonb,
  created_at timestamptz default now()
);

-- 7. ORDER ITEMS TABLE
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text references public.products(id) on delete set null,
  product_name text,
  product_image text,
  quantity integer not null default 1,
  price_at_purchase numeric not null,
  unit text,
  created_at timestamptz default now()
);

-- 8. SUBSCRIPTIONS TABLE
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  plan_type text not null check (plan_type in ('daily', 'alternate', 'weekly')),
  status text default 'active' check (status in ('active', 'paused', 'cancelled')),
  start_date date default current_date,
  next_delivery_date date,
  created_at timestamptz default now()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.customers enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.subscriptions enable row level security;

-- Categories & Products (Publicly readable by everyone, including guests)
drop policy if exists "Categories are publicly readable" on public.categories;
create policy "Categories are publicly readable" on public.categories
  for select using (true);

drop policy if exists "Products are publicly readable" on public.products;
create policy "Products are publicly readable" on public.products
  for select using (true);

-- Customers (Users can only read and edit their own customer row)
drop policy if exists "Customers can view own profile" on public.customers;
create policy "Customers can view own profile" on public.customers
  for select using (auth.uid() = id);

drop policy if exists "Customers can insert own profile" on public.customers;
create policy "Customers can insert own profile" on public.customers
  for insert with check (auth.uid() = id);

drop policy if exists "Customers can update own profile" on public.customers;
create policy "Customers can update own profile" on public.customers
  for update using (auth.uid() = id);

-- Addresses (Users can manage only their own addresses)
drop policy if exists "Users can view own addresses" on public.addresses;
create policy "Users can view own addresses" on public.addresses
  for select using (auth.uid() = customer_id);

drop policy if exists "Users can insert own addresses" on public.addresses;
create policy "Users can insert own addresses" on public.addresses
  for insert with check (auth.uid() = customer_id);

drop policy if exists "Users can update own addresses" on public.addresses;
create policy "Users can update own addresses" on public.addresses
  for update using (auth.uid() = customer_id);

drop policy if exists "Users can delete own addresses" on public.addresses;
create policy "Users can delete own addresses" on public.addresses
  for delete using (auth.uid() = customer_id);

-- Orders (Users can view and place only their own orders)
drop policy if exists "Users can view own orders" on public.orders;
create policy "Users can view own orders" on public.orders
  for select using (auth.uid() = customer_id);

drop policy if exists "Users can insert own orders" on public.orders;
create policy "Users can insert own orders" on public.orders
  for insert with check (auth.uid() = customer_id);

-- Order Items (Users can view and insert items for their own orders)
drop policy if exists "Users can view own order items" on public.order_items;
create policy "Users can view own order items" on public.order_items
  for select using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.customer_id = auth.uid()
    )
  );

drop policy if exists "Users can insert own order items" on public.order_items;
create policy "Users can insert own order items" on public.order_items
  for insert with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.customer_id = auth.uid()
    )
  );

-- Subscriptions (Users can manage their own subscriptions)
drop policy if exists "Users can view own subscriptions" on public.subscriptions;
create policy "Users can view own subscriptions" on public.subscriptions
  for select using (auth.uid() = customer_id);

drop policy if exists "Users can insert own subscriptions" on public.subscriptions;
create policy "Users can insert own subscriptions" on public.subscriptions
  for insert with check (auth.uid() = customer_id);

drop policy if exists "Users can update own subscriptions" on public.subscriptions;
create policy "Users can update own subscriptions" on public.subscriptions
  for update using (auth.uid() = customer_id);

-- ==============================================================================
-- FUNCTIONS & TRIGGERS
-- ==============================================================================

-- Decrement product stock helper
create or replace function public.decrement_product_stock(p_product_id text, p_qty integer)
returns void as $$
begin
  update public.products
  set stock_quantity = greatest(0, stock_quantity - p_qty),
      updated_at = now()
  where id = p_product_id;
end;
$$ language plpgsql security definer;

-- Trigger: Automatically create public.customers row when a user signs up in auth.users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.customers (id, full_name, phone_number, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Kolkata Customer'),
    coalesce(new.phone, new.raw_user_meta_data->>'phone_number', ''),
    new.email
  )
  on conflict (id) do update
  set full_name = coalesce(excluded.full_name, customers.full_name),
      phone_number = coalesce(excluded.phone_number, customers.phone_number),
      email = coalesce(excluded.email, customers.email);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
