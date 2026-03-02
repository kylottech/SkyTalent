import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useUser } from "../../context/useUser";
import Top from '../../components/Utils/Top';
import GradientButton from '../../components/Utils/GradientButton';

const LanguageSelector = () => {
    const navigation = useNavigation();
    const { isLoading, isLogged, getLanguages, setLanguage, language, texts } = useUser();
    const screenTexts = texts.pages.AjustesPerfil.LanguageSelector

    const [LANGUAGES, setLANGUAGES] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState(null);

    useEffect(() => { 
      if (!isLoading && !isLogged) {
          navigation.navigate('Login');
      }
    }, [isLogged, isLoading])
    
    useEffect(() => {
        const langs = getLanguages();
        setLANGUAGES(langs);
        setSelectedLanguage(language);
    }, []);

    const handleContinue = () => {
        if (selectedLanguage) {
            setLanguage(selectedLanguage);
            navigation.goBack();
        }
    };

  return (
    <View style={styles.container}>
      <Top 
        left={true}
        leftType={'Back'}
        typeCenter={'Text'}
        textCenter={screenTexts.Top || 'Cambiar idioma'}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Label */}
        <Text style={styles.label}>{screenTexts.Title || 'Idioma de la aplicación'}</Text>

        {/* Language Options */}
        {LANGUAGES.map((lang, index) => (
          <TouchableOpacity 
            key={index} 
            style={[
              styles.languageOption,
              selectedLanguage === lang && styles.selectedLanguageOption
            ]}
            onPress={() => setSelectedLanguage(lang)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.languageText,
              selectedLanguage === lang && styles.selectedLanguageText
            ]}>
              {lang}
            </Text>
            {selectedLanguage === lang && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* Save Button */}
        <GradientButton 
          color="Blue"
          text={screenTexts.Button || 'Guardar cambios'}
          onPress={handleContinue}
          disabled={!selectedLanguage}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 20,
    marginBottom: 4,
  },
  languageOption: {
    width: '98%',
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    borderColor: '#E5E5EA',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'center',
  },
  selectedLanguageOption: {
    backgroundColor: '#E8F4FF',
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  languageText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#1A1A1A',
  },
  selectedLanguageText: {
    fontSize: 16,
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
    fontSize: 14,
    color: 'white',
    fontWeight: '700',
  },
});

export default LanguageSelector;

