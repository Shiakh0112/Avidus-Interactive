import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { MdLogin, MdAddTask, MdEdit, MdDelete, MdSearch, MdHistory } from 'react-icons/md';

const ACTION_CONFIG = {
  LOGIN:              { icon: <MdLogin size={15} />,   bg: '#e0e7ff', color: '#4f46e5', label: 'Login' },
  TASK_CREATED:       { icon: <MdAddTask size={15} />, bg: '#dcfce7', color: '#16a34a', label: 'Task Created' },
  TASK_UPDATED:       { icon: <MdEdit size={15} />,    bg: '#fef9c3', color: '#a16207', label: 'Task Updated' },
  TASK_DELETED:       { icon: <MdDelete size={15} />,  bg: '#fee2e2', color: '#dc2626', label: 'Task Deleted' },
  ADMIN_TASK_DELETED: { icon: <MdDelete size={15} />,  bg: '#ede9fe', color: '#7c3aed', label: 'Admin Deleted' },
};

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    api.get('/admin/logs').then(({ data }) => setLogs(data));
  }, []);

  const filtered = logs.filter(log => {
    const matchSearch =
      log.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      log.details?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || log.action === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>Activity Logs</h1>
            <p style={styles.pageSubtitle}>Track all user activity across the platform</p>
          </div>
          <div style={styles.totalBadge}>
            <MdHistory size={16} />
            {logs.length} total events
          </div>
        </div>

        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <div style={styles.searchWrap}>
              <MdSearch size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input style={styles.searchInput} placeholder="Search logs..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div style={styles.filterGroup}>
              {['All', 'LOGIN', 'TASK_CREATED', 'TASK_UPDATED', 'TASK_DELETED'].map(f => (
                <button key={f} style={{ ...styles.filterBtn, ...(filter === f ? styles.filterBtnActive : {}) }}
                  onClick={() => setFilter(f)}>
                  {f === 'All' ? 'All' : ACTION_CONFIG[f]?.label || f}
                </button>
              ))}
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>User</th>
                  <th style={styles.th}>Action</th>
                  <th style={styles.th}>Details</th>
                  <th style={styles.th}>Time</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(log => {
                  const cfg = ACTION_CONFIG[log.action] || { bg: '#f1f5f9', color: '#64748b', icon: null, label: log.action };
                  return (
                    <tr key={log._id} style={styles.tr}>
                      <td style={styles.td}>
                        <div style={styles.userCell}>
                          <div style={styles.avatar}>{log.user?.name?.charAt(0).toUpperCase()}</div>
                          <div>
                            <p style={styles.userName}>{log.user?.name}</p>
                            <p style={styles.userEmail}>{log.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span style={{ ...styles.actionBadge, background: cfg.bg, color: cfg.color }}>
                          {cfg.icon} {cfg.label}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.details}>{log.details}</span>
                      </td>
                      <td style={styles.td}>
                        <div>
                          <p style={styles.dateText}>{new Date(log.createdAt).toLocaleDateString()}</p>
                          <p style={styles.timeText}>{new Date(log.createdAt).toLocaleTimeString()}</p>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && <div style={styles.empty}>No logs found.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { background: '#f8fafc', minHeight: 'calc(100vh - 64px)', padding: '32px 20px' },
  container: { maxWidth: '1000px', margin: '0 auto' },
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' },
  pageTitle: { fontSize: '1.6rem', fontWeight: '700', color: '#0f172a' },
  pageSubtitle: { color: '#64748b', fontSize: '0.875rem', marginTop: '2px' },
  totalBadge: { display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 14px', fontSize: '0.85rem', fontWeight: '500', color: '#64748b' },
  tableCard: { background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden' },
  tableHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #f1f5f9', flexWrap: 'wrap', gap: '12px' },
  searchWrap: { position: 'relative' },
  searchInput: { paddingLeft: '36px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', background: '#f8fafc', width: '220px' },
  filterGroup: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  filterBtn: { padding: '5px 12px', border: '1px solid #e2e8f0', borderRadius: '20px', background: '#f8fafc', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '500', color: '#64748b' },
  filterBtnActive: { background: '#e0e7ff', borderColor: '#6366f1', color: '#4f46e5' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#f8fafc' },
  th: { padding: '12px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0' },
  tr: { borderBottom: '1px solid #f8fafc' },
  td: { padding: '14px 20px', fontSize: '0.875rem' },
  userCell: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: { width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.8rem', flexShrink: 0 },
  userName: { fontWeight: '600', color: '#0f172a', fontSize: '0.85rem' },
  userEmail: { color: '#64748b', fontSize: '0.75rem' },
  actionBadge: { display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' },
  details: { color: '#64748b', fontSize: '0.82rem' },
  dateText: { color: '#0f172a', fontSize: '0.8rem', fontWeight: '500' },
  timeText: { color: '#94a3b8', fontSize: '0.72rem' },
  empty: { textAlign: 'center', padding: '40px', color: '#94a3b8' },
};
