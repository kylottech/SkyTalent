import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useUser } from "../../context/useUser";

import Top from '../../components/Utils/Top';
import HorizontalSlider from '../../components/Utils/HorizontalSlider';

import corona from '../../../assets/CORONA_DORADA.png';


const Confirmacion = ({ route }) => {
  const navigate = useNavigation();
  const { isLogged, isLoading, texts } = useUser();
  const screenTexts = texts.pages.BancoPages.Confirmacion;

  const MONTHS_ABBR = [
    screenTexts.January,
    screenTexts.February,
    screenTexts.March,
    screenTexts.April,
    screenTexts.May,
    screenTexts.June,
    screenTexts.July,
    screenTexts.August,
    screenTexts.September,
    screenTexts.October,
    screenTexts.November,
    screenTexts.December
  ];
  const { name, amount, available, avatar, date, kylotId } = route.params;

  const formatDateShort = (input) => {
    if (!input) return '';
    const d = new Date(input);
    if (isNaN(d)) return String(input);
    const day = d.getDate();
    const month = MONTHS_ABBR[d.getMonth()] || '';
    const year = d.getFullYear();
    return `${day} ${month}, ${year}`;
  };


  useEffect(() => {
    if (!isLoading && !isLogged) {
      navigate.navigate("Login");
    }
  }, [isLogged, isLoading]);

  return (
    <View style={styles.container}>
      <Top 
        left={true} leftType={'Back'} 
        typeCenter={'Text'} textCenter={screenTexts.Top}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.decision}>
          <View style={{flexDirection: 'row'}}>
            <Image source={{uri: avatar}} style={styles.imagen} />
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.decisionTexto}>
                {name}
              </Text>

              <Text style={styles.decisionSubtexto}>
                @{kylotId}
              </Text>
            </View>
          </View>

          <View style={styles.lineDiscontinous}/>
          
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{screenTexts.Date}</Text>
            <Text style={styles.data}>{formatDateShort(date)}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{screenTexts.Amount}</Text>
            <Text style={styles.data}>{amount} Kylets</Text>
          </View>

        </View>

        <View style={styles.availableContainer}>
          <Text style={styles.availableText}>{screenTexts.Available}</Text>
          <Image source={corona} style={styles.availableIcon} />
          <Text style={styles.availableAmount}>{available}</Text>
        </View>

        <View style={styles.gradientButton}>
          <HorizontalSlider 
            color="Gold" 
            text={screenTexts.HorizontalSlider}
            onPress={() => navigate.navigate('Home')} 
          />
        </View>
      </ScrollView>  
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  decision: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 60,
    gap: 12,
  },
  imagen: {
    width: 45,
    height: 45,
    marginRight: 15,
    borderRadius: 45
  },
  decisionTexto: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  decisionSubtexto: {
    fontSize: 14,
    color: 'gray',
  },
  lineDiscontinous:{
    width: '100%',
    borderTopWidth: 1,
    borderColor: '#d9d9d9',
    borderStyle: 'dashed',
    marginVertical: 12, 
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    color: '#9d9d9d'
  },
  data: {
    fontSize: 16,
  },
  availableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  availableIcon: {
    width: 20,
    height: 20,
    marginHorizontal: 5,
  },
  gradientButton: {
    width: '100%',
    marginTop: 50,
  },
});

export default Confirmacion;
