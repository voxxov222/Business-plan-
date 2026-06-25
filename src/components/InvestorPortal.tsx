import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  HelpCircle, 
  Trash2, 
  CornerDownRight, 
  ChevronDown, 
  Lock, 
  AlertCircle,
  Filter,
  UserCheck,
  Check,
  User,
  Clock,
  MessageCircle
} from 'lucide-react';
import { 
  subscribeToComments, 
  addComment, 
  replyToComment, 
  toggleCommentResolved, 
  deleteComment, 
  Comment, 
  SECTION_NAMES,
  testFirestoreConnection
} from '../lib/comments';
import { googleSignIn, auth } from '../lib/auth';
import { User as FirebaseUser } from 'firebase/auth';

export const InvestorPortal = () => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(auth.currentUser);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [submittingComment, setSubmittingComment] = useState<boolean>(false);
  
  // New Comment Form States
  const [selectedSection, setSelectedSection] = useState<string>('executive-summary');
  const [commentText, setCommentText] = useState<string>('');

  // Reply state mapped by comment ID
  const [replyTexts, setReplyTexts] = useState<{ [commentId: string]: string }>({});
  const [submittingReplies, setSubmittingReplies] = useState<{ [commentId: string]: boolean }>({});

  const isOwner = currentUser?.email === 'toddwilliam420@gmail.com';

  // Listen for Auth changes
  useEffect(() => {
    testFirestoreConnection();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Listen for real-time comments from Firestore
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToComments(
      (loadedComments) => {
        setComments(loadedComments);
        setLoading(false);
      },
      (err) => {
        setError("Failed to load comments: " + err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const handleLogin = async () => {
    try {
      setError(null);
      const result = await googleSignIn();
      if (result) {
        setCurrentUser(result.user);
      }
    } catch (err: any) {
      console.error(err);
      setError("Login failed. Please verify credentials or try again.");
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    setError(null);
    try {
      await addComment(selectedSection, commentText.trim());
      setCommentText('');
    } catch (err: any) {
      setError("Failed to post comment. Ensure your email is verified.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handlePostReply = async (commentId: string) => {
    const text = replyTexts[commentId];
    if (!text || !text.trim()) return;

    setSubmittingReplies(prev => ({ ...prev, [commentId]: true }));
    try {
      await replyToComment(commentId, text.trim());
      setReplyTexts(prev => ({ ...prev, [commentId]: '' }));
    } catch (err: any) {
      setError("Failed to submit response.");
    } finally {
      setSubmittingReplies(prev => ({ ...prev, [commentId]: false }));
    }
  };

  const handleToggleResolve = async (comment: Comment) => {
    try {
      await toggleCommentResolved(comment.id, comment.resolved);
    } catch (err: any) {
      setError("Failed to update status.");
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await deleteComment(commentId);
    } catch (err: any) {
      setError("Failed to delete comment.");
    }
  };

  // Filter comments
  const filteredComments = useMemo(() => {
    if (activeFilter === 'all') return comments;
    return comments.filter(c => c.sectionId === activeFilter);
  }, [comments, activeFilter]);

  // Format timestamps helper
  const formatTime = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-24 border border-white/10 bg-zinc-950 p-6 sm:p-10 relative overflow-hidden"
      id="investor-portal-comments-section"
    >
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/[0.01] rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <span className="text-[10px] tracking-[0.3em] uppercase text-emerald-400 font-bold block">Interactive Collaboration Hub</span>
          <h2 className="text-3xl font-light text-white tracking-tighter">
            Investor Portal & <span className="font-serif italic text-emerald-400">Feedback Hub</span>
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Submit inquiries, request documentation details, or leaves feedback directly in specific segments. Active inquiries will be monitored and answered directly by our primary director.
          </p>
        </div>
      </div>

      {!currentUser ? (
        /* Sign In Request UI */
        <div className="border border-white/5 bg-[#09090c] p-8 text-center max-w-2xl mx-auto space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/[0.01] rounded-full blur-3xl pointer-events-none" />
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Lock className="w-5 h-5" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-lg font-light text-white tracking-tight">Access Interactive Investor Hub</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sign in securely via Google to read active feedback, submit formal loan questions, or leaves suggestions on business chapters.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogin}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-mono font-bold text-xs uppercase hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            Sign In with Google
          </button>
        </div>
      ) : (
        /* Main Interactive Portal */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: SUBMIT AN INQUIRY / COMMENT */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-zinc-900/20 border border-white/5 p-6 space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-2 border-b border-white/5 pb-3">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                Submit Formal Inquiry
              </h3>

              <form onSubmit={handlePostComment} className="space-y-4">
                {/* Select Section Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-500 uppercase block">Target Business Plan Section</label>
                  <div className="relative">
                    <select
                      value={selectedSection}
                      onChange={(e) => setSelectedSection(e.target.value)}
                      className="w-full bg-[#050507] border border-white/10 p-3 text-xs text-slate-300 focus:outline-none focus:border-emerald-400 appearance-none rounded-none cursor-pointer"
                    >
                      {Object.entries(SECTION_NAMES).map(([id, name]) => (
                        <option key={id} value={id}>{name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>

                {/* Question / Comment Body */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 uppercase">
                    <label>Inquiry Message</label>
                    <span>{commentText.length}/2000</span>
                  </div>
                  <textarea
                    rows={4}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value.slice(0, 2000))}
                    placeholder="Enter your specific question, feedback, or requested validation about this section..."
                    required
                    className="w-full bg-[#050507] border border-white/10 p-3 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-emerald-400 resize-none rounded-none"
                  />
                </div>

                {error && (
                  <div className="bg-rose-500/5 border border-rose-500/10 p-3 text-[11px] text-rose-400 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submittingComment || !commentText.trim()}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-slate-500 text-black font-mono font-bold text-xs uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submittingComment ? (
                    <span className="inline-block animate-pulse">Submitting Inquiry...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Publish Inquiry
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Logged in User Profile Info Card */}
            <div className="bg-[#050507] border border-white/5 p-4 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-3">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt={currentUser.displayName || ''} referrerPolicy="no-referrer" className="w-8 h-8 rounded-full border border-white/10" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-white">
                    <User className="w-4 h-4" />
                  </div>
                )}
                <div>
                  <span className="text-white font-bold block leading-tight">{currentUser.displayName}</span>
                  <span className="text-[10px] text-slate-500">{currentUser.email}</span>
                </div>
              </div>
              {isOwner && (
                <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 font-bold uppercase tracking-wider">
                  Plan Owner
                </span>
              )}
            </div>
          </div>

          {/* RIGHT: REAL-TIME FEEDBACK STREAM */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-1.5 border-b border-white/5 pb-4">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider border transition-all ${
                  activeFilter === 'all'
                    ? 'border-emerald-400 text-emerald-400 bg-emerald-500/5'
                    : 'border-white/5 text-slate-400 hover:text-white bg-zinc-900/20'
                }`}
              >
                All Sections ({comments.length})
              </button>
              {Object.entries(SECTION_NAMES).map(([id, name]) => {
                const count = comments.filter(c => c.sectionId === id).length;
                if (count === 0) return null; // Only show section tabs that have comments
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveFilter(id)}
                    className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider border transition-all ${
                      activeFilter === id
                        ? 'border-emerald-400 text-emerald-400 bg-emerald-500/5'
                        : 'border-white/5 text-slate-400 hover:text-white bg-zinc-900/20'
                    }`}
                  >
                    {name.split(' ')[0]} ({count})
                  </button>
                );
              })}
            </div>

            {/* Comments Stream */}
            {loading ? (
              <div className="py-20 text-center text-xs font-mono text-slate-500 animate-pulse">
                Synchronizing with Secure Cloud Database...
              </div>
            ) : filteredComments.length === 0 ? (
              <div className="border border-dashed border-white/5 bg-[#030305] p-12 text-center space-y-3">
                <MessageCircle className="w-8 h-8 text-slate-700 mx-auto" />
                <p className="text-xs font-mono text-slate-500">
                  No active comments or inquiries recorded in this filter.
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence initial={false}>
                  {filteredComments.map((comment) => {
                    const isCommentAuthor = comment.authorUid === currentUser.uid;
                    const canModify = isCommentAuthor || isOwner;

                    return (
                      <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`p-4 border text-xs leading-relaxed space-y-3 transition-colors ${
                          comment.resolved 
                            ? 'border-white/5 bg-[#060608]/50 opacity-90' 
                            : 'border-white/10 bg-[#0c0c0f]'
                        }`}
                      >
                        {/* Meta Row */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-2">
                            {comment.authorPhoto ? (
                              <img src={comment.authorPhoto} alt={comment.authorName} className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-white uppercase">
                                {comment.authorName.slice(0, 2)}
                              </div>
                            )}
                            <div>
                              <span className="font-bold text-slate-200 block">{comment.authorName}</span>
                              <span className="text-[9px] text-slate-500 font-mono flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTime(comment.createdAt)}
                              </span>
                            </div>
                          </div>

                          {/* Section Tag & Resolved Badge */}
                          <div className="flex flex-col items-end gap-1 font-mono text-[9px]">
                            <span className="bg-white/5 text-slate-400 border border-white/10 px-1.5 py-0.5 uppercase tracking-wider">
                              {SECTION_NAMES[comment.sectionId] || comment.sectionId}
                            </span>
                            {comment.resolved ? (
                              <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 font-bold uppercase tracking-wider flex items-center gap-0.5">
                                <Check className="w-2.5 h-2.5" />
                                Resolved
                              </span>
                            ) : (
                              <span className="text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 font-bold uppercase tracking-wider flex items-center gap-0.5">
                                <HelpCircle className="w-2.5 h-2.5 animate-pulse" />
                                Pending
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Comment Body */}
                        <p className="text-slate-300 font-light break-words pl-1 whitespace-pre-line">
                          {comment.text}
                        </p>

                        {/* Action buttons (Delete, Toggle Resolve) */}
                        {canModify && (
                          <div className="flex items-center gap-3 pt-1 border-t border-white/5">
                            <button
                              type="button"
                              onClick={() => handleToggleResolve(comment)}
                              className="text-[10px] font-mono text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {comment.resolved ? 'Re-open Inquiry' : 'Mark as Resolved'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(comment.id)}
                              className="text-[10px] font-mono text-rose-500 hover:underline flex items-center gap-1 ml-auto cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </div>
                        )}

                        {/* Owner Response Segment */}
                        {comment.response ? (
                          <div className="bg-emerald-500/[0.02] border-l-2 border-emerald-500/40 p-3 mt-2 ml-4 space-y-1.5">
                            <div className="flex justify-between items-center text-[9px] font-mono">
                              <span className="text-emerald-400 font-bold flex items-center gap-1">
                                <CornerDownRight className="w-3 h-3" />
                                Response from {comment.responseAuthorName}
                              </span>
                              <span className="text-slate-500">{formatTime(comment.responseCreatedAt)}</span>
                            </div>
                            <p className="text-slate-300 font-light font-serif italic whitespace-pre-line">
                              "{comment.response}"
                            </p>
                          </div>
                        ) : null}

                        {/* Write Response Segment (Only for Plan Owner) */}
                        {isOwner && !comment.response && (
                          <div className="pt-2 ml-4 pl-4 border-l border-white/5 space-y-2">
                            <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                              <CornerDownRight className="w-3 h-3" />
                              Draft Official Reply
                            </div>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={replyTexts[comment.id] || ''}
                                onChange={(e) => setReplyTexts(prev => ({ ...prev, [comment.id]: e.target.value }))}
                                placeholder="Write response to this investor inquiry..."
                                className="flex-1 bg-[#050507] border border-white/10 p-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-400 rounded-none"
                              />
                              <button
                                type="button"
                                onClick={() => handlePostReply(comment.id)}
                                disabled={submittingReplies[comment.id] || !replyTexts[comment.id]?.trim()}
                                className="px-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-slate-500 text-black font-mono font-bold text-[10px] uppercase transition-colors flex items-center justify-center cursor-pointer"
                              >
                                {submittingReplies[comment.id] ? 'Publishing...' : 'Reply'}
                              </button>
                            </div>
                          </div>
                        )}

                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>

        </div>
      )}

    </motion.section>
  );
};
