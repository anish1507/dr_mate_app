import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Camera, useCameraDevice, useCodeScanner } from "react-native-vision-camera";
import Ionicons from "react-native-vector-icons/Ionicons";
import { resetAndNavigate } from "@utils/NavigationUtils";
import axios from "axios";
import { BASE_URL, endPoint, getLocalStorage, X_API_KEY } from "@utils/factory";

const QRScanner = () => {
  const device = useCameraDevice("back");
  const [hasPermission, setHasPermission] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [scannedDeviceId, setScannedDeviceId] = useState<{ deviceId: string; secret: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Ask for camera permission
  useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === "android") {
        const status = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
        setHasPermission(status === PermissionsAndroid.RESULTS.GRANTED);
      } else {
        const status = await Camera.requestCameraPermission();
        setHasPermission(status === "granted");
      }
    };
    requestPermission();
  }, []);

  // Setup QR + Barcode scanner
  const codeScanner = useCodeScanner({
    codeTypes: ["qr", "ean-13"],
    onCodeScanned: (codes) => {
      if (codes.length > 0 && !scannedDeviceId) {
        const value = codes[0].value ?? "";

        try {
          // Attempt to parse QR code value as JSON
          const parsedValue = JSON.parse(value);

          if (parsedValue.deviceId && parsedValue.secret) {
            setScannedDeviceId(parsedValue); // Show popup with device ID
          } else {
            Alert.alert("This QR cannot be scanned");
          }
        } catch (e) {
          // If not valid JSON, show error
          Alert.alert("This QR cannot be scanned");
        }
      }
    },
  });

  const handleAddDevice = async () => {
    if (!scannedDeviceId) return;
    const email = await getLocalStorage("userEmail");
    setLoading(true);
    try {
      const payload = {
        email: email,
        deviceId: scannedDeviceId.deviceId,
        secret: scannedDeviceId.secret,
      };

      await axios.post(`${BASE_URL}${endPoint.addDevice}`, payload, {
        headers: {
          "x-api-key": X_API_KEY,
          "Content-Type": "application/json",
        },
      });

      setScannedDeviceId(null);
      resetAndNavigate("Devices");
    } catch (error) {
      console.error(error);
      Alert.alert("Failed to add device");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    resetAndNavigate("Devices");
  };

  if (device == null) return <Text>No camera found</Text>;
  if (!hasPermission) return <Text>No camera permission</Text>;

  return (
    <View style={styles.container}>
      {/* Camera background */}
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
        torch={torchOn ? "on" : "off"}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scanner</Text>
        <TouchableOpacity>
          <Ionicons name="help-circle-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Instructions */}
      <View style={styles.instructionContainer}>
        <Text style={styles.instructionTitle}>Scan Your Device</Text>
        <Text style={styles.instructionSub}>
          Point your camera at the QR code on your device
        </Text>
      </View>

      {/* QR Scan Frame */}
      <View style={styles.scanFrame} />

      {/* Flashlight Button */}
      <TouchableOpacity
        style={styles.flashButton}
        onPress={() => setTorchOn((prev) => !prev)}
      >
        <Ionicons
          name={torchOn ? "flashlight" : "flashlight-outline"}
          size={20}
          color="#fff"
        />
        <Text style={styles.flashText}>Flashlight</Text>
      </TouchableOpacity>

      {/* Device ID Popup */}
      <Modal
        visible={!!scannedDeviceId}
        transparent
        animationType="fade"
        onRequestClose={() => setScannedDeviceId(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Device Scanned</Text>
            <Text style={styles.modalDeviceId}>
              {scannedDeviceId?.deviceId}
            </Text>

            {/* Buttons in a single row */}
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[styles.modalButton, { flex: 1, marginRight: 5 }]}
                onPress={handleAddDevice}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.modalButtonText}>OK</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancel, { flex: 1, marginLeft: 5 }]}
                onPress={() => setScannedDeviceId(null)}
                disabled={loading}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Overlay Spinner */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Adding device...</Text>
        </View>
      )}
    </View>
  );
};

export default QRScanner;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  header: {
    marginTop: 50,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },
  instructionContainer: { marginTop: 30, alignItems: "center" },
  instructionTitle: { color: "#fff", fontSize: 20, fontWeight: "700" },
  instructionSub: { color: "#ddd", fontSize: 14, marginTop: 4 },
  scanFrame: {
    alignSelf: "center",
    marginTop: 50,
    width: 220,
    height: 220,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: "white",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  flashButton: {
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  flashText: { color: "#fff", fontSize: 14, marginLeft: 6 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 300,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  modalDeviceId: { fontSize: 16, marginBottom: 20, color: "#333" },
  modalButtonRow: {
    flexDirection: "row",
    width: "100%",
    marginTop: 10,
  },
  modalButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  modalCancel: { backgroundColor: "#aaa" },
  modalButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 16,
  },
});
