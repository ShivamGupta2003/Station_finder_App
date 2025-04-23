import { View, Image, StyleSheet , Text, TouchableOpacity  } from 'react-native';
import React from 'react';
 import Colors from '../../Utlis/Colors';

 import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser';
import { useWarmUpBrowser } from '../../../../hooks/warmUpBrowser';
import { useSSO } from '@clerk/clerk-expo';

import  { useCallback, useEffect } from 'react'

 WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  useWarmUpBrowser();

  const { startSSOFlow } = useSSO()
  const onPress = async () => {
    try {
      // Start the authentication process by calling `startSSOFlow()`
      const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
        strategy: 'oauth_google',
        // For web, defaults to current path
        // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
        // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
        redirectUrl: AuthSession.makeRedirectUri(),
      })

      // If sign in was successful, set the active session
      if (createdSessionId) {
        setActive!({ session: createdSessionId })
      } else {
        // If there is no `createdSessionId`,
        // there are missing requirements, such as MFA
        // Use the `signIn` or `signUp` returned from `startSSOFlow`
        // to handle next steps
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }


  return (
    <View style ={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 50, }}>
      <Image 
        source={require('../../../../assets/images/ev.png')} 
        style={styles.logoImage} 
      />
      <Image 
        source={require('../../../../assets/images/evman.png')} 
        style={styles.bgImage}
      />
      <View style={{ padding: 20 }}>
        <Text  style={styles.heading}> Welcome to EV Station Finder App</Text>
        <Text style={styles.desc} >Find EV charging station near you , plan trip and so much more in just one click .</Text>
        <TouchableOpacity  style={styles.button} 
        onPress={onPress}>
          <Text style={{color: Colors.WHITE}}> Login With Google  </Text>
        </TouchableOpacity>
        </View>

       

    </View>
  );
}

const styles = StyleSheet.create({
  logoImage: {
    width: 200,
    height: 100,
   
    
    resizeMode: 'contain',
  },
  bgImage: {  
    width: '100%',
    height: 195,
    marginTop: 20,
   objectFit: 'cover',
  },
  heading : {
     fontFamily: 'Outfit-Bold',
      fontSize: 25,
      marginTop: 15,
      textAlign: 'center',

      
  },

  desc: {
    fontFamily: 'Outfit-Regular',
    fontSize: 16,
    marginTop: 5,
    textAlign: 'center',
    color:Colors.BLACK ,
  },

  button: {
    backgroundColor: Colors.PRIMARY,
    padding: 16,
    marginTop: 50,
    borderWidth: 1,
    borderRadius:99,
    justifyContent: 'center',
    alignItems: 'center',
    width: 300, 
  },
  

});
