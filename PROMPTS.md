# Prompts สำหรับ Claude Code (ใช้ทีละข้อ ทดสอบผ่านก่อนค่อยไปข้อถัดไป)

## 0. วางแผน (ใช้ plan mode: กด Shift+Tab จนขึ้น plan mode)
Read CLAUDE.md. Propose the folder structure and the step-by-step build plan for this project.
Do not write code yet. List anything in CLAUDE.md that is unclear.

## 1. สร้างโปรเจกต์
Scaffold a React + Vite + TypeScript + Tailwind app for LINE LIFF, plus a `supabase/` folder.
Add `.env.example` with VITE_LIFF_ID, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY. Add .gitignore.

## 2. Database
Write the first Supabase migration for all tables in CLAUDE.md with foreign keys, enums for
role/status, indexes, and seed data: categories (เนื้อ, เครื่องใน, ขา/กระดูก), products
(สามชั้น, เนื้อแดง, สันคอ, สะโพก, ขาหน้า, ขาหลัง, ตับ, ม้าม, เลือด, กระเพาะ, หัวใจ,
ไส้เล็ก, ไส้ใหญ่), cut_options (หั่นแกง, สไลด์บาง, บด, หั่นเต๋า, ไม่หั่น), and delivery_fee_rules.
Then write RLS policies for admin / seller / buyer. Explain each policy briefly.

## 3. LINE Login + role
Implement LIFF login. Create a Supabase Edge Function that verifies the LINE ID token,
upserts the user (default role buyer), and returns a session. Route users to
buyer / seller / admin pages by role.

## 4. หน้าสินค้า + ตะกร้า (buyer)
Product list grouped by category, hide or disable out-of-stock items. Cart with qty
(step 0.5 for kg), cut option dropdown, cut note. Mobile-first, big buttons, Thai labels.

## 5. จัดการสินค้า (seller)
CRUD products with image upload to `products` bucket, edit price, toggle "หมด" with one tap.

## 6. ที่อยู่ + ค่าส่ง
Leaflet map to pin location (use phone GPS as start). Haversine distance from shop_settings,
fee from delivery_fee_rules, block if beyond max_delivery_km. Pickup option = no fee.
Write unit tests for the distance and fee functions.

## 7. Checkout + จ่ายเงิน
Create order with price snapshot. Cash or transfer. Transfer: PromptPay QR with exact amount,
upload slip to `slips` bucket, payment status pending_verify. Seller page to view slip and verify.

## 8. ออเดอร์ฝั่งคนขาย + แจ้งเตือน LINE
Seller order board by status, set actual_qty for weighed items, change status.
Edge Function to push LINE messages on key status changes only.

## 9. รูปยืนยันส่ง + ฝากซื้อ
Delivery photo upload (+ GPS) and push the photo to buyer. Errand items in checkout
(store, description, est price) and seller sets actual price + receipt photo.

## 10. สถิติ
SQL views + dashboard: today/week/month sales, top products, pending orders, pending slips,
sales by seller (admin only).

## ทุกครั้งหลังทำเสร็จ
Run the app/tests, fix errors, then summarize what changed and what I need to test by hand.
