import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useMovieContext } from "../contexts/MovieContext";
import AuthModal from "../components/auth/Authmodal";

import {
  searchMovies,
  getPopularMovies,
  getMoviesByGenre,
  getPopularTVSeries,
  searchTVSeries,
  getTVSeriesByGenre,
} from "../services/api";
import GenreFilter from "../components/movie/GenreFilter";
import { FeaturedContent } from "../components/movie/FeaturedContent";
import LoadingState from "../components/common/loadingState";
import ErrorMessage from "../components/common/ErrorMessage";
import { ContentGrid } from "../components/movie/ContentGrid";
import { EmptyState } from "../components/common/EmptyState";
import { SlidingSearch } from "../components/common/SlidingSearch";
const CONTENT_TABS = ["Movie", "Series", "Originals"];
const MOVIE_GENRES = {
  Trending: null,
  Action: 28,
  Romance: 10749,
  Animation: 16,
  Horror: 27,
  Special: 878,
  Drama: 18,
};

const TV_GENRES = {
  Trending: null,
  Drama: 18,
  "Action & Adventure": 10759,
  Comedy: 35,
  Animation: 16,
  "Sci-Fi & Fantasy": 10765,
  Documentary: 99,
};

const getGenresForTab = (activeTab) =>
  activeTab === "Series" ? Object.keys(TV_GENRES) : Object.keys(MOVIE_GENRES);

const getGenreMapForTab = (activeTab) =>
  activeTab === "Series" ? TV_GENRES : MOVIE_GENRES;

const getPopularContent = (activeTab) =>
  activeTab === "Series" ? getPopularTVSeries() : getPopularMovies();

const searchContent = (activeTab, query) =>
  activeTab === "Series" ? searchTVSeries(query) : searchMovies(query);

const getContentByGenre = (activeTab, genreId) =>
  activeTab === "Series"
    ? getTVSeriesByGenre(genreId)
    : getMoviesByGenre(genreId);

