import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FavoritesContext } from '../context/FavoritesContext';
import { Link } from 'expo-router';
import { LanguageContext } from '../context/LanguageContext';

export default function Favorites() {
  const { favorites, removeFavoriteByIndex } = useContext(FavoritesContext);
  const { language } = useContext(LanguageContext);

  const handleRemoveFavorite = (index, event) => {
    event.stopPropagation(); // Prevent link navigation
    removeFavoriteByIndex(index);
  };

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <Text style={styles.noFavoritesText}>
          {language === "ukrainian"
            ? "Немає збережених постів"
            : language === "english"
            ? "No favorites yet"
            : "Pas encore de favoris"}
        </Text>
      ) : (
        <FlatList
          data={favorites}
          numColumns={1}
          keyExtractor={(item, index) => `${item?.id}_${index}`}
          renderItem={({ item, index }) => {
            if (!item || !item.id || !item.title) {
              return null;
            }

            return (
              <View style={styles.postContainer}>
                <Link href={`/post/${item.id}`} asChild>
                  <TouchableOpacity style={styles.postItem}>
                    <Image
                      source={item.image ? { uri: item.image } : require('../assets/fallback_image.png')}
                      style={styles.image}
                      onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
                    />
                    <Text style={styles.postTitle}>{item.title}</Text>
                  </TouchableOpacity>
                </Link>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={(e) => handleRemoveFavorite(index, e)}
                >
                  <Text style={styles.deleteButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFB908',
  },
  noFavoritesText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
  postContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  postItem: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 8,
    borderRadius: 4,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 20,
  },
});