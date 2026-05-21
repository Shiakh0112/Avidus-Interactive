import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function TaskMonitoring() {
  const [tasks, setTasks] = useState([]);

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

  return (
    <div style={styles.container}>
      <h2>Task Monitoring</h2>
      <table style={styles.table}>
        <thead>
          <tr style={styles.thead}>
            <th style={styles.th}>Title</th>
            <th style={styles.th}>Description</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Created By</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task._id} style={styles.tr}>
              <td style={styles.td}>{task.title}</td>
              <td style={styles.td}>{task.description}</td>
              <td style={styles.td}><span style={{ ...styles.badge, background: task.status === 'Completed' ? '#22c55e' : '#f59e0b' }}>{task.status}</span></td>
              <td style={styles.td}>{task.user?.name} <br /><small style={{ color: '#94a3b8' }}>{task.user?.email}</small></td>
              <td style={styles.td}>
                <button style={styles.deleteBtn} onClick={() => deleteTask(task._id)}>Delete</button>
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
  deleteBtn: { padding: '4px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' },
};
