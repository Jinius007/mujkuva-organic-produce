-- Create the missing payment_screenshots storage bucket
-- Run this in your Supabase SQL Editor

-- Create storage bucket for payment screenshots
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'payment_screenshots',
  'payment_screenshots',
  true, -- Make it public for uploads
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
);

-- Create storage policies for payment_screenshots bucket
-- Allow anyone to upload files to the bucket
CREATE POLICY "Allow public uploads to payment_screenshots"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'payment_screenshots');

-- Allow anyone to view/download files from the bucket
CREATE POLICY "Allow public access to payment_screenshots"
ON storage.objects FOR SELECT
USING (bucket_id = 'payment_screenshots');

-- Allow anyone to update files in the bucket
CREATE POLICY "Allow public updates to payment_screenshots"
ON storage.objects FOR UPDATE
USING (bucket_id = 'payment_screenshots');

-- Allow anyone to delete files from the bucket
CREATE POLICY "Allow public deletes from payment_screenshots"
ON storage.objects FOR DELETE
USING (bucket_id = 'payment_screenshots');

-- Verify the bucket was created
SELECT 'payment_screenshots bucket' as item,
       CASE WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'payment_screenshots') 
            THEN '✅ CREATED' 
            ELSE '❌ FAILED' 
       END as status;

-- Show all storage buckets
SELECT 'Available buckets' as info, string_agg(id, ', ') as buckets
FROM storage.buckets;

SELECT '🎉 Storage bucket setup complete!' as message;
