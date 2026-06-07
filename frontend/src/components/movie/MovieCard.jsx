
import { useMovieContext } from "../../contexts/MovieContext";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

function MovieCard({ movie, contentType = "movie" }) {
  const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();
  const { user, openAuth } = useAuth();
  const favorite = isFavorite(movie.id);

  function onFavoriteClick(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      openAuth('login');
      return;
    }
    
    if (favorite) removeFromFavorites(movie.id);
    else addToFavorites(movie);
  }

  // Determine route based on content type
  const getRoute = () => {
    return contentType === "Series" ? `/tv/${movie.id}` : `/movie/${movie.id}`;
  };

  // Get title (movie.title or TV series name)
  const getTitle = () => {
    return movie.title || movie.name || "Unknown Title";
  };

  // Get year (release_date for movies, first_air_date for TV series)
  const getYear = () => {
    if (movie.release_date) {
      return new Date(movie.release_date).getFullYear();
    } else if (movie.first_air_date) {
      return new Date(movie.first_air_date).getFullYear();
    }
    return "N/A";
  };

  return (
    <Link
      to={getRoute()}
      className="block w-full"
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className="w-full">
        {/* Poster Container with Fixed Aspect Ratio */}
        <div
          className="relative w-full rounded-xl overflow-hidden mb-3 bg-gray-700"
          style={{ paddingBottom: "150%" }}
        >
          {/* Poster Image */}
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={getTitle()}
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}

          {/* Favorite Button Overlay */}
          <button
            type="button"
            onClick={onFavoriteClick}
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
            className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-base transition-all z-10 hover:scale-110"
            style={{
              background: "rgba(0, 0, 0, 0.25)",
              border: "none",
              outline: "none",
              appearance: "none",
            }}
          >
            {favorite ? "❤️" : "🤍"}
          </button>
        </div>

        {/* Content Info */}
        <div className="pt-1">
          <h3 className="font-semibold text-sm mb-1 overflow-hidden text-ellipsis whitespace-nowrap text-white">
            {getTitle()}
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
            </span>
            <span>•</span>
            <span>{getYear()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default MovieCard;


