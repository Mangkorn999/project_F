# Moo Shop (ร้านหมูครอบครัว) — Project Context

Family pork shop ordering system. Customers order via LINE (LIFF web app).
Goal: free-tier only, real use by family first. Keep it simple; no over-engineering.

## Stack (all free tier)
- Frontend: React + Vite + TypeScript + Tailwind, runs inside LINE LIFF, deploy on Vercel
- Backend/DB: Supabase (PostgreSQL, Storage for photos, Edge Functions for LINE webhook/push)
- Auth: LINE Login via LIFF -> verify ID token in Edge Function -> map to `users` row
- Map: Leaflet + OpenStreetMap (no paid API). Distance = Haversine (straight line) from shop to customer pin
- PromptPay QR: `promptpay-qr` + `qrcode` libraries
- UI language: Thai. Code, comments, identifiers: English

## Roles
- admin: everything + add/remove sellers + full stats
- seller (family members): add/edit/delete products, set prices, toggle "หมด" (out of stock),
  manage orders, verify slips, upload delivery photos, view stats. CANNOT manage users/roles
- buyer: browse, order, pay, track status, view own history. customer_type = home | shop

## Business rules
- Products priced per kg, per pack, or per piece (`unit`). Seller can change price anytime
- Store `unit_price` in order_items at order time (price snapshot). Never read live price for old orders
- Weighed items: seller can set `actual_qty` before closing; total recalculates
- Cut options per product (หั่นแกง, สไลด์, บด, ไม่หั่น ...) + free-text `cut_note`
- Order now or schedule ahead (`scheduled_at`). Out-of-stock products cannot be added to cart
- Fulfillment: delivery or pickup at shop
- Delivery fee (from `delivery_fee_rules`, editable by admin): 0–2 km = 0, 2–5 km = 5, >5 km = 10;
  beyond `shop_settings.max_delivery_km` = cannot deliver
- Errand (ฝากซื้อ): buyer asks shop to buy items from other stores; `errand_items` with est/actual price
  + receipt photo; fee from `shop_settings.errand_fee` (default 0)
- Payment: cash on delivery or transfer. Transfer -> show PromptPay QR with amount -> buyer uploads slip
  -> seller verifies manually. No automatic slip check for now
- Delivery proof: seller uploads photo (+ optional GPS) when delivered; push photo to buyer on LINE
- LINE push quota is limited on free plan: push only on important status changes

## Statuses
- order: pending -> confirmed -> preparing -> delivering | ready_for_pickup -> completed (or cancelled)
- payment: unpaid -> pending_verify -> paid (cash: unpaid until delivered)

## Tables
users, addresses, categories, products, cut_options, product_cut_options,
orders, order_items, errand_items, payments, delivery_proofs, delivery_fee_rules, shop_settings
Stats via SQL views (sales by day/week/month, top products, pending orders, pending slips, sales by seller)

## Conventions
- Migrations in `supabase/migrations/`, never edit applied migrations; add a new one
- Enable Row Level Security on every table; policies by role
- Storage buckets: `slips` (private), `delivery-proofs` (private), `products` (public)
- Money as numeric(10,2), weight as numeric(10,3)
- Small commits per feature. Ask before deleting data or changing schema of existing tables
