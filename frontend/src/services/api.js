

import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_TMDB_API_URL,
  params: { api_key: import.meta.env.VITE_TMDB_API_KEY },
})

// Get popular movies
export const getPopularMovies = async () => {
  const res = await api.get('/movie/popular')
  return res.data.results
}

// Search movies by query
export const searchMovies = async (query) => {
  const res = await api.get('/search/movie', { params: { query } })
  return res.data.results
}

// Get movie details by id
export const getMovieDetails = async (id) => {
  const res = await api.get(`/movie/${id}`, {
    params: { language: 'en-US' },
  })
  return res.data
}

// Get TMDB reviews for a movie
export const getMovieReviews = async (id) => {
  const res = await api.get(`/movie/${id}/reviews`, {
    params: { language: 'en-US' },
  })
  return res.data.results || []
}

// Get movies by genre
export const getMoviesByGenre = async (genreId) => {
  const res = await api.get('/discover/movie', { 
    params: { 
      with_genres: genreId,
      sort_by: 'popularity.desc'
    } 
  })
  return res.data.results
}

// TV SERIES FUNCTIONS - ADD THESE:

// Get popular TV series
export const getPopularTVSeries = async () => {
  const res = await api.get('/tv/popular')
  return res.data.results
}

// Search TV series by query
export const searchTVSeries = async (query) => {
  const res = await api.get('/search/tv', { params: { query } })
  return res.data.results
}

// Get TV series by genre
export const getTVSeriesByGenre = async (genreId) => {
  const res = await api.get('/discover/tv', { 
    params: { 
      with_genres: genreId,
      sort_by: 'popularity.desc'
    } 
  })
  return res.data.results
}
// Get TV series details
export const getTVDetails = async (id) => {
  const res = await api.get(`/tv/${id}`)
  return res.data
}

// Get TV series credits
export const getTVCredits = async (id) => {
  const res = await api.get(`/tv/${id}/credits`)
  return res.data
}
