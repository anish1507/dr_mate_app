// ProfileScreen.tsx
import CustomInput from "@components/ui/CustomInput";
import { Colors } from "@utils/Constants";
import { storage } from "@utils/factory";
import { resetAndNavigate } from "@utils/NavigationUtils";
import React, { FC, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Ionicons from "react-native-vector-icons/Ionicons";

const Profile: FC = () => {
  const [name, setName] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("***************");
  const [showPassword, setShowPassword] = useState(false);

  // Load profile data from local storage
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedName = await storage.getString("userName");
        const storedEmail = await storage.getString("userEmail");
        const storedPassword = await storage.getString("userPassword");

        if (storedName) setName(storedName);
        if (storedEmail) setEmail(storedEmail);
        if (storedPassword) setPassword(storedPassword);
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    };
    loadProfile();
  }, []);

  // Handle Logout
  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            try {
              storage.clearAll(); // clear MMKV storage
              resetAndNavigate("Login"); // navigate back
            } catch (error) {
              console.error("Logout failed:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="chevron-back" size={24} color="#000" />
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: "https://i.ibb.co/4pDNDk1/avatar.png" }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editIcon}>
            <Ionicons name="pencil" size={16} color="#fff" />
          </TouchableOpacity>
          <View style={{ marginTop: 20 }}>
            <Text style={styles.userName}>{name}</Text>
            <Text style={styles.userEmail}>{email}</Text>
          </View>
        </View>

        {/* Name */}
        <CustomInput
          value={name}
          onChangeText={setName}
          backgroundColor={Colors.white}
          outlineColor={Colors.primary_dark}
          left={<Ionicons name="pencil" size={18} color={Colors.primary_light} />}
        />

        {/* Email */}
        <CustomInput
          value={email}
          editable={false}
          outlineColor={Colors.primary_dark}
          backgroundColor={Colors.white}
          left={<Ionicons name="mail-outline" size={18} color={Colors.primary_light} />}
        />

        {/* Password */}
        <CustomInput
          value={password}
          secureTextEntry={!showPassword}
          backgroundColor={Colors.white}
          outlineColor={Colors.primary_dark}
          onChangeText={setPassword}
          left={<Ionicons name="lock-closed-outline" size={18} color={Colors.primary_light} />}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color={Colors.primary_light}
          />
        </TouchableOpacity>

        {/* Change Password */}
        <TouchableOpacity>
          <Text style={styles.changePassword}>Change Password?</Text>
        </TouchableOpacity>

        {/* Update Button */}
        <TouchableOpacity style={styles.updateBtn}>
          <Text style={styles.updateText}>Update</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <View
            style={{
              backgroundColor: "#28a745",
              borderRadius: 50,
              width: 40,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="log-out-outline" size={25} color={Colors.white} />
          </View>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fbfd", paddingHorizontal: 10, paddingTop: 10 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 5 },
  headerTitle: { fontSize: 18, fontWeight: "600" },
  avatarContainer: { alignItems: "center", marginBottom: 25 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  editIcon: { backgroundColor: Colors.primary_dark, padding: 6, borderRadius: 20, position: "absolute", top: 85, right: 150 },
  userName: { fontSize: 18, fontWeight: "600", marginTop: 8 },
  userEmail: { fontSize: 14, color: "#666" },
  eyeIcon: { position: "absolute", right: 25, top: 405 },
  changePassword: { color: Colors.primary_dark, textAlign: "center", marginBottom: 20, fontSize: 14 },
  updateBtn: { backgroundColor: Colors.primary_light, paddingVertical: 14, borderRadius: 25, alignItems: "center", marginBottom: 20 },
  updateText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  logoutBtn: { backgroundColor: "#D5F0DE", paddingVertical: 15, borderRadius: 5, flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: 15, paddingLeft: 15 },
  logoutText: { color: "#28a745", fontSize: 16, marginLeft: 10, fontWeight: "600" },
});

export default Profile;
