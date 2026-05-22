import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { MdDelete, MdSearch, MdAssignment } from 'react-icons/md';

export default function TaskMonitoring() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const fetchTasks = async () => {
    const { data } = await api.get('/admin/tasks');
    setTasks(data);
  };

  useEffect(() => { fetchTasks(); }, []);

  const deleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    await api.delete(`/admin/tasks/${id}`);
    fetchTasks();
  };

  const filtered = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.user?.name?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || t.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>Task Monitoring</h1>
            <p style={styles.pageSubtitle}>View and manage all user tasks</p>
          </div>
        </div>

        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <div style={styles.searchWrap}>
              <MdSearch size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input style={styles.searchInput} placeholder="Search tasks or users..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div style={styles.filterGroup}>
              {['All', 'Pending', 'Completed'].map(f => (
                <button key={f} style={{ ...styles.filterBtn, ...(filter === f ? styles.filterBtnActive : {}) }}
                  onClick={() => setFilter(f)}>{f}</button>
              ))}
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>Task</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Created By</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(task => (
                  <tr key={task._id} style={styles.tr}>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ ...styles.taskIcon, background: task.status === 'Completed' ? '#dcfce7' : '#fef9c3' }}>
                          <MdAssignment size={16} color={task.status === 'Completed' ? '#16a34a' : '#a16207'} />
                        </div>
                        <div>
                          <p style={styles.taskTitle}>{task.title}</p>
                          {task.description && <p style={styles.taskDesc}>{task.description}</p>}
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, background: task.status === 'Completed' ? '#dcfce7' : '#fef9c3', color: task.status === 'Completed' ? '#16a34a' : '#a16207' }}>
                        {task.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.userCell}>
                        <div style={styles.avatar}>{task.user?.name?.charAt(0).toUpperCase()}</div>
                        <div>
                          <p style={styles.userName}>{task.user?.name}</p>
                          <p style={styles.userEmail}>{task.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.dateText}>{new Date(task.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td style={styles.td}>
                      <button style={styles.deleteBtn} onClick={() => deleteTask(task._id)}>
                        <MdDelete size={15} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <div style={styles.empty}>No tasks found.</div>}
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
  searchInput: { paddingLeft: '36px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', background: '#f8fafc', width: '260px' },
  filterGroup: { display: 'flex', gap: '6px' },
  filterBtn: { padding: '6px 14px', border: '1px solid #e2e8f0', borderRadius: '20px', background: '#f8fafc', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '500', color: '#64748b' },
  filterBtnActive: { background: '#e0e7ff', borderColor: '#6366f1', color: '#4f46e5' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#f8fafc' },
  th: { padding: '12px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0' },
  tr: { borderBottom: '1px solid #f8fafc' },
  td: { padding: '14px 20px', fontSize: '0.875rem' },
  taskIcon: { width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  taskTitle: { fontWeight: '600', color: '#0f172a', fontSize: '0.875rem' },
  taskDesc: { color: '#64748b', fontSize: '0.78rem', marginTop: '2px' },
  badge: { padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' },
  userCell: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: { width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.78rem', flexShrink: 0 },
  userName: { fontWeight: '600', color: '#0f172a', fontSize: '0.8rem' },
  userEmail: { color: '#64748b', fontSize: '0.72rem' },
  dateText: { color: '#64748b', fontSize: '0.8rem' },
  deleteBtn: { display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '0.78rem' },
  empty: { textAlign: 'center', padding: '40px', color: '#94a3b8' },
};
