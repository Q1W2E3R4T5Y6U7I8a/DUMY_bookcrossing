import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, TextInput, Button } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { FavoritesContext } from '../../context/FavoritesContext';
import { doc, getDoc, updateDoc, increment, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { LanguageContext } from '../../context/LanguageContext';

export default function PostDetails() {
  const { id, collection: collectionName } = useLocalSearchParams();
  const [post, setPost] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const { addFavorite, removeFavorite, isFavorite } = useContext(FavoritesContext);
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { language } = useContext(LanguageContext);

  // Get the correct collection name if not passed in params
  const getCollectionName = () => {
    if (collectionName) return collectionName;
    switch (language) {
      case 'english': return 'postsEN';
      case 'french': return 'postsFR';
      default: return 'posts';
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const currentCollection = getCollectionName();
        const postRef = doc(db, currentCollection, id);
        const postDoc = await getDoc(postRef);
        
        if (postDoc.exists()) {
          const postData = postDoc.data();
          setPost({ id: postDoc.id, ...postData });
          await updateDoc(postRef, { views: increment(1) });
        } else {
          console.error('No such document!');
          // Try fallback to default collection if not found
          if (currentCollection !== 'posts') {
            const fallbackRef = doc(db, 'posts', id);
            const fallbackDoc = await getDoc(fallbackRef);
            if (fallbackDoc.exists()) {
              const postData = fallbackDoc.data();
              setPost({ id: fallbackDoc.id, ...postData });
              await updateDoc(fallbackRef, { views: increment(1) });
            }
          }
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
  }, [id, language]);

  const toggleLike = async () => {
    if (!post) return;
    
    try {
      const currentCollection = getCollectionName();
      const postRef = doc(db, currentCollection, id);

      await updateDoc(postRef, { likes: isLiked ? increment(-1) : increment(1) });
      setIsLiked(!isLiked);
      
      // Update local post state
      setPost({
        ...post,
        likes: isLiked ? (post.likes || 0) - 1 : (post.likes || 0) + 1
      });
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const toggleFavorite = () => {
    if (!post) return;
    
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
    if (!newComment.trim()) return;
    
    try {
      const currentCollection = getCollectionName();
      const postRef = doc(db, currentCollection, id);
      const commentsRef = collection(db, 'comments');

      const newCommentData = {
        postId: id,
        text: newComment,
        date: new Date().toISOString(),
        language: language // Store comment language
      };

      // Add comment
      const commentRef = await addDoc(commentsRef, newCommentData);

      // Update post comment count
      await updateDoc(postRef, { comments: increment(1) });

      // Update local state
      setComments([...comments, { id: commentRef.id, ...newCommentData }]);
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
                <Text key={index}>{line}{'\n'}</Text> 
              ))
            : "No description available"}
        </Text>
      </ScrollView>

      {/* Action buttons */}
      <TouchableOpacity onPress={toggleFavorite} hitSlop={10} style={styles.favoriteButton}>
        <Image
          source={isFavorite(post.id) ? require('../../assets/star_icon_active.png') : require('../../assets/star_icon.png')}
          style={styles.favoriteIcon}
        />
      </TouchableOpacity>
      
      <TouchableOpacity onPress={toggleLike} style={styles.likeButton}>
        <Image
          source={isLiked ? require('../../assets/heart_icon_active.png') : require('../../assets/heart_icon.png')}
          style={styles.likeIcon}
        />
        {post.likes > 0 && (
          <Text style={styles.likeCount}>{post.likes}</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity onPress={toggleComments} hitSlop={10} style={styles.commentButton}>
        <Image
          source={require('../../assets/comment_icon.png')}
          style={styles.commentIcon}
        />
        {post.comments > 0 && (
          <Text style={styles.commentCount}>{post.comments}</Text>
        )}
      </TouchableOpacity>

      {/* Comments Modal */}
      <Modal transparent={true} animationType="slide" visible={isCommentsVisible}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <ScrollView style={styles.commentsContainer}>
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <View key={comment.id} style={styles.commentBlock}>
                    <Text style={styles.commentText}>{comment.text}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noCommentsText}>No comments yet</Text>
              )}
            </ScrollView>
            
            <TextInput
              style={styles.input}
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Leave a comment"
              multiline
            />
            
            <View style={styles.buttonRow}>
              <Button 
                title="Add Comment" 
                onPress={handleAddComment} 
                disabled={!newComment.trim()}
              />
              <Button 
                title="Close" 
                onPress={toggleComments} 
                color="#999"
              />
            </View>
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
  scrollContent: {
    paddingBottom: 60, // Space for action buttons
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    textAlign: 'justify',
  },
  likeButton: {
    position: 'absolute',
    bottom: 16,
    right: 80,
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeIcon: {
    width: 32,
    height: 32,
  },
  likeCount: {
    marginLeft: 4,
    fontSize: 16,
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  commentCount: {
    marginLeft: 4,
    fontSize: 16,
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
    width: '90%',
    maxHeight: '80%',
  },
  commentsContainer: {
    width: '100%',
    maxHeight: '60%',
    marginBottom: 16,
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
  noCommentsText: {
    textAlign: 'center',
    color: '#999',
    padding: 16,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    minHeight: 60,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});