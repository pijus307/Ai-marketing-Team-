import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Mail, 
  FileText, 
  Table, 
  Calendar, 
  HardDrive, 
  Plus, 
  Send, 
  RefreshCw, 
  ExternalLink,
  Lock,
  UserCheck,
  LogOut,
  AlertCircle
} from 'lucide-react';
import { googleSignIn, initAuth, logout, getAccessToken } from '../lib/firebase';
import { 
  getGoogleTasks, 
  createGoogleTask, 
  getGmailMessages, 
  sendGmailEmail, 
  createGoogleDoc, 
  createGoogleSheet, 
  getCalendarEvents, 
  createCalendarEvent, 
  getDriveFiles,
  WorkspaceTask,
  WorkspaceCalendarEvent,
  WorkspaceDriveFile,
  WorkspaceGmailMessage
} from '../lib/workspace';

export function GoogleWorkspaceHub() {
  const [user, setUser] = useState<any>(null);
  const [hasToken, setHasToken] = useState(false);
  const [activeTab, setActiveTab] = useState<'tasks' | 'gmail' | 'docs_sheets' | 'calendar' | 'drive'>('tasks');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Google Tasks State
  const [tasks, setTasks] = useState<WorkspaceTask[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Gmail State
  const [messages, setMessages] = useState<WorkspaceGmailMessage[]>([]);
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // Calendar State
  const [events, setEvents] = useState<WorkspaceCalendarEvent[]>([]);
  const [eventSummary, setEventSummary] = useState('');
  const [eventStart, setEventStart] = useState('');

  // Drive State
  const [files, setFiles] = useState<WorkspaceDriveFile[]>([]);

  // Docs & Sheets State
  const [docTitle, setDocTitle] = useState('');
  const [sheetTitle, setSheetTitle] = useState('');

  useEffect(() => {
    const unsubscribe = initAuth((currentUser) => {
      setUser(currentUser);
      const token = getAccessToken();
      setHasToken(!!token);
    }, () => {
      setUser(null);
      setHasToken(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const handleSignIn = async () => {
    setLoading(true);
    setStatusMsg(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setHasToken(!!res.accessToken);
        setStatusMsg('Successfully authenticated with Google Workspace!');
      }
    } catch (err: any) {
      console.error(err);
      setStatusMsg(`Authentication failed: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setHasToken(false);
    setTasks([]);
    setMessages([]);
    setEvents([]);
    setFiles([]);
  };

  // 1. Fetch Tasks
  const loadTasks = async () => {
    setLoading(true);
    try {
      const list = await getGoogleTasks();
      setTasks(list);
    } catch (err: any) {
      setStatusMsg(`Tasks Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    if (!window.confirm(`Add Google Task: "${newTaskTitle}"?`)) return;

    setLoading(true);
    try {
      await createGoogleTask(newTaskTitle, 'Created from AI Marketing OS');
      setNewTaskTitle('');
      await loadTasks();
      setStatusMsg('New task added to Google Tasks!');
    } catch (err: any) {
      setStatusMsg(`Error adding task: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch Gmail Messages & Send Email
  const loadGmail = async () => {
    setLoading(true);
    try {
      const msgs = await getGmailMessages(5);
      setMessages(msgs);
    } catch (err: any) {
      setStatusMsg(`Gmail Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailTo || !emailSubject || !emailBody) return;

    if (!window.confirm(`Send email to ${emailTo} with subject "${emailSubject}"?`)) return;

    setLoading(true);
    try {
      await sendGmailEmail(emailTo, emailSubject, emailBody);
      setEmailTo('');
      setEmailSubject('');
      setEmailBody('');
      setStatusMsg('Email sent successfully via Gmail!');
      await loadGmail();
    } catch (err: any) {
      setStatusMsg(`Error sending email: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 3. Docs & Sheets
  const handleCreateDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle) return;

    if (!window.confirm(`Create Google Document titled "${docTitle}"?`)) return;

    setLoading(true);
    try {
      const docRes = await createGoogleDoc(docTitle);
      setDocTitle('');
      setStatusMsg(`Google Doc created! ID: ${docRes.documentId}`);
    } catch (err: any) {
      setStatusMsg(`Error creating Google Doc: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSheet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sheetTitle) return;

    if (!window.confirm(`Create Google Spreadsheet titled "${sheetTitle}"?`)) return;

    setLoading(true);
    try {
      const sheetRes = await createGoogleSheet(sheetTitle);
      setSheetTitle('');
      setStatusMsg(`Google Sheet created! URL: ${sheetRes.spreadsheetUrl}`);
    } catch (err: any) {
      setStatusMsg(`Error creating Google Sheet: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 4. Calendar Events
  const loadCalendar = async () => {
    setLoading(true);
    try {
      const evs = await getCalendarEvents();
      setEvents(evs);
    } catch (err: any) {
      setStatusMsg(`Calendar Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventSummary || !eventStart) return;

    if (!window.confirm(`Schedule Google Calendar event "${eventSummary}" for ${eventStart}?`)) return;

    setLoading(true);
    try {
      const startDate = new Date(eventStart);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

      await createCalendarEvent(
        eventSummary,
        'Scheduled from AI Marketing OS Campaign Planner',
        startDate.toISOString(),
        endDate.toISOString()
      );
      setEventSummary('');
      setEventStart('');
      await loadCalendar();
      setStatusMsg('Event added to Google Calendar!');
    } catch (err: any) {
      setStatusMsg(`Error adding calendar event: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 5. Drive Files
  const loadDrive = async () => {
    setLoading(true);
    try {
      const fList = await getDriveFiles();
      setFiles(fList);
    } catch (err: any) {
      setStatusMsg(`Drive Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasToken) {
      if (activeTab === 'tasks') loadTasks();
      if (activeTab === 'gmail') loadGmail();
      if (activeTab === 'calendar') loadCalendar();
      if (activeTab === 'drive') loadDrive();
    }
  }, [hasToken, activeTab]);

  return (
    <div id="google-workspace-hub" className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-blue-800 rounded-2xl p-6 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-500/20 text-blue-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-400/30">
              Google Workspace OS
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Google Workspace Integration</h2>
          <p className="text-slate-300 text-sm mt-1">
            Direct real-time orchestration for Tasks, Gmail, Docs, Sheets, Calendar, and Drive.
          </p>
        </div>

        <div>
          {!user || !hasToken ? (
            <button
              id="btn-google-signin"
              onClick={handleSignIn}
              disabled={loading}
              className="flex items-center gap-3 bg-white text-slate-800 hover:bg-slate-100 font-medium px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <span>{loading ? 'Authenticating...' : 'Sign in with Google'}</span>
            </button>
          ) : (
            <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700 px-4 py-2 rounded-xl">
              <div className="text-right">
                <p className="text-xs font-semibold text-slate-200">{user.displayName || 'Google User'}</p>
                <p className="text-[11px] text-slate-400">{user.email}</p>
              </div>
              <button
                id="btn-google-signout"
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-700 transition"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {statusMsg && (
        <div className="p-3 bg-blue-950/60 border border-blue-800/80 text-blue-200 text-sm rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-blue-400 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Workspace Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          id="tab-google-tasks"
          onClick={() => setActiveTab('tasks')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
            activeTab === 'tasks' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Google Tasks</span>
        </button>

        <button
          id="tab-gmail"
          onClick={() => setActiveTab('gmail')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
            activeTab === 'gmail' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Gmail</span>
        </button>

        <button
          id="tab-docs-sheets"
          onClick={() => setActiveTab('docs_sheets')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
            activeTab === 'docs_sheets' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Docs & Sheets</span>
        </button>

        <button
          id="tab-calendar"
          onClick={() => setActiveTab('calendar')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
            activeTab === 'calendar' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Google Calendar</span>
        </button>

        <button
          id="tab-drive"
          onClick={() => setActiveTab('drive')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
            activeTab === 'drive' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <HardDrive className="w-4 h-4" />
          <span>Google Drive</span>
        </button>
      </div>

      {!hasToken && (
        <div className="p-8 bg-slate-900/80 border border-slate-800 rounded-2xl text-center space-y-3">
          <Lock className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-lg font-semibold text-slate-200">Google Workspace Sign-In Required</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Please sign in with your Google Account above to authorize the AI Marketing OS to interact with your Google Tasks, Gmail, Docs, Sheets, Calendar, and Drive.
          </p>
        </div>
      )}

      {hasToken && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          {/* TAB 1: GOOGLE TASKS */}
          {activeTab === 'tasks' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-blue-400" />
                  <span>Google Tasks Management</span>
                </h3>
                <button
                  onClick={loadTasks}
                  disabled={loading}
                  className="p-2 text-slate-400 hover:text-slate-200 bg-slate-800 rounded-lg"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <form onSubmit={handleAddTask} className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter new marketing task..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={loading || !newTaskTitle.trim()}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Task</span>
                </button>
              </form>

              <div className="space-y-2">
                {tasks.length === 0 ? (
                  <p className="text-sm text-slate-500 italic py-4 text-center">No tasks found or click refresh to load.</p>
                ) : (
                  tasks.map((t) => (
                    <div key={t.id} className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl flex items-center justify-between">
                      <span className="text-sm text-slate-200">{t.title}</span>
                      <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                        {t.status || 'needsAction'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: GMAIL */}
          {activeTab === 'gmail' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                <Mail className="w-5 h-5 text-red-400" />
                <span>Gmail Composer & Inbox</span>
              </h3>

              <form onSubmit={handleSendEmail} className="space-y-4 bg-slate-950 p-4 border border-slate-800 rounded-xl">
                <h4 className="text-sm font-medium text-slate-300">Compose Marketing Email</h4>
                <input
                  type="email"
                  placeholder="Recipient email address..."
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="Subject line..."
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                />
                <textarea
                  rows={3}
                  placeholder="Email body content..."
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={loading || !emailTo || !emailSubject || !emailBody}
                  className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Email</span>
                </button>
              </form>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium text-slate-300">Recent Messages</h4>
                  <button onClick={loadGmail} className="text-xs text-blue-400 hover:underline">
                    Refresh
                  </button>
                </div>
                {messages.map((m) => (
                  <div key={m.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300">
                    <p className="font-mono text-slate-400">ID: {m.id}</p>
                    <p className="text-slate-200 mt-1">{m.snippet}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DOCS & SHEETS */}
          {activeTab === 'docs_sheets' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Docs */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
                <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span>Google Docs Creator</span>
                </h4>
                <form onSubmit={handleCreateDoc} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Document Title (e.g., SEO Strategy Brief)..."
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={loading || !docTitle}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Doc</span>
                  </button>
                </form>
              </div>

              {/* Sheets */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
                <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <Table className="w-4 h-4 text-emerald-400" />
                  <span>Google Sheets Creator</span>
                </h4>
                <form onSubmit={handleCreateSheet} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Spreadsheet Title (e.g., Q3 Lead Funnel Tracker)..."
                    value={sheetTitle}
                    onChange={(e) => setSheetTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={loading || !sheetTitle}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Sheet</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: CALENDAR */}
          {activeTab === 'calendar' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-400" />
                  <span>Google Calendar Campaigns</span>
                </h3>
                <button onClick={loadCalendar} className="p-2 text-slate-400 hover:text-slate-200 bg-slate-800 rounded-lg">
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <form onSubmit={handleAddEvent} className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-950 p-4 border border-slate-800 rounded-xl">
                <input
                  type="text"
                  placeholder="Event Summary (e.g., Campaign Launch)..."
                  value={eventSummary}
                  onChange={(e) => setEventSummary(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="datetime-local"
                  value={eventStart}
                  onChange={(e) => setEventStart(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={loading || !eventSummary || !eventStart}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>Schedule Event</span>
                </button>
              </form>

              <div className="space-y-2">
                {events.map((ev) => (
                  <div key={ev.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-sm">
                    <div>
                      <p className="font-semibold text-slate-200">{ev.summary}</p>
                      <p className="text-xs text-slate-400">{ev.start?.dateTime || ev.start?.date}</p>
                    </div>
                    {ev.htmlLink && (
                      <a href={ev.htmlLink} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline flex items-center gap-1 text-xs">
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: DRIVE */}
          {activeTab === 'drive' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                  <HardDrive className="w-5 h-5 text-amber-400" />
                  <span>Google Drive Assets</span>
                </h3>
                <button onClick={loadDrive} className="p-2 text-slate-400 hover:text-slate-200 bg-slate-800 rounded-lg">
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {files.map((f) => (
                  <div key={f.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                    <div className="truncate mr-2">
                      <p className="font-medium text-slate-200 truncate">{f.name}</p>
                      <p className="text-slate-500 truncate">{f.mimeType}</p>
                    </div>
                    {f.webViewLink && (
                      <a href={f.webViewLink} target="_blank" rel="noreferrer" className="text-amber-400 hover:underline flex items-center gap-1 shrink-0">
                        <span>Open</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
