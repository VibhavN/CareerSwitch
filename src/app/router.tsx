
import { createBrowserRouter, Navigate } from 'react-router-dom'

import AppLayout from '../components/layout/AppLayout'
import AuthPage from '../features/auth/AuthPage'
import ProtectedRoute from '../features/auth/ProtectedRoute'
import DashboardPage from '../features/dashboard/DashboardPage'
import ApplicationsPage from '../features/applications/ApplicationsPage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <AuthPage mode="login" />,
  },
  {
    path: '/register',
    element: <AuthPage mode="register" />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: '/dashboard',
            element: <DashboardPage />,
          },
          {
            path: '/applications',
            element: <ApplicationsPage />,
          },
          {
            path: '/interviews',
            element: <div>Interviews page coming soon.</div>,
          },
          {
            path: '/settings',
            element: <div>Settings page coming soon.</div>,
          },
        ],
      },
    ],
  },
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
])
