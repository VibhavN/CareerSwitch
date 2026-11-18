
import { Bell } from 'lucide-react'

interface HeaderProps {
  email?: string
}

export default function Header({ email }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div>
        <h1 className="text-sm font-semibold text-gray-800">
          Your workspace
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Notifications"
          title="Notifications"
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
        >
          <Bell size={19} />
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
          {email?.charAt(0).toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  )
}
