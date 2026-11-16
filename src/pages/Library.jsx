import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useLibrary } from '../context/LibraryContext.jsx'
import Card from '../components/Card.jsx'
import Icon from '../components/Icon.jsx'
import LoginPrompt from '../components/LoginPrompt.jsx'

export default function Library() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { playlists, liked, createPlaylist } = useLibrary()

  if (!user) {
    return (
      <LoginPrompt
        title="Create your library"
        subtitle="Log in to see your liked songs and playlists. Your library is saved in this browser."
      />
    )
  }

  const create = () => {
    const id = createPlaylist()
    if (id) navigate(`/playlist/${id}`)
  }

  return (
    <div className="pt-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Your Library</h1>
        <button
          onClick={create}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black font-bold text-sm hover:scale-105 transition"
        >
          <Icon name="plus" className="w-4 h-4" />
          Create playlist
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <Card
          to="/playlist/liked"
          image={liked[0]?.image}
          title="Liked Songs"
          subtitle={`Playlist • ${liked.length} songs`}
        />
        {playlists.map((p) => (
          <Card
            key={p.id}
            to={`/playlist/${p.id}`}
            image={p.songs[0]?.image}
            title={p.name}
            subtitle={`Playlist • ${p.songs.length} songs`}
          />
        ))}
      </div>

      {playlists.length === 0 && (
        <p className="text-sp-muted mt-6">
          You don't have any playlists yet. Create one, or add songs using the “⋯” menu on any track.
        </p>
      )}
    </div>
  )
}
