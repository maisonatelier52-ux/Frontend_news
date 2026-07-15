'use client';

import { useState, useEffect } from 'react';

interface SubscriptionItem {
  _id: string;
  email: string;
  ipAddress: string;
  country: string;
  countryCode: string;
  city: string;
  region: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

interface Stats {
  total: number;
  uniqueCountries: number;
  countryDistribution: Array<{ country: string; count: number; percentage: number }>;
}

type ActionBusy = Record<string, boolean>;

const STATUS_STYLES: Record<string, string> = {
  accepted: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  rejected: 'bg-red-50 text-red-600 border border-red-200',
};

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState<SubscriptionItem[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, uniqueCountries: 0, countryDistribution: [] });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [busy, setBusy] = useState<ActionBusy>({});
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const loadSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/subscriptions');
      if (res.ok) {
        const data = await res.json();
        setSubs(data.subscriptions || []);
        setStats(data.stats || { total: 0, uniqueCountries: 0, countryDistribution: [] });
      }
    } catch (err) {
      console.error('Failed to load subscriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const handleStatusChange = async (id: string, status: 'accepted' | 'rejected') => {
    setBusy((b) => ({ ...b, [id]: true }));
    try {
      const res = await fetch('/api/subscriptions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setSubs((prev) => prev.map((s) => s._id === id ? { ...s, status } : s));
        showToast(status === 'accepted' ? '✓ Subscriber accepted.' : '✕ Subscriber rejected.');
      }
    } catch (err) {
      console.error('Status change error:', err);
    } finally {
      setBusy((b) => ({ ...b, [id]: false }));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this subscriber permanently?')) return;
    setBusy((b) => ({ ...b, [`del_${id}`]: true }));
    try {
      const res = await fetch(`/api/subscriptions?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSubs((prev) => prev.filter((s) => s._id !== id));
        showToast('Subscriber deleted.');
      }
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setBusy((b) => ({ ...b, [`del_${id}`]: false }));
    }
  };

  const filteredSubs = subs.filter((sub) => {
    const matchesSearch =
      sub.email.toLowerCase().includes(search.toLowerCase()) ||
      sub.city.toLowerCase().includes(search.toLowerCase()) ||
      sub.region.toLowerCase().includes(search.toLowerCase()) ||
      sub.country.toLowerCase().includes(search.toLowerCase());
    const matchesCountry = countryFilter === 'all' || sub.country === countryFilter;
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchesSearch && matchesCountry && matchesStatus;
  });

  const accepted = subs.filter((s) => s.status === 'accepted').length;
  const pending = subs.filter((s) => s.status === 'pending').length;
  const rejected = subs.filter((s) => s.status === 'rejected').length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        {/* <div className="w-9 h-9 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" /> */}
        {/* <p className="text-xs text-zinc-500 font-semibold tracking-wide font-mono">Loading subscribers...</p> */}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-zinc-900 text-white text-xs font-semibold px-4 py-2.5 rounded shadow-lg animate-fade-in">
          {toast}
        </div>
      )}

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 leading-none">Subscription Management</h1>
        <p className="text-sm text-zinc-500 mt-2 font-medium">Review, accept, reject or remove readers who subscribed via the newsletter form.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-zinc-200 p-5 rounded-lg shadow-2xs">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 font-mono">Total</p>
          <p className="text-3xl font-extrabold text-zinc-900 mt-2">{stats.total}</p>
        </div>
        <div className="bg-white border border-zinc-200 p-5 rounded-lg shadow-2xs">
          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 font-mono">Accepted</p>
          <p className="text-3xl font-extrabold text-emerald-700 mt-2">{accepted}</p>
        </div>
        <div className="bg-white border border-zinc-200 p-5 rounded-lg shadow-2xs">
          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500 font-mono">Pending</p>
          <p className="text-3xl font-extrabold text-amber-700 mt-2">{pending}</p>
        </div>
        <div className="bg-white border border-zinc-200 p-5 rounded-lg shadow-2xs">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 font-mono">Countries</p>
          <p className="text-3xl font-extrabold text-zinc-900 mt-2">{stats.uniqueCountries}</p>
        </div>
      </div>

      {/* Geo Distribution */}
      {stats.countryDistribution.length > 0 && (
        <div className="bg-white border border-zinc-200 rounded-lg shadow-2xs p-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 font-mono mb-5">Geographic Reach</h3>
          <div className="space-y-3">
            {stats.countryDistribution.slice(0, 6).map((d) => (
              <div key={d.country}>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-zinc-700">{d.country}</span>
                  <span className="text-zinc-400">{d.count} · {d.percentage}%</span>
                </div>
                <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-zinc-900 h-full rounded-full" style={{ width: `${d.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="bg-white border border-zinc-200 rounded-lg shadow-2xs overflow-hidden">
        {/* Controls */}
        <div className="p-4 border-b border-zinc-200 bg-zinc-50/50 flex flex-col sm:flex-row flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search by email, city or country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-zinc-200 rounded px-3 py-1.5 pl-8 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-500 bg-white"
            />
            <svg className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-zinc-200 text-xs rounded px-2.5 py-1.5 focus:outline-none bg-white text-zinc-700 font-semibold"
          >
            <option value="all">All Statuses</option>
            <option value="accepted">Accepted</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="border border-zinc-200 text-xs rounded px-2.5 py-1.5 focus:outline-none bg-white text-zinc-700 font-semibold"
          >
            <option value="all">All Countries</option>
            {Array.from(new Set(subs.map((s) => s.country))).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <span className="text-xs text-zinc-400 font-semibold ml-auto">
            {filteredSubs.length} result{filteredSubs.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-[10px] text-zinc-400 uppercase tracking-widest font-mono">
                <th className="py-3 px-5 font-bold">#</th>
                <th className="py-3 px-5 font-bold">Email</th>
                <th className="py-3 px-5 font-bold">Location</th>
                <th className="py-3 px-5 font-bold">IP</th>
                <th className="py-3 px-5 font-bold">Status</th>
                <th className="py-3 px-5 font-bold">Joined</th>
                <th className="py-3 px-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs">
              {filteredSubs.map((sub, idx) => (
                <tr key={sub._id} className="hover:bg-zinc-50/50 transition group">
                  <td className="py-3 px-5 text-zinc-400 font-mono font-bold">{idx + 1}</td>
                  <td className="py-3 px-5 font-bold text-zinc-900 max-w-[200px] truncate">{sub.email}</td>
                  <td className="py-3 px-5 text-zinc-500">
                    <span className="font-semibold text-zinc-800">{sub.country}</span>
                    <span className="text-zinc-400"> · {sub.city}</span>
                  </td>
                  <td className="py-3 px-5 font-mono text-zinc-400">{sub.ipAddress}</td>
                  <td className="py-3 px-5">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[sub.status] || STATUS_STYLES.pending}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-zinc-400 whitespace-nowrap">
                    {new Date(sub.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="py-3 px-5">
                    <div className="flex items-center justify-end gap-2">
                      {sub.status !== 'accepted' && (
                        <button
                          onClick={() => handleStatusChange(sub._id, 'accepted')}
                          disabled={!!busy[sub._id]}
                          title="Accept"
                          className="w-7 h-7 rounded flex items-center justify-center text-emerald-600 hover:bg-emerald-50 border border-transparent hover:border-emerald-200 transition disabled:opacity-50"
                        >
                          {busy[sub._id] ? (
                            <span className="w-3 h-3 border-2 border-emerald-400 border-t-emerald-700 rounded-full animate-spin" />
                          ) : (
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          )}
                        </button>
                      )}
                      {sub.status !== 'rejected' && (
                        <button
                          onClick={() => handleStatusChange(sub._id, 'rejected')}
                          disabled={!!busy[sub._id]}
                          title="Reject"
                          className="w-7 h-7 rounded flex items-center justify-center text-amber-600 hover:bg-amber-50 border border-transparent hover:border-amber-200 transition disabled:opacity-50"
                        >
                          {busy[sub._id] ? (
                            <span className="w-3 h-3 border-2 border-amber-300 border-t-amber-700 rounded-full animate-spin" />
                          ) : (
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(sub._id)}
                        disabled={!!busy[`del_${sub._id}`]}
                        title="Delete"
                        className="w-7 h-7 rounded flex items-center justify-center text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition disabled:opacity-50"
                      >
                        {busy[`del_${sub._id}`] ? (
                          <span className="w-3 h-3 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                        ) : (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSubs.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400 italic text-xs">
                    No subscribers match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
