
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Animated, Easing } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialIcons, FontAwesome, AntDesign } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.back(1)),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Loading Profile...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#f5f7fa', '#e4e8f0']}
      style={styles.gradientContainer}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Profile Card with Animation */}
        <Animated.View 
          style={[
            styles.profileCard,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }, { scale: scaleAnim }]
            }
          ]}
        >
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: user.imageUrl }} 
              style={styles.avatar} 
            />
            <View style={styles.verifiedBadge}>
              <FontAwesome name="check-circle" size={24} color="#4CAF50" />
            </View>
          </View>
          
          <Text style={styles.name}>{user.fullName}</Text>
          <Text style={styles.email}>{user.primaryEmailAddress?.emailAddress}</Text>
          
          <View style={styles.statsContainer}>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.signOutButton]}
            onPress={handleSignOut}
          >
            <AntDesign name="logout" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Sign Out</Text>
          </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Info Card */}
        <Animated.View 
          style={[
            styles.infoCard,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Profile Details</Text>
          
          <DetailRow 
            icon={<Feather name="user" size={20} color="#666" />}
            label="Username"
            value={user.username || 'N/A'}
          />
          <DetailRow 
            icon={<MaterialIcons name="fingerprint" size={20} color="#666" />}
            label="User ID"
            value={user.id.substring(0, 8) + '...'}
          />
          <DetailRow 
            icon={<FontAwesome name="user-o" size={18} color="#666" />}
            label="First Name"
            value={user.firstName}
          />
          <DetailRow 
            icon={<FontAwesome name="user-o" size={18} color="#666" />}
            label="Last Name"
            value={user.lastName}
          />
          <DetailRow 
            icon={<Feather name="phone" size={20} color="#666" />}
            label="Phone"
            value={user.primaryPhoneNumber?.phoneNumber || 'N/A'}
          />
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View 
          style={[
            styles.actionsContainer,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }]
            }
          ]}
        >
         
          
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const DetailRow = ({ icon, label, value }) => (
  <View style={styles.detailRow}>
    <View style={styles.detailIcon}>
      {icon}
    </View>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value} numberOfLines={1} ellipsizeMode="tail">{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#777',
  },
  profileCard: {
    backgroundColor: '#fff',
    width: '100%',
    alignItems: 'center',
    padding: 25,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 3,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#444',
  },
  statLabel: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    color: '#444',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailIcon: {
    width: 30,
    alignItems: 'center',
    marginRight: 10,
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  value: {
    flex: 2,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'right',
  },
  actionsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#4a6da7',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  signOutButton: {
    backgroundColor: '#ff4444',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
}); 