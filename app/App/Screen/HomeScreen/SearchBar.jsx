import 'react-native-get-random-values';
import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export default function SearchBar( { searchedLocation }) {
  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder="Search Ev Charging Stations"
        fetchDetails={true}
        enablePoweredByContainer={false}
        onPress={(data, details = null) => {
          console.log(data, details);
          searchedLocation(details?.geometry.location)
        }}
        query={{
          key: 'AIzaSyDIS8MPEk_15slP27oaPA8p1YkMbF48F40',
          language: 'en',
        }}
        styles={{
          textInput: styles.textInput,
          container: styles.inputContainer,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
 
    marginTop: 6,
  },
  inputContainer: {
    borderRadius: 20,
    backgroundColor: '#fff',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  textInput: {
    height: 50,
    paddingHorizontal: 20,
    fontSize: 16,
    borderRadius: 30,
    backgroundColor: '#f9f9f9',
    color: '#333',
    fontWeight: '500',
  },
});
