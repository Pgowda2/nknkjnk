export interface TrialBooking {
  parentName: string;
  studentName: string;
  studentGrade: string;
  subjectInterest: string;
  email: string;
  phone: string;
  preferredDate: string; // YYYY-MM-DD
  preferredTime: string; // e.g. "16:00 - 17:00" or "4:00 PM - 5:00 PM IST"
  timezone: string;
  notes?: string;
}

/**
 * Parses user-selected date and time into start & end ISO strings for calendar templates
 */
export function parseBookingDateTimes(dateStr: string, timeStr: string): { startIso: string; endIso: string } {
  try {
    const today = new Date();
    const date = dateStr ? new Date(dateStr) : new Date(today.getTime() + 24 * 60 * 60 * 1000);
    
    // Default to 16:00 (4 PM) if time parsing fails
    let startHour = 16;
    let startMinute = 0;

    const lower = (timeStr || '').toLowerCase();
    const match = lower.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/);
    if (match) {
      let h = parseInt(match[1], 10);
      const m = match[2] ? parseInt(match[2], 10) : 0;
      const meridiem = match[3];

      if (meridiem === 'pm' && h < 12) h += 12;
      if (meridiem === 'am' && h === 12) h = 0;
      startHour = h;
      startMinute = m;
    }

    const startDate = new Date(date);
    startDate.setHours(startHour, startMinute, 0, 0);

    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour session

    const formatCalDate = (d: Date) => {
      return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    };

    return {
      startIso: formatCalDate(startDate),
      endIso: formatCalDate(endDate),
    };
  } catch {
    const now = new Date();
    const formatCalDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    return {
      startIso: formatCalDate(now),
      endIso: formatCalDate(new Date(now.getTime() + 3600000)),
    };
  }
}

/**
 * Builds direct Google Calendar web render template URL
 */
export function buildGoogleCalendarUrl(booking: TrialBooking): string {
  const { startIso, endIso } = parseBookingDateTimes(booking.preferredDate, booking.preferredTime);
  const title = `1-on-1 Coding Trial Class: ${booking.studentName} with Aishwarya Gowda`;
  const location = 'Google Meet / Online Live Classroom (Link will be emailed)';

  const description = [
    `🎓 Trial Coding Class with Aishwarya Gowda S R`,
    `------------------------------------------------`,
    `Student: ${booking.studentName} (${booking.studentGrade})`,
    `Parent Name: ${booking.parentName}`,
    `Subject Interest: ${booking.subjectInterest}`,
    `Preferred Time: ${booking.preferredTime} (${booking.timezone})`,
    `Parent Email: ${booking.email}`,
    `Phone / WhatsApp: ${booking.phone}`,
    booking.notes ? `Goals / Notes: ${booking.notes}` : '',
    ``,
    `Educator Contact:`,
    `Aishwarya Gowda S R (Senior Coding Instructor)`,
    `Email: aishwaryagowda227@gmail.com`,
    `WhatsApp / Phone: +91 83105 89119`,
    `Codingal Verified Profile: https://www.codingal.com/@aishwaryagsr219/`,
  ].filter(Boolean).join('\n');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startIso}/${endIso}`,
    details: description,
    location: location,
    add: `${booking.email},aishwaryagowda227@gmail.com`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generates downloadable .ics iCalendar file content
 */
export function buildICalendarFile(booking: TrialBooking): string {
  const { startIso, endIso } = parseBookingDateTimes(booking.preferredDate, booking.preferredTime);
  const now = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const title = `1-on-1 Coding Trial Class: ${booking.studentName} with Aishwarya Gowda`;
  const location = `Google Meet / Online Live Classroom`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Aishwarya Gowda Coding Classroom//Trial Class//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:trial-${Date.now()}@aishwaryagowda.dev`,
    `DTSTAMP:${now}`,
    `DTSTART:${startIso}`,
    `DTEND:${endIso}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:Coding trial class for ${booking.studentName} (${booking.studentGrade}) focusing on ${booking.subjectInterest}. Parent: ${booking.parentName} (${booking.phone}). Educator: Aishwarya Gowda S R (aishwaryagowda227@gmail.com).`,
    `LOCATION:${location}`,
    `ORGANIZER;CN="Aishwarya Gowda S R":mailto:aishwaryagowda227@gmail.com`,
    `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN="${booking.parentName}":mailto:${booking.email}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/**
 * Triggers browser download of iCal file
 */
export function downloadICalendar(booking: TrialBooking) {
  const icsData = buildICalendarFile(booking);
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `coding-trial-${booking.studentName.replace(/\s+/g, '-').toLowerCase() || 'class'}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Builds mailto link to immediately email the booking details
 */
export function buildMailtoUrl(booking: TrialBooking): string {
  const subject = `[Trial Class Booking] ${booking.studentName} (${booking.studentGrade}) - ${booking.subjectInterest}`;
  const body = [
    `Dear Aishwarya,`,
    ``,
    `I would like to schedule a 1-on-1 trial coding class for my child. Here are the details:`,
    ``,
    `• Parent's Name: ${booking.parentName}`,
    `• Student's Name: ${booking.studentName}`,
    `• Grade Band: ${booking.studentGrade}`,
    `• Coding / STEM Focus: ${booking.subjectInterest}`,
    `• Preferred Date: ${booking.preferredDate || 'Earliest available'}`,
    `• Preferred Time: ${booking.preferredTime} (${booking.timezone})`,
    `• Contact Phone / WhatsApp: ${booking.phone}`,
    `• Contact Email: ${booking.email}`,
    booking.notes ? `• Additional Notes / Goals: ${booking.notes}` : '',
    ``,
    `Please confirm the trial class time and share the Google Meet link.`,
    ``,
    `Warm regards,`,
    `${booking.parentName}`,
  ].filter(Boolean).join('\n');

  return `mailto:aishwaryagowda227@gmail.com?cc=${encodeURIComponent(booking.email)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Builds WhatsApp message URL for direct messaging Aishwarya
 */
export function buildWhatsAppUrl(booking: TrialBooking): string {
  const message = [
    `Hi Aishwarya ma'am! 👋 I just booked a 1-on-1 coding trial class on your portfolio website.`,
    ``,
    `*Student:* ${booking.studentName} (${booking.studentGrade})`,
    `*Subject:* ${booking.subjectInterest}`,
    `*Date:* ${booking.preferredDate || 'Soon'}`,
    `*Time:* ${booking.preferredTime} (${booking.timezone})`,
    `*Parent:* ${booking.parentName}`,
    `*Phone:* ${booking.phone}`,
    `*Email:* ${booking.email}`,
    booking.notes ? `*Notes:* ${booking.notes}` : '',
  ].filter(Boolean).join('\n');

  return `https://wa.me/918310589119?text=${encodeURIComponent(message)}`;
}
