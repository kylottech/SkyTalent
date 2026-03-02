import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import { useUser } from '../../context/useUser'

export default function MetricCard({
  label,
  value,
  percentageChange,
  icon,
  selectedPeriod,
  height,
  delay = 0
}) {
  const { texts }=useUser()
  const screenTexts = texts.components.metricas.MetricCard
  const isPositive = percentageChange >= 0;
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: delay,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        delay: delay,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay]);

  const getTimeAgoText = () => {
    if (selectedPeriod === 1) {
      return screenTexts.LastDay;
    } else if (selectedPeriod === 7) {
      return screenTexts.LastWeek;
    } else if (selectedPeriod === 30) {
      return screenTexts.LastMonth;
    } else if (selectedPeriod === 90) {
      return screenTexts.Last3Month;
    } else if (selectedPeriod === 180) {
      return screenTexts.Last6Month;
    } else if (selectedPeriod === 365) {
      return screenTexts.LastYear;
    } else {
      return screenTexts.NotAvaliable;
    }
  }
  
  return (
    <Animated.View 
      style={[
        styles.metricCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={styles.leftSection}>
        <View style={styles.metricIconContainer}>
          <Image source={icon} style={height ? styles.iconAlt : styles.icon}/>
        </View>
        <View style={styles.textSection}>
          <Text style={styles.metricLabel}>{label}</Text>
          <View style={styles.percentageContainer}>
            <Text 
              style={[ 
                styles.percentageText, 
                isPositive ? styles.positivePercentage : styles.negativePercentage
              ]}
            >
              {isPositive ? '↑' : '↓'} {Math.abs(percentageChange).toFixed(1)}%
            </Text>
            <Text style={styles.comparisonText} numberOfLines={1} ellipsizeMode="tail">vs {getTimeAgoText()}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.metricValue}>{value}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  metricCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 68,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 0,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    paddingTop: 2,
  },
  metricIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    width: 24,
    height: 24,
  },
  iconAlt: {
    width: 16,
    height: 24,
  },
  textSection: {
    flex: 1,
    paddingTop: 2,
  },
  metricLabel: {
    fontSize: 18,
    color: '#1a1a1a',
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 22,
  },
  metricValue: {
    fontSize: 38,
    fontWeight: '300',
    color: '#1a1a1a',
    letterSpacing: -1.2,
    marginLeft: 12,
  },
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  percentageText: {
    fontSize: 13,
    fontWeight: '600',
    marginRight: 4,
  },
  positivePercentage: {
    color: '#34C759',
  },
  negativePercentage: {
    color: '#FF3B30',
  },
  comparisonText: {
    fontSize: 13,
    color: '#8e8e93',
    fontWeight: '400',
  },
});
