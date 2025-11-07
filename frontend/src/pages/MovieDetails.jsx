import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const API_URL = import.meta.env.VITE_TMDB_API_URL;

  useEffect(() => {
    console.log("Fetching movie ID:", id);
    console.log("API URL:", API_URL);
    console.log("API KEY:", API_KEY);

    // Fetch movie details
    fetch(`${API_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`)
      .then((res) => res.json())
      .then((data) => setMovie(data));

    // Fetch reviews
    fetch(`${API_URL}/movie/${id}/reviews?api_key=${API_KEY}&language=en-US`)
      .then((res) => res.json())
      .then((data) => setReviews(data.results || []));
  }, [id]);

  if (!movie) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="p-10 text-white bg-black min-h-screen">
      <div className="flex flex-col md:flex-row gap-8">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-64 rounded-lg shadow-lg"
        />
        <div>
          <h1 className="text-3xl font-bold mb-3">{movie.title}</h1>
          <p className="text-gray-400 mb-3">{movie.overview}</p>
          <p>
            <strong>Rating:</strong> {movie.vote_average.toFixed(1)} / 10
          </p>
          <p>
            <strong>Release Date:</strong> {movie.release_date}
          </p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="bg-gray-800 p-4 rounded-lg">
                <p className="text-gray-300 mb-2">{r.content}</p>
                <p className="text-sm text-gray-500">— {r.author}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}
