import React, { useState, useEffect, useCallback } from 'react';
import TopBar from './TopBar';
import { UserCheck, UserX, Loader2, Users, ShieldAlert, RefreshCw } from 'lucide-react';

const AdminApprovals = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchPendingUsers = useCallback(async () => {
    try {
      const response = await fetch(`/api?route=pending_users&t=${Date.now()}`);
      const data = await response.json();
      if (data.success) {
        setPendingUsers(data.data || []);
      }
    } catch (error) {
      console.error('[Approvals] Error fetching pending users:', error);
    }
    setLoading(false);
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchPendingUsers();
  }, [fetchPendingUsers]);

  // Re-fetch when window gets focus (user switches tabs/logs in from another tab)
  useEffect(() => {
    const onFocus = () => fetchPendingUsers();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [fetchPendingUsers]);

  // Poll every 3 seconds to catch new registrations
  useEffect(() => {
    const interval = setInterval(fetchPendingUsers, 3000);
    return () => clearInterval(interval);
  }, [fetchPendingUsers]);

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await fetch(`/api?route=approve_user&id=${id}`, { method: 'PUT' });
      setPendingUsers(prev => prev.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error approving user:', error);
    }
    setActionLoading(null);
  };

  const handleReject = async (id) => {
    setActionLoading(id);
    try {
      await fetch(`/api?route=reject_user&id=${id}`, { method: 'DELETE' });
      setPendingUsers(prev => prev.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error rejecting user:', error);
    }
    setActionLoading(null);
  };

  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto">
      <TopBar title="Admin Approvals" subtitle="Review and approve new account registrations" hideDateRange={true} />

      <div className="glass-panel p-6 rounded-xl mt-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Users className="w-6 h-6 text-[#a855f7] mr-3" />
            <h2 className="text-xl font-bold text-white">Pending Account Requests</h2>
          </div>
          <button
            onClick={fetchPendingUsers}
            className="inline-flex items-center px-3 py-1.5 bg-[#a855f7]/10 text-[#a855f7] hover:bg-[#a855f7]/20 border border-[#a855f7]/30 rounded-lg text-sm transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="w-8 h-8 text-[#a855f7] animate-spin" />
          </div>
        ) : pendingUsers.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-40 text-slate-400">
            <ShieldAlert className="w-12 h-12 mb-3 text-slate-500 opacity-50" />
            <p>No pending account approvals at this time.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1e293b] text-xs uppercase tracking-wider text-slate-400">
                  <th className="pb-3 font-semibold">User</th>
                  <th className="pb-3 font-semibold">Role</th>
                  <th className="pb-3 font-semibold">Division</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]/50">
                {pendingUsers.map(user => (
                  <tr key={user.id} className="hover:bg-[#1e293b]/30 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#a855f7] to-[#3b82f6] flex items-center justify-center font-bold text-white shadow-lg mr-3">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div className="font-bold text-slate-200">{user.name}</div>
                          <div className="text-xs text-slate-500">@{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role?.toLowerCase() === 'admin' ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 text-slate-300 text-sm">
                      {user.division || 'General'}
                    </td>
                    <td className="py-4 text-right space-x-2">
                      <button 
                        onClick={() => handleApprove(user.id)}
                        disabled={actionLoading === user.id}
                        className="inline-flex items-center px-3 py-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-sm transition-colors disabled:opacity-50"
                      >
                        {actionLoading === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4 mr-1" />}
                        Approve
                      </button>
                      <button 
                        onClick={() => handleReject(user.id)}
                        disabled={actionLoading === user.id}
                        className="inline-flex items-center px-3 py-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg text-sm transition-colors disabled:opacity-50"
                      >
                        {actionLoading === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserX className="w-4 h-4 mr-1" />}
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminApprovals;
