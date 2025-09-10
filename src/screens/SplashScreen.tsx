import { View, Text, StyleSheet, Image } from 'react-native'
import React, { FC, useEffect } from 'react'
import { Colors } from '@utils/Constants'
import { screenHeight, screenWidth } from '@utils/Scaling'
import Logo from '@assets/images/logo1.png';
import { navigate } from '@utils/NavigationUtils';

const SplashScreen:FC = () => {

    useEffect(()=>{
        const navigateUser=()=>{
            try {
                navigate("Login")
            } catch (error) {
                
            }
        }
        const timeoutId=setTimeout(navigateUser,1000)
    },[])

  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logoImage} />
    </View>
  )
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:Colors.primary,
        justifyContent:"center",
        alignItems:"center"
    },
    logoImage:{
        height:screenHeight * 0.7,
        width:screenWidth * 0.7,
        resizeMode:"contain"
    }
})

export default SplashScreen

