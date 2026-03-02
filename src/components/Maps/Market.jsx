import React, { useState, useEffect } from 'react';
import {Marker} from 'react-native-maps';
import pin from '../../../assets/pinMapa.png';
import pinDorado from '../../../assets/Pin_Desbloqueado.png';
import pinAzul from '../../../assets/Pin_Azul.png';
import pinActivity from '../../../assets/pinActivity.png';

const Market = (props) => {
    const [photo, setPhoto] = useState(pin);

    useEffect(() => {
      if(props.activity){
        setPhoto(pinActivity)
      }
      else{
        if(props.blocked){
          if(props.categoria){
            setPhoto(pinAzul)
          }
          else{
            setPhoto(pin)
          }
            
        }
        else {
          setPhoto(pinDorado)
        }
      }
    },[props.activity, props.blocked, props.categoria])
  

  const handlePress = () => {
    if (props.onPress) {
      props.onPress();
    }
  };

  // Validar que tenemos una location válida
  if (!props.location || typeof props.location.latitude !== 'number' || typeof props.location.longitude !== 'number') {
    return null;
  }

  return (
      
    <Marker
      coordinate={{
        latitude: props.location.latitude,
        longitude: props.location.longitude,
      }}
      image={photo}
      onPress={handlePress}
    />
  
  );
};



export default Market;