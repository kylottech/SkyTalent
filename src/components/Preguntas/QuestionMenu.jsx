import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

export default function QuestionMenu ({
  questions,
  currentQuestion,
  onSelectQuestion,
}) {
  return (
  <View style={styles.container}>
    <View style={styles.menu}>
      {questions.map((_, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onSelectQuestion(index)}
          style={[
            styles.dot,
            currentQuestion === index && styles.activeDot
          ]}
        />
      ))}
    </View>
  </View>)
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 24,
    zIndex: 50,
  },
  menu: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)'
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D1D5DB'
  },
  activeDot: {
    backgroundColor: '#2563EB',
    transform: [{ scale: 1.1 }]
  }
});