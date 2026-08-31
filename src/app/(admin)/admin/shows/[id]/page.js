import { AdminShowDetail } from '@/components/admin/AdminShowDetail';

export const metadata = {
  title: 'Show Details - De Melody Beats Admin',
};

export default async function ShowDetailPage({ params }) {
  // ✅ Unwrap params with await (Server Component)
  const { id } = await params;
  
  return <AdminShowDetail showId={id} />;
}