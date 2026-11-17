import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

const formatDateForICal = (dateStr: string) => {
  return dateStr.replace(/-/g, '');
};

const generateICalFeed = (propertyId: string, reservations: { id: string, start: string, end: string }[]) => {
  const ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//BABFEZ Conciergerie//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ];

  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  for (const res of reservations) {
    ical.push(
      'BEGIN:VEVENT',
      `UID:booking_${res.id}@babfez.ma`,
      `DTSTAMP:${now}`,
      `DTSTART;VALUE=DATE:${formatDateForICal(res.start)}`,
      `DTEND;VALUE=DATE:${formatDateForICal(res.end)}`,
      `SUMMARY:Réservé - BABFEZ Conciergerie`,
      'END:VEVENT'
    );
  }

  ical.push('END:VCALENDAR');
  return ical.join('\r\n');
};

export async function GET(request: Request, { params }: { params: { propertyId: string } }) {
  const propertyId = params.propertyId;
  let reservations: { id: string, start: string, end: string }[] = [];

  // Récupération dynamique des réservations confirmées depuis Supabase
  try {
    const { data: dbBookings } = await supabase
      .from('bookings')
      .select('id, start_date, end_date')
      .eq('property_id', propertyId)
      .eq('status', 'confirmed');

    if (dbBookings && dbBookings.length > 0) {
      reservations = dbBookings.map((b: any) => ({
        id: b.id,
        start: b.start_date,
        end: b.end_date,
      }));
    }
  } catch {
    // Mode Preview : tableau vide par défaut
    reservations = [];
  }

  const icalFeed = generateICalFeed(propertyId, reservations);

  return new NextResponse(icalFeed, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="babfez_${propertyId}.ics"`,
    },
  });
}
