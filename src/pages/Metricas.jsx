import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useUser } from "../context/useUser";
import {
  world,
  locations,
  kylets,
  followers,
  newFollowers,
  friends,
} from "../services/metricsService";
import { formatString } from '../utils/formatString'
import Top from "../components/Utils/Top";
import MetricCard from "../components/metricas/MetricCard";
import PeriodSelector from "../components/metricas/PeriodSelector";
import FollowerItem from "../components/metricas/FollowerItem";
import Error from "../components/Utils/Error";
import blueGlove from '../../assets/blueGlove.png'
import pin from '../../assets/pinMapa.png';
import corona from '../../assets/CORONA_DORADA.png';
import groupGray from '../../assets/groupGray.png'


const Metricas = () => {
  const { isLogged, isLoading, logout, texts } = useUser();
  const screenTexts = texts.pages.Metricas;
  const navigate = useNavigation();

  const [selectedPeriod, setSelectedPeriod] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [metricsWorld, setMetricsWorld] = useState({});
  const [metricsLocations, setMetricsLocations] = useState({});
  const [metricsKylets, setMetricsKylets] = useState({});
  const [metricsFollowers, setMetricsFollowers] = useState({});
  const [metricsFriends, setMetricsFriends] = useState({});
  const [metricsNewFollowers, setMetricsNewFollowers] = useState([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Errorrr");

  useEffect(() => {
    if (!isLoading && !isLogged) {
      navigate.navigate("Login");
    }
  }, [isLogged, isLoading]);

  const handleMetricsWorld = async (selectedPeriod) => {
    try {
      const res = await world(selectedPeriod, logout);
      setMetricsWorld(res);
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
    }
  };

  const handleMetricsLocations = async (selectedPeriod) => {
    try {
      const res = await locations(selectedPeriod, logout);
      setMetricsLocations(res);
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
    }
  };

  const handleMetricsKylets = async (selectedPeriod) => {
    try {
      const res = await kylets(selectedPeriod, logout);
      setMetricsKylets(res);
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
    }
  };

  const handleMetricsFollowers = async (selectedPeriod) => {
    try {
      const res = await followers(selectedPeriod, logout);
      setMetricsFollowers(res);
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
    }
  };

  const handleMetricsFriends = async (selectedPeriod) => {
    try {
      const res = await friends(selectedPeriod, logout);
      setMetricsFriends(res);
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
    }
  };

  const handleMetricsNewFollowers = async () => {
    try {
      const res = await newFollowers(logout);
      setMetricsNewFollowers(res);
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        handleMetricsWorld(selectedPeriod),
        handleMetricsLocations(selectedPeriod),
        handleMetricsKylets(selectedPeriod),
        handleMetricsFollowers(selectedPeriod),
        handleMetricsFriends(selectedPeriod),
        handleMetricsNewFollowers(),
      ]);
      setLoading(false);
    };
    fetchData();
  }, [selectedPeriod]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await Promise.all([
          handleMetricsWorld(selectedPeriod),
          handleMetricsLocations(selectedPeriod),
          handleMetricsKylets(selectedPeriod),
          handleMetricsFollowers(selectedPeriod),
          handleMetricsFriends(selectedPeriod),
          handleMetricsNewFollowers(),
        ]);
        setLoading(false);
      };
      fetchData();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      handleMetricsWorld(selectedPeriod),
      handleMetricsLocations(selectedPeriod),
      handleMetricsKylets(selectedPeriod),
      handleMetricsFollowers(selectedPeriod),
      handleMetricsFriends(selectedPeriod),
      handleMetricsNewFollowers(),
    ]);
    setRefreshing(false);
  }, []);

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period.id);
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8e8e93" />
        <Text style={styles.loadingText}>{screenTexts.Loader}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Top
        left={true}
        leftType={"Back"}
        typeCenter={"Text"}
        textCenter={screenTexts.Top}
      />

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{screenTexts.Title}</Text>
          <PeriodSelector onPeriodChange={handlePeriodChange} />
        </View>

        <Text style={styles.subTextTitulo}>{screenTexts.Subtitle}</Text>

        {/* MÉTRICAS */}
        <View style={styles.metricsListContainer}>
          <TouchableOpacity
            onPress={() => navigate.navigate("Discover")}
            activeOpacity={0.8}
          >
            <MetricCard
              label={screenTexts.DiscoverWorldLabel}
              value={metricsWorld.porcentajeActual}
              percentageChange={metricsWorld.crecimiento}
              selectedPeriod={selectedPeriod}
              icon={blueGlove}
              height={false}
              delay={0}
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.metricCardWrapper}
            onPress={() => navigate.navigate("Home", { screen: 1 })}
            activeOpacity={0.8}
          >
            <MetricCard
              label={screenTexts.DiscoverLocationsLabel}
              value={metricsLocations.porcentajeActual}
              percentageChange={metricsLocations.crecimiento}
              selectedPeriod={selectedPeriod}
              icon={pin}
              height={true}
              delay={100}
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.metricCardWrapper}
            onPress={() => navigate.navigate("Transaction")}
            activeOpacity={0.8}
          >
            <MetricCard
              label={screenTexts.EarnedKylets}
              value={metricsKylets.porcentajeActual}
              percentageChange={metricsKylets.crecimiento}
              selectedPeriod={selectedPeriod}
              icon={corona}
              height={false}
              delay={200}
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.metricCardWrapper}
            onPress={() => navigate.navigate("Home", { screen: 0 })}
            activeOpacity={0.8}
          >
            <MetricCard
              label={screenTexts.FollowersLabel}
              value={metricsFollowers.porcentajeActual}
              percentageChange={metricsFollowers.crecimiento}
              selectedPeriod={selectedPeriod}
              icon={groupGray}
              height={false}
              delay={300}
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.metricCardWrapper}
            onPress={() => navigate.navigate("Home", { screen: 0 })}
            activeOpacity={0.8}
          >
            <MetricCard
              label={screenTexts.FriendsLabel}
              value={metricsFriends.porcentajeActual}
              percentageChange={metricsFriends.crecimiento}
              selectedPeriod={selectedPeriod}
              icon={groupGray}
              height={false}
              delay={400}
            />
          </TouchableOpacity>
        </View>

      </ScrollView>

      {error && <Error message={errorMessage} func={setError} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
    letterSpacing: -0.5,
  },
  subTextTitulo: {
    fontSize: 15,
    color: "#8e8e93",
    alignSelf: "flex-start",
    paddingHorizontal: 4,
    marginBottom: 24,
    lineHeight: 20,
  },
  metricsListContainer: {
    marginHorizontal: 0,
    paddingBottom: 48,
  },
  metricCardWrapper: {
    marginTop: -44,
  },
  newCustomersContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 0,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  newCustomersText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
    color: "#1a1a1a",
  },
  emojiText: {
    fontSize: 16,
  },
  welcomeText: {
    fontSize: 14,
    color: "#8e8e93",
    marginBottom: 20,
    lineHeight: 20,
  },
  avatarsContainer: {
    flexDirection: "row",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#8e8e93",
    fontWeight: "400",
  },
});

export default Metricas;
