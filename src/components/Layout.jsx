import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Navbar from './Navbar.jsx'
import PlayerBar from './PlayerBar.jsx'
import AuthModal from './AuthModal.jsx'

export default function Layout() {
  return (
    <div className="h-screen flex flex-col bg-black p-2 gap-2 overflow-hidden">
      <div className="flex flex-1 min-h-0 gap-2">
        <Sidebar />
        <main className="flex-1 min-w-0 bg-sp-base rounded-lg overflow-y-auto">
          <Navbar />
          <div className="px-4 md:px-8 pb-10">
            <Outlet />
          </div>
        </main>
      </div>
      <PlayerBar />
      <AuthModal />
    </div>
  )
}
