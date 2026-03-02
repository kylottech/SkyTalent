import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, FlatList, Dimensions } from "react-native";
import { useUser } from "../../context/useUser";
import { formatString } from '../../utils/formatString'
import Top from "../../components/Utils/Top";
import { getCities } from '../../services/metricsService';
import * as Progress from "react-native-progress";

const Cities = ({ route }) => {
  const { country } = route.params;
  const { logout, texts } = useUser();
  const screenTexts = texts.pages.MetricasPages.Cities
  const [mockCities, setMockCities] = useState([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');

  const handleGetCities = async () => {
    try {
      await getCities({ country }, logout)
        .then((res) => {
          const sortedStats = res.stats.sort((a, b) =>
            a.city.localeCompare(b.city, "es", { sensitivity: "base" })
          );
          setMockCities(sortedStats);
        })
        .catch((error) => {
          setError(true);
          setErrorMessage(error.message);
        });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetCities();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.cityCard}>
      <Text style={styles.cityName}>{item.city}</Text>
      <Text style={styles.stats}>
        {formatString(screenTexts.Discover, { variable1: item.userPlaceCount, variable2: item.totalPlaceCount})}
      </Text>
      <Progress.Bar
        progress={item.percentage / 100}
        width={null}
        color="#1D7CE4"
        unfilledColor="#e0e0e0"
        borderWidth={0}
        height={8}
        style={styles.progress}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Top left={true} leftType={"Back"} typeCenter={"Text"} textCenter={country} />
      <View style={styles.content}>
        <FlatList
          data={mockCities}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={renderItem}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
};

const cardWidth = (Dimensions.get("window").width - 48) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    padding: 16,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  cityCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    width: cardWidth,
    height: 150, // ALTURA FIJA para warping consistente
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#eee",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    overflow: "hidden",
  },
  cityName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: 'center',
  },
  stats: {
    fontSize: 12,
    marginBottom: 12,
    color: "#9d9d9d",
    textAlign: 'center',
  },
  progress: {
    width: '100%',
  },
});

export default Cities;
