import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request, { params }: { params: { propertyId: string } }) {
  try {
    const { data: property, error: propError } = await supabase
      .from('properties')
      .select('airbnb_ical_url, booking_ical_url')
      .eq('id', params.propertyId)
      .single();

    if (propError || !property) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
    }

    let importedCount = 0;

    const parseAndUpsert = async (url: string, source: string) => {
      if (!url) return;
      try {
        const response = await fetch(url);
        if (!response.ok) return;
        const text = await response.text();
        
        const events = text.split('BEGIN:VEVENT');
        events.shift(); // Remove headers
        
        for (const ev of events) {
          const uidMatch = ev.match(/UID:(.+)/);
          const startMatch = ev.match(/DTSTART(?:;VALUE=DATE)?:(.+)/);
          const endMatch = ev.match(/DTEND(?:;VALUE=DATE)?:(.+)/);
          
          if (uidMatch && startMatch && endMatch) {
            let uid = uidMatch[1].trim();
            let startRaw = startMatch[1].trim();
            let endRaw = endMatch[1].trim();

            if (uid.includes('BABFEZ')) continue; // Skip our own exported events if they loop back

            const parseDate = (d: string) => {
              if (d.length === 8) {
                return `${d.substring(0,4)}-${d.substring(4,6)}-${d.substring(6,8)}`;
              }
              return d; // Fallback
            };

            const startDate = parseDate(startRaw);
            const endDateRaw = parseDate(endRaw);

            // iCal end dates are exclusive, but we might just store it as is or subtract 1 day.
            // For simplicity, we just store what's given.
            const endDateObj = new Date(endDateRaw);
            if (endRaw.length === 8) {
               endDateObj.setDate(endDateObj.getDate() - 1);
            }
            const finalEndDate = endDateObj.toISOString().split('T')[0];

            await supabase.from('bookings').upsert({
              property_id: params.propertyId,
              external_uid: uid,
              source: source,
              status: 'confirmed',
              start_date: startDate,
              end_date: finalEndDate,
              guest_name: `Guest (${source})`,
            }, { onConflict: 'property_id, external_uid' });

            importedCount++;
          }
        }
      } catch (e) {
        console.error(`Error parsing ${source} iCal:`, e);
      }
    };

    if (property.airbnb_ical_url) await parseAndUpsert(property.airbnb_ical_url, 'airbnb');
    if (property.booking_ical_url) await parseAndUpsert(property.booking_ical_url, 'booking');

    await supabase.from('properties').update({ last_ical_sync: new Date().toISOString() }).eq('id', params.propertyId);

    return NextResponse.json({ success: true, count: importedCount });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
