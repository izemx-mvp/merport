CREATE POLICY "Trusted server manages quote attachments"
ON storage.objects
FOR ALL
TO service_role
USING (bucket_id = 'quote-attachments')
WITH CHECK (bucket_id = 'quote-attachments');