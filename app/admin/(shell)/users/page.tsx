'use client'

import { useState, useEffect } from 'react'
import StatusBadge from '../../components/StatusBadge'
import { useAdminModal } from '../../components/AdminModalContext'

interface User {
  _id: string
  name: string
  email: string
  role: string
  createdAt?: string
}

export default function UsersPage() {
  const { showAlert, showConfirm } = useAdminModal()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'editor', password: '' })

  // Fetch users from database
  async function fetchUsers() {
    try {
      setLoading(true)
      const res = await fetch('/api/users')
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      }
    } catch (e) {
      console.error('Failed to fetch user accounts', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = filterRole === 'all' || u.role === filterRole
    return matchSearch && matchRole
  })

  async function addUser() {
    if (!newUser.name || !newUser.email) return
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      })
      if (res.ok) {
        const created = await res.json()
        setUsers((prev) => [created, ...prev])
        setNewUser({ name: '', email: '', role: 'editor', password: '' })
        setShowModal(false)
        showAlert('User account created successfully.', 'success', 'Created')
        
        // Log activity
        await fetch('/api/logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'security',
            action: 'USER_CREATE',
            details: { name: newUser.name, email: newUser.email, role: newUser.role }
          })
        })
      } else {
        const err = await res.json()
        showAlert(err.error || 'Failed to create user', 'error', 'Create Error')
      }
    } catch (err) {
      showAlert('Network error creating user', 'error', 'Create Error')
    }
  }

  function deleteUser(id: string) {
    showConfirm(
      'Are you sure you want to delete this console user?',
      async () => {
        try {
          const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE' })
          if (res.ok) {
            const deleted = users.find(u => u._id === id)
            setUsers((prev) => prev.filter((u) => u._id !== id))
            showAlert('User deleted successfully.', 'success', 'Deleted')
            
            // Log activity
            await fetch('/api/logs', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'security',
                action: 'USER_DELETE',
                details: { email: deleted?.email }
              })
            })
          } else {
            showAlert('Failed to delete user.', 'error', 'Error')
          }
        } catch (err) {
          showAlert('Failed to delete user', 'error', 'Error')
        }
      },
      'Delete User'
    )
  }

  async function changeUserRole(id: string, newRole: string) {
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, role: newRole })
      })
      if (res.ok) {
        setUsers((prev) => prev.map((u) => u._id === id ? { ...u, role: newRole } : u))
        showAlert('User role updated successfully.', 'success', 'Updated')
      } else {
        showAlert('Failed to update user role', 'error', 'Error')
      }
    } catch (err) {
      showAlert('Failed to update user role', 'error', 'Error')
    }
  }

  const inputStyle: React.CSSProperties = { width: '100%', border: '1px solid #e4e4e7', borderRadius: 6, padding: '8px 12px', fontSize: 13, color: '#111', outline: 'none', background: '#fff', boxSizing: 'border-box' }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-2">
        {/* <div className="w-8 h-8 border-4 border-slate-200 border-t-black rounded-full animate-spin"></div> */}
        {/* <span className="text-xs font-semibold text-slate-500 font-sans">Syncing Accounts registry...</span> */}
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1100 }} className="animate-[admin-fade-in_0.4s_ease_both]">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 20, fontStyle: 'normal', fontWeight: 700, color: '#111', margin: 0 }}>User Management</h1>
          <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{users.length} active CMS console profiles</p>
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
          <option value="author">Author</option>
          <option value="reviewer">Reviewer</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #e4e4e7', borderRadius: 8, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9f9f9', borderBottom: '1px solid #e4e4e7' }}>
              {['User', 'Email', 'Role', 'Created At', 'Actions'].map((h) => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, color: '#9ca3af', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((user, i) => (
              <tr key={user._id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f4f4f5' : 'none' }}>
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
                  <select 
                    value={user.role} 
                    onChange={(e) => changeUserRole(user._id, e.target.value)}
                    style={{ border: '1px solid #e4e4e7', borderRadius: 4, padding: '4px 8px', fontSize: 12, background: 'transparent' }}
                  >
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="author">Author</option>
                    <option value="reviewer">Reviewer</option>
                  </select>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#9ca3af' }}>
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active'}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <button 
                    onClick={() => deleteUser(user._id)} 
                    style={{ fontSize: 11, color: '#dc2626', background: '#fff', border: '1px solid #fecaca', borderRadius: 4, padding: '4px 10px', cursor: 'pointer' }}
                  >
                    Delete Account
                  </button>
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
              <div style={{ fontSize: 16, fontWeight: 700, color: '#111' }}>Add New Team Account</div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#9ca3af', lineHeight: 1 }}>×</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 5 }}>Full Name *</label>
                <input value={newUser.name} onChange={(e) => setNewUser((p) => ({ ...p, name: e.target.value }))} placeholder="Sarah Connor" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 5 }}>Email Address *</label>
                <input type="email" value={newUser.email} onChange={(e) => setNewUser((p) => ({ ...p, email: e.target.value }))} placeholder="sarah@newssite.com" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 5 }}>Temporary Password *</label>
                <input type="password" value={newUser.password} onChange={(e) => setNewUser((p) => ({ ...p, password: e.target.value }))} placeholder="Create temp password" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 5 }}>System Permission Level</label>
                <select value={newUser.role} onChange={(e) => setNewUser((p) => ({ ...p, role: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="author">Author</option>
                  <option value="reviewer">Reviewer</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 22 }}>
              <button onClick={addUser} style={{ flex: 1, padding: '9px 0', background: '#111', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Create Account
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
