// components/LoadingOverlay.js
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const LoadingOverlay = () => {
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="#1D7CE4" />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
});

export default LoadingOverlay;
