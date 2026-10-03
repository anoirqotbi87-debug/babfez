-- ==============================================================================
-- BABFEZ CONCIERGERIE - CONFIGURATION DES COMPTES D'ACCÈS SUPABASE & PROFILES
-- Comptes : Super-Admin & Propriétaire
-- Identifiant : Aqotbi | Mot de passe : Moth326sine706.
-- ==============================================================================

-- 0. Activer l'extension pgcrypto si non présente
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. CRÉATION DE LA TABLE PROFILES & RLS
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'owner' CHECK (role IN ('admin', 'owner', 'guest')),
  username TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Activation de Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Politiques RLS
DROP POLICY IF EXISTS "Lecture des profils authentifiés" ON public.profiles;
CREATE POLICY "Lecture des profils authentifiés"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Modification par le propriétaire ou admin" ON public.profiles;
CREATE POLICY "Modification par le propriétaire ou admin"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Insertion de profil" ON public.profiles;
CREATE POLICY "Insertion de profil"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- 2. FONCTION & TRIGGER AUTOMATIQUE ON AUTH USER CREATED
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  assigned_role TEXT := 'owner';
  user_full_name TEXT;
  user_username TEXT;
BEGIN
  -- Détection automatique du rôle Super-Admin pour la whitelist
  IF NEW.email IN ('aqotbi@babfez.ma', 'anoirqotbi87@gmail.com') THEN
    assigned_role := 'admin';
  ELSIF (NEW.raw_user_meta_data->>'role') = 'admin' THEN
    assigned_role := 'admin';
  END IF;

  user_full_name := COALESCE(
    NEW.raw_user_meta_data->>'fullName',
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1)
  );

  user_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    CASE WHEN assigned_role = 'admin' THEN 'Aqotbi' ELSE split_part(NEW.email, '@', 1) END
  );

  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    avatar_url,
    role,
    username,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    user_full_name,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    assigned_role,
    user_username,
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
    role = CASE WHEN public.profiles.role = 'admin' THEN 'admin' ELSE EXCLUDED.role END,
    updated_at = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enregistrement du trigger sur auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. CRÉATION DU COMPTE SUPER-ADMIN (aqotbi@babfez.ma)
DO $$
DECLARE
  admin_id UUID := 'a0000000-0000-0000-0000-000000000001'::uuid;
  existing_id UUID;
BEGIN
  SELECT id INTO existing_id FROM auth.users WHERE email = 'aqotbi@babfez.ma';
  
  IF existing_id IS NULL THEN
    -- Insertion dans auth.users
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      role,
      confirmation_token,
      recovery_token,
      email_change_token_new,
      email_change
    ) VALUES (
      admin_id,
      '00000000-0000-0000-0000-000000000000',
      'aqotbi@babfez.ma',
      crypt('Moth326sine706.', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"username":"Aqotbi","fullName":"Anoir Qotbi","role":"admin"}'::jsonb,
      now(),
      now(),
      'authenticated',
      '',
      '',
      '',
      ''
    );

    -- Insertion dans auth.identities pour compatibilité complète avec Supabase GoTrue
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      admin_id,
      admin_id,
      format('{"sub":"%s","email":"%s"}', admin_id::text, 'aqotbi@babfez.ma')::jsonb,
      'email',
      admin_id::text,
      now(),
      now(),
      now()
    ) ON CONFLICT DO NOTHING;

    -- Synchronisation profile
    INSERT INTO public.profiles (id, email, full_name, role, username)
    VALUES (admin_id, 'aqotbi@babfez.ma', 'Anoir Qotbi', 'admin', 'Aqotbi')
    ON CONFLICT (id) DO UPDATE SET role = 'admin', username = 'Aqotbi';

    RAISE NOTICE 'Compte Super-Admin créé avec succès : aqotbi@babfez.ma (Identifiant: Aqotbi)';
  ELSE
    -- Mise à jour du mot de passe et des métadonnées si l'utilisateur existe déjà
    UPDATE auth.users
    SET 
      encrypted_password = crypt('Moth326sine706.', gen_salt('bf')),
      raw_user_meta_data = '{"username":"Aqotbi","fullName":"Anoir Qotbi","role":"admin"}'::jsonb,
      email_confirmed_at = COALESCE(email_confirmed_at, now()),
      updated_at = now()
    WHERE id = existing_id;

    INSERT INTO public.profiles (id, email, full_name, role, username)
    VALUES (existing_id, 'aqotbi@babfez.ma', 'Anoir Qotbi', 'admin', 'Aqotbi')
    ON CONFLICT (id) DO UPDATE SET role = 'admin', username = 'Aqotbi';
    
    RAISE NOTICE 'Compte Super-Admin mis à jour : aqotbi@babfez.ma';
  END IF;
END $$;

-- 4. CRÉATION DU COMPTE PROPRIÉTAIRE (aqotbi.owner@babfez.ma)
DO $$
DECLARE
  owner_id UUID := 'b0000000-0000-0000-0000-000000000002'::uuid;
  existing_id UUID;
BEGIN
  SELECT id INTO existing_id FROM auth.users WHERE email = 'aqotbi.owner@babfez.ma';
  
  IF existing_id IS NULL THEN
    -- Insertion dans auth.users
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      role,
      confirmation_token,
      recovery_token,
      email_change_token_new,
      email_change
    ) VALUES (
      owner_id,
      '00000000-0000-0000-0000-000000000000',
      'aqotbi.owner@babfez.ma',
      crypt('Moth326sine706.', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"username":"Aqotbi","fullName":"M. Anoir Qotbi","role":"owner"}'::jsonb,
      now(),
      now(),
      'authenticated',
      '',
      '',
      '',
      ''
    );

    -- Insertion dans auth.identities
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      owner_id,
      owner_id,
      format('{"sub":"%s","email":"%s"}', owner_id::text, 'aqotbi.owner@babfez.ma')::jsonb,
      'email',
      owner_id::text,
      now(),
      now(),
      now()
    ) ON CONFLICT DO NOTHING;

    -- Synchronisation profile
    INSERT INTO public.profiles (id, email, full_name, role, username)
    VALUES (owner_id, 'aqotbi.owner@babfez.ma', 'M. Anoir Qotbi', 'owner', 'Aqotbi')
    ON CONFLICT (id) DO UPDATE SET role = 'owner', username = 'Aqotbi';

    RAISE NOTICE 'Compte Propriétaire créé avec succès : aqotbi.owner@babfez.ma (Identifiant: Aqotbi)';
  ELSE
    -- Mise à jour si existe déjà
    UPDATE auth.users
    SET 
      encrypted_password = crypt('Moth326sine706.', gen_salt('bf')),
      raw_user_meta_data = '{"username":"Aqotbi","fullName":"M. Anoir Qotbi","role":"owner"}'::jsonb,
      email_confirmed_at = COALESCE(email_confirmed_at, now()),
      updated_at = now()
    WHERE id = existing_id;
    
    owner_id := existing_id;

    INSERT INTO public.profiles (id, email, full_name, role, username)
    VALUES (existing_id, 'aqotbi.owner@babfez.ma', 'M. Anoir Qotbi', 'owner', 'Aqotbi')
    ON CONFLICT (id) DO UPDATE SET role = 'owner', username = 'Aqotbi';

    RAISE NOTICE 'Compte Propriétaire mis à jour : aqotbi.owner@babfez.ma';
  END IF;

  -- 5. RATTACHEMENT DES LOGEMENTS DE TEST DE FÈS À CE PROPRIÉTAIRE
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'properties') THEN
    UPDATE properties 
    SET owner_id = owner_id 
    WHERE id IN ('prop_riad_medina', 'prop_apt_atlas', 'prop_studio_immouzzer')
       OR id IN ('p1', 'p2', 'p3');
    RAISE NOTICE 'Logements rattachés au propriétaire %', owner_id;
  END IF;
END $$;
