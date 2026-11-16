import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Navbar from './Navbar.jsx'
import PlayerBar from './PlayerBar.jsx'
import AuthModal from './AuthModal.jsx'

export default function Layout() {
  return (
    <div className="h-[100dvh] min-h-[100svh] flex flex-col bg-black p-1 sm:p-2 gap-1 sm:gap-2 overflow-hidden">
      <div className="flex flex-1 min-h-0 gap-1 sm:gap-2">
        <Sidebar />
        <main className="flex-1 min-w-0 bg-sp-base rounded-lg overflow-y-auto">
          <Navbar />
          <div className="px-3 sm:px-5 lg:px-8 pb-8 sm:pb-10">
            <Outlet />
          </div>
        </main>
      </div>
      <PlayerBar />
      <AuthModal />
    </div>
  )
}
