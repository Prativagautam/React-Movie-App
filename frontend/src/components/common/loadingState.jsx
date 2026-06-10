function LoadingState({ message = "Loading movies..." }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "5rem 0" }}>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: "3rem",
            height: "3rem",
            border: "2px solid white",
            borderTopColor: "transparent",
            borderRadius: "9999px",
            animation: "spin 1s linear infinite",
            margin: "0 auto 1rem",
          }}
        />
        <p style={{ color: "#9ca3af" }}>{message}</p>
      </div>
    </div>
  );
}

export default LoadingState;