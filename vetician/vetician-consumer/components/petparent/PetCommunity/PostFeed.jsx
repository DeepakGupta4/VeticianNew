import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PostCard from './PostCard';
import EmptyState from './EmptyState';
import { COLORS2 } from '../../../constant/theme';

export default function PostFeed({ posts, onPostPress, onDelete, onReport }) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Community Feed</Text>
      {posts && posts.length > 0 ? (
        posts.map((post, index) => (
          <PostCard
            key={post.id}
            post={post}
            index={index}
            onPress={onPostPress}
            onDelete={onDelete}
            onReport={onReport}
          />
        ))
      ) : (
        <EmptyState />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 20 },
  heading: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS2.text,
    marginHorizontal: 16,
    marginBottom: 12,
    marginTop: 4,
  },
});
