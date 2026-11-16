import Icon from './Icon.jsx'
import AddToPlaylist from './AddToPlaylist.jsx'
import { usePlayer } from '../context/PlayerContext.jsx'
import { useLibrary } from '../context/LibraryContext.jsx'
import { fmtTime } from '../lib/music.js'

export default function SongRow({ song, index = 0, list = [], showAlbum = true, onRemove }) {
  const { current, playing, playSong } = usePlayer()
  const { isLiked, toggleLike } = useLibrary()
  const active = current?.id === song.id
  const liked = isLiked(song.id)

  return (
    <div
      onClick={() => playSong(song, list)}
      className="group grid grid-cols-[32px_minmax(0,1fr)_auto] md:grid-cols-[32px_minmax(0,1fr)_minmax(0,0.8fr)_auto] items-center gap-4 px-3 py-2 rounded-md hover:bg-white/10 cursor-pointer select-none"
    >
      <div className="w-8 text-center text-sm text-sp-muted">
        {active && playing ? (
          <Icon name="music" className="w-4 h-4 mx-auto text-spotify" />
        ) : (
          <>
            <span className={`group-hover:hidden ${active ? 'text-spotify' : ''}`}>{index + 1}</span>
            <Icon name="play" className="hidden group-hover:block w-4 h-4 mx-auto text-white" />
          </>
        )}
      </div>

      <div className="flex items-center gap-3 min-w-0">
        <img
          src={song.thumb || song.image}
          alt=""
          loading="lazy"
          className="w-10 h-10 rounded object-cover shrink-0 bg-sp-high"
        />
        <div className="min-w-0">
          <p className={`truncate font-medium ${active ? 'text-spotify' : 'text-white'}`}>{song.title}</p>
          <p className="truncate text-xs text-sp-muted">{song.artist}</p>
        </div>
      </div>

      <p className="hidden md:block truncate text-sm text-sp-muted">{showAlbum ? song.album : ''}</p>

      <div className="flex items-center justify-end gap-4 text-sp-muted text-sm" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => toggleLike(song)}
          aria-label={liked ? 'Unlike' : 'Like'}
          className={`transition ${liked ? 'text-spotify opacity-100' : 'opacity-0 group-hover:opacity-100 hover:text-white'}`}
        >
          <Icon name={liked ? 'heartFilled' : 'heart'} className="w-4 h-4" />
        </button>
        {onRemove && (
          <button
            onClick={() => onRemove(song)}
            aria-label="Remove from playlist"
            className="opacity-0 group-hover:opacity-100 hover:text-white transition"
          >
            <Icon name="close" className="w-4 h-4" />
          </button>
        )}
        <AddToPlaylist song={song} />
        <span className="hidden sm:block w-10 text-right tabular-nums">{fmtTime(song.duration)}</span>
      </div>
    </div>
  )
}
