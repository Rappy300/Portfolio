'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Simple check, in real app use proper auth
    if (email === 'admin@example.com' && password === 'password') {
      localStorage.setItem('admin', 'true')
      router.push('/dashboard')
    } else {
      setError('Invalid credentials. Use admin@example.com / password')
    }
  }

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="login-header">
          <h1>Admin Access</h1>
          <p>Manage your portfolio content</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>

        <div className="login-footer">
          <p>Demo credentials: admin@example.com / password</p>
        </div>
      </div>
    </div>
  )
}