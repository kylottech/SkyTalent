import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useUser } from "../../context/useUser";
import { formatString } from '../../utils/formatString'
import Top from '../../components/Utils/Top';
import LocationAutocomplete from '../../components/Utils/LocationAutocomplete';
import GradientButton from '../../components/Utils/GradientButton';
import AddContactsModal from '../../components/Blocks/Community/Modals/AddContactsModal';
import AddTrickModal from '../../components/Blocks/Community/Modals/AddTrickModal';
import AddAdviceModal from '../../components/Blocks/Community/Modals/AddAdviceModal';
import LoadingOverlay from '../../components/Utils/LoadingOverlay';
import InfoModal from '../../components/Utils/InfoModal';

const LocationCreate = ({ route }) => {
  const { texts } = useUser();
  const screenTexts = texts.pages.ComunidadPages.LocationCreate;
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [cityData, setCityData] = useState('');
  const [countryData, setCountryData] = useState('');
  const [showTricksModal, setShowTricksModal] = useState(false);
  const [showAdviceModal, setShowAdviceModal] = useState(false);
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [showKyletsConfirmation, setShowKyletsConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [winKylets, setWinKylets] = useState(0);
  const [winKyletsText, setWinKyletsText] = useState('');

  useEffect(() => {
        
    if(winKylets !== 0){
      setWinKyletsText(formatString(screenTexts.KyletsTitle, { variable1: winKylets }))
      setShowKyletsConfirmation(true)
    }

  },[winKylets])

  const handleLocationSelect = (place, placeLanguage) => {
    const cityComponent = place.address_components.find((c) =>
      c.types.includes('locality')
    );
    const countryComponent = place.address_components.find((c) =>
      c.types.includes('country')
    );
  
    if (cityComponent) {
      setCity(placeLanguage.main_text);
      setCityData(cityComponent.short_name); // Guardamos en inglés
    }
  
    if (countryComponent) {
      setCountry(placeLanguage.secondary_text);
      setCountryData(countryComponent.long_name); // Guardamos en inglés
    }
  };
  
  const handleCountrySelect = (place, placeLanguage) => {
    const countryComponent = place.address_components.find((c) =>
      c.types.includes('country')
    );
  
    if (countryComponent) {
      setCountry(placeLanguage.main_text);
      setCountryData(countryComponent.long_name)// Guardamos en inglés
    }
  };

  const handleContinue = () => {
    if (country === '' || countryData === '') {
      // Puedes usar un modal, toast o alert según tu diseño
      Alert.alert(screenTexts.Alert1, screenTexts.Alert2);
      return;
    }
    else {
      if(route.params.tipo === "trucos"){
        setShowTricksModal(true)
      }
      else if(route.params.tipo === "consejos"){
        setShowAdviceModal(true)
      }
      else if(route.params.tipo === "contactos"){
        setShowContactsModal(true)
      }
    }
  };

  return (
    <View style={styles.container}>
        <Top left={true} leftType={"Back"} typeCenter={"Text"} textCenter={screenTexts.Top} />
        <View style={styles.content}>
            <Text style={styles.subtitle}>{screenTexts.Title}</Text>
            <Text style={styles.label}>{screenTexts.Subtitle}</Text>
            
            <View style={{ zIndex: 9999 }}>
              <Text style={styles.inputLabel}>{screenTexts.CityTitle}</Text>
              <LocationAutocomplete
                keey={`city`} // Key único para forzar re-render cuando sea necesario
                placeholder={screenTexts.CityPlaceHolder}
                type="(cities)"
                value={city}
                onSelect={handleLocationSelect}
              />
            </View>
            
            <View style={{ zIndex: 7000 }}>
              <Text style={styles.inputLabel}>{screenTexts.CountryTitle}</Text>
              <LocationAutocomplete
                keey={`country`} // Key único para forzar re-render cuando sea necesario
                placeholder={screenTexts.CountryPlaceHolder}
                type="(regions)"
                value={country}
                onSelect={handleCountrySelect}
              />
            </View>
            

            <View style={styles.buttonContainer}>
                <GradientButton color='Blue' text={screenTexts.GradientButton} onPress={handleContinue} />
            </View>
            </View>

            <AddContactsModal 
              isOpen={showContactsModal} 
              onClose={() => setShowContactsModal(false)}
              pais={countryData}
              ciudad={cityData}
              loading={loading} 
              setLoading={setLoading}
              setWinKylets={setWinKylets}
            />

            <AddTrickModal 
              isOpen={showTricksModal} 
              onClose={() => setShowTricksModal(false)} 
              pais={countryData}
              ciudad={cityData}
              loading={loading} 
              setLoading={setLoading}
              setWinKylets={setWinKylets}
            />

            <AddAdviceModal
              isOpen={showAdviceModal} 
              onClose={() => setShowAdviceModal(false)} 
              pais={countryData}
              ciudad={cityData}
              loading={loading} 
              setLoading={setLoading}
              setWinKylets={setWinKylets}
            />

            <InfoModal 
              celebration={true}
              isOpen={showKyletsConfirmation} 
              onClose={() => {setShowKyletsConfirmation(false), setWinKylets(0)} } 
              Title={winKyletsText} 
              Subtitle={screenTexts.KyletsSubtitle} 
              Button={screenTexts.KyletsButton} 
            />

            {loading && (
              <LoadingOverlay/>
            )}

        </View>
      
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 24,
    color: '#444',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignSelf: 'center'
  },
});

export default LocationCreate;
