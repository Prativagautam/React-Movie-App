import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useMovieContext } from "../contexts/MovieContext";
import AuthModal from "../components/auth/Authmodal";
import { EmptyState } from "../components/common/EmptyState";
import { useState } from "react";
import { SlidingSearch } from "../components/common/SlidingSearch";
import { FavoritesGrid } from "../components/favorites/FavoritesGrid";

export default function Favorites() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { user, openAuth, logout } = useAuth();
  const { favorites, removeFromFavorites } = useMovieContext();

  const handleMovieClick = (item) => {
    const isSeries = item.media_type === "tv" || item.first_air_date || item.name;
    navigate(isSeries ? `/tv/${item.id}` : `/movie/${item.id}`);
  };

  const handleRemoveFavorite = (e, movieId) => {
    e.stopPropagation();
    removeFromFavorites(movieId);
  };
  const filteredFavorites = favorites.filter((movie) => {
    const title = movie.title || movie.name || "";
    return title.toLowerCase().includes(searchQuery.trim().toLowerCase());
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom right, #1f2937, #374151, #4b5563)",
        color: "white",
      }}
    >
      {/* Auth Modal */}
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
              onClick={() => navigate("/")}
            >
              <span style={{ color: "white" }}>Movie</span>
              <span style={{ color: "#3b82f6" }}>.id</span>
            </div>

            {/* Navigation */}
            <nav
              style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}
            >
              <button
                onClick={() => navigate("/")}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "transparent",
                  border: "none",
                  color: "#d1d5db",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: "500",
                }}
              >
                Home
              </button>
              <button
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "white",
                  color: "#111827",
                  border: "none",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: "600",
                }}
              >
                Favorites
              </button>
            </nav>

            {/* User Section */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              {user ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
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
                  <button
                    onClick={logout}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "0.5rem",
                      cursor: "pointer",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                    }}
                  >
                    Logout
                  </button>
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
      </header>

      {/* Main Content */}
      <main
        style={{
          padding: "2rem 1rem",
          maxWidth: "1280px",
          margin: "0 auto",
          minHeight: "calc(100vh - 80px)",
        }}
      >
        {/* Header Section */}
        <div style={{ marginBottom: "2rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  marginBottom: "0.5rem",
                }}
              >
                My Favorites ❤️
              </h1>
              {/* <p style={{ color: "#9ca3af", fontSize: "1rem" }}>
                {filteredFavorites.length} of {favorites.length} movies in your
                collection
              </p> */}
            </div>

            <SlidingSearch
              value={searchQuery}
              onChange={setSearchQuery}
              isOpen={searchOpen}
              onOpen={() => setSearchOpen(true)}
              onClose={() => setSearchOpen(false)}
              placeholder="Search favorites..."
            />
          </div>
          <p style={{ color: "#9ca3af", fontSize: "1rem" }}>
            {favorites.length} {favorites.length === 1 ? "movie" : "movies"} in
            your collection
          </p>
        </div>
        {filteredFavorites.length > 0 ? (
          <FavoritesGrid
            favorites={filteredFavorites}
            onMovieClick={handleMovieClick}
            onRemoveFavorite={handleRemoveFavorite}
          />
        ) : (
          <EmptyState
            icon={searchQuery ? "🎬" : "💔"}
            title={searchQuery ? "No matching favorites" : "No favorites yet"}
            description={
              searchQuery
                ? "Try searching with a different title"
                : "Start adding movies to your favorites and they will appear here"
            }
            actionLabel={searchQuery ? undefined : "Browse Movies"}
            onAction={searchQuery ? undefined : () => navigate("/")}
          />
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
