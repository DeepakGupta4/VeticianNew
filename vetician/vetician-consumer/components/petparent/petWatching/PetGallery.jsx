import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
  FlatList,
  Alert,
} from 'react-native';
import { Text } from 'react-native-paper';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const PHOTOS = [
  { id: 1, uri: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb', time: '10:15 AM', isFavorite: true },
  { id: 2, uri: 'https://images.unsplash.com/photo-1650453208463-0f793aaf67a6?w=600&auto=format&fit=crop&q=60', time: '11:30 AM', isFavorite: false },
  { id: 3, uri: 'https://plus.unsplash.com/premium_photo-1694819488591-a43907d1c5cc?w=600&auto=format&fit=crop&q=60', time: '12:00 PM', isFavorite: true },
  { id: 4, uri: 'https://images.unsplash.com/photo-1597046835715-16f81ac132c0?w=600&auto=format&fit=crop&q=60', time: '01:20 PM', isFavorite: false },
  { id: 5, uri: 'https://plus.unsplash.com/premium_photo-1661963401381-ff5c19ea54c9?w=600&auto=format&fit=crop&q=60', time: '02:45 PM', isFavorite: false },
  { id: 6, uri: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993', time: '03:10 PM', isFavorite: true },
];

const PetGallery = () => {
  const [photos, setPhotos] = useState(PHOTOS);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const toggleFavorite = (id) => {
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
    if (selectedPhoto?.id === id) {
      setSelectedPhoto(prev => ({ ...prev, isFavorite: !prev.isFavorite }));
    }
  };

  const renderPhoto = ({ item }) => (
    <TouchableOpacity
      style={styles.photoItem}
      onPress={() => setSelectedPhoto(item)}
      activeOpacity={0.85}
    >
      <Image source={{ uri: item.uri }} style={styles.photo} />
      {item.isFavorite && (
        <View style={styles.favoriteBadge}>
          <Ionicons name="heart" size={14} color="#FF5252" />
        </View>
      )}
      <View style={styles.photoTime}>
        <Text style={styles.photoTimeText}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Photo Gallery</Text>
          <Text style={styles.subtitle}>{photos.length} photos captured today</Text>
        </View>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All</Text>
          <Ionicons name="chevron-forward" size={16} color="#6FA83A" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={photos}
        renderItem={renderPhoto}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        scrollEnabled={false}
        columnWrapperStyle={styles.row}
      />

      {/* Full-screen Modal */}
      <Modal
        visible={!!selectedPhoto}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedPhoto(null)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalClose} onPress={() => setSelectedPhoto(null)}>
            <Ionicons name="close-circle" size={36} color="#fff" />
          </TouchableOpacity>

          {selectedPhoto && (
            <>
              <Image
                source={{ uri: selectedPhoto.uri }}
                style={styles.modalImage}
                resizeMode="contain"
              />
              <Text style={styles.modalTime}>{selectedPhoto.time}</Text>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => Alert.alert('Download', 'Photo saved to gallery!')}
                >
                  <Ionicons name="download-outline" size={24} color="#fff" />
                  <Text style={styles.actionText}>Download</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => Alert.alert('Share', 'Sharing photo...')}
                >
                  <Ionicons name="share-outline" size={24} color="#fff" />
                  <Text style={styles.actionText}>Share</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => toggleFavorite(selectedPhoto.id)}
                >
                  <Ionicons
                    name={selectedPhoto.isFavorite ? 'heart' : 'heart-outline'}
                    size={24}
                    color={selectedPhoto.isFavorite ? '#FF5252' : '#fff'}
                  />
                  <Text style={styles.actionText}>
                    {selectedPhoto.isFavorite ? 'Unfavorite' : 'Favorite'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 16, fontWeight: '700', color: '#2C2C2C', marginBottom: 2 },
  subtitle: { fontSize: 12, color: '#757575' },
  viewAllButton: { flexDirection: 'row', alignItems: 'center' },
  viewAllText: { fontSize: 13, color: '#6FA83A', fontWeight: '600', marginRight: 2 },

  row: { justifyContent: 'space-between', marginBottom: 8 },
  photoItem: {
    width: (width - 64) / 3,
    height: (width - 64) / 3,
    borderRadius: 12,
    overflow: 'hidden',
  },
  photo: { width: '100%', height: '100%' },
  favoriteBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 10,
    padding: 3,
  },
  photoTime: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingVertical: 3,
    alignItems: 'center',
  },
  photoTimeText: { color: '#fff', fontSize: 9, fontWeight: '600' },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalClose: { position: 'absolute', top: 50, right: 20, zIndex: 10 },
  modalImage: { width: width - 40, height: width - 40 },
  modalTime: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 12 },
  modalActions: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    gap: 32,
  },
  actionButton: { alignItems: 'center' },
  actionText: { color: '#fff', fontSize: 12, marginTop: 6 },
});

export default PetGallery;
