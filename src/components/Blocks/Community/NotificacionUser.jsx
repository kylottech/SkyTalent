import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useUser } from "../../../context/useUser";
import { LinearGradient } from 'expo-linear-gradient';
import { acept, reject } from '../../../services/communityServices';
import { moreFollow, lessFollow } from '../../../services/profileService';

const NotificacionUser = ({ imagen, nombre, usuario, notificacion, userId, comunidadId, lista, friend, me, setError, setErrorMessage }) => {
  const navigation = useNavigation(); 
  const { logout, texts }=useUser()
  const screenTexts = texts.components.Blocks.Community.NotificacionUser
  const [visible, setVisible] = useState(true);
  const [list, setList] = useState(false);
  const [amigo, setAmigo] = useState(false);
  const [yo, setYo] = useState(false);
  const [_id, setId] = useState();

  const handleAcept = async ({userId, communityId }) => {
    try {
      acept(userId= userId, communityId= communityId, logout)
        .then(() => {
          
        })
        .catch((error) => {
          setError(true);
          setErrorMessage(error.message);
        });
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
    }

  }

  const handleReject = async ({userId, communityId }) => {
    try {
      reject(userId= userId, communityId= communityId, logout)
        .then(() => {
          
        })
        .catch((error) => {
          setError(true);
          setErrorMessage(error.message);
        });
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
    }

  }

  const handleMoreFollow = async (userId) => {
    try {
      moreFollow(userId, logout)
        .then(() => {
          
        })
        .catch((error) => {
          setError(true);
          setErrorMessage(error.message);
        });
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
    }
  
  };

  const handleLessFollow = async (userId) => {
    try {
      
      lessFollow(userId, logout)
        .then(() => {

        })
        .catch((error) => {
          setError(true);
          setErrorMessage(error.message);
        });
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
    }
  
  };

  const handlePress = () => {
    if(yo){
      navigation.navigate('Perfil');
    }
    else {
      navigation.navigate('OtroPerfil', {userId: userId}); 
    }
    
  }

  const handleAceptar = () => {
    handleAcept({userId: userId, communityId: comunidadId})
    setVisible(false)
  }

  const handleRechazar = () => {
    handleReject({userId: userId, communityId: comunidadId})
    setVisible(false)
  }

  const handleFollow = () => {
    if(!amigo){
      handleMoreFollow(userId)
    }
    else{
      handleLessFollow(userId)
    }
    setAmigo(!amigo)
    
  };

  useEffect(() => {
    setVisible(notificacion)
  },[]);

  useEffect(() => {
    setList(lista)
    setAmigo(friend)
    setYo(me)
    setId(userId)
  },[]);
  
  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.userInfo}>
        <Image source={{ uri: imagen }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.nombre}>{nombre}</Text>
          <Text style={styles.usuario}>@{usuario}</Text>
        </View>
      </View>

      {visible && (
        <View style={styles.buttonsContainer}>
          <LinearGradient
            colors={['#004999', '#1D7CE4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.acceptButton}
          >
            <TouchableOpacity style={styles.button} onPress={handleAceptar}>
              <Text style={styles.buttonText}>{screenTexts.AcceptUserTouchable}</Text>
            </TouchableOpacity>
          </LinearGradient>

          <TouchableOpacity style={styles.rejectButton} onPress={handleRechazar}>
            <Text style={styles.rejectButtonText}>{screenTexts.RejectUserTouchable}</Text>
          </TouchableOpacity>
        </View>
      )}

      {(list && !yo) && (
        <>
          {!amigo ? (
            <LinearGradient
              colors={['#004999', '#1D7CE4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.followButton}
            >
              <TouchableOpacity style={styles.followButtonInner} onPress={handleFollow}>
                <Text style={styles.followButtonText}>{screenTexts.FollowTouchable}</Text>
              </TouchableOpacity>
            </LinearGradient>
          ) : (
            <TouchableOpacity style={styles.followingButton} onPress={handleFollow}>
              <Text style={styles.followingButtonText}>{screenTexts.FollowingTouchable}</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: '#F2F2F7',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  nombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  usuario: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '400',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  acceptButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  rejectButton: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectButtonText: {
    color: '#8E8E93',
    fontSize: 13,
    fontWeight: '600',
  },
  followButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  followButtonInner: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  followButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  followingButton: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  followingButtonText: {
    color: '#8E8E93',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default NotificacionUser;
