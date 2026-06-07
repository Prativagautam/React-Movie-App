function MovieDetailsHero({ movie, averageLocalRating, reviewCount, favorite, onFavoriteClick }) {
  const title = movie.title || movie.name || "Untitled";
  const releaseDate = movie.release_date || movie.first_air_date || "N/A";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", marginBottom: "3rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }} className="movie-details-grid">
        <div style={{ position: "relative", width: "100%", maxWidth: "300px" }}>
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={title}
            style={{ width: "100%", borderRadius: "1rem", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)", display: "block" }}
          />
          <button
            type="button"
            onClick={onFavoriteClick}
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
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
              transition: "all 0.2s",
              zIndex: 10,
              background: "rgba(0, 0, 0, 0.25)",
              border: "none",
              outline: "none",
              appearance: "none",
              cursor: "pointer",
            }}
          >
            {favorite ? "❤️" : "🤍"}
          </button>
        </div>
        <div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "1rem" }}>{title}</h1>
          <p style={{ color: "#d1d5db", marginBottom: "1.5rem", lineHeight: "1.75" }}>{movie.overview}</p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", marginBottom: "1.5rem" }}>
            <div>
              <div style={{ fontSize: "0.875rem", color: "#9ca3af", marginBottom: "0.25rem" }}>TMDB Rating</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#fbbf24" }}>
                ⭐ {rating} <span style={{ fontSize: "1rem", color: "#9ca3af" }}>/ 10</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.875rem", color: "#9ca3af", marginBottom: "0.25rem" }}>Local Average</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#fbbf24" }}>
                {averageLocalRating > 0 ? `⭐ ${averageLocalRating}` : "-"}
                <span style={{ fontSize: "0.875rem", color: "#9ca3af", fontWeight: "normal" }}> ({reviewCount} reviews)</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.875rem", color: "#9ca3af", marginBottom: "0.25rem" }}>Release Date</div>
              <div style={{ fontSize: "1.125rem", fontWeight: "600" }}>{releaseDate}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetailsHero;
