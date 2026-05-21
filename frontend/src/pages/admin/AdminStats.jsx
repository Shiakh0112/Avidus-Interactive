import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function AdminStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/stats').then(({ data }) => setStats(data));
  }, []);

  if (!stats) return null;

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, color: '#3b82f6' },
    { label: 'Total Tasks', value: stats.totalTasks, color: '#8b5cf6' },
    { label: 'Completed', value: stats.completedTasks, color: '#22c55e' },
    { label: 'Pending', value: stats.pendingTasks, color: '#f59e0b' },
  ];

  return (
    <div style={styles.grid}>
      {cards.map(c => (
        <div key={c.label} style={{ ...styles.card, borderTop: `4px solid ${c.color}` }}>
          <p style={styles.label}>{c.label}</p>
          <p style={{ ...styles.value, color: c.color }}>{c.value}</p>
        </div>
      ))}
    </div>
  );
}

const styles = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '32px' },
  card: { background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 6px rgba(0,0,0,0.08)' },
  label: { color: '#64748b', fontSize: '0.85rem', margin: 0 },
  value: { fontSize: '2rem', fontWeight: 'bold', margin: '8px 0 0' },
};
