import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const { data, error } = await supabase.from('leads').insert({
      name: body.name,
      phone: body.phone,
      zone: body.zone,
      property_type: body.property_type,
      formula: body.formula,
      message: body.message,
      status: "Nouveau"
    });

    if (error) throw error;

    const waText = `Bonjour BABFEZ, je suis ${body.name}. J'ai simulé mes revenus pour un bien à ${body.zone}. Je souhaite réserver mon audit technique gratuit.`;
    const waLink = `https://wa.me/212778874114?text=${encodeURIComponent(waText)}`;

    console.log(`[ALERT] Nouveau Lead Propriétaire: ${body.name} - ${body.phone} - ${body.zone}`);

    return NextResponse.json({ success: true, waLink });
  } catch (error) {
    console.error("API Error Leads:", error);
    return NextResponse.json({ success: false, error: "Failed to process lead" }, { status: 500 });
  }
}
