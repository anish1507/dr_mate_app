import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  Switch,
  Alert,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Colors } from "@utils/Constants";
import axios from "axios";
import { BASE_URL, endPoint, getLocalStorage, X_API_KEY } from "@utils/factory";

const DeviceDialPad = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { device } = route.params || {};
  const [serial, setSerial] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [isConnected, setIsConnected] = useState(
    device?.status === "Connected"
  );
  const [loading, setLoading] = useState(false);

  const handlePress = (value: string) => {
    if (value === "back") {
      setSerial((prev) => prev.slice(0, -1));
    } else {
      setSerial((prev) => {
        const updated = (prev + value).slice(-2); // keep only last 2 digits
        return updated;
      });
    }
  };

  const handlePrevious = () => {
    setSerial((prev) => {
      const num = parseInt(prev || "0", 10);
      const newNum = num > 0 ? num - 1 : 0;
      return newNum.toString().padStart(2, "0"); // always 2 digits
    });
  };

  const handleNext = () => {
    setSerial((prev) => {
      const num = parseInt(prev || "0", 10);
      const newNum = num < 99 ? num + 1 : 99; // cap at 99
      return newNum.toString().padStart(2, "0"); // always 2 digits
    });
  };

  const handleUpdate = async () => {
    if (serial === "00" || serial === "") {
      Alert.alert("Validation Error", "Serial number cannot be 00.");
      return;
    }
     const email = await getLocalStorage("userEmail");
    const normalizedSerial = String(parseInt(serial, 10)); // remove leading zero
    setLoading(true);
    console.log("sdqdeedwd",device)
    try {
      const response = await axios.post(
        `${BASE_URL}${endPoint.setNumberUpdate}`,
        {
          email:email,
          deviceId: device?.deviceId, // maybe should be device?.id
          number: normalizedSerial,
        },
        {
          headers: {
            "x-api-key": X_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("asdwefewrfer",response.data)
      if (response.data) {
        Alert.alert("Success", "Device updated successfully.");
        // navigation.goBack();
      } else {
        Alert.alert("Update Failed", "Please try again.");
      }
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete Device
 const handleDeleteDevice = async () => {
  Alert.alert(
    "Delete Device",
    "Are you sure you want to delete this device?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
             const email = await getLocalStorage("userEmail");
            // Optional: show loader state if you want
            setLoading(true);

            const response = await axios.post(
              `${BASE_URL}${endPoint.deleteDevice}`,
              {
                email:email,
                deviceId: device?.deviceId, // Or device?.id if you have it
              },
              {
                headers: {
                  "x-api-key": X_API_KEY,
                  "Content-Type": "application/json",
                },
              }
            );

            if (response.data?.success) {
              Alert.alert("Deleted", "Device deleted successfully.");
              setShowSettings(false);
              navigation.goBack(); // go back after delete
            } else {
              Alert.alert("Failed", "Could not delete device. Please try again.");
            }
          } catch (error) {
            console.error("Delete error:", error);
            Alert.alert("Error", "Something went wrong while deleting.");
          } finally {
            setLoading(false);
          }
        },
      },
    ]
  );
};

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{device?.name || "Device"}</Text>
        <TouchableOpacity onPress={() => setShowSettings(true)}>
          <Ionicons name="settings-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Current Serial Number</Text>
      <Text style={styles.serialText}>{serial}</Text>

      {/* Dial Pad */}
      <View style={styles.dialPad}>
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "back"].map(
          (item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.key}
              onPress={() => handlePress(item)}
              disabled={loading}
            >
              {item === "back" ? (
                <Ionicons name="backspace-outline" size={22} color="#fff" />
              ) : (
                <Text style={styles.keyText}>{item}</Text>
              )}
            </TouchableOpacity>
          )
        )}
      </View>

      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={styles.outlineButton}
          onPress={handlePrevious}
          disabled={loading}
        >
          <Text style={styles.outlineText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNext}
          style={styles.outlineButton}
          disabled={loading}
        >
          <Text style={styles.outlineText}>Next</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleUpdate}
        style={[styles.updateButton, loading && { opacity: 0.6 }]}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.updateText}>Update</Text>
        )}
      </TouchableOpacity>

      {/* Settings Modal */}
      <Modal
        visible={showSettings}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSettings(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.popupCard}>
            {/* Header */}
            <View style={styles.popupHeader}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: Colors.primary_dark,
                    borderRadius: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 8,
                  }}
                >
                  <Ionicons
                    name="desktop-outline"
                    size={20}
                    color={Colors.white}
                  />
                </View>
                <View>
                  <Text style={styles.deviceName}>{device?.name}</Text>
                  <Text
                    style={[
                      styles.deviceStatus,
                      { color: isConnected ? "green" : "gray" },
                    ]}
                  >
                    {isConnected ? "Connected" : "Disconnected"}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setShowSettings(false)}>
                <Ionicons name="close" size={22} color="#002B5B" />
              </TouchableOpacity>
            </View>

            {/* Options */}
            <View style={styles.optionRow}>
              <Text style={styles.optionText}>Connect Device</Text>
              <Switch
                value={isConnected}
                onValueChange={setIsConnected}
                thumbColor={isConnected ? "#002B5B" : "#ccc"}
              />
            </View>

            <View style={styles.optionRow}>
              <Text style={styles.optionText}>Delete Device</Text>
              <TouchableOpacity onPress={handleDeleteDevice}>
                <Ionicons name="trash-outline" size={22} color="#002B5B" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#002B5B",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    marginTop: 1,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  label: {
    color: "#AFCBFF",
    fontSize: 14,
    textAlign: "center",
  },
  serialText: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 10,
  },
  dialPad: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 5,
  },
  key: {
    width: 60,
    height: 60,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    margin: 16,
  },
  keyText: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "600",
  },
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    // marginTop: "auto",
    marginTop:10
  },
  outlineButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fff",
    alignItems: "center",
  },
  outlineText: {
    color: "#fff",
    fontWeight: "600",
  },
  updateButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  updateText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  popupCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    width: "80%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  popupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 5,
    marginBottom: 16,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#002B5B",
  },
  deviceStatus: {
    fontSize: 14,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  optionText: {
    fontSize: 15,
    color: "#002B5B",
  },
});

export default DeviceDialPad;
