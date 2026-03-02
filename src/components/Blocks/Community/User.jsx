import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const User = ({ profileImage, username, fullName, _id, onPress }) => {
  const navigate = useNavigation()


  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        if (onPress) {
          onPress(); // Ejecuta el callback externo si existe
        } else {
          navigate.navigate('OtroPerfil', { userId: _id }); // Comportamiento por defecto
        }
      }}
    >

      <Image source={{ uri: profileImage }} style={styles.profileImage} />

      <View style={styles.userInfo}>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.fullName}>{fullName}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 13,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  username: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  fullName: {
    fontSize: 12,
  },
  buttonContainer: {
    width: '30%',
    overflow: 'hidden',  
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '400',
  },
});

export default User;
