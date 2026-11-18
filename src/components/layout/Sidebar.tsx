
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  BriefcaseBusiness,
  CalendarDays,
  Settings,
  LogOut,
} from 'lucide-react'

interface SidebarProps {
  onSignOut: () => void
  signingOut: boolean
}

const navigation = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Applications',
    path: '/applications',
    icon: BriefcaseBusiness,
  },
  {
    label: 'Interviews',
    path: '/interviews',
    icon: CalendarDays,
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: Settings,
  },
]

export default function Sidebar({
  onSignOut,
  signingOut,
}: SidebarProps) {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center border-b border-gray-100 px-6">
        <span className="text-xl font-bold tracking-tight text-indigo-600">
          CareerOS
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-6">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Workspace
        </p>

        {navigation.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Icon size={19} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-100 p-3">
        <button
          onClick={onSignOut}
          disabled={signingOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
        >
          <LogOut size={19} />
          {signingOut ? 'Signing out...' : 'Sign out'}
        </button>
      </div>
    </aside>
  )
}
