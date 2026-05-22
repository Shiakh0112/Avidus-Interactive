import { useEffect, useState } from 'react';
import api from '../api/axios';
import { MdAdd, MdEdit, MdDelete, MdCheck, MdClose, MdAssignment } from 'react-icons/md';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    const { data } = await api.get('/tasks');
    setTasks(data);
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/tasks/${editId}`, form);
        setEditId(null);
      } else {
        await api.post('/tasks', form);
      }
      setForm({ title: '', description: '' });
      fetchTasks();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    await api.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const handleEdit = (task) => {
    setEditId(task._id);
    setForm({ title: task.title, description: task.description || '' });
  };

  const toggleStatus = async (task) => {
    await api.put(`/tasks/${task._id}`, { status: task.status === 'Pending' ? 'Completed' : 'Pending' });
    fetchTasks();
  };

  const pending = tasks.filter(t => t.status === 'Pending').length;
  const completed = tasks.filter(t => t.status === 'Completed').length;

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>My Tasks</h1>
            <p style={styles.pageSubtitle}>Manage and track your personal tasks</p>
          </div>
          <div style={styles.statsRow}>
            <StatPill label="Total" value={tasks.length} color="#6366f1" />
            <StatPill label="Pending" value={pending} color="#f59e0b" />
            <StatPill label="Done" value={completed} color="#22c55e" />
          </div>
        </div>

        {/* Form */}
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>{editId ? 'Edit Task' : 'Add New Task'}</h3>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              style={styles.input} placeholder="Task title *"
              value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required
            />
            <input
              style={styles.input} placeholder="Description (optional)"
              value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={styles.submitBtn} type="submit" disabled={loading}>
                {editId ? <><MdEdit size={16} /> Update</> : <><MdAdd size={16} /> Add Task</>}
              </button>
              {editId && (
                <button type="button" style={styles.cancelBtn}
                  onClick={() => { setEditId(null); setForm({ title: '', description: '' }); }}>
                  <MdClose size={16} /> Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Task List */}
        {tasks.length === 0 ? (
          <div style={styles.empty}>
            <MdAssignment size={48} color="#cbd5e1" />
            <p style={{ color: '#94a3b8', marginTop: '12px' }}>No tasks yet. Add your first task above!</p>
          </div>
        ) : (
          <div style={styles.taskGrid}>
            {tasks.map(task => (
              <div key={task._id} style={{ ...styles.taskCard, ...(task.status === 'Completed' ? styles.taskCardDone : {}) }}>
                <div style={styles.taskTop}>
                  <button style={{ ...styles.checkBtn, ...(task.status === 'Completed' ? styles.checkBtnDone : {}) }}
                    onClick={() => toggleStatus(task)} title="Toggle status">
                    {task.status === 'Completed' && <MdCheck size={14} />}
                  </button>
                  <div style={{ flex: 1 }}>
                    <p style={{ ...styles.taskTitle, ...(task.status === 'Completed' ? styles.taskTitleDone : {}) }}>
                      {task.title}
                    </p>
                    {task.description && <p style={styles.taskDesc}>{task.description}</p>}
                  </div>
                  <span style={{ ...styles.badge, background: task.status === 'Completed' ? '#dcfce7' : '#fef9c3', color: task.status === 'Completed' ? '#16a34a' : '#a16207' }}>
                    {task.status}
                  </span>
                </div>
                <div style={styles.taskActions}>
                  <span style={styles.taskDate}>{new Date(task.createdAt).toLocaleDateString()}</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <ActionBtn icon={<MdEdit size={15} />} onClick={() => handleEdit(task)} color="#6366f1" />
                    <ActionBtn icon={<MdDelete size={15} />} onClick={() => handleDelete(task._id)} color="#ef4444" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatPill({ label, value, color }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '8px 16px', textAlign: 'center', minWidth: '70px' }}>
      <p style={{ fontSize: '1.2rem', fontWeight: '700', color }}>{value}</p>
      <p style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: '500' }}>{label}</p>
    </div>
  );
}

function ActionBtn({ icon, onClick, color }) {
  return (
    <button onClick={onClick} style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '5px 7px', cursor: 'pointer', color, display: 'flex', alignItems: 'center' }}>
      {icon}
    </button>
  );
}

const styles = {
  page: { background: '#f8fafc', minHeight: 'calc(100vh - 64px)', padding: '32px 20px' },
  container: { maxWidth: '760px', margin: '0 auto' },
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' },
  pageTitle: { fontSize: '1.6rem', fontWeight: '700', color: '#0f172a' },
  pageSubtitle: { color: '#64748b', fontSize: '0.875rem', marginTop: '2px' },
  statsRow: { display: 'flex', gap: '8px' },
  formCard: { background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', marginBottom: '24px' },
  formTitle: { fontSize: '0.95rem', fontWeight: '600', color: '#374151', marginBottom: '16px' },
  form: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  input: { flex: 1, minWidth: '160px', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', background: '#f8fafc', color: '#0f172a' },
  submitBtn: { display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.875rem', whiteSpace: 'nowrap' },
  cancelBtn: { display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '0.875rem' },
  empty: { textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' },
  taskGrid: { display: 'flex', flexDirection: 'column', gap: '10px' },
  taskCard: { background: '#fff', borderRadius: '10px', padding: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', transition: 'box-shadow 0.15s' },
  taskCardDone: { background: '#f8fffe', borderColor: '#bbf7d0' },
  taskTop: { display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' },
  checkBtn: { width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #cbd5e1', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px', transition: 'all 0.15s' },
  checkBtnDone: { background: '#22c55e', borderColor: '#22c55e', color: '#fff' },
  taskTitle: { fontWeight: '600', fontSize: '0.9rem', color: '#0f172a' },
  taskTitleDone: { textDecoration: 'line-through', color: '#94a3b8' },
  taskDesc: { fontSize: '0.8rem', color: '#64748b', marginTop: '2px' },
  badge: { padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: '600', whiteSpace: 'nowrap' },
  taskActions: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #f1f5f9' },
  taskDate: { fontSize: '0.75rem', color: '#94a3b8' },
};
