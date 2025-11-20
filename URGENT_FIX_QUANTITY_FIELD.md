# 🚨 URGENT: Fix Quantity Field Type

## The Problem

The error shows:
```
Error code: 22P02
Error message: invalid input syntax for type integer: "0.25"
```

This means the `quantity` field in the `order_slots` table is still `INTEGER`, but the website is trying to insert decimal values (0.25, 0.5, etc.).

## The Solution

You **MUST** run the database fix script to change `quantity` from INTEGER to NUMERIC.

### Step-by-Step Instructions:

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard/project/zjjjajkzavxytdexkbrj

2. **Click "SQL Editor"** (left sidebar)

3. **Click "New Query"**

4. **Open the file**: `supabase/fix-order-slots-complete.sql`

5. **Copy the ENTIRE script** (all 122 lines)

6. **Paste it into the SQL Editor**

7. **Click "Run"** (or press Ctrl+Enter)

8. **Wait for success message**: You should see:
   - `✅ Changed quantity from INTEGER to NUMERIC`
   - `✅ Test insert successful!`
   - `✅ Order Slots Table Fix Complete!`

## What the Script Does

1. ✅ Changes `quantity` field from INTEGER to NUMERIC
2. ✅ Verifies and recreates RLS policies
3. ✅ Tests that decimal quantities work (0.25, 0.5, etc.)
4. ✅ Shows you a summary

## After Running the Script

1. **Refresh your website**
2. **Try placing an order again**
3. **The error should be gone!**

## Quick Test

After running the fix, you can test in Supabase SQL Editor:

```sql
-- This should work after the fix
INSERT INTO public.order_slots (
  product_id, product_name, customer_name, customer_phone,
  customer_address, quantity, weight_kg, total_price,
  order_date, status
) VALUES (
  'test', 'Test', 'Test Customer', '1234567890',
  'Test Address', 0.25, 0.25, 25.0,
  CURRENT_DATE, 'test'
);
```

If this works, the fix is successful! Then delete the test record.

---

**⚠️ IMPORTANT**: You cannot place orders until this fix is applied. The website requires decimal quantities (0.25 kg minimum order), but the database currently only accepts whole numbers.

