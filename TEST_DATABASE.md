# 🧪 How to Test the Database

## Quick Test (Browser Console)

1. **Open your website** in a browser
2. **Open Developer Console** (F12 or Right-click → Inspect → Console)
3. **Run the test** by typing:
   ```javascript
   testOrderSlots()
   ```
4. **Press Enter** and watch the results

## What the Test Does

The test will:
1. ✅ Check if the `order_slots` table exists and is accessible
2. ✅ Test inserting an order with **decimal quantity** (0.25 kg)
3. ✅ Verify the inserted data can be retrieved
4. ✅ Test updating the order status
5. ✅ Test various decimal quantities (0.25, 0.5, 1.0, 1.5, 2.25)
6. ✅ Clean up test data

## Expected Results

### ✅ If Everything Works:
```
🎉 ALL TESTS PASSED!
✅ order_slots table is working correctly
✅ Decimal quantities are supported
✅ Insert, Update, and Select operations work
```

### ❌ If There's an Issue:

**If you see:**
```
❌ Insert failed: [error about integer/type]
⚠️  LIKELY ISSUE: quantity field is still INTEGER type!
   SOLUTION: Run the fix script: supabase/fix-order-slots-complete.sql
```

**Then you need to:**
1. Go to Supabase Dashboard
2. Open SQL Editor
3. Run the script: `supabase/fix-order-slots-complete.sql`

## Alternative: Test via Supabase SQL Editor

You can also test directly in Supabase:

1. Go to: https://supabase.com/dashboard/project/zjjjajkzavxytdexkbrj/editor
2. Click **SQL Editor**
3. Run this test query:

```sql
-- Test insert with decimal quantity
INSERT INTO public.order_slots (
  id, product_id, product_name, customer_name, customer_phone,
  customer_address, quantity, weight_kg, total_price, 
  order_date, status
) VALUES (
  gen_random_uuid(), 
  'test-product', 
  'Test Product', 
  'Test Customer', 
  '1234567890',
  'Test Address', 
  0.25,  -- Decimal quantity
  0.25,  -- Weight in kg
  25.0,   -- Total price
  CURRENT_DATE, 
  'test'
) RETURNING *;
```

**If this works:** ✅ Database is fixed!
**If this fails:** ❌ You need to run the fix script first.

## Troubleshooting

### Test function not found?
- Make sure you're in development mode
- Refresh the page
- Check browser console for any errors

### Still having issues?
1. Check browser console for detailed error messages
2. Check Supabase Dashboard → Logs → Postgres Logs
3. Verify RLS policies in Supabase Dashboard → Authentication → Policies

