import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet, Easing } from 'react-native';

const Name = (props) => {
  const animation = useRef(new Animated.Value(0)).current;
  const [text, setText] = useState(props.text);

  useEffect(() => {
    // Inicia la animación del texto
    const startAnimation = () => {
      animation.setValue(600); // Empieza el texto fuera del contenedor a la derecha
      Animated.timing(animation, {
        toValue: -600, // Termina fuera del contenedor a la izquierda
        duration: 10000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        startAnimation(); // Reinicia la animación
      });
    };

    startAnimation(); // Inicia la animación al cargar el componente
  }, [animation]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ translateX: animation }] }}>
        <View style={styles.conjunto}>
          {[...Array(8)].map((_, index) => (
            <Text key={index} style={styles.text2}>
              {/*text.toUpperCase()*/}
              {text} 
            </Text>
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden', // Oculta el texto al salir del contenedor
    width: '100%', // Ajusta el ancho al tamaño del contenedor
    height: 25, // Altura del contenedor
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  conjunto: {
    flexDirection: 'row',
  },
  text1: {
    fontSize: 18,
    color: 'white',
  },
  text2: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Name;
