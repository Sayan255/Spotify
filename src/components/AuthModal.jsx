import { useEffect, useState } from 'react'
import Icon from './Icon.jsx'
import Logo from './Logo.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const EMPTY = { name: '', email: '', password: '' }

function Field({ label, ...props }) {
  return (
    <label className="flex flex-col gap-1 text-sm font-bold">
      <span>{label}</span>
      <input
        {...props}
        className="bg-[#121212] border border-[#727272] hover:border-white focus:border-white focus:outline-none rounded-md px-3 py-3 font-normal placeholder:text-[#727272]"
      />
    </label>
  )
}

export default function AuthModal() {
  const { authModal, closeAuth, login, signup } = useAuth()
  const [mode, setMode] = useState('signup')
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authModal) return
    setMode(authModal)
    setError('')
    setForm(EMPTY)
  }, [authModal])

  useEffect(() => {
    if (!authModal) return
    const onKey = (e) => {
      if (e.key === 'Escape') closeAuth()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [authModal, closeAuth])

  if (!authModal) return null

  const isSignup = mode === 'signup'
  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    setError('')
    const email = form.email.trim()
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    try {
      if (isSignup) {
        if (!form.name.trim()) {
          setError('Please enter your name.')
          return
        }
        signup({ name: form.name, email, password: form.password })
      } else {
        login({ email, password: form.password })
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeAuth()
      }}
    >
      <div role="dialog" aria-modal="true" className="relative w-full max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto bg-[#121212] rounded-xl p-5 sm:p-8 md:p-10 shadow-2xl">
        <button onClick={closeAuth} aria-label="Close" className="absolute right-4 top-4 text-sp-muted hover:text-white">
          <Icon name="close" className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center text-center">
          <Logo />
          <h2 className="text-2xl md:text-3xl font-bold mt-6">
            {isSignup ? 'Sign up to start listening' : 'Log in to Melodify'}
          </h2>
        </div>

        <form onSubmit={submit} className="mt-8 flex flex-col gap-4">
          {isSignup && (
            <Field label="Name" placeholder="Your name" value={form.name} onChange={update('name')} required />
          )}
          <Field
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={update('email')}
            required
          />
          <Field
            label="Password"
            type="password"
            placeholder="At least 6 characters"
            value={form.password}
            onChange={update('password')}
            required
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            className="mt-2 bg-spotify hover:bg-spotify-hover hover:scale-[1.02] transition text-black font-bold rounded-full py-3"
          >
            {isSignup ? 'Sign up' : 'Log in'}
          </button>
        </form>

        <p className="text-center text-sp-muted mt-6 text-sm">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => {
              setMode(isSignup ? 'login' : 'signup')
              setError('')
            }}
            className="text-white underline font-bold"
          >
            {isSignup ? 'Log in here' : 'Sign up for Melodify'}
          </button>
        </p>
        <p className="text-xs text-sp-muted text-center mt-4">
          Accounts and your library are saved in this browser's local storage.
        </p>
      </div>
    </div>
  )
}
