import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useUser } from "../context/useUser";

import Onboarding from './OnBoarding/Onboarding';
import CategorySelect from './OnBoarding/CategorySelect';
import Final from './OnBoarding/Final';
import WelcomeToKylot from './OnBoarding/WelcomeToKylot';

import OnBoarding2 from '../../assets/OnBoarding2.jpg';
import OnBoarding3 from '../../assets/OnBoarding3.png';
import OnBoarding4 from '../../assets/OnBoarding4.png';
import OnBoarding6 from '../../assets/OnBoarding6.jpg';
import OnBoarding7 from '../../assets/OnBoarding7.png';
import OnBoarding8 from '../../assets/OnBoarding8.png';


function OnboardingIndex() {
  const navigate=useNavigation()
  const {isLogged, isLoading, texts }=useUser()
  const screenTexts = texts.pages.OnBoardingIndex

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const totalSteps = 12;
  const progress = ((step + 1) / totalSteps) * 100;

  

  useEffect(() => { 
    if (!isLoading && !isLogged) {
      navigate.navigate('Login');
    }
  }, [isLogged, isLoading])


  const nextStep = () => setStep(step => step + 1)

  const prevStep = () => {
    if(step === 0){
      navigate.goBack()
    }
    else{
      setStep(step - 1)
    }
    
  }
  
  const handleCategorySelect = (category) => {
    setAnswers(category);
    nextStep();
  };

  const steps = [
    <WelcomeToKylot onNext={nextStep} onBack={prevStep} progress={progress} />,
    <Onboarding 
      screen={screenTexts.Screen1}
      title={screenTexts.Title1}
      showImageUpload
      onNext={nextStep}
      onBack={prevStep}
      progress={progress}
    />,
    <Onboarding 
      screen={screenTexts.Screen2}
      title={screenTexts.Title2}
      onNext={nextStep}
      onBack={prevStep}
      progress={progress}
      photo={OnBoarding2}
    />,
    <Onboarding 
      screen={screenTexts.Screen3}
      title={screenTexts.Title3}
      onNext={nextStep}
      onBack={prevStep}
      progress={progress}
      photo={OnBoarding3}
    />,
    <Onboarding 
      screen={screenTexts.Screen4}
      title={screenTexts.Title4}
      onNext={nextStep}
      onBack={prevStep}
      progress={progress}
      photo={OnBoarding4}
    />,
    <Onboarding 
      screen={screenTexts.Screen5}
      title={screenTexts.Title5}
      onNext={nextStep}
      onBack={prevStep}
      progress={progress}
      photo={OnBoarding2}
    />,
    <Onboarding 
      screen={screenTexts.Screen6}
      title={screenTexts.Title6}
      onNext={nextStep}
      onBack={prevStep}
      progress={progress}
      photo={OnBoarding6}
    />,
    <Onboarding 
      screen={screenTexts.Screen7}
      title={screenTexts.Title7}
      onNext={nextStep}
      onBack={prevStep}
      progress={progress}
      photo={OnBoarding7}
    />,
    <Onboarding 
      screen={screenTexts.Screen8}
      title={screenTexts.Title8}
      onNext={nextStep}
      onBack={prevStep}
      progress={progress}
      photo={OnBoarding8}
    />,
    <Onboarding 
      screen={screenTexts.Screen9}
      title={screenTexts.Title9}
      onNext={nextStep}
      onBack={prevStep}
      progress={progress}
      photo={OnBoarding2}
    />,
    <CategorySelect answers={answers} onNext={handleCategorySelect} onBack={prevStep} progress={progress} />,
    <Final answers={answers} onBack={prevStep} progress={progress} />
  ];
  

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.content}
      > 
        {steps[step]}
      </ScrollView>
    </View>
  );


}
const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor:'white',
  },
  content:{
    flex:1,
    width:'100%',
    
    alignSelf: 'center',
    alignItems: 'center',
    paddingHorizontal:16,
    marginTop: 5
  },
  });


export default OnboardingIndex;