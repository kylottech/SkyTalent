// src/notifications/unregisterPush.js
import { ENDPOINT } from '../services/config';
import { getPushToken, removePushToken } from './pushStorage';

/**
 * Elimina el registro del dispositivo en backend y borra el pushToken local.
 * Requiere JWT para autorizar la operación.
 */
export async function unregisterDevice({ jwt }) {
  try {
    if (!jwt) return;

    const expoPushToken = await getPushToken();
    if (!expoPushToken) {
      await removePushToken();
      return;
    }

    const resp = await fetch(`${ENDPOINT}/devices/remove`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`,
      },
      body: JSON.stringify({ expoPushToken }),
    });

    if (!resp.ok) {
      const msg = await resp.text().catch(() => '');
      console.log('Fallo eliminando dispositivo:', resp.status, msg);
    }
  } catch (e) {
    console.log('Error unregisterDevice:', e?.message);
  } finally {
    await removePushToken();
  }
}
