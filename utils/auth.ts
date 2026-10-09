export interface PublisherInfo {
  name: string;
  email: string;
  role: string;
  avatar: string;
  bio: string;
}

export const DEFAULT_PUBLISHER: PublisherInfo = {
  name: 'Madhurya Gowda SR',
  email: 'pgowda6021@gmail.com',
  role: 'Author & Publisher',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  bio: 'Writing reflective essays, stories, personal thoughts, and creative narratives.',
};

const SESSION_KEY = 'inkwell_publisher_session_v2';
const PASSCODE_KEY = 'inkwell_publisher_passcode_v2';
const DEFAULT_PASSCODE = 'publisher2026';
const BACKUP_PASSCODE = 'madhurya2026';

export function isPublisherAuthenticated(): boolean {
  try {
    const session = localStorage.getItem(SESSION_KEY);
    if (!session) return false;
    const parsed = JSON.parse(session);
    return Boolean(parsed && parsed.authenticated === true);
  } catch {
    return false;
  }
}

export function getStoredPublisherPasscode(): string {
  try {
    return localStorage.getItem(PASSCODE_KEY) || DEFAULT_PASSCODE;
  } catch {
    return DEFAULT_PASSCODE;
  }
}

export function loginPublisher(inputPasscode: string): { success: boolean; message?: string } {
  const cleanInput = (inputPasscode || '').trim();
  const currentPasscode = getStoredPublisherPasscode();

  if (!cleanInput) {
    return { success: false, message: 'Please enter the publisher passcode.' };
  }

  // Check against active passcode or backup/default
  if (cleanInput === currentPasscode || cleanInput === DEFAULT_PASSCODE || cleanInput === BACKUP_PASSCODE) {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        authenticated: true,
        authenticatedAt: new Date().toISOString(),
        email: DEFAULT_PUBLISHER.email,
        name: DEFAULT_PUBLISHER.name,
      }));
    } catch (e) {
      console.error('Session write error', e);
    }
    return { success: true };
  }

  return { 
    success: false, 
    message: 'Incorrect passcode. Only the publisher can access publishing and editing privileges.' 
  };
}

export function logoutPublisher(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (e) {
    console.error('Session remove error', e);
  }
}

export function getPublisherInfo(): PublisherInfo {
  return DEFAULT_PUBLISHER;
}

export function setCustomPublisherPasscode(newPasscode: string): boolean {
  if (!newPasscode || newPasscode.trim().length < 4) return false;
  try {
    localStorage.setItem(PASSCODE_KEY, newPasscode.trim());
    return true;
  } catch {
    return false;
  }
}
