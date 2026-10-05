import { useState } from 'react'
import { Link } from 'react-router'
import { useSelector } from 'react-redux'
import { useAuth } from '../hook/auth.hook'
import '../../../styles/register.scss'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const { handleRegister, clearRegistrationFeedback } = useAuth()
  const { registrationLoading, registrationError, registrationMessage } = useSelector(state => state.auth)

  const handleSubmit = async event => {
    event.preventDefault()
    if (registrationLoading) return
    await handleRegister({ username, email, password })
  }

  const handleFieldChange = (setter) => event => {
    clearRegistrationFeedback()
    setter(event.target.value)
  }

  return (
    <main className="register-page">
      <section className="register-card" aria-labelledby="register-title">
        <div className="register-card__intro">
          <span className="register-card__eyebrow">Get started</span>
          <h1 id="register-title">Create your account</h1>
          <p>Join Nexora with a few quick details.</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="register-form__field">
            <label htmlFor="register-username">Username</label>
            <input
              id="register-username"
              name="username"
              type="text"
              placeholder="Choose a username"
              autoComplete="username"
              minLength={3}
              maxLength={30}
              pattern="[a-zA-Z0-9_]+"
              title="Use 3–30 letters, numbers, or underscores."
              value={username}
              onChange={handleFieldChange(setUsername)}
              disabled={registrationLoading}
              required
            />
          </div>

          <div className="register-form__field">
            <label htmlFor="register-email">Email address</label>
            <input
              id="register-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={handleFieldChange(setEmail)}
              disabled={registrationLoading}
              required
            />
          </div>

          <div className="register-form__field">
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              name="password"
              type="password"
              placeholder="Create a password"
              autoComplete="new-password"
              minLength={6}
              value={password}
              onChange={handleFieldChange(setPassword)}
              disabled={registrationLoading}
              required
            />
          </div>

          {registrationError && (
            <p className="register-form__message register-form__message--error" role="alert">
              {registrationError}
            </p>
          )}

          {registrationMessage && (
            <p className="register-form__message register-form__message--success" role="status">
              {registrationMessage} Check your inbox to verify your email before signing in.
            </p>
          )}

          <button className="register-form__submit" type="submit" disabled={registrationLoading}>
            {registrationLoading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="register-form__switch">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </p>
        </form>
      </section>
    </main>
  )
}

export default Register