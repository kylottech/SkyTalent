import React, { useState } from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';

import fullStar from '../../../assets/full_star.png'; 
import emptyStar from '../../../assets/empty_star.png'; 

const StarRating = ({ mode = 'write', ratingNumber = 0, onChangeRating = () => {} }) => {
  const [rating, setRating] = useState(ratingNumber);

  const handleStarPress = (index) => {
    if (mode === 'write') {
      let newRating = index + 1;
      if (newRating === rating) {
        newRating = 0;
      }
      setRating(newRating);
      onChangeRating(newRating); // Notifica cambios al padre
    }
  };

  const getStarType = (index) => {
    if ((mode === 'write' && rating >= index + 1) || (mode === 'read' && ratingNumber >= index + 1)) {
      return fullStar; // Estrella llena
    }
    return emptyStar; // Estrella vacía
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 7; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => handleStarPress(i)}
          disabled={mode === 'read'} 
          style={styles.starContainer}
        >
          <Image source={getStarType(i)} style={styles.star} />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      {renderStars()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  starContainer: {
    marginHorizontal: 5,  
    marginVertical: 5,
  },
  star: {
    width: 22,  
    height: 20,
  },
});

export default StarRating;
