import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function FollowerItem({ name, imageUrl, onPress }) {
  return (
    <TouchableOpacity style={styles.avatarItem} onPress={onPress}>
      <Image 
        source={{ uri: imageUrl }} 
        style={styles.avatar} 
      />
      <Text style={styles.avatarName}>{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  avatarItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginBottom: 6,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  avatarName: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
});
