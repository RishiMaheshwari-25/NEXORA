import { createBrowserRouter, Navigate } from 'react-router'
import Login from './features/auth/pages/Login.jsx'
import Register from './features/auth/pages/Register.jsx'
import Dashboard from './features/chat/pages/Dashboard.jsx'
import Protected from './features/auth/components/Protected.jsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element:<Protected>
      <Dashboard />
    </Protected>,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
])