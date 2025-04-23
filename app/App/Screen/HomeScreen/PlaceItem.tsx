

import { getFirestore } from 'firebase/firestore';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking, ToastAndroid } from 'react-native';
import { app } from '../../Utlis/FirebaseConfig';
import React from 'react';
import GlobalApi from '../../Utlis/GlobalApi';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { doc, setDoc } from 'firebase/firestore';
import { useUser } from '@clerk/clerk-expo';

export default function PlaceItem({ place }) {
    const PLACE_PHOTO = "https://places.googleapis.com/v1/";
    const { user } = useUser();
    const db = getFirestore(app);

    const openGoogleMaps = () => {
        if (!place?.location?.latitude || !place?.location?.longitude) return;
        
        const url = `https://www.google.com/maps/search/?api=1&query=${place.location.latitude},${place.location.longitude}`;
        
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                console.log("Don't know how to open URI: " + url);
            }
        }).catch(err => {
            console.error("Error opening URL: ", err);
        });
    };

    const onSetFav = async (place) => {
        if (!user?.emailAddresses?.[0]?.emailAddress || !place?.id) {
            ToastAndroid.show('Missing required information', ToastAndroid.SHORT);
            return;
        }

        try {
            await setDoc(
                doc(db, 'ev-fav-place', place.id.toString()),
                {
                    place: place,
                    email: user.emailAddresses[0].emailAddress,
                }
            );
            ToastAndroid.show('Added to Favorite', ToastAndroid.SHORT);
        } catch (error) {
            console.error("Error adding to favorites: ", error);
            ToastAndroid.show('Failed to add favorite', ToastAndroid.SHORT);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.topRow}>
                <View style={styles.imageContainer}>
                    <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={() => onSetFav(place)}
                    >
                        <Ionicons name="heart" size={24} color="#ff4444" />
                    </TouchableOpacity>
                    <Image 
                        source={
                            place?.photos?.[0]?.name 
                                ? { uri: `${PLACE_PHOTO}${place.photos[0].name}/media?key=${GlobalApi.API_KEY}&maxHeightPx=80&maxWidthPx=80` }
                                : require('./../../../../assets/images/evman.png')
                        } 
                        style={styles.image} 
                    />
                </View>

                <View style={styles.nameContainer}>
                    <Text style={styles.nameText}>
                        {place?.displayName?.text || ''}
                    </Text>
                    <TouchableOpacity 
                        style={styles.locationButton}
                        onPress={openGoogleMaps}
                    >
                        <FontAwesome name="location-arrow" size={40} color="#d0d5db" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.addressText}>
                    {place?.formattedAddress || ''}
                </Text>
                <Text style={styles.connectorText}>
                    Connectors: {place?.evChargeOptions?.connectorCount || 0} 
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 10,
        overflow: 'hidden',
        marginRight: 10,
        width: '100%',
    },
    topRow: {
        flexDirection: 'row',
        width: '100%',
    },
    imageContainer: {
        width: '50%',
        paddingRight: 10,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 80,
        resizeMode: 'cover',
    },
    nameContainer: {
        width: '50%',
        justifyContent: 'center',
        paddingLeft: 10,
    },
    nameText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#0a0a0a',
    },
    textContainer: {
        padding: 10,
        width: '100%',
    },
    addressText: {
        fontSize: 13,
        color: '#555',
        marginBottom: 4,
    },
    connectorText: {
        fontSize: 13,
        color: '#555',
        marginTop: 4,
    },
    locationButton: {
        backgroundColor: '#105a07',
        borderRadius: 100,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
    },
    favoriteButton: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "rgba(255,255,255,0.7)",
        borderRadius: 20,
        padding: 6,
        zIndex: 1,
    },
});