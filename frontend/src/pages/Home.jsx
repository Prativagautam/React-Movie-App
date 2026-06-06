

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { searchMovies, getPopularMovies } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useMovieContext } from "../contexts/MovieContext";
import AuthModal from "../components/auth/Authmodal";
import { Search } from "lucide-react";

import { 
  searchMovies, 
  getPopularMovies, 
  getMoviesByGenre,
  getPopularTVSeries,
  searchTVSeries,
  getTVSeriesByGenre 
} from "../services/api";
import MovieCard from "../components/movie/MovieCard"; // Add this import
export default function Home() {
     const movieGenreMap = {
     "Trending": null,
     "Action": 28,
     "Romance": 10749,
     "Animation": 16,
     "Horror": 27,
     "Special": 878,
    "Drama": 18
     };

     const tvGenreMap = {
    "Trending": null,
    "Drama": 18,
    "Action & Adventure": 10759,
    "Comedy": 35,
    "Animation": 16,
    "Sci-Fi & Fantasy": 10765,
    "Documentary": 99
    };



  const navigate = useNavigate();
  const { user, openAuth, logout } = useAuth();
  const { favorites, isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  
  // Movie states
  const [movies, setMovies] = useState([]);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI states
  const [activeTab, setActiveTab] = useState("Movie");
  const [activeGenre, setActiveGenre] = useState("Trending");
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const tabs = ["Movie", "Series", "Originals"];
  //const genres = ["Trending", "Action", "Romance", "Animation", "Horror", "Special", "Drama"];
  const getGenres = () => {
  if (activeTab === "Series") {
    return ["Trending", "Drama", "Action & Adventure", "Comedy", "Animation", "Sci-Fi & Fantasy", "Documentary"];
  } else {
    return ["Trending", "Action", "Romance", "Animation", "Horror", "Special", "Drama"];
  }
};

// Then use it in your component:
const genres = getGenres();

  // Load popular movies on mount
  // useEffect(() => {
  //   const loadPopularMovies = async () => {
  //     try {
  //       const popularMovies = await getPopularMovies();
  //       setMovies(popularMovies);
  //       setFeaturedMovies(popularMovies.slice(0, 2));
  //     } catch (err) {
  //       console.error(err);
  //       setError("Failed to load movies...");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   loadPopularMovies();
  // }, []);
  useEffect(() => {
  const loadPopularContent = async () => {
    try {
      let popularContent;
      
      if (activeTab === "Movie") {
        popularContent = await getPopularMovies();
      } else if (activeTab === "Series") {
        popularContent = await getPopularTVSeries();
      } else {
        // For "Originals" - use movies for now, or you can create a custom category later
        popularContent = await getPopularMovies();
      }
      
      setMovies(popularContent);
      setFeaturedMovies(popularContent.slice(0, 2));
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load content...");
    } finally {
      setLoading(false);
    }
  };
  
  loadPopularContent();
}, [activeTab]); // Add activeTab as dependency

  // Debouncing effect for search - waits 500ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Search effect - runs when debounced query changes
  // useEffect(() => {
  //   if (!debouncedQuery.trim()) {
  //     const loadPopularMovies = async () => {
  //       setLoading(true);
  //       try {
  //         const popularMovies = await getPopularMovies();
  //         setMovies(popularMovies);
  //         setFeaturedMovies(popularMovies.slice(0, 2));
  //         setError(null);
  //       } catch (err) {
  //         console.error(err);
  //         setError("Failed to load movies...");
  //       } finally {
  //         setLoading(false);
  //       }
  //     };
  //     loadPopularMovies();
  //     return;
  //   }

  //   const performSearch = async () => {
  //     setLoading(true);
  //     try {
  //       const searchResults = await searchMovies(debouncedQuery);
  //       setMovies(searchResults);
  //       setFeaturedMovies([]);
  //       setError(null);
  //     } catch (err) {
  //       console.error(err);
  //       setError("Failed to search movies...");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   performSearch();
  // }, [debouncedQuery]);
  // Search effect - runs when debounced query changes
useEffect(() => {
  if (!debouncedQuery.trim()) {
    const loadPopularContent = async () => {
      setLoading(true);
      try {
        let popularContent;
        if (activeTab === "Movie") {
          popularContent = await getPopularMovies();
        } else if (activeTab === "Series") {
          popularContent = await getPopularTVSeries();
        } else {
          popularContent = await getPopularMovies();
        }
        
        setMovies(popularContent);
        setFeaturedMovies(popularContent.slice(0, 2));
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load content...");
      } finally {
        setLoading(false);
      }
    };
    loadPopularContent();
    return;
  }

  const performSearch = async () => {
    setLoading(true);
    try {
      let searchResults;
      if (activeTab === "Movie") {
        searchResults = await searchMovies(debouncedQuery);
      } else if (activeTab === "Series") {
        searchResults = await searchTVSeries(debouncedQuery);
      } else {
        searchResults = await searchMovies(debouncedQuery);
      }
      
      setMovies(searchResults);
      setFeaturedMovies([]);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to search...");
    } finally {
      setLoading(false);
    }
  };

  performSearch();
}, [debouncedQuery, activeTab]);
  // Load movies when genre changes
// useEffect(() => {
//   if (searchQuery) return; // Don't load if user is searching
  
//   const loadMoviesByGenre = async () => {
//     setLoading(true);
//     try {
//       let genreMovies;
//       const genreId = genreMap[activeGenre];
      
//       if (genreId === null) {
//         // Load popular movies for "Trending"
//         genreMovies = await getPopularMovies();
//       } else {
//         // Load movies by specific genre
//         genreMovies = await getMoviesByGenre(genreId);
//       }
      
//       setMovies(genreMovies);
//       setFeaturedMovies(genreMovies.slice(0, 2));
//       setError(null);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load movies...");
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   loadMoviesByGenre();
// }, [activeGenre, searchQuery]);
// Load content when genre changes
useEffect(() => {
  if (searchQuery) return;

  const loadContentByGenre = async () => {
    setLoading(true);
    try {
      let genreContent;
      const currentGenreMap = activeTab === "Series" ? tvGenreMap : movieGenreMap;
      const genreId = currentGenreMap[activeGenre];
      
      if (genreId === null) {
        // Load popular content
        if (activeTab === "Movie") {
          genreContent = await getPopularMovies();
        } else if (activeTab === "Series") {
          genreContent = await getPopularTVSeries();
        } else {
          genreContent = await getPopularMovies();
        }
      } else {
        // Load content by specific genre
        if (activeTab === "Movie") {
          genreContent = await getMoviesByGenre(genreId);
        } else if (activeTab === "Series") {
          genreContent = await getTVSeriesByGenre(genreId);
        } else {
          genreContent = await getMoviesByGenre(genreId);
        }
      }
      
      setMovies(genreContent);
      setFeaturedMovies(genreContent.slice(0, 2));
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load content...");
    } finally {
      setLoading(false);
    }
  };
  
  loadContentByGenre();
}, [activeGenre, searchQuery, activeTab]);

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  const toggleFavorite = (e, movie) => {
    e.stopPropagation();
    if (!user) {
      openAuth('login');
      return;
    }
    if (isFavorite(movie.id)) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #1f2937, #374151, #4b5563)', color: 'white', paddingBottom: '3rem' }}>
      <AuthModal />
      
      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: 'rgba(17, 24, 39, 0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #374151' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Logo */}
            <div 
              style={{ fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer' }}
              onClick={() => {
                navigate("/");
                setSearchQuery("");
              }}
            >
              <span style={{ color: 'white' }}>Movie</span>
              <span style={{ color: '#3b82f6' }}>.id</span>
            </div>
           {/* Desktop Navigation */}
<nav className="hidden desktop-nav">
  <div className="flex items-center gap-2">
    {tabs.map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className="px-6 py-3 rounded-full text-center text-sm font-medium border border-white/30 transition-all duration-300 backdrop-blur-sm hover:bg-white/20 hover:text-white"
        style={{
          backgroundColor: activeTab === tab ? 'rgba(184, 168, 168, 0.25)' : 'rgba(59, 59, 79, 0.19)',
          color: activeTab === tab ? 'white' : 'rgba(255, 255, 255, 0.8)',
          transform: activeTab === tab ? 'scale(1.05)' : 'scale(1)',
          boxShadow: activeTab === tab ? '0 4px 15px rgba(0, 0, 0, 0.2)' : 'none'
        }}
      >
        {tab}
      </button>
    ))}
    
    {/* sliding search */}
    <div className="relative ml-2">
      {!searchOpen ? (
        <button
          onClick={() => setSearchOpen(true)}
          className="px-4 py-3 rounded-full text-center text-sm font-medium border border-white/30 transition-all duration-300 backdrop-blur-sm hover:bg-white/20 hover:scale-105"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: 'rgba(255, 255, 255, 0.8)'
          }}
        >
          <Search size={20} className="text-white" />
        </button>
      ) : (
        <div className="flex items-center bg-gray-900/50 border border-white/30 rounded-full overflow-hidden search-slide-in backdrop-blur-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-[250px] px-4 py-2.5 bg-transparent text-white placeholder-gray-400 border-none outline-none"
            autoFocus
            onBlur={() => {
              if (!searchQuery) {
                setTimeout(() => setSearchOpen(false), 150);
              }
            }}
          />
          <button
            onClick={() => {
              setSearchQuery("");
              setSearchOpen(false);
            }}
            className="px-3 py-2.5 border-none bg-transparent cursor-pointer transition-colors duration-300 hover:bg-white/10"
          >
            <Search size={18} className="text-gray-400" />
          </button>
        </div>
      )}
    </div>
  </div>
