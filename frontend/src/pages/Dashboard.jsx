import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [editId, setEditId] = useState(null);

  const fetchTasks = async () => {
    const { data } = await api.get('/tasks');
    setTasks(data);
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await api.put(`/tasks/${editId}`, form);
      setEditId(null);
    } else {
      await api.post('/tasks', form);
    }
    setForm({ title: '', description: '' });
    fetchTasks();
  };

  const handleDelete = async (id) => {
    await api.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const handleEdit = (task) => {
    setEditId(task._id);
    setForm({ title: task.title, description: task.description });
  };

  const toggleStatus = async (task) => {
    await api.put(`/tasks/${task._id}`, { status: task.status === 'Pending' ? 'Completed' : 'Pending' });
    fetchTasks();
  };

  return (
    <div style={styles.container}>
      <h2>My Tasks</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input style={styles.input} placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
        <input style={styles.input} placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <button style={styles.btn} type="submit">{editId ? 'Update' : 'Add Task'}</button>
        {editId && <button type="button" style={styles.cancelBtn} onClick={() => { setEditId(null); setForm({ title: '', description: '' }); }}>Cancel</button>}
      </form>
      <div style={styles.taskList}>
        {tasks.map(task => (
          <div key={task._id} style={styles.taskCard}>
            <div>
              <strong>{task.title}</strong>
              <p style={{ margin: '4px 0', color: '#64748b' }}>{task.description}</p>
              <span style={{ ...styles.badge, background: task.status === 'Completed' ? '#22c55e' : '#f59e0b' }}>{task.status}</span>
            </div>
            <div style={styles.actions}>
              <button style={styles.iconBtn} onClick={() => toggleStatus(task)}>✓</button>
              <button style={styles.iconBtn} onClick={() => handleEdit(task)}>✏️</button>
              <button style={{ ...styles.iconBtn, color: '#ef4444' }} onClick={() => handleDelete(task._id)}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '700px', margin: '32px auto', padding: '0 16px' },
  form: { display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' },
  input: { flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', minWidth: '140px' },
  btn: { padding: '10px 18px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  cancelBtn: { padding: '10px 18px', background: '#94a3b8', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  taskList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  taskCard: { background: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 6px rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  badge: { display: 'inline-block', padding: '2px 10px', borderRadius: '12px', color: '#fff', fontSize: '0.75rem' },
  actions: { display: 'flex', gap: '8px' },
  iconBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' },
};
