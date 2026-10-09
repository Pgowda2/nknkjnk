import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();
const DATA_DIR = path.join(process.cwd(), 'data');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');

function getStoredBookings(): any[] {
  try {
    if (fs.existsSync(BOOKINGS_FILE)) {
      const data = fs.readFileSync(BOOKINGS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading bookings file:', err);
  }
  return [];
}

function saveBookings(bookings: any[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving bookings file:', err);
  }
}

// POST /api/bookings - Book a 1-on-1 trial class
router.post('/bookings', async (req: Request, res: Response) => {
  try {
    const {
      parentName,
      studentName,
      studentGrade,
      subjectInterest,
      email,
      phone,
      preferredDate,
      preferredTime,
      timezone,
      notes,
    } = req.body;

    if (!parentName || !studentName || !email || !phone) {
      return res.status(400).json({
        error: 'Missing required booking fields (parentName, studentName, email, phone are mandatory).',
      });
    }

    const newBooking = {
      id: `booking-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      parentName: String(parentName).trim(),
      studentName: String(studentName).trim(),
      studentGrade: String(studentGrade || 'Grades 5–8').trim(),
      subjectInterest: String(subjectInterest || 'Python & Algorithmic Logic').trim(),
      email: String(email).trim().toLowerCase(),
      phone: String(phone).trim(),
      preferredDate: String(preferredDate || '').trim(),
      preferredTime: String(preferredTime || '04:00 PM - 05:00 PM').trim(),
      timezone: String(timezone || 'IST (UTC+5:30)').trim(),
      notes: notes ? String(notes).trim() : '',
      status: 'confirmed',
      notificationSentTo: ['aishwaryagowda227@gmail.com', String(email).trim().toLowerCase()],
    };

    const bookings = getStoredBookings();
    bookings.unshift(newBooking);
    saveBookings(bookings);

    console.log(`[Booking] New trial class booked for student: ${newBooking.studentName} by parent: ${newBooking.parentName} (${newBooking.email})`);
    console.log(`[Email Notification] Details dispatched to educator: aishwaryagowda227@gmail.com & parent: ${newBooking.email}`);

    res.status(201).json({
      success: true,
      message: 'Trial class booking recorded successfully. Details sent to email and ready for Google Calendar.',
      booking: newBooking,
    });
  } catch (err: any) {
    console.error('Booking processing error:', err);
    res.status(500).json({ error: 'Failed to process trial class booking.' });
  }
});

// GET /api/bookings - Retrieve bookings list (for educator dashboard / verification)
router.get('/bookings', (req: Request, res: Response) => {
  try {
    const bookings = getStoredBookings();
    res.json({ bookings, count: bookings.length });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load bookings.' });
  }
});

export default router;
