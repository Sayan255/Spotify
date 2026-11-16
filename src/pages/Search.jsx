import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchSongs } from '../lib/music.js'
import Icon from '../components/Icon.jsx'
import SongRow from '../components/SongRow.jsx'

const CATEGORIES = [
  { title: 'Bollywood Hits', term: 'bollywood hits', color: 'bg-orange-600', image: 'photo-1501386761578-eac5c94b800a' },
  { title: 'Bengali Hits', term: 'bengali songs', color: 'bg-emerald-700', image: 'photo-1506157786151-b8491531f063' },
  { title: 'Rabindra Sangeet', term: 'rabindra sangeet', color: 'bg-teal-700', image: 'photo-1510915361894-db8b60106cb1' },
  { title: 'Romantic Hindi', term: 'romantic hindi songs', color: 'bg-rose-700', image: 'photo-1493225457124-a3eb161ffa5f' },
  { title: 'Retro Classics', term: 'old hindi classics', color: 'bg-amber-700', image: 'photo-1516280440614-37939bbacd81' },
  { title: 'Adhunik Bangla', term: 'adhunik bengali songs', color: 'bg-lime-700', image: 'photo-1516450360452-9312f5e86fc7' },
  { title: 'Party Anthems', term: 'hindi party songs', color: 'bg-fuchsia-700', image: 'photo-1470225620780-dba8ba36b745' },
  { title: 'Bhajans', term: 'hindi bhajan', color: 'bg-indigo-700', image: 'photo-1514525253161-7a46d19cd819' },
  { title: 'Sad Songs', term: 'sad hindi songs', color: 'bg-slate-600', image: 'photo-1507838153414-b4b713384a76' },
  { title: 'Workout', term: 'bollywood workout', color: 'bg-red-700', image: 'photo-1534258936925-c58bed479fcb' },
]

export default function Search() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const [text, setText] = useState(q)
  const [state, setState] = useState({ songs: [], loading: false, error: '' })

  // Sync input when query changes from elsewhere (e.g. category click)
  useEffect(() => {
    setText(q)
  }, [q])

  // Debounce typing into the URL
  useEffect(() => {
    const t = setTimeout(() => {
      const v = text.trim()
      if (v !== q.trim()) setParams(v ? { q: v } : {}, { replace: true })
    }, 450)
    return () => clearTimeout(t)
  }, [text, q, setParams])

  // Run the search
  useEffect(() => {
    const term = q.trim()
    if (!term) return
    let alive = true
    setState({ songs: [], loading: true, error: '' })
    searchSongs(term)
      .then((songs) => {
        if (alive) setState({ songs, loading: false, error: '' })
      })
      .catch((e) => {
        if (alive) setState({ songs: [], loading: false, error: e.message })
      })
    return () => {
      alive = false
    }
  }, [q])

  const browseCategory = (term) => {
    setText(term)
    setParams({ q: term })
  }

  return (
    <div className="pt-6">
      <div className="relative max-w-md">
        <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-black" />
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Search Hindi or Bengali songs, artists, albums"
          aria-label="Search"
          className="w-full bg-white text-black rounded-full py-3 pl-12 pr-4 placeholder:text-zinc-500 focus:outline-none"
        />
      </div>

      {!q.trim() ? (
        <>
          <h2 className="text-2xl font-bold mt-8 mb-4">Browse all</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {CATEGORIES.map((c) => (
              <button
                key={c.title}
                onClick={() => browseCategory(c.term)}
                className={`group relative h-36 sm:h-44 rounded-lg p-3 sm:p-4 text-left text-base sm:text-xl font-bold overflow-hidden hover:brightness-110 transition ${c.color}`}
              >
                <img
                  src={`https://images.unsplash.com/${c.image}?auto=format&fit=crop&w=800&q=80`}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />
                <span className="relative z-10 drop-shadow-lg">{c.title}</span>
                <span className="absolute -right-4 -bottom-4 w-20 h-20 rotate-25 rounded-md bg-white/10" />
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold mt-8 mb-4">Results for “{q}”</h2>
          {state.loading && <p className="text-sp-muted animate-pulse">Searching…</p>}
          {state.error && <p className="text-red-400">{state.error}</p>}
          {!state.loading && !state.error && state.songs.length === 0 && (
            <p className="text-sp-muted">No songs with previews found. Try another search.</p>
          )}
          <div className="flex flex-col">
            {state.songs.map((s, i) => (
              <SongRow key={s.id} song={s} index={i} list={state.songs} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
