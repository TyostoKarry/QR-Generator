-- Policy to allow authenticated users to insert files into the storage.objects table
CREATE POLICY "Enable insert for authenticated users only"
ON "storage"."objects"
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK (true)

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

-- Table to track the number of files uploaded by each user
CREATE TABLE user_file_counts (
    user_id UUID PRIMARY KEY,
    file_count INT NOT NULL DEFAULT 0
);

-- Function to increment file count on file upload
CREATE OR REPLACE FUNCTION increment_file_count()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_file_counts (user_id, file_count)
    VALUES (NEW.owner, 1)
    ON CONFLICT (user_id)
    DO UPDATE SET file_count = user_file_counts.file_count + 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call increment_file_count after a file is inserted into the qr-files bucket
CREATE TRIGGER after_file_insert
AFTER INSERT ON storage.objects
FOR EACH ROW
WHEN (NEW.bucket_id = 'qr-files')
EXECUTE FUNCTION increment_file_count();

-- Function to decrement file count on file deletion
CREATE OR REPLACE FUNCTION decrement_file_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_file_counts
    SET file_count = file_count - 1
    WHERE user_id = OLD.owner;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call decrement_file_count after a file is deleted from the qr-files bucket
CREATE TRIGGER after_file_delete
AFTER DELETE ON storage.objects
FOR EACH ROW
WHEN (OLD.bucket_id = 'qr-files')
EXECUTE FUNCTION decrement_file_count();

-- Policy to limit file uploads to 3 files per user in the qr-files bucket
CREATE POLICY "Limit files per user"
ON storage.objects
as RESTRICTIVE
FOR INSERT
WITH CHECK (
    bucket_id = 'qr-files' AND
    COALESCE((SELECT file_count FROM user_file_counts WHERE user_id = auth.uid()), 0) < 3
);