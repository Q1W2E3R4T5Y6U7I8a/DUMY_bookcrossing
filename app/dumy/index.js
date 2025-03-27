import React, { useEffect, useState, useContext } from 'react';
import { View, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  Modal, 
  TextInput, 
  TouchableWithoutFeedback, 
  Button, 
  Alert, 
  Image,
  ScrollView  
} from 'react-native';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import Post from '../components/Post';
import { LanguageContext } from '../../context/LanguageContext';
import Checkbox from 'expo-checkbox';

export default function DumyScreen() {
  const [posts, setPosts] = useState([]);
  const [sortedPosts, setSortedPosts] = useState([]);
  const [sortBy, setSortBy] = useState('date');
  const [selectedCategories, setSelectedCategories] = useState([
    'psychology',
    'science',
    'philosophy',
    'productivity',
    'art',
    'uncategorized',
  ]); 
  const [modalVisible, setModalVisible] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    image: '',
    category: 'uncategorized',
  });
  const { language } = useContext(LanguageContext);
  const [showSortingOptions, setShowSortingOptions] = useState(false);

  const getCollectionName = () => {
    switch (language) {
      case 'english': return 'postsEN';
      case 'french': return 'postsFR';
      default: return 'posts';
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let collectionName = 'posts';
        if (language === 'english') collectionName = 'postsEN';
        if (language === 'french') collectionName = 'postsFR';

        const querySnapshot = await getDocs(collection(db, collectionName));
        const postsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPosts(postsData);
        sortAndFilterPosts(postsData, sortBy, selectedCategories);
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    };

    fetchPosts();
  }, [language]);

  useEffect(() => {
    sortAndFilterPosts(posts, sortBy, selectedCategories);
  }, [sortBy, selectedCategories]);

  const sortAndFilterPosts = (posts, sortBy, selectedCategories) => {
    let filteredPosts = posts.filter((post) => {
      const postCategories = post.category ? post.category.split(', ') : [];
      return postCategories.some((cat) => selectedCategories.includes(cat));
    });

    let sorted = [...filteredPosts];
    switch (sortBy) {
      case 'date':
        sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'views':
        sorted.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'likes':
        sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case 'comments':
        sorted.sort((a, b) => (b.comments || 0) - (a.comments || 0));
        break;
      default:
        break;
    }

    setSortedPosts(sorted);
  };

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const addPost = async () => {
    if (!newPost.title || !newPost.description || !newPost.image || !newPost.category) {
      Alert.alert('Помилка', 'Будь ласка, заповніть всі поля');
      return;
    }

    try {
      const collectionName = getCollectionName();
      const formattedDescription = newPost.description
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n/g, '<br>'); 

      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0];

      const docRef = await addDoc(collection(db, collectionName), {
        title: newPost.title,
        description: formattedDescription,
        image: newPost.image,
        category: newPost.category,
        likes: 0,
        comments: 0,
        views: 0,
        date: formattedDate,
        language: language,
      });

      setPosts([...posts, { id: docRef.id, ...newPost, date: formattedDate, language }]);
      setModalVisible(false);
      setNewPost({
        title: '',
        description: '',
        image: '',
        category: 'uncategorized',
      });
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  const categoryTranslations = {
    ukrainian: {
      psychology: 'психологія',
      science: 'наука',
      philosophy: 'філософія',
      productivity: 'продуктивність',
      art: 'мистецтво',
      uncategorized: 'без категорії'
    },
    english: {
      psychology: 'psychology',
      science: 'science',
      philosophy: 'philosophy',
      productivity: 'productivity',
      art: 'art',
      uncategorized: 'uncategorized'
    },
    french: {
      psychology: 'psychologie',
      science: 'science',
      philosophy: 'philosophie',
      productivity: 'productivité',
      art: 'art',
      uncategorized: 'non catégorisé'
    }
  };

  return (
    <View style={styles.container}>
      {/* Settings Icon */}
      <TouchableOpacity
        style={styles.settingsIconContainer}
        onPress={() => setShowSortingOptions(!showSortingOptions)}
      >
        <Image
          source={require('../../assets/settings_icon.png')}
          style={styles.settingsIcon}
        />
      </TouchableOpacity>

      {/* Sorting Options */}
      {showSortingOptions && (
      <View style={styles.sortOptions}>
        <Text style={styles.sortLabel}>
          {language === "ukrainian" ? "Сортувати за:" : language === "english" ? "Sort by:" : "Trier par:"}
        </Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'date' && styles.activeSortButton]}
            onPress={() => setSortBy('date')}
          >
            <Text style={styles.sortButtonText}>
              {language === "ukrainian" ? "Датою" : language === "english" ? "Date" : "Date"}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'views' && styles.activeSortButton]}
            onPress={() => setSortBy('views')}
          >
            <Text style={styles.sortButtonText}>
              {language === "ukrainian" ? "Переглядами" : language === "english" ? "Views" : "Vues"}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'comments' && styles.activeSortButton]}
            onPress={() => setSortBy('comments')}
          >
            <Text style={styles.sortButtonText}>
              {language === "ukrainian" ? "Коментарями" : language === "english" ? "Comments" : "Commentaires"}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'likes' && styles.activeSortButton]}
            onPress={() => setSortBy('likes')}
          >
            <Text style={styles.sortButtonText}>
              {language === "ukrainian" ? "Лайками" : language === "english" ? "Likes" : "J'aime"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    )}

    {showSortingOptions && (
      <>
        <Text style={styles.sortLabel}>
          {language === "ukrainian"
            ? "Категорії:"
            : language === "english"
            ? "Categories:"
            : "Catégories:"}
        </Text>

        <View style={styles.categoryContainer}>
          {['psychology', 'science', 'philosophy', 'productivity', 'art', 'uncategorized'].map((category) => (
            <View key={category} style={styles.categoryItem}>
              <Checkbox
                value={selectedCategories.includes(category)}
                onValueChange={() => toggleCategory(category)}
              />
              <Text style={styles.categoryText}>
                {categoryTranslations[language]?.[category] || category}
              </Text>
            </View>
          ))}
        </View>
      </>
    )}

      {/* Posts List */}
      <FlatList
        data={sortedPosts}
        keyExtractor={(item) => item.id}
        numColumns={1}
        renderItem={({ item }) => 
          <Post 
            post={item} 
            language={language}
          />}
        contentContainerStyle={styles.listContainer}
      />

      {/* Add Post Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      
      <Modal visible={modalVisible} transparent>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <TextInput
                placeholder={language === "ukrainian" ? "Заголовок" : language === "english" ? "Title" : "Titre"}
                style={styles.input}
                value={newPost.title}
                onChangeText={(text) => setNewPost({ ...newPost, title: text })}
              />
              <TextInput
                placeholder={language === "ukrainian" ? "Текст" : language === "english" ? "Техt" : "Texte"}
                multiline
                style={[styles.input, styles.descriptionInput]} // Add a specific style for the description input
                scrollEnabled
                value={newPost.description}
                onChangeText={(text) => setNewPost({ ...newPost, description: text })}
              />
              <TextInput
                placeholder={language === "ukrainian" ? `URL картинки (наприклад з "Postimg" лінк)` : language === "english" ? `Image URL (link from "Postimg" for instance)` : `URL de l'image (par exemple, lien de "Postimg")`}
                style={styles.input}
                value={newPost.image}
                onChangeText={(text) => setNewPost({ ...newPost, image: text })}
              />
              <View horizontal style={styles.categoryModalContainer}>
                {['psychology', 'science', 'philosophy', 'productivity', 'art', 'uncategorized'].map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[styles.categoryModalItem, newPost.category === category && styles.activeCategory]}
                    onPress={() => setNewPost({ ...newPost, category })}
                  >
                    <Text style={styles.categoryModalText}>
                      {categoryTranslations[language]?.[category] || category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Button title={language === "ukrainian" ? "Добавити пост" : language === "english" ? "Add post" : "Ajoute un post"} onPress={addPost} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#a0a099',
  },
  settingsIconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  settingsIcon: {
    width: 15,
    height: 15,
  },
  sortOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sortLabel: {
    marginRight: 8,
    fontSize: 16,
  },
  sortButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: '#cecdc5',
  },
  activeSortButton: {
    backgroundColor: '#1691D9',
  },
  sortButtonText: {
    fontSize: 14,
  },
  categoryContainer: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    marginBottom: 16,
    maxHeight: 100,
  },
  categoryItem: {
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 8,
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 14,
  },
  listContainer: {
    paddingHorizontal: 8,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#1691D9',
    padding: 16,
    borderRadius: 30,
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    padding: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  categoryModalContainer: {
    flexDirection: 'column',
    marginBottom: 16,
  },
  categoryModalItem: {
    padding: 8,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: '#ddd',
  },
  activeCategory: {
    backgroundColor: '#007BFF',
  },
  categoryModalText: {
    fontSize: 14,
  },
  descriptionInput: {
    maxHeight: 200,
  },
});