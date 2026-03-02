import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useUser } from "../../../context/useUser";

export default function GenderPicker({ onGenderChange, initialGender }) {
  const { texts } = useUser();
  const screenTexts = texts.components.Login.Registro.GernderPicker;

  const GENDERS = [
    screenTexts.Male,
    screenTexts.Female,
    screenTexts.Other
  ];

  const [selectedGender, setSelectedGender] = useState(initialGender);

  useEffect(() => {
    if (selectedGender) {
      onGenderChange?.(selectedGender);
    }
  }, [selectedGender]);

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
  };

  return (
    <View style={styles.container}>
      <View style={styles.genderList}>
        {GENDERS.map((gender, index) => {
          const isSelected = selectedGender === gender;
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.genderItem,
                isSelected && styles.selectedGenderItem,
              ]}
              onPress={() => handleGenderSelect(gender)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.genderText,
                  isSelected && styles.selectedGenderText,
                ]}
              >
                {gender}
              </Text>
              {isSelected && (
                <View style={styles.selectedIndicator}>
                  <View style={styles.checkmark} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
  },
  genderList: {
    width: '100%',
    gap: 8,
  },
  genderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#002B5C',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 2,
  },
  selectedGenderItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: '#FFFFFF',
    borderWidth: 2,
  },
  genderText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: -0.2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  selectedGenderText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  selectedIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  checkmark: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
});
