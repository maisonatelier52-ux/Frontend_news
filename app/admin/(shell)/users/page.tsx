'use client'

import { useState } from 'react'
import StatusBadge from '../../components/StatusBadge'

const initialUsers = [
  { id: 1, name: 'Admin User', email: 'admin@newssite.com', role: 'admin', status: 'active', articles: 0, lastLogin: 'Jun 29, 2026 · 10:00 AM' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah@newssite.com', role: 'editor', status: 'active', articles: 312, lastLogin: 'Jun 29, 2026 · 9:45 AM' },
  { id: 3, name: 'Michael Chen', email: 'michael@newssite.com', role: 'editor', status: 'active', articles: 245, lastLogin: 'Jun 28, 2026 · 4:30 PM' },
  { id: 4, name: 'Emily Davis', email: 'emily@newssite.com', role: 'reporter', status: 'active', articles: 198, lastLogin: 'Jun 28, 2026 · 2:15 PM' },
  { id: 5, name: 'James Wilson', email: 'james@newssite.com', role: 'reporter', status: 'inactive', articles: 167, lastLogin: 'Jun 20, 2026 · 11:00 AM' },
  { id: 6, name: 'Lisa Park', email: 'lisa@newssite.com', role: 'reporter', status: 'active', articles: 143, lastLogin: 'Jun 29, 2026 · 8:30 AM' },
  { id: 7, name: 'Tom Bradley', email: 'tom@newssite.com', role: 'viewer', status: 'active', articles: 0, lastLogin: 'Jun 25, 2026 · 3:00 PM' },
]

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers)
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'reporter', status: 'active' })

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = filterRole === 'all' || u.role === filterRole
    return matchSearch && matchRole
  })

  function addUser() {
    if (!newUser.name || !newUser.email) return
    setUsers((prev) => [...prev, { id: prev.length + 1, ...newUser, articles: 0, lastLogin: 'Never' }])
    setNewUser({ name: '', email: '', role: 'reporter', status: 'active' })
    setShowModal(false)
  }

  function toggleStatus(id: number) {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u))
  }

  function deleteUser(id: number) {
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }

  const inputStyle: React.CSSProperties = { width: '100%', border: '1px solid #e4e4e7', borderRadius: 6, padding: '8px 12px', fontSize: 13, color: '#111', outline: 'none', background: '#fff', boxSizing: 'border-box' }

  return (
    <div style={{ maxWidth: 1100 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111', margin: 0 }}>User Management</h1>
          <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{users.length} team members</p>
        </div>
        <button onClick={() => setShowModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#111', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add User
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #e4e4e7', borderRadius: 6, padding: '7px 12px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input id="users-search" type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ border: 'none', background: 'transparent', fontSize: 13, outline: 'none', flex: 1 }} />
        </div>
        <select id="users-filter-role" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}
          style={{ border: '1px solid #e4e4e7', borderRadius: 6, padding: '7px 12px', fontSize: 13, color: '#374151', background: '#fff', cursor: 'pointer', outline: 'none' }}>
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="reporter">Reporter</option>
          <option value="viewer">Viewer</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #e4e4e7', borderRadius: 8, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9f9f9', borderBottom: '1px solid #e4e4e7' }}>
              {['User', 'Email', 'Role', 'Articles', 'Status', 'Last Login', 'Actions'].map((h) => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, color: '#9ca3af', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((user, i) => (
              <tr key={user.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f4f4f5' : 'none' }}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#111', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                      {user.name.charAt(0)}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#111' }}>{user.name}</span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#6b7280' }}>{user.email}</td>
                <td style={{ padding: '12px 16px' }}>
                  <StatusBadge status={user.role as 'admin' | 'editor' | 'reporter' | 'viewer'} />
                </td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#374151' }}>{user.articles}</td>
                <td style={{ padding: '12px 16px' }}>
                  <StatusBadge status={user.status as 'active' | 'inactive'} />
                </td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#9ca3af' }}>{user.lastLogin}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => toggleStatus(user.id)} style={{ fontSize: 11, color: '#374151', background: '#fff', border: '1px solid #e4e4e7', borderRadius: 4, padding: '3px 8px', cursor: 'pointer' }}>
                      {user.status === 'active' ? 'Disable' : 'Enable'}
                    </button>
                    {user.role !== 'admin' && (
                      <button onClick={() => deleteUser(user.id)} style={{ fontSize: 11, color: '#dc2626', background: '#fff', border: '1px solid #fecaca', borderRadius: 4, padding: '3px 8px', cursor: 'pointer' }}>Delete</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 32, width: 440, border: '1px solid #e4e4e7' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#111' }}>Add New User</div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#9ca3af', lineHeight: 1 }}>×</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 5 }}>Full Name *</label>
                <input value={newUser.name} onChange={(e) => setNewUser((p) => ({ ...p, name: e.target.value }))} placeholder="Jane Doe" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 5 }}>Email Address *</label>
                <input type="email" value={newUser.email} onChange={(e) => setNewUser((p) => ({ ...p, email: e.target.value }))} placeholder="jane@newssite.com" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 5 }}>Role</label>
                <select value={newUser.role} onChange={(e) => setNewUser((p) => ({ ...p, role: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="reporter">Reporter</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 22 }}>
              <button onClick={addUser} style={{ flex: 1, padding: '9px 0', background: '#111', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Create User
              </button>
              <button onClick={() => setShowModal(false)} style={{ padding: '9px 16px', background: '#fff', color: '#374151', border: '1px solid #e4e4e7', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
