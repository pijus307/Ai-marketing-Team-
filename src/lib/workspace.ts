import { getAccessToken } from './firebase';

export interface WorkspaceTask {
  id: string;
  title: string;
  status?: string;
  notes?: string;
  due?: string;
}

export interface WorkspaceCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
  htmlLink?: string;
}

export interface WorkspaceDriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
}

export interface WorkspaceGmailMessage {
  id: string;
  snippet?: string;
  internalDate?: string;
}

/**
 * Fetch helper with Bearer token authentication
 */
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getAccessToken();
  if (!token) {
    throw new Error('No active Google OAuth access token. Please sign in with Google.');
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Google API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// ==========================================
// 1. GOOGLE TASKS API
// ==========================================
export async function getGoogleTasks(): Promise<WorkspaceTask[]> {
  try {
    const listsData = await fetchWithAuth('https://tasks.googleapis.com/tasks/v1/users/@default/lists');
    const defaultList = listsData.items?.[0];
    if (!defaultList) return [];

    const tasksData = await fetchWithAuth(`https://tasks.googleapis.com/tasks/v1/lists/${defaultList.id}/tasks?showCompleted=true&maxResults=20`);
    return tasksData.items || [];
  } catch (err) {
    console.error('Failed to fetch Google Tasks:', err);
    throw err;
  }
}

export async function createGoogleTask(title: string, notes?: string, due?: string): Promise<WorkspaceTask> {
  const listsData = await fetchWithAuth('https://tasks.googleapis.com/tasks/v1/users/@default/lists');
  const listId = listsData.items?.[0]?.id || '@default';

  return fetchWithAuth(`https://tasks.googleapis.com/tasks/v1/lists/${listId}/tasks`, {
    method: 'POST',
    body: JSON.stringify({ title, notes, due }),
  });
}

// ==========================================
// 2. GMAIL API
// ==========================================
export async function getGmailMessages(maxResults = 5): Promise<WorkspaceGmailMessage[]> {
  const listData = await fetchWithAuth(`https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}`);
  if (!listData.messages || listData.messages.length === 0) return [];

  const details = await Promise.all(
    listData.messages.map((m: { id: string }) =>
      fetchWithAuth(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${m.id}?format=minimal`)
    )
  );

  return details;
}

export async function sendGmailEmail(to: string, subject: string, bodyText: string) {
  // Construct raw RFC 2822 email message encoded in base64url format
  const rawEmail = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset="UTF-8"',
    '',
    bodyText,
  ].join('\r\n');

  const base64Encoded = btoa(unescape(encodeURIComponent(rawEmail)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return fetchWithAuth('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    body: JSON.stringify({ raw: base64Encoded }),
  });
}

// ==========================================
// 3. GOOGLE DOCS API
// ==========================================
export async function createGoogleDoc(title: string): Promise<{ documentId: string; title: string }> {
  return fetchWithAuth('https://docs.googleapis.com/v1/documents', {
    method: 'POST',
    body: JSON.stringify({ title }),
  });
}

// ==========================================
// 4. GOOGLE SHEETS API
// ==========================================
export async function createGoogleSheet(title: string): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
  return fetchWithAuth('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    body: JSON.stringify({ properties: { title } }),
  });
}

// ==========================================
// 5. GOOGLE CALENDAR API
// ==========================================
export async function getCalendarEvents(): Promise<WorkspaceCalendarEvent[]> {
  const now = new Date().toISOString();
  const data = await fetchWithAuth(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(
      now
    )}&maxResults=10&orderBy=startTime&singleEvents=true`
  );
  return data.items || [];
}

export async function createCalendarEvent(
  summary: string,
  description: string,
  startTimeIso: string,
  endTimeIso: string
): Promise<WorkspaceCalendarEvent> {
  return fetchWithAuth('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    body: JSON.stringify({
      summary,
      description,
      start: { dateTime: startTimeIso },
      end: { dateTime: endTimeIso },
    }),
  });
}

// ==========================================
// 6. GOOGLE DRIVE API
// ==========================================
export async function getDriveFiles(): Promise<WorkspaceDriveFile[]> {
  const data = await fetchWithAuth(
    'https://www.googleapis.com/drive/v3/files?pageSize=15&fields=files(id,name,mimeType,webViewLink)'
  );
  return data.files || [];
}
