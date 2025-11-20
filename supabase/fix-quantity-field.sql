-- Fix quantity field to allow decimal values
-- Run this in your Supabase SQL Editor to fix the order_slots table
-- This allows storing decimal quantities like 0.25, 0.5, etc.

-- Step 1: Change quantity from INTEGER to NUMERIC
ALTER TABLE public.order_slots 
ALTER COLUMN quantity TYPE NUMERIC USING quantity::NUMERIC;

-- Step 2: Verify the change
SELECT 
  column_name, 
  data_type, 
  numeric_precision,
  numeric_scale
FROM information_schema.columns 
WHERE table_name = 'order_slots' 
  AND column_name = 'quantity';

-- Step 3: Test insert with decimal quantity
DO $$
DECLARE
  test_id UUID;
BEGIN
  test_id := gen_random_uuid();
  
  INSERT INTO public.order_slots (
    id, product_id, product_name, customer_name, customer_phone,
    customer_address, quantity, weight_kg, total_price, 
    order_date, status
  ) VALUES (
    test_id, 'test-product', 'Test Product', 'Test Customer', '1234567890',
    'Test Address', 0.25, 0.25, 25.0,
    CURRENT_DATE, 'test'
  );
  
  -- Verify the insert worked
  IF EXISTS (SELECT 1 FROM public.order_slots WHERE id = test_id) THEN
    RAISE NOTICE '✅ Test insert successful - quantity field now supports decimals';
  ELSE
    RAISE EXCEPTION '❌ Test insert failed';
  END IF;
  
  -- Clean up test data
  DELETE FROM public.order_slots WHERE id = test_id;
  
  RAISE NOTICE '✅ Quantity field fix complete!';
END $$;

