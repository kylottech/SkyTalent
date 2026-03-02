import React from 'react';
import { Marker } from 'react-native-maps';
import { View, Image, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Moment = ({ _id, location, photo, title, onPress, liked, user }) => {
  // Validar que tenemos datos válidos
  if (!location || typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
    return null;
  }

  if (!photo || !photo.url) {
    return null;
  }

  return (
    <Marker
      coordinate={location}
      onPress={() => onPress?.({ _id, photo, title, liked, user })}
    >
      <View style={styles.momentContainer}>
        {/* Contenedor principal del momento */}
        <View style={styles.momentWrapper}>
          {/* Imagen del momento */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: photo.url }} style={styles.image} resizeMode="cover" />
            
            {/* Indicador de like */}
            {liked && (
              <View style={styles.likeIndicator}>
                <Icon name="heart" size={12} color="#ff4757" />
              </View>
            )}
            
            {/* Sombra interna para profundidad */}
            <View style={styles.imageShadow} />
          </View>
          
          {/* Marco decorativo */}
          <View style={styles.decorativeFrame} />
        </View>
        
        {/* Punto de anclaje del marker */}
        <View style={styles.markerPoint} />
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  momentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  momentWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    position: 'relative',
    width: 54,
    height: 54,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: 'white',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },
  likeIndicator: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: 'white',
    borderRadius: 9,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1.5,
    borderColor: 'white',
  },
  imageShadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 15,
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  decorativeFrame: {
    position: 'absolute',
    width: 0,
    height: 0,
  },
  markerPoint: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'white',
    marginTop: -1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
});

export default Moment;
