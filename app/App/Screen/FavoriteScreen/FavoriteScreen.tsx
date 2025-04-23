


import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { app } from '../../Utlis/FirebaseConfig';
import { useUser } from '@clerk/clerk-expo';
import FavoriteItem from './FavoriteItem';

export default function FavoriteScreen() {
  const [favorites, setFavorites] = useState([]);
  const { user } = useUser();
  const db = getFirestore(app);
  const userEmail = user?.emailAddresses[0]?.emailAddress;

  useEffect(() => {
    if (!userEmail) return;

    let unsubscribe;

    const setupRealTimeListener = async () => {
      try {
        const favCollection = collection(db, 'ev-fav-place');
        const favQuery = query(
          favCollection,
          where('email', '==', userEmail)
        );

        unsubscribe = onSnapshot(favQuery, (querySnapshot) => {
          const favs = querySnapshot.docs.map(doc => ({
            ...doc.data().place,
            firebaseId: doc.id
          }));
          setFavorites(favs);
        });

      } catch (error) {
        console.error('Error setting up listener:', error);
       
      }
    };

    setupRealTimeListener();

    // Clean up the listener when component unmounts
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [userEmail]);

  const handleRemoveFavorite = async (firebaseId) => {
    try {
      const docRef = doc(db, 'ev-fav-place', firebaseId);
      await deleteDoc(docRef);
    
    } catch (error) {
      console.error('Error removing favorite:', error);
   
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Favorites</Text>
      {favorites.length === 0 ? (
        <Text style={styles.emptyText}>No favorites yet</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.firebaseId}
          renderItem={({ item }) => (
            <FavoriteItem 
              place={item} 
              onRemove={() => handleRemoveFavorite(item.firebaseId)}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});