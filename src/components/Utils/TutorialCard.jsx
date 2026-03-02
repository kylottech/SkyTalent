import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing
} from "react-native";
import { useUser } from "../../context/useUser";

export const TutorialCard = ({
  stepNumber,
  title,
  description,
  photo,
  onPrevious,
  onNext,
  isFirstStep,
  isLastStep
}) => {
  const { texts } = useUser();
  const screenTexts = texts.components.Utils.TutorialCard;
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  
  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    if (photo) {
      const source = Image.resolveAssetSource(photo);
      if (source?.width && source?.height) {
        setImageDimensions({ width: source.width, height: source.height });
      }
    }
  }, [photo]);

  useEffect(() => {
    // Animación de entrada con efecto más suave
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 40,
        friction: 8,
        useNativeDriver: true
      })
    ]).start();
  }, []);
  return (
    <Animated.View 
      style={[
        styles.card,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.stepNumberContainer}>
          <Text style={styles.stepNumber}>{stepNumber}</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.tutorialLabel}>{screenTexts.Title1}</Text>
          <Text style={styles.tutorialSource}>{screenTexts.Title2}</Text>
        </View>
      </View>

      {/* Image */}
      <Image
        source={photo}
        style={[
          styles.image,
          {
            aspectRatio: imageDimensions.width / imageDimensions.height || 1,
            height: undefined
          }
        ]}
        resizeMode="contain"
      />

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <View>
          {description.map((line, index) => (
            <Text key={index} style={styles.descriptionText}>
              {line}
            </Text>
          ))}
        </View>
      </View>

      {/* Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity
          onPress={() => onPrevious()}
          disabled={isFirstStep}
          style={[styles.button, isFirstStep && styles.buttonDisabled]}
        >
          <Text>{screenTexts.PreviousButton}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onNext()}
          disabled={isLastStep}
          style={[styles.button, isLastStep && styles.buttonDisabled]}
        >
          <Text>{screenTexts.NextButton}</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
    width: '100%',
    alignSelf: "center"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24
  },
  stepNumberContainer: {
    position: "relative"
  },
  stepNumber: {
    fontSize: 56,
    fontWeight: "900",
    color: "#1D7CE4",
    opacity: 0.15,
    letterSpacing: -2
  },
  tutorialLabel: {
    fontSize: 14,
    color: "#9CA3AF"
  },
  tutorialSource: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937"
  },
  image: {
    width: "100%",
    borderRadius: 12,
    marginBottom: 24
  },
  content: {
    marginBottom: 24
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12
  },
  descriptionText: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 22
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3
  },
  buttonDisabled: {
    opacity: 0.5
  }
});
