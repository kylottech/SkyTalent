import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

const ProfileHeader = ({ userInfo }) => {
  return (
  <View style={styles.container}>
    <Image
      source={{ uri: userInfo.avatar}}
      style={styles.image}
    />
    <View style={styles.textContainer}>
      <Text style={styles.name}>{userInfo.name}</Text>
      <Text style={styles.userId}>{userInfo.kylotId}</Text>
    </View>
  </View>
)};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'white'
  },
  textContainer: {
    flex: 1
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4
  },
  userId: {
    fontSize: 14,
    color: '#6B7280'
  }
});

export default ProfileHeader;