import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useUser } from '../../context/useUser'

const ActionButtons = ({
  isLiked,
  isBookmarked,
  onToggleLike,
  likes,
  unblocks
}) => {
  const { texts }=useUser()
  const screenTexts = texts.components.Preguntas.ActionButtons

  return(<View style={styles.container}>
    <TouchableOpacity 
      onPress={() => onToggleLike()}
      style={styles.button}
    >
      <Text style={styles.buttonText}>{likes}</Text>
      <Text style={[styles.buttonText, isLiked && styles.likedText]}>{screenTexts.LikeTouchable}</Text>
    </TouchableOpacity>
    <View 
      style={styles.button}
    >
      <Text style={styles.buttonText}>{unblocks}</Text>
      <Text style={[styles.buttonText, isBookmarked && styles.bookmarkedText]}>{screenTexts.SaveTouchable}</Text>
    </View>
  </View>
);}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563'
  },
  likedText: {
    color: '#EF4444'
  },
  bookmarkedText: {
    color: '#2563EB'
  }
});

export default ActionButtons;
