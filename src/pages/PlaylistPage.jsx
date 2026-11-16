import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useLibrary } from '../context/LibraryContext.jsx'
import { usePlayer } from '../context/PlayerContext.jsx'
import Icon from '../components/Icon.jsx'
import LoginPrompt from '../components/LoginPrompt.jsx'
import SongRow from '../components/SongRow.jsx'

export default function PlaylistPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { liked, playlists, renamePlaylist, deletePlaylist, removeFromPlaylist } = useLibrary()
  const { playList } = usePlayer()

  if (!user) {
    return (
      <LoginPrompt
        title="Log in to view this playlist"
        subtitle="Playlists and Liked Songs are saved to your account."
      />
    )
  }

  const isLiked = id === 'liked'
  const playlist = isLiked ? { id: 'liked', name: 'Liked Songs', songs: liked } : playlists.find((p) => p.id === id)

  if (!playlist) return <p className="pt-16 text-sp-muted">Playlist not found.</p>

  const songs = playlist.songs

  return (
    <div>
      <div
        className={`-mx-4 md:-mx-8 px-4 md:px-8 pt-16 pb-8 flex flex-col md:flex-row items-center md:items-end gap-6 bg-gradient-to-b ${
          isLiked ? 'from-indigo-700 to-sky-300' : 'from-zinc-600 to-sp-base'
        }`}
      >
        <div className="w-52 h-52 md:w-56 md:h-56 rounded shadow-2xl bg-black/30 overflow-hidden grid place-items-center shrink-0">
          {songs[0]?.image ? (
            <img src={songs[0].image} alt="" className="w-full h-full object-cover" />
          ) : isLiked ? (
            <Icon name="heartFilled" className="w-20 h-20 text-white" />
          ) : (
            <Icon name="music" className="w-20 h-20 text-sp-muted" />
          )}
        </div>
        <div className="text-center md:text-left min-w-0 w-full">
          <p className="text-xs font-bold uppercase tracking-widest">Playlist</p>
          {isLiked ? (
            <h1 className="text-4xl md:text-7xl font-black mt-2">Liked Songs</h1>
          ) : (
            <input
              key={id}
              defaultValue={playlist.name}
              onBlur={(e) => renamePlaylist(id, e.target.value)}
              aria-label="Playlist name"
              className="w-full bg-transparent text-4xl md:text-6xl font-black mt-2 focus:outline-none border-b border-transparent focus:border-white/40"
            />
          )}
          <p className="mt-3 text-sm opacity-90">
            {user.name} • {songs.length} songs
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6 py-6">
        <button
          onClick={() => playList(songs)}
          disabled={!songs.length}
          aria-label="Play playlist"
          className="w-14 h-14 rounded-full bg-spotify text-black grid place-items-center hover:scale-105 transition disabled:opacity-40 shadow-lg"
        >
          <Icon name="play" className="w-7 h-7" />
        </button>
        {!isLiked && (
          <button
            onClick={() => {
              deletePlaylist(id)
              navigate('/library')
            }}
            className="text-sm font-bold text-sp-muted hover:text-white"
          >
            Delete playlist
          </button>
        )}
      </div>

      {songs.length === 0 ? (
        <p className="text-sp-muted">
          {isLiked
            ? 'Songs you like will appear here. Tap the heart on any song.'
            : 'This playlist is empty. Use the “⋯” menu on any song to add it here.'}
        </p>
      ) : (
        <div className="flex flex-col">
          {songs.map((s, i) => (
            <SongRow
              key={s.id}
              song={s}
              index={i}
              list={songs}
              onRemove={isLiked ? undefined : (song) => removeFromPlaylist(id, song.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
