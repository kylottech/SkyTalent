import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useUser } from "../../context/useUser";
import { AntDesign } from '@expo/vector-icons';
import ProgressBar from './ProgressBar';

function Welcome({ onNext, onBack, progress }) {
  const { texts }=useUser()
  const screenTexts = texts.pages.OnBoarding.Welcome
  return (
    <View style={styles.container}>
      <ProgressBar progress={progress} />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <AntDesign name="left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>{screenTexts.Top}</Text>
      </View>

      <View style={styles.welcomeContainer}>
        <Text style={styles.heading}>
        {screenTexts.Title}
        </Text>
      </View>

      <View style={styles.infographicContainer}>
        <Text style={styles.infographicText}>Infographic Space</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={onNext} style={styles.getStartedButton}>
          <Text style={styles.buttonText}>{screenTexts.GetStartedTouchable}</Text>
        </TouchableOpacity>

        <Text style={styles.termsText}>
        {screenTexts.TermsFooter}
        </Text>
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
  welcomeContainer: {
    marginTop: 48,
  },
  heading: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
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
  buttonsContainer: {
    marginBottom: 24,
  },
  getStartedButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 30,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  termsText: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 12,
  },
});

export default Welcome;
