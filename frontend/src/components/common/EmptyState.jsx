export  function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  iconSize = "5rem",
}) {
  return (
    <div style={{ textAlign: "center", padding: "5rem 0" }}>
      {icon && (
        <div style={{ fontSize: iconSize, marginBottom: "1.5rem" }}>{icon}</div>
      )}

      <h2
        style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}
      >
        {title}
      </h2>

      {description && (
        <p
          style={{
            color: "#9ca3af",
            marginBottom: "2rem",
            fontSize: "1.125rem",
          }}
        >
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          style={{
            padding: "0.75rem 2rem",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#2563eb")}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
