-- a) Configuration du bucket 'identity-documents'
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'identity-documents',
    'identity-documents',
    false,
    5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET 
    public = false,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

-- b) Politiques RLS sur storage.objects

-- Activer RLS si ce n'est pas déjà fait
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Autoriser l'INSERT pour 'authenticated' et 'anon' dans guest-passports/
CREATE POLICY "Allow INSERT for identity documents in guest-passports" 
ON storage.objects FOR INSERT 
TO authenticated, anon 
WITH CHECK (
    bucket_id = 'identity-documents' AND 
    (storage.foldername(name))[1] = 'guest-passports'
);

-- Autoriser le SELECT uniquement pour service_role
CREATE POLICY "Allow SELECT for service_role on identity-documents" 
ON storage.objects FOR SELECT 
TO service_role 
USING (bucket_id = 'identity-documents');

-- c) RLS sur les tables de l'Espace Propriétaire

-- Activer RLS
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cleaning_reports ENABLE ROW LEVEL SECURITY;

-- Politiques pour properties
CREATE POLICY "Owners can view and manage their own properties" 
ON public.properties 
FOR ALL 
TO authenticated 
USING (auth.uid() = owner_id) 
WITH CHECK (auth.uid() = owner_id);

-- Politiques pour bookings
CREATE POLICY "Owners can view bookings for their properties" 
ON public.bookings 
FOR SELECT 
TO authenticated 
USING (
    property_id IN (
        SELECT id FROM public.properties WHERE owner_id = auth.uid()
    )
);

-- Politiques pour financial_statements
CREATE POLICY "Owners can view financial statements for their properties" 
ON public.financial_statements 
FOR SELECT 
TO authenticated 
USING (
    property_id IN (
        SELECT id FROM public.properties WHERE owner_id = auth.uid()
    )
);

-- Politiques pour cleaning_reports
CREATE POLICY "Owners can view cleaning reports for their properties" 
ON public.cleaning_reports 
FOR SELECT 
TO authenticated 
USING (
    property_id IN (
        SELECT id FROM public.properties WHERE owner_id = auth.uid()
    )
);
