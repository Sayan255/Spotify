import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { LANGUAGES, albumsFromSongs, getArtist } from '../lib/music.js'
import { useArtistSongs } from '../hooks/useArtistSongs.js'
import { usePlayer } from '../context/PlayerContext.jsx'
import Card from '../components/Card.jsx'
import Icon from '../components/Icon.jsx'
import Section from '../components/Section.jsx'
import SongRow from '../components/SongRow.jsx'

export default function Artist() {
  const { key } = useParams()
  const artist = getArtist(key)
  const { playList } = usePlayer()
  const artists = useMemo(() => (artist ? [artist] : []), [artist])
  const { data, errors, loading } = useArtistSongs(artists)

  if (!artist) return <p className="pt-10 text-red-400">Artist not found.</p>

  const songs = data[key] || []
  const albums = albumsFromSongs(songs)
  const lang = LANGUAGES[artist.lang]

  return (
    <div>
      <div className={`-mx-3 sm:-mx-5 lg:-mx-8 px-3 sm:px-5 lg:px-8 pt-10 sm:pt-16 pb-7 sm:pb-8 flex flex-col md:flex-row items-center md:items-end gap-4 sm:gap-6 bg-gradient-to-b ${lang.gradient}`}>
        {songs[0]?.image ? (
          <img src={songs[0].image} alt={artist.name} className="w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full object-cover shadow-2xl" />
        ) : (
          <div className="w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full bg-black/30 grid place-items-center">
            <Icon name="music" className="w-16 h-16" />
          </div>
        )}
        <div className="text-center md:text-left">
          <p className="text-xs font-bold uppercase tracking-widest">Artist • {lang.name}</p>
          <h1 className="text-3xl sm:text-4xl lg:text-7xl font-black mt-2 break-words">{artist.name}</h1>
          <p className="mt-3 text-sm opacity-90">
            {songs.length} songs with previews • {albums.length} albums
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 py-6">
        <button
          onClick={() => playList(songs)}
          disabled={!songs.length}
          aria-label="Play"
          className="w-14 h-14 rounded-full bg-spotify text-black grid place-items-center hover:scale-105 transition disabled:opacity-40 shadow-lg"
        >
          <Icon name="play" className="w-7 h-7" />
        </button>
      </div>

      {loading && songs.length === 0 && <p className="text-sp-muted animate-pulse">Loading songs…</p>}
      {errors[key] && <p className="text-amber-400">{errors[key]}</p>}

      {songs.length > 0 && (
        <>
          <Section title="Popular">
            <div className="flex flex-col">
              {songs.slice(0, 10).map((s, i) => (
                <SongRow key={s.id} song={s} index={i} list={songs} />
              ))}
            </div>
          </Section>

          <Section title="Albums">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {albums.map((al) => (
                <Card
                  key={al.id}
                  to={`/album/${al.id}`}
                  image={al.image}
                  title={al.title}
                  subtitle={al.year || 'Album'}
                />
              ))}
            </div>
          </Section>

          <Section title="All songs">
            <div className="flex flex-col">
              {songs.map((s, i) => (
                <SongRow key={s.id} song={s} index={i} list={songs} />
              ))}
            </div>
          </Section>
        </>
      )}
    </div>
  )
}
