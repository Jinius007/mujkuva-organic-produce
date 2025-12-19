-- Create ConsumerWishlist table
-- Run this in your Supabase SQL Editor
-- This creates a table for storing consumer wishlist requests

-- =====================================================
-- CREATE CONSUMER_WISHLIST TABLE
-- =====================================================

-- Use lowercase table name for better compatibility with Supabase
CREATE TABLE IF NOT EXISTS public.consumer_wishlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  produce_name TEXT NOT NULL, -- Name of the produce requested
  language TEXT, -- Language of the produce name (English, Hindi, Gujarati, or Other)
  customer_name TEXT, -- Optional: customer name if provided
  customer_phone TEXT, -- Optional: customer phone if provided
  customer_email TEXT, -- Optional: customer email if provided
  notes TEXT, -- Additional notes or comments
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =====================================================
-- CREATE INDEXES FOR BETTER PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_consumer_wishlist_created_at ON public.consumer_wishlist(created_at);
CREATE INDEX IF NOT EXISTS idx_consumer_wishlist_produce_name ON public.consumer_wishlist(produce_name);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.consumer_wishlist ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CREATE RLS POLICIES
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all to insert consumer_wishlist" ON public.consumer_wishlist;
DROP POLICY IF EXISTS "Allow all to view consumer_wishlist" ON public.consumer_wishlist;
DROP POLICY IF EXISTS "Allow all to update consumer_wishlist" ON public.consumer_wishlist;
DROP POLICY IF EXISTS "Allow all to delete consumer_wishlist" ON public.consumer_wishlist;

-- Allow all to insert wishlist items
CREATE POLICY "Allow all to insert consumer_wishlist" 
ON public.consumer_wishlist 
FOR INSERT 
WITH CHECK (true);

-- Allow all to view wishlist items (for admin purposes)
CREATE POLICY "Allow all to view consumer_wishlist" 
ON public.consumer_wishlist 
FOR SELECT 
USING (true);

-- Allow all to update wishlist items (for admin purposes)
CREATE POLICY "Allow all to update consumer_wishlist" 
ON public.consumer_wishlist 
FOR UPDATE 
USING (true);

-- Allow all to delete wishlist items (for admin purposes)
CREATE POLICY "Allow all to delete consumer_wishlist" 
ON public.consumer_wishlist 
FOR DELETE 
USING (true);

-- =====================================================
-- CREATE FUNCTION TO UPDATE TIMESTAMPS
-- =====================================================

CREATE OR REPLACE FUNCTION update_consumer_wishlist_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- CREATE TRIGGER FOR AUTOMATIC TIMESTAMP UPDATES
-- =====================================================

DROP TRIGGER IF EXISTS update_consumer_wishlist_updated_at ON public.consumer_wishlist;
CREATE TRIGGER update_consumer_wishlist_updated_at
BEFORE UPDATE ON public.consumer_wishlist
FOR EACH ROW
EXECUTE FUNCTION update_consumer_wishlist_updated_at();

-- =====================================================
-- ADD COMMENTS
-- =====================================================

COMMENT ON TABLE public.consumer_wishlist IS 'Stores consumer wishlist requests for future produce';
COMMENT ON COLUMN public.consumer_wishlist.produce_name IS 'Name of the produce requested by consumer';
COMMENT ON COLUMN public.consumer_wishlist.language IS 'Language of the produce name: English, Hindi, Gujarati, or Other';

-- =====================================================
-- VERIFY TABLE CREATION
-- =====================================================

-- Check if table exists
SELECT 
  'consumer_wishlist table' as item,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'consumer_wishlist' AND table_schema = 'public') 
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
WHERE table_name = 'consumer_wishlist' AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT '🎉 consumer_wishlist table created successfully!' as message;
SELECT '   - Table: consumer_wishlist' as info;
SELECT '   - RLS policies enabled' as info;

