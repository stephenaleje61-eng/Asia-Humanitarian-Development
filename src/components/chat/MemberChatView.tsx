import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Conversation, ChatMessage } from '../../types';
import { 
  getOrCreateConversation, 
  subscribeToConversation,
  subscribeToMessages, 
  sendMessage, 
  markConversationAsRead 
} from '../../services/db';
import { 
  Send, 
  Paperclip, 
  ShieldCheck, 
  Check,
  CheckCheck, 
  X,
  FileText,
  AlertCircle,
  RefreshCw,
  Ban,
  Download,
  ArrowRight
} from 'lucide-react';

interface MemberChatViewProps {
  openAuthModal: () => void;
  onOpenAdmin?: () => void;
}

const MAX_ATTACHMENT_BYTES = 500 * 1024; // 500 KB limit for base64 Firestore safety

export const MemberChatView: React.FC<MemberChatViewProps> = ({ openAuthModal, onOpenAdmin }) => {
  const { user, userProfile, isAdmin, loading: authLoading, signInWithGoogle } = useAuth();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [authSigningIn, setAuthSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [retryCounter, setRetryCounter] = useState(0);

  const [attachment, setAttachment] = useState<{ name: string; url: string; type: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize or fetch conversation after auth finishes resolving
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      setConversation(null);
      setMessages([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    getOrCreateConversation({
      uid: user.uid,
      displayName: userProfile?.displayName || user.displayName || 'Community Member',
      email: userProfile?.email || user.email || 'member@asia-ngo.org',
      country: userProfile?.country || 'International',
      photoURL: userProfile?.photoURL || user.photoURL || undefined,
    })
      .then((conv) => {
        if (cancelled) return;
        setConversation(conv);
        if (conv.unreadForUser > 0) {
          markConversationAsRead(conv.id, 'member').catch(console.warn);
        }
      })
      .catch((err: any) => {
        if (cancelled) return;
        console.error('Failed to init conversation:', err);
        setError(err?.message || 'Unable to establish your encrypted consultation channel. Please try again.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user?.uid, authLoading, retryCounter]);

  // Real-time subscription to conversation metadata (blocked status, unread count)
  useEffect(() => {
    if (!conversation?.id) return;

    const unsubscribe = subscribeToConversation(
      conversation.id,
      (updatedConv) => {
        if (updatedConv) {
          setConversation(updatedConv);
          if (updatedConv.unreadForUser > 0) {
            markConversationAsRead(updatedConv.id, 'member').catch(console.warn);
          }
        }
      },
      (err) => {
        console.error('Conversation listener error:', err);
        setError(err.message || 'Real-time consultation stream disconnected.');
      }
    );

    return () => unsubscribe();
  }, [conversation?.id]);

  // Subscribe to real-time messages
  useEffect(() => {
    if (!conversation?.id) return;

    const unsubscribe = subscribeToMessages(
      conversation.id,
      (newMessages) => {
        setMessages(newMessages);
      },
      (err) => {
        console.error('Messages listener error:', err);
        setError(err.message || 'Unable to load message stream.');
      }
    );

    return () => unsubscribe();
  }, [conversation?.id]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleDirectGoogleSignIn = async () => {
    setAuthSigningIn(true);
    setAuthError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setAuthError(err?.message || 'Google sign-in was cancelled or blocked by your browser.');
    } finally {
      setAuthSigningIn(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputText.trim() && !attachment) || !conversation || !user || conversation.blocked) return;

    const textToSend = inputText.trim() || (attachment ? `Attached: ${attachment.name}` : '');
    const currentAttachment = attachment;
    const prevInput = inputText;

    setInputText('');
    setAttachment(null);
    setSendError(null);
    setSending(true);

    try {
      await sendMessage(conversation.id, {
        senderId: user.uid,
        senderName: userProfile?.displayName || user.displayName || 'Member',
        senderRole: 'member',
        text: textToSend,
        attachmentUrl: currentAttachment?.url,
        attachmentName: currentAttachment?.name,
        attachmentType: currentAttachment?.type,
      });
    } catch (err: any) {
      console.error('Error sending message:', err);
      setInputText(prevInput);
      setAttachment(currentAttachment);
      setSendError(err?.message || 'Message failed to send. Please check your connection and try again.');
    } finally {
      setSending(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setSendError(null);

    if (file.size > MAX_ATTACHMENT_BYTES) {
      setSendError(`Attachment "${file.name}" exceeds the 500 KB maximum size limit.`);
      return;
    }

    const isImg = file.type.startsWith('image/');
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (result.length > 800000) {
        setSendError(`Encoded attachment "${file.name}" is too large to transmit.`);
        return;
      }
      setAttachment({
        name: file.name,
        url: result,
        type: isImg ? 'image' : 'document',
      });
    };
    reader.onerror = () => {
      setSendError('Could not read the selected file.');
    };
    reader.readAsDataURL(file);
  };

  if (authLoading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center text-xs text-stone-500">
        Verifying your authenticated session...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg border border-stone-200 shadow-sm p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#142B45] text-[#C9A45C] flex items-center justify-center mx-auto text-2xl font-serif">
            亞
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold text-[#142B45]">
              Private 1-on-1 Humanitarian Consultation
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Sign in with your Google account to open your permanent, private consultation channel directly with our administration directors and programme coordinators.
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded text-left">
              {authError}
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleDirectGoogleSignIn}
              disabled={authSigningIn}
              className="w-full py-3 px-6 rounded border border-stone-300 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-800 transition-colors shadow-xs flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{authSigningIn ? 'Signing in...' : 'Continue with Google to Start Chatting'}</span>
            </button>

            <button
              onClick={openAuthModal}
              className="text-xs text-stone-500 hover:text-[#142B45] underline"
            >
              More Sign-In Information
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
      {isAdmin && onOpenAdmin && (
        <div className="bg-[#142B45] text-white px-5 py-3 rounded-lg border border-[#C9A45C]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C9A45C] shrink-0" />
            <span>
              You are signed in as <strong>Administrator</strong>. View and reply to all member & enquiry conversations in the Admin Inbox.
            </span>
          </div>
          <button
            onClick={onOpenAdmin}
            className="px-3.5 py-1.5 rounded bg-[#C9A45C] text-[#142B45] font-bold hover:bg-[#E0C17E] transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
          >
            <span>Open Admin Chat Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg border border-stone-300 shadow-md flex flex-col h-[700px] overflow-hidden">
        
        {/* Chat Header */}
        <div className="bg-[#142B45] text-white px-6 py-4 border-b border-[#C9A45C]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-[#C9A45C] text-[#142B45] font-serif font-bold text-base flex items-center justify-center border border-white/20">
                亞
              </div>
              <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-[#142B45] rounded-full ${
                conversation?.blocked ? 'bg-red-500' : 'bg-emerald-500'
              }`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-white">
                  Humanitarian Administration Secretariat
                </h3>
                <span className={`text-[10px] font-mono border px-1.5 py-0.2 rounded font-bold uppercase ${
                  conversation?.blocked
                    ? 'bg-red-950 text-red-300 border-red-700/60'
                    : 'bg-emerald-950 text-emerald-400 border-emerald-700/60'
                }`}>
                  {conversation?.blocked ? 'Restricted' : 'Live'}
                </span>
              </div>
              <p className="text-[11px] text-stone-300">
                Private 1-on-1 Consultation Line · {userProfile?.displayName || user.email}
              </p>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-[11px] font-mono text-[#C9A45C] block">
              REF: {conversation?.id || 'Connecting...'}
            </span>
            <span className="text-[10px] text-stone-400">Real-Time Firestore Sync</span>
          </div>
        </div>

        {/* Informational Guidance Notice */}
        <div className="bg-[#F8F6F0] px-6 py-2.5 border-b border-stone-200 text-xs text-stone-600 flex items-center justify-between">
          <span>
            You are speaking directly with our designated Humanitarian Operations team.
          </span>
          <span className="text-[11px] text-stone-500 font-mono">
            Direct & Confidential
          </span>
        </div>

        {/* Channel Restricted Banner */}
        {conversation?.blocked && (
          <div className="bg-red-50 border-b border-red-200 px-6 py-3 flex items-center gap-2.5 text-xs text-red-800">
            <Ban className="w-4 h-4 shrink-0 text-red-600" />
            <span>
              Messaging on this channel has been temporarily restricted by an administrator. Please contact{' '}
              <strong>secretariat@asian-humanitarian.org</strong> for account assistance.
            </span>
          </div>
        )}

        {/* Message History Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#F2F4F6]/40">
          {loading ? (
            <div className="h-full flex items-center justify-center text-xs text-stone-400">
              Connecting to secure database stream...
            </div>
          ) : error ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-stone-800 text-base">
                Unable to Open Consultation Channel
              </h4>
              <p className="text-xs text-red-700 max-w-md bg-red-50 border border-red-200 rounded p-3">
                {error}
              </p>
              <button
                onClick={() => setRetryCounter((c) => c + 1)}
                className="px-4 py-2 rounded text-xs font-semibold bg-[#142B45] text-white hover:bg-[#1E3E63] flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Connection</span>
              </button>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                <ShieldCheck className="w-6 h-6 text-[#C9A45C]" />
              </div>
              <h4 className="font-serif font-bold text-stone-800 text-base">
                Private Consultation Channel Ready
              </h4>
              <p className="text-xs text-stone-500 max-w-sm">
                Send your message below regarding volunteer deployments, institutional partnerships, or programme support. Messages appear in real time for our administrators.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId === user.uid && msg.senderRole === 'member';
              const isMsgAdmin = msg.senderRole === 'admin';
              
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-stone-500">
                    <span className="font-semibold text-stone-700">
                      {isMe ? 'You' : msg.senderName}
                    </span>
                    {isMsgAdmin && (
                      <span className="text-[9px] font-mono uppercase bg-[#142B45] text-[#C9A45C] px-1 rounded font-bold">
                        Admin
                      </span>
                    )}
                    <span>·</span>
                    <span className="font-mono">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 text-xs leading-relaxed shadow-xs ${
                      isMe
                        ? 'bg-[#142B45] text-white rounded-tr-none'
                        : 'bg-white text-stone-900 border border-stone-200 rounded-tl-none'
                    }`}
                  >
                    {msg.attachmentUrl && (
                      <div className="mb-2 p-2 rounded bg-black/10 border border-white/20">
                        {msg.attachmentType === 'image' ? (
                          <img
                            src={msg.attachmentUrl}
                            alt={msg.attachmentName || 'Attachment'}
                            className="max-h-48 rounded object-cover w-full"
                          />
                        ) : (
                          <a
                            href={msg.attachmentUrl}
                            download={msg.attachmentName || 'document'}
                            className="flex items-center gap-2 text-xs hover:underline"
                          >
                            <FileText className="w-4 h-4 text-[#C9A45C] shrink-0" />
                            <span className="font-semibold truncate">{msg.attachmentName || 'Document'}</span>
                            <Download className="w-3.5 h-3.5 shrink-0 ml-auto opacity-80" />
                          </a>
                        )}
                      </div>
                    )}

                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>

                  {isMe && (
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-stone-400 px-1">
                      {conversation && conversation.unreadForAdmin === 0 ? (
                        <span className="flex items-center gap-0.5 text-emerald-700">
                          <CheckCheck className="w-3 h-3" />
                          <span>Read by Administration</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-0.5">
                          <Check className="w-3 h-3" />
                          <span>Delivered</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Send Error Strip */}
        {sendError && (
          <div className="px-6 py-2 bg-red-50 border-t border-red-200 flex items-center justify-between text-xs text-red-700">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{sendError}</span>
            </div>
            <button
              type="button"
              onClick={() => setSendError(null)}
              className="p-1 text-red-400 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Attachment Pending Strip */}
        {attachment && (
          <div className="px-6 py-2 bg-stone-100 border-t border-stone-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate text-stone-700">
              <FileText className="w-4 h-4 text-[#C9A45C]" />
              <span className="font-medium truncate">{attachment.name}</span>
            </div>
            <button
              type="button"
              onClick={() => setAttachment(null)}
              className="p-1 text-stone-400 hover:text-stone-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Message Input Bar */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t border-stone-200 flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
          />
          
          <button
            type="button"
            disabled={!conversation || conversation.blocked || Boolean(error)}
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded text-stone-500 hover:text-[#142B45] hover:bg-stone-100 disabled:opacity-40 transition-colors"
            title="Attach File or Image (max 500 KB)"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={!conversation || conversation.blocked || Boolean(error)}
            placeholder={
              conversation?.blocked
                ? 'This consultation channel is currently restricted'
                : 'Type your confidential message to the administration...'
            }
            className="flex-1 px-4 py-2.5 text-xs border border-stone-300 rounded focus:border-[#C9A45C] focus:outline-none bg-[#F8F6F0] disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={sending || !conversation || conversation.blocked || Boolean(error) || (!inputText.trim() && !attachment)}
            className="px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider bg-[#142B45] text-white hover:bg-[#1E3E63] disabled:opacity-40 transition-colors shadow-sm flex items-center gap-2"
          >
            <Send className="w-3.5 h-3.5 text-[#C9A45C]" />
            <span>{sending ? 'Sending...' : 'Send'}</span>
          </button>
        </form>

      </div>
    </div>
  );
};
