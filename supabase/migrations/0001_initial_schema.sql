-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid()
);

-- 2. Create Documents Table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    document_number TEXT,
    description TEXT,
    document_date DATE NOT NULL DEFAULT CURRENT_DATE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    file_path TEXT NOT NULL, -- Path in Supabase Storage
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies (Authenticated Admin Only)
-- Categories Policies
CREATE POLICY "Admin can manage their own categories" ON categories
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Documents Policies
CREATE POLICY "Admin can manage their own documents" ON documents
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 5. Set up Storage Bucket for Documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- 6. Storage Policies (Authenticated Admin Only)
-- Allow Admin to upload files
CREATE POLICY "Admin can upload documents" ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'documents');

-- Allow Admin to view/download their files
CREATE POLICY "Admin can view documents" ON storage.objects
    FOR SELECT
    TO authenticated
    USING (bucket_id = 'documents');

-- Allow Admin to delete their files
CREATE POLICY "Admin can delete documents" ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'documents');

-- Allow Admin to update their files
CREATE POLICY "Admin can update documents" ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'documents');
