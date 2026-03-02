import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from "../../context/useUser";

const UserCard = ({ profileImage, username, fullName, action }) => {
  const { texts }=useUser()
  const screenTexts = texts.components.user.UserCard


  return (
    <View style={styles.container}>

      <Image source={{ uri: profileImage }} style={styles.profileImage} />

      <View style={styles.userInfo}>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.fullName}>{fullName}</Text>
      </View>

      <TouchableOpacity style={styles.buttonContainer} onPress={action}>
        <LinearGradient 
            colors={['#1D7CE4', '#004999']} 
            start={{ x: 1, y: 0 }} 
            end={{ x: 0, y: 0 }} 
            style={styles.button}
        >
            <Text style={styles.buttonText}>{screenTexts.SendTouchable}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 8,
    borderRadius: 0,
    marginVertical: 2,
    backgroundColor: 'transparent',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 13,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  username: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  fullName: {
    fontSize: 11,
    color: '#666',
  },
  buttonContainer: {
    width: '25%',
    overflow: 'hidden',  
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '400',
  },
});

export default UserCard;
