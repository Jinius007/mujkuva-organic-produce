-- Create storage bucket for payment screenshots
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'payment_screenshots',
  'payment_screenshots',
  false,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
);

-- Create storage policy to allow authenticated and anonymous users to upload files
CREATE POLICY "Allow public uploads to payment_screenshots"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'payment_screenshots');

-- Create storage policy to allow public access to uploaded files
CREATE POLICY "Allow public access to payment_screenshots"
ON storage.objects FOR SELECT
USING (bucket_id = 'payment_screenshots'); 