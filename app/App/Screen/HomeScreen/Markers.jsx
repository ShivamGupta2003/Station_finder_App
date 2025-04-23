import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import MapView, { Marker } from 'react-native-maps'
import { SelectedMarkerContext } from '../../Context/SelectedMarkerContext'

export default function Markers({place , index}) {
  const {selectedMarker , setSelectedMarker} = useContext(SelectedMarkerContext);
  return (
    <View>
   <Marker
             coordinate={{
               latitude: place?.location?.latitude,
                longitude: place?.location?.longitude,
             }}
             title={place.displayName?.text }
              description="EV Charging Station"
            onPress={() => setSelectedMarker(index)}
           />
    </View>
  )
}