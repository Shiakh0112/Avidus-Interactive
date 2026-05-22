import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  MdDashboard, MdPeople, MdAssignment, MdHistory,
  MdLogout, MdLogin, MdShield
} from 'react-icons/md';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        <MdShield size={24} color="#6366f1" />
        <span style={styles.brandText}>Avidus</span>
      </div>

      <div style={styles.links}>
        {user && (
          <NavLink to="/dashboard" active={isActive('/dashboard')} icon={<MdDashboard size={17} />} label="Dashboard" />
        )}
        {user?.role === 'Admin' && (
          <>
            <NavLink to="/admin/users" active={isActive('/admin/users')} icon={<MdPeople size={17} />} label="Users" />
            <NavLink to="/admin/tasks" active={isActive('/admin/tasks')} icon={<MdAssignment size={17} />} label="Tasks" />
            <NavLink to="/admin/logs" active={isActive('/admin/logs')} icon={<MdHistory size={17} />} label="Logs" />
          </>
        )}
      </div>

      <div style={styles.right}>
        {user ? (
          <div style={styles.userSection}>
            <div style={styles.avatar}>{user.name?.charAt(0).toUpperCase()}</div>
            <div style={styles.userInfo}>
              <span style={styles.userName}>{user.name}</span>
              <span style={styles.userRole}>{user.role}</span>
            </div>
            <button onClick={handleLogout} style={styles.logoutBtn} title="Logout">
              <MdLogout size={18} />
            </button>
          </div>
        ) : (
          <Link to="/login" style={styles.loginBtn}>
            <MdLogin size={16} />
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

function NavLink({ to, active, icon, label }) {
  return (
    <Link to={to} style={{ ...styles.navLink, ...(active ? styles.navLinkActive : {}) }}>
      {icon}
      {label}
    </Link>
  );
}

const styles = {
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 28px', height: '64px',
    background: '#ffffff', borderBottom: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)', position: 'sticky', top: 0, zIndex: 100,
  },
  brand: { display: 'flex', alignItems: 'center', gap: '8px' },
  brandText: { fontWeight: '700', fontSize: '1.2rem', color: '#0f172a', letterSpacing: '-0.3px' },
  links: { display: 'flex', gap: '4px', alignItems: 'center' },
  navLink: {
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '7px 14px', borderRadius: '8px',
    color: '#64748b', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500',
    transition: 'all 0.15s',
  },
  navLinkActive: { background: '#e0e7ff', color: '#4f46e5' },
  right: { display: 'flex', alignItems: 'center' },
  userSection: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: {
    width: '36px', height: '36px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '0.9rem',
  },
  userInfo: { display: 'flex', flexDirection: 'column' },
  userName: { fontSize: '0.85rem', fontWeight: '600', color: '#0f172a', lineHeight: 1.2 },
  userRole: { fontSize: '0.72rem', color: '#6366f1', fontWeight: '500' },
  logoutBtn: {
    background: 'none', border: '1px solid #e2e8f0', borderRadius: '8px',
    padding: '7px', cursor: 'pointer', color: '#64748b', display: 'flex',
    alignItems: 'center', transition: 'all 0.15s',
  },
  loginBtn: {
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '8px 16px', background: '#6366f1', color: '#fff',
    borderRadius: '8px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500',
  },
};
