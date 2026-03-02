// src/notifications/registerPush.js
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { ENDPOINT } from '../services/config';
import { savePushToken, getPushToken } from './pushStorage';

// Handler: mostrar notis también en foreground (ajústalo a tu UX)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Obtiene (si hace falta) el ExpoPushToken del dispositivo.
 * Devuelve el token o null.
 */
export async function getOrCreateExpoPushToken() {
  if (!Device.isDevice) {
    console.log('Push solo funciona en dispositivos reales');
    return null;
  }

  // Permisos
  const { status: existing } = await Notifications.getPermissionsAsync();
  let status = existing;
  if (existing !== 'granted') {
    const req = await Notifications.requestPermissionsAsync();
    status = req.status;
  }
  if (status !== 'granted') {
    console.log('Permiso de notificaciones denegado');
    return null;
  }

  // Necesario en EAS Dev/Build
  const projectId =
    (Constants.expoConfig?.extra && Constants.expoConfig.extra.eas?.projectId) ||
    (Constants.easConfig && Constants.easConfig.projectId);

  const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
  const expoPushToken = tokenData.data;

  // Android: crear canal antes de usarlo
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'General',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  await savePushToken(expoPushToken);
  console.log('ExpoPushToken:', expoPushToken);
  return expoPushToken;
}

/**
 * Asegura que el dispositivo quede registrado/actualizado en el backend.
 * - Requiere JWT (usuario logueado) e idioma actual.
 * - Si no hay pushToken en cache, lo crea.
 */
export async function ensureDeviceRegistered({ language, jwt, userId = null }) {
  try {
    console.log(language + ' ' + jwt + ' ' + userId)
    if (!jwt) return null;

    let expoPushToken = await getPushToken();
    if (!expoPushToken) {
      expoPushToken = await getOrCreateExpoPushToken();
    }
    if (!expoPushToken) return null;

    // Envía token + idioma al backend (con auth)
    const resp = await fetch(`${ENDPOINT}/devices/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`,
        },
        body: JSON.stringify({
            expoPushToken,
            language: language || 'Spanish',
            platform: Platform.OS,
            userId,
        }),
    })

    if (!resp.ok) {
      const msg = await resp.text().catch(() => '');
      console.log('Fallo registrando dispositivo:', resp.status, msg);
    }
    console.log('ExpoPushToken:', expoPushToken);
    return expoPushToken;
  } catch (e) {
    console.log('Error ensureDeviceRegistered:', e?.message);
    return null;
  }
}
