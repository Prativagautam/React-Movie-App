
import { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";

export const MovieContext = createContext();

export const useMovieContext = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error("useMovieContext must be used within a MovieProvider");
  }
  return context;
};

export const MovieProvider = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);

  // Load favorites when user changes (login/logout)
  useEffect(() => {
    if (user) {
      const userFavKey = `favorites_${user.email}`;
      const storedFavs = localStorage.getItem(userFavKey);
      if (storedFavs) {
        setFavorites(JSON.parse(storedFavs));
      } else {
        setFavorites([]);
      }
    } else {
      // User logged out, clear favorites
      setFavorites([]);
    }
  }, [user]);

  // Save favorites whenever they change
  useEffect(() => {
    if (user) {
      const userFavKey = `favorites_${user.email}`;
      localStorage.setItem(userFavKey, JSON.stringify(favorites));
    }
  }, [favorites, user]);

  const addToFavorites = (movie) => {
    setFavorites((prev) => [...prev, movie]);
  };

  const removeFromFavorites = (movieId) => {
    setFavorites((prev) => prev.filter((movie) => movie.id !== movieId));
  };

  const isFavorite = (movieId) => {
    return favorites.some((movie) => movie.id === movieId);
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  };

  return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  );
};