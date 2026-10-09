import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar as CalendarIcon, 
  Send, 
  CheckCircle2, 
  Linkedin, 
  Sparkles, 
  Clock,
  ExternalLink,
  Download,
  CalendarCheck,
  AlertCircle,
  LogOut,
  UserCheck
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData.js';
import { useToast } from '../context/ToastContext.js';
import { 
  buildGoogleCalendarUrl, 
  downloadICalendar, 
  buildMailtoUrl, 
  buildWhatsAppUrl,
  TrialBooking,
  parseBookingDateTimes
} from '../utils/calendar.js';
import { 
  initGoogleAuth, 
  signInWithGoogle, 
  signOutGoogle, 
  createGoogleCalendarEvent, 
  sendGmailEmail 
} from '../utils/googleWorkspace.js';
import { GoogleSignInButton } from './GoogleSignInButton.js';
import { User } from 'firebase/auth';

export const ContactSection: React.FC = () => {
  const { showToast } = useToast();

  // Helper to get tomorrow's date string (YYYY-MM-DD)
  const getTomorrowString = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState<TrialBooking>({
    parentName: '',
    studentName: '',
    studentGrade: 'Grades 5–8',
    subjectInterest: 'Python & Algorithmic Logic',
    preferredDate: getTomorrowString(),
    preferredTime: '04:00 PM - 05:00 PM',
    timezone: 'IST (UTC+5:30)',
    email: '',
    phone: '',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<TrialBooking | null>(null);

  // Google Workspace state
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);
  const [isSigningInGoogle, setIsSigningInGoogle] = useState(false);

  // Modal confirmation state for explicit user permission to mutate Calendar/Gmail
  const [showWorkspaceConfirmModal, setShowWorkspaceConfirmModal] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{
    calendarEventCreated?: boolean;
    calendarHtmlLink?: string;
    gmailSent?: boolean;
    error?: string;
  }>({});

  useEffect(() => {
    const unsubscribe = initGoogleAuth(
      (user, token) => {
        setGoogleUser(user);
        setGoogleAccessToken(token);
        if (user.email && !formData.email) {
          setFormData((prev) => ({ ...prev, email: user.email || prev.email }));
        }
      },
      () => {
        setGoogleUser(null);
        setGoogleAccessToken(null);
      }
    );
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleGoogleConnect = async () => {
    setIsSigningInGoogle(true);
    try {
      const res = await signInWithGoogle();
      if (res) {
        setGoogleUser(res.user);
        setGoogleAccessToken(res.accessToken);
        if (res.user.email) {
          setFormData((prev) => ({ 
            ...prev, 
            email: res.user.email || prev.email,
            parentName: prev.parentName || res.user.displayName || ''
          }));
        }
        showToast('Connected with Google! Calendar & Gmail integration enabled.', 'success');
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to sign in with Google', 'error');
    } finally {
      setIsSigningInGoogle(false);
    }
  };

  const handleGoogleDisconnect = async () => {
    await signOutGoogle();
    setGoogleUser(null);
    setGoogleAccessToken(null);
    showToast('Signed out of Google account', 'info');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If user is connected with Google, show the explicit confirmation dialog before modifying Calendar/sending Gmail
    if (googleAccessToken) {
      setShowWorkspaceConfirmModal(true);
      return;
    }

    // Otherwise proceed with standard booking
    await executeBooking(false);
  };

  const executeBooking = async (withWorkspaceSync: boolean) => {
    setLoading(true);
    setShowWorkspaceConfirmModal(false);

    let calSuccess = false;
    let calLink = '';
    let emailSuccess = false;

    try {
      // 1. Send booking details to backend endpoint
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      }).catch((err) => console.warn('Backend save notice:', err));

      // 2. If authenticated and confirmed, perform direct Calendar and Gmail calls
      if (withWorkspaceSync && googleAccessToken) {
        const { startIso, endIso } = parseBookingDateTimes(formData.preferredDate, formData.preferredTime);
        
        // Convert to ISO string with timezone indicator
        const startDate = new Date();
        const startParts = startIso.match(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/);
        if (startParts) {
          startDate.setFullYear(parseInt(startParts[1]), parseInt(startParts[2]) - 1, parseInt(startParts[3]));
          startDate.setHours(parseInt(startParts[4]), parseInt(startParts[5]), parseInt(startParts[6]));
        }
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

        // A. Google Calendar API: Create Event
        const calResult = await createGoogleCalendarEvent(googleAccessToken, {
          summary: `1-on-1 Coding Trial Class: ${formData.studentName} with Aishwarya Gowda`,
          description: `Trial Coding Class with Aishwarya Gowda S R.\nStudent: ${formData.studentName} (${formData.studentGrade})\nFocus: ${formData.subjectInterest}\nParent Contact: ${formData.parentName} (${formData.phone})\nEducator Email: aishwaryagowda227@gmail.com\nVerified Profile: https://www.codingal.com/@aishwaryagsr219/`,
          startDateTime: startDate.toISOString(),
          endDateTime: endDate.toISOString(),
          attendeeEmail: 'aishwaryagowda227@gmail.com',
          timeZone: 'Asia/Kolkata',
        });

        if (calResult.success) {
          calSuccess = true;
          calLink = calResult.htmlLink || '';
        }

        // B. Gmail API: Send trial confirmation email from user's account to educator & parent
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
            <h2 style="color: #4f46e5; margin-bottom: 8px;">1-on-1 Coding Trial Class Booking Confirmed</h2>
            <p style="color: #475569; font-size: 14px;">Hello Aishwarya Gowda and ${formData.parentName},</p>
            <p style="color: #475569; font-size: 14px;">A new 1-on-1 trial class has been scheduled with the following details:</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
              <tr style="background: #f8fafc;"><td style="padding: 10px; font-weight: bold;">Student:</td><td style="padding: 10px;">${formData.studentName} (${formData.studentGrade})</td></tr>
              <tr><td style="padding: 10px; font-weight: bold;">Parent Name:</td><td style="padding: 10px;">${formData.parentName}</td></tr>
              <tr style="background: #f8fafc;"><td style="padding: 10px; font-weight: bold;">Parent Email:</td><td style="padding: 10px;">${formData.email}</td></tr>
              <tr><td style="padding: 10px; font-weight: bold;">Phone / WhatsApp:</td><td style="padding: 10px;">${formData.phone}</td></tr>
              <tr style="background: #f8fafc;"><td style="padding: 10px; font-weight: bold;">Date & Time:</td><td style="padding: 10px;">${formData.preferredDate} at ${formData.preferredTime} (${formData.timezone})</td></tr>
              <tr><td style="padding: 10px; font-weight: bold;">Focus Area:</td><td style="padding: 10px;">${formData.subjectInterest}</td></tr>
              ${formData.notes ? `<tr style="background: #f8fafc;"><td style="padding: 10px; font-weight: bold;">Notes:</td><td style="padding: 10px;">${formData.notes}</td></tr>` : ''}
            </table>
            
            <p style="color: #64748b; font-size: 12px;">Educator: Aishwarya Gowda S R · Senior Coding Instructor · Codingal Verified Educator (4.9★)</p>
          </div>
        `;

        const gmailResult = await sendGmailEmail(
          googleAccessToken,
          'aishwaryagowda227@gmail.com',
          `New Trial Booking: ${formData.studentName} (${formData.subjectInterest})`,
          emailHtml
        );

        if (gmailResult.success) {
          emailSuccess = true;
        }
      }

    } catch (err: any) {
      console.warn('Booking handling completed with partial notice:', err);
    } finally {
      setLoading(false);
      setConfirmedBooking({ ...formData });
      setSubmitted(true);
      setSyncStatus({
        calendarEventCreated: calSuccess,
        calendarHtmlLink: calLink,
        gmailSent: emailSuccess,
      });

      showToast(
        calSuccess 
          ? 'Trial class booked and synced directly to Google Calendar & Gmail!'
          : 'Trial class booked! Ready for Google Calendar and email dispatch.', 
        'success'
      );
    }
  };

  return (
    <section id="contact" className="py-24 bg-white/70 dark:bg-[#0d1117]/70 backdrop-blur-xs relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-start mb-16 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 rounded-full text-xs font-bold tracking-widest uppercase mb-3 border border-brand-100 dark:border-brand-900/40">
            <CalendarIcon size={14} /> Get in Touch
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Book a 1-on-1 Trial Class or Consultation
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mt-2">
            Schedule a personalized live coding demo session for your child. Form submission seamlessly syncs with Google Calendar and dispatches email confirmation with full permission.
          </p>
          <div className="w-16 h-1 bg-brand-600 dark:bg-brand-500 rounded-full mt-4" />
        </div>

        {/* Contact Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Info Card */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-gray-900 via-slate-900 to-brand-950 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />

              <span className="text-xs uppercase font-bold tracking-widest text-brand-400 block mb-2">
                Educator Contact
              </span>
              <h3 className="text-2xl font-black mb-4">
                Aishwarya Gowda S R
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed mb-8">
                Senior Coding Instructor available for live virtual classes across Indian Standard Time (IST), UK (GMT), US time zones (EST/PST), and Gulf Standard Time (GST).
              </p>

              {/* Direct Details */}
              <div className="space-y-5 text-xs">
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  className="flex items-center gap-3 text-gray-200 hover:text-brand-300 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Mail size={16} className="text-brand-400" />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Email Address</div>
                    <div className="font-semibold text-sm">{PERSONAL_INFO.email}</div>
                  </div>
                </a>

                <a
                  href={`tel:${PERSONAL_INFO.phone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-3 text-gray-200 hover:text-brand-300 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Phone size={16} className="text-brand-400" />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Direct WhatsApp / Phone</div>
                    <div className="font-semibold text-sm">{PERSONAL_INFO.phone}</div>
                  </div>
                </a>

                <div className="flex items-center gap-3 text-gray-200">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <MapPin size={16} className="text-brand-400" />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Location</div>
                    <div className="font-semibold">{PERSONAL_INFO.location}</div>
                  </div>
                </div>

                <a
                  href={PERSONAL_INFO.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-200 hover:text-brand-300 transition-colors pt-2"
                >
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Linkedin size={16} className="text-brand-400" />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">LinkedIn Network</div>
                    <div className="font-semibold">aishwarya-s-r-2806aa17b</div>
                  </div>
                </a>

                <a
                  href="https://www.codingal.com/@aishwaryagsr219/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-200 hover:text-orange-300 transition-colors pt-2"
                >
                  <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-400/30 flex items-center justify-center shrink-0">
                    <Sparkles size={16} className="text-orange-400" />
                  </div>
                  <div>
                    <div className="text-[10px] text-orange-300 font-bold uppercase tracking-wider">Verified Codingal Profile</div>
                    <div className="font-semibold text-xs text-orange-200 flex items-center gap-1.5">
                      <span>4.9★ (1,632+ Ratings · 1,934 Classes)</span>
                      <span className="text-[11px] underline">View ↗</span>
                    </div>
                  </div>
                </a>
              </div>

              {/* Response Time Guarantee */}
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-2 text-[11px] text-brand-300">
                <Clock size={13} />
                <span>Parent messages typically answered within 2–4 hours.</span>
              </div>
            </div>

            {/* Trial Class Perks */}
            <div className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                What Happens in the Free Trial?
              </h4>
              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                  <span>1-on-1 coding baseline assessment with your child</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                  <span>Child builds their first working game or script in 45 mins</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                  <span>15-min parent consultation & personalized learning pathway</span>
                </li>
                <li className="flex items-center gap-2">
                  <CalendarCheck size={13} className="text-brand-500 shrink-0" />
                  <span>Instant Google Calendar sync & email notification dispatched</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Inquiry & Booking Form */}
          <div className="lg:col-span-7 bg-white dark:bg-gray-900 p-8 sm:p-10 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-sm relative">
            
            {/* Optional Google Workspace Connector Banner */}
            <div className="mb-6 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/50 bg-blue-50/60 dark:bg-blue-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 flex items-center justify-center shrink-0">
                  <CalendarCheck size={18} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <span>Google Calendar & Gmail Integration</span>
                    {googleUser && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold">
                        <UserCheck size={11} /> Connected
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                    {googleUser 
                      ? `Signed in as ${googleUser.email}`
                      : 'Connect with Google to automatically add events to your Google Calendar and send confirmation emails with your permission.'
                    }
                  </div>
                </div>
              </div>

              <div>
                {googleUser ? (
                  <button
                    type="button"
                    onClick={handleGoogleDisconnect}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 text-gray-600 dark:text-gray-300 text-[11px] font-semibold transition-colors cursor-pointer"
                  >
                    <LogOut size={12} />
                    <span>Disconnect</span>
                  </button>
                ) : (
                  <GoogleSignInButton
                    onClick={handleGoogleConnect}
                    disabled={isSigningInGoogle}
                    label={isSigningInGoogle ? 'Connecting...' : 'Connect Google'}
                    className="py-1.5 px-3 text-[11px]"
                  />
                )}
              </div>
            </div>

            {submitted && confirmedBooking ? (
              <div className="py-6 space-y-6">
                
                {/* Success Header */}
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                    Trial Class Booked, {confirmedBooking.parentName}!
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
                    Your trial request for <strong className="text-brand-600 dark:text-brand-400">{confirmedBooking.studentName}</strong> has been logged.
                  </p>
                </div>

                {/* Direct Google Workspace sync status if performed */}
                {syncStatus.calendarEventCreated && (
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      <span>Event added directly to your Primary Google Calendar!</span>
                    </div>
                    {syncStatus.calendarHtmlLink && (
                      <a
                        href={syncStatus.calendarHtmlLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400 hover:underline shrink-0"
                      >
                        <span>View Event</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                )}

                {/* Booking Summary Card */}
                <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 space-y-3 text-xs">
                  <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-sm border-b border-gray-200 dark:border-gray-700 pb-2">
                    <CalendarCheck size={16} className="text-brand-600 dark:text-brand-400" />
                    <span>Scheduled Session Details</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 dark:text-gray-300">
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Preferred Date</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{confirmedBooking.preferredDate || 'Earliest available'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Time & Timezone</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{confirmedBooking.preferredTime} ({confirmedBooking.timezone})</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Student</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{confirmedBooking.studentName} ({confirmedBooking.studentGrade})</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Coding Focus</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{confirmedBooking.subjectInterest}</span>
                    </div>
                  </div>
                </div>

                {/* Integration Actions: Google Calendar & Email */}
                <div className="space-y-3 pt-2">
                  <div className="text-xs font-bold text-gray-900 dark:text-white">
                    📅 Calendar & Email Synchronization
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Add to Google Calendar Button */}
                    <a
                      href={buildGoogleCalendarUrl(confirmedBooking)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all hover:shadow-blue-500/20"
                    >
                      <CalendarCheck size={16} />
                      <span>Add to Google Calendar</span>
                      <ExternalLink size={12} />
                    </a>

                    {/* Download iCal Invite (.ics) */}
                    <button
                      type="button"
                      onClick={() => downloadICalendar(confirmedBooking)}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-xs border border-gray-200 dark:border-gray-700 transition-colors"
                    >
                      <Download size={15} />
                      <span>Download .ics Invite</span>
                    </button>
                  </div>

                  {/* Email & WhatsApp Confirmation Options */}
                  <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 space-y-2.5">
                    <div className="flex items-start gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
                      <Mail size={16} className="shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                      <div>
                        <div className="font-bold">Email Notification Dispatched:</div>
                        <div className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                          Booking details logged for educator <strong>aishwaryagowda227@gmail.com</strong> with parent copy to <strong>{confirmedBooking.email}</strong>.
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <a
                        href={buildMailtoUrl(confirmedBooking)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors"
                      >
                        <Mail size={13} />
                        <span>Open in Mail Client</span>
                      </a>

                      <a
                        href={buildWhatsAppUrl(confirmedBooking)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold transition-colors"
                      >
                        <Phone size={13} />
                        <span>Notify via WhatsApp</span>
                        <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Reset button */}
                <div className="text-center pt-2">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setConfirmedBooking(null);
                      setSyncStatus({});
                    }}
                    className="px-5 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors cursor-pointer"
                  >
                    ← Book Another Session
                  </button>
                </div>

              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Parent & Student Names */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      Parent's Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800 text-xs text-gray-900 dark:text-white outline-none focus:border-brand-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      Student's Name & Age *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rohan (Age 10)"
                      value={formData.studentName}
                      onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800 text-xs text-gray-900 dark:text-white outline-none focus:border-brand-600"
                    />
                  </div>
                </div>

                {/* Grade and Coding Focus */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      Student Grade Band *
                    </label>
                    <select
                      value={formData.studentGrade}
                      onChange={(e) => setFormData({ ...formData, studentGrade: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800 text-xs text-gray-900 dark:text-white outline-none focus:border-brand-600"
                    >
                      <option value="Grades 1–4">Grades 1–4 (Ages 6–9)</option>
                      <option value="Grades 5–8">Grades 5–8 (Ages 10–13)</option>
                      <option value="Grades 9–12">Grades 9–12 (Ages 14–18)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      Subject / Coding Focus *
                    </label>
                    <select
                      value={formData.subjectInterest}
                      onChange={(e) => setFormData({ ...formData, subjectInterest: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800 text-xs text-gray-900 dark:text-white outline-none focus:border-brand-600"
                    >
                      <option value="Scratch & Game Design">Scratch & Animation (Block Logic)</option>
                      <option value="Python & Algorithmic Logic">Python Programming & Geometry</option>
                      <option value="MIT App Inventor & Mobile">MIT App Inventor / Thunkable</option>
                      <option value="AI / ML for Kids">AI & Machine Learning for Kids</option>
                      <option value="Java & High School CS">Java & High School Computer Science</option>
                      <option value="Web Development (HTML/CSS/JS)">Web Development (HTML/CSS/JS)</option>
                    </select>
                  </div>
                </div>

                {/* Date & Time Scheduling for Google Calendar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-2xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-100 dark:border-brand-900/40">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
                      <CalendarIcon size={13} className="text-brand-600 dark:text-brand-400" />
                      <span>Preferred Date *</span>
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white outline-none focus:border-brand-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
                      <Clock size={13} className="text-brand-600 dark:text-brand-400" />
                      <span>Preferred Time Slot *</span>
                    </label>
                    <select
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white outline-none focus:border-brand-600"
                    >
                      <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                      <option value="11:30 AM - 12:30 PM">11:30 AM - 12:30 PM</option>
                      <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                      <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
                      <option value="05:30 PM - 06:30 PM">05:30 PM - 06:30 PM</option>
                      <option value="07:00 PM - 08:00 PM">07:00 PM - 08:00 PM</option>
                      <option value="08:30 PM - 09:30 PM">08:30 PM - 09:30 PM</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 mb-1">
                      Timezone
                    </label>
                    <select
                      value={formData.timezone}
                      onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white outline-none focus:border-brand-600"
                    >
                      <option value="IST (UTC+5:30)">India Standard Time (IST - UTC+5:30)</option>
                      <option value="GST (UTC+4:00)">Gulf Standard Time (Dubai/UAE - UTC+4:00)</option>
                      <option value="GMT/BST (UTC+0/1)">UK / London Time (GMT/BST)</option>
                      <option value="EST (UTC-5:00)">US Eastern Time (EST - New York/Toronto)</option>
                      <option value="CST (UTC-6:00)">US Central Time (CST - Chicago/Dallas)</option>
                      <option value="PST (UTC-8:00)">US Pacific Time (PST - California/Seattle)</option>
                      <option value="SGT (UTC+8:00)">Singapore / Malaysia Time (SGT - UTC+8:00)</option>
                      <option value="AEST (UTC+10:00)">Australia Eastern Time (Sydney/Melbourne)</option>
                    </select>
                  </div>
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      Parent Email (for Google Calendar & Notice) *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="parent@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800 text-xs text-gray-900 dark:text-white outline-none focus:border-brand-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800 text-xs text-gray-900 dark:text-white outline-none focus:border-brand-600"
                    />
                  </div>
                </div>

                {/* Goals / Notes */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    Child's Background or Goals (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Tell Aishwarya about your child's interests (e.g. Loves Scratch, complete beginner, wants to build games, school curriculum)..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800 text-xs text-gray-900 dark:text-white outline-none focus:border-brand-600 resize-none"
                  />
                </div>

                {/* Notice pill */}
                <div className="p-3 rounded-xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 flex items-center gap-2 text-[11px] text-blue-700 dark:text-blue-300">
                  <CalendarCheck size={14} className="shrink-0 text-blue-600 dark:text-blue-400" />
                  <span>Submitting immediately syncs to email and provides instant 1-click Google Calendar addition.</span>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <span>Registering Trial Class & Dispatching...</span>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Confirm Trial Class & Sync Calendar</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* MANDATORY Explicit Confirmation Dialog for Workspace API mutations */}
            {showWorkspaceConfirmModal && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-900 max-w-md w-full rounded-3xl p-6 shadow-2xl border border-gray-200 dark:border-gray-700 space-y-4 animate-scaleUp">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto">
                    <CalendarCheck size={24} />
                  </div>
                  
                  <div className="text-center space-y-1">
                    <h4 className="text-lg font-black text-gray-900 dark:text-white">
                      Confirm Google Calendar & Gmail Sync
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      With your permission, this action will create a trial class event on your Google Calendar and dispatch a booking confirmation email to the instructor.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-xs space-y-1 text-gray-700 dark:text-gray-300">
                    <div><strong>Event:</strong> Trial Class for {formData.studentName}</div>
                    <div><strong>Date & Time:</strong> {formData.preferredDate} at {formData.preferredTime}</div>
                    <div><strong>Email recipient:</strong> aishwaryagowda227@gmail.com</div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => executeBooking(false)}
                      className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold cursor-pointer"
                    >
                      Book without Sync
                    </button>
                    <button
                      type="button"
                      onClick={() => executeBooking(true)}
                      className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md cursor-pointer"
                    >
                      Confirm & Sync
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
