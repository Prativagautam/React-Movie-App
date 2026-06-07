
export default function GenreFilter({genres,activeGenre,onGenreChange}){
return (
    <section className="mb-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 w-full">
        {genres.map((genre) => {
          const isActive = activeGenre === genre;
          return (
            <button
              key={genre}
              onClick={() => onGenreChange(genre)}
              className="
                px-4 py-3 rounded-full text-center text-sm font-medium
                border border-white/30 transition-all duration-300
                backdrop-blur-sm
                hover:bg-white/20 hover:text-white
                disabled:opacity-50
              "
              style={{
                backgroundColor: isActive
                  ? "rgba(71, 69, 69, 0.25)"
                  : "rgba(255, 255, 255, 0.1)",
                color: isActive ? "white" : "rgba(255, 255, 255, 0.8)",
                transform: isActive ? "scale(1.05)" : "scale(1)",
                boxShadow: isActive
                  ? "0 4px 15px rgba(0, 0, 0, 0.2)"
                  : "none",
              }}
            >
              {genre}
            </button>
          );
        })}
      </div>
    </section>
  );
}
