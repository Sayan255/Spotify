import { HashRouter, Routes, Route, Link } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { LibraryProvider } from './context/LibraryContext.jsx'
import { PlayerProvider } from './context/PlayerContext.jsx'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Search from './pages/Search.jsx'
import Language from './pages/Language.jsx'
import Artist from './pages/Artist.jsx'
import Album from './pages/Album.jsx'
import Library from './pages/Library.jsx'
import PlaylistPage from './pages/PlaylistPage.jsx'

function NotFound() {
  return (
    <div className="pt-24 text-center">
      <h1 className="text-4xl font-bold">Page not found</h1>
      <Link to="/" className="inline-block mt-6 px-6 py-3 rounded-full bg-white text-black font-bold">
        Go home
      </Link>
    </div>
  )
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <LibraryProvider>
          <PlayerProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="search" element={<Search />} />
                <Route path="language/:lang" element={<Language />} />
                <Route path="artist/:key" element={<Artist />} />
                <Route path="album/:id" element={<Album />} />
                <Route path="library" element={<Library />} />
                <Route path="playlist/:id" element={<PlaylistPage />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </PlayerProvider>
        </LibraryProvider>
      </AuthProvider>
    </HashRouter>
  )
}
