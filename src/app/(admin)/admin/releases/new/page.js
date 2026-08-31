import Link from 'next/link';
import { AdminReleaseForm } from '@/components/admin/AdminReleaseForm';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Add New Release - De Melody Beats Admin',
};

export default async function NewReleasePage() {
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/releases"
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-brand-orange">Add New Release</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Add a new music release</p>
        </div>
      </div>

      <div className="bg-white dark:bg-brand-black/50 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <AdminReleaseForm isEditing={false} />
      </div>
    </div>
  );
}