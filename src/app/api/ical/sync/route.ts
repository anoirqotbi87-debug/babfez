import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { propertyId, airbnbUrl, bookingUrl } = await request.json();

    if (!propertyId) {
      return NextResponse.json({ error: 'Missing propertyId' }, { status: 400 });
    }

    // In a real application, we would fetch the external .ics urls, parse the text,
    // extract DTSTART and DTEND, and save them to the database.
    
    let importedCount = 0;

    const mockFetchAndParse = async (url: string, source: string) => {
      // Simulate network fetch
      await new Promise(r => setTimeout(r, 500));
      
      // Simulated iCal content
      const mockICalContent = `
BEGIN:VCALENDAR
BEGIN:VEVENT
DTSTART;VALUE=DATE:20261101
DTEND;VALUE=DATE:20261105
SUMMARY:Reserved by ${source}
END:VEVENT
END:VCALENDAR
      `;

      // Extract DTSTART and DTEND using Regex
      const startRegex = /DTSTART;VALUE=DATE:(\d{8})/g;
      const endRegex = /DTEND;VALUE=DATE:(\d{8})/g;
      
      let matchStart;
      while ((matchStart = startRegex.exec(mockICalContent)) !== null) {
        importedCount++;
      }
    };

    if (airbnbUrl) {
      await mockFetchAndParse(airbnbUrl, "Airbnb");
    }
    
    if (bookingUrl) {
      await mockFetchAndParse(bookingUrl, "Booking");
    }

    return NextResponse.json({ 
      success: true, 
      message: `Synchronisation réussie. ${importedCount} événements importés.`,
      importedCount
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
