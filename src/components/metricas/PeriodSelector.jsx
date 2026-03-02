import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, Animated } from 'react-native';
import { useUser } from '../../context/useUser'


export default function PeriodSelector({ onPeriodChange }) {
  const { texts }=useUser()
  const screenTexts = texts.components.metricas.PeriodSelector
  const [modalVisible, setModalVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0.9)).current;
  
  const periods = [
    { id: 1, label: screenTexts.LastDay },
    { id: 7, label: screenTexts.LastWeek },
    { id: 30, label: screenTexts.LastMonth },
    { id: 90, label: screenTexts.Last3Month },
    { id: 180, label: screenTexts.Last6Month },
    { id: 365, label: screenTexts.LastYear },
  ];
  const [selectedPeriod, setSelectedPeriod] = useState(periods[0])

  useEffect(() => {
    if (modalVisible) {
      Animated.parallel([
        Animated.timing(modalOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(modalScale, {
          toValue: 1,
          tension: 100,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      modalOpacity.setValue(0);
      modalScale.setValue(0.9);
    }
  }, [modalVisible]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleSelect = (period) => {
    setSelectedPeriod(period);
    onPeriodChange(period);
    setModalVisible(false);
  };

  return (
    <>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity 
          style={styles.periodSelector} 
          onPress={() => setModalVisible(true)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
        >
          <Text style={styles.periodText}>{selectedPeriod.label}</Text>
          <View style={styles.chevronContainer}>
            <Text style={styles.chevron}>▾</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <Animated.View 
            style={[
              styles.modalContent,
              {
                opacity: modalOpacity,
                transform: [{ scale: modalScale }]
              }
            ]}
          >
            <View style={styles.modalHandle} />
            
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{screenTexts.PeriodTouchable}</Text>
            </View>
            
            <View style={styles.periodsList}>
              {periods.map((item, index) => (
                <TouchableOpacity 
                  key={item.id}
                  style={[
                    styles.periodItem,
                    selectedPeriod.id === item.id && styles.selectedPeriodItem,
                    index === periods.length - 1 && styles.lastItem
                  ]}
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.6}
                >
                  <Text 
                    style={[
                      styles.periodItemText,
                      selectedPeriod.id === item.id && styles.selectedPeriodItemText
                    ]}
                  >
                    {item.label}
                  </Text>
                  {selectedPeriod.id === item.id && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  periodSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingLeft: 14,
    paddingRight: 10,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    marginTop: 5,
  },
  periodText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
    marginRight: 6,
  },
  chevronContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#f5f5f7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevron: {
    fontSize: 10,
    color: '#8e8e93',
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
    overflow: 'hidden',
  },
  modalHandle: {
    width: 36,
    height: 4,
    backgroundColor: '#d1d1d6',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  modalHeader: {
    paddingHorizontal: 24,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e8e8e8',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: -0.3,
  },
  periodsList: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  periodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginVertical: 3,
    backgroundColor: 'transparent',
  },
  selectedPeriodItem: {
    backgroundColor: '#f5f5f7',
  },
  lastItem: {
    marginBottom: 8,
  },
  periodItemText: {
    fontSize: 16,
    color: '#3a3a3c',
    fontWeight: '500',
  },
  selectedPeriodItemText: {
    fontWeight: '600',
    color: '#007AFF',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
