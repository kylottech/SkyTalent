import React, { useState, useEffect, useRef } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Localization from 'expo-localization';
import { View, StyleSheet } from 'react-native';

const LocationAutocomplete = ({ placeholder, onSelect, type, value, keey }) => {
  const language = Localization.locale || 'en';
  const inputRef = useRef();
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [lastSearchText, setLastSearchText] = useState('');

  const fetchPlaceDetails = async ({ placeId, address, language }) => {
    try {
      const [responseEn, responseLang] = await Promise.all([
        fetch(
          `https://maps.googleapis.com/maps/api/${placeId ? 'place/details' : 'geocode'}/json?${placeId ? `place_id=${placeId}` : `address=${encodeURIComponent(address)}`}&language=en&key=AIzaSyCVq0nosHYjM755NaT-ZfndLS8WVX6GTno`
        ),
        fetch(
          `https://maps.googleapis.com/maps/api/${placeId ? 'place/details' : 'geocode'}/json?${placeId ? `place_id=${placeId}` : `address=${encodeURIComponent(address)}`}&language=${language}&key=AIzaSyCVq0nosHYjM755NaT-ZfndLS8WVX6GTno`
        ),
      ]);

      const resultEn = await responseEn.json();
      const resultLang = await responseLang.json();

      if (resultEn.status === 'OK' && resultLang.status === 'OK') {
        const place = placeId ? resultEn.result : resultEn.results[0];
        const placeLang = placeId ? resultLang.result : resultLang.results[0];

        const cityComponent = placeLang.address_components.find((comp) =>
          comp.types.includes('locality') || comp.types.includes('administrative_area_level_1')
        );
        const countryComponent = placeLang.address_components.find((comp) =>
          comp.types.includes('country')
        );

        if (!countryComponent) return null;

        const placeLanguage = {
          main_text: cityComponent?.long_name || countryComponent?.long_name || address,
          secondary_text: countryComponent?.long_name || '',
        };

        return { place, placeLanguage };
      }

      return null;
    } catch (error) {
      console.error('Error al obtener datos del lugar:', error);
      return null;
    }
  }

  const geocodeText = async (text) => {
    const result = await fetchPlaceDetails({ address: text, language });

    if (result) {
      const { place, placeLanguage } = result;
      onSelect(place, placeLanguage);
      return true;
    }

    return false;
  }

  const handlePlacePress = async (data) => {
    const result = await fetchPlaceDetails({ placeId: data.place_id, language });

    if (result) {
      const { place, placeLanguage } = result;
      onSelect(place, placeLanguage);
      setShowSuggestions(false);
    }
  }


  useEffect(() => {
    if (inputRef.current && value !== undefined) {
      inputRef.current.setAddressText(value || '');
    }
  }, [value]);

  // Efecto para limpiar cuando el componente se desmonta o el valor se resetea
  useEffect(() => {
    if (!value && inputRef.current) {
      inputRef.current.setAddressText('');
    }
  }, [value]);

  return (
    <View style={styles.autocompleteContainer}>
      <GooglePlacesAutocomplete
        ref={inputRef}
        key={keey}
        keepResultsAfterBlur={showSuggestions ? false : true}
        placeholder={placeholder}
        fetchDetails={true}
        minLength={2}
        onFocus={() => setShowSuggestions(true)}
        onPress={(data) => handlePlacePress(data)}
        // Nueva función para manejar cambios de texto
        onNotFound={() => {
          // Se ejecuta cuando no se encuentran resultados
          if (lastSearchText.length >= 3) {
            setTimeout(() => geocodeText(lastSearchText), 500);
          }
        }}
        query={{
          key: 'AIzaSyCVq0nosHYjM755NaT-ZfndLS8WVX6GTno',
          language: language,
          types: type,
        }}
        textInputProps={{
          defaultValue: value || '',
          onChangeText: (text) => {
            setLastSearchText(text);
          },
          onBlur: () => {
            // Cuando pierde el foco, intenta geocodificar si no se seleccionó nada
            setTimeout(() => {
              if (lastSearchText.length >= 3) {
                geocodeText(lastSearchText);
              }
            }, 300);
            setShowSuggestions(false);
          },
        }}
        styles={{
          container: {
            flex: 0,
            position: 'relative',
            width: '100%',
            zIndex: 9999,
          },
          textInput: styles.textInput,
          listView: {
            position: 'absolute',
            top: 50,
            left: 0,
            right: 0,
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: '#E5E7EB',
            borderRadius: 5,
            zIndex: 9999,
            elevation: 999,
          },
          row: {
            padding: 13,
            height: 44,
            flexDirection: 'row',
          },
          separator: {
            height: 1,
            backgroundColor: '#E5E7EB',
          },
          description: {
            fontSize: 15,
          },
          poweredContainer: {
            display: 'none',
          },
        }}
        enablePoweredByContainer={false}
        nearbyPlacesAPI="GooglePlacesSearch"
        listViewDisplayed="auto"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  autocompleteContainer: {
    width: '100%',
    zIndex: 9999,
    elevation: 999,
  },
  textInput: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#f2f2f2',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
});

export default LocationAutocomplete;