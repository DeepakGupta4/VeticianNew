import React, { useState, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  Animated,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TourIndicator from './TourIndicator';

const { width } = Dimensions.get('window');

const tourData = [
  {
    id: '1',
    title: 'Book Vets Near You',
    description: 'Find and book appointments with verified veterinarians in your area',
    icon: 'location',
    color: '#4CAF50',
  },
  {
    id: '2',
    title: 'Video Consults from Home',
    description: 'Get expert advice through video consultations from the comfort of your home',
    icon: 'videocam',
    color: '#2196F3',
  },
  {
    id: '3',
    title: 'Trusted Paravet Visits at Doorstep',
    description: 'Professional paravet services delivered right to your doorstep',
    icon: 'home',
    color: '#FF9800',
  },
  {
    id: '4',
    title: 'Store Medical Records',
    description: 'Keep all your pet\'s medical history organized and accessible anytime',
    icon: 'document-text',
    color: '#9C27B0',
  },
  {
    id: '5',
    title: 'Emergency Vet Access',
    description: '24/7 emergency veterinary services when you need them most',
    icon: 'flash',
    color: '#F44336',
  },
];

const TourCarousel = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const handleNext = () => {
    if (currentIndex < tourData.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ 
        index: nextIndex, 
        animated: true 
      });
      setCurrentIndex(nextIndex);
    } else {
      onComplete?.();
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.slideContainer}>
        <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
          <Ionicons name={item.icon} size={80} color={item.color} />
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        
        {item.id === tourData[tourData.length - 1].id && (
          <TouchableOpacity
            style={[styles.startButton, { backgroundColor: item.color }]}
            onPress={onComplete}
          >
            <Text style={styles.startButtonText}>Start Using Vetician</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={tourData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        keyExtractor={(item) => item.id}
        bounces={false}
        scrollEventThrottle={16}
      />
      
      <TourIndicator
        data={tourData}
        scrollX={scrollX}
        currentIndex={currentIndex}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slideContainer: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
    marginBottom: 60,
  },
  startButton: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default TourCarousel;