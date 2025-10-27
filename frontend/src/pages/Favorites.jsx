 import "../css/Favorites.css"
// function Favorite(){
//     return <div className="favorites-empty">
//         <h2>No Favorite Movies yet</h2>
//         <p>Start adding movies to your favorites and they will appear here</p>
//     </div>
// }
// export default Favorite

import { useMovieContext } from "../contexts/MovieContext";
import MovieCard from "../components/MovieCard";

export default function Favorites() {
  const { favorites } = useMovieContext();

  return (
    <div className="favorites-page">
      <h2>My Favorites</h2>
      <div className="movie-grid">
        {favorites.length > 0 ? (
          favorites.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))
        ) : (
          <p>No favorites added yet.</p>
        )}
      </div>
    </div>
  );
}
