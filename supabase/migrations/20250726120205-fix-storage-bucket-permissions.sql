-- Fix storage bucket permissions for payment_screenshots
-- Make the bucket public and add proper RLS policies

-- Update the bucket to be public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'payment_screenshots';

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public uploads to payment_screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to payment_screenshots" ON storage.objects;

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

-- Verify the bucket is now public
SELECT id, name, public, file_size_limit, allowed_mime_types 
FROM storage.buckets 
WHERE id = 'payment_screenshots';
