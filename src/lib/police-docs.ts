import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Initialize Supabase admin client using the service role key to bypass RLS 
// for secure backend-only operations (generating signed URLs).
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'
);

export async function getSecurePassportUrl(filePath: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin
    .storage
    .from('identity-documents')
    .createSignedUrl(filePath, 900); // 900 seconds = 15 minutes

  if (error || !data) {
    console.error('Error generating signed URL:', error);
    return null;
  }

  return data.signedUrl;
}

export async function uploadSecurePassport(
  file: Blob | Buffer | File,
  bookingId: string,
  extension: string
) {
  const uuid = uuidv4();
  const filePath = `guest-passports/${bookingId}/${uuid}.${extension}`;

  const contentType = extension === 'pdf' ? 'application/pdf' : `image/${extension}`;

  const { data, error } = await supabaseAdmin
    .storage
    .from('identity-documents')
    .upload(filePath, file, {
      upsert: false,
      contentType
    });

  if (error) {
    throw new Error(`Failed to upload secure passport: ${error.message}`);
  }

  return { filePath, data };
}
