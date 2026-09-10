import fs from 'fs';

const categories = JSON.parse(fs.readFileSync('./src/data/categories.json', 'utf-8'));
const products = JSON.parse(fs.readFileSync('./src/data/products.json', 'utf-8'));

let sql = `-- ==============================================================================
-- CALWAY SUPABASE SEED DATA (26 Kolkata Mandi Products & Categories)
-- Run this script in Supabase SQL Editor after running schema.sql
-- ==============================================================================

-- 1. SEED CATEGORIES
INSERT INTO public.categories (id, name, slug, icon_url, display_order)
VALUES
`;

const catValues = categories.map((c, i) => {
  const icon = c.icon.replace(/'/g, "''");
  const name = c.name.replace(/'/g, "''");
  return `  ('${c.slug}', '${name}', '${c.slug}', '${icon}', ${i + 1})`;
}).join(',\n');

sql += catValues + `
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name, icon_url = EXCLUDED.icon_url, display_order = EXCLUDED.display_order;

-- 2. SEED PRODUCTS
INSERT INTO public.products (
  id, category_id, name, slug, bengali_name, description,
  price, discounted_price, unit, image_url, is_available, is_featured,
  stock_quantity, mandi_source, arrival_status, rating, reviews_count
)
VALUES
`;

const prodValues = products.map(p => {
  const esc = (s) => (s ? s.replace(/'/g, "''") : '');
  const id = p.id;
  const cat = p.category;
  const name = esc(p.name);
  const slug = p.id.replace('prod-', '');
  const bengali = esc(p.bengaliName || '');
  const desc = esc(p.description || '');
  const price = p.price;
  const origPrice = p.originalPrice || p.price;
  const unit = esc(p.unitWeight || '500g');
  const img = esc(p.image);
  const avail = p.inStock ? 'true' : 'false';
  const feat = p.isMandiSpecial ? 'true' : 'false';
  const stock = 100;
  const source = esc(p.mandiSource || 'Koley Mandi, 04:15 AM');
  const status = esc(p.arrivalStatus || 'Arrived at dawn');
  const rating = p.rating || 4.8;
  const reviews = p.reviewsCount || 100;

  return `  ('${id}', '${cat}', '${name}', '${slug}', '${bengali}', '${desc}', ${price}, ${origPrice}, '${unit}', '${img}', ${avail}, ${feat}, ${stock}, '${source}', '${status}', ${rating}, ${reviews})`;
}).join(',\n');

sql += prodValues + `
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name, price = EXCLUDED.price, discounted_price = EXCLUDED.discounted_price, image_url = EXCLUDED.image_url, stock_quantity = EXCLUDED.stock_quantity;
`;

fs.writeFileSync('./supabase/seed.sql', sql);
console.log(`Successfully generated supabase/seed.sql with ${products.length} products and ${categories.length} categories!`);
