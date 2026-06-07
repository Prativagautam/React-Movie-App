function TmdbReviews({ reviews }) {
  return (
    <section style={{ marginBottom: "3rem" }}>
      <h2 style={{ fontSize: "1.875rem", fontWeight: "bold", marginBottom: "1.5rem" }}>Global Reviews (from TMDB)</h2>

      {reviews.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {reviews.map((review) => (
            <div key={review.id} style={{ backgroundColor: "#1f2937", padding: "1.5rem", borderRadius: "1rem", border: "1px solid #374151" }}>
              <div style={{ display: "flex", gap: "1rem" }}>
                <div style={{ width: "3rem", height: "3rem", borderRadius: "9999px", backgroundColor: "#374151", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold", fontSize: "1.25rem", flexShrink: 0 }}>
                  {review.author?.[0]?.toUpperCase() || "G"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                    <div>
                      <div style={{ fontWeight: "600", fontSize: "1.125rem" }}>{review.author}</div>
                      <div style={{ fontSize: "0.875rem", color: "#9ca3af" }}>{new Date(review.created_at).toLocaleString()}</div>
                    </div>
                  </div>
                  <p style={{ color: "#d1d5db", lineHeight: "1.75" }}>{review.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: "#9ca3af" }}>No global reviews available.</p>
      )}
    </section>
  );
}

export default TmdbReviews;
