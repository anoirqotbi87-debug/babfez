import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(req: Request, { params }: { params: { propertyId: string } }) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return new Response('Unauthorized - Missing Token', { status: 401 });
    }

    const { data: property, error: propError } = await supabase
      .from('properties')
      .select('ical_feed_token')
      .eq('id', params.propertyId)
      .single();

    if (propError || !property || property.ical_feed_token !== token) {
      return new Response('Unauthorized - Invalid Token', { status: 401 });
    }

    const { data: bookings, error: bookError } = await supabase
      .from('bookings')
      .select('start_date, end_date, id')
      .eq('property_id', params.propertyId)
      .eq('status', 'confirmed');

    if (bookError) throw bookError;

    let icalContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//BABFEZ//Calendar Sync//FR',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
    ];

    const formatDate = (dateStr: string) => {
      const d = new Date(dateStr);
      return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const formatDateOnly = (dateStr: string) => {
      return dateStr.replace(/-/g, '');
    };

    bookings?.forEach(b => {
      icalContent.push('BEGIN:VEVENT');
      icalContent.push(`UID:BABFEZ-${b.id}`);
      icalContent.push(`DTSTAMP:${formatDate(new Date().toISOString())}`);
      icalContent.push(`DTSTART;VALUE=DATE:${formatDateOnly(b.start_date)}`);
      
      const endD = new Date(b.end_date);
      endD.setDate(endD.getDate() + 1); // iCal end dates are exclusive
      icalContent.push(`DTEND;VALUE=DATE:${formatDateOnly(endD.toISOString().split('T')[0])}`);
      
      icalContent.push('SUMMARY:Réservé (BABFEZ Direct)');
      icalContent.push('STATUS:CONFIRMED');
      icalContent.push('END:VEVENT');
    });

    icalContent.push('END:VCALENDAR');

    return new Response(icalContent.join('\\r\\n'), {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="babfez-${params.propertyId}.ics"`
      }
    });

  } catch (err: any) {
    return new Response(err.message, { status: 500 });
  }
}
