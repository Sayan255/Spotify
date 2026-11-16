import Icon from './Icon.jsx'
import { usePlayer } from '../context/PlayerContext.jsx'
import { useLibrary } from '../context/LibraryContext.jsx'
import { fmtTime } from '../lib/music.js'

const ctrl = (active) =>
  `transition disabled:opacity-40 ${active ? 'text-spotify' : 'text-sp-muted hover:text-white'}`

export default function PlayerBar() {
  const {
    current,
    playing,
    progress,
    duration,
    volume,
    shuffle,
    repeat,
    error,
    togglePlay,
    next,
    prev,
    seek,
    setVolume,
    toggleShuffle,
    cycleRepeat,
  } = usePlayer()
  const { isLiked, toggleLike } = useLibrary()
  const liked = current ? isLiked(current.id) : false

  return (
    <footer className="min-h-[6.5rem] md:h-24 shrink-0 bg-black border-t border-white/5 px-3 md:px-4 py-2 md:py-0 pb-[calc(0.5rem+env(safe-area-inset-bottom))] md:pb-0 grid grid-cols-[minmax(0,1fr)_auto] grid-rows-[1fr_auto] md:grid-rows-1 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)] items-center gap-x-3 gap-y-1 md:gap-4">
      {/* Now playing */}
      <div className="row-span-1 md:row-span-1 flex items-center gap-2 sm:gap-3 min-w-0">
        {current ? (
          <>
            <img src={current.image} alt="" className="w-11 h-11 sm:w-14 sm:h-14 rounded shadow-lg object-cover shrink-0" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{current.title}</p>
              <p className="truncate text-xs text-sp-muted">{current.artist}</p>
            </div>
            <button
              onClick={() => toggleLike(current)}
              aria-label={liked ? 'Remove from Liked Songs' : 'Save to Liked Songs'}
              className={`shrink-0 ${liked ? 'text-spotify' : 'text-sp-muted hover:text-white'}`}
            >
              <Icon name={liked ? 'heartFilled' : 'heart'} className="w-4 h-4" />
            </button>
          </>
        ) : (
          <p className="text-sm text-sp-muted truncate">Pick a Hindi or Bengali song to start listening</p>
        )}
      </div>

      {/* Compact seek bar for phones */}
      <div className="col-span-2 row-start-2 md:hidden flex items-center gap-2 min-w-0 text-[10px] text-sp-muted">
        <span className="w-7 text-right tabular-nums">{fmtTime(progress)}</span>
        <input
          type="range"
          min={0}
          max={duration || 1}
          step="0.1"
          value={Math.min(progress, duration || 0)}
          onChange={(e) => seek(Number(e.target.value))}
          disabled={!current}
          aria-label="Seek"
          className="flex-1 min-w-0 h-1 accent-spotify cursor-pointer disabled:cursor-default"
        />
        <span className="w-7 tabular-nums">{fmtTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="hidden md:flex flex-col items-center gap-2 min-w-0">
        <div className="flex items-center gap-5">
          <button onClick={toggleShuffle} aria-label="Shuffle" className={ctrl(shuffle)}>
            <Icon name="shuffle" className="w-4 h-4" />
          </button>
          <button onClick={prev} disabled={!current} aria-label="Previous" className={ctrl(false)}>
            <Icon name="prev" className="w-6 h-6" />
          </button>
          <button
            onClick={togglePlay}
            disabled={!current}
            aria-label={playing ? 'Pause' : 'Play'}
            className="w-9 h-9 rounded-full bg-white text-black grid place-items-center hover:scale-105 transition disabled:opacity-40"
          >
            <Icon name={playing ? 'pause' : 'play'} className="w-5 h-5" />
          </button>
          <button onClick={next} disabled={!current} aria-label="Next" className={ctrl(false)}>
            <Icon name="next" className="w-6 h-6" />
          </button>
          <button
            onClick={cycleRepeat}
            aria-label={`Repeat: ${repeat}`}
            className={`relative ${ctrl(repeat !== 'off')}`}
          >
            <Icon name="repeat" className="w-4 h-4" />
            {repeat === 'one' && (
              <span className="absolute -top-1 -right-1 text-[9px] font-bold text-black bg-spotify rounded-full w-3 h-3 grid place-items-center">
                1
              </span>
            )}
          </button>
        </div>
        <div className="flex items-center gap-2 w-full max-w-xl text-xs text-sp-muted">
          <span className="w-10 text-right tabular-nums">{fmtTime(progress)}</span>
          <input
            type="range"
            min={0}
            max={duration || 1}
            step="0.1"
            value={Math.min(progress, duration || 0)}
            onChange={(e) => seek(Number(e.target.value))}
            disabled={!current}
            aria-label="Seek"
            className="flex-1 h-1 accent-spotify cursor-pointer disabled:cursor-default"
          />
          <span className="w-10 tabular-nums">{fmtTime(duration)}</span>
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>

      {/* Volume */}
      <div className="hidden md:flex items-center justify-end gap-2 min-w-0">
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-wider text-sp-muted">30s preview</span>
        </div>
        <Icon name="volume" className="w-5 h-5 text-sp-muted shrink-0" />
        <input
          type="range"
          min={0}
          max={1}
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          aria-label="Volume"
          className="w-24 accent-spotify cursor-pointer"
        />
      </div>

      {/* Mobile play button */}
      <div className="col-start-2 row-start-1 flex md:hidden items-center gap-3">
        <button
          onClick={togglePlay}
          disabled={!current}
          aria-label={playing ? 'Pause' : 'Play'}
          className="w-10 h-10 rounded-full bg-white text-black grid place-items-center disabled:opacity-40"
        >
          <Icon name={playing ? 'pause' : 'play'} className="w-5 h-5" />
        </button>
        <button onClick={next} disabled={!current} aria-label="Next" className={ctrl(false)}>
          <Icon name="next" className="w-6 h-6" />
        </button>
      </div>
    </footer>
  )
}