export default function Home() {
  const navigate = useNavigate();
  const { user, openAuth, logout } = useAuth();
  const { favorites, isFavorite, addToFavorites, removeFromFavorites } =
    useMovieContext();

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Content states
  const [contentItems, setContentItems] = useState([]);
  const [featuredContent, setFeaturedContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI states
  const [activeTab, setActiveTab] = useState("Movie");
  const [activeGenre, setActiveGenre] = useState("Trending");
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const genres = getGenresForTab(activeTab);

  useEffect(() => {
    if (!getGenresForTab(activeTab).includes(activeGenre)) {
      setActiveGenre("Trending");
    }
  }, [activeGenre, activeTab]);

  // Debouncing effect for search - waits 500ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    let ignoreResponse = false;

    const loadContent = async () => {
      setLoading(true);
      setError(null);
      setContentItems([]);
      setFeaturedContent([]);

      try {
        const trimmedQuery = debouncedQuery.trim();
        let content;

        if (trimmedQuery) {
          content = await searchContent(activeTab, trimmedQuery);
          if (ignoreResponse) return;
          setFeaturedContent([]);
        } else {
          const genreMap = getGenreMapForTab(activeTab);
          const genreId = genreMap[activeGenre] ?? null;

          if (genreId === null) {
            content = await getPopularContent(activeTab);
          } else {
            content = await getContentByGenre(activeTab, genreId);
          }

          if (ignoreResponse) return;
          setFeaturedContent(content.slice(0, 2));
        }

        if (ignoreResponse) return;
        setContentItems(content);
        setError(null);
      } catch (err) {
        if (ignoreResponse) return;
        console.error(err);
        setError("Failed to load content...");
      } finally {
        if (!ignoreResponse) {
          setLoading(false);
        }
      }
    };

    loadContent();

    return () => {
      ignoreResponse = true;
    };
  }, [activeGenre, debouncedQuery, activeTab]);

  const handleContentClick = (item) => {
    const isSeries = activeTab === "Series" || item.media_type === "tv";
    navigate(isSeries ? `/tv/${item.id}` : `/movie/${item.id}`);
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  const toggleFavorite = (e, movie) => {
    e.stopPropagation();
    if (!user) {
      openAuth("login");
      return;
    }
    if (isFavorite(movie.id)) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites({
        ...movie,
        media_type: activeTab === "Series" ? "tv" : "movie",
      });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom right, #1f2937, #374151, #4b5563)",
        color: "white",
        paddingBottom: "3rem",
      }}
    >
      <AuthModal />

      {/* Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backgroundColor: "rgba(17, 24, 39, 0.8)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #374151",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "1rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Logo */}
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                cursor: "pointer",
              }}
              onClick={() => {
                navigate("/");
                setSearchQuery("");
              }}
            >
              <span style={{ color: "white" }}>Movie</span>
              <span style={{ color: "#3b82f6" }}>.id</span>
            </div>
            {/* Desktop Navigation */}
            <nav className="hidden desktop-nav">
              <div className="flex items-center gap-2">
                {CONTENT_TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="px-6 py-3 rounded-full text-center text-sm font-medium border border-white/30 transition-all duration-300 backdrop-blur-sm hover:bg-white/20 hover:text-white"
                    style={{
                      backgroundColor:
                        activeTab === tab
                          ? "rgba(184, 168, 168, 0.25)"
                          : "rgba(59, 59, 79, 0.19)",
                      color:
                        activeTab === tab
                          ? "white"
                          : "rgba(255, 255, 255, 0.8)",
                      transform: activeTab === tab ? "scale(1.05)" : "scale(1)",
                      boxShadow:
                        activeTab === tab
                          ? "0 4px 15px rgba(0, 0, 0, 0.2)"
                          : "none",
                    }}
                  >
                    {tab}
                  </button>
                ))}

                {/* Sliding Search */}
                <SlidingSearch
                  value={searchQuery}
                  onChange={setSearchQuery}
                  isOpen={searchOpen}
                  onOpen={() => setSearchOpen(true)}
                  onClose={() => setSearchOpen(false)}
                  placeholder="Search..."
                />
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-btn"
              style={{
                padding: "0.5rem",
                border: "none",
                background: "none",
                color: "white",
                cursor: "pointer",
                fontSize: "1.5rem",
              }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>

            {/* User Actions */}
            <div style={{ display: "none" }} className="desktop-user">
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <button
                  onClick={() => navigate("/favorites")}
                  style={{
                    position: "relative",
                    padding: "0.5rem",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    color: "white",
                    fontSize: "1.2rem",
                  }}
                >
                  ❤️
                  {favorites.length > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: "-2px",
                        right: "-2px",
                        backgroundColor: "#ef4444",
                        color: "white",
                        fontSize: "0.7rem",
                        borderRadius: "9999px",
                        width: "20px",
                        height: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {favorites.length}
                    </span>
                  )}
                </button>

                {user ? (
                  <div style={{ position: "relative" }}>
                    <div
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          width: "2.5rem",
                          height: "2.5rem",
                          background:
                            "linear-gradient(to bottom right, #60a5fa, #a78bfa)",
                          borderRadius: "9999px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                        }}
                      >
                        {(user.username || user.email)[0].toUpperCase()}
                      </div>
                      <div>
                        <div
                          style={{ fontSize: "0.875rem", fontWeight: "600" }}
                        >
                          {user.username || user.email.split("@")[0]}
                        </div>
                        {/* <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Premium</div> */}
                      </div>
                    </div>

                    {userMenuOpen && (
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          right: 0,
                          marginTop: "0.5rem",
                          backgroundColor: "#1f2937",
                          borderRadius: "0.5rem",
                          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                          minWidth: "200px",
                          border: "1px solid #374151",
                        }}
                      >
                        <div
                          style={{
                            padding: "0.75rem",
                            borderBottom: "1px solid #374151",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "0.875rem",
                              fontWeight: "600",
                              color: "white",
                            }}
                          >
                            {user.username || user.email}
                          </div>
                          <div
                            style={{ fontSize: "0.75rem", color: "#9ca3af" }}
                          >
                            {user.email}
                          </div>
                        </div>
                        <button
                          onClick={handleLogout}
                          style={{
                            width: "100%",
                            textAlign: "left",
                            padding: "0.75rem 1rem",
                            color: "#f87171",
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                            fontSize: "0.875rem",
                            fontWeight: "500",
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.backgroundColor = "#374151")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.backgroundColor = "transparent")
                          }
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => openAuth("login")}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#2563eb",
                      color: "white",
                      border: "none",
                      borderRadius: "0.5rem",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div
            className="mobile-search"
            style={{ marginTop: "0.75rem", position: "relative" }}
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for movies..."
              style={{
                width: "100%",
                padding: "0.75rem",
                paddingLeft: "3rem",
                backgroundColor: "#1f2937",
                color: "white",
                border: "1px solid #374151",
                borderRadius: "0.5rem",
                outline: "none",
              }}
            />
            <span
              style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9ca3af",
              }}
            >
              🔍
            </span>
            {loading && debouncedQuery && (
              <div
                style={{
                  position: "absolute",
                  right: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <div
                  style={{
                    width: "1.25rem",
                    height: "1.25rem",
                    border: "2px solid white",
                    borderTopColor: "transparent",
                    borderRadius: "9999px",
                    animation: "spin 1s linear infinite",
                  }}
                ></div>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="mobile-menu" style={{ marginTop: "1rem" }}>
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                }}
              >
                {CONTENT_TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setMobileMenuOpen(false);
                    }}
                    style={{
                      flex: 1,
                      padding: "0.5rem",
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                      border: "none",
                      cursor: "pointer",
                      backgroundColor: activeTab === tab ? "white" : "#1f2937",
                      color: activeTab === tab ? "#111827" : "#d1d5db",
                      fontWeight: activeTab === tab ? "600" : "400",
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.75rem",
                  backgroundColor: "#1f2937",
                  borderRadius: "0.5rem",
                }}
              >
                <button
                  onClick={() => navigate("/favorites")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.875rem",
                    border: "none",
                    background: "none",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  ❤️ <span>Favorites ({favorites.length})</span>
                </button>

                {!user && (
                  <button
                    onClick={() => {
                      openAuth("login");
                      setMobileMenuOpen(false);
                    }}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#2563eb",
                      color: "white",
                      border: "none",
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Login
                  </button>
                )}
              </div>

              {user && (
                <div
                  style={{
                    padding: "0.75rem",
                    backgroundColor: "#1f2937",
                    borderRadius: "0.5rem",
                    marginTop: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        background:
                          "linear-gradient(to bottom right, #60a5fa, #a78bfa)",
                        borderRadius: "9999px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {(user.username || user.email)[0].toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: "0.875rem", fontWeight: "600" }}>
                        {user.username || user.email.split("@")[0]}
                      </div>
                      {/* <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Premium</div> */}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    style={{
                      width: "100%",
                      padding: "0.5rem 1rem",
                      backgroundColor: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
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
      <main
        style={{ padding: "2rem 1rem", maxWidth: "1280px", margin: "0 auto" }}
      >
        {/* Featured Section */}
        {!searchQuery && (
          <FeaturedContent
            featuredContent={featuredContent}
            onContentClick={handleContentClick}
            onToggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
          />
        )}
        {/* Genre Filter */}
        {!searchQuery && (
          <GenreFilter
            genres={genres}
            activeGenre={activeGenre}
            onGenreChange={setActiveGenre}
          />
        )}

        {/* Results Header */}
        <section style={{ marginBottom: "1.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              {searchQuery
                ? `Search Results for "${debouncedQuery}"`
                : `Trending in ${activeGenre}`}
            </h2>
            {searchQuery && !loading && (
              <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>
                {contentItems.length}{" "}
                {activeTab === "Series" ? "series" : "movies"} found
              </p>
            )}
          </div>
        </section>

        {/* Error */}
        <ErrorMessage message={error} />

        {/* Loading */}
        {loading && <LoadingState />}

        {/* Movie Grid - Equal poster sizes with favorite buttons */}
        {!loading && contentItems.length > 0 && (
          <ContentGrid contentItems={contentItems} activeTab={activeTab} />
        )}

        {/* No Results */}
        {!loading && contentItems.length === 0 && debouncedQuery && (
          <EmptyState
            icon="🎬"
            iconSize="4rem"
            title="No movies found"
            description="Try searching with different keywords"
          />
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
