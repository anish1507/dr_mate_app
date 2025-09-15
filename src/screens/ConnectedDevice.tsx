import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Text,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { FC, useEffect, useRef, useState, useCallback } from "react";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import CustomSafeAreaView from "@components/global/CustomSafeAreaView";
import { Colors } from "@utils/Constants";
import { RFValue } from "react-native-responsive-fontsize";
import useKeyboardOffsetHeight from "@utils/useKeyboardOffsetHeight";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, useFocusEffect } from "@react-navigation/native"; // ✅ added useFocusEffect
import axios from "axios";
import { BASE_URL, endPoint, getLocalStorage, X_API_KEY } from "@utils/factory";

const ConnectedDevice: FC = () => {
  const navigation = useNavigation<any>();
  const animatedValue = useRef(new Animated.Value(0)).current;
  const keyboardOffsetHeight = useKeyboardOffsetHeight();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [devices, setDevices] = useState<any[]>([]);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: keyboardOffsetHeight === 0 ? 0 : -keyboardOffsetHeight * 0.84,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [keyboardOffsetHeight]);

  // ✅ Tab focus refresh
  useFocusEffect(
    useCallback(() => {
      loadDevices();
    }, [])
  );

  // ...
  const loadDevices = async () => {
    const email = await getLocalStorage("userEmail");
    console.log("EMAIL:::", email);
    try {
      setLoading(true);
      const response = await axios.post(
        `${BASE_URL}${endPoint.deviceList}`,
        { email: email },
        {
          headers: {
            "x-api-key": X_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("API Response:", response?.data);
      if (response.data) {
        setTimeout(()=>{
           let deviceData = response?.data?.devices;
        const transformed = deviceData.map(
          (deviceId: string, index: number) => ({
            id: (index + 1).toString(),
            name: `Device-${deviceId}`,
            deviceId:deviceId,
            status: index % 2 === 0 ? "Connected" : "Disconnected",
          })
        );
        setDevices(transformed);
        setLoading(false);
        setRefreshing(false);
        },1000)
       
      } else {
        setDevices([]);
        setLoading(false);
      setRefreshing(false);
      }
    } catch (error: any) {
      console.error("Failed to load devices:", error);
      setDevices([]);
      setLoading(false);
      setRefreshing(false);
    } finally {
      // setLoading(false);
      // setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDevices();
  };

  const handlePressQRScanner = () => {
    navigation.navigate("QRScanner");
  };

  const handleDeviceDialPad = (device: any) => {
    navigation.navigate("DeviceDialPad", { device });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Connected":
        return "green";
      case "Disconnected":
        return "gray";
      default:
        return "black";
    }
  };

  const renderDevice = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => handleDeviceDialPad(item)}
      style={styles.card}
    >
      <View style={styles.deviceRow}>
        <View style={styles.iconContainer}>
          <Ionicons name="desktop-outline" size={22} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.deviceName}>{item.name}</Text>
          <Text
            style={[styles.deviceStatus, { color: getStatusColor(item.status) }]}
          >
            {item.status}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#002B5B" />
      </View>
    </TouchableOpacity>
  );

  const renderSkeleton = () =>
    [1, 2, 3].map((idx) => (
      <View key={idx} style={styles.card}>
        <View style={styles.deviceRow}>
          <View style={styles.skeletonIcon} />
          <View style={{ flex: 1 }}>
            <View style={styles.skeletonLineShort} />
            <View style={styles.skeletonLineLong} />
          </View>
          <View style={styles.skeletonChevron} />
        </View>
      </View>
    ));

  return (
    <GestureHandlerRootView>
      <CustomSafeAreaView>
        <PanGestureHandler>
          <Animated.ScrollView
            bounces={false}
            keyboardDismissMode={"on-drag"}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.container}>
              <View style={styles.headerRow}>
                <Text style={styles.headerText}>Connected Devices</Text>
                <TouchableOpacity
                  onPress={handlePressQRScanner}
                  style={styles.addIconButton}
                >
                  <Ionicons name="add" size={22} color="#fff" />
                </TouchableOpacity>
              </View>

              {loading ? (
                renderSkeleton()
              ) : devices.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Ionicons name="desktop-outline" size={80} color="#002B5B" />
                  <Text style={styles.emptyText}>No Devices Connected</Text>
                  <TouchableOpacity
                    onPress={handlePressQRScanner}
                    style={styles.addButton}
                  >
                    <Text style={styles.addButtonText}>+ Add New Device</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <FlatList
                  data={devices}
                  keyExtractor={(item) => item.id}
                  renderItem={renderDevice}
                  contentContainerStyle={{ paddingBottom: 20 }}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                      colors={[Colors.primary]}
                      tintColor={Colors.primary}
                    />
                  }
                />
              )}
            </View>
          </Animated.ScrollView>
        </PanGestureHandler>
      </CustomSafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white_light,
    paddingHorizontal: RFValue(16),
    paddingTop: RFValue(20),
    height: RFValue(680),
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: RFValue(15),
  },
  headerText: {
    fontSize: RFValue(18),
    fontWeight: "600",
    color: Colors.primary,
  },
  addIconButton: {
    backgroundColor: Colors.primary,
    borderRadius: RFValue(20),
    padding: RFValue(6),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: RFValue(10),
    padding: RFValue(12),
    marginBottom: RFValue(12),
    shadowColor: Colors.black,
    shadowOpacity: 0.1,
    shadowRadius: RFValue(4),
    elevation: RFValue(3),
  },
  deviceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    backgroundColor: Colors.primary,
    borderRadius: RFValue(30),
    padding: RFValue(10),
    marginRight: RFValue(12),
  },
  deviceName: {
    fontSize: RFValue(14),
    fontWeight: "600",
    color: Colors.primary,
  },
  deviceStatus: {
    fontSize: RFValue(13),
    marginTop: RFValue(2),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6F8FC",
    padding: RFValue(20),
  },
  emptyText: {
    marginTop: RFValue(12),
    fontSize: RFValue(16),
    color: "#333",
    fontWeight: "500",
  },
  addButton: {
    marginTop: RFValue(20),
    backgroundColor: "#002B5B",
    borderRadius: RFValue(25),
    paddingVertical: RFValue(10),
    paddingHorizontal: RFValue(20),
  },
  addButtonText: {
    color: "#fff",
    fontSize: RFValue(14),
    fontWeight: "600",
  },

  // Skeleton styles
  skeletonIcon: {
    width: RFValue(40),
    height: RFValue(40),
    borderRadius: RFValue(20),
    backgroundColor: "#E0E0E0",
    marginRight: RFValue(12),
  },
  skeletonLineShort: {
    width: "60%",
    height: RFValue(12),
    borderRadius: 4,
    backgroundColor: "#E0E0E0",
    marginBottom: RFValue(6),
  },
  skeletonLineLong: {
    width: "40%",
    height: RFValue(10),
    borderRadius: 4,
    backgroundColor: "#E0E0E0",
  },
  skeletonChevron: {
    width: RFValue(12),
    height: RFValue(20),
    borderRadius: 4,
    backgroundColor: "#E0E0E0",
    marginLeft: RFValue(12),
  },
});

export default ConnectedDevice;
