import { NextResponse } from 'next/server';
import { uploadSecurePassport } from '@/lib/police-docs';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const propertyId = formData.get('propertyId') as string;
    
    if (!file || !propertyId) {
      return NextResponse.json({ success: false, error: "Missing file or propertyId" }, { status: 400 });
    }

    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    
    // Convert File to ArrayBuffer then Buffer for supabase upload
    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await uploadSecurePassport(buffer, propertyId, extension);

    return NextResponse.json({ success: true, filePath: result.filePath });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
