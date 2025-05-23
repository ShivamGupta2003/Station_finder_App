
import { View, Text , Image } from 'react-native'
import React, { useContext } from 'react'
import { StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE , Marker } from 'react-native-maps'
import { UserLocationContext } from '../../Context/UserLocationContext';
import Markers from './Markers';
 
import MapViewStyle from '../../Utlis/MapViewStyle.json'
export default function AppMapView({placeList}) {
  const {location , setLocation} = useContext(UserLocationContext);
  return  location?.latitude && (
    <View>
    <MapView style={styles.map} 
    provider={PROVIDER_GOOGLE}
    customMapStyle={MapViewStyle}
    region={{
      latitude: location?.latitude,
      longitude: location?.longitude,
      latitudeDelta: 0.0422,
      longitudeDelta: 0.0421,
    }
    }

     >
     {location ? (
  <Marker
    coordinate={{
      latitude: location?.latitude,
      longitude: location?.longitude,
    }}
    title="Your Location"
    description="You are here"
  >
    <View style={{ width: 40, height: 40 }}>
      <Image
        source={require('../../../../assets/images/Markers.png')}
        style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
      />
    </View>
  </Marker>
) : null}

      {placeList?.map((item, index) => (
        <Markers
          key={index}
          index={index}
           place={item}
        />
      ))}
      </MapView>

    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      width: '100%',
      height: '100%',
    },
  });