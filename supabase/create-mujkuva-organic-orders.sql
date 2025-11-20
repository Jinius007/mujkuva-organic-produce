-- Create mujkuva_organic_orders table
-- Run this in your Supabase SQL Editor
-- This creates a new table for storing all orders

-- =====================================================
-- CREATE MUJKUVA_ORGANIC_ORDERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.mujkuva_organic_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL, -- Unique order number for tracking
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  customer_address TEXT NOT NULL,
  quantity NUMERIC NOT NULL, -- Quantity in kg (supports decimals)
  weight_kg NUMERIC NOT NULL, -- Total weight in kg
  unit_price NUMERIC NOT NULL, -- Price per kg
  total_price NUMERIC NOT NULL, -- Total price for this order item
  order_date DATE NOT NULL DEFAULT CURRENT_DATE, -- Date when order was placed
  delivery_date DATE, -- Expected delivery date
  status TEXT NOT NULL DEFAULT 'pending', -- pending, confirmed, processing, shipped, delivered, cancelled
  payment_status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, failed, refunded
  transaction_id TEXT, -- Payment transaction ID
  payment_screenshot_path TEXT, -- Path to payment screenshot in storage
  payment_method TEXT, -- UPI, Bank Transfer, Cash, etc.
  notes TEXT, -- Additional notes or special instructions
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =====================================================
-- CREATE INDEXES FOR BETTER PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_mujkuva_orders_order_number ON public.mujkuva_organic_orders(order_number);
CREATE INDEX IF NOT EXISTS idx_mujkuva_orders_customer_phone ON public.mujkuva_organic_orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_mujkuva_orders_order_date ON public.mujkuva_organic_orders(order_date);
CREATE INDEX IF NOT EXISTS idx_mujkuva_orders_status ON public.mujkuva_organic_orders(status);
CREATE INDEX IF NOT EXISTS idx_mujkuva_orders_payment_status ON public.mujkuva_organic_orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_mujkuva_orders_product_id ON public.mujkuva_organic_orders(product_id);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.mujkuva_organic_orders ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CREATE RLS POLICIES
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all to insert mujkuva_organic_orders" ON public.mujkuva_organic_orders;
DROP POLICY IF EXISTS "Allow all to view mujkuva_organic_orders" ON public.mujkuva_organic_orders;
DROP POLICY IF EXISTS "Allow all to update mujkuva_organic_orders" ON public.mujkuva_organic_orders;
DROP POLICY IF EXISTS "Allow all to delete mujkuva_organic_orders" ON public.mujkuva_organic_orders;

-- Allow all to insert orders
CREATE POLICY "Allow all to insert mujkuva_organic_orders" 
ON public.mujkuva_organic_orders 
FOR INSERT 
WITH CHECK (true);

-- Allow all to view orders
CREATE POLICY "Allow all to view mujkuva_organic_orders" 
ON public.mujkuva_organic_orders 
FOR SELECT 
USING (true);

-- Allow all to update orders
CREATE POLICY "Allow all to update mujkuva_organic_orders" 
ON public.mujkuva_organic_orders 
FOR UPDATE 
USING (true);

-- Allow all to delete orders (for admin purposes)
CREATE POLICY "Allow all to delete mujkuva_organic_orders" 
ON public.mujkuva_organic_orders 
FOR DELETE 
USING (true);

-- =====================================================
-- CREATE FUNCTION TO GENERATE ORDER NUMBER
-- =====================================================

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  order_num TEXT;
  date_prefix TEXT;
  seq_num INTEGER;
BEGIN
  -- Format: MO-YYYYMMDD-XXXX (e.g., MO-20250128-0001)
  date_prefix := TO_CHAR(CURRENT_DATE, 'YYYYMMDD');
  
  -- Get the next sequence number for today
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 12) AS INTEGER)), 0) + 1
  INTO seq_num
  FROM public.mujkuva_organic_orders
  WHERE order_number LIKE 'MO-' || date_prefix || '-%';
  
  -- Format with leading zeros (4 digits)
  order_num := 'MO-' || date_prefix || '-' || LPAD(seq_num::TEXT, 4, '0');
  
  RETURN order_num;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- CREATE TRIGGER TO AUTO-GENERATE ORDER NUMBER
