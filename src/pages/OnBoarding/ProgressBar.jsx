import React from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const ProgressBar = ({ progress }) => {
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.progressBar, { width: `${progress}%` }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'center',
    height: 4,
    backgroundColor: '#f3f3f3',
    zIndex: 50,
    marginBottom: -25
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
});

export default ProgressBar;
