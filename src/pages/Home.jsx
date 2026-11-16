import { Link } from 'react-router-dom'
import {
  ARTISTS,
  LANGUAGES,
  albumsFromSongs,
  artistsByLang,
  dedupe,
  roundRobin,
} from '../lib/music.js'
import { useArtistSongs } from '../hooks/useArtistSongs.js'
import { useAuth } from '../context/AuthContext.jsx'
import Card from '../components/Card.jsx'
import Section from '../components/Section.jsx'
import SongRow from '../components/SongRow.jsx'

const greeting = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

function LanguageSection({ lang, data }) {
  const meta = LANGUAGES[lang]
  const artists = artistsByLang(lang)
  const songs = dedupe(artists.flatMap((a) => data[a.key] || []))
  const top = roundRobin(
    artists.map((a) => data[a.key] || []),
    8,
  )
  const albums = albumsFromSongs(songs).slice(0, 6)

  return (
    <>
      <Section title={`Top ${meta.name} songs`} link={`/language/${lang}`} linkText="All songs">
        {top.length === 0 ? (
          <p className="text-sp-muted animate-pulse">Loading songs…</p>
        ) : (
          <div className="flex flex-col">
            {top.map((s, i) => (
              <SongRow key={s.id} song={s} index={i} list={songs} />
            ))}
          </div>
        )}
      </Section>

      <Section title={`Popular ${meta.name} artists`}>
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

      <Section title={`${meta.name} albums`}>
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
    </>
  )
}

export default function Home() {
  const { user } = useAuth()
  const { data, errors, loaded, total } = useArtistSongs(ARTISTS)
  const failed = Object.keys(errors).length

  return (
    <div>
      <h1 className="pt-6 text-3xl md:text-4xl font-bold">
        {greeting()}
        {user ? `, ${user.name.split(' ')[0]}` : ''}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {Object.values(LANGUAGES).map((l) => (
          <Link
            key={l.key}
            to={`/language/${l.key}`}
            className={`relative overflow-hidden rounded-lg p-6 h-40 bg-gradient-to-br ${l.gradient} hover:brightness-110 transition`}
          >
            <p className="text-xs font-bold uppercase tracking-widest opacity-80">Language</p>
            <h2 className="text-3xl font-black mt-1">{l.name} Songs</h2>
            <p className="text-sm mt-2 opacity-90 max-w-xs">{l.tagline}</p>
            <span className="absolute right-4 bottom-2 text-6xl opacity-40 select-none">{l.emoji}</span>
          </Link>
        ))}
      </div>

      {loaded < total && failed === 0 && (
        <p className="mt-6 text-sm text-sp-muted animate-pulse">
          Loading songs from the catalogue… {loaded}/{total} artists
        </p>
      )}
      {failed > 0 && (
        <p className="mt-6 text-sm text-amber-400">
          {failed} artist(s) could not be loaded right now. Refresh the page in a minute to retry.
        </p>
      )}

      <LanguageSection lang="hindi" data={data} />
      <LanguageSection lang="bengali" data={data} />
    </div>
  )
}
