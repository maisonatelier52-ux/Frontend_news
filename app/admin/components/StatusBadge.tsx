type StatusType = 'published' | 'draft' | 'scheduled' | 'approved' | 'pending' | 'spam' | 'rejected' | 'active' | 'inactive' | 'admin' | 'editor' | 'reporter' | 'viewer'

const statusClasses: Record<StatusType, string> = {
  published: 'bg-[#dcfce7] text-[#15803d]',
  draft: 'bg-[#f4f4f5] text-[#52525b]',
  scheduled: 'bg-[#fef9c3] text-[#a16207]',
  approved: 'bg-[#dcfce7] text-[#15803d]',
  pending: 'bg-[#fef9c3] text-[#a16207]',
  spam: 'bg-[#fee2e2] text-[#dc2626]',
  rejected: 'bg-[#fee2e2] text-[#dc2626]',
  active: 'bg-[#dcfce7] text-[#15803d]',
  inactive: 'bg-[#f4f4f5] text-[#52525b]',
  admin: 'bg-[#ede9fe] text-[#6d28d9]',
  editor: 'bg-[#dbeafe] text-[#1d4ed8]',
  reporter: 'bg-[#e0f2fe] text-[#0369a1]',
  viewer: 'bg-[#f4f4f5] text-[#52525b]',
}

const statusLabels: Record<StatusType, string> = {
  published: 'Published',
  draft: 'Draft',
  scheduled: 'Scheduled',
  approved: 'Accepted',
  pending: 'Pending',
  spam: 'Spam',
  rejected: 'Rejected',
  active: 'Active',
  inactive: 'Inactive',
  admin: 'Admin',
  editor: 'Editor',
  reporter: 'Reporter',
  viewer: 'Viewer',
}

export default function StatusBadge({ status }: { status: StatusType }) {
  const classes = statusClasses[status] || 'bg-[#f4f4f5] text-[#52525b]'
  const label = statusLabels[status] || status

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-[0.02em] ${classes}`}>
      {label}
    </span>
  )
}
