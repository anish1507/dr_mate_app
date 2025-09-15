import { MMKV } from 'react-native-mmkv';

// Initialize MMKV instance
export const storage = new MMKV();

// ✅ Get value
export const getLocalStorage = (key) => {
  const value = storage.getString(key);
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return value;
  }
};

// ✅ Set value
export const setLocalStorage = (key, value) => {
  if (typeof value === "object") {
    storage.set(key, JSON.stringify(value));
  } else {
    storage.set(key, String(value));
  }
};

// ✅ Remove specific key
export const removeLocalStorage = (key) => {
  storage.delete(key);
};

// ✅ Clear all storage
export const clearLocalStorage = () => {
  storage.clearAll();
};

// =========================== API CONSTANTS ================================

export const BASE_URL = 'https://v6p7akbiy9.execute-api.ap-south-1.amazonaws.com';
export const X_API_KEY = 'e30qTQDaGGdvp3k4yqHC6YgmkyRxEML4H8t5n8h5';

// =========================== Endpoints ================================

export const endPoint = {
  login: '/tst/login',
  signup: '/tst/signup',
  deviceList: '/tst/listDevices',
  setNumberUpdate: '/tst/setNumber',
  addDevice: '/tst/addDevice',
  deleteDevice: '/tst/deleteDevice',

  



};
