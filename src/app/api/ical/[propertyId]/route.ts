import { NextResponse } from 'next/server';

// Mock data representing database reservations for properties
const MOCK_RESERVATIONS: Record<string, { id: string, start: string, end: string }[]> = {
  "p1": [
    { id: "res_1", start: "2026-10-01", end: "2026-10-05" },
    { id: "res_2", start: "2026-10-15", end: "2026-10-20" },
  ],
  "p2": [
    { id: "res_3", start: "2026-11-01", end: "2026-11-07" },
  ]
};

const formatDateForICal = (dateStr: string) => {
  // convert YYYY-MM-DD to YYYYMMDD
  return dateStr.replace(/-/g, '');
};

const generateICalFeed = (propertyId: string, reservations: { id: string, start: string, end: string }[]) => {
  let ical = [
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
  const reservations = MOCK_RESERVATIONS[propertyId] || [];

  const icalFeed = generateICalFeed(propertyId, reservations);

  return new NextResponse(icalFeed, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="babfez_${propertyId}.ics"`,
    },
  });
}
