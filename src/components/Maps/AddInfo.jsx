import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useUser } from "../../context/useUser";
import info from '../../../assets/info.png';
import SearcherInputMultiple from '../Utils/SearcherInputMultiple';
import CategoryInput from '../Utils/CategoryInput';

const AddInfo = (props) => {
  const { texts } = useUser();
  const screenTexts = texts.components.Maps.AddInfo;

  const [lugar1, setLugar1] = useState(() => ({
    name: props?.lugar?.name ?? '',
    categoria: props?.lugar?.categoria ?? {},
    experiencia: props?.lugar?.experiencia ?? '',
    amigo: Array.isArray(props?.lugar?.amigo) ? props.lugar.amigo : [],
    recomendacion: props?.lugar?.recomendacion ?? '',
    nota: props?.lugar?.voted?.number ?? 0,
    location: {
      latitude: props?.lugar?.location?.latitude ?? 0,
      longitude: props?.lugar?.location?.longitude ?? 0,
    }
  }));

  const [selectedUsers, setSelectedUsers] = useState(Array.isArray(props?.lugar?.amigo) ? props.lugar.amigo : []);

  // Effect removed to prevent form reset on props.lugar change

  // Propaga amigos seleccionados
  useEffect(() => {
    setLugar1(prev => ({ ...prev, amigo: selectedUsers }));
    props.func?.(prev => ({ ...prev, amigo: selectedUsers }));
  }, [selectedUsers]);

  const handleInputChange = (field, value) => {
    setLugar1(prevLugar => ({
      ...prevLugar,
      [field]: value,
    }));

    if (field === 'name' && typeof props.func2 === 'function') {
      props.func2(value);
    }

    props.func?.(prevLugar => ({
      ...prevLugar,
      [field]: value,
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.titleWithInfo}>
          <Text style={styles.title}>{screenTexts.Title}</Text>
          <TouchableOpacity style={styles.infoButton} onPress={props.modal}>
            <Image source={info} style={styles.infoIcon}/>
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>{screenTexts.Subtitle}</Text>
      </View>

      <TextInput
        style={styles.inputFull}
        placeholder={screenTexts.LocationNamePlaceHolder}
        value={lugar1.name}
        onChangeText={(value) => handleInputChange('name', value)}
      />

      <CategoryInput
        title={false}
        setUserInfo={(value) => handleInputChange('categoria', value)}
        userInfo={lugar1.categoria}
        setError={props.setError}
        setErrorMessage={props.setErrorMessage}
        inputStyle={styles.inputFull}
      />

      <TextInput
        style={styles.inputFull}
        placeholder={screenTexts.BestExperiencePlaceHolder}
        value={lugar1.experiencia}
        onChangeText={(value) => handleInputChange('experiencia', value)}
      />

      <TextInput
        style={styles.inputFull}
        placeholder={screenTexts.RecomendationPlaceHolder}
        value={lugar1.recomendacion}
        onChangeText={(value) => handleInputChange('recomendacion', value)}
      />

      {/* SearcherInputMultiple component commented out */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: 'white',
  },
  headerContainer: {
    marginTop: 24,
    flex: 1,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  titleWithInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  infoButton: {
    padding: 8,
  },
  infoIcon: {
    width: 18,
    height: 18,
  },
  inputFull: {
    width: '90%',
    height: 52,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingLeft: 10,
    marginBottom: 10,
    alignSelf: 'center',
  },
});

export default AddInfo;
