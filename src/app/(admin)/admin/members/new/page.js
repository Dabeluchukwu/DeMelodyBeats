import Link from 'next/link';
import { AdminMemberForm } from '@/components/admin/AdminMemberForm';
import { ArrowLeft, UserPlus } from 'lucide-react';

export const metadata = {
  title: 'Add New Member - De Melody Beats Admin',
};

export default async function NewMemberPage() {
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/members"
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-brand-orange">Add New Member</h1>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-500">
              New
            </span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Add a new member to your band</p>
        </div>
      </div>

      <div className="bg-white dark:bg-brand-black/50 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <AdminMemberForm isEditing={false} />
      </div>
    </div>
  );
}