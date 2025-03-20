import React, { createContext, useState } from 'react';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const addFavorite = (post) => {
    setFavorites((prev) => [...prev, post]);
  };

  const removeFavorite = (postId) => {
    setFavorites((prev) => prev.filter((p) => p.id !== postId));
  };

  const isFavorite = (postId) => {
    return favorites.some((p) => p.id === postId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};