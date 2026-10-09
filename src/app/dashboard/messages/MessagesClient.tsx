'use client';

import { useState, useEffect } from 'react';
import { Conversation, Message, AuthSession } from '@/lib/types';
import { MessageSquare, Send, Building2, User, Clock, Check, RefreshCw } from 'lucide-react';

interface Props {
  initialConversations: Conversation[];
  currentUser: AuthSession;
  initialSelectedId?: string;
}

export default function MessagesClient({
  initialConversations,
  currentUser,
  initialSelectedId,
}: Props) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeConvId, setActiveConvId] = useState<string | null>(
    initialSelectedId || (initialConversations.length > 0 ? initialConversations[0].id : null)
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    if (activeConvId) {
      loadMessages(activeConvId);
      const timer = setInterval(() => loadMessages(activeConvId), 6000);
      return () => clearInterval(timer);
    }
  }, [activeConvId]);

  async function loadMessages(convId: string) {
    try {
      setLoadingMessages(true);
      const res = await fetch(`/api/messages?conversationId=${convId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch {
      // ignore
    } finally {
      setLoadingMessages(false);
    }
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !activeConvId) return;

    try {
      setSending(true);
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConvId,
          content: newMessage.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, data.message]);
        setNewMessage('');
      } else {
        alert(data.error || 'Failed to send message');
      }
    } catch {
      alert('Error sending message');
    } finally {
      setSending(false);
    }
  }

  const activeConv = conversations.find((c) => c.id === activeConvId);

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">
            Secure Platform Communications
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            In-Platform Recruiter & Candidate Messaging
          </h1>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-3 min-h-[580px]">
          {/* Conversation List Sidebar */}
          <div className="border-r border-slate-200 bg-slate-50/50 flex flex-col">
            <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-600" />
                Conversations ({conversations.length})
              </span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No active conversations yet. Initiate communication through candidate reviews or job vacancies.
                </div>
              ) : (
                conversations.map((c) => {
                  const isActive = c.id === activeConvId;
                  const title =
                    currentUser.role === 'employer'
                      ? c.seeker_name || 'Candidate'
                      : c.company_name || 'Employer';

                  return (
                    <button
                      key={c.id}
                      onClick={() => setActiveConvId(c.id)}
                      className={`w-full p-4 text-left transition flex items-start gap-3 ${
                        isActive ? 'bg-cyan-50/80 border-l-4 border-cyan-600' : 'hover:bg-slate-100/60'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-slate-200 flex items-center justify-center flex-shrink-0 text-slate-600">
                        {currentUser.role === 'employer' ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <Building2 className="w-4 h-4" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-bold text-slate-900 text-xs truncate">{title}</span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(c.updated_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        {c.job_title && (
                          <div className="text-[11px] text-cyan-700 font-medium truncate mb-1">
                            {c.job_title}
                          </div>
                        )}
                        <p className="text-[11px] text-slate-500 truncate">
                          {c.last_message || 'Start conversation...'}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Active Chat Timeline */}
          <div className="md:col-span-2 flex flex-col h-full bg-white">
            {activeConv ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      {currentUser.role === 'employer' ? activeConv.seeker_name : activeConv.company_name}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {activeConv.job_title ? `Regarding: ${activeConv.job_title}` : 'Direct Recruitment Message'}
                    </p>
                  </div>

                  <button
                    onClick={() => loadMessages(activeConv.id)}
                    className="p-2 text-slate-400 hover:text-slate-700"
                    title="Refresh messages"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>

                {/* Messages Timeline */}
                <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 bg-slate-50/30">
                  {messages.length === 0 ? (
                    <div className="text-center py-16 text-xs text-slate-400">
                      No messages in this chat yet. Send an opening message below.
                    </div>
                  ) : (
                    messages.map((m) => {
                      const isMe = m.sender_id === currentUser.userId;
                      return (
                        <div
                          key={m.id}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed ${
                              isMe
                                ? 'bg-cyan-600 text-white rounded-tr-none'
                                : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-xs'
                            }`}
                          >
                            {m.content}
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 px-1">
                            {new Date(m.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Message Input Box */}
                <form onSubmit={handleSend} className="p-4 border-t border-slate-100 bg-white">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-cyan-500"
                    />
                    <button
                      type="submit"
                      disabled={sending || !newMessage.trim()}
                      className="p-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold transition flex items-center justify-center disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-slate-400 p-8 text-center">
                Select a conversation on the left to view messages.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
