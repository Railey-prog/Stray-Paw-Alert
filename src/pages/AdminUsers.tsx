import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Users,
  Shield,
  User as UserIcon,
  UserX,
  UserCheck,
  Trash2,
  AlertCircle } from
'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Toaster, toast } from 'sonner';
export function AdminUsers() {
  const { user, users, changeUserRole, toggleUserSuspension, deleteUser } =
  useAuth();
  const [showRoleModal, setShowRoleModal] = useState<{
    id: string;
    role: 'resident' | 'admin';
  } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  // Protect route
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  const residents = users.filter((u) => u.role === 'resident');
  const admins = users.filter((u) => u.role === 'admin');
  const handleRoleChange = (userId: string, newRole: 'resident' | 'admin') => {
    const res = changeUserRole(userId, newRole);
    if (res.ok) {
      toast.success(`User role updated to ${newRole}`);
      setShowRoleModal(null);
    } else {
      toast.error(res.error || 'Failed to update role');
    }
  };
  const handleToggleSuspension = (userId: string) => {
    const res = toggleUserSuspension(userId);
    if (res.ok) {
      const targetUser = users.find((u) => u.id === userId);
      const newStatus =
      targetUser?.status === 'suspended' ? 'activated' : 'suspended';
      toast.success(`User has been ${newStatus}`);
    } else {
      toast.error(res.error || 'Failed to update status');
    }
  };
  const handleDeleteUser = (userId: string) => {
    const res = deleteUser(userId);
    if (res.ok) {
      toast.success('User deleted successfully');
      setShowDeleteModal(null);
    } else {
      toast.error(res.error || 'Failed to delete user');
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <Toaster position="top-center" richColors />
      <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-10">
        <div className="bg-[#2D6A4F] text-white p-2.5 sm:p-3 rounded-2xl shadow-sm shrink-0">
          <Users className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            User Management
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium">
            View and monitor registered community members.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <UserIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wider">
              Residents
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {residents.length}
            </p>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wider">
              Admins
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {admins.length}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => {
                const isSelf = u.id === user?.id;
                const isLastAdmin = u.role === 'admin' && admins.length <= 1;
                const isSuspended = u.status === 'suspended';
                return (
                  <tr
                    key={u.id}
                    className={`transition-colors ${isSuspended ? 'bg-amber-50/50 hover:bg-amber-50' : 'hover:bg-slate-50/50'}`}>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isSuspended ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                          
                          {u.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p
                            className={`font-bold ${isSuspended ? 'text-amber-900' : 'text-slate-900'}`}>
                            
                            {u.username}
                          </p>
                          <p
                            className={`text-sm ${isSuspended ? 'text-amber-700' : 'text-slate-500'}`}>
                            
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                          
                          {u.role}
                        </span>
                        {isSuspended &&
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            Suspended
                          </span>
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <select
                          value={u.role}
                          onChange={(e) =>
                          setShowRoleModal({
                            id: u.id,
                            role: e.target.value as 'resident' | 'admin'
                          })
                          }
                          disabled={isSelf || isLastAdmin}
                          className="text-sm bg-white border border-slate-200 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F] outline-none font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          title={
                          isSelf ?
                          'Cannot change own role' :
                          isLastAdmin ?
                          'Cannot demote last admin' :
                          'Change role'
                          }>
                          
                          <option value="resident">Resident</option>
                          <option value="admin">Admin</option>
                        </select>

                        <button
                          onClick={() => handleToggleSuspension(u.id)}
                          disabled={isSelf}
                          className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isSuspended ? 'text-amber-600 hover:bg-amber-100 bg-amber-50' : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'}`}
                          title={
                          isSelf ?
                          'Cannot suspend yourself' :
                          isSuspended ?
                          'Reactivate User' :
                          'Suspend User'
                          }>
                          
                          {isSuspended ?
                          <UserCheck size={18} /> :

                          <UserX size={18} />
                          }
                        </button>

                        <button
                          onClick={() => setShowDeleteModal(u.id)}
                          disabled={isSelf || isLastAdmin}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title={
                          isSelf ?
                          'Cannot delete yourself' :
                          isLastAdmin ?
                          'Cannot delete last admin' :
                          'Delete User'
                          }>
                          
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Change Modal */}
      {showRoleModal &&
      <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 overflow-hidden">
            <div className="flex items-center gap-3 text-amber-600 mb-4">
              <AlertCircle size={24} />
              <h3 className="text-lg font-bold text-slate-900">
                Change User Role
              </h3>
            </div>
            <p className="text-slate-600 mb-6">
              Are you sure you want to change this user's role to{' '}
              <strong className="capitalize">{showRoleModal.role}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
              onClick={() => setShowRoleModal(null)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
              
                Cancel
              </button>
              <button
              onClick={() =>
              handleRoleChange(showRoleModal.id, showRoleModal.role)
              }
              className="px-4 py-2 text-sm font-semibold text-white bg-[#2D6A4F] hover:bg-[#1b4332] rounded-xl transition-colors shadow-sm">
              
                Confirm Change
              </button>
            </div>
          </div>
        </div>
      }

      {/* Delete User Modal */}
      {showDeleteModal &&
      <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 overflow-hidden">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertCircle size={24} />
              <h3 className="text-lg font-bold text-slate-900">Delete User</h3>
            </div>
            <p className="text-slate-600 mb-6">
              Are you sure you want to permanently delete this user? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
              onClick={() => setShowDeleteModal(null)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
              
                Cancel
              </button>
              <button
              onClick={() => handleDeleteUser(showDeleteModal)}
              className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-sm">
              
                Delete User
              </button>
            </div>
          </div>
        </div>
      }
    </div>);

}