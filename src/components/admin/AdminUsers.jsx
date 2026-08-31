'use client';

import { useState, useMemo } from 'react';
import { useUsers, useCreateUser, useDeleteUser, useUpdateUserRole, useBulkDeleteUsers, useMe } from '@/hooks/useAuth';
import { Loader2, Plus, Trash2, UserCog, Search, X, Shield, Mail, Calendar } from 'lucide-react';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';

const roleColors = {
  SUPER_ADMIN: 'bg-purple-500/20 text-purple-500',
  ADMIN: 'bg-brand-orange/20 text-brand-orange',
  EDITOR: 'bg-blue-500/20 text-blue-500',
};

const roleLabels = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  EDITOR: 'Editor',
};

export function AdminUsers() {
  const { data: users, isLoading, error } = useUsers();
  const { data: currentUser } = useMe();
  const createUser = useCreateUser();
  const deleteUser = useDeleteUser();
  const updateRole = useUpdateUserRole();
  const bulkDeleteUsers = useBulkDeleteUsers();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'ADMIN',
  });
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null,
    userId: null,
    userEmail: '',
    count: 0,
  });

  // Filter users
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    
    let filtered = [...users];
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(user =>
        user.email.toLowerCase().includes(query) ||
        (user.name && user.name.toLowerCase().includes(query)) ||
        user.role.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [users, searchQuery]);

  const handleDeleteClick = (id, email) => {
    setModalState({
      isOpen: true,
      type: 'single',
      userId: id,
      userEmail: email,
      count: 0,
    });
  };

  const handleBulkDeleteClick = () => {
    if (selectedUsers.length === 0) {
      alert('Please select at least one user to delete.');
      return;
    }
    setModalState({
      isOpen: true,
      type: 'bulk',
      userId: null,
      userEmail: '',
      count: selectedUsers.length,
    });
  };

  const handleConfirmDelete = async () => {
    if (modalState.type === 'single') {
      setDeletingId(modalState.userId);
      try {
        await deleteUser.mutateAsync(modalState.userId);
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete user.');
      }
      setDeletingId(null);
    } else if (modalState.type === 'bulk') {
      setIsBulkDeleting(true);
      try {
        await bulkDeleteUsers.mutateAsync(selectedUsers);
        setSelectedUsers([]);
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete users.');
      }
      setIsBulkDeleting(false);
    }
    setModalState({ isOpen: false, type: null, userId: null, userEmail: '', count: 0 });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await createUser.mutateAsync(formData);
      setShowCreateModal(false);
      setFormData({ email: '', password: '', name: '', role: 'ADMIN' });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create user.');
    }
  };

  const handleRoleChange = async (id, role) => {
    if (!window.confirm(`Change this user's role to ${roleLabels[role]}?`)) return;
    try {
      await updateRole.mutateAsync({ id, role });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update role.');
    }
  };

  const handleSelectUser = (id) => {
    setSelectedUsers(prev =>
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers?.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers?.map(user => user.id) || []);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-400">Failed to load users. You need Super Admin access.</p>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-brand-orange">Users</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage admin users and their roles</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {selectedUsers.length > 0 && (
            <button
              onClick={handleBulkDeleteClick}
              disabled={isBulkDeleting}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-300 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected ({selectedUsers.length})
            </button>
          )}
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-orange text-brand-black hover:bg-brand-gold transition-all duration-300"
          >
            <Plus className="h-4 w-4" />
            Add User
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-64 flex-shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {filteredUsers.length > 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'}
          </p>
        )}
      </div>

      {/* Users Table */}
      {!filteredUsers || filteredUsers.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-brand-black/50 rounded-xl border border-gray-200 dark:border-gray-800">
          <UserCog className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchQuery ? 'No users found matching your search' : 'No users found'}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-brand-black/50 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-brand-black/30">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers?.length && filteredUsers?.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 dark:border-gray-700 text-brand-orange focus:ring-brand-orange"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-brand-black/30 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        disabled={user.id === currentUser?.id}
                        className="rounded border-gray-300 dark:border-gray-700 text-brand-orange focus:ring-brand-orange disabled:opacity-50"
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {user.name || '—'}
                      {user.id === currentUser?.id && (
                        <span className="ml-2 text-xs text-brand-orange">(You)</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        disabled={user.id === currentUser?.id}
                        className={`px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-sm font-medium ${roleColors[user.role]}`}
                      >
                        <option value="SUPER_ADMIN">Super Admin</option>
                        <option value="ADMIN">Admin</option>
                        <option value="EDITOR">Editor</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleDeleteClick(user.id, user.email)}
                        disabled={user.id === currentUser?.id || deletingId === user.id}
                        className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                      >
                        {deletingId === user.id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-red-500" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-brand-black rounded-xl max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-bold font-heading text-gray-900 dark:text-white">Add New User</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Full name"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="user@example.com"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password *</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
                >
                  <option value="SUPER_ADMIN">Super Admin</option>
                  <option value="ADMIN">Admin</option>
                  <option value="EDITOR">Editor</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createUser.isPending}
                  className="flex-1 px-4 py-2 rounded-lg bg-brand-orange text-brand-black hover:bg-brand-gold transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {createUser.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create User'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, type: null, userId: null, userEmail: '', count: 0 })}
        onConfirm={handleConfirmDelete}
        title={
          modalState.type === 'bulk'
            ? `Delete ${modalState.count} Users`
            : `Delete "${modalState.userEmail}"`
        }
        message={
          modalState.type === 'bulk'
            ? `Are you sure you want to delete ${modalState.count} selected user(s)? This action cannot be undone.`
            : `Are you sure you want to delete "${modalState.userEmail}"? This action cannot be undone.`
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={modalState.type === 'single' ? deletingId !== null : isBulkDeleting}
      />
    </div>
  );
}