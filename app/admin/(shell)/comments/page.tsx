'use client'

import { useState } from 'react'
import StatusBadge from '../../components/StatusBadge'

const initialComments = [
  { id: 1, article: 'US Senate Passes Major Infrastructure Bill', author: 'John Smith', email: 'john@example.com', comment: 'Great coverage! This bill will really help our state. The infrastructure has been neglected for decades.', date: 'Jun 29, 2026 · 10:45 AM', status: 'pending' },
  { id: 2, article: 'Tech Giants Face New Antitrust Scrutiny', author: 'Maria Garcia', email: 'maria@example.com', comment: 'About time! These companies have too much power. The EU should be doing this too.', date: 'Jun 29, 2026 · 9:30 AM', status: 'approved' },
  { id: 3, article: 'Global Markets Rally on Fed Rate Decision', author: 'Robert Lee', email: 'r.lee@example.com', comment: 'Buy the dip! This is the best investment advice I can give. Visit my website for more tips!', date: 'Jun 29, 2026 · 8:15 AM', status: 'spam' },
  { id: 4, article: 'Climate Summit: Nations Agree on New Targets', author: 'Emma Watson', email: 'emma@example.com', comment: 'These targets are not ambitious enough. We need real action, not just pledges on paper.', date: 'Jun 28, 2026 · 4:20 PM', status: 'pending' },
  { id: 5, article: 'Sports Roundup: World Cup Qualifiers', author: 'Carlos Mendez', email: 'carlos@example.com', comment: 'Amazing match! The team played brilliantly in the second half. Can\'t wait for the finals.', date: 'Jun 28, 2026 · 2:10 PM', status: 'approved' },
  { id: 6, article: 'Supreme Court Rules on Privacy Case', author: 'Jane Doe', email: 'jane@example.com', comment: 'This ruling sets a dangerous precedent for personal data rights. Very concerning decision.', date: 'Jun 27, 2026 · 11:30 AM', status: 'pending' },
  { id: 7, article: 'AI Startup Raises $500M in Series C', author: 'Spambot3000', email: 'spam@fake.com', comment: 'Click here to earn money fast!!! FREE BITCOIN!!! Visit www.spam.com', date: 'Jun 27, 2026 · 9:00 AM', status: 'spam' },
]

export default function CommentsPage() {
  const [comments, setComments] = useState(initialComments)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = comments.filter((c) => {
    const matchFilter = filter === 'all' || c.status === filter
    const matchSearch = c.comment.toLowerCase().includes(search.toLowerCase()) || c.author.toLowerCase().includes(search.toLowerCase()) || c.article.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  function setStatus(id: number, status: string) {
    setComments((prev) => prev.map((c) => c.id === id ? { ...c, status } : c))
  }

  function deleteComment(id: number) {
    setComments((prev) => prev.filter((c) => c.id !== id))
  }

  const counts = {
    all: comments.length,
    pending: comments.filter((c) => c.status === 'pending').length,
    approved: comments.filter((c) => c.status === 'approved').length,
    spam: comments.filter((c) => c.status === 'spam').length,
  }

  return (
    <div style={{ maxWidth: 1100 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111', margin: 0 }}>Comments Moderation</h1>
        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{counts.pending} comments awaiting review</p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
        {(['all', 'pending', 'approved', 'spam'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '7px 14px', fontSize: 13, border: '1px solid', borderRadius: 6, cursor: 'pointer',
              background: filter === f ? '#111' : '#fff',
              color: filter === f ? '#fff' : '#374151',
              borderColor: filter === f ? '#111' : '#e4e4e7',
              fontWeight: filter === f ? 600 : 400,
              textTransform: 'capitalize',
            }}
          >
            {f} <span style={{ fontSize: 11, opacity: 0.7 }}>({counts[f]})</span>
          </button>
        ))}

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #e4e4e7', borderRadius: 6, padding: '6px 12px' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            id="comments-search"
            type="text"
            placeholder="Search comments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: 'none', background: 'transparent', fontSize: 13, outline: 'none', width: 180 }}
          />
        </div>
      </div>

      {/* Comments list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.length === 0 ? (
          <div style={{ background: '#fff', border: '1px solid #e4e4e7', borderRadius: 8, padding: 40, textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>
            No comments found.
          </div>
        ) : (
          filtered.map((comment) => (
            <div
              key={comment.id}
              style={{
                background: '#fff',
                border: `1px solid ${comment.status === 'spam' ? '#fecaca' : comment.status === 'pending' ? '#fde68a' : '#e4e4e7'}`,
                borderLeft: `3px solid ${comment.status === 'spam' ? '#dc2626' : comment.status === 'pending' ? '#d97706' : '#16a34a'}`,
                borderRadius: 8,
                padding: 18,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#f4f4f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#374151', flexShrink: 0 }}>
                    {comment.author.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>{comment.author}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af' }}>{comment.email} · {comment.date}</div>
                  </div>
                </div>
                <StatusBadge status={comment.status as 'approved' | 'pending' | 'spam'} />
              </div>

              <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>
                On: <span style={{ fontStyle: 'italic', color: '#374151' }}>{comment.article}</span>
              </div>

              <p style={{ fontSize: 14, color: '#111', margin: '0 0 14px', lineHeight: 1.6 }}>{comment.comment}</p>

              <div style={{ display: 'flex', gap: 8 }}>
                {comment.status !== 'approved' && (
                  <button onClick={() => setStatus(comment.id, 'approved')}
                    style={{ padding: '5px 12px', fontSize: 12, background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', borderRadius: 5, cursor: 'pointer', fontWeight: 500 }}>
                    ✓ Approve
                  </button>
                )}
                {comment.status !== 'spam' && (
                  <button onClick={() => setStatus(comment.id, 'spam')}
                    style={{ padding: '5px 12px', fontSize: 12, background: '#fff', color: '#d97706', border: '1px solid #fde68a', borderRadius: 5, cursor: 'pointer' }}>
                    Mark as Spam
                  </button>
                )}
                <button onClick={() => deleteComment(comment.id)}
                  style={{ padding: '5px 12px', fontSize: 12, background: '#fff', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 5, cursor: 'pointer' }}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
