import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { useAuth } from '../hook/auth.hook'
import '../../../styles/login.scss'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { handleLogin } = useAuth()
  const navigate = useNavigate()
  const user = useSelector(state => state.auth.user)
  const loading = useSelector(state => state.auth.loading)
  const authError = useSelector(state => state.auth.error)

  const handleSubmit = async event => {
    event.preventDefault()

    const loggedIn = await handleLogin({ email, password })
    if (loggedIn) {
      navigate('/')
    }
  }

  if (!loading && user) {
    return <Navigate to="/" replace />
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-card__intro">
          <span className="login-card__eyebrow">Welcome back</span>
          <h1 id="login-title">Sign in to Nexora</h1>
          <p>Enter your details to access your account.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form__field">
            <label htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="login-form__field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              disabled={loading}
              required
            />
          </div>

          {authError && (
            <p className="login-form__message login-form__message--error" role="alert">
              {authError}
            </p>
          )}

          <button className="login-form__submit" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>

          <div className="login-form__meta">
            <p className="login-form__switch">
              Need an account?{' '}
              <Link to="/register">Create one</Link>
            </p>
            <p className="login-form__switch login-form__switch--secondary">
              Need a fresh verification link?{' '}
              <Link to="/resend-verification">Resend email</Link>
            </p>
          </div>
        </form>
      </section>
    </main>
  )
}

export default Login
