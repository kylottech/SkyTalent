import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import corona from '../../../assets/CORONA_DORADA.png';


const SliderButton = (props) => {
    const [color, setColor] = useState('#0F63BF');
    const [size, setSize] = useState(40);


    //cambiar los tamaños en estos componentes
  useEffect(() => {
    if(props.color === 'Blue'){
        setColor('#0F63BF')
    }
    else if(props.color === 'Gold'){
        setColor('#E3D9C4')
    }
    else if(props.color === 'Red'){
        setColor('#BF0F0F')
    }
    else if(props.color === 'Black'){
        setColor('#FFFFFF')
    }
    else if(props.color === 'Gray'){
        setColor('#DADADA')
    }

    if(props.size === 'Small'){
      setSize(20)
    }
    
  },[props.size])
  

  return (
    <View style={styles.container}>

        <View style={[styles.sliderContent, { backgroundColor: color, width: size, height: size }, props.customStyle]}>
            <Image source={corona} style={[{ width: size -10, height: 30 }]}/>
        </View>
        
    </View>
    


  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  sliderContent:{
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50
  }

});

export default SliderButton;