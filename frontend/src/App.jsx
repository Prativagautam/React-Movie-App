import './css/App.css'
import Favorites from './pages/Favorites'
import Home from './pages/Home'
import { Routes, Route } from "react-router-dom"
import { MovieProvider } from "./contexts/MovieContext"
import { AuthProvider } from "./contexts/AuthContext"   
import MovieDetails from "./pages/MovieDetails"
function App() {
  return (
    <AuthProvider> 
      <MovieProvider>
        {/* Removed NavBar - it's now integrated into each page */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/tv/:id" element={<MovieDetails />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </MovieProvider>
    </AuthProvider>
  )
}

export default App
