import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, SafeAreaView, FlatList
} from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function PetTrainingScreen() {
  const [selectedCategory, setSelectedCategory] = useState('Behavior');

  const COURSES = [
    {
      id: '1',
      title: 'Basic Obedience',
      duration: '4 Weeks',
      sessions: '12 Sessions',
      price: '₹4,999',
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=400',
      tags: ['Sit/Stay', 'Leash Walk']
    },
    {
      id: '2',
      title: 'Potty Training',
      duration: '2 Weeks',
      sessions: '6 Sessions',
      price: '₹2,499',
      image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=400',
      tags: ['House Breaking', 'Routine']
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* --- Training Banner --- */}
        <View style={styles.headerBanner}>
          <View style={styles.headerTextSide}>
            <Text style={styles.headerTitle}>Professional Training</Text>
            <Text style={styles.headerSub}>Make your pet the best version of themselves.</Text>
            <TouchableOpacity style={styles.consultBtn}>
              <Text style={styles.consultText}>Free Consult</Text>
            </TouchableOpacity>
          </View>
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3048/3048384.png' }} 
            style={styles.headerImg} 
          />
        </View>

        {/* --- Mode Selection --- */}
        <View style={styles.modeContainer}>
          <TouchableOpacity style={[styles.modeCard, styles.activeMode]}>
            <MaterialIcons name="home" size={24} color="#fff" />
            <Text style={styles.activeModeText}>At Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modeCard}>
            <MaterialIcons name="videocam" size={24} color="#24A1DE" />
            <Text style={styles.modeText}>Online</Text>
          </TouchableOpacity>
        </View>

        {/* --- Training Courses --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Programs</Text>
          {COURSES.map((item) => (
            <TouchableOpacity key={item.id} style={styles.courseCard}>
              <Image source={{ uri: item.image }} style={styles.courseImg} />
              <View style={styles.courseContent}>
                <View style={styles.tagRow}>
                  <Text style={styles.durationTag}>{item.duration}</Text>
                  <Text style={styles.sessionTag}>{item.sessions}</Text>
                </View>
                <Text style={styles.courseTitle}>{item.title}</Text>
                
                <View style={styles.skillsRow}>
                  {item.tags.map(tag => (
                    <Text key={tag} style={styles.skillText}>• {tag}</Text>
                  ))}
                </View>

                <View style={styles.priceRow}>
                  <Text style={styles.price}>{item.price}</Text>
                  <TouchableOpacity style={styles.enrollBtn}>
                    <Text style={styles.enrollText}>View Syllabus</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* --- Why Professional Training? --- */}
        <View style={styles.infoBox}>
           <Text style={styles.infoTitle}>Why professional training?</Text>
           <View style={styles.infoItem}>
              <Ionicons name="shield-checkmark" size={20} color="#10B981" />
              <Text style={styles.infoText}>Reduces anxiety & destructive behavior</Text>
           </View>
           <View style={styles.infoItem}>
              <Ionicons name="shield-checkmark" size={20} color="#10B981" />
              <Text style={styles.infoText}>Improves social skills with other pets</Text>
           </View>
        </View>

      </ScrollView>

      {/* --- Footer Action --- */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.mainCallBtn}>
          <Ionicons name="call" size={20} color="white" />
          <Text style={styles.mainCallText}>Talk to Training Expert</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerBanner: { backgroundColor: '#E3F2FD', padding: 25, flexDirection: 'row', alignItems: 'center' },
  headerTextSide: { flex: 1 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  headerSub: { fontSize: 13, color: '#666', marginTop: 5 },
  consultBtn: { backgroundColor: '#24A1DE', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, alignSelf: 'flex-start', marginTop: 12 },
  consultText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  headerImg: { width: 80, height: 80 },

  modeContainer: { flexDirection: 'row', padding: 20, gap: 15 },
  modeCard: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#24A1DE' },
  activeMode: { backgroundColor: '#24A1DE' },
  modeText: { marginLeft: 8, fontWeight: 'bold', color: '#24A1DE' },
  activeModeText: { marginLeft: 8, fontWeight: 'bold', color: '#fff' },

  section: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  courseCard: { backgroundColor: '#fff', borderRadius: 15, marginBottom: 20, elevation: 3, overflow: 'hidden', flexDirection: 'row' },
  courseImg: { width: 120, height: '100%' },
  courseContent: { flex: 1, padding: 15 },
  tagRow: { flexDirection: 'row', gap: 8, marginBottom: 5 },
  durationTag: { fontSize: 10, color: '#24A1DE', backgroundColor: '#E3F2FD', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, fontWeight: 'bold' },
  sessionTag: { fontSize: 10, color: '#666', backgroundColor: '#eee', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  courseTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  skillsRow: { marginTop: 8 },
  skillText: { fontSize: 12, color: '#777', marginBottom: 2 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  price: { fontSize: 17, fontWeight: 'bold', color: '#333' },
  enrollBtn: { padding: 5 },
  enrollText: { color: '#24A1DE', fontWeight: 'bold', fontSize: 12 },

  infoBox: { margin: 20, padding: 20, backgroundColor: '#F9F9F9', borderRadius: 12 },
  infoTitle: { fontWeight: 'bold', marginBottom: 10 },
  infoItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  infoText: { marginLeft: 10, fontSize: 13, color: '#555' },

  footer: { padding: 15, borderTopWidth: 1, borderTopColor: '#eee' },
  mainCallBtn: { backgroundColor: '#24A1DE', padding: 15, borderRadius: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  mainCallText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 10 }
});