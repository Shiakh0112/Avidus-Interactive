import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdEmail, MdLock, MdPerson, MdShield, MdAdminPanelSettings, MdVisibility, MdVisibilityOff } from 'react-icons/md';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'User' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await register(form.name, form.email, form.password, form.role);
      navigate(user.role === 'Admin' ? '/admin/users' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.iconWrap}><MdShield size={28} color="#6366f1" /></div>
          <h2 style={styles.title}>Create account</h2>
          <p style={styles.subtitle}>Join Avidus today</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <Field label="Full Name" icon={<MdPerson size={18} color="#94a3b8" />}>
            <input style={styles.input} placeholder="John Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </Field>
          <Field label="Email" icon={<MdEmail size={18} color="#94a3b8" />}>
            <input style={styles.input} type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </Field>
          <PasswordField
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            show={showPassword}
            onToggle={() => setShowPassword(p => !p)}
          />

          <div>
            <label style={styles.label}>Role</label>
            <div style={styles.roleGrid}>
              {['User', 'Admin'].map(r => (
                <button key={r} type="button"
                  onClick={() => setForm({ ...form, role: r })}
                  style={{ ...styles.roleBtn, ...(form.role === r ? styles.roleBtnActive : {}) }}>
                  {r === 'Admin' ? <MdAdminPanelSettings size={18} /> : <MdPerson size={18} />}
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account? <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

function PasswordField({ value, onChange, show, onToggle }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#374151' }}>Password</label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>
          <MdLock size={18} color="#94a3b8" />
        </span>
        <input
          style={{ ...styles.input, paddingLeft: '36px', paddingRight: '40px' }}
          type={show ? 'text' : 'password'}
          placeholder="••••••••"
          value={value}
          onChange={onChange}
          required
        />
        <button type="button" onClick={onToggle} style={styles.eyeBtn}>
          {show ? <MdVisibilityOff size={18} color="#94a3b8" /> : <MdVisibility size={18} color="#94a3b8" />}
        </button>
      </div>
    </div>
  );
}

function Field({ label, icon, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#374151' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}>{icon}</span>
        <div style={{ paddingLeft: '36px' }}>{children}</div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #e0e7ff 0%, #f8fafc 50%, #fce7f3 100%)', padding: '20px' },
  card: { background: '#fff', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', padding: '40px', width: '100%', maxWidth: '400px' },
  header: { textAlign: 'center', marginBottom: '28px' },
  iconWrap: { width: '56px', height: '56px', background: '#e0e7ff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' },
  title: { fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '4px' },
  subtitle: { color: '#64748b', fontSize: '0.875rem' },
  error: { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px' },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  label: { fontSize: '0.8rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' },
  input: { width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', color: '#0f172a', background: '#f8fafc' },
  eyeBtn: { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' },
  roleGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  roleBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', border: '2px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc', cursor: 'pointer', fontWeight: '500', fontSize: '0.875rem', color: '#64748b', transition: 'all 0.15s' },
  roleBtnActive: { border: '2px solid #6366f1', background: '#e0e7ff', color: '#4f46e5' },
  btn: { padding: '12px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem', marginTop: '4px' },
  footer: { textAlign: 'center', marginTop: '20px', fontSize: '0.875rem', color: '#64748b' },
  link: { color: '#6366f1', fontWeight: '600', textDecoration: 'none' },
};
