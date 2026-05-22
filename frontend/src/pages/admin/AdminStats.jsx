import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { MdPeople, MdAssignment, MdCheckCircle, MdPending } from 'react-icons/md';

export default function AdminStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/stats').then(({ data }) => setStats(data));
  }, []);

  if (!stats) return null;

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, icon: <MdPeople size={22} />, color: '#6366f1', bg: '#e0e7ff' },
    { label: 'Total Tasks', value: stats.totalTasks, icon: <MdAssignment size={22} />, color: '#8b5cf6', bg: '#ede9fe' },
    { label: 'Completed', value: stats.completedTasks, icon: <MdCheckCircle size={22} />, color: '#22c55e', bg: '#dcfce7' },
    { label: 'Pending', value: stats.pendingTasks, icon: <MdPending size={22} />, color: '#f59e0b', bg: '#fef9c3' },
  ];

  return (
    <div style={styles.grid}>
      {cards.map(c => (
        <div key={c.label} style={styles.card}>
          <div style={{ ...styles.iconBox, background: c.bg, color: c.color }}>{c.icon}</div>
          <div>
            <p style={styles.label}>{c.label}</p>
            <p style={{ ...styles.value, color: c.color }}>{c.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' },
  card: { background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' },
  iconBox: { width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  label: { color: '#64748b', fontSize: '0.8rem', fontWeight: '500', marginBottom: '2px' },
  value: { fontSize: '1.8rem', fontWeight: '700', lineHeight: 1 },
};
