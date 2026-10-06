import { Link, useSearchParams } from 'react-router'
import '../../../styles/verification.scss'

const verificationResults = {
  verified: {
    eyebrow: 'All set',
    title: 'Email verified',
    description: 'Your email address is confirmed. You can now sign in to your Nexora account.',
    icon: '✓',
    variant: 'success',
    action: { to: '/login', label: 'Go to login' },
  },
  'already-verified': {
    eyebrow: 'Already complete',
    title: 'Email already verified',
    description: 'Your email address is already confirmed. Sign in to continue to your account.',
    icon: '✓',
    variant: 'success',
    action: { to: '/login', label: 'Go to login' },
  },
  'invalid-link': {
    eyebrow: 'Verification needed',
    title: 'This link isn’t valid',
    description: 'The verification link may be incorrect or expired. Request a fresh link and try again.',
    icon: '!',
    variant: 'error',
    action: { to: '/resend-verification', label: 'Request a new link' },
  },
  'expired-link': {
    eyebrow: 'Verification needed',
    title: 'This link has expired',
    description: 'Verification links expire for your security. Request a fresh link to finish verifying your email.',
    icon: '!',
    variant: 'error',
    action: { to: '/resend-verification', label: 'Request a new link' },
  },
  'account-not-found': {
    eyebrow: 'Account not found',
    title: 'We couldn’t find your account',
    description: 'This verification link is not connected to an account. Create an account to get a new verification email.',
    icon: '!',
    variant: 'error',
    action: { to: '/register', label: 'Create an account' },
  },
  'resend-sent': {
    eyebrow: 'Check your inbox',
    title: 'A fresh link is on its way',
    description: 'We’ve sent a new verification email. Open it and follow the link to confirm your email address.',
    icon: '✓',
    variant: 'success',
    action: { to: '/login', label: 'Back to login' },
  },
  'resend-failed': {
    eyebrow: 'Couldn’t send the email',
    title: 'Please try again',
    description: 'We couldn’t send a fresh verification email right now. You can request another one in a moment.',
    icon: '!',
    variant: 'error',
    action: { to: '/resend-verification', label: 'Try again' },
  },
}

const VerificationResult = () => {
  const [searchParams] = useSearchParams()
  const result = verificationResults[searchParams.get('status')] || verificationResults['invalid-link']

  return (
    <main className="verification-page">
      <section className="verification-card verification-result" aria-labelledby="verification-result-title">
        <div className={`verification-result__icon verification-result__icon--${result.variant}`} aria-hidden="true">
          {result.icon}
        </div>
        <div className="verification-card__intro">
          <span className="verification-card__eyebrow">{result.eyebrow}</span>
          <h1 id="verification-result-title">{result.title}</h1>
          <p>{result.description}</p>
        </div>
        <Link className="verification-form__submit verification-result__action" to={result.action.to}>
          {result.action.label}
        </Link>
        <p className="verification-form__switch">
          Need a verification email?{' '}
          <Link to="/resend-verification">Resend link</Link>
        </p>
      </section>
    </main>
  )
}

export default VerificationResult
