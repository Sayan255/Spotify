import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { LANGUAGES, albumsFromSongs, artistsByLang, dedupe } from '../lib/music.js'
import { useArtistSongs } from '../hooks/useArtistSongs.js'
import { usePlayer } from '../context/PlayerContext.jsx'
import Card from '../components/Card.jsx'
import Icon from '../components/Icon.jsx'
import Section from '../components/Section.jsx'
import SongRow from '../components/SongRow.jsx'

export default function Language() {
  const { lang } = useParams()
  const meta = LANGUAGES[lang]
  const artists = useMemo(() => artistsByLang(lang), [lang])
  const { data, loaded, total } = useArtistSongs(artists)
  const { playList } = usePlayer()
  const [filter, setFilter] = useState('')

  if (!meta) return <p className="pt-10 text-red-400">Language not found.</p>

  const songs = dedupe(artists.flatMap((a) => data[a.key] || []))
  const albums = albumsFromSongs(songs)
  const q = filter.trim().toLowerCase()
  const shown = q ? songs.filter((s) => `${s.title} ${s.artist} ${s.album}`.toLowerCase().includes(q)) : songs

  return (
    <div>
      <div className={`-mx-4 md:-mx-8 px-4 md:px-8 pt-16 pb-8 bg-gradient-to-b ${meta.gradient}`}>
        <p className="text-xs font-bold uppercase tracking-widest">Language</p>
        <h1 className="text-5xl md:text-8xl font-black mt-2">{meta.name} Songs</h1>
        <p className="mt-4 text-sm opacity-90">{meta.tagline}</p>
        <p className="mt-2 text-sm opacity-80">
          {artists.length} artists • {songs.length} songs
          {loaded < total && ' • loading more…'}
        </p>
      </div>

      <div className="flex items-center gap-4 py-6">
        <button
          onClick={() => playList(shown)}
          disabled={!shown.length}
          aria-label="Play all"
          className="w-14 h-14 rounded-full bg-spotify text-black grid place-items-center hover:scale-105 transition disabled:opacity-40 shadow-lg"
        >
          <Icon name="play" className="w-7 h-7" />
        </button>
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter songs"
          className="bg-sp-high rounded-full px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-white/30"
        />
      </div>

      <Section title="Artists">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {artists.map((a) => (
            <Card
              key={a.key}
              to={`/artist/${a.key}`}
              image={data[a.key]?.[0]?.image}
              title={a.name}
              subtitle="Artist"
              round
            />
          ))}
        </div>
      </Section>

      <Section title="Albums">
        {albums.length === 0 ? (
          <p className="text-sp-muted animate-pulse">Loading albums…</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {albums.map((al) => (
              <Card
                key={al.id}
                to={`/album/${al.id}`}
                image={al.image}
                title={al.title}
                subtitle={`${al.artist}${al.year ? ` • ${al.year}` : ''}`}
              />
            ))}
          </div>
        )}
      </Section>

      <Section title="All songs">
        {loaded < total && songs.length === 0 && <p className="text-sp-muted animate-pulse">Loading songs…</p>}
        <div className="flex flex-col">
          {shown.map((s, i) => (
            <SongRow key={s.id} song={s} index={i} list={shown} />
          ))}
        </div>
        {loaded === total && shown.length === 0 && <p className="text-sp-muted mt-4">No songs match your filter.</p>}
      </Section>
    </div>
  )
}
