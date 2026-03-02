import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import x from '../../../assets/icon_x.png';
import expand from '../../../assets/expand.png';
import candado from '../../../assets/candadoSitio.png';
import StarRating from '../Utils/StarRating';
import SliderButton from '../Utils/SliderButton';

const LocationInfo = (props) => {
  const [visible, setVisible] = useState(props.locationBlocked || props.info.locationBlocked);

  useEffect(() => {
    setVisible(props.locationBlocked)
  
  },[props.locationBlocked])

  return (
    <View style={styles.container}>
      <View style={styles.imageContainerVisible}>
        <Image
          style={styles.imageVisible}
          source={{ uri: props.info?.avatar?.url || '' }}
          blurRadius={visible ? 0 : 30}
        />

        {/* Iconos de cerrar y expandir */}
        <TouchableOpacity style={styles.expand} onPress={props.expand}>
          <Image style={styles.expandIcon} source={expand} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.close} onPress={props.close}>
          <Image style={styles.xIcon} source={x} />
        </TouchableOpacity>

        {/* Candado centrado */}
        {!visible && <Image style={styles.candado} source={candado} />}
      </View>

      {/* Información */}
      <View style={styles.gradientVisible}>
        <SliderButton color={'Black'} customStyle={styles.logo} />
        {visible ? (
          <Text style={styles.name}>{props.info.name}</Text>
        ) : (
          <Text style={styles.name}> </Text>
        )}
        <StarRating mode={'read'} ratingNumber={props.info.puntuacion} />
        <Text style={styles.location}>{props.info.city}, {props.info.country}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '95%',
    height: 275,
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  imageContainerVisible: {
    position: 'relative',
    height: 175,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  imageVisible: {
    height: 150,
    width: '100%',
    borderRadius: 20,
    marginTop: 10,
  },
  candado: {
    position: 'absolute',
    width: 100,
    height: 100,
    resizeMode: 'contain',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    zIndex: 2,
  },
  close: {
    position: 'absolute',
    left: -8,
    top: 8,
    backgroundColor: 'white',
    width: 18,
    height: 18,
    borderRadius: 20,
    borderColor: '#CBB992',
    justifyContent: 'center',
    alignItems: 'center',
  },
  xIcon: {
    width: 10,
    height: 10,
  },
  expand: {
    position: 'absolute',
    right: -8,
    top: 8,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandIcon: {
    width: 28,
    height: 28,
  },
  gradientVisible: {
    height: 100,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  logo: {
    marginBottom: 15,
  },
  name: {
    color: 'black',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },
  location: {
    color: 'black',
    fontSize: 13,
    marginBottom: 10,
  },
});

export default LocationInfo;
