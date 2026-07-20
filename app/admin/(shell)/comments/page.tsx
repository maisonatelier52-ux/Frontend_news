'use client';

import { useState, useEffect } from 'react';
import StatusBadge from '../../components/StatusBadge';
import { useAdminModal } from '../../components/AdminModalContext';

interface CommentItem {
  _id: string;
  articleId: string;
  articleTitle: string;
  name: string;
  email: string;
  text: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const TAB_LABELS: Record<string, string> = {
  all: 'All',
  pending: 'Pending',
  approved: 'Accepted',
  rejected: 'Rejected',
};

export default function CommentsPage() {
  const { showAlert, showConfirm } = useAdminModal();
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState<Record<string, boolean>>({});

  const loadComments = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/comments');
      if (res.ok) {
        const data = await res.json();
        setComments(data || []);
      }
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  const handleStatusChange = async (id: string, status: 'approved' | 'rejected') => {
    setBusy((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await fetch('/api/comments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setComments((prev) =>
          prev.map((c) => (c._id === id ? { ...c, status } : c))
        );
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setBusy((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleDeleteComment = (id: string) => {
    showConfirm(
      'Are you sure you want to delete this comment permanently?',
      async () => {
        setBusy((prev) => ({ ...prev, [`del_${id}`]: true }));
        try {
          const res = await fetch(`/api/comments?id=${id}`, { method: 'DELETE' });
          if (res.ok) {
            setComments((prev) => prev.filter((c) => c._id !== id));
            showAlert('Comment deleted successfully.', 'success', 'Deleted');
          } else {
            showAlert('Failed to delete comment.', 'error', 'Error');
          }
        } catch (err) {
          showAlert('Failed to delete comment.', 'error', 'Error');
        } finally {
          setBusy((prev) => ({ ...prev, [`del_${id}`]: false }));
        }
      },
      'Delete Comment'
    );
  };

  const filtered = comments.filter((c) => {
    const matchFilter = filter === 'all' || c.status === filter;
    const matchSearch =
      c.text.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.articleTitle.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    all: comments.length,
    pending: comments.filter((c) => c.status === 'pending').length,
    approved: comments.filter((c) => c.status === 'approved').length,
    rejected: comments.filter((c) => c.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        {/* <div className="w-9 h-9 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" /> */}
        {/* <p className="text-xs text-zinc-500 font-semibold tracking-wide font-mono">Loading comments...</p> */}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 leading-none">Comments Moderation</h1>
        <p className="text-sm text-zinc-500 mt-2 font-medium">
          {counts.pending} comments awaiting review
        </p>
      </div>

      {/* Filter tabs and search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 w-full sm:w-auto">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-semibold border rounded transition duration-200 cursor-pointer ${
                filter === f
                  ? 'bg-zinc-900 text-white border-zinc-900'
                  : 'bg-white text-zinc-650 border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              {TAB_LABELS[f]} <span className="opacity-60 font-mono">({counts[f]})</span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search comments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-zinc-200 rounded px-3 py-1.5 pl-8 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-500 bg-white"
          />
          <svg
            className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-lg p-12 text-center text-zinc-400 italic text-xs">
            No comments found.
          </div>
        ) : (
          filtered.map((comment) => (
            <div
              key={comment._id}
              className={`bg-white border border-l-4 rounded-lg p-5 transition hover:shadow-2xs ${
                comment.status === 'rejected'
                  ? 'border-zinc-200 border-l-red-500'
                  : comment.status === 'pending'
                  ? 'border-zinc-200 border-l-amber-500'
                  : 'border-zinc-200 border-l-emerald-500'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-700">
                    {comment.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-zinc-800">{comment.name}</h3>
                    <p className="text-[10px] text-zinc-400 font-medium">
                      {comment.email} ·{' '}
                      {new Date(comment.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <StatusBadge status={comment.status} />
              </div>

              <div className="text-[10px] text-zinc-500 font-medium mb-2 font-mono">
                On Article:{' '}
                <span className="font-sans italic text-zinc-700 font-semibold">
                  {comment.articleTitle}
                </span>
              </div>

              <p className="text-xs text-zinc-800 leading-relaxed mb-4 bg-zinc-50/50 p-3 rounded border border-zinc-100 font-sans">
                {comment.text}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {comment.status !== 'approved' && (
                  <button
                    onClick={() => handleStatusChange(comment._id, 'approved')}
                    disabled={!!busy[comment._id]}
                    className="px-3 py-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100/70 transition rounded cursor-pointer disabled:opacity-50"
                  >
                    {busy[comment._id] ? 'Accepting...' : 'Accept'}
                  </button>
                )}

                {comment.status !== 'rejected' && (
                  <button
                    onClick={() => handleStatusChange(comment._id, 'rejected')}
                    disabled={!!busy[comment._id]}
                    className="px-3 py-1 text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-250 hover:bg-amber-100/70 transition rounded cursor-pointer disabled:opacity-50"
                  >
                    {busy[comment._id] ? 'Rejecting...' : 'Reject'}
                  </button>
                )}

                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  disabled={!!busy[`del_${comment._id}`]}
                  className="px-3 py-1 text-[11px] font-semibold bg-red-50 text-red-650 border border-red-200 hover:bg-red-100/75 transition rounded cursor-pointer ml-auto disabled:opacity-50"
                >
                  {busy[`del_${comment._id}`] ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
