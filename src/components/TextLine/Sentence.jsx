import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet, Easing } from 'react-native';

const Sentence = (props) => {
  const animation = useRef(new Animated.Value(0)).current;
  const [bold, setBold] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => {
    setText(props.text);
    const startAnimation = () => {
      animation.setValue(600);
      Animated.timing(animation, {
        toValue: -200,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        setBold((prevBold) => !prevBold);
        startAnimation();
      });
    };

    startAnimation();
  }, [animation, props.text]);

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.text,
          {
            transform: [{ translateX: animation }],
            fontWeight: bold ? 'bold' : 'normal',
          },
        ]}
      >
        {text}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    width: '200%',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});

export default Sentence;