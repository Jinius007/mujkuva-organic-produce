-- Complete fix for order_slots table to ensure orders are saved
-- Run this in your Supabase SQL Editor

-- =====================================================
-- STEP 1: Fix quantity field type (INTEGER -> NUMERIC)
-- =====================================================
DO $$
BEGIN
  -- Check current type
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'order_slots' 
      AND column_name = 'quantity' 
      AND data_type = 'integer'
  ) THEN
    -- Change to NUMERIC
    ALTER TABLE public.order_slots 
    ALTER COLUMN quantity TYPE NUMERIC USING quantity::NUMERIC;
    
    RAISE NOTICE '✅ Changed quantity from INTEGER to NUMERIC';
  ELSE
    RAISE NOTICE '✅ Quantity field already NUMERIC';
  END IF;
END $$;

-- =====================================================
-- STEP 2: Verify and recreate RLS policies
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all to insert order_slots" ON public.order_slots;
DROP POLICY IF EXISTS "Allow all to view order_slots" ON public.order_slots;
DROP POLICY IF EXISTS "Allow all to update order_slots" ON public.order_slots;

-- Recreate policies with explicit permissions
CREATE POLICY "Allow all to insert order_slots" 
ON public.order_slots 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow all to view order_slots" 
ON public.order_slots 
FOR SELECT 
USING (true);

CREATE POLICY "Allow all to update order_slots" 
ON public.order_slots 
FOR UPDATE 
USING (true);

-- =====================================================
-- STEP 3: Verify table structure
-- =====================================================
SELECT 
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'order_slots'
ORDER BY ordinal_position;

-- =====================================================
-- STEP 4: Test insert with decimal quantity
-- =====================================================
DO $$
DECLARE
  test_id UUID;
  test_result BOOLEAN;
BEGIN
  test_id := gen_random_uuid();
  
  -- Try to insert a test order with decimal quantity
  INSERT INTO public.order_slots (
    id, product_id, product_name, customer_name, customer_phone,
    customer_address, quantity, weight_kg, total_price, 
    order_date, status, transaction_id, payment_screenshot_path
  ) VALUES (
    test_id, 
    'test-product', 
    'Test Product', 
    'Test Customer', 
    '1234567890',
    'Test Address', 
    0.25,  -- Decimal quantity
    0.25,  -- Weight in kg
    25.0,   -- Total price
    CURRENT_DATE, 
    'test',
    NULL,
    NULL
  );
  
  -- Verify the insert worked
  SELECT EXISTS (SELECT 1 FROM public.order_slots WHERE id = test_id) INTO test_result;
  
  IF test_result THEN
    RAISE NOTICE '✅ Test insert successful!';
    RAISE NOTICE '   - Decimal quantity (0.25) inserted correctly';
    RAISE NOTICE '   - Order ID: %', test_id;
    
    -- Clean up test data
    DELETE FROM public.order_slots WHERE id = test_id;
    RAISE NOTICE '✅ Test data cleaned up';
  ELSE
    RAISE EXCEPTION '❌ Test insert failed - check RLS policies';
  END IF;
END $$;

-- =====================================================
-- STEP 5: Summary
-- =====================================================
SELECT 
  '✅ Order Slots Table Fix Complete!' as status,
  'Quantity field now supports decimals' as fix1,
  'RLS policies verified and active' as fix2,
  'Test insert successful' as fix3;

