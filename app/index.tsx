

import { Text, View, ActivityIndicator } from "react-native";
import * as Location from 'expo-location';

import { useFonts } from "expo-font";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { useEffect  , useState } from "react";
import Login from "./App/Screen/LoginScreen/Login";

import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
import { NavigationContainer } from "@react-navigation/native";
import {UserLocationContext} from "./App/Context/UserLocationContext";
import TabNavigation from "./App/Navigations/TabNavigations";

SplashScreen.preventAutoHideAsync();

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export default function Index() {

  
  const [loaded, error] = useFonts({
    "Outfit-Regular": require("../assets/fonts/Outfit-Regular.ttf"),
    "Outfit-SemiBold": require("../assets/fonts/Outfit-SemiBold.ttf"),
    "Outfit-Bold": require("../assets/fonts/Outfit-Bold.ttf"),
  });


  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function getCurrentLocation() {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
      console.log(location);
    }

    getCurrentLocation();
  }, []);

  let text = 'Waiting...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  const onLayoutRootView = async () => {
    if (loaded) {
      await SplashScreen.hideAsync();
    }
  };

  if (!loaded && !error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ fontSize: 16, marginTop: 10 }}>Loading Fonts...</Text>
      </View>
    );
  }

  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={'pk_test_YXB0LW1vbmtmaXNoLTU3LmNsZXJrLmFjY291bnRzLmRldiQ'}
    >
      <UserLocationContext.Provider value={{location , setLocation}} >
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <SignedIn>
          <TabNavigation />
        </SignedIn>

        <SignedOut>
          <Login />
        </SignedOut>
      </View>

      </UserLocationContext.Provider>
    </ClerkProvider>
  );
}
