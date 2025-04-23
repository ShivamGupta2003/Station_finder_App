import { View, Text } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../Screen/HomeScreen/HomeScreen';
import ProfileScreen from '../Screen/ProfileScreen/ProfileScreen';
import FavoriteScreen from '../Screen/FavoriteScreen/FavoriteScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>

<Tab.Screen 
  name="home" 
  component={HomeScreen}
  options={{
    tabBarLabel: 'Search',
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="search" size={size} color={color} />
    ),
  }}
/>

   

<Tab.Screen 
  name="Favorite" 
  component={FavoriteScreen} 
  options={{
    tabBarLabel: 'Favorites',
    tabBarActiveTintColor: 'red',
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="heart" size={size} color={color} />
    ),
  }} 
/>


<Tab.Screen 
  name="Profile" 
  component={ProfileScreen} 
  options={{
    tabBarLabel: 'Profile',
    tabBarActiveTintColor: 'brown',
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="person" size={size} color={color} />
    ),
  }} 
/>


       
    </Tab.Navigator>
  );
}
