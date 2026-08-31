'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMembers, useDeleteMember, useBulkDeleteMembers } from '@/hooks/useMembers';
import { Loader2, Plus, Edit, Trash2, User, Music2, Crown, Image as ImageIcon } from 'lucide-react';
import { Pagination } from '@/components/ui/Pagination';
import { usePagination } from '@/hooks/usePagination';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';

export function AdminMembers() {
  const { data: members, isLoading, error } = useMembers();
  const deleteMember = useDeleteMember();
  const bulkDeleteMembers = useBulkDeleteMembers();
  const [deletingId, setDeletingId] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null,
    memberId: null,
    memberName: '',
    count: 0,
  });

  // Use pagination
  const {
    currentPage,
    totalPages,
    currentItems: paginatedMembers,
    goToPage,
    totalItems,
    itemsPerPage,
  } = usePagination(members || [], 12); // 12 items per page

  const handleDeleteClick = (id, name) => {
    setModalState({
      isOpen: true,
      type: 'single',
      memberId: id,
      memberName: name,
      count: 0,
    });
  };

  const handleBulkDeleteClick = () => {
    if (selectedMembers.length === 0) {
      alert('Please select at least one member to delete.');
      return;
    }
    setModalState({
      isOpen: true,
      type: 'bulk',
      memberId: null,
      memberName: '',
      count: selectedMembers.length,
    });
  };

  const handleConfirmDelete = async () => {
    if (modalState.type === 'single') {
      setDeletingId(modalState.memberId);
      try {
        await deleteMember.mutateAsync(modalState.memberId);
      } catch (error) {
        alert('Failed to delete member. Please try again.');
      }
      setDeletingId(null);
    } else if (modalState.type === 'bulk') {
      setIsBulkDeleting(true);
      try {
        await bulkDeleteMembers.mutateAsync(selectedMembers);
        setSelectedMembers([]);
      } catch (error) {
        alert('Failed to delete members. Please try again.');
      }
      setIsBulkDeleting(false);
    }
    setModalState({ isOpen: false, type: null, memberId: null, memberName: '', count: 0 });
  };

  const handleSelectMember = (id) => {
    setSelectedMembers(prev =>
      prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedMembers.length === paginatedMembers?.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(paginatedMembers?.map(m => m.id) || []);
    }
  };

  const getModalContent = () => {
    if (modalState.type === 'single') {
      return {
        title: 'Delete Member',
        message: `Are you sure you want to delete "${modalState.memberName}"? This action cannot be undone.`,
        confirmText: 'Delete Member',
      };
    } else if (modalState.type === 'bulk') {
      return {
        title: `Delete ${modalState.count} Members`,
        message: `Are you sure you want to delete ${modalState.count} selected member(s)? This action cannot be undone.`,
        confirmText: `Delete ${modalState.count} Members`,
      };
    }
    return { title: 'Confirm Delete', message: 'Are you sure?', confirmText: 'Delete' };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-400">Failed to load members</p>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-brand-orange">Members</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Manage your band members
            {members && members.length > 0 && (
              <span className="ml-2 text-brand-orange font-semibold">
                ({members.length} total)
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {selectedMembers.length > 0 && (
            <button
              onClick={handleBulkDeleteClick}
              disabled={isBulkDeleting}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-300 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected ({selectedMembers.length})
            </button>
          )}
          <Link
            href="/admin/members/new"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-orange text-brand-black hover:bg-brand-gold transition-all duration-300"
          >
            <Plus className="h-4 w-4" />
            Add Member
          </Link>
        </div>
      </div>

      {!members || members.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-brand-black/50 rounded-xl border border-gray-200 dark:border-gray-800">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No members yet. Add your first band member!</p>
          <Link
            href="/admin/members/new"
            className="inline-block mt-4 px-4 py-2 rounded-lg bg-brand-orange text-brand-black hover:bg-brand-gold transition-all duration-300"
          >
            Add Member
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-brand-black/50 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-brand-black/30">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedMembers.length === paginatedMembers?.length && paginatedMembers?.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 dark:border-gray-700 text-brand-orange focus:ring-brand-orange"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Image</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {paginatedMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-brand-black/30 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(member.id)}
                          onChange={() => handleSelectMember(member.id)}
                          className="rounded border-gray-300 dark:border-gray-700 text-brand-orange focus:ring-brand-orange"
                        />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {member.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={member.image}
                            alt={member.name}
                            className="h-10 w-10 rounded-full object-cover bg-gray-100 dark:bg-gray-800"
                            onError={(e) => { e.target.src = ''; e.target.onerror = null; }}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          {member.isFounder && (
                            <Crown className="h-4 w-4 text-brand-gold" title="Founder" />
                          )}
                          {member.name}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-300">
                        {member.role}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          member.isActive 
                            ? 'bg-green-500/20 text-green-500' 
                            : 'bg-gray-500/20 text-gray-500'
                        }`}>
                          {member.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/members/${member.id}`}
                            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                          >
                            <User className="h-4 w-4 text-gray-500" />
                          </Link>
                          <Link
                            href={`/admin/members/${member.id}/edit`}
                            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                          >
                            <Edit className="h-4 w-4 text-brand-orange" />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(member.id, member.name)}
                            disabled={deletingId === member.id}
                            className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                          >
                            {deletingId === member.id ? (
                              <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                            ) : (
                              <Trash2 className="h-4 w-4 text-red-500" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
          />
        </>
      )}

      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, type: null, memberId: null, memberName: '', count: 0 })}
        onConfirm={handleConfirmDelete}
        title={getModalContent().title}
        message={getModalContent().message}
        confirmText={getModalContent().confirmText}
        cancelText="Cancel"
        variant="danger"
        isLoading={modalState.type === 'single' ? deletingId !== null : isBulkDeleting}
      />
    </div>
  );
}