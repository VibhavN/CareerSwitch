
import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../features/auth/AuthContext'
import Sidebar from './Sidebar'
import Header from './Header'

export default function AppLayout() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    setSigningOut(true)

    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Sign out failed:', error.message)
      setSigningOut(false)
      return
    }

    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        onSignOut={handleSignOut}
        signingOut={signingOut}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header email={user?.email} />

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
