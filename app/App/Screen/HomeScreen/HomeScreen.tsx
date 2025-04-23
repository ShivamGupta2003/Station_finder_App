

import { View, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import AppMapView from './AppMapView';
import Header from './Header';
import SearchBar from './SearchBar';
import { UserLocationContext } from '../../Context/UserLocationContext';
import GlobalApi from '../../Utlis/GlobalApi';
import PlaceListView from './PlaceListView';
import { SelectedMarkerContext } from '../../Context/SelectedMarkerContext';

export default function HomeScreen() {
  // Change from 'loaction' to 'location' here
  const { location, setLocation } = React.useContext(UserLocationContext);
  const [placeList , setPlaceList] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null); 

  useEffect(() => {

    if (!location) {
      console.log("Waiting for location...");
      return;
    }
  
    location && GetNearByPlace();
  }, [location]);

  const GetNearByPlace = () => {
    const data = {
      "includedTypes": ["electric_vehicle_charging_station"],
      "maxResultCount": 10,
      "locationRestriction": {
        "circle": {
          "center": {
            
            "latitude": location?.latitude,
            
            "longitude": location?.longitude
          },
          "radius": 5000.0
        }
      },
    };
    console.log("Sending request with data:", data);
    
   

    GlobalApi.NewNearByPlace(data)
    .then(resp => {
      console.log("Full API response:", resp); 
      console.log("Response data:", JSON.stringify(resp.data));
      setPlaceList(resp.data?.places);
      console.log("Places:", resp.data?.places);
    })
    .catch(error => {
      console.error("API request failed:", error);
      if (error.response) {
        console.error("Response error:", error.response.data);
      }
    });
  }

  return (
    <SelectedMarkerContext.Provider  value={{ selectedMarker, setSelectedMarker }}>
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header />
        <SearchBar searchedLocation={(location) => setLocation({
          latitude: location.lat,
          longitude: location.lng,
        })

        }/>
      </View>
      <View style={styles.mapContainer}>
      {placeList &&<AppMapView  placeList={placeList} />}
  
  <View style={styles.placeListContainer}>
   {placeList && <PlaceListView  placeList={placeList}/>}
  </View>
</View>

      
    </View>
    </SelectedMarkerContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    position: 'absolute',
    zIndex: 10,
    padding: 15,
    width: '100%',
  },
  mapContainer: {
    flex: 1,
  },
  placeListContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    maxHeight: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.6)', // more transparent
    padding: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },

 
});
