import { AdminReleaseDetail } from '@/components/admin/AdminReleaseDetail';

export const metadata = {
  title: 'Release Details - De Melody Beats Admin',
};

export default async function ReleaseDetailPage({ params }) {
  const { id } = await params;
  return <AdminReleaseDetail releaseId={id} />;
}