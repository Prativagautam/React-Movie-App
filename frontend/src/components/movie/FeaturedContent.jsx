export function FeaturedContent({
  featuredContent,
  onContentClick,
  onToggleFavorite,
  isFavorite,
}) {
  if (featuredContent.length === 0) {
    return null;
  }

  return (
    <section style={{ marginBottom: "3rem" }}>
      <div className="featured-grid" style={{ display: "grid", gap: "1.5rem" }}>
        {featuredContent.map((movie) => (
          <div
            key={movie.id}
            onClick={() => onContentClick(movie)}
            style={{
              position: "relative",
              height: "16rem",
              borderRadius: "1.5rem",
              overflow: "hidden",
              cursor: "pointer",
              backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path || movie.poster_path})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.4), transparent)",
              }}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
              }}
            >
              <h2
                style={{
                  fontSize: "1.875rem",
                  fontWeight: "bold",
                  marginBottom: "1rem",
                  maxWidth: "28rem",
                }}
              >
                {movie.title || movie.name}
              </h2>
            </div>

            <button
              onClick={(e) => onToggleFavorite(e, movie)}
              style={{
                position: "absolute",
                top: "0.75rem",
                right: "0.75rem",
                width: "2.25rem",
                height: "2.25rem",
                borderRadius: "9999px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.125rem",
                transition: "all 0.3s",
                zIndex: 10,
                backdropFilter: "blur(4px)",
                backgroundColor: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.2)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "rgba(0,0,0,0.5)";
                e.target.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "rgba(0,0,0,0.3)";
                e.target.style.transform = "scale(1)";
              }}
            >
              {isFavorite(movie.id) ? "❤️" : "🤍"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

