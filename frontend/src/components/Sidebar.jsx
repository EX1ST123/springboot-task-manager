import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, User, LogOut, CheckSquare } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/profile', icon: User, label: 'Profile', end: false },
]

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <aside
      className={[
        'fixed lg:static inset-y-0 left-0 z-30',
        'w-60 flex flex-col shrink-0',
        'transition-transform duration-200 ease-in-out',
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      ].join(' ')}
      style={{ backgroundColor: '#0F2241' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 h-16 px-5 border-b border-white/10">
        <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
          <CheckSquare size={15} className="text-white" />
        </div>
        <span className="font-semibold text-lg tracking-tight text-white">TaskFlow</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="px-3 mb-2 text-xs font-medium uppercase tracking-widest text-white/30">
          Menu
        </p>
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-600/25 text-white'
                  : 'text-white/50 hover:bg-white/5 hover:text-white/80',
              ].join(' ')
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg mb-0.5">
          <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-semibold text-blue-300 shrink-0">
            {user?.email?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <p className="text-xs text-white/40 truncate">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm text-white/40 hover:bg-white/5 hover:text-white/70 transition-colors"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
