import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import {Marker} from 'react-native-maps';
import pin from '../../../assets/pinMapa.png';

const AddMarker = (props) => {
    

    useEffect(() => {
      if (props.func && props.origin) {
        props.func(props.origin)
      }
    },[props.func, props.origin])
  

  return (
    
        <Marker
          draggable
          coordinate={props.origin}
          image={pin}
          onDragEnd={(direction) => { props.func(direction.nativeEvent.coordinate)}}
        />
    


  );
};

const styles = StyleSheet.create({
   


});

export default AddMarker;