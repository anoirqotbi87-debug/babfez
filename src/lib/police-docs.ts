import { supabase } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export const IDENTITY_BUCKET = 'identity-documents';

/**
 * Téléversement sécurisé de pièce d'identité (Passeport / CNI) via Buffer ou File
 * dans le bucket privé Supabase 'identity-documents'.
 */
export async function uploadSecurePassport(
  data: Buffer | ArrayBuffer | Blob | File,
  propertyId: string,
  extension: string = 'jpg'
): Promise<{ filePath: string; error?: string }> {
  try {
    const sanitizedPropertyId = propertyId.replace(/[^a-zA-Z0-9_-]/g, '_');
    const secureFilePath = `${sanitizedPropertyId}/${uuidv4()}.${extension}`;

    const { data: uploadData, error } = await supabase.storage
      .from(IDENTITY_BUCKET)
      .upload(secureFilePath, data, {
        contentType: extension === 'pdf' ? 'application/pdf' : `image/${extension === 'png' ? 'png' : 'jpeg'}`,
        cacheControl: 'private, no-cache, no-store',
        upsert: false,
      });

    if (error) {
      console.error("Erreur upload passeport sécurisé :", error.message);
      return { filePath: '', error: error.message };
    }

    return { filePath: uploadData.path };
  } catch (err: any) {
    console.error("Exception upload passeport sécurisé :", err);
    return { filePath: '', error: err.message || "Erreur téléversement" };
  }
}

/**
 * Téléverse de manière sécurisée une pièce d'identité voyageur (Passeport / CNI)
 * dans le bucket privé Supabase 'identity-documents'.
 *
 * @param bookingId - L'identifiant de la réservation liée
 * @param file - Le fichier image ou PDF (File ou Blob)
 * @param originalFilename - Le nom initial du fichier pour extraire l'extension
 * @returns Le chemin sécurisé interne du fichier dans le bucket
 */
export async function uploadGuestIdentity(
  bookingId: string,
  file: File | Blob,
  originalFilename?: string
): Promise<{ path: string; filePath: string; error?: string }> {
  try {
    const rawName = originalFilename || (file instanceof File ? file.name : 'document.jpg');
    const extension = rawName.includes('.') ? rawName.split('.').pop()?.toLowerCase() || 'jpg' : 'jpg';

    // Nom de fichier aléatoire non prédictible pour empêcher l'énumération
    const sanitizedBookingId = bookingId.replace(/[^a-zA-Z0-9_-]/g, '_');
    const secureFilePath = `${sanitizedBookingId}/${uuidv4()}.${extension}`;

    const { data, error } = await supabase.storage
      .from(IDENTITY_BUCKET)
      .upload(secureFilePath, file, {
        contentType: extension === 'pdf' ? 'application/pdf' : `image/${extension === 'png' ? 'png' : 'jpeg'}`,
        cacheControl: 'private, no-cache, no-store',
        upsert: false,
      });

    if (error) {
      console.error("Erreur d'upload de la pièce d'identité :", error.message);
      return { path: '', filePath: '', error: error.message };
    }

    return { path: data.path, filePath: data.path };
  } catch (err: any) {
    console.error("Exception lors de l'upload de la pièce d'identité :", err);
    return { path: '', filePath: '', error: err.message || "Erreur inconnue lors du téléversement" };
  }
}

/**
 * Génère une URL signée temporaire (15 minutes par défaut / 900 secondes)
 * pour la consultation sécurisée par le personnel autorisé de la conciergerie.
 *
 * Sécurité OWASP : Aucun document d'identité n'est accessible publiquement de façon permanente.
 *
 * @param filePath - Le chemin interne du document dans le bucket privé
 * @param expiresIn - Durée de validité en secondes (défaut : 900s = 15min)
 * @returns L'URL signée à durée déterminée
 */
export async function getSignedIdentityUrl(
  filePath: string,
  expiresIn: number = 900
): Promise<string | null> {
  if (!filePath) return null;

  try {
    const { data, error } = await supabase.storage
      .from(IDENTITY_BUCKET)
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      console.error("Erreur de génération de l'URL signée :", error.message);
      return null;
    }

    return data.signedUrl;
  } catch (err) {
    console.error("Exception lors de la génération de l'URL signée :", err);
    return null;
  }
}

/**
 * Supprime un document d'identité stocké de manière sécurisée (purge RGPD / fin de séjour)
 */
export async function deleteGuestIdentity(filePath: string): Promise<boolean> {
  if (!filePath) return false;

  try {
    const { error } = await supabase.storage
      .from(IDENTITY_BUCKET)
      .remove([filePath]);

    if (error) {
      console.error("Erreur de suppression du document :", error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Exception lors de la suppression du document :", err);
    return false;
  }
}
