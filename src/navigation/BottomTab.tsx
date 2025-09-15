import React, { FC } from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

// Import stacks/screens
import DevicesStack from "@navigation/DevicesStack";
import QRScanner from "@screens/QRScanner";
import Profile from "@screens/Profile";

const Tab = createBottomTabNavigator();

const BottomTabs: FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 0.5,
          borderTopColor: "#ccc",
          height: 56,
        },
        tabBarIcon: ({ focused }) => {
          let iconName: string = "";

          if (route.name === "Devices") {
            iconName = "desktop-outline";
          } else if (route.name === "QRScanner") {
            iconName = "qr-code-outline";
          } else if (route.name === "Profile") {
            iconName = "person-outline";
          }

          return (
            <View
              style={{
                backgroundColor: focused ? "#f1f3f5" : "transparent",
                borderRadius: 25,
                width: 40,
                height: 40,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <Ionicons
                name={iconName}
                size={24}
                color={focused ? "#002B5B" : "#8e8e8e"}
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Devices" component={DevicesStack} />
      <Tab.Screen name="QRScanner" component={QRScanner} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default BottomTabs;
