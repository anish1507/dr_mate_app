import { View, StyleSheet, SafeAreaView, Animated, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
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
import CustomButton from '@components/ui/CustomButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { BASE_URL, endPoint, setLocalStorage, X_API_KEY } from '@utils/factory';

const bottomColors = [...lightColors].reverse();

const SignUp: FC = () => {
  const [fullName, setFullName] = useState('');
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

  // const handleSignUp = () => {
  //   setLoading(true);
  //   // Simulate sign-up process
  //   setTimeout(() => {
  //     setLoading(false);
  //     resetAndNavigate('Home');
  //   }, 1500);
  // };

    const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const handleSignUp = async () => {
  // ================= Validation ==================
  // if (!fullName.trim()) {
  //   Alert.alert("Validation Error", "Full Name is required.");
  //   return;
  // }

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
  if (password.length < 6) {
    Alert.alert("Validation Error", "Password must be at least 6 characters long.");
    return;
  }

  try {
    setLoading(true);

    const response = await axios.post(
      `${BASE_URL}${endPoint.signup}`,
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
      // Navigate to main app
       Alert.alert(
        "Signup Successful",
        "User created successfully!",
        [
          {
            text: "OK",
            onPress: () => resetAndNavigate("Login"), // go to login page
          },
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert("Signup Failed", "Signup failed");
    }
  } catch (error: any) {
    console.error("Signup error:", error);
    Alert.alert("Error",  "Something went wrong!");
  } finally {
    setLoading(false);
  }
};


  const handleBack = () => {
    // Navigate back to previous screen
    resetAndNavigate('Login');
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <CustomSafeAreaView>
          
              <View style={styles.subContainer}>
              {/* <LinearGradient colors={bottomColors} style={styles.gradient} /> */}
              <View style={styles.content}>
                
                 <View style={styles.titleContainer}>
                  <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                    <Ionicons name="chevron-back" size={RFValue(20)} color={Colors.white} />
                  </TouchableOpacity>
                  <CustomText style={styles.title}>Sign Up</CustomText>
                  {/* Empty view to balance the flex layout */}
                  <View style={styles.placeholder} />
                </View>
               
                
                <View style={styles.formContainer}>
                  {/* Full Name Section */}
                  <CustomText style={styles.sectionTitle}>Full Name</CustomText>
                  <CustomInput
                    placeholder="Name"
                    value={fullName}
                    onChangeText={setFullName}
                    textColor={Colors.white}
                    autoCapitalize="words"
                    left={<Ionicons name="person-outline" size={20} color="#ccc" />}
                  />

                  {/* Email Section */}
                  <CustomText style={styles.sectionTitle}>Email</CustomText>
                  <CustomInput
                    placeholder="Enter the email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    textColor={Colors.white}
                    autoCapitalize="none"
                    left={<Ionicons name="mail-outline" size={20} color="#ccc" />}
                  />

                  {/* Password Section */}
                  <CustomText style={styles.sectionTitle}>Password</CustomText>
                  <CustomInput
                    placeholder="Enter Your Password"
                    value={password}
                    onChangeText={setPassword}
                    textColor={Colors.white}
                    secureTextEntry
                    left={<Ionicons name="lock-closed-outline" size={20} color="#ccc" />}
                  />
                  
                 
                  
                  {/* Sign Up Button */}
                  <CustomButton
                    title="Sign Up"
                    onPress={handleSignUp}
                    loading={loading}
                    variant="secondary"
                    borderRadius={50} 
                    size="medium"
                    fullWidth
                    containerStyle={styles.sinupButton}
                  />
                  
                  {/* Login Redirect */}
                  <View style={styles.loginRedirect}>
                    <CustomText style={styles.loginText}>Already have an account? </CustomText>
                    <TouchableOpacity onPress={() => resetAndNavigate('Login')}>
                      <CustomText style={styles.loginLink}>Sign In</CustomText>
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
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  content: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: RFValue(20),
    paddingBottom: RFValue(20),
    backgroundColor: 'transparent',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: RFValue(30),
  },
  backButton: {
    padding: RFValue(8),
    marginTop:RFValue(48)
  },
  placeholder: {
    width: RFValue(36), // Same width as back button for balance
  },
  title: {
    fontSize: RFValue(18),
    fontFamily: Fonts.SemiBold,
    color: Colors.white,
    marginTop: RFValue(40),
    alignSelf: 'center',
  },
  formContainer: {
    width: '100%',
    paddingTop:RFValue(80)
  },
  sectionTitle: {
    fontSize: RFValue(12),
    fontFamily: Fonts.SemiBold,
    color: Colors.white,
    // marginBottom: RFValue(8),
    marginTop: RFValue(5),
  },
  sinupButton:{
    marginTop:RFValue(110)
  },
  loginRedirect: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: RFValue(20),
  },
  loginText: {
    fontFamily: Fonts.Regular,
    fontSize: RFValue(14),
    color: Colors.white,
  },
  loginLink: {
    fontFamily: Fonts.SemiBold,
    fontSize: RFValue(14),
    color: Colors.white,
  },
});

export default SignUp;