-- ==============================================================================
-- BABFEZ CONCIERGERIE - CONFIGURATION DES COMPTES D'ACCÈS SUPABASE
-- Comptes : Super-Admin & Propriétaire
-- Identifiant : Aqotbi | Mot de passe : Moth326sine706.
-- ==============================================================================

-- 0. Activer l'extension pgcrypto si non présente
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. CRÉATION DU COMPTE SUPER-ADMIN (aqotbi@babfez.ma)
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
    
    RAISE NOTICE 'Compte Super-Admin mis à jour : aqotbi@babfez.ma';
  END IF;
END $$;

-- 2. CRÉATION DU COMPTE PROPRIÉTAIRE (aqotbi.owner@babfez.ma)
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
    RAISE NOTICE 'Compte Propriétaire mis à jour : aqotbi.owner@babfez.ma';
  END IF;

  -- 3. RATTACHEMENT DES LOGEMENTS DE TEST DE FÈS À CE PROPRIÉTAIRE
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'properties') THEN
    UPDATE properties 
    SET owner_id = owner_id 
    WHERE id IN ('prop_riad_medina', 'prop_apt_atlas', 'prop_studio_immouzzer')
       OR id IN ('p1', 'p2', 'p3');
    RAISE NOTICE 'Logements rattachés au propriétaire %', owner_id;
  END IF;
END $$;
