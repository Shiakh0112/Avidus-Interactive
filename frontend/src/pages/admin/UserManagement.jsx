import { useEffect, useState } from 'react';
import api from '../../api/axios';
import AdminStats from './AdminStats';
import { MdDelete, MdPersonOff, MdPersonAdd, MdSearch, MdPeople } from 'react-icons/md';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    const { data } = await api.get('/admin/users');
    setUsers(data);
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleStatus = async (user) => {
    await api.patch(`/admin/users/${user._id}/status`, {
      status: user.status === 'Active' ? 'Inactive' : 'Active',
    });
    fetchUsers();
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    await api.delete(`/admin/users/${id}`);
    fetchUsers();
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>User Management</h1>
            <p style={styles.pageSubtitle}>Manage all registered users</p>
          </div>
        </div>

        <AdminStats />

        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <div style={styles.searchWrap}>
              <MdSearch size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                style={styles.searchInput} placeholder="Search users..."
                value={search} onChange={e => setSearch(e.target.value)}
              />
            </div>
            <span style={styles.countBadge}><MdPeople size={14} /> {filtered.length} users</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>User</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Joined</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => (
                  <tr key={user._id} style={styles.tr}>
                    <td style={styles.td}>
                      <div style={styles.userCell}>
                        <div style={styles.avatar}>{user.name.charAt(0).toUpperCase()}</div>
                        <div>
                          <p style={styles.userName}>{user.name}</p>
                          <p style={styles.userEmail}>{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, background: user.role === 'Admin' ? '#ede9fe' : '#e0e7ff', color: user.role === 'Admin' ? '#7c3aed' : '#4f46e5' }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, background: user.status === 'Active' ? '#dcfce7' : '#fee2e2', color: user.status === 'Active' ? '#16a34a' : '#dc2626' }}>
                        {user.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.dateText}>{new Date(user.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button style={{ ...styles.actionBtn, background: user.status === 'Active' ? '#fef9c3' : '#dcfce7', color: user.status === 'Active' ? '#a16207' : '#16a34a' }}
                          onClick={() => toggleStatus(user)} title={user.status === 'Active' ? 'Deactivate' : 'Activate'}>
                          {user.status === 'Active' ? <MdPersonOff size={15} /> : <MdPersonAdd size={15} />}
                          {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button style={{ ...styles.actionBtn, background: '#fee2e2', color: '#dc2626' }}
                          onClick={() => deleteUser(user._id)} title="Delete user">
                          <MdDelete size={15} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div style={styles.empty}>No users found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { background: '#f8fafc', minHeight: 'calc(100vh - 64px)', padding: '32px 20px' },
  container: { maxWidth: '1000px', margin: '0 auto' },
  pageHeader: { marginBottom: '28px' },
  pageTitle: { fontSize: '1.6rem', fontWeight: '700', color: '#0f172a' },
  pageSubtitle: { color: '#64748b', fontSize: '0.875rem', marginTop: '2px' },
  tableCard: { background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden' },
  tableHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #f1f5f9', flexWrap: 'wrap', gap: '12px' },
  searchWrap: { position: 'relative' },
  searchInput: { paddingLeft: '36px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', background: '#f8fafc', width: '240px' },
  countBadge: { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: '#64748b', fontWeight: '500' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#f8fafc' },
  th: { padding: '12px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0' },
  tr: { borderBottom: '1px solid #f8fafc', transition: 'background 0.1s' },
  td: { padding: '14px 20px', fontSize: '0.875rem' },
  userCell: { display: 'flex', alignItems: 'center', gap: '12px' },
  avatar: { width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.85rem', flexShrink: 0 },
  userName: { fontWeight: '600', color: '#0f172a', fontSize: '0.875rem' },
  userEmail: { color: '#64748b', fontSize: '0.78rem' },
  badge: { padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' },
  dateText: { color: '#64748b', fontSize: '0.8rem' },
  actionBtn: { display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '0.78rem' },
  empty: { textAlign: 'center', padding: '40px', color: '#94a3b8' },
};
