// DayCard.jsx
import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from "../../../context/useUser";

const DayCard = ({ selectedIndex, setSelectedIndex, info, index, onPress }) => {
  const { texts } = useUser();
  const screenTexts = texts.components.Wallet.Experiences.DayCard;

  function formatVisitDate() {
    const meses = [
      screenTexts.January, screenTexts.February, screenTexts.March,
      screenTexts.April, screenTexts.May, screenTexts.June,
      screenTexts.July, screenTexts.August, screenTexts.September,
      screenTexts.October, screenTexts.November, screenTexts.December
    ];
    const parsedDate = new Date(info.date);
    const day = parsedDate.getDate();
    const month = meses[parsedDate.getMonth()];
    return `${screenTexts.Title1} ${index + 1} - ${day} ${screenTexts.Title2} ${month}`;
  }

  const handlePress = () => {
    if (onPress) return onPress(index, info);
    setSelectedIndex(index);
  };

  const isSelected = selectedIndex === index;

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.cardContainer}           // 👈 ocupa todo el ancho
      activeOpacity={0.8}
    >
      {isSelected ? (
        <LinearGradient
          colors={['#1D7CE4', '#004999']}
          start={[0, 0]}
          end={[1, 1]}
          style={[styles.etiquetaFechaSelected, styles.fullWidth]} 
        >
          <Text style={styles.actualText}>{formatVisitDate()}</Text>
        </LinearGradient>
      ) : (
        <View style={[styles.etiquetaFecha, styles.fullWidth]}>          
          <Text style={styles.actualText2}>{formatVisitDate()}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '90%',
    alignSelf: 'stretch',
  },
  fullWidth: {
    width: '100%',
  },
  etiquetaFechaSelected:{
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginRight: 5,
  },
  etiquetaFecha:{
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderColor: '#f0f0f0',
    borderWidth: 0.5,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginRight: 5, 
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  actualText:{ fontSize: 12, color: 'white' },
  actualText2:{ fontSize: 12 },
});

export default DayCard;
