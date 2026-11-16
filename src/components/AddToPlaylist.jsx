import { useState } from 'react'
import Icon from './Icon.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useLibrary } from '../context/LibraryContext.jsx'

export default function AddToPlaylist({ song }) {
  const { user, openAuth } = useAuth()
  const { playlists, addToPlaylist, removeFromPlaylist, createPlaylist } = useLibrary()
  const [open, setOpen] = useState(false)

  const stop = (e) => e.stopPropagation()

  const toggle = (e) => {
    e.stopPropagation()
    if (!user) {
      openAuth('signup')
      return
    }
    setOpen((o) => !o)
  }

  const newPlaylistWithSong = (e) => {
    stop(e)
    const id = createPlaylist()
    if (id) addToPlaylist(id, song)
    setOpen(false)
  }

  return (
    <div className="relative" onClick={stop}>
      <button
        onClick={toggle}
        aria-label="Add to playlist"
        title="Add to playlist"
        className={`transition hover:text-white ${open ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100'}`}
      >
        <Icon name="more" className="w-5 h-5" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={(e) => {
              stop(e)
              setOpen(false)
            }}
          />
          <div className="absolute right-0 bottom-full mb-2 w-60 max-h-72 overflow-y-auto z-50 bg-[#282828] rounded-md p-1 shadow-2xl text-sm text-white">
            <p className="px-3 py-2 text-xs text-sp-muted">Add to playlist</p>
            {playlists.length === 0 && <p className="px-3 py-2 text-sp-muted">No playlists yet</p>}
            {playlists.map((p) => {
              const has = p.songs.some((s) => s.id === song.id)
              return (
                <button
                  key={p.id}
                  onClick={(e) => {
                    stop(e)
                    if (has) removeFromPlaylist(p.id, song.id)
                    else addToPlaylist(p.id, song)
                  }}
                  className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded hover:bg-[#3e3e3e] text-left"
                >
                  <span className="truncate">{p.name}</span>
                  {has && <Icon name="check" className="w-4 h-4 text-spotify shrink-0" />}
                </button>
              )
            })}
            <button
              onClick={newPlaylistWithSong}
              className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-[#3e3e3e] border-t border-white/10 mt-1"
            >
              <Icon name="plus" className="w-4 h-4" />
              New playlist
            </button>
          </div>
        </>
      )}
    </div>
  )
}
