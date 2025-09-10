import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import { navigationRef } from '@utils/NavigationUtils';
import SplashScreen from '@screens/SplashScreen';
import Login from '@screens/Login';
import Singnup from '@screens/Signup';


const Stack = createNativeStackNavigator();

const Navigation: FC = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ animation: 'fade' }}
        />
        <Stack.Screen
          name="Signup"
          component={Singnup}
          options={{ animation: 'fade' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
