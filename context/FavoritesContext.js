import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // Load favorites from AsyncStorage when the component mounts
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Failed to load favorites:', error);
      }
    };

    loadFavorites();
  }, []);

  // Save favorites to AsyncStorage whenever they change
  useEffect(() => {
    const saveFavorites = async () => {
      try {
        await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
      } catch (error) {
        console.error('Failed to save favorites:', error);
      }
    };

    saveFavorites();
  }, [favorites]);

  const addFavorite = (post) => {
    setFavorites((prev) => [...prev, post]);
  };

  const removeFavorite = (postId) => {
    setFavorites((prev) => prev.filter((p) => p.id !== postId));
  };

  const isFavorite = (postId) => {
    return favorites.some((p) => p.id === postId);
  };

  // New function to remove favorite by index (for UI purposes)
  const removeFavoriteByIndex = (index) => {
    setFavorites((prev) => {
      const newFavorites = [...prev];
      newFavorites.splice(index, 1);
      return newFavorites;
    });
  };

  return (
    <FavoritesContext.Provider 
      value={{ 
        favorites, 
        addFavorite, 
        removeFavorite, 
        removeFavoriteByIndex,
        isFavorite 
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};