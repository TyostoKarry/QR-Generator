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
