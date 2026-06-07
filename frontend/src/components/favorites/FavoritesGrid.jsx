export function FavoritesGrid({ favorites, onMovieClick, onRemoveFavorite }) {
  return (
    <div className="movie-grid" style={{ display: "grid", gap: "1rem" }}>
      {favorites.map((movie) => (
        <div
          key={movie.id}
          style={{ cursor: "pointer", position: "relative" }}
          onClick={() => onMovieClick(movie.id)}
        >
          <div
            style={{
              position: "relative",
              aspectRatio: "2/3",
              width: "100%",
              borderRadius: "1rem",
              overflow: "hidden",
              marginBottom: "0.75rem",
              backgroundColor: "#374151",
            }}
          >
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#6b7280",
                }}
              >
                No Image
              </div>
            )}

            <button
              type="button"
              onClick={(e) => onRemoveFavorite(e, movie.id)}
              style={{
                position: "absolute",
                top: "0.5rem",
                right: "0.5rem",
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "9999px",
                padding: "0.5rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "2rem",
                height: "2rem",
                fontSize: "1rem",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            >
              ✕
            </button>

            <div
              className="movie-overlay"
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                opacity: 0,
                transition: "opacity 0.3s",
                display: "flex",
                alignItems: "flex-end",
                padding: "1rem",
              }}
            >
              <button
                style={{
                  width: "100%",
                  backgroundColor: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(12px)",
                  border: "none",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  color: "white",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                ▶️ <span>Watch Now</span>
              </button>
            </div>
          </div>

          <h3
            style={{
              fontWeight: "600",
              fontSize: "0.875rem",
              marginBottom: "0.25rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {movie.title || movie.name}
          </h3>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.75rem",
              color: "#9ca3af",
            }}
          >
            <span>
              ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
            </span>
            <span>•</span>
            <span>
              {movie.release_date || movie.first_air_date
                ? new Date(
                    movie.release_date || movie.first_air_date,
                  ).getFullYear()
                : "N/A"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}


