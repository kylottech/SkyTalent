import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const Publicacion = ({ imageSource }) => {
  return (
    <View style={styles.container}>
      <Image
        source={imageSource}
        style={styles.image}
        imageStyle={styles.imageStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
  },
});

export default Publicacion;
