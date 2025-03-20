import React, { useEffect, useState, useContext } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import Post from '../components/Post';
import { LanguageContext } from '../../context/LanguageContext';

export default function DumyScreen() {
  const [posts, setPosts] = useState([]);
  const { language } = useContext(LanguageContext);
  const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let collectionName = 'posts';
        if (language === 'english') collectionName = 'postsEN';
        if (language === 'french') collectionName = 'postsFR';

        const querySnapshot = await getDocs(collection(db, collectionName));
        const postsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPosts(postsData);
      } catch (err) {
        setError('Проблема з загрузкою постів');
        console.error('Error fetching posts:', err);
      }
    };

    fetchPosts();
  }, [language]);

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedPosts}
        keyExtractor={(item) => item.id}
        numColumns={1} //later u can change to have 2 in a row or for web or duno why
        renderItem={({ item }) => <Post post={item} />}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#a0a099',
  },
  listContainer: {
    paddingHorizontal: 8,
  },
});