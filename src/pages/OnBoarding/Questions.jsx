import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useUser } from "../../context/useUser";
import { AntDesign } from '@expo/vector-icons';
import ProgressBar from './ProgressBar';

const questions = [
  {
    id: 'interests',
    question: 'What interests you most?',
    options: ['Hidden Restaurants', 'Secret Events', 'Local Deals', 'Exclusive Venues'],
  },
  {
    id: 'radius',
    question: 'How far are you willing to travel?',
    options: ['Walking distance', '5-15 minutes', '15-30 minutes', 'Any distance'],
  },
  {
    id: 'notification',
    question: 'When do you want to be notified?',
    options: ['Instantly', 'Daily digest', 'Weekly roundup', 'Only major events'],
  },
];

function Questions({ onAnswer, onBack, progress }) {
  const { texts }=useUser()
  const screenTexts = texts.pages.OnBoarding.Questions
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const question = questions[currentQuestion];

  const handleSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleContinue = () => {
    if (selectedAnswer) {
      onAnswer(question.id, selectedAnswer);
      setSelectedAnswer(null);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      }
    }
  };

  return (
    <View style={styles.container}>
      <ProgressBar progress={progress} />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <AntDesign name="left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>{screenTexts.Top}</Text>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.question}>{question.question}</Text>
      </View>

      <View style={styles.infographicContainer}>
        <Text style={styles.infographicText}>Infographic Space</Text>
      </View>

      <View style={styles.optionsContainer}>
        {question.options.map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => handleSelect(option)}
            style={[
              styles.optionButton,
              selectedAnswer === option
                ? styles.selectedOption
                : styles.unselectedOption,
            ]}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.continueButtonContainer}>
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!selectedAnswer}
          style={[
            styles.continueButton,
            !selectedAnswer ? styles.disabledButton : styles.enabledButton,
          ]}
        >
          <Text style={styles.continueButtonText}>{screenTexts.ContinueTouchable}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    paddingTop: 30,
  },
  backButton: {
    position: 'absolute',
    left: 0,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  questionContainer: {
    marginTop: 48,
  },
  question: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
  },
  infographicContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 48,
  },
  infographicText: {
    color: '#9ca3af',
  },
  optionsContainer: {
    marginBottom: 32,
  },
  optionButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 1,
    marginBottom: 10,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: 'black',
    borderColor: 'black',
  },
  unselectedOption: {
    backgroundColor: 'white',
    borderColor: 'black',
  },
  optionText: {
    fontSize: 15,
    fontWeight: '500',
    color: 'black',
  },
  continueButtonContainer: {
    paddingBottom: 24,
  },
  continueButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#d1d5db',
    opacity: 0.5,
  },
  enabledButton: {
    backgroundColor: '#3b82f6',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Questions;
