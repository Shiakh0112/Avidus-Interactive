import { useEffect, useState } from 'react';
import api from '../../api/axios';
import AdminStats from './AdminStats';

export default function UserManagement() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const { data } = await api.get('/admin/users');
    setUsers(data);
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleStatus = async (user) => {
    await api.patch(`/admin/users/${user._id}/status`, { status: user.status === 'Active' ? 'Inactive' : 'Active' });
    fetchUsers();
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await api.delete(`/admin/users/${id}`);
    fetchUsers();
  };

  return (
    <div style={styles.container}>
      <h2>User Management</h2>
      <AdminStats />
      <table style={styles.table}>
        <thead>
          <tr style={styles.thead}>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Role</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id} style={styles.tr}>
              <td style={styles.td}>{user.name}</td>
              <td style={styles.td}>{user.email}</td>
              <td style={styles.td}><span style={{ ...styles.badge, background: user.role === 'Admin' ? '#8b5cf6' : '#3b82f6' }}>{user.role}</span></td>
              <td style={styles.td}><span style={{ ...styles.badge, background: user.status === 'Active' ? '#22c55e' : '#ef4444' }}>{user.status}</span></td>
              <td style={styles.td}>
                <button style={styles.actionBtn} onClick={() => toggleStatus(user)}>{user.status === 'Active' ? 'Deactivate' : 'Activate'}</button>
                <button style={{ ...styles.actionBtn, background: '#ef4444' }} onClick={() => deleteUser(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: { maxWidth: '900px', margin: '32px auto', padding: '0 16px' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.08)' },
  thead: { background: '#1e293b' },
  th: { padding: '12px 16px', color: '#fff', textAlign: 'left', fontSize: '0.85rem' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '12px 16px', fontSize: '0.9rem' },
  badge: { padding: '2px 10px', borderRadius: '12px', color: '#fff', fontSize: '0.75rem' },
  actionBtn: { marginRight: '8px', padding: '4px 12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' },
};
