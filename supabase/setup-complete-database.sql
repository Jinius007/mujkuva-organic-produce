-- Complete Supabase Database Setup for Mujkuva Organic
-- Run this in your Supabase SQL Editor

-- =====================================================
-- 1. CREATE ORDER_SLOTS TABLE
-- =====================================================

-- Create a table for tracking orders with date slots and stock management
CREATE TABLE IF NOT EXISTS public.order_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  quantity INTEGER NOT NULL, -- quantity in units
  weight_kg NUMERIC NOT NULL, -- total weight in kg
  total_price NUMERIC NOT NULL,
  order_date DATE NOT NULL, -- the date slot this order is for
  status TEXT NOT NULL DEFAULT 'pending', -- pending, reserved, confirmed, completed
  transaction_id TEXT,
  payment_screenshot_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.order_slots ENABLE ROW LEVEL SECURITY;

-- Create policies for order_slots
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

-- Create index for better performance on date and product queries
CREATE INDEX IF NOT EXISTS idx_order_slots_product_date ON public.order_slots(product_id, order_date);
CREATE INDEX IF NOT EXISTS idx_order_slots_date ON public.order_slots(order_date);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
DROP TRIGGER IF EXISTS update_order_slots_updated_at ON public.order_slots;
CREATE TRIGGER update_order_slots_updated_at
BEFORE UPDATE ON public.order_slots
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- 2. CREATE STORAGE BUCKET
-- =====================================================

-- Create storage bucket for payment screenshots
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'payment_screenshots',
  'payment_screenshots',
  true, -- Make it public for uploads
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

-- =====================================================
-- 3. CREATE STORAGE POLICIES
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public uploads to payment_screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to payment_screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Allow public updates to payment_screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Allow public deletes from payment_screenshots" ON storage.objects;

-- Create comprehensive storage policies for payment_screenshots bucket
-- Allow anyone to upload files to the bucket
CREATE POLICY "Allow public uploads to payment_screenshots"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'payment_screenshots');

-- Allow anyone to view/download files from the bucket
CREATE POLICY "Allow public access to payment_screenshots"
ON storage.objects FOR SELECT
USING (bucket_id = 'payment_screenshots');

-- Allow anyone to update files in the bucket (for potential future use)
CREATE POLICY "Allow public updates to payment_screenshots"
ON storage.objects FOR UPDATE
USING (bucket_id = 'payment_screenshots');

-- Allow anyone to delete files from the bucket (for potential future use)
CREATE POLICY "Allow public deletes from payment_screenshots"
ON storage.objects FOR DELETE
USING (bucket_id = 'payment_screenshots');

-- =====================================================
-- 4. VERIFICATION QUERIES
-- =====================================================

-- Verify the table was created
SELECT 'order_slots table' as item, 
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'order_slots') 
            THEN '✅ CREATED' 
            ELSE '❌ FAILED' 
       END as status;

-- Verify the bucket was created
SELECT 'payment_screenshots bucket' as item,
       CASE WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'payment_screenshots') 
            THEN '✅ CREATED' 
            ELSE '❌ FAILED' 
       END as status;

-- Verify bucket is public
SELECT 'bucket public access' as item,
       CASE WHEN (SELECT public FROM storage.buckets WHERE id = 'payment_screenshots') = true
            THEN '✅ PUBLIC' 
            ELSE '❌ PRIVATE' 
       END as status;

-- Show all tables in public schema
SELECT 'Available tables' as info, string_agg(table_name, ', ') as tables
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Show all storage buckets
SELECT 'Available buckets' as info, string_agg(id, ', ') as buckets
FROM storage.buckets;

-- =====================================================
-- 5. TEST DATA INSERT (OPTIONAL)
-- =====================================================

-- Insert a test order to verify everything works
INSERT INTO public.order_slots (
  product_id, product_name, customer_name, customer_phone, 
  customer_address, quantity, weight_kg, total_price, 
  order_date, status, transaction_id, payment_screenshot_path
) VALUES (
  'test-product', 'Test Product', 'Test Customer', '1234567890',
  'Test Address', 1, 1.0, 100.0,
  CURRENT_DATE, 'test', 'test-transaction', 'test-screenshot.jpg'
);

-- Verify test data was inserted
SELECT 'Test order insert' as item,
       CASE WHEN EXISTS (SELECT 1 FROM public.order_slots WHERE product_id = 'test-product') 
            THEN '✅ SUCCESS' 
            ELSE '❌ FAILED' 
       END as status;

-- Clean up test data
DELETE FROM public.order_slots WHERE product_id = 'test-product';

SELECT '🎉 Database setup complete!' as message;
