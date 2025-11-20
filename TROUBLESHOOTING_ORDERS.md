# 🔍 Troubleshooting: Orders Not Appearing in mujkuva_organic_orders

## Quick Checklist

### ✅ Step 1: Verify Table Exists

1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/zjjjajkzavxytdexkbrj
2. Click **"Table Editor"** (left sidebar)
3. Look for **`mujkuva_organic_orders`** table
4. If it doesn't exist, you need to create it first!

**If table doesn't exist:**
- Go to **SQL Editor**
- Run the script: `supabase/create-mujkuva-organic-orders.sql`
- Wait for success message

### ✅ Step 2: Check Browser Console

When you click "Make Payment" in the cart, check the browser console (F12) for:

**Expected logs:**
```
💾 Saving orders to mujkuva_organic_orders table with RESERVED status...
📝 Saving RESERVED order for [Product Name] to mujkuva_organic_orders: {...}
✅ Successfully saved RESERVED order for [Product Name]: {...}
   Order ID: [uuid]
   Order Number: MO-YYYYMMDD-XXXX
   Status: reserved
✅ X order(s) saved to mujkuva_organic_orders with RESERVED status
```

**If you see errors:**
- `❌ Failed to save RESERVED order` - Check the error message
- `⚠️ LIKELY ISSUE: mujkuva_organic_orders table does not exist!` - Run the SQL script
- `Error code: 42P01` - Table doesn't exist
- `Error code: 42501` - Permission/RLS policy issue

### ✅ Step 3: Verify in Supabase Dashboard

1. Go to **Table Editor** → `mujkuva_organic_orders`
2. You should see orders with:
   - `status: 'reserved'`
   - `payment_status: 'pending'`
   - `order_number: MO-YYYYMMDD-XXXX` (auto-generated)

### ✅ Step 4: Check RLS Policies

1. Go to **Authentication** → **Policies**
2. Find `mujkuva_organic_orders` table
3. Verify these policies exist:
   - "Allow all to insert mujkuva_organic_orders"
   - "Allow all to view mujkuva_organic_orders"
   - "Allow all to update mujkuva_organic_orders"

## Common Issues & Solutions

### Issue 1: Table Doesn't Exist
**Error:** `relation "mujkuva_organic_orders" does not exist`

**Solution:**
1. Run `supabase/create-mujkuva-organic-orders.sql` in SQL Editor
2. Verify table was created
3. Try again

### Issue 2: RLS Policy Blocking
**Error:** `new row violates row-level security policy`

**Solution:**
1. Go to **Authentication** → **Policies**
2. Check if policies exist for `mujkuva_organic_orders`
3. If not, run the SQL script again (it creates policies)

### Issue 3: Order Number Trigger Not Working
**Error:** `null value in column "order_number" violates not-null constraint`

**Solution:**
1. Check if the trigger `set_mujkuva_order_number` exists
2. Run the SQL script again to recreate the trigger

### Issue 4: Quantity Type Mismatch
**Error:** `invalid input syntax for type integer`

**Solution:**
- This should be fixed now (we're sending units, not decimals)
- If still happening, check the table schema

## Testing

### Test 1: Manual Insert Test
Run this in Supabase SQL Editor:

```sql
INSERT INTO public.mujkuva_organic_orders (
  product_id, product_name, customer_name, customer_phone,
  customer_address, quantity, weight_kg, unit_price, total_price,
  status, payment_status
) VALUES (
  'test-product', 'Test Product', 'Test Customer', '1234567890',
  'Test Address', 1, 0.25, 100.0, 25.0,
  'reserved', 'pending'
) RETURNING *;
```

If this works, the table is set up correctly.

### Test 2: Check Console Logs
1. Open browser console (F12)
2. Click "Make Payment" in cart
3. Look for the logs mentioned above
4. Share any error messages you see

## What Should Happen

1. **User clicks "Make Payment"**:
   - ✅ Orders saved to `order_slots` with status `'reserved'`
   - ✅ Orders saved to `mujkuva_organic_orders` with status `'reserved'`
   - ✅ Orders visible in Supabase Dashboard

2. **User confirms payment**:
   - ✅ Orders in `order_slots` updated to `'confirmed'`
   - ✅ Orders in `mujkuva_organic_orders` updated to `'confirmed'`
   - ✅ Payment status updated to `'paid'`

## Still Not Working?

Please share:
1. Browser console error messages
2. Supabase Dashboard → Logs → Postgres Logs (any errors)
3. Whether the `mujkuva_organic_orders` table exists
4. Any error codes you see

