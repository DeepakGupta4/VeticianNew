import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions
} from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const PetDetailModal = ({ pet, visible, onClose }) => {
    if (!pet) return null;

    const PET_TYPES = {
        Dog: 'dog',
        Cat: 'cat',
        Other: 'dragon', // Using dragon icon for "Other" species
        default: 'paw'
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Pet Details</Text>
                        <TouchableOpacity 
                            style={styles.modalCloseButton}
                            onPress={onClose}
                        >
                            <MaterialIcons name="close" size={24} color="#7D7D7D" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView 
                        contentContainerStyle={styles.modalScrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.modalImageContainer}>
                            {pet.petPhoto ? (
                                <Image
                                    source={{ uri: pet.petPhoto }}
                                    style={styles.modalImage}
                                />
                            ) : (
                                <View style={styles.modalImagePlaceholder}>
                                    <FontAwesome5
                                        name={PET_TYPES[pet.species] || PET_TYPES.default}
                                        size={60}
                                        color="#4E8D7C"
                                    />
                                </View>
                            )}
                        </View>

                        <View style={styles.modalDetails}>
                            <View style={styles.modalPetInfo}>
                                <Text style={styles.modalPetName}>{pet.name}</Text>
                                <View style={styles.modalPetTypeContainer}>
                                    <Text style={styles.modalPetType}>{pet.species}</Text>
                                </View>
                            </View>

                            <View style={styles.detailsSection}>
                                <Text style={styles.sectionTitle}>Basic Information</Text>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Gender:</Text>
                                    <Text style={styles.detailValue}>{pet.gender || 'N/A'}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Breed:</Text>
                                    <Text style={styles.detailValue}>{pet.breed || 'N/A'}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Date of Birth:</Text>
                                    <Text style={styles.detailValue}>{formatDate(pet.dob)}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Blood Group:</Text>
                                    <Text style={styles.detailValue}>{pet.bloodGroup || 'N/A'}</Text>
                                </View>
                            </View>

                            <View style={styles.detailsSection}>
                                <Text style={styles.sectionTitle}>Physical Characteristics</Text>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Color:</Text>
                                    <Text style={styles.detailValue}>{pet.color || 'N/A'}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Weight:</Text>
                                    <Text style={styles.detailValue}>{pet.weight ? `${pet.weight} kg` : 'N/A'}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Height:</Text>
                                    <Text style={styles.detailValue}>{pet.height ? `${pet.height} cm` : 'N/A'}</Text>
                                </View>
                                {pet.distinctiveFeatures && (
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Distinctive Features:</Text>
                                        <Text style={styles.detailValue}>{pet.distinctiveFeatures}</Text>
                                    </View>
                                )}
                            </View>

                            <View style={styles.detailsSection}>
                                <Text style={styles.sectionTitle}>Health Information</Text>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Allergies:</Text>
                                    <Text style={styles.detailValue}>{pet.allergies || 'N/A'}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Chronic Diseases:</Text>
                                    <Text style={styles.detailValue}>{pet.chronicDiseases || 'N/A'}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Current Medications:</Text>
                                    <Text style={styles.detailValue}>{pet.currentMedications || 'N/A'}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Past Medications:</Text>
                                    <Text style={styles.detailValue}>{pet.pastMedications || 'N/A'}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Vaccinations:</Text>
                                    <Text style={styles.detailValue}>{pet.vaccinations || 'N/A'}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Surgeries:</Text>
                                    <Text style={styles.detailValue}>{pet.surgeries || 'N/A'}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Injuries:</Text>
                                    <Text style={styles.detailValue}>{pet.injuries || 'N/A'}</Text>
                                </View>
                            </View>

                            <View style={styles.detailsSection}>
                                <Text style={styles.sectionTitle}>Location</Text>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Address:</Text>
                                    <Text style={styles.detailValue}>{pet.location || 'N/A'}</Text>
                                </View>
                            </View>

                            <View style={styles.detailsSection}>
                                <Text style={styles.sectionTitle}>Additional Notes</Text>
                                <Text style={styles.notesText}>{pet.notes || 'No additional notes'}</Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: width * 0.9,
        maxHeight: '85%',
        backgroundColor: 'white',
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        backgroundColor: '#F8F9FA',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2C3E50',
    },
    modalCloseButton: {
        padding: 5,
    },
    modalScrollContent: {
        paddingBottom: 30,
    },
    modalImageContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 15,
    },
    modalImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 3,
        borderColor: '#4E8D7C',
    },
    modalImagePlaceholder: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#F0F7F4',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#4E8D7C',
    },
    modalDetails: {
        paddingHorizontal: 20,
    },
    modalPetInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalPetName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#2C3E50',
    },
    modalPetTypeContainer: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#4E8D7C',
    },
    modalPetType: {
        fontSize: 14,
        color: '#4E8D7C',
        fontWeight: '600',
    },
    detailsSection: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4E8D7C',
        marginBottom: 10,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: 15,
        color: '#7D7D7D',
        fontWeight: '500',
        flex: 1,
    },
    detailValue: {
        fontSize: 15,
        color: '#2C3E50',
        fontWeight: '600',
        flex: 1,
        textAlign: 'right',
    },
    notesText: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
    },
});

export default PetDetailModal;