import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useUser } from "../../../context/useUser";
import { Image as RNImage } from 'react-native';

const VisitCard = ({ visit, index, setSelectedIndexVisit, selectedIndexVisit }) => {
  const { texts } = useUser();
  const screenTexts = texts.components.Wallet.Experiences.VisitCard;

  function formatDateToShortMonthYear(date) {
    if (!date) return '';
    const parsedDate = (date instanceof Date) ? date : new Date(date);

    const meses = [
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

    const mes = meses[parsedDate.getMonth()];
    const año = parsedDate.getFullYear();

    return `${mes} ${año}`;
  }

  return (
    <View style={styles.containerViaje}>
      <RNImage source={{ uri: visit.avatar.url }} style={styles.imageViaje} />
      <View style={{ flexDirection: 'column', flex: 1, justifyContent: 'flex-end' }}>
        
        {/* Nombre + etiqueta "Actual" */}
        <View style={styles.rowTitle}>
          <Text
            style={styles.titulo}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {visit.name}
          </Text>
          {index === selectedIndexVisit && (
            <View style={styles.actual}>
              <Text style={styles.actualText}>{screenTexts.Actual}</Text>
            </View>
          )}
        </View>

        {/* Fecha y duración */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
          <Text style={styles.fecha}>{formatDateToShortMonthYear(visit.date)}</Text>
          <Text style={styles.fecha}>·</Text>
          <Text style={styles.fecha}>
            {visit.days.length} {visit.days.length === 1 ? screenTexts.Day : screenTexts.Days}
          </Text>
        </View>

        {/* Etiquetas */}
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.etiqueta}>
            <Text style={styles.etiquetaText}>{visit.tags[0].name}</Text>
          </View>
          <View style={styles.etiqueta}>
            <Text style={styles.etiquetaText}>{visit.tags[1].name}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerViaje: {
    flexDirection: 'row',
    width: '90%',
    borderColor: '#f0f0f0',
    borderWidth: 0.5,
    borderRadius: 10,
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  imageViaje: {
    width: 120,
    height: 80,
    borderRadius: 10,
    marginRight: 10
  },
  rowTitle: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    flexShrink: 1,
    flexGrow: 1,
    marginRight: 10,
    maxWidth: '80%',
  },
  actual: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#004999',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 20,
    marginTop: -5,
  },
  actualText: {
    color: 'white',
    fontSize: 8,
  },
  fecha: {
    color: 'gray',
    marginRight: 5,
    fontSize: 10,
    marginBottom: 5
  },
  etiqueta: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderColor: 'rgb(107, 166, 255)',
    borderWidth: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginRight: 5,
  },
  etiquetaText: {
    color: '#004999',
    fontSize: 8,
  },
});

export default VisitCard;
