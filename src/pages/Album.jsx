import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getAlbum } from '../lib/music.js'
import { usePlayer } from '../context/PlayerContext.jsx'
import Icon from '../components/Icon.jsx'
import SongRow from '../components/SongRow.jsx'

export default function Album() {
  const { id } = useParams()
  const { playList } = usePlayer()
  const [state, setState] = useState({ loading: true, album: null, songs: [], error: '' })

  useEffect(() => {
    let alive = true
    setState({ loading: true, album: null, songs: [], error: '' })
    getAlbum(id)
      .then((r) => {
        if (alive) setState({ loading: false, album: r.album, songs: r.songs, error: '' })
      })
      .catch((e) => {
        if (alive) setState({ loading: false, album: null, songs: [], error: e.message })
      })
    return () => {
      alive = false
    }
  }, [id])

  const { album, songs, loading, error } = state
  if (loading) return <p className="pt-16 text-sp-muted animate-pulse">Loading album…</p>
  if (error || !album) return <p className="pt-16 text-red-400">{error || 'Album not found.'}</p>

  return (
    <div>
      <div className="-mx-3 sm:-mx-5 lg:-mx-8 px-3 sm:px-5 lg:px-8 pt-10 sm:pt-16 pb-7 sm:pb-8 flex flex-col md:flex-row items-center md:items-end gap-4 sm:gap-6 bg-gradient-to-b from-zinc-700 to-sp-base">
        {album.image ? (
          <img src={album.image} alt={album.title} className="w-40 h-40 sm:w-52 sm:h-52 md:w-60 md:h-60 rounded shadow-2xl object-cover" />
        ) : (
          <div className="w-40 h-40 sm:w-52 sm:h-52 md:w-60 md:h-60 rounded bg-sp-high grid place-items-center">
            <Icon name="music" className="w-16 h-16" />
          </div>
        )}
        <div className="text-center md:text-left min-w-0">
          <p className="text-xs font-bold uppercase tracking-widest">Album</p>
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black mt-2 break-words">{album.title}</h1>
          <p className="mt-4 text-sm text-sp-muted">
            <span className="text-white font-bold">{album.artist}</span>
            {album.year && ` • ${album.year}`} • {songs.length} songs with previews
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 py-6">
        <button
          onClick={() => playList(songs)}
          disabled={!songs.length}
          aria-label="Play album"
          className="w-14 h-14 rounded-full bg-spotify text-black grid place-items-center hover:scale-105 transition disabled:opacity-40 shadow-lg"
        >
          <Icon name="play" className="w-7 h-7" />
        </button>
      </div>

      <div className="hidden md:grid grid-cols-[32px_minmax(0,1fr)_auto] gap-4 px-3 pb-2 text-xs uppercase tracking-wider text-sp-muted border-b border-white/10 mb-2">
        <span>#</span>
        <span>Title</span>
        <span>Duration</span>
      </div>
      <div className="flex flex-col">
        {songs.map((s, i) => (
          <SongRow key={s.id} song={s} index={i} list={songs} showAlbum={false} />
        ))}
      </div>
    </div>
  )
}
