import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Image, Alert, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../../context/useUser";
import { uploadStep } from '../../services/routeServices';

import Top from '../../components/Utils/Top';
import AddHistoria from '../../components/user/AddHistoria';
import GradientButton from '../../components/Utils/GradientButton';
import LoadingOverlay from '../../components/Utils/LoadingOverlay';
import Error from '../../components/Utils/Error';

const AddRoute = ({ route }) => {
  const navigate = useNavigation();
  const { isLogged, isLoading, logout, texts } = useUser();
  const screenTexts = texts.pages.Mapas.AddRoute;

  const { _id, setConfirmacion, setConfirmacionMensaje } = route.params;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [media, setMedia] = useState([]);

  useEffect(() => {
    if (!isLoading && !isLogged) {
      navigate.navigate('Login');
    }
  }, [isLogged, isLoading]);

  const handleSubmit = () => {
    setLoading(true);

    if (media.length === 0) {
        setError(true);
        setErrorMessage(screenTexts.SelectedImageError);
        setLoading(false);
        return;
    }

    uploadStep({
        _id: _id,
        selectedImages: media,
        logout,
        setErrorMessage
    })
    .then(() => {
    setConfirmacion(true);
    setConfirmacionMensaje(screenTexts.UploadConfirmation);
    setLoading(false);
    navigate.goBack();
    })
    .catch((error) => {
    setError(true);
    setErrorMessage(error.message);
    setLoading(false);
    });
  };


  return (
    <View style={styles.container}>
      <Top
        left={true}
        leftType={'Back'}
        typeCenter={'Text'}
        textCenter={screenTexts.Top}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{screenTexts.Title}</Text>
          <Text style={styles.subtitle}>
            {screenTexts.SubTitle}
          </Text>
        </View>

        {/* Botones con AddHistoria */}
        <View style={styles.row}>
          <AddHistoria option='camera' setImages={setMedia} />
          <AddHistoria option='gallery' setImages={setMedia} />
        </View>

        {/* Previsualización */}
        {media.length > 0 && (
          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>{screenTexts.SelectedImage}</Text>
            <FlatList
              horizontal
              data={media}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.imagesContainer}
              renderItem={({ item, index }) => (
                <View style={styles.imageWrapper}>
                  {item.type === 'video' ? (
                    <View style={styles.videoPlaceholder}>
                      <Text>{screenTexts.Video}</Text>
                    </View>
                  ) : (
                    <Image source={{ uri: item.uri }} style={styles.image} />
                  )}
                  <TouchableOpacity style={styles.removeButton} onPress={() => {
                    const newMedia = media.filter((_, i) => i !== index);
                    setMedia(newMedia);
                  }}>
                    <Text style={styles.removeImage}>X</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        )}

        <GradientButton
          text={screenTexts.GradientButton}
          color="Blue"
          onPress={handleSubmit}
        />
      </ScrollView>

      {error && <Error message={errorMessage} func={setError} />}
      {loading && <LoadingOverlay />}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    height: 200,
    marginBottom: 20,
  },
  previewContainer: {
    marginTop: 20,
    marginBottom: 24,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  imagesContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  image: {
    width: 140,
    height: 200,
    borderRadius: 15,
  },
  videoPlaceholder: {
    width: 140,
    height: 200,
    borderRadius: 15,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImage: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});



export default AddRoute;
