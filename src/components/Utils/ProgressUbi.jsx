import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';
import { useUser } from '../../context/useUser';
import { formatString } from '../../utils/formatString'

const ProgressUbi = ({ total, inProgress, countries }) => {
  const { logout, texts } = useUser();
  const screenTexts = texts.components.Utils.ProgressUbi;
  const progress = total > 0 ? inProgress / total : 0;

  return (
    <View style={[countries ? styles.container : styles.container2]}>
      <Text style={[countries ? styles.titulo : styles.titulo2]}>{screenTexts.Title}</Text>
      <View style={styles.progressContainer}>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Progress.Circle
          size={38} // Aumenta el tamaño del círculo si es necesario
          progress={progress}
          thickness={3}
          unfilledColor="#1D7CE4" 
          color="#C8A65A"
          borderWidth={0}
          showsText={false} // Oculta el texto predeterminado
        />
        <Text
          style={[countries ? {
            position: "absolute",
            fontSize: 13, // Ajusta el tamaño del texto aquí
            fontWeight: "bold",
            color: "white",
          }:{
            position: "absolute",
            fontSize: 13, // Ajusta el tamaño del texto aquí
            fontWeight: "bold",
            color: "black",
          }]}
        >
          {Math.round(progress * 100)}%
        </Text>
      </View>
      </View>

      {countries ? (
        <View style={styles.textContainer}>
          <Text style={styles.text}>{formatString(screenTexts.DiscoveryTitle, { variable1: Math.round(progress * 100) })}</Text>
          <Text style={styles.text}>{formatString(screenTexts.DiscoverySubtitle, { variable1: inProgress, variable2: total })}</Text>
        </View>
      ): (
        <View style={styles.textContainer}>
          <Text style={styles.text2}>{formatString(screenTexts.Progress, { variable1: inProgress, variable2: total })}</Text>
          <Text style={styles.text2}>{formatString(screenTexts.Percentage, { variable1: Math.round(progress * 100) })}</Text>
        </View>
      )}

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'white',
    borderBottomWidth: 2,
    borderRightWidth:2, 
    borderLeftWidth: 2,
    
    width: 225,
    height: 50,
    borderRadius: 50
  },
  container2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'black',
    borderBottomWidth: 2,
    borderRightWidth:2, 
    borderLeftWidth: 2,
    
    width: 225,
    height: 50,
    borderRadius: 50
  },
  titulo:{
    color: 'white',
    position: 'absolute',
    top:-25,
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  titulo2:{
    color: 'black',
    position: 'absolute',
    top:-25,
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  progressContainer: {
    marginRight: 8,
  },
  textContainer: {
    flexDirection: 'column',
    marginRight: 10
  },
  text: {
    fontSize: 10,
    color: 'white',
    textAlign: 'center',
  },
  text2: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
  },
});

export default ProgressUbi;
