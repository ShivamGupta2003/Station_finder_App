

import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ToastAndroid,
} from "react-native";
import React from "react";
import GlobalApi from "../../Utlis/GlobalApi";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";
import { app } from "../../Utlis/FirebaseConfig";

export default function FavoriteItem({ place, onRemove }) {
  const { user } = useUser();
  const db = getFirestore(app);
  const PLACE_PHOTO = "https://places.googleapis.com/v1/";

  const removeFromFavorites = async () => {
    try {
      if (!user?.id || !place?.id) return;

      const docId = `${user.id}_${place.id}`;
      const favoriteRef = doc(db, "ev-favorites", docId);
      await deleteDoc(favoriteRef);

      onRemove(docId); // Update local state in parent
      ToastAndroid.show("Removed from favorites", ToastAndroid.SHORT);
    } catch (error) {
      console.error("Error removing favorite:", error);
      ToastAndroid.show("Failed to remove from favorites", ToastAndroid.SHORT);
    }
  };

  const openGoogleMaps = () => {
    if (!place?.location?.latitude || !place?.location?.longitude) return;

    const url = `https://www.google.com/maps/search/?api=1&query=${place.location.latitude},${place.location.longitude}`;
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Can't open URL: " + url);
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={
            place.photos && place.photos[0]
              ? {
                  uri: `${PLACE_PHOTO}${place.photos[0]?.name}/media?key=${GlobalApi.API_KEY}&maxHeightPx=300&maxWidthPx=600`,
                }
              : require("./../../../../assets/images/evman.png")
          }
          style={styles.image}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={removeFromFavorites}
        >
          <Ionicons name="heart" size={24} color="#ff4444" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {place.displayName?.text || "Unnamed Place"}
          </Text>
          <Text style={styles.address} numberOfLines={2}>
            {place.formattedAddress || "No address available"}
          </Text>
          <View style={styles.detailsRow}>
            <Text style={styles.connectors}>
              Connectors: {place?.evChargeOptions?.connectorCount || 0}
            </Text>
            <TouchableOpacity style={styles.mapButton} onPress={openGoogleMaps}>
              <FontAwesome name="map-marker" size={16} color="#105a07" />
              <Text style={styles.mapText}>Open Map</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    width: "100%",
    height: 150,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  favoriteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 20,
    padding: 6,
  },
  content: {
    padding: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
    color: "#333",
  },
  address: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  connectors: {
    fontSize: 14,
    color: "#105a07",
    fontWeight: "500",
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: "#e8f5e9",
    borderRadius: 16,
  },
  mapText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#105a07",
  },
});