</nav>

            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-btn"
              style={{ padding: '0.5rem', border: 'none', background: 'none', color: 'white', cursor: 'pointer', fontSize: '1.5rem' }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>

            {/* User Actions */}
            <div style={{ display: 'none' }} className="desktop-user">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                  onClick={() => navigate("/favorites")}
                  style={{ position: 'relative', padding: '0.5rem', border: 'none', background: 'none', cursor: 'pointer', color: 'white', fontSize: '1.2rem' }}
                >
                  ❤️
                  {favorites.length > 0 && (
                    <span style={{ position: 'absolute', top: '-2px', right: '-2px', backgroundColor: '#ef4444', color: 'white', fontSize: '0.7rem', borderRadius: '9999px', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {favorites.length}
                    </span>
                  )}
                </button>
                
                {user ? (
                  <div style={{ position: 'relative' }}>
                    <div 
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                    >
                      <div style={{ width: '2.5rem', height: '2.5rem', background: 'linear-gradient(to bottom right, #60a5fa, #a78bfa)', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        {(user.username || user.email)[0].toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>{user.username || user.email.split('@')[0]}</div>
                        {/* <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Premium</div> */}
                      </div>
                    </div>
                    
                    {userMenuOpen && (
                      <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', backgroundColor: '#1f2937', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', minWidth: '200px', border: '1px solid #374151' }}>
                        <div style={{ padding: '0.75rem', borderBottom: '1px solid #374151' }}>
                          <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'white' }}>{user.username || user.email}</div>
                          <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{user.email}</div>
                        </div>
                        <button
                          onClick={handleLogout}
                          style={{ width: '100%', textAlign: 'left', padding: '0.75rem 1rem', color: '#f87171', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500' }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#374151'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          Logout
                        </button>
                      </div>
                    )}
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

          {/* Mobile Search Bar */}
          <div className="mobile-search" style={{ marginTop: '0.75rem', position: 'relative' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for movies..."
              style={{ width: '100%', padding: '0.75rem', paddingLeft: '3rem', backgroundColor: '#1f2937', color: 'white', border: '1px solid #374151', borderRadius: '0.5rem', outline: 'none' }}
            />
            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>🔍</span>
            {loading && debouncedQuery && (
              <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)' }}>
                <div style={{ width: '1.25rem', height: '1.25rem', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '9999px', animation: 'spin 1s linear infinite' }}></div>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="mobile-menu" style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setMobileMenuOpen(false);
                    }}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: activeTab === tab ? 'white' : '#1f2937',
                      color: activeTab === tab ? '#111827' : '#d1d5db',
                      fontWeight: activeTab === tab ? '600' : '400'
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: '#1f2937', borderRadius: '0.5rem' }}>
                <button
                  onClick={() => navigate("/favorites")}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', border: 'none', background: 'none', color: 'white', cursor: 'pointer' }}
                >
                  ❤️ <span>Favorites ({favorites.length})</span>
                </button>
                
                {!user && (
                  <button
                    onClick={() => {
                      openAuth('login');
                      setMobileMenuOpen(false);
                    }}
                    style={{ padding: '0.5rem 1rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' }}
                  >
                    Login
                  </button>
                )}
              </div>

              {user && (
                <div style={{ padding: '0.75rem', backgroundColor: '#1f2937', borderRadius: '0.5rem', marginTop: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ width: '2.5rem', height: '2.5rem', background: 'linear-gradient(to bottom right, #60a5fa, #a78bfa)', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {(user.username || user.email)[0].toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>{user.username || user.email.split('@')[0]}</div>
                      {/* <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Premium</div> */}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    style={{ width: '100%', padding: '0.5rem 1rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '2rem 1rem', maxWidth: '1280px', margin: '0 auto' }}>
        {/* Featured Section */}
        {!searchQuery && featuredMovies.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <div className="featured-grid" style={{ display: 'grid', gap: '1.5rem' }}>
              {featuredMovies.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => handleMovieClick(movie.id)}
                  style={{
                    position: 'relative',
                    height: '16rem',
                    borderRadius: '1.5rem',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path || movie.poster_path})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.4), transparent)' }}></div>
                  <div style={{ position: 'absolute', inset: 0, padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1rem', maxWidth: '28rem' }}>{movie.title}</h2>
                  </div>
                  
                  {/* Favorite Button for Featured */}
                  <button
                    onClick={(e) => toggleFavorite(e, movie)}
                    style={{ 
                      position: 'absolute', 
                      top: '0.75rem', 
                      right: '0.75rem', 
                      width: '2.25rem', 
                      height: '2.25rem', 
                      borderRadius: '9999px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: '1.125rem', 
                      transition: 'all 0.3s',
                      zIndex: 10,
                      backdropFilter: 'blur(4px)',
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'rgba(0,0,0,0.5)';
                      e.target.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'rgba(0,0,0,0.3)';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    {isFavorite(movie.id) ? '❤️' : '🤍'}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Genre Filter */}
         {/* Genre Filter */}
      {!searchQuery && (
  <section className="mb-8">
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 w-full">
      {getGenres().map((genre) => {
        const isActive = activeGenre === genre;
        return (
          <button
            key={genre}
            onClick={() => setActiveGenre(genre)}
            className="
              px-4 py-3 rounded-full text-center text-sm font-medium 
              border border-white/30 transition-all duration-300
              backdrop-blur-sm
              hover:bg-white/20 hover:text-white
              disabled:opacity-50
            "
            style={{
              backgroundColor: isActive ? 'rgba(71, 69, 69, 0.25)' : 'rgba(255, 255, 255, 0.1)',
              color: isActive ? 'white' : 'rgba(255, 255, 255, 0.8)',
              transform: isActive ? 'scale(1.05)' : 'scale(1)',
              boxShadow: isActive ? '0 4px 15px rgba(0, 0, 0, 0.2)' : 'none'
            }}
          >
            {genre}
          </button>
        );
      })}
    </div>
  </section>
)}
         
 

        
 

        {/* Results Header */}
        <section style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {searchQuery ? `Search Results for "${debouncedQuery}"` : `Trending in ${activeGenre}`}
            </h2>
            {searchQuery && !loading && (
              <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>{movies.length} movies found</p>
            )}
          </div>
        </section>

        {/* Error */}
        {error && (
          <div style={{ backgroundColor: 'rgba(127, 29, 29, 0.5)', border: '1px solid #991b1b', color: '#fca5a5', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem 0' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '3rem', height: '3rem', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '9999px', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
              <p style={{ color: '#9ca3af' }}>Loading movies...</p>
            </div>
          </div>
        )}

        {/* Movie Grid - Equal poster sizes with favorite buttons */}
        {!loading && movies.length > 0 && (
  <section>
    <div className="flex flex-wrap gap-6 md:gap-8">
      {movies.map((movie) => (
        <div key={movie.id} className="w-[140px] md:w-[180px] flex-shrink-0">
          <MovieCard 
            movie={movie} 
            contentType={activeTab}
          />
        </div>
      ))}
    </div>
  </section>
)}

       
        {/* No Results */}
        {!loading && movies.length === 0 && searchQuery && (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎬</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>No movies found</h3>
            <p style={{ color: '#9ca3af' }}>Try searching with different keywords</p>
          </div>
        )}
      </main>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @keyframes slideIn {
          from {
            width: 0;
            opacity: 0;
          }
          to {
            width: 250px;
            opacity: 1;
          }
        }
        
        .search-slide-in {
          animation: slideIn 0.3s ease-out forwards;
        }
        
        /* Desktop */
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .desktop-user { display: flex !important; }
          .desktop-search { display: none !important; }
          .mobile-menu-btn { display: none !important; }
          .mobile-search { display: none !important; }
          .mobile-menu { display: none !important; }
          .featured-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .movie-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
        
        @media (min-width: 1024px) {
          .movie-grid { grid-template-columns: repeat(5, 1fr) !important; }
        }
        
        @media (min-width: 1280px) {
          .movie-grid { grid-template-columns: repeat(6, 1fr) !important; }
        }
        
        /* Mobile */
        @media (max-width: 767px) {
          .featured-grid { grid-template-columns: 1fr !important; }
          .movie-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        
        /* Small tablets */
        @media (min-width: 640px) and (max-width: 767px) {
          .movie-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}