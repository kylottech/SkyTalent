import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useUser } from "../../context/useUser";
import ProgressBar from './ProgressBar';
import Top from '../../components/Utils/Top'
import HorizontalSlider from '../../components/Utils/HorizontalSlider'
import welcome1 from '../../../assets/welcome1.jpg'
import welcome2 from '../../../assets/welcome2.jpg'
import welcome3 from '../../../assets/welcome3.jpg'
import welcome4 from '../../../assets/welcome4.jpg'

const WelcomeToKylot = ({ onNext, onBack, progress }) => {
  const { texts }=useUser()
  const screenTexts = texts.pages.OnBoarding.WelcomeToKylot
  return (
    <View style={styles.container}>
      <ProgressBar progress={progress} />

      <Top 
        left={true} leftType={'Back'} back={onBack}
        typeCenter={'Text'} textCenter={screenTexts.Top} 
        right={false}
      />

      <View style={styles.info}>
        <View style={styles.content}>
          <Text style={styles.heading}>
          {screenTexts.Title1}
          </Text>
          <Text style={styles.heading}>
          {screenTexts.Title2}
          </Text>
          <Text style={styles.heading}>
          {screenTexts.Title3}
          </Text>
        </View>

        <View style={styles.infographicContainer}>
          <View style={styles.infographicBox}>
            <Image source={welcome1} style={styles.photo1}/>
            <Image source={welcome2} style={styles.photo2}/>
          </View>
          <View style={styles.infographicBox}> 
            <Image source={welcome3} style={styles.photo3}/>
            <Image source={welcome4} style={styles.photo4}/>
          </View>
        </View>

        
      </View>
      <View style={styles.footer}>
          <HorizontalSlider color={'Blue'} text={screenTexts.ContinueHorizontalSlider} onPress={onNext} />
        </View>
      </View>

      
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    width: '100%',
  },
  info:{
    paddingHorizontal: 24,
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    marginBottom: 150
  },
  content: {
    marginBottom: 40,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  infographicContainer: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'column'
  },
  infographicBox: {
    width: '100%',
    height: '50%',
    flexDirection: 'row'
  },
  photo1:{
    width: '60%',
    height: '110%',
    borderRadius: 10,
  },
  photo2:{
    width: '60%',
    height: '110%',
    borderRadius: 10,
    marginTop: 60,
    marginLeft: -60
  },
  photo3:{
    width: '60%',
    height: '110%',
    borderRadius: 10,
    marginTop: -10,
    marginRight: -40,
    marginLeft: 20
  },
  photo4:{
    width: '60%',
    height: '110%',
    borderRadius: 10,
    marginTop: 40,
    marginLeft: -60
  },
  descriptionContainer: {
    alignItems: 'center',
  },
  description: {
    fontSize: 12,
    color: '#9d9d9d',
    textAlign: 'center',
    maxWidth: 300,
  },
  footer: {
    paddingBottom: 0,
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center'
    //right: 16,
    //left: 16
  },
});

export default WelcomeToKylot;
