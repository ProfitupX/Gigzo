import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminShell from './AdminShell';

const ADMIN_SECRET = 'px-admin-authenticated-2025';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = cookieStore.get('px_admin_session');

  if (!session || session.value !== ADMIN_SECRET) {
    redirect('/admin/login');
  }

  return <AdminShell>{children}</AdminShell>;
}
