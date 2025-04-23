

import { View, Text, FlatList, TouchableOpacity, Animated, StyleSheet, Dimensions } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import PlaceItem from './PlaceItem';
import { useContext } from 'react';
import { SelectedMarkerContext } from '../../Context/SelectedMarkerContext';

export default function PlaceListView({ placeList }) {
  const { selectedMarker, setSelectedMarker } = useContext(SelectedMarkerContext);
  const flatListRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const animation = useRef(new Animated.Value(250)).current;

  const toggleList = () => {
    Animated.timing(animation, {
      toValue: isExpanded ? 0 : 250,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsExpanded(!isExpanded);
  };

  const scrollToIndex = (index) => {
    if (flatListRef.current && placeList?.length > index) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: index,
          animated: true,
          viewPosition: 0.5 // Scroll to center of the view
        });
      }, 100);
    }
  };

  useEffect(() => {
    if (selectedMarker !== null) {
      scrollToIndex(selectedMarker);
    }
  }, [selectedMarker]);

  const getItemLayout = (_, index) => {
    // Use actual item height here (adjust 150 to your item height)
    return {
      length: 150, // Height of each item
      offset: 150 * index,
      index,
    };
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.placeListContainer, { height: animation }]}>
        <FlatList
          data={placeList}
          ref={flatListRef}
          getItemLayout={getItemLayout}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity 
              style={{ padding: 10 }}
              onPress={() => setSelectedMarker(index)}
            >
              <PlaceItem place={item} isSelected={selectedMarker === index} />
            </TouchableOpacity>
          )}
          onScrollToIndexFailed={({ index }) => {
            // Fallback for scroll failure
            setTimeout(() => {
              flatListRef.current?.scrollToIndex({ index, animated: true });
            }, 500);
          }}
        />
      </Animated.View>

      <TouchableOpacity
        style={[styles.arrowButton, isExpanded ? styles.arrowUp : styles.arrowDown]}
        onPress={toggleList}
      >
        <Text style={styles.arrowText}>{isExpanded ? '⬇️' : '⬆️'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
  },
  placeListContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
  },
  arrowButton: {
    position: 'absolute',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    left: 10,
    top: -50,
  },
  arrowUp: {},
  arrowDown: {
    transform: [{ translateY: -20 }],
  },
  arrowText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});
