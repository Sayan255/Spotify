import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchSongs } from '../lib/music.js'
import Icon from '../components/Icon.jsx'
import SongRow from '../components/SongRow.jsx'

const CATEGORIES = [
  { title: 'Bollywood Hits', term: 'bollywood hits', color: 'bg-orange-600' },
  { title: 'Bengali Hits', term: 'bengali songs', color: 'bg-emerald-700' },
  { title: 'Rabindra Sangeet', term: 'rabindra sangeet', color: 'bg-teal-700' },
  { title: 'Romantic Hindi', term: 'romantic hindi songs', color: 'bg-rose-700' },
  { title: 'Retro Classics', term: 'old hindi classics', color: 'bg-amber-700' },
  { title: 'Adhunik Bangla', term: 'adhunik bengali songs', color: 'bg-lime-700' },
  { title: 'Party Anthems', term: 'hindi party songs', color: 'bg-fuchsia-700' },
  { title: 'Bhajans', term: 'hindi bhajan', color: 'bg-indigo-700' },
  { title: 'Sad Songs', term: 'sad hindi songs', color: 'bg-slate-600' },
  { title: 'Workout', term: 'bollywood workout', color: 'bg-red-700' },
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
                className={`relative h-36 rounded-lg p-4 text-left text-xl font-bold overflow-hidden hover:brightness-110 transition ${c.color}`}
              >
                {c.title}
                <span className="absolute -right-4 -bottom-4 w-20 h-20 rotate-25 bg-black/20 rounded-md" />
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
