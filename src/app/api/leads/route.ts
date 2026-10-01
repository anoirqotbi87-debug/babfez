import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const { data, error } = await supabase.from('leads').insert({
      name: body.name,
      email: body.email || null,
      phone: body.phone,
      zone: body.zone || body.quartier || null,
      property_type: body.property_type || body.typeBien || null,
      formula: body.formula || body.formule || null,
      message: body.message || null,
      status: "Nouveau"
    });

    if (error) throw error;

    const waText = `Bonjour BABFEZ, je suis ${body.name}. Je souhaite des informations pour mon bien à Fès.`;
    const waLink = `https://wa.me/212778874114?text=${encodeURIComponent(waText)}`;

    console.log(`[ALERT] Nouveau Lead Propriétaire: ${body.name} - ${body.phone}`);

    return NextResponse.json({ success: true, waLink });
  } catch (error: any) {
    console.error("API Error Leads:", error);
    return NextResponse.json({ success: false, error: error?.message || "Failed to process lead" }, { status: 500 });
  }
}
