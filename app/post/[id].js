import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, TextInput, Button } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { FavoritesContext } from '../../Providers/FavoritesContext';
import { doc, getDoc, updateDoc, increment, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

export default function PostDetails() {
  const { id } = useLocalSearchParams();
  const [post, setPost] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const { addFavorite, removeFavorite, isFavorite } = useContext(FavoritesContext);
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postRef = doc(db, 'posts', id);
        const postDoc = await getDoc(postRef);
        if (postDoc.exists()) {
          const postData = postDoc.data();
          setPost({ id: postDoc.id, ...postData });
          await updateDoc(postRef, { views: increment(1) });
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    const fetchComments = async () => {
      try {
        const commentsQuery = query(collection(db, 'comments'), where('postId', '==', id));
        const commentsSnapshot = await getDocs(commentsQuery);
        const commentsData = commentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
    

    fetchPost();
    fetchComments();
  }, [id]);
  

  const toggleLike = async () => {
    try {
      const postRef = doc(db, 'posts', id); // Reference to the post in Firestore

      // Update likes using Firestore's increment function
      await updateDoc(postRef, { likes: isLiked ? increment(-1) : increment(1) });

      // Update local state
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const toggleFavorite = () => {
    if (isFavorite(post.id)) {
      removeFavorite(post.id);
    } else {
      addFavorite(post);
    }
  };
  
  const toggleComments = () => {
    setIsCommentsVisible(!isCommentsVisible);
  };
  

  const handleAddComment = async () => {
    try {
      const postRef = doc(db, 'posts', id); // Reference to the post
      const commentsRef = collection(db, 'comments'); // Reference to comments collection
  
      const newCommentData = {
        postId: id,
        text: newComment,
        date: new Date().toISOString(),
      };
  
      await addDoc(commentsRef, newCommentData); // Add comment to Firestore
  
      await updateDoc(postRef, { comments: increment(1) }); // Increment comment count in post
  
      setComments([...comments, newCommentData]); // Update local state
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };
  

  if (!post) {
    return (
      <View style={styles.container}>
        <Text>Post not found!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.description}>
          {post.description
            ? post.description.split('<br>').map((line, index) => (
                <Text key={index}>{line}{'\n'}</Text> // Render each line separately
              ))
            : "No description available"}
        </Text>
      </ScrollView>
      <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
        <Image
          source={isFavorite(post.id) ? require('../../assets/star_icon_active.png') : require('../../assets/star_icon.png')}
          style={styles.favoriteIcon}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleLike} style={styles.likeButton}>
        <Image
          source={isLiked ? require('../../assets/heart_icon_active.png') : require('../../assets/heart_icon.png')}
          style={styles.likeButton}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleComments} style={styles.commentButton}>
        <Image
          source={require('../../assets/comment_icon.png')}
          style={styles.commentIcon}
        />
      </TouchableOpacity>

      <Modal transparent={true} animationType="slide" visible={isCommentsVisible}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
          <ScrollView style={styles.commentsContainer}>
            {comments.map((comment, index) => (
              <View key={index} style={styles.commentBlock}>
                <Text style={styles.commentText}>{comment.text}</Text>
              </View>
            ))}
          </ScrollView>
            <TextInput
              style={styles.input}
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Leave a comment"
            />
            <Button title="Add Comment" onPress={handleAddComment} />
            <TouchableOpacity onPress={toggleComments} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#e5e4db',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,  // Adds spacing between lines
    paddingHorizontal: 16,  // Adds padding on the left & right
    paddingVertical: 8,  // Adds padding on top & bottom
    textAlign: 'justify', // Makes the text look cleaner
  },
  likeButton: {
    position: 'absolute',
    bottom: 8,
    right: 32,
    width: 32,
    height: 32,
  },
  favoriteButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 32,
    height: 32,
  },
  favoriteIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  commentButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    width: 32,
    height: 32,
  },
  commentIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  commentsContainer: {
    width: '100%',
    marginTop: 10,
  },
  commentBlock: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  commentText: {
    fontSize: 16,
    color: '#333',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#171716',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});