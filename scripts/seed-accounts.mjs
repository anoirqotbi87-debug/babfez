import { createClient } from '@supabase/supabase-js';

// Configuration depuis les variables d'environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('\x1b[31m%s\x1b[0m', '❌ ERREUR : Variables d\'environnement manquantes.');
  console.log('\nVeuillez définir :');
  console.log('  - NEXT_PUBLIC_SUPABASE_URL (ou SUPABASE_URL)');
  console.log('  - SUPABASE_SERVICE_ROLE_KEY');
  console.log('\nExemple d\'exécution en PowerShell :');
  console.log('  $env:NEXT_PUBLIC_SUPABASE_URL="https://votre-projet.supabase.co"');
  console.log('  $env:SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."');
  console.log('  node scripts/seed-accounts.mjs\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function seedAccounts() {
  console.log('🚀 Initialisation des comptes d\'accès BABFEZ sur Supabase...\n');

  // 1. COMPTE SUPER-ADMIN
  const adminEmail = 'aqotbi@babfez.ma';
  const adminPassword = 'Moth326sine706.';
  const adminMeta = {
    username: 'Aqotbi',
    fullName: 'Anoir Qotbi',
    role: 'admin',
  };

  console.log(`1️⃣ Configuration Super-Admin (${adminEmail})...`);
  const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error('❌ Erreur lors de la récupération des utilisateurs :', listError.message);
    process.exit(1);
  }

  const existingAdmin = usersData.users.find((u) => u.email === adminEmail);

  if (!existingAdmin) {
    const { data: newAdmin, error: createError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: adminMeta,
    });

    if (createError) {
      console.error('❌ Erreur création admin :', createError.message);
    } else {
      console.log(`✅ Super-Admin créé avec succès : ID ${newAdmin.user.id}`);
    }
  } else {
    const { error: updateError } = await supabase.auth.admin.updateUserById(existingAdmin.id, {
      password: adminPassword,
      user_metadata: adminMeta,
      email_confirm: true,
    });

    if (updateError) {
      console.error('❌ Erreur mise à jour admin :', updateError.message);
    } else {
      console.log(`✅ Super-Admin mis à jour avec succès : ID ${existingAdmin.id}`);
    }
  }

  // 2. COMPTE PROPRIÉTAIRE
  const ownerEmail = 'aqotbi.owner@babfez.ma';
  const ownerPassword = 'Moth326sine706.';
  const ownerMeta = {
    username: 'Aqotbi',
    fullName: 'M. Anoir Qotbi',
    role: 'owner',
  };

  console.log(`\n2️⃣ Configuration Propriétaire (${ownerEmail})...`);
  const existingOwner = usersData.users.find((u) => u.email === ownerEmail);
  let ownerId = existingOwner?.id;

  if (!existingOwner) {
    const { data: newOwner, error: createOwnerErr } = await supabase.auth.admin.createUser({
      email: ownerEmail,
      password: ownerPassword,
      email_confirm: true,
      user_metadata: ownerMeta,
    });

    if (createOwnerErr) {
      console.error('❌ Erreur création propriétaire :', createOwnerErr.message);
    } else {
      ownerId = newOwner.user.id;
      console.log(`✅ Propriétaire créé avec succès : ID ${ownerId}`);
    }
  } else {
    const { error: updateOwnerErr } = await supabase.auth.admin.updateUserById(existingOwner.id, {
      password: ownerPassword,
      user_metadata: ownerMeta,
      email_confirm: true,
    });

    if (updateOwnerErr) {
      console.error('❌ Erreur mise à jour propriétaire :', updateOwnerErr.message);
    } else {
      console.log(`✅ Propriétaire mis à jour avec succès : ID ${existingOwner.id}`);
    }
  }

  // 3. RATTACHEMENT DES LOGEMENTS AU PROPRIÉTAIRE
  if (ownerId) {
    console.log('\n3️⃣ Rattachement des propriétés de Fès au compte propriétaire...');
    try {
      const { error: propErr } = await supabase
        .from('properties')
        .update({ owner_id: ownerId })
        .in('id', ['prop_riad_medina', 'prop_apt_atlas', 'prop_studio_immouzzer', 'p1', 'p2', 'p3']);

      if (propErr) {
        console.log('ℹ️ Table properties non disponible ou colonnes différentes (sans impact).');
      } else {
        console.log('✅ Logements rattachés au propriétaire.');
      }
    } catch {
      console.log('ℹ️ Étape de rattachement ignorée (table properties inexistante).');
    }
  }

  console.log('\n======================================================');
  console.log('🎉 INITIALISATION TERMINÉE AVEC SUCCÈS !');
  console.log('======================================================');
  console.log('1. Super-Admin  : Identifiant "Aqotbi" ou aqotbi@babfez.ma');
  console.log('   Mot de passe : Moth326sine706.');
  console.log('   Accès        : /admin/login');
  console.log('------------------------------------------------------');
  console.log('2. Propriétaire : Identifiant "Aqotbi" ou aqotbi.owner@babfez.ma');
  console.log('   Mot de passe : Moth326sine706.');
  console.log('   Accès        : /proprietaire/login');
  console.log('======================================================\n');
}

seedAccounts().catch(console.error);
