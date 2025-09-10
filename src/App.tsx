import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Vehicles from './pages/Vehicles'
import Clients from './pages/Clients'
import Contracts from './pages/Contracts'
import Payments from './pages/Payments'
import Maintenance from './pages/Maintenance'
import Insurance from './pages/Insurance'
import Reports from './pages/Reports'
import Login from './pages/Login'
import { AuthProvider } from './contexts/AuthContext'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/apple-theme.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen" style={{ backgroundColor: 'var(--apple-background-secondary)' }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="vehicles" element={<Vehicles />} />
                <Route path="clients" element={<Clients />} />
                <Route path="contracts" element={<Contracts />} />
                <Route path="payments" element={<Payments />} />
                <Route path="maintenance" element={<Maintenance />} />
                <Route path="insurance" element={<Insurance />} />
                <Route path="reports" element={<Reports />} />
              </Route>
            </Routes>
            <Toaster position="top-right" />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
