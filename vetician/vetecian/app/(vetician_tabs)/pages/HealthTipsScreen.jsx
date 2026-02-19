import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Animated, Easing, Image, Share, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AlertCircle, ChevronLeft, Heart, Share2, Bookmark } from 'lucide-react-native';
import React, { useRef, useState } from 'react';

const HealthTipsScreen = () => {
    const navigation = useNavigation();
    const [expandedTip, setExpandedTip] = useState(null);
    const [bookmarkedTips, setBookmarkedTips] = useState([]);
    const [likedTips, setLikedTips] = useState([]);
    const [activeFilter, setActiveFilter] = useState('all');
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    React.useEffect(() => {
        // Animation on component mount
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 4,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const healthTips = [
        {
            id: '1',
            title: 'Summer Pet Care',
            description: 'Keep your pets hydrated and avoid walking them on hot pavement during peak temperatures. Provide plenty of shade and fresh water.',
            extendedInfo: 'Signs of heatstroke include excessive panting, drooling, lethargy, and vomiting. If you suspect heatstroke, move your pet to a cool area immediately and contact your vet.',
            image: 'https://images.unsplash.com/photo-1551290464-66719418ca54?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            category: 'seasonal'
        },
        {
            id: '2',
            title: 'Vaccination Reminder',
            description: 'Annual vaccines are due next month. Schedule an appointment with your veterinarian to keep your pet protected.',
            extendedInfo: 'Core vaccines for dogs include rabies, distemper, parvovirus, and adenovirus. For cats: rabies, feline distemper, calicivirus, and herpesvirus.',
            image: 'https://images.unsplash.com/photo-1583511655826-05700442b31f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            category: 'preventive'
        },
        {
            id: '3',
            title: 'Dental Care Routine',
            description: 'Brush your pet\'s teeth regularly to prevent dental disease and bad breath. Use pet-safe toothpaste.',
            extendedInfo: 'Start slowly with finger brushing if your pet is new to dental care. Look for signs of dental issues like red gums, difficulty eating, or excessive drooling.',
            image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            category: 'preventive'
        },
        {
            id: '4',
            title: 'Flea and Tick Prevention',
            description: 'Use veterinarian-recommended flea and tick prevention year-round to protect your pet.',
            extendedInfo: 'Even indoor pets need protection. Watch for excessive scratching, visible insects, or "flea dirt" (black pepper-like specks) in their fur.',
            image: 'https://images.unsplash.com/photo-1551410224-699683e15636?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            category: 'preventive'
        },
        {
            id: '5',
            title: 'Proper Nutrition',
            description: 'Feed your pet age-appropriate, high-quality food in proper portions to maintain a healthy weight.',
            extendedInfo: 'Avoid giving human food that can be toxic (chocolate, grapes, onions, etc.). Consult your vet about your pet\'s specific dietary needs.',
            image: 'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            category: 'nutrition'
        },
        {
            id: '6',
            title: 'Exercise Needs',
            description: 'Ensure your pet gets daily exercise appropriate for their breed, age, and health condition.',
            extendedInfo: 'Dogs typically need 30 minutes to 2 hours of activity daily. Cats benefit from interactive play sessions. Adjust for senior pets or health limitations.',
            image: 'https://images.unsplash.com/photo-1551189013-03a8d43053e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            category: 'wellness'
        },
        {
            id: '7',
            title: 'Grooming Essentials',
            description: 'Regular grooming keeps your pet comfortable and helps you spot potential health issues early.',
            extendedInfo: 'Long-haired pets may need daily brushing. Check skin for lumps, rashes, or parasites during grooming sessions. Don\'t forget nail trims!',
            image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            category: 'preventive'
        },
        {
            id: '8',
            title: 'Pet Proofing Your Home',
            description: 'Remove hazards like toxic plants, small choking objects, and exposed electrical cords.',
            extendedInfo: 'Common household dangers include lilies (toxic to cats), xylitol (in sugar-free gum), and loose strings/ribbons. Keep trash cans secured.',
            image: 'https://images.unsplash.com/photo-1601758003122-53c40e686a19?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            category: 'safety'
        },
        {
            id: '9',
            title: 'Senior Pet Care',
            description: 'Older pets need more frequent vet checkups and may require diet or routine adjustments.',
            extendedInfo: 'Watch for signs of aging like decreased hearing/vision, stiffness, or behavior changes. Provide orthopedic bedding and easy food/water access.',
            image: 'https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            category: 'wellness'
        },
        {
            id: '10',
            title: 'Travel Safety',
            description: 'Secure pets properly in vehicles and never leave them unattended in hot cars.',
            extendedInfo: 'Use crash-tested carriers or harnesses. Bring familiar items to reduce stress. Research pet-friendly stops if traveling long distances.',
            image: 'https://images.unsplash.com/photo-1559681369-e8b09c685cf2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            category: 'safety'
        }
    ];

    const toggleExpand = (id) => {
        setExpandedTip(expandedTip === id ? null : id);
    };

    const toggleBookmark = (id) => {
        // Pulse animation when bookmarking
        pulseAnim.setValue(0.8);
        Animated.spring(pulseAnim, {
            toValue: 1,
            friction: 3,
            useNativeDriver: true,
        }).start();

        if (bookmarkedTips.includes(id)) {
            setBookmarkedTips(bookmarkedTips.filter(tipId => tipId !== id));
        } else {
            setBookmarkedTips([...bookmarkedTips, id]);
        }
    };

    const toggleLike = (id) => {
        // Heart beat animation
        const heartBeat = Animated.sequence([
            Animated.timing(pulseAnim, {
                toValue: 1.2,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
                toValue: 0.9,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
                toValue: 1.1,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]);
        heartBeat.start();

        if (likedTips.includes(id)) {
            setLikedTips(likedTips.filter(tipId => tipId !== id));
        } else {
            setLikedTips([...likedTips, id]);
        }
    };

    // const shareTip = async (tip) => {
    //     try {
    //         const result = await Share.share({
    //             message: `Pet Care Tip: ${tip.title}\n\n${tip.description}\n\nRead more in the PetCare app!`,
    //             title: tip.title
    //         });

    //         if (result.action === Share.sharedAction) {
    //             if (result.activityType) {
    //                 console.log('Shared with activity type:', result.activityType);
    //             } else {
    //                 console.log('Shared successfully');
    //             }
    //         } else if (result.action === Share.dismissedAction) {
    //             console.log('Share dismissed');
    //         }
    //     } catch (error) {
    //         Alert.alert('Error', error.message);
    //     }
    // };

    const shareTip = async (tip) => {
        try {
            // Create resource links based on tip category
            let resourceLinks = "";

            switch (tip.category) {
                case 'seasonal':
                    resourceLinks = "\n\n🔗 More summer pet care tips: https://www.avma.org/resources/pet-owners/petcare/summer-pet-care\n🔗 Heatstroke prevention: https://www.aspca.org/pet-care/general-pet-care/hot-weather-safety-tips";
                    break;
                case 'preventive':
                    if (tip.title.includes('Vaccination')) {
                        resourceLinks = "\n\n🔗 Vaccine schedules for pets: https://www.aaha.org/aaha-guidelines/vaccination-canine-configuration/vaccination-recommendations/\n🔗 Understanding pet vaccines: https://www.avma.org/resources/pet-owners/petcare/vaccinations";
                    } else if (tip.title.includes('Dental')) {
                        resourceLinks = "\n\n🔗 Pet dental care guide: https://www.vetmed.ucdavis.edu/sites/g/files/dgvnsk491/files/inline-files/Dental_Home_Care.pdf\n🔗 Dental products: https://www.vohc.org/accepted_products.htm";
                    } else {
                        resourceLinks = "\n\n🔗 Preventive care guidelines: https://www.aaha.org/aaha-guidelines/preventive-healthcare-canine-configuration/preventive-healthcare-for-dogs/\n🔗 Year-round pet care: https://www.avma.org/resources/pet-owners/petcare";
                    }
                    break;
                case 'nutrition':
                    resourceLinks = "\n\n🔗 Pet nutrition guide: https://www.aaha.org/aaha-guidelines/nutritional-assessment/nutritional-guidelines/\n🔗 Toxic foods list: https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants";
                    break;
                case 'safety':
                    resourceLinks = "\n\n🔗 Pet-proofing your home: https://www.aspca.org/pet-care/general-pet-care/pet-proofing-your-home\n🔗 Travel safety tips: https://www.avma.org/resources/pet-owners/petcare/travel-safety-tips";
                    break;
                default:
                    resourceLinks = "\n\n🔗 General pet care resources: https://www.avma.org/resources/pet-owners/petcare\n🔗 ASPCA pet care tips: https://www.aspca.org/pet-care";
            }

            const result = await Share.share({
                message: `🐾 Pet Care Tip: ${tip.title}\n\n${tip.description}${tip.extendedInfo ? '\n\n' + tip.extendedInfo : ''}${resourceLinks}\n\n _Shared via Vetician App_`,
                title: `Pet Tip: ${tip.title}`,
                url: 'https://www.petcareapp.example.com' // This will work on platforms that support URL sharing
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    console.log('Shared with activity type:', result.activityType);
                } else {
                    console.log('Shared successfully');
                }
            } else if (result.action === Share.dismissedAction) {
                console.log('Share dismissed');
            }
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const filteredTips = activeFilter === 'all'
        ? healthTips
        : healthTips.filter(tip => tip.category === activeFilter);

    const renderHealthTipCard = ({ item }) => {
        const isExpanded = expandedTip === item.id;
        const isBookmarked = bookmarkedTips.includes(item.id);
        const isLiked = likedTips.includes(item.id);

        return (
            <Animated.View
                style={[
                    styles.healthTipCard,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }]
                    }
                ]}
            >
                {item.image && (
                    <Image
                        source={{ uri: item.image }}
                        style={styles.tipImage}
                        resizeMode="cover"
                    />
                )}

                <View style={styles.healthTipMainContent}>
                    <View style={styles.healthTipIconRow}>
                        <View style={styles.healthTipIcon}>
                            <AlertCircle size={24} color="#4E8D7C" />
                        </View>
                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                onPress={() => toggleLike(item.id)}
                                style={styles.actionButton}
                                activeOpacity={0.7}
                            >
                                <Animated.View style={{ transform: [{ scale: isLiked ? pulseAnim : 1 }] }}>
                                    <Heart
                                        size={20}
                                        color={isLiked ? "#FF5A5F" : "#666"}
                                        fill={isLiked ? "#FF5A5F" : "none"}
                                    />
                                </Animated.View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => toggleBookmark(item.id)}
                                style={styles.actionButton}
                                activeOpacity={0.7}
                            >
                                <Animated.View style={{ transform: [{ scale: isBookmarked ? pulseAnim : 1 }] }}>
                                    <Bookmark
                                        size={20}
                                        color={isBookmarked ? "#FF5A5F" : "#666"}
                                        fill={isBookmarked ? "#FF5A5F" : "none"}
                                    />
                                </Animated.View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => shareTip(item)}
                                style={styles.actionButton}
                                activeOpacity={0.7}
                            >
                                <Share2 size={20} color="#666" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.healthTipContent}>
                        <Text style={styles.healthTipTitle}>{item.title}</Text>
                        <Text
                            style={styles.healthTipDescription}
                            numberOfLines={isExpanded ? undefined : 3}
                        >
                            {item.description}
                        </Text>

                        {isExpanded && item.extendedInfo && (
                            <Text style={styles.extendedInfo}>{item.extendedInfo}</Text>
                        )}

                        <TouchableOpacity
                            onPress={() => toggleExpand(item.id)}
                            style={styles.readMoreButton}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.readMoreText}>
                                {isExpanded ? 'Read Less' : 'Read More'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                    activeOpacity={0.7}
                >
                    <ChevronLeft size={28} color="#1a1a1a" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Health Tips</Text>
                <View style={styles.headerRightPlaceholder} />
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 30 }}
            >
                <Text style={styles.introText}>
                    Keep your pets healthy and happy with these expert tips and recommendations.
                </Text>

                <View style={styles.filterContainer}>
                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            activeFilter === 'all' && styles.filterButtonActive
                        ]}
                        onPress={() => setActiveFilter('all')}
                        activeOpacity={0.7}
                    >
                        <Text style={[
                            styles.filterButtonText,
                            activeFilter === 'all' && styles.filterButtonTextActive
                        ]}>
                            All Tips
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            activeFilter === 'preventive' && styles.filterButtonActive
                        ]}
                        onPress={() => setActiveFilter('preventive')}
                        activeOpacity={0.7}
                    >
                        <Text style={[
                            styles.filterButtonText,
                            activeFilter === 'preventive' && styles.filterButtonTextActive
                        ]}>
                            Preventive Care
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            activeFilter === 'seasonal' && styles.filterButtonActive
                        ]}
                        onPress={() => setActiveFilter('seasonal')}
                        activeOpacity={0.7}
                    >
                        <Text style={[
                            styles.filterButtonText,
                            activeFilter === 'seasonal' && styles.filterButtonTextActive
                        ]}>
                            Seasonal
                        </Text>
                    </TouchableOpacity>
                </View>

                {filteredTips.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateText}>No tips found for this category</Text>
                    </View>
                ) : (
                    <FlatList
                        data={filteredTips}
                        renderItem={renderHealthTipCard}
                        keyExtractor={item => item.id}
                        scrollEnabled={false}
                        contentContainerStyle={styles.healthTipsContainer}
                    />
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        paddingTop: 60,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e1e5e9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        zIndex: 10,
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    headerRightPlaceholder: {
        width: 40,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    introText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 24,
        lineHeight: 24,
    },
    filterContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 8,
        flexWrap: 'wrap',
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#e8e8e8',
    },
    filterButtonActive: {
        backgroundColor: '#4E8D7C',
    },
    filterButtonText: {
        color: '#666',
        fontSize: 14,
    },
    filterButtonTextActive: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    healthTipsContainer: {
        paddingBottom: 24,
        gap: 20,
    },
    healthTipCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e1e5e9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    tipImage: {
        width: '100%',
        height: 150,
    },
    healthTipMainContent: {
        padding: 16,
    },
    healthTipIconRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    healthTipIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e8f5e9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        padding: 6,
    },
    healthTipContent: {
        flex: 1,
    },
    healthTipTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 8,
    },
    healthTipDescription: {
        fontSize: 15,
        color: '#666',
        lineHeight: 22,
        marginBottom: 12,
    },
    extendedInfo: {
        fontSize: 14,
        color: '#666',
        lineHeight: 22,
        marginBottom: 12,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    readMoreButton: {
        alignSelf: 'flex-start',
        paddingVertical: 4,
    },
    readMoreText: {
        color: '#4E8D7C',
        fontWeight: '600',
        fontSize: 15,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#999',
    },
});

export default HealthTipsScreen;