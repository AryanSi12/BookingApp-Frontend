import { useState } from 'react'
import Navbar from './Components/Navbar'
import Hero from './Components/Hero'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Toaster richColors position="top-right" />
     <div className="relative min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white overflow-hidden">
  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[500px] md:w-[900px] h-[500px] md:h-[900px] bg-cyan-400 opacity-10 rounded-full blur-3xl pointer-events-none" />
  
  <Navbar />
  <main>
    <Outlet />
  </main>
</div>

    </>
  )
}

export default App