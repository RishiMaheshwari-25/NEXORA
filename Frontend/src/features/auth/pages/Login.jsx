import { useState } from 'react'
import { Link,useNavigate } from 'react-router'
import '../../../styles/login.scss'
import { useAuth } from '../hook/auth.hook'
import {useSelector} from 'react-redux'
import {Navigate} from 'react-router'

const Login = () => {
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const {handleLogin}=useAuth();
  const navigate=useNavigate();
  const user=useSelector(state=>state.auth.user);
  const loading=useSelector(state=>state.auth.loading);

  
const handleSubmit = async (event) => {
    event.preventDefault()
    const payload = {
        email,
        password
    }
   await handleLogin(payload);
       navigate('/');
    
  }
  if(!loading && user){
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
              onChange={(e)=>{
                setEmail(e.target.value)
              }}
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
              onChange={(e)=>{setPassword(e.target.value)}}
              required
            />
          </div>

          

          <button className="login-form__submit" type="submit" >
            Login
          </button>

          <p className="login-form__switch">
            Need an account?{' '}
            <Link to="/register">Create one</Link>
          </p>
        </form>
      </section>
    </main>
  )
}

export default Login
