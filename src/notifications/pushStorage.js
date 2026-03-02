// src/notifications/pushStorage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'expoPushToken';

export async function savePushToken(token) {
  try {
    if (token) await AsyncStorage.setItem(KEY, token);
  } catch (e) {
    // noop
  }
}

export async function getPushToken() {
  try {
    return await AsyncStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export async function removePushToken() {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch {
    // noop
  }
}
