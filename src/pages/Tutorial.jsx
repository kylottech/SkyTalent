import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../context/useUser";
import Top from "../components/Utils/Top";
import { TutorialCard } from "../components/Utils/TutorialCard";

const SCREEN_WIDTH = Dimensions.get("window").width;

const Tutorial = () => {
  const navigate = useNavigation();
  const { isLogged, isLoading, texts } = useUser();
  const screenTexts = texts.pages.Tutorial;

  const [selectedTab, setSelectedTab] = useState("tutorial");
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const getStaticImage = (filename) => {
  switch (filename) {
    case "Tutorial1.jpg":
      return require("../../assets/Tutorial1.jpg");
    case "Tutorial2.jpg":
      return require("../../assets/Tutorial2.jpg");
    case "Tutorial3.jpg":
      return require("../../assets/Tutorial3.jpg");
    case "Tutorial4.jpg":
      return require("../../assets/Tutorial4.jpg");
    case "Tutorial5.jpg":
      return require("../../assets/Tutorial5.jpg");
    case "Tutorial6.jpg":
      return require("../../assets/Tutorial6.jpg");
    case "Tutorial7.jpg":
      return require("../../assets/Tutorial7.jpg");
    case "Tutorial8.jpg":
      return require("../../assets/Tutorial8.jpg");
    case "Tutorial9.jpg":
      return require("../../assets/Tutorial9.jpg");
    case "Tutorial10.jpg":
      return require("../../assets/Tutorial10.jpg");
    case "Tutorial11.jpg":
      return require("../../assets/Tutorial11.jpg");
    case "Tutorial14.jpg":
      return require("../../assets/Tutorial14.jpg");
    case "Tutorial15.jpg":
      return require("../../assets/Tutorial15.jpg");
    case "Tutorial16.jpg":
      return require("../../assets/Tutorial16.jpg");
    case "Tutorial17.jpg":
      return require("../../assets/Tutorial17.jpg");
    case "Tutorial18.jpg":
      return require("../../assets/Tutorial18.jpg");
    case "Tutorial19.jpg":
      return require("../../assets/Tutorial19.jpg");
    case "Tutorial20.jpg":
      return require("../../assets/Tutorial20.jpg");
    case "Tutorial21.jpg":
      return require("../../assets/Tutorial21.jpg");
    case "Tutorial22.jpg":
      return require("../../assets/Tutorial22.jpg");
  }
};


  const currentSteps =
    selectedTab === "tutorial" ? screenTexts.Tutorial : screenTexts.New;

  const subtitle =
    selectedTab === "tutorial"
      ? screenTexts.TitleTutorial
      : screenTexts.TitleNew;

  useEffect(() => {
    if (!isLoading && !isLogged) {
      navigate.navigate("Login");
    }
  }, [isLogged, isLoading]);

  const scrollToIndex = (index) => {
    // Animación de salida
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        easing: Easing.ease,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.92,
        duration: 250,
        easing: Easing.ease,
        useNativeDriver: true
      })
    ]).start(() => {
      // Cambiar de página
      scrollRef.current?.scrollTo({ x: index * SCREEN_WIDTH, animated: false });
      setCurrentIndex(index);
      
      // Animación de entrada
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 450,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: true
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 450,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: true
        })
      ]).start();
    });
  };

  const handleNext = () => {
    if (currentIndex < currentSteps.length - 1) {
      scrollToIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
      <Top
        left={true}
        leftType={"Back"}
        typeCenter={"Text"}
        textCenter={screenTexts.Top}
      />

      <View style={styles.tabMenu}>
        {["tutorial", "nuevo"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => {
              setSelectedTab(tab);
              setCurrentIndex(0);
              scrollToIndex(0);
            }}
            style={[styles.tabItem, selectedTab === tab && styles.tabItemSelected]}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.tabTextSelected
              ]}
            >
              {tab === "tutorial"
                ? screenTexts.MenuTutorial
                : screenTexts.MenuNew}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        style={styles.carouselContainer}
      >
        {currentSteps.map((step, index) => (
          <ScrollView 
            key={index}
            style={styles.pageScrollView}
            contentContainerStyle={styles.pageScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View 
              style={[
                styles.animatedContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }]
                }
              ]}
            >
              {index === 0 && (
                <View style={styles.header}>
                  <Text style={styles.title}>{screenTexts.Welcome}</Text>
                  <Text style={styles.subtitle}>{subtitle}</Text>
                </View>
              )}

              <View style={styles.cardContainer}>
                <TutorialCard
                  stepNumber={String(index + 1).padStart(2, "0")}
                  title={step.title}
                  description={step.description}
                  photo={getStaticImage(step.photo)}
                  isFirstStep={index === 0}
                  isLastStep={index === currentSteps.length - 1}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                />
              </View>
            </Animated.View>
          </ScrollView>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  carouselContainer: {
    flex: 1
  },
  pageScrollView: {
    width: SCREEN_WIDTH,
    flex: 1
  },
  pageScrollContent: {
    flexGrow: 1,
    paddingBottom: 20
  },
  animatedContainer: {
    flex: 1
  },
  tabMenu: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    marginBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#EAEAEA"
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8
  },
  tabItemSelected: {
    borderBottomWidth: 3,
    borderColor: "#1D7CE4"
  },
  tabText: {
    color: "#000",
    fontSize: 14
  },
  tabTextSelected: {
    fontWeight: "bold"
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
    paddingHorizontal: 16
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
    textAlign: "center"
  },
  subtitle: {
    fontSize: 16,
    color: "#4B5563",
    textAlign: "center"
  },
  cardContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10
  }
});

export default Tutorial;
