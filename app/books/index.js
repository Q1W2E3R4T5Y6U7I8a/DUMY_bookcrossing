import { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Modal, TouchableWithoutFeedback, Button, Alert } from 'react-native';
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { LanguageContext } from '../../context/LanguageContext';

const BooksScreen = () => {
  const { language } = useContext(LanguageContext);
  const [books, setBooks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newBook, setNewBook] = useState({ id: null, title: '', author: '', deposit: '', contact: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'books'), (snapshot) => {
      const booksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBooks(booksData);
    });

    return () => unsubscribe();
  }, []);

  const addBook = async () => {
    if (!newBook.title || !newBook.author || !newBook.deposit || !newBook.contact || !newBook.description) {
      Alert.alert('Помилка', 'Будь ласка, заповніть всі поля');
      return;
    }

    try {
      if (isEditing) {
        await updateDoc(doc(db, 'books', newBook.id), newBook);
      } else {
        const docRef = await addDoc(collection(db, 'books'), newBook);
      }
      setModalVisible(false);
      setNewBook({ id: null, title: '', author: '', deposit: '', contact: '', description: '' });
      setIsEditing(false);
    } catch (error) {
      console.error('Error adding/updating book:', error);
    }
  };

  const editBook = (book) => {
    Alert.alert(
      'Доступ заблоковано',
      'Ви не маєте доступу до редагування або видалення, щоб отримати доступ, напишіть будь ласка в телеграм @sofia_shevchenko21',
      [{ text: 'OK' }]
    );
  };

  const deleteBook = async (id) => {
    Alert.alert(
      'Доступ заблоковано',
      'Ви не маєте доступу до редагування або видалення, щоб отримати доступ, напишіть будь ласка в телеграм @sofia_shevchenko21',
      [{ text: 'OK' }]
    );
  };

  if (language !== 'ukrainian') {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          {language === 'english'
            ? 'This page is done only in Ukrainian yet.'
            : 'Cette page est encore disponible uniquement en ukrainien.'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.bookItem}>
            <Text style={styles.title}>{item.title} - {item.author}</Text>
            <Text>Депозит: {item.deposit}</Text>
            <Text>Контакт: {item.contact}</Text>
            <Text>{item.description}</Text>
            <View style={styles.buttonsContainer}>
              <Button title="Редагувати" onPress={() => editBook(item)} />
              <Button title="Видалити" onPress={() => deleteBook(item.id)} color="red" />
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <TextInput placeholder="Назва книги" style={styles.input} value={newBook.title} onChangeText={(text) => setNewBook({ ...newBook, title: text })} />
              <TextInput placeholder="Автор" style={styles.input} value={newBook.author} onChangeText={(text) => setNewBook({ ...newBook, author: text })} />
              <TextInput placeholder="Депозит (грн)" style={styles.input} keyboardType="numeric" value={newBook.deposit} onChangeText={(text) => setNewBook({ ...newBook, deposit: text })} />
              <TextInput placeholder="Контакт" style={styles.input} value={newBook.contact} onChangeText={(text) => setNewBook({ ...newBook, contact: text })} />
              <TextInput placeholder="Опис" style={styles.input} multiline value={newBook.description} onChangeText={(text) => setNewBook({ ...newBook, description: text })} />
              <Button title={isEditing ? "Оновити книгу" : "Додати книгу"} onPress={addBook} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  bookItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  title: { fontWeight: 'bold' },
  buttonsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  addButton: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#1691D9', padding: 16, borderRadius: 30 },
  addButtonText: { color: 'white', fontSize: 24, textAlign: 'center' },
  modalBackground: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContainer: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' },
  input: { borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 10, padding: 8 },
  message: { fontSize: 16, textAlign: 'center' }
});

export default BooksScreen;
