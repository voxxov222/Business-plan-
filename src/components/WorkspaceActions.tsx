import React, { useState } from 'react';
import { getAccessToken, googleSignIn } from '../lib/auth';
import { 
  createGoogleDoc, 
  createGoogleSheet, 
  updateGoogleSheet,
  createGoogleSlide, 
  createGoogleForm, 
  createGoogleMeet,
  createGoogleChatSpace,
  postMessageToChatSpace
} from '../lib/workspace';
import { data } from './Charts';
import { FileText, Table, Presentation, FileQuestion, Video, MessageSquare, Loader2, CheckCircle } from 'lucide-react';

export const WorkspaceActions = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAction = async (actionId: string, actionFn: (token: string) => Promise<any>, successMsg: string) => {
    setLoading(actionId);
    setSuccess(null);
    try {
      let token = await getAccessToken();
      if (!token) {
        const result = await googleSignIn();
        if (result) {
          token = result.accessToken;
        } else {
          throw new Error("Authentication failed");
        }
      }

      const res = await actionFn(token);
      console.log('Action successful', res);
      
      let link = '';
      if (res.documentId) link = `https://docs.google.com/document/d/${res.documentId}/edit`;
      else if (res.spreadsheetId) link = res.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${res.spreadsheetId}/edit`;
      else if (res.presentationId) link = `https://docs.google.com/presentation/d/${res.presentationId}/edit`;
      else if (res.formId) link = `https://docs.google.com/forms/d/${res.formId}/edit`;
      else if (res.meetingUri) link = res.meetingUri;
      else if (res.name && res.displayName) link = `https://chat.google.com/room/${res.name.split('/')[1]}`;
      
      if (link) {
        window.open(link, '_blank');
      }

      setSuccess(actionId);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to complete action. Check console for details.");
    } finally {
      setLoading(null);
    }
  };

  const actions = [
    {
      id: 'doc',
      name: 'Export to Docs',
      icon: <FileText className="w-5 h-5" />,
      color: 'bg-blue-500',
      action: (t: string) => createGoogleDoc(t, 'SafeMart Business Plan - Export')
    },
    {
      id: 'sheet',
      name: 'Export/Sync to Sheets',
      icon: <Table className="w-5 h-5" />,
      color: 'bg-green-600',
      action: async (t: string) => {
        const spreadsheetId = localStorage.getItem('spreadsheetId');
        const values = [
          ['Month', 'Revenue', 'Overhead', 'Profit'],
          ...data.map(d => [d.month, d.revenue, d.overhead, d.profit])
        ];

        if (spreadsheetId) {
          return await updateGoogleSheet(t, spreadsheetId, values);
        } else {
          const res = await createGoogleSheet(t, 'SafeMart Financial Projections');
          localStorage.setItem('spreadsheetId', res.spreadsheetId);
          await updateGoogleSheet(t, res.spreadsheetId, values);
          return res;
        }
      }
    },
    {
      id: 'slide',
      name: 'Export to Slides',
      icon: <Presentation className="w-5 h-5" />,
      color: 'bg-yellow-500',
      action: (t: string) => createGoogleSlide(t, 'SafeMart Pitch Deck')
    },
    {
      id: 'form',
      name: 'Create Feedback Form',
      icon: <FileQuestion className="w-5 h-5" />,
      color: 'bg-purple-500',
      action: (t: string) => createGoogleForm(t, 'Investor Feedback - SafeMart')
    },
    {
      id: 'meet',
      name: 'Schedule Meet',
      icon: <Video className="w-5 h-5" />,
      color: 'bg-teal-500',
      action: (t: string) => createGoogleMeet(t)
    },
    {
      id: 'chat',
      name: 'Create Investor Space',
      icon: <MessageSquare className="w-5 h-5" />,
      color: 'bg-indigo-500',
      action: async (t: string) => {
        const space = await createGoogleChatSpace(t, 'SafeMart Investors');
        await postMessageToChatSpace(t, space.name, 'Welcome to the SafeMart Investor Space! Here we will discuss the business plan and financial projections.');
        return space;
      }
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-24 border border-white/10 bg-zinc-900/30 p-12">
      <div className="col-span-full flex items-center space-x-4 mb-6 border-b border-white/10 pb-6">
        <h2 className="text-3xl font-light text-white tracking-tighter">Workspace <span className="font-serif italic text-sky-400">Integration</span></h2>
      </div>
      
      {actions.map((act) => (
        <button
          key={act.id}
          onClick={() => handleAction(act.id, act.action, act.name)}
          disabled={loading !== null}
          className={`flex items-center gap-3 p-4 border border-white/10 rounded hover:bg-white/5 transition-all text-left ${loading !== null && loading !== act.id ? 'opacity-50' : ''}`}
        >
          <div className={`p-2 rounded flex-shrink-0 ${act.color} text-white`}>
            {loading === act.id ? <Loader2 className="w-5 h-5 animate-spin" /> : success === act.id ? <CheckCircle className="w-5 h-5" /> : act.icon}
          </div>
          <div>
            <div className="text-sm font-bold text-white">{act.name}</div>
            <div className="text-[10px] uppercase tracking-widest opacity-50">Generate & Open</div>
          </div>
        </button>
      ))}
    </div>
  );
};
