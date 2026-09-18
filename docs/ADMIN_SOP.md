# MODE OPÉRATOIRE ADMINISTRATEUR (SOP) — BABFEZ
*Version 1.0 — Plateforme de Conciergerie Privée à Fès*

Ce document sert de référence opérationnelle pour administrer la plateforme web, ajouter des logements, synchroniser les calendriers Airbnb/Booking et assurer la gestion financière des propriétaires.

---

## 1. ARCHITECTURE ET ACCÈS CLÉS
- **Application en production :** `https://babfez.vercel.app` (ou domaine final `https://babfez.ma`)
- **Fichiers de configuration centraux :**
  - Données des propriétés : `src/data/properties.ts` (ou Firestore `properties`)
  - Configuration des devises & taux : `src/config/currencies.ts`
  - Routes d'export iCal : `src/app/api/ical/[propertyId]/route.ts`
  - Routes d'import iCal : `src/app/api/ical/sync/route.ts`

---

## 2. AJOUT OU MODIFICATION D'UN LOGEMENT
Pour ajouter un nouveau bien au catalogue et dans l'Espace Propriétaire :
1. Renseigner les champs obligatoires dans `src/data/properties.ts` (ou Firestore) :
   - `id` : identifiant unique (ex: `prop_apt2_atlas`)
   - `title` : titre commercial accrocheur
   - `zone` : `medina`, `ville_nouvelle` ou `immouzzer`
   - `bedrooms` : nombre de chambres
   - `maxGuests` : capacité maximale
   - `pricePerNight` : prix en MAD par nuitée
   - `cleaningFee` : frais de ménage hôtelier en MAD
   - `images` : URLs des photos haute résolution
   - `ownerEmail` : adresse e-mail du propriétaire pour l'accès à son dashboard

---

## 3. PROCÉDURE DE SYNCHRONISATION iCAL (AIRBNB / BOOKING.COM)

### Étape 3.1 : Exporter le calendrier BABFEZ vers Airbnb & Booking
1. Dans l'Espace Propriétaire, copier le lien généré :
   `https://babfez.vercel.app/api/ical/[propertyId]`
2. **Sur Airbnb :**
   - Menu Annonces > Tarifs et disponibilités > Synchronisation des calendriers > Importer un calendrier.
   - Coller l'URL BABFEZ et nommer le calendrier "BABFEZ Direct".
3. **Sur Booking.com :**
   - Extranet > Tarifs et disponibilités > Synchroniser les calendriers > Ajouter une connexion de calendrier.
   - Coller l'URL BABFEZ et nommer la connexion "BABFEZ Direct".

### Étape 3.2 : Importer les calendriers Airbnb & Booking vers BABFEZ
1. **Sur Airbnb :** Cliquer sur "Exporter le calendrier" et copier l'URL `.ics`.
2. **Sur Booking.com :** Cliquer sur "Exporter le calendrier" et copier l'URL `.ics`.
3. **Dans BABFEZ :**
   - Ouvrir `/proprietaire/dashboard` sur le logement concerné.
   - Coller les URLs dans les champs correspondants et cliquer sur "Enregistrer et Synchroniser".

---

## 4. GESTION DES DEMANDES DE RÉSERVATION DIRECTE (WHATSAPP)
À la réception d'un message de réservation :
1. **Vérification du calendrier :** Contrôler que les dates sont bien libres sur le dashboard.
2. **Confirmation client :** Répondre avec le montant total (devise choisie + rappel en MAD).
3. **Fiche de police (Réglementation Maroc) :** Exiger la photo du passeport/CNI avant l'envoi des consignes d'accès.
4. **Envoi du Welcome Book :** Transmettre la localisation GPS, le code Wi-Fi et les instructions d'arrivée.
5. **Alerte intendance :** Notifier l'équipe de ménage et de blanchisserie pour la date de sortie.

---

## 5. CLÔTURE MENSUELLE & DÉCOMPTE PROPRIÉTAIRE
Le 1er de chaque mois :
1. Se connecter à l'Espace Propriétaire et filtrer sur le mois échu.
2. Vérifier la conformité des réservations et des commissions (20-25%).
3. Cliquer sur "Imprimer / Télécharger le relevé (PDF)".
4. Effectuer le virement bancaire du montant net vers le RIB du propriétaire avant le 10 du mois.
5. Transmettre le décompte PDF sur WhatsApp au propriétaire.

---

## 6. AJUSTEMENT DES TAUX DE CHANGE
En cas de variation monétaire importante, ajuster les valeurs dans `src/config/currencies.ts` :
- `EUR` : cours en MAD (ex: 10.80)
- `USD` : cours en MAD (ex: 9.90)
Le déploiement se fait automatiquement dès la modification poussée sur GitHub/Vercel.
