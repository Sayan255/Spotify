import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { load, save } from '../lib/storage.js'

const PlayerContext = createContext(null)

export function PlayerProvider({ children }) {
  const [audio] = useState(() => new Audio())
  const [queue, setQueue] = useState([])
  const [index, setIndex] = useState(-1)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(() => load('sp_volume', 0.8))
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState('off') // off | all | one
  const [error, setError] = useState('')

  const current = index >= 0 ? queue[index] || null : null

  const playAt = useCallback(
    (i, list) => {
      const song = list[i]
      if (!song?.audio) return
      setError('')
      audio.src = song.audio
      audio.currentTime = 0
      audio.play().catch((e) => {
        if (e.name !== 'AbortError') setError('Playback was blocked. Press play again.')
      })
      setQueue(list)
      setIndex(i)
      setProgress(0)
      setDuration(0)
    },
    [audio],
  )

  const next = () => {
    if (!queue.length) return
    let i
    if (shuffle && queue.length > 1) {
      do {
        i = Math.floor(Math.random() * queue.length)
      } while (i === index)
    } else {
      i = index + 1
      if (i >= queue.length) {
        if (repeat !== 'all') {
          audio.pause()
          audio.currentTime = 0
          setProgress(0)
          return
        }
        i = 0
      }
    }
    playAt(i, queue)
  }

  const prev = () => {
    if (!queue.length) return
    if (audio.currentTime > 3) {
      audio.currentTime = 0
      setProgress(0)
      return
    }
    const i = index > 0 ? index - 1 : repeat === 'all' ? queue.length - 1 : 0
    playAt(i, queue)
  }

  // Keep latest handlers in refs so audio event listeners never go stale.
  const nextRef = useRef(next)
  const prevRef = useRef(prev)
  useEffect(() => {
    nextRef.current = next
    prevRef.current = prev
  })

  // Audio element events
  useEffect(() => {
    const onTime = () => setProgress(audio.currentTime)
    const onMeta = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0)
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onEnded = () => nextRef.current()
    const onError = () => {
      if (audio.src) {
        setError('This preview could not be loaded.')
        setPlaying(false)
      }
    }
    const events = {
      timeupdate: onTime,
      loadedmetadata: onMeta,
      durationchange: onMeta,
      play: onPlay,
      pause: onPause,
      ended: onEnded,
      error: onError,
    }
    Object.entries(events).forEach(([n, fn]) => audio.addEventListener(n, fn))
    return () => Object.entries(events).forEach(([n, fn]) => audio.removeEventListener(n, fn))
  }, [audio])

  // Volume persistence
  useEffect(() => {
    audio.volume = volume
    save('sp_volume', volume)
  }, [audio, volume])

  // Repeat-one uses native looping
  useEffect(() => {
    audio.loop = repeat === 'one'
  }, [audio, repeat])

  // OS media controls (lock screen / keyboard media keys)
  useEffect(() => {
    if (!('mediaSession' in navigator)) return
    try {
      navigator.mediaSession.setActionHandler('play', () => audio.play())
      navigator.mediaSession.setActionHandler('pause', () => audio.pause())
      navigator.mediaSession.setActionHandler('nexttrack', () => nextRef.current())
      navigator.mediaSession.setActionHandler('previoustrack', () => prevRef.current())
    } catch {
      /* action not supported in this browser */
    }
  }, [audio])

  useEffect(() => {
    if (!current || !('mediaSession' in navigator) || typeof MediaMetadata === 'undefined') return
    navigator.mediaSession.metadata = new MediaMetadata({
      title: current.title,
      artist: current.artist,
      album: current.album,
      artwork: current.image ? [{ src: current.image, sizes: '600x600', type: 'image/jpeg' }] : [],
    })
  }, [current])

  const togglePlay = () => {
    if (!current) return
    if (audio.paused) audio.play().catch(() => setError('Playback was blocked. Press play again.'))
    else audio.pause()
  }

  const playSong = (song, list) => {
    if (!song?.audio) {
      setError('No audio preview is available for this song.')
      return
    }
    if (current?.id === song.id) {
      togglePlay()
      return
    }
    let l = list?.length ? list.filter((s) => s.audio) : [song]
    let i = l.findIndex((s) => s.id === song.id)
    if (i < 0) {
      l = [song]
      i = 0
    }
    playAt(i, l)
  }

  const playList = (list) => {
    const l = list.filter((s) => s.audio)
    if (!l.length) return
    const start = shuffle ? Math.floor(Math.random() * l.length) : 0
    playAt(start, l)
  }

  const seek = (t) => {
    audio.currentTime = t
    setProgress(t)
  }

  const value = {
    current,
    queue,
    index,
    playing,
    progress,
    duration,
    volume,
    shuffle,
    repeat,
    error,
    playSong,
    playList,
    togglePlay,
    next,
    prev,
    seek,
    setVolume: setVolumeState,
    toggleShuffle: () => setShuffle((s) => !s),
    cycleRepeat: () => setRepeat((r) => (r === 'off' ? 'all' : r === 'all' ? 'one' : 'off')),
  }

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}

export const usePlayer = () => useContext(PlayerContext)
