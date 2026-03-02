import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../../context/useUser";
import { formatString } from '../../utils/formatString'
import { getCountrie } from '../../services/metricsService'
import Top from "../../components/Utils/Top";
import * as Progress from "react-native-progress";

const Discover = () => {
  const navigation = useNavigation();
  const { isLogged, isLoading, texts, logout } = useUser();
  const screenTexts = texts.pages.MetricasPages.Discover
  const [mockData, setMockData] = useState([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');

  const handleGetCountrie = async () => {
    try {
      await getCountrie(logout)
      .then((res) => {
          setMockData(res.stats)
      
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
    handleGetCountrie()
  }, []);

  useEffect(() => {
    if (!isLoading && !isLogged) {
      navigation.navigate("Login");
    }
  }, [isLogged, isLoading]);

  const handlePress = (country) => {
    navigation.navigate("Cities", { country });
  };

  return (
    <ScrollView style={styles.container}>
      <Top left={true} leftType={"Back"} typeCenter={"Text"} textCenter={screenTexts.Top} />
      <View style={styles.content}>
        {mockData.map((item, index) => (
          <TouchableOpacity key={index} style={styles.card} onPress={() => handlePress(item.country)}>
            <View style={styles.cardText}>
              <Text style={styles.country}>{item.country}</Text>
              <Text style={styles.cities}>{formatString(screenTexts.Discover, { variable1: item.userCityCount })}</Text>
            </View>
            <Progress.Circle
              progress={item.percentage / 100}
              size={50}
              thickness={6}
              color="#1D7CE4"
              unfilledColor="#e0e0e0"
              borderWidth={0}
              showsText={true}
              formatText={() => `${Math.round(item.percentage)}%`}
              textStyle={{ fontSize: 12, fontWeight: 'bold' }}
            />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardText: {
    flex: 1,
  },
  country: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cities: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default Discover;
