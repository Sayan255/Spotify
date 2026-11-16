import { useAuth } from '../context/AuthContext.jsx'

export default function LoginPrompt({ title, subtitle }) {
  const { openAuth } = useAuth()
  return (
    <div className="flex flex-col items-start gap-4 mt-16 max-w-md">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-sp-muted">{subtitle}</p>
      <div className="flex flex-wrap gap-3 mt-2">
        <button
          onClick={() => openAuth('signup')}
          className="px-8 py-3 rounded-full bg-spotify text-black font-bold hover:scale-105 transition"
        >
          Sign up free
        </button>
        <button
          onClick={() => openAuth('login')}
          className="px-8 py-3 rounded-full border border-[#727272] font-bold hover:border-white hover:scale-105 transition"
        >
          Log in
        </button>
      </div>
    </div>
  )
}
