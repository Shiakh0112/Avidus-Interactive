import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.get('/admin/logs').then(({ data }) => setLogs(data));
  }, []);

  return (
    <div style={styles.container}>
      <h2>Activity Logs</h2>
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
          {logs.map(log => (
            <tr key={log._id} style={styles.tr}>
              <td style={styles.td}>{log.user?.name}<br /><small style={{ color: '#94a3b8' }}>{log.user?.email}</small></td>
              <td style={styles.td}><span style={{ ...styles.badge, background: actionColor(log.action) }}>{log.action}</span></td>
              <td style={styles.td}>{log.details}</td>
              <td style={styles.td}>{new Date(log.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const actionColor = (action) => {
  const map = { LOGIN: '#3b82f6', TASK_CREATED: '#22c55e', TASK_UPDATED: '#f59e0b', TASK_DELETED: '#ef4444', ADMIN_TASK_DELETED: '#7c3aed' };
  return map[action] || '#64748b';
};

const styles = {
  container: { maxWidth: '900px', margin: '32px auto', padding: '0 16px' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.08)' },
  thead: { background: '#1e293b' },
  th: { padding: '12px 16px', color: '#fff', textAlign: 'left', fontSize: '0.85rem' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '12px 16px', fontSize: '0.9rem' },
  badge: { padding: '2px 10px', borderRadius: '12px', color: '#fff', fontSize: '0.75rem' },
};
