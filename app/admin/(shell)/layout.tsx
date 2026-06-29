import AdminShellWrapper from '../components/AdminShellWrapper'

export const metadata = { title: 'Admin — NewsAdmin CMS' }

export default function AdminShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminShellWrapper>
      {children}
    </AdminShellWrapper>
  )
}
