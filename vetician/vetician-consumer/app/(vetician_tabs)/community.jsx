import React, { useState, useCallback, useEffect } from 'react';
import {
  View, ScrollView, StyleSheet,
  StatusBar, SafeAreaView, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';

import { COLORS2 } from '../../constant/theme';
import { CATEGORIES, COMMUNITIES, POSTS } from '../../components/petparent/PetCommunity/communityData';
import Header from '../../components/petparent/PetCommunity/Header';
import SearchBar from '../../components/petparent/PetCommunity/SearchBar';
import CategoryScroll from '../../components/petparent/PetCommunity/CategoryScroll';
import CommunityList from '../../components/petparent/PetCommunity/CommunityList';
import CreatePostCard from '../../components/petparent/PetCommunity/CreatePostCard';
import PostFeed from '../../components/petparent/PetCommunity/PostFeed';
import Loader from '../../components/petparent/PetCommunity/Loader';
import CommunityDetailsScreen from '../../components/petparent/PetCommunity/CommunityDetailsScreen';
import PostDetailsScreen from '../../components/petparent/PetCommunity/PostDetailsScreen';

export default function CommunityScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [posts, setPosts] = useState(POSTS);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  const filteredCommunities = COMMUNITIES.filter((c) => {
    const matchSearch = search.trim() === '' || c.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !selectedCategory || c.category === CATEGORIES.find((cat) => cat.id === selectedCategory)?.label;
    return matchSearch && matchCategory;
  });

  const handleDeletePost = useCallback((postId) => {
    Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setPosts((prev) => prev.filter((p) => p.id !== postId)) },
    ]);
  }, []);

  const handleReportPost = useCallback(() => {
    Alert.alert('Post Reported', 'Thank you for reporting. Our moderators will review it.');
  }, []);

  const handleCreatePost = useCallback(() => {
    Alert.alert('Create Post', 'Post creation coming soon!');
  }, []);

  if (selectedPost) {
    return <PostDetailsScreen post={selectedPost} onBack={() => setSelectedPost(null)} />;
  }

  if (selectedCommunity) {
    return (
      <CommunityDetailsScreen
        community={selectedCommunity}
        onBack={() => setSelectedCommunity(null)}
        onPostPress={(post) => setSelectedPost(post)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS2.primary} />
      <Header onBack={() => router.back()} />
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
        <SearchBar value={search} onChangeText={setSearch} onClear={() => setSearch('')} />
        <CategoryScroll categories={CATEGORIES} onSelect={setSelectedCategory} />
        <CommunityList communities={filteredCommunities} onPress={(community) => setSelectedCommunity(community)} />
        <CreatePostCard onPress={handleCreatePost} />
        {loading ? (
          <Loader />
        ) : (
          <PostFeed
            posts={posts}
            onPostPress={(post) => setSelectedPost(post)}
            onDelete={handleDeletePost}
            onReport={handleReportPost}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS2.card },
  content: { paddingBottom: 32 },
});
