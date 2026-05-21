import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav style={styles.nav}>
      <span style={styles.brand}>Avidus</span>
      <div style={styles.links}>
        {user && <Link to="/dashboard" style={styles.link}>Dashboard</Link>}
        {user?.role === 'Admin' && (
          <>
            <Link to="/admin/users" style={styles.link}>Users</Link>
            <Link to="/admin/tasks" style={styles.link}>Tasks</Link>
            <Link to="/admin/logs" style={styles.link}>Logs</Link>
          </>
        )}
        {user ? (
          <button onClick={handleLogout} style={styles.btn}>Logout</button>
        ) : (
          <Link to="/login" style={styles.link}>Login</Link>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', background: '#1e293b', color: '#fff' },
  brand: { fontWeight: 'bold', fontSize: '1.2rem', color: '#60a5fa' },
  links: { display: 'flex', gap: '16px', alignItems: 'center' },
  link: { color: '#cbd5e1', textDecoration: 'none', fontSize: '0.9rem' },
  btn: { background: '#ef4444', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer' },
};
