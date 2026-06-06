import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useMovieContext } from "../contexts/MovieContext";
import AuthModal from "../components/auth/Authmodal";
export default function Favorites() {
  const navigate = useNavigate();
  const { user, openAuth, logout } = useAuth();
  const { favorites, isFavorite, removeFromFavorites } = useMovieContext();

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handleRemoveFavorite = (e, movieId) => {
    e.stopPropagation();
    removeFromFavorites(movieId);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #1f2937, #374151, #4b5563)', color: 'white' }}>
      {/* Auth Modal */}
      <AuthModal />

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: 'rgba(17, 24, 39, 0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #374151' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Logo */}
            <div 
              style={{ fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer' }}
              onClick={() => navigate("/")}
            >
              <span style={{ color: 'white' }}>Movie</span>
              <span style={{ color: '#3b82f6' }}>.id</span>
            </div>

            {/* Navigation */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <button
                onClick={() => navigate("/")}
                style={{ padding: '0.5rem 1rem', backgroundColor: 'transparent', border: 'none', color: '#d1d5db', cursor: 'pointer', fontSize: '1rem', fontWeight: '500' }}
              >
                Home
              </button>
              <button
                style={{ padding: '0.5rem 1rem', backgroundColor: 'white', color: '#111827', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '1rem', fontWeight: '600' }}
              >
                Favorites
              </button>
            </nav>

            {/* User Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '2.5rem', height: '2.5rem', background: 'linear-gradient(to bottom right, #60a5fa, #a78bfa)', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {(user.username || user.email)[0].toUpperCase()}
                  </div>
                  <button
                    onClick={logout}
                    style={{ padding: '0.5rem 1rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600' }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => openAuth('login')}
                  style={{ padding: '0.5rem 1rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer' }}
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '2rem 1rem', maxWidth: '1280px', margin: '0 auto', minHeight: 'calc(100vh - 80px)' }}>
        {/* Header Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            My Favorites ❤️
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '1rem' }}>
            {favorites.length} {favorites.length === 1 ? 'movie' : 'movies'} in your collection
          </p>
        </div>

        {/* Favorites Grid */}
        {favorites.length > 0 ? (
          <div className="movie-grid" style={{ display: 'grid', gap: '1rem' }}>
            {favorites.map((movie) => (
              <div
                key={movie.id}
                style={{ cursor: 'pointer', position: 'relative' }}
                onClick={() => handleMovieClick(movie.id)}
              >
                <div style={{ 
                  position: 'relative', 
                  aspectRatio: '2/3',
                  width: '100%',
                  borderRadius: '1rem', 
                  overflow: 'hidden', 
                  marginBottom: '0.75rem', 
                  backgroundColor: '#374151' 
                }}>
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        display: 'block'
                      }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
                      No Image
                    </div>
                  )}
                  
                  {/* Remove from Favorites Button */}
                  <button
                    onClick={(e) => handleRemoveFavorite(e, movie.id)}
                    style={{ 
                      position: 'absolute', 
                      top: '0.5rem', 
                      right: '0.5rem', 
                      backgroundColor: '#ef4444', 
                      color: 'white',
                      border: 'none',
                      borderRadius: '9999px', 
                      padding: '0.5rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '2rem',
                      height: '2rem',
                      fontSize: '1rem',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    ✕
                  </button>

                  {/* Overlay on hover */}
                  <div className="movie-overlay" style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                    opacity: 0,
                    transition: 'opacity 0.3s',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '1rem'
                  }}>
                    <button style={{
                      width: '100%',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(12px)',
                      border: 'none',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      color: 'white',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}>
                      ▶️ <span>Watch Now</span>
                    </button>
                  </div>
                </div>
                
                <h3 style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {movie.title}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#9ca3af' }}>
                  <span>⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                  <span>•</span>
                  <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>💔</div>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>No favorites yet</h2>
            <p style={{ color: '#9ca3af', marginBottom: '2rem', fontSize: '1.125rem' }}>
              Start adding movies to your favorites and they will appear here
            </p>
            <button
              onClick={() => navigate("/")}
              style={{ padding: '0.75rem 2rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.2s' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
            >
              Browse Movies
            </button>
          </div>
        )}
      </main>

      <style>{`
        @media (min-width: 768px) {
          .movie-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
        
        @media (min-width: 1024px) {
          .movie-grid { grid-template-columns: repeat(5, 1fr) !important; }
        }
        
        @media (min-width: 1280px) {
          .movie-grid { grid-template-columns: repeat(6, 1fr) !important; }
        }
        
        @media (max-width: 767px) {
          .movie-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        
        @media (min-width: 640px) and (max-width: 767px) {
          .movie-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }

        .movie-grid > div:hover .movie-overlay {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
