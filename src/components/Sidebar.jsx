import { Link, NavLink, useNavigate } from 'react-router-dom'
import Icon from './Icon.jsx'
import Logo from './Logo.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useLibrary } from '../context/LibraryContext.jsx'
import { LANGUAGES } from '../lib/music.js'

const linkCls = ({ isActive }) =>
  `flex items-center gap-4 px-2 py-2 rounded-md font-bold text-sm transition-colors ${
    isActive ? 'text-white' : 'text-sp-muted hover:text-white'
  }`

export default function Sidebar() {
  const navigate = useNavigate()
  const { user, openAuth } = useAuth()
  const { playlists, liked, createPlaylist } = useLibrary()

  const newPlaylist = () => {
    const id = createPlaylist()
    if (id) navigate(`/playlist/${id}`)
  }

  return (
    <aside className="hidden md:flex flex-col gap-2 w-64 shrink-0 min-h-0">
      <div className="bg-sp-elev rounded-lg p-4 flex flex-col gap-1">
        <Link to="/" className="px-2 pb-4">
          <Logo />
        </Link>
        <NavLink to="/" end className={linkCls}>
          <Icon name="home" className="w-6 h-6" />
          Home
        </NavLink>
        <NavLink to="/search" className={linkCls}>
          <Icon name="search" className="w-6 h-6" />
          Search
        </NavLink>
        <NavLink to="/library" className={linkCls}>
          <Icon name="library" className="w-6 h-6" />
          Your Library
        </NavLink>
        <button
          onClick={newPlaylist}
          className="flex items-center gap-4 px-2 py-2 rounded-md font-bold text-sm text-sp-muted hover:text-white text-left"
        >
          <span className="w-6 h-6 rounded-sm bg-sp-muted text-black grid place-items-center">
            <Icon name="plus" className="w-4 h-4" />
          </span>
          Create playlist
        </button>
      </div>

      <div className="flex-1 min-h-0 bg-sp-elev rounded-lg p-2 flex flex-col overflow-hidden">
        <div className="overflow-y-auto flex-1 min-h-0 flex flex-col gap-1">
          <p className="px-2 pt-2 pb-1 text-xs font-bold text-sp-muted uppercase tracking-wider">Languages</p>
          {Object.values(LANGUAGES).map((l) => (
            <NavLink key={l.key} to={`/language/${l.key}`} className={linkCls}>
              <span className={`w-8 h-8 rounded bg-gradient-to-br ${l.gradient} grid place-items-center text-xs font-black text-white`}>
                {l.name[0]}
              </span>
              <span className="truncate">{l.name} Songs</span>
            </NavLink>
          ))}

          <p className="px-2 pt-4 pb-1 text-xs font-bold text-sp-muted uppercase tracking-wider">Your playlists</p>
          {!user ? (
            <div className="mx-1 mt-1 rounded-lg bg-sp-high/70 p-3 text-sm text-sp-muted">
              <p className="leading-relaxed">Log in to create and save playlists.</p>
              <button
                onClick={() => openAuth('login')}
                className="mt-3 rounded-full bg-spotify px-4 py-2 text-sm font-bold text-black transition-all hover:scale-[1.03] hover:bg-spotify-hover active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-sp-high"
              >
                Log in
              </button>
            </div>
          ) : (
            <>
              <NavLink to="/playlist/liked" className={linkCls}>
                <span className="w-8 h-8 rounded bg-gradient-to-br from-indigo-700 to-sky-300 grid place-items-center">
                  <Icon name="heartFilled" className="w-4 h-4 text-white" />
                </span>
                <span className="truncate">Liked Songs ({liked.length})</span>
              </NavLink>
              {playlists.map((p) => (
                <NavLink key={p.id} to={`/playlist/${p.id}`} className={linkCls}>
                  <span className="w-8 h-8 rounded bg-sp-high grid place-items-center text-sp-muted">
                    <Icon name="music" className="w-4 h-4" />
                  </span>
                  <span className="truncate">{p.name}</span>
                </NavLink>
              ))}
            </>
          )}
        </div>
      </div>
    </aside>
  )
}
