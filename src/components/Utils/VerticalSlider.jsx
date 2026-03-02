import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Image, Animated, PanResponder, Text} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SliderButton from './SliderButton';
import flecha from '../../../assets/FlechaArriba.png';


const VerticalSlider = (props) => {
    const slideAnim = useRef(new Animated.Value(40)).current;
    const [text, setText] = useState('');
    const [firstColor, setFirstColor] = useState('#977B3C');
    const [secondColor, setSecondColor] = useState('#C8A65A');
    const [height, setHeight] = useState();
    const [width, setWidth] = useState();



    //cambiar los tamaños en estos componentes
  useEffect(() => {
    setText(props.text)
    if(props.color === 'Gold'){
        setFirstColor('#977B3C')
        setSecondColor('#C8A65A')
    }
    else if(props.color === 'Red'){
        setFirstColor('#990500')
        setSecondColor('#E4381D')
    }
    else if(props.color === 'Black'){
        setFirstColor('#000000')
        setSecondColor('#000000')
    }
    
  },[])

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        // Limitar el movimiento del botón deslizante de abajo hacia arriba
        if (gestureState.dy <= 40 && gestureState.dy >= -55) {
          slideAnim.setValue(gestureState.dy); // Movimiento inverso (abajo hacia arriba)
        }
      },
      onPanResponderRelease: (event, gestureState) => {
        if (gestureState.dy < -55) {
          // Si se desliza lo suficiente hacia arriba, completar la acción
          Animated.timing(slideAnim, {
            toValue: -55, // Llega hasta arriba
            duration: 300,
            useNativeDriver: false,
          }).start(() => {
            props.onPress();
            Animated.spring(slideAnim, {
              toValue: 40, // Regresa a la posición inicial en la parte inferior
              useNativeDriver: false,
            }).start();
          });
        } else {
          // Si no se desliza lo suficiente, volver al inicio (parte inferior)
          Animated.spring(slideAnim, {
            toValue: 40,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;
  

  return (
    <View style={styles.container}>

        <LinearGradient
            colors={[firstColor, secondColor]}
            start={[0, 0]}
            end={[1, 1]}
            locations={[0, 0.4]}
            style={styles.gradient}
          >
            <View style={styles.track}>
              <Image source={flecha} style={styles.flecha1}/>
              <Image source={flecha} style={styles.flecha2}/>
              <Image source={flecha} style={styles.flecha3}/>
              <Text style={styles.textoSlide}>{text}</Text>
              <Animated.View
                {...panResponder.panHandlers}
                style={[
                  styles.slider,
                  {
                    transform: [{ translateY: slideAnim }], // Desplazar en el eje Y
                  },
                ]}
              >
                <SliderButton color={props.color}/>
              </Animated.View>
            </View>
          </LinearGradient>
        
    </View>
    


  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal:16,
    alignItems: 'center',
  },
  gradient: {
    width: 60, 
    height: 150,
    borderRadius: 30,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 0,
    marginBottom: 35,
  },
  track: { 
    width: 60, 
    height: 150,
    borderRadius: 30,
    alignItems: 'center',
  },
  flecha1: {
    position: 'absolute',
    top: '36%',
    left: '40%', 
  },
  flecha2: {
    position: 'absolute',
    top: '43%',
    left: '40%',
  },
  flecha3: {
    position: 'absolute',
    top: '50%',
    left: '40%',
  },
  textoSlide: {
    position: 'absolute',
    top: '11%',
    fontSize: 11,
    color: 'white',
    fontWeight: 'bold'
  },

});

export default VerticalSlider;