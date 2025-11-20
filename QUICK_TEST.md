# 🧪 Quick Database Test Guide

## Step 1: Fix the Database (REQUIRED FIRST)

Before testing, you MUST fix the database schema:

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard/project/zjjjajkzavxytdexkbrj
2. **Click "SQL Editor"** (left sidebar)
3. **Click "New Query"**
4. **Open the file**: `supabase/fix-order-slots-complete.sql`
5. **Copy the entire script** and paste it into the SQL Editor
6. **Click "Run"** (or press Ctrl+Enter)
7. **Wait for success message**: You should see "✅ Order Slots Table Fix Complete!"

## Step 2: Test the Database

### Option A: Browser Console Test (Recommended)

1. **Open your website** in a browser
2. **Open Developer Console**:
   - Press `F12` OR
   - Right-click → "Inspect" → "Console" tab
3. **Type this command**:
   ```javascript
   testOrderSlots()
   ```
4. **Press Enter**
5. **Watch the results** - You should see:
   ```
   🎉 ALL TESTS PASSED!
   ✅ order_slots table is working correctly
   ✅ Decimal quantities are supported
   ```

### Option B: Direct SQL Test

1. **Go to Supabase SQL Editor**
2. **Run this test query**:
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
3. **If successful**: You'll see the inserted row
4. **Clean up**: Delete the test row after verifying

## Step 3: Test the Full Order Flow

1. **Add items to cart** on your website
2. **Go to cart** and fill in delivery details
3. **Click "Make Payment"**
4. **Check browser console** for:
   - `✅ Successfully created reservation for [product]`
   - `✅ Reservation X created with ID: [uuid]`
5. **On checkout page**:
   - Enter transaction ID
   - Upload payment screenshot
   - Click "Confirm Payment & Place Order"
6. **Check console** for:
   - `✅ Successfully updated reservation...`
   - `✅ Verification complete...`
7. **Check Supabase Dashboard**:
   - Go to **Table Editor** → `order_slots`
   - You should see orders with status `'confirmed'`

## Troubleshooting

### If testOrderSlots() shows errors:

**Error: "quantity field is still INTEGER type!"**
- ✅ Solution: Run the fix script (Step 1)

**Error: "Table does not exist"**
- ✅ Solution: Run the setup script: `supabase/setup-complete-database.sql`

**Error: "Permission denied"**
- ✅ Solution: Check RLS policies in Supabase Dashboard

### If orders still don't appear:

1. **Check browser console** for detailed error messages
2. **Check Supabase Logs**: Dashboard → Logs → Postgres Logs
3. **Verify RLS policies**: Dashboard → Authentication → Policies

## Expected Console Output (Success)

```
🧪 Testing order_slots table functionality...

1️⃣ Testing table structure...
✅ Table exists and is accessible

2️⃣ Testing quantity field (decimal support)...
   Attempting to insert test order with decimal quantity (0.25)...
✅ Insert successful with decimal quantity!

3️⃣ Verifying inserted data...
✅ Data verified: {id: "...", quantity: 0.25, ...}

4️⃣ Testing update functionality...
✅ Update successful

5️⃣ Testing various decimal quantities...
✅ Quantity 0.25 inserted successfully
✅ Quantity 0.5 inserted successfully
✅ Quantity 1.0 inserted successfully
✅ Quantity 1.5 inserted successfully
✅ Quantity 2.25 inserted successfully

6️⃣ Cleaning up test data...
✅ Test data cleaned up

==================================================
🎉 ALL TESTS PASSED!
==================================================
```

