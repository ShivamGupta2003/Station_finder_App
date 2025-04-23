import { View, Image, StyleSheet } from 'react-native';
import React from 'react';
import { useUser } from '@clerk/clerk-expo';
import { FontAwesome } from '@expo/vector-icons';

export default function Header() {
  const { user } = useUser();

  return (
    <View style={styles.container}>
      {user?.imageUrl && (
        <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
      )}
      <Image
        source={require('../../../../assets/images/ev.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <FontAwesome name="filter" size={24} color="black" style={styles.icon} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#eee8e8',
    borderRadius: 20,
    marginHorizontal: 1,
    elevation: 10,
    marginTop: 3,
    overflow: 'hidden', 
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  logo: {
    width: 120,
    height: 40,
  },
  icon: {
    padding: 5,
  },
});
