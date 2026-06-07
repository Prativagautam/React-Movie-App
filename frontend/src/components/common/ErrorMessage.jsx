function ErrorMessage({ message }) {
  if (!message) {
    return null;
  }

  return (
    <div
      style={{
        backgroundColor: "rgba(127, 29, 29, 0.5)",
        border: "1px solid #991b1b",
        color: "#fca5a5",
        padding: "1rem",
        borderRadius: "0.5rem",
        marginBottom: "1.5rem",
      }}
    >
      {message}
    </div>
  );
}

export default ErrorMessage;