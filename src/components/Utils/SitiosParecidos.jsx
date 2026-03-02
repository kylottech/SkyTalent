import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { useUser } from "../../context/useUser";

const SitiosParecidos = ({ backgroundImage, profileImage }) => {
    const { texts }=useUser()
    const screenTexts = texts.components.Utils.SitiosParecidos


  return (
    <View style={styles.container}>
      <Image source={{ uri: backgroundImage }} style={styles.backgroundImage} />

      <View style={styles.friendTextContainer}>
        <Text style={styles.friendText}>{screenTexts.FriendText}</Text>
      </View>

      <Image source={{ uri: profileImage }} style={styles.profileImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 240,
    borderRadius: 15,
    overflow: 'hidden', 
    position: 'relative', 
    backgroundColor: 'white', 
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: 15, 
  },
  friendTextContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#B5A363',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 15,
  },
  friendText: {
    fontSize: 11,
    color: 'white',
    fontWeight: '700',
  },
  profileImage: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    width: 50,
    height: 50,
    borderRadius: 25, 
  },
});

export default SitiosParecidos;
