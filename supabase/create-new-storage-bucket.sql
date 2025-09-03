-- Create a new storage bucket called new_payment_proofs
-- Run this in your Supabase SQL Editor

-- Create new storage bucket for payment proofs
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'new_payment_proofs',
  'new_payment_proofs',
  true, -- Make it public for uploads
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
);

-- Create comprehensive storage policies for new_payment_proofs bucket
-- Allow anyone to upload files to the bucket
CREATE POLICY "Allow public uploads to new_payment_proofs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'new_payment_proofs');

-- Allow anyone to view/download files from the bucket
CREATE POLICY "Allow public access to new_payment_proofs"
ON storage.objects FOR SELECT
USING (bucket_id = 'new_payment_proofs');

-- Allow anyone to update files in the bucket
CREATE POLICY "Allow public updates to new_payment_proofs"
ON storage.objects FOR UPDATE
USING (bucket_id = 'new_payment_proofs');

-- Allow anyone to delete files from the bucket
CREATE POLICY "Allow public deletes from new_payment_proofs"
ON storage.objects FOR DELETE
USING (bucket_id = 'new_payment_proofs');

-- Verify the bucket was created
SELECT 'new_payment_proofs bucket' as item,
       CASE WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'new_payment_proofs') 
            THEN '✅ CREATED' 
            ELSE '❌ FAILED' 
       END as status;

-- Show all storage buckets
SELECT 'Available buckets' as info, string_agg(id, ', ') as buckets
FROM storage.buckets;

SELECT '🎉 New storage bucket setup complete!' as message;
