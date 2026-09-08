import { StaffShell } from '@/components/staff/staff-ui'

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return <StaffShell>{children}</StaffShell>
}
