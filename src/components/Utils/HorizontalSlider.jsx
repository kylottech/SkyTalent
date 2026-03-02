import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Image, Animated, PanResponder, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SliderButton from './SliderButton';
import flecha from '../../../assets/flechaDerecha.png';

const HorizontalSlider = (props) => {
    const [text, setText] = useState(' ');
    const [firstColor, setFirstColor] = useState('#1D7CE4');
    const [secondColor, setSecondColor] = useState('#004999');
    const [size, setSize] = useState(props.size || 'Big');
    const [firstValue, setFirstValue] = useState(size === 'Small' ? 0 : 20);
    const [secondValue, setSecondValue] = useState(size === 'Small' ? 60 : 155);
    const [thirdValue, setThirdValue] = useState(size === 'Small' ? 20 : 100);
    const slideAnim = useRef(new Animated.Value(firstValue)).current;

    useEffect(() => {
        setText(props.text || '');
        setSize(props.size || 'Big');

        if (props.color === 'Blue') {
            setFirstColor('#1D7CE4');
            setSecondColor('#004999');
        } else if (props.color === 'Gold') {
            setFirstColor('#977B3C');
            setSecondColor('#C8A65A');
        } else if (props.color === 'Gray') {
            setFirstColor('#B3B3B3');
            setSecondColor('#DADADA');
        } else if (props.color === 'Black') {
            setFirstColor('#000000');
            setSecondColor('#000000');
        }

        if (props.size === 'Small') {
            setFirstValue(0);
            setSecondValue(60);
            setThirdValue(20);
            slideAnim.setValue(0);
        } else {
            setFirstValue(20);
            setSecondValue(155);
            setThirdValue(100);
            slideAnim.setValue(20);
        }
    }, [props.size, props.color, props.text, slideAnim]);

    // Interpolar opacidad en función de slideAnim
    const opacity = slideAnim.interpolate({
        inputRange: [firstValue, secondValue], // Desde inicio hasta fin del movimiento
        outputRange: [1, 0], // Opacidad 1 (visible) a 0 (invisible)
        extrapolate: 'clamp', // Limita los valores entre el rango
    });

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gestureState) => {
                if (gestureState.dx >= firstValue && gestureState.dx <= secondValue) {
                    slideAnim.setValue(gestureState.dx);
                }
            },
            onPanResponderRelease: (event, gestureState) => {
                if (gestureState.dx > thirdValue) {
                    Animated.timing(slideAnim, {
                        toValue: secondValue,
                        duration: 200,
                        useNativeDriver: false,
                    }).start(() => {
                        props.onPress();
                        Animated.spring(slideAnim, {
                            toValue: firstValue,
                            useNativeDriver: false,
                        }).start();
                    });
                } else {
                    Animated.spring(slideAnim, {
                        toValue: firstValue,
                        useNativeDriver: false,
                    }).start();
                }
            },
        })
    ).current;

    const handleMayusculas = (text) => {
        if (text == null) {  // Verifica si `text` es `null` o `undefined`
          return '';  // Retorna una cadena vacía si `text` no está definido
        }
      
        return text.toUpperCase();  // Convierte a mayúsculas
      };
      

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[firstColor, secondColor]}
                start={[0, 0]}
                end={[1, 1]}
                locations={[0, 0.4]}
                style={size === 'Big' ? styles.gradient1 : styles.gradient2}
            >
                <View style={size === 'Big' ? styles.track1 : styles.track2}>
                    {/* Aplica opacidad interpolada a las flechas y el texto */}
                    <Animated.Image source={flecha} style={[size === 'Big' ? styles.flecha11 : styles.flecha12, { opacity }]} />
                    <Animated.Image source={flecha} style={[size === 'Big' ? styles.flecha21 : styles.flecha22, { opacity }]} />
                    <Animated.Image source={flecha} style={[size === 'Big' ? styles.flecha31 : styles.flecha32, { opacity }]} />
                    <Animated.Text style={[size === 'Big' ? styles.textoSlide1 : styles.textoSlide2, { opacity }]}>
                        {handleMayusculas(text)}
                    </Animated.Text>
                    <Animated.View
                        {...panResponder.panHandlers}
                        style={[
                            styles.slider,
                            {
                                transform: [{ translateX: slideAnim }],
                            },
                        ]}
                    >
                        <SliderButton color={props.color} size={props.size} />
                    </Animated.View>
                </View>
            </LinearGradient>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
    },
    gradient1: {
        width: 200,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    gradient2: {
        width: 80,
        height: 25,
        borderRadius: 30,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    track1: {
        width: 200,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
    },
    track2: {
        width: 80,
        height: 25,
        borderRadius: 30,
        justifyContent: 'center',
    },
    flecha11: {
        position: 'absolute',
        left: '45%',
    },
    flecha12: {
        width: 10,
        height: 10,
        position: 'absolute',
        left: '50%',
    },
    flecha21: {
        position: 'absolute',
        left: '40%',
    },
    flecha22: {
        width: 10,
        height: 10,
        position: 'absolute',
        left: '40%',
    },
    flecha31: {
        position: 'absolute',
        left: '35%',
    },
    flecha32: {
        width: 10,
        height: 10,
        position: 'absolute',
        left: '30%',
    },
    textoSlide1: {
        position: 'absolute',
        left: '55%',
        fontSize: 13,
        color: 'white',
        fontWeight: 'bold'
    },
    textoSlide2: {
        position: 'absolute',
        left: '70%',
        fontSize: 7,
        color: 'white',
        fontWeight: 'bold'
    },
});

export default HorizontalSlider;
