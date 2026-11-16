import { createContext, useCallback, useContext, useState } from 'react'
import { load, save } from '../lib/storage.js'
import { useAuth } from './AuthContext.jsx'

const LIB_KEY = 'sp_libraries' // { [userId]: { liked: [], playlists: [] } }
const EMPTY = { liked: [], playlists: [] }

const LibraryContext = createContext(null)

export function LibraryProvider({ children }) {
  const { user, openAuth } = useAuth()
  const [libs, setLibs] = useState(() => load(LIB_KEY, {}))
  const uid = user?.id
  const lib = (uid && libs[uid]) || EMPTY

  const update = useCallback(
    (fn) => {
      if (!uid) return
      setLibs((prev) => {
        const next = { ...prev, [uid]: fn(prev[uid] || EMPTY) }
        save(LIB_KEY, next)
        return next
      })
    },
    [uid],
  )

  const isLiked = useCallback((id) => lib.liked.some((s) => s.id === id), [lib.liked])

  const toggleLike = (song) => {
    if (!uid) return openAuth('signup')
    update((cur) => ({
      ...cur,
      liked: cur.liked.some((s) => s.id === song.id)
        ? cur.liked.filter((s) => s.id !== song.id)
        : [song, ...cur.liked],
    }))
  }

  const createPlaylist = () => {
    if (!uid) {
      openAuth('signup')
      return null
    }
    const id = `pl_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`
    update((cur) => ({
      ...cur,
      playlists: [
        ...cur.playlists,
        { id, name: `My Playlist #${cur.playlists.length + 1}`, songs: [], createdAt: Date.now() },
      ],
    }))
    return id
  }

  const renamePlaylist = (id, name) =>
    update((cur) => ({
      ...cur,
      playlists: cur.playlists.map((p) => (p.id === id ? { ...p, name: name.trim() || p.name } : p)),
    }))

  const deletePlaylist = (id) =>
    update((cur) => ({ ...cur, playlists: cur.playlists.filter((p) => p.id !== id) }))

  const addToPlaylist = (id, song) =>
    update((cur) => ({
      ...cur,
      playlists: cur.playlists.map((p) =>
        p.id === id && !p.songs.some((s) => s.id === song.id) ? { ...p, songs: [...p.songs, song] } : p,
      ),
    }))

  const removeFromPlaylist = (id, songId) =>
    update((cur) => ({
      ...cur,
      playlists: cur.playlists.map((p) =>
        p.id === id ? { ...p, songs: p.songs.filter((s) => s.id !== songId) } : p,
      ),
    }))

  return (
    <LibraryContext.Provider
      value={{
        liked: lib.liked,
        playlists: lib.playlists,
        isLiked,
        toggleLike,
        createPlaylist,
        renamePlaylist,
        deletePlaylist,
        addToPlaylist,
        removeFromPlaylist,
      }}
    >
      {children}
    </LibraryContext.Provider>
  )
}

export const useLibrary = () => useContext(LibraryContext)
