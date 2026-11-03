import Navbar from './Components/Navbar'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'

function App() {
  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="min-h-screen text-ink">
        <Navbar />
        <main>
          <Outlet />
        </main>
      </div>
    </>
  )
}

export default App
