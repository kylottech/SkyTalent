import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useUser } from '../../../context/useUser';

export default function LanguagePicker({ onLanguageChange }) {
  const { getLanguages, setLanguage, language } = useUser();
  const [LANGUAGES, setLANGUAGES] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  useEffect(() => {
    const langs = getLanguages();
    setLANGUAGES(langs);
    setSelectedLanguage(language);
  }, []);

  useEffect(() => {
    if (selectedLanguage) {
      onLanguageChange?.(selectedLanguage);
      setLanguage(selectedLanguage);
    }
  }, [selectedLanguage]);

  const handleLanguageSelect = (lang) => {
    setSelectedLanguage(lang);
  };


  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Selecciona tu idioma preferido</Text>
        <Text style={styles.cardSubtitle}>Puedes cambiarlo en cualquier momento</Text>
        
        <View style={styles.languageList}>
          {LANGUAGES.map((lang, index) => {
            const isSelected = selectedLanguage === lang;
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.languageItem,
                  isSelected && styles.selectedLanguageItem,
                ]}
                onPress={() => handleLanguageSelect(lang)}
                activeOpacity={0.7}
              >
                <View style={styles.languageContent}>
                  <Text
                    style={[
                      styles.languageName,
                      isSelected && styles.selectedLanguageName,
                    ]}
                  >
                    {lang}
                  </Text>
                </View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 32,
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#002B5C',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  languageList: {
    gap: 8,
  },
  languageItem: {
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
  selectedLanguageItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: '#FFFFFF',
    borderWidth: 2,
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: -0.2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  selectedLanguageName: {
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
