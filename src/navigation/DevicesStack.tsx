import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ConnectedDevice from "@screens/ConnectedDevice";
import DeviceDialPad from "@screens/DeviceDialPad";

const Stack = createNativeStackNavigator();

const DevicesStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ConnectedDevice" component={ConnectedDevice} />
      <Stack.Screen name="DeviceDialPad" component={DeviceDialPad} />
    </Stack.Navigator>
  );
};

export default DevicesStack;
