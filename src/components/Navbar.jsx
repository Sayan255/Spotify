import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from './Icon.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const roundBtn = 'w-8 h-8 rounded-full bg-black/70 hover:bg-black grid place-items-center text-white transition'

export default function Navbar() {
  const navigate = useNavigate()
  const { user, logout, openAuth } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-30 h-16 px-4 flex items-center justify-between gap-3 bg-[#121212]">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate(-1)} aria-label="Go back" className={roundBtn}>
          <Icon name="chevronLeft" className="w-5 h-5" />
        </button>
        <button onClick={() => navigate(1)} aria-label="Go forward" className={roundBtn}>
          <Icon name="chevronRight" className="w-5 h-5" />
        </button>
        <div className="flex md:hidden items-center gap-2 ml-2">
          <Link to="/" aria-label="Home" className="w-8 h-8 rounded-full bg-sp-high grid place-items-center">
            <Icon name="home" className="w-5 h-5" />
          </Link>
          <Link to="/search" aria-label="Search" className="w-8 h-8 rounded-full bg-sp-high grid place-items-center">
            <Icon name="search" className="w-5 h-5" />
          </Link>
          <Link to="/library" aria-label="Library" className="w-8 h-8 rounded-full bg-sp-high grid place-items-center">
            <Icon name="library" className="w-5 h-5" />
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2 relative">
        {user ? (
          <>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2 bg-black/70 hover:bg-[#2a2a2a] rounded-full pl-1 pr-3 py-1 transition"
            >
              <span className="w-7 h-7 rounded-full bg-spotify text-black font-bold grid place-items-center text-sm">
                {user.name.charAt(0).toUpperCase()}
              </span>
              <span className="text-sm font-bold max-w-[120px] truncate">{user.name}</span>
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-12 w-56 z-50 bg-[#282828] rounded-md p-1 shadow-2xl text-sm">
                  <p className="px-3 py-2 text-sp-muted truncate">{user.email}</p>
                  <Link
                    to="/library"
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2 rounded hover:bg-[#3e3e3e]"
                  >
                    Your Library
                  </Link>
                  <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded hover:bg-[#3e3e3e]">
                    Log out
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <button
              onClick={() => openAuth('signup')}
              className="px-5 md:px-7 py-3 rounded-full bg-white text-black font-bold text-sm hover:scale-105 transition"
            >
              Sign up
            </button>
            <button
              onClick={() => openAuth('login')}
              className="px-5 md:px-7 py-3 rounded-full bg-black text-white font-bold text-sm hover:scale-105 transition"
            >
              Log in
            </button>
          </>
        )}
      </div>
    </header>
  )
}
