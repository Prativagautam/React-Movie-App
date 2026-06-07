function MovieDetailsHero({ movie, averageLocalRating, reviewCount }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", marginBottom: "3rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }} className="movie-details-grid">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          style={{ width: "100%", maxWidth: "300px", borderRadius: "1rem", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)" }}
        />
        <div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "1rem" }}>{movie.title}</h1>
          <p style={{ color: "#d1d5db", marginBottom: "1.5rem", lineHeight: "1.75" }}>{movie.overview}</p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", marginBottom: "1.5rem" }}>
            <div>
              <div style={{ fontSize: "0.875rem", color: "#9ca3af", marginBottom: "0.25rem" }}>TMDB Rating</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#fbbf24" }}>
                ⭐ {movie.vote_average.toFixed(1)} <span style={{ fontSize: "1rem", color: "#9ca3af" }}>/ 10</span>
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
              <div style={{ fontSize: "1.125rem", fontWeight: "600" }}>{movie.release_date}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetailsHero;
