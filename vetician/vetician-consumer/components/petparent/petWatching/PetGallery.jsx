import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
  FlatList,
} from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const PetGallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const photos = [
    { id: 1, uri: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb', isFavorite: true },
    { id: 2, uri: 'https://images.unsplash.com/photo-1650453208463-0f793aaf67a6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGVhdGluZyUyMGRvZ3N8ZW58MHx8MHx8fDA%3D', isFavorite: false },
    { id: 3, uri: 'https://plus.unsplash.com/premium_photo-1694819488591-a43907d1c5cc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y3V0ZSUyMGRvZ3xlbnwwfHwwfHx8MA%3D%3D', isFavorite: true },
    { id: 4, uri: 'https://images.unsplash.com/photo-1597046835715-16f81ac132c0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGxheWluZyUyMGRvZ3N8ZW58MHx8MHx8fDA%3D', isFavorite: false },
    { id: 5, uri: 'https://plus.unsplash.com/premium_photo-1661963401381-ff5c19ea54c9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODd8fHZlY2NpbmF0ZSUyMGRvZ3N8ZW58MHx8MHx8fDA%3D', isFavorite: false },
    { id: 6, uri: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993', isFavorite: true },
  ];

  const openImage = (photo) => {
    setSelectedImage(photo);
    setModalVisible(true);
  };

  const renderPhoto = ({ item }) => (
    <TouchableOpacity
      style={styles.photoItem}
      onPress={() => openImage(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.uri }} style={styles.photo} />
      {item.isFavorite && (
        <View style={styles.favoritebadge}>
          <Icon name="heart" size={16} color="#FF5252" />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Photo Gallery</Text>
          <Text style={styles.subtitle}>{photos.length} photos captured today</Text>
        </View>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All</Text>
          <Icon name="chevron-forward" size={16} color="#6FA83A" />
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

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalClose}
            onPress={() => setModalVisible(false)}
          >
            <Icon name="close-circle" size={36} color="#FFFFFF" />
          </TouchableOpacity>

          {selectedImage && (
            <>
              <Image
                source={{ uri: selectedImage.uri }}
                style={styles.modalImage}
                resizeMode="contain"
              />

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Icon name="download-outline" size={24} color="#FFFFFF" />
                  <Text style={styles.actionText}>Download</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Icon name="share-outline" size={24} color="#FFFFFF" />
                  <Text style={styles.actionText}>Share</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Icon name="heart-outline" size={24} color="#FFFFFF" />
                  <Text style={styles.actionText}>Favorite</Text>
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
    backgroundColor: '#FFFFFF',
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
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C2C2C',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#757575',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 13,
    color: '#6FA83A',
    fontWeight: '600',
    marginRight: 4,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  photoItem: {
    width: (width - 64) / 3,
    height: (width - 64) / 3,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  favoriteBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  modalImage: {
    width: width - 40,
    height: width - 40,
  },
  modalActions: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    gap: 32,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 6,
  },
});

export default PetGallery;
