import { View, StyleSheet, SafeAreaView, Animated, Image, ScrollView, TouchableOpacity,Alert } from 'react-native';
import React, { FC, useEffect, useRef, useState } from 'react';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import { Colors, Fonts, lightColors } from '@utils/Constants';
import CustomText from '@components/ui/CustomText';
import { RFValue } from 'react-native-responsive-fontsize';
import { resetAndNavigate } from '@utils/NavigationUtils';
import useKeyboardOffsetHeight from '@utils/useKeyboardOffsetHeight';
import LinearGradient from 'react-native-linear-gradient';
import CustomInput from '@components/ui/CustomInput';
import CustomButton from '@components/ui/CustomButton'; // Import the new component
import Ionicons from 'react-native-vector-icons/Ionicons';

import axios from "axios";
import { BASE_URL, endPoint, setLocalStorage, X_API_KEY } from '@utils/factory';
// import { BASE_URL, X_API_KEY, endPoint, setLocalStorage } from "/utils/storage"; // adjust path


const bottomColors = [...lightColors].reverse();

const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [gestureSequence, setGestureSequence] = useState<string[]>([]);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const keyboardOffsetHeight = useKeyboardOffsetHeight();

  // useEffect(() => {
  //   if (keyboardOffsetHeight == 0) {
  //     Animated.timing(animatedValue, {
  //       toValue: 0,
  //       duration: 500,
  //       useNativeDriver: true
  //     }).start();
  //   } else {
  //     Animated.timing(animatedValue, {
  //       toValue: -keyboardOffsetHeight * 0.84,
  //       duration: 500,
  //       useNativeDriver: true
  //     }).start();
  //   }
  // }, [keyboardOffsetHeight]);

  // const handleGesture = ({ nativeEvent }: any) => {
  //   if (nativeEvent.state === State.END) {
  //     const { translationX, translationY } = nativeEvent;
  //     let direction = '';
  //     if (Math.abs(translationX) > Math.abs(translationY)) {
  //       direction = translationX > 0 ? 'right' : 'left';
  //     } else {
  //       direction = translationY > 0 ? 'down' : 'up';
  //     }
  //     const newSequence = [...gestureSequence, direction].slice(-5);
  //     setGestureSequence(newSequence);
  //     if (newSequence.join(' ') === 'up up down left right') {
  //       setGestureSequence([]);
  //       resetAndNavigate('Login');
  //     }
  //   }
  // };

  const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const handleLogin = async () => {
  // ================= Validation ==================
  if (!email.trim()) {
    Alert.alert("Validation Error", "Email is required.");
    return;
  }
  if (!validateEmail(email)) {
    Alert.alert("Validation Error", "Please enter a valid email address.");
    return;
  }
  if (!password.trim()) {
    Alert.alert("Validation Error", "Password is required.");
    return;
  }
  // if (password.length < 6) {
  //   Alert.alert("Validation Error", "Password must be at least 6 characters long.");
  //   return;
  // }

  try {
    setLoading(true);

    const response = await axios.post(
      `${BASE_URL}${endPoint.login}`,
      { email, password },
      {
        headers: {
          "x-api-key": X_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("ddddwedwefw",response.data)
    if (response.data) {
      // Save user data or token in MMKV/AsyncStorage
      await setLocalStorage("userData", response.data);
      await setLocalStorage("userEmail", email);
      // Navigate to main app
      resetAndNavigate("MainApp");
    } else {
      Alert.alert("Login Failed", "Invalid credentials");
    }
  } catch (error: any) {
    console.error("Login error:", error);
    Alert.alert("Error",  "Something went wrong!");
  } finally {
    setLoading(false);
  }
};

  const handlePressSingup=()=>{
    resetAndNavigate('Signup');
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <CustomSafeAreaView>
          
              <View style={styles.subContainer}>
              <LinearGradient colors={bottomColors} style={styles.gradient} />
              <View style={styles.content}>
                <Image source={require('@assets/images/logo1.png')} style={styles.logo} />
                
              
                <View style={styles.loginContainer}>
                  <CustomInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    // keyboardType="email-address"
                    autoCapitalize="none"
                    textColor={Colors.white}
                    left={<Ionicons name="mail-outline" size={20} color="#ccc" />}
                  />

                  <CustomInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                     textColor={Colors.white}
                    secureTextEntry
                    left={<Ionicons name="lock-closed-outline" size={20} color="#ccc" />}
                  />
                  
                  <TouchableOpacity style={styles.forgotPassword}>
                    <CustomText style={styles.forgotPasswordText}>Forgot Password?</CustomText>
                  </TouchableOpacity>
                  
                  <CustomButton
                    title="Login"
                    onPress={handleLogin}
                    loading={loading}
                    variant="secondary"
                    size="medium"
                    fullWidth
                     borderRadius={50} 
                  />
                  
                  
                 <CustomButton
                    title="Continue with Google Account"
                    onPress={() => {}}
                    variant="outline"
                    size="medium"
                    fullWidth
                    leftImage={require('@assets/images/Google.png')}
                    borderRadius={50} // Slightly rounded corners for Google style
                    // leftIcon={<Ionicons name="logo-google" size={16} color="#DB4437" />} // Google brand color
                    containerStyle={styles.googleButton} // Additional styling
                    textStyle={styles.googleButtonText} // Text styling
                  />
                  
                  <View style={styles.signupContainer}>
                    <CustomText style={styles.signupText}>Don't have an account? </CustomText>
                    <TouchableOpacity onPress={handlePressSingup}>
                      <CustomText style={styles.signupLink}>Create Account</CustomText>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              </View>
            
        </CustomSafeAreaView>
      </View>
    </GestureHandlerRootView>
  );
};

// Keep the same styles as before, just replace TouchableOpacity with CustomButton
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  subContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  gradient: {
    // width: '100%',
    // height: '100%',
    // position: 'absolute',
  },
  content: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: RFValue(20),
    paddingBottom: RFValue(20),
    // backgroundColor: 'transparent',
  },
  logo: {
    marginTop: RFValue(70),
    marginBottom: RFValue(50),
    // width: RFValue(80),
    // height: RFValue(80),
    resizeMode: 'contain',
  },
  title: {
    fontSize: RFValue(24),
    fontFamily: Fonts.Bold,
    color: Colors.text,
    marginBottom: RFValue(8),
  },
  subtitle: {
    fontSize: RFValue(14),
    fontFamily: Fonts.Regular,
    color: Colors.text,
    marginBottom: RFValue(40),
    opacity: 0.8,
  },
  loginContainer: {
    width: '100%',
    paddingTop: RFValue(20),
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: RFValue(20),
  },
 googleButton: {
    marginTop:RFValue(20),
    borderColor: '#D0D5DD', // Light gray border similar to Google's design
    backgroundColor: 'white', // White background
  },
  googleButtonText: {
    color: Colors.primary, // Dark gray text
    fontWeight: '500',
  },
  forgotPasswordText: {
    fontSize: RFValue(10),
    fontFamily: Fonts.Regular,
    color: Colors.border,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: RFValue(20),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },

  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: RFValue(80),
  },
  signupText: {
    fontFamily: Fonts.Regular,
    fontSize: RFValue(14),
    color: Colors.white,
  },
  signupLink: {
    fontFamily: Fonts.SemiBold,
    fontSize: RFValue(14),
    color: Colors.white,
  },
});

export default Login;