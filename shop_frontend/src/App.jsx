import { useEffect } from 'react'
import './App.css'
import Navbar from './Components/Navbar/Navbar'
import { Outlet } from 'react-router-dom'

function App() {
  useEffect(() => {
    const isDarkMode = localStorage.getItem("isDarkMode") === "true";
    document.documentElement.setAttribute("data-theme", isDarkMode ? "dark" : "cupcake");
  }, []);
  
  return (
    <div className="app-shell">
      <div className="app-frame">
      <Navbar />
        <main className="app-content">
          <Outlet/>
        </main>
      </div>
    </div>
  )
}

export default App
