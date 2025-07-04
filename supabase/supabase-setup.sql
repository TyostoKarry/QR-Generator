-- File: supabase/supabase-setup.sql
-- This file contains the SQL setup for Supabase, including policies and triggers for file management.
BEGIN;
-- Create storage bucket for storing QR code files
insert into storage.buckets
  (id, name, public, file_size_limit, allowed_mime_types)
values
  ('qr-files', 'qr-files', true, 10485760, '{"image/png", "image/jpeg", "image/gif", application/pdf}');

-- Policy to allow authenticated users to insert files into the storage.objects table
CREATE POLICY "Enable insert for authenticated users only"
ON "storage"."objects"
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy to allow authenticated users to view only their own files
CREATE POLICY "Enable users to view their own data only"
ON "storage"."objects"
AS PERMISSIVE FOR SELECT
TO authenticated
USING (owner = (select auth.uid()));

-- Policy to allow authenticated users to delete only their own files
CREATE POLICY "Enable delete for users based on owner"
ON "storage"."objects"
AS PERMISSIVE FOR DELETE
TO authenticated
USING (owner = (select auth.uid()));

-- Policy to restrict all unauthenticated access to the storage.objects table
CREATE POLICY "Restrict unauthenticated access"
ON "storage"."objects"
AS RESTRICTIVE FOR ALL
TO anon
USING (false);

-- Create a table to store user files metadata
CREATE TABLE user_files (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  public_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable row-level security on the user_files table
ALTER TABLE public.user_files ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to select their own files
CREATE POLICY "Users can select their own files" 
ON user_files 
FOR SELECT 
TO authenticated 
USING ((select auth.uid()) = user_id);

-- Policy to allow authenticated users to insert their own files
CREATE POLICY "Users can insert their own files" 
ON user_files 
FOR INSERT 
TO authenticated 
WITH CHECK ((select auth.uid()) = user_id);

-- Policy to allow authenticated users to update their own files
CREATE POLICY "Users can update their own files" 
ON user_files 
FOR UPDATE 
TO authenticated 
USING ((select auth.uid()) = user_id) 
WITH CHECK ((select auth.uid()) = user_id);

-- Policy to allow authenticated users to delete their own files
CREATE POLICY "Users can delete their own files" 
ON user_files 
FOR DELETE 
TO authenticated 
USING ((select auth.uid()) = user_id);

-- Create extension for automatic timestamp updates
CREATE EXTENSION IF NOT EXISTS moddatetime SCHEMA extensions;

-- Create trigger function to update the updated_at field
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON user_files
  FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);

-- Create function to update user_files table on file insert events
CREATE OR REPLACE FUNCTION handle_file_insert()
RETURNS TRIGGER
SECURITY INVOKER
SET search_path = 'public'
AS $$
DECLARE
  public_url TEXT;
BEGIN
  -- Dynamically generate the public URL using the bucket name and file name
  public_url := 'https://<your-supabase-url>/storage/v1/object/public/' || NEW.bucket_id || '/' || NEW.name;

  INSERT INTO user_files (user_id, file_name, public_url)
  VALUES (NEW.owner, NEW.name, public_url);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call handle_file_insert after a file is inserted into the storage.objects table
CREATE TRIGGER on_file_insert
AFTER INSERT ON storage.objects
FOR EACH ROW
EXECUTE FUNCTION handle_file_insert();

-- Create function to update user_files table on file delete events
CREATE OR REPLACE FUNCTION handle_file_delete()
RETURNS TRIGGER
SECURITY INVOKER
SET search_path = 'public'
AS $$
BEGIN
  DELETE FROM user_files
  WHERE file_name = OLD.name AND user_id = OLD.owner;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call handle_file_delete after a file is deleted from the storage.objects table
CREATE TRIGGER on_file_delete
AFTER DELETE ON storage.objects
FOR EACH ROW
EXECUTE FUNCTION handle_file_delete();

-- Policy to limit file uploads to 3 files per user in the qr-files bucket
CREATE POLICY "Limit files per user"
ON storage.objects
as RESTRICTIVE
FOR INSERT
WITH CHECK (
    bucket_id = 'qr-files' AND
    (SELECT COUNT(*) FROM user_files WHERE user_id = auth.uid()) < 3
);
COMMIT;