-- =====================================================

CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_mujkuva_order_number ON public.mujkuva_organic_orders;
CREATE TRIGGER set_mujkuva_order_number
BEFORE INSERT ON public.mujkuva_organic_orders
FOR EACH ROW
EXECUTE FUNCTION set_order_number();

-- =====================================================
-- CREATE FUNCTION TO UPDATE TIMESTAMPS
-- =====================================================

CREATE OR REPLACE FUNCTION update_mujkuva_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- CREATE TRIGGER FOR AUTOMATIC TIMESTAMP UPDATES
-- =====================================================

DROP TRIGGER IF EXISTS update_mujkuva_organic_orders_updated_at ON public.mujkuva_organic_orders;
CREATE TRIGGER update_mujkuva_organic_orders_updated_at
BEFORE UPDATE ON public.mujkuva_organic_orders
FOR EACH ROW
EXECUTE FUNCTION update_mujkuva_orders_updated_at();

-- =====================================================
-- ADD COMMENTS
-- =====================================================

COMMENT ON TABLE public.mujkuva_organic_orders IS 'Stores all orders for Mujkuva Organic Cooperative';
COMMENT ON COLUMN public.mujkuva_organic_orders.order_number IS 'Unique order number format: MO-YYYYMMDD-XXXX';
COMMENT ON COLUMN public.mujkuva_organic_orders.quantity IS 'Quantity in kg (supports decimal values like 0.25, 0.5, etc.)';
COMMENT ON COLUMN public.mujkuva_organic_orders.status IS 'Order status: pending, confirmed, processing, shipped, delivered, cancelled';
COMMENT ON COLUMN public.mujkuva_organic_orders.payment_status IS 'Payment status: pending, paid, failed, refunded';

-- =====================================================
-- VERIFY TABLE CREATION
-- =====================================================

-- Check if table exists
SELECT 
  'mujkuva_organic_orders table' as item,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'mujkuva_organic_orders') 
       THEN '✅ CREATED' 
       ELSE '❌ FAILED' 
  END as status;

-- Show table structure
SELECT 
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'mujkuva_organic_orders'
ORDER BY ordinal_position;

-- =====================================================
-- TEST INSERT
-- =====================================================

DO $$
DECLARE
  test_id UUID;
  test_order_num TEXT;
BEGIN
  test_id := gen_random_uuid();
  
  -- Test insert with auto-generated order number
  INSERT INTO public.mujkuva_organic_orders (
    id, product_id, product_name, customer_name, customer_phone,
    customer_address, quantity, weight_kg, unit_price, total_price,
    status, payment_status
  ) VALUES (
    test_id,
    'test-product',
    'Test Product',
    'Test Customer',
    '1234567890',
    'Test Address',
    0.25,  -- Decimal quantity
    0.25,  -- Weight in kg
    100.0, -- Unit price
    25.0,  -- Total price
    'test',
    'pending'
  ) RETURNING order_number INTO test_order_num;
  
  RAISE NOTICE '✅ Test insert successful!';
  RAISE NOTICE '   Order Number: %', test_order_num;
  RAISE NOTICE '   Order ID: %', test_id;
  
  -- Verify the record exists before cleanup
  PERFORM 1 FROM public.mujkuva_organic_orders WHERE id = test_id;
  IF FOUND THEN
    RAISE NOTICE '✅ Record verified in database';
  END IF;
  
  -- Clean up test data
  DELETE FROM public.mujkuva_organic_orders WHERE id = test_id;
  RAISE NOTICE '✅ Test data cleaned up';
END $$;

SELECT '🎉 mujkuva_organic_orders table created successfully!' as message;
SELECT '   - Table: mujkuva_organic_orders' as info;
SELECT '   - Auto-generated order numbers: MO-YYYYMMDD-XXXX' as info;
SELECT '   - Supports decimal quantities' as info;
SELECT '   - RLS policies enabled' as info;

