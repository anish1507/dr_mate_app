import { View, StyleSheet, SafeAreaView, Animated, Image } from 'react-native';
import React, { FC, useEffect, useRef, useState } from 'react';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import { Colors, Fonts, lightColors } from '@utils/Constants';
import CustomText from '@components/ui/CustomText';
import { RFValue } from 'react-native-responsive-fontsize';
import { resetAndNavigate } from '@utils/NavigationUtils';
import useKeyboardOffsetHeight from '@utils/useKeyboardOffsetHeight';
import LinearGradient from 'react-native-linear-gradient'

const bottomColors=[...lightColors].reverse()

const Singnup: FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [gestureSequence, setGestureSequence] = useState<string[]>([]);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const keyboardOffsetHeight = useKeyboardOffsetHeight();


  useEffect(()=>{
    if(keyboardOffsetHeight==0){
    Animated.timing(animatedValue,{
        toValue:0,
        duration:500,
        useNativeDriver:true
      }).start()
    }else{
      
        Animated.timing(animatedValue,{
        toValue:-keyboardOffsetHeight * 0.84,
        duration:500,
        useNativeDriver:true
      }).start()
    }

  },[keyboardOffsetHeight])

  const handleGesture = ({ nativeEvent }: any) => {
    if (nativeEvent.state === State.END) {
      const { translationX, translationY } = nativeEvent;
      let direction = '';
      if (Math.abs(translationX) > Math.abs(translationY)) {
        direction = translationX > 0 ? 'right' : 'left';
      } else {
        direction = translationY > 0 ? 'down' : 'up';
      }
      const newSequence = [...gestureSequence, direction].slice(-5);
      setGestureSequence(newSequence);
      if (newSequence.join(' ') === 'up up down left right') {
        setGestureSequence([]);
        resetAndNavigate('DeliveryLogin');
      }
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <CustomSafeAreaView>
          <PanGestureHandler onHandlerStateChange={handleGesture}>
            <Animated.ScrollView
              bounces={false}
              keyboardDismissMode={'on-drag'}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.subContainer}
            >
             <LinearGradient colors={bottomColors} style={styles.gradient} />
             <View style={styles.content}>
                  <Image source={require('@assets/images/logo.jpeg')} style={styles.logo} />
                  <CustomText variant='h2' fontFamily={Fonts.Bold}>Grocery Delivery APP</CustomText>
                  <CustomText variant='h5' fontFamily={Fonts.SemiBold}>Log in Or Sign up</CustomText>
             </View>
            </Animated.ScrollView>
          </PanGestureHandler>
        </CustomSafeAreaView>

        <View style={styles.footer}>
          <SafeAreaView />
          <CustomText fontSize={RFValue(6)}>
            By Continuing, you agree to our Terms of Service and Privacy Policy
          </CustomText>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text:{
    marginTop:2,
    marginBottom:25,
    opacity:0.8,
  },
  logo:{
      width:50,
      height:50,
      borderRadius:20,
      marginVertical:10,
  },
  subContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
  footer: {
    borderTopWidth: 0.8,
    borderTopColor: Colors.border,
    paddingBottom: 10,
    zIndex: 22,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#f8f9fc',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient:{
    paddingTop:60,
    width:'100%',
  },
  content:{
    width:'100%',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'white',
    paddingHorizontal:20,
    paddingBottom:20,
    // backgroundColor:'red'
  },
  
});

export default Singnup;