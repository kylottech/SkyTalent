import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

let pendingNav = null;
export function navigate(name, params) {
  if (navigationRef.isReady()) navigationRef.navigate(name, params);
  else pendingNav = { name, params };
}
export function flushPendingNav() {
  if (pendingNav && navigationRef.isReady()) {
    navigationRef.navigate(pendingNav.name, pendingNav.params);
    pendingNav = null;
  }
}
