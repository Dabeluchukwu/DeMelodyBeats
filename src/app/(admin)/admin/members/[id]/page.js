import { AdminMemberDetail } from '@/components/admin/AdminMemberDetail';

export const metadata = {
  title: 'Member Details - De Melody Beats Admin',
};

export default async function MemberDetailPage({ params }) {
  const { id } = await params;
  return <AdminMemberDetail memberId={id} />;
}