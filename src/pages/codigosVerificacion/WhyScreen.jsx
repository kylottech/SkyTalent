import React, { useEffect } from "react";
import { View, ScrollView, Text, StyleSheet, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../../context/useUser";
import Top from "../../components/Utils/Top";

const WhyScreen = ({route}) => {
  const navigate = useNavigation();
  const { isLogged, isLoading, texts } = useUser();
  const screenTexts = texts.pages.codigosVerificacion.WhyScreen
  const { reason } = route.params

  
  useEffect(() => {
    if (!isLoading && !isLogged) {
      navigate.navigate("Login");
    }
  }, [isLogged, isLoading]);

  return (
    <ScrollView style={styles.container}>
      <Top left={true} leftType={"Back"} typeCenter={"Text"} textCenter={screenTexts.Top} />
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.tabText}>
            {screenTexts.Title}
          </Text>

          <View style={styles.stepsList}>
            {reason.map((num, index) => {
                const key = `Err${num}`;
                const text = screenTexts[key];
                return (
                    <Animated.View key={index+1} style={styles.stepItem}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={styles.numberContainer}>
                            <Text style={styles.stepNumber}>
                            {String(index+1).padStart(2, '0')}
                            </Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>{text}</Text>
                        </View>
                        </View>

                        
                        
                    </Animated.View>
                )
            })}
          </View>

        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF2FF',
  },
  content: {
    padding: 16,
    maxWidth: 768,
    alignSelf: 'center',
    width: '100%',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabMenu: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 32,
  },
  tabItem: {
    alignItems: 'center',
  },
  tabText: {
    fontSize: 20,
    color: '#111827',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  tabTextSelected: {
    color: '#2563EB',
  },
  tabUnderline: {
    marginTop: 4,
    height: 2,
    backgroundColor: '#2563EB',
    width: '100%',
  },
  header: {
    marginBottom: 48,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
  },
  stepsList: {
  },
  stepItem: {
    flexDirection: 'column',
    padding: 18,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 10
  },
  numberContainer: {
    flexShrink: 0,
  },
  stepNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1D7CE4',
  },
  stepContent: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 10,
    marginLeft: 15,
  },
  stepProgress: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  stepTitle: {
    fontSize: 14,
    color: '#111827',
    marginBottom: 8,
  },
  stepDescriptionContainer: {
    gap: 8,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  bulletText: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 2,
  },
  stepDescription: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 20,
    flex: 1,
    textAlign: 'justify',
  },
  footer: {
    marginTop: 48,
    paddingTop: 32,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563EB',
    textAlign: 'center',
  },
  Image: {
    alignSelf: 'center',
  }
});

export default WhyScreen;
