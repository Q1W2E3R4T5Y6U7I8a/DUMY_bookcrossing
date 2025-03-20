import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Link } from 'expo-router';

const Post = ({ post }) => {
  return (
    <Link href={`/post/${post.id}`} asChild>
      <TouchableOpacity style={styles.postContainer}>
        <Image source={{ uri: post.image }} style={styles.postImage} />
        {/* Display the title over the image */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{post.title}</Text>
        </View>
        {/* Display stats (views, likes, comments) */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Image source={require('../../assets/eye_icon.png')} style={styles.icon} />
            <Text style={styles.statText}>{post.views}</Text>
          </View>
          <View style={styles.statItem}>
            <Image source={require('../../assets/heart_icon_active.png')} style={styles.icon} />
            <Text style={styles.statText}>{post.likes}</Text>
          </View>
          <View style={styles.statItem}>
            <Image source={require('../../assets/comment_icon.png')} style={styles.icon} />
            <Text style={styles.statText}>{post.comments}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statText}>{post.date}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    flex: 1,
    margin: 8,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    position: 'relative', // Required for absolute positioning of the title
  },
  postImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  titleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    padding: 8,
  },
  titleText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 12,
    height: 12,
    marginRight: 4,
    resizeMode: 'contain',
  },
  statText: {
    color: 'white',
    fontSize: 14,
  },
});

export default Post;