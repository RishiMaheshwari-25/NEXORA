import { useState } from 'react'
import { Link } from 'react-router'
import { useSelector } from 'react-redux'
import { useAuth } from '../hook/auth.hook'
import '../../../styles/verification.scss'

const ResendVerification = () => {
  const [email, setEmail] = useState('')
  const { handleResendVerificationEmail, clearVerificationFeedback } = useAuth()
  const { verificationLoading, verificationError, verificationMessage } = useSelector(state => state.auth)

  const handleSubmit = async event => {
    event.preventDefault()
    if (verificationLoading) return
    await handleResendVerificationEmail({ email })
  }

  const handleFieldChange = event => {
    clearVerificationFeedback()
    setEmail(event.target.value)
  }

  return (
    <main className="verification-page">
      <section className="verification-card" aria-labelledby="verification-title">
        <div className="verification-card__intro">
          <span className="verification-card__eyebrow">Account access</span>
          <h1 id="verification-title">Verify your email</h1>
          <p>Enter the email tied to your account and we’ll send a fresh verification link.</p>
        </div>

        <form className="verification-form" onSubmit={handleSubmit}>
          <div className="verification-form__field">
            <label htmlFor="verification-email">Email address</label>
            <input
              id="verification-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={handleFieldChange}
              disabled={verificationLoading}
              required
            />
          </div>

          {verificationError && (
            <p className="verification-form__message verification-form__message--error" role="alert">
              {verificationError}
            </p>
          )}

          {verificationMessage && (
            <p className="verification-form__message verification-form__message--success" role="status">
              {verificationMessage}
            </p>
          )}

          <button className="verification-form__submit" type="submit" disabled={verificationLoading}>
            {verificationLoading ? 'Sending link...' : 'Send verification link'}
          </button>

          <p className="verification-form__switch">
            Return to{' '}
            <Link to="/login">Login</Link>
          </p>
        </form>
      </section>
    </main>
  )
}

export default ResendVerification
