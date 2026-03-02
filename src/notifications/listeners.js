import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from 'react';
import { navigate, flushPendingNav } from '../navigation/navigationRef';

export function useNotificationListeners() {
  const receivedSub = useRef();
  const responseSub = useRef();

  useEffect(() => {
    // Si necesitas reaccionar cuando llega en foreground
    receivedSub.current = Notifications.addNotificationReceivedListener(() => {});

    // Cuando el usuario toca la notificación (foreground/background/cold)
    responseSub.current = Notifications.addNotificationResponseReceivedListener(async (resp) => {
      const data = resp?.notification?.request?.content?.data || {};
      if (data?.screen) {
        navigate(data.screen, data.params || {});
        flushPendingNav();
      }
    });

    // Arranque en frío por notificación
    (async () => {
      const last = await Notifications.getLastNotificationResponseAsync();
      const data = last?.notification?.request?.content?.data;
      if (data?.screen) {
        navigate(data.screen, data.params || {});
        flushPendingNav();
      }
    })();

    return () => {
      if (receivedSub.current) Notifications.removeNotificationSubscription(receivedSub.current);
      if (responseSub.current) Notifications.removeNotificationSubscription(responseSub.current);
    };
  }, []);
}
