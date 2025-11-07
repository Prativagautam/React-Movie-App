// using normal fetch
// const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
// const BASE_URL= import.meta.env.VITE_TMDB_API_URL;



// export const getPopularMovies = async () => {
//   const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
//   const data = await response.json();
//   return data.results;
// };

// export const searchMovies = async (query) => {
//   const response = await fetch(
//     `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
//   );
//   const data = await response.json();
//   return data.results;
// };

// using axios 
// axios.create() centralizes base URL and shared settings.

// Each function (getPopularMovies, searchMovies) makes a single GET request.

// Axios automatically handles JSON parsing and error throwing.

// You return only what components need (data.results).

import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_TMDB_API_URL,
  params: { api_key: import.meta.env.VITE_TMDB_API_KEY },
})
// params is an object that adds query parameters to every request this instance makes
// don’t have to manually attach api_key each time, like in fetch
export const getPopularMovies = async () => {
  const res = await api.get('/movie/popular')
  return res.data.results
}

export const searchMovies = async (query) => {
  const res = await api.get('/search/movie', { params: { query } })
  return res.data.results
}
