
import './css/App.css'
import Favorites from './pages/Favorites'
import Home from './pages/Home'
import { Routes, Route } from "react-router-dom"
import { MovieProvider } from "./contexts/MovieContext"
import { AuthProvider } from "./contexts/AuthContext"   
import NavBar from "./components/NavBar"
import MovieDetails from "./pages/MovieDetails";

function App() {
  return (
    <AuthProvider> 
      <MovieProvider>
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
          </Routes>
        </main>
      </MovieProvider>
    </AuthProvider>
  )
}

export default App

