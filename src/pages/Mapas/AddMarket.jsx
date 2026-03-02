import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView, FlatList, Image, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import ImageView from 'react-native-image-viewing';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../../context/useUser";
import { histories } from '../../services/profileService';
import { updatePlace } from '../../services/mapsService'
import { createPlace } from '../../services/kyletsServices'
import { formatString } from '../../utils/formatString'
import MapContainer from '../../components/Maps/MapContainer';
import AddHistoria from '../../components/user/AddHistoria';
import AddInfo from '../../components/Maps/AddInfo';
import StarRating from '../../components/Utils/StarRating';
import StoriesScroll from '../../components/Utils/Stories';
import LoadingOverlay from '../../components/Utils/LoadingOverlay';
import Error from '../../components/Utils/Error';
import InfoModal from '../../components/Utils/InfoModal';
import GradientButton from '../../components/Utils/GradientButton';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import ToggleSwitch from 'toggle-switch-react-native';
import info from '../../../assets/info.png';
import x from '../../../assets/x.png';

// --- Normalizador para info en modo edición ---
function normalizeInfo(raw, language, translateTag) {
  if (!raw || typeof raw !== 'object') return {
    _id: null,
    name: '',
    categoria: {},
    experiencia: '',
    recomendacion: '',
    amigo: [],
    nota: 0,
    location: { latitude: 0, longitude: 0 },
    photos: [],
    urls: [],
  };
  const newCategory = translateTag(raw.categoria, language)
  const hasGeo = raw?.location?.type === 'Point' && Array.isArray(raw?.location?.coordinates);
  const latitude = hasGeo ? Number(raw.location.coordinates[1]) : Number(raw?.location?.latitude ?? 0);
  const longitude = hasGeo ? Number(raw.location.coordinates[0]) : Number(raw?.location?.longitude ?? 0);

  return {
    _id: raw?._id ?? null,
    name: raw?.name ?? '',
    categoria: newCategory,
    experiencia: raw?.experiencia ?? '',
    recomendacion: raw?.recomendacion ?? raw?.comentario ?? '',
    amigo: Array.isArray(raw?.amigo) ? raw.amigo : [],
    // nota desde voted.number; fallback a puntuacion
    nota: typeof raw?.voted?.number === 'number'
      ? raw.voted.number
      : (typeof raw?.puntuacion === 'number' ? raw.puntuacion : 0),
    location: { latitude, longitude },

    // Fotos remotas como URLs para previsualización
    photos: Array.isArray(raw?.photos) ? raw.photos.map(p => ({ url: p.url })) : [],
    urls: Array.isArray(raw?.urls) ? raw.urls : [],
  };
}

const AddMarket = ({ route }) => {
  const navigate = useNavigation();
  
  const { isLogged, isLoading, logout, texts, language, translateTag } = useUser();
  const isEdit = route?.params?.type === 'edit';
  // Acepta formatos: info plano o info.lugar
  const rawInfo = route?.params?.info?.lugar ?? route?.params?.info ?? {};
  const infoFromParams = isEdit ? normalizeInfo(rawInfo, language, translateTag) : {};

  // Fuente de verdad del "lugar" según modo
  const baseLugar = useMemo(() => {
    return isEdit ? (infoFromParams || {}) : (route?.params?.lugar || {});
  }, [isEdit, infoFromParams, route?.params?.lugar]);

  const [step, setStep] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [modalSubtitle, setModalSubtitle] = useState('');
  const [kyletsInfo, setKyletsInfo] = useState(null);
  const screenTexts = texts.pages?.Mapas?.AddMarket || {};
  const mapRef = useRef(null);

  // Estado local para modo edición
  const [editLugar, setEditLugar] = useState(() => (isEdit ? { ...baseLugar } : null));

  // NUEVO: estado local para modo creación
  const [createLugar, setCreateLugar] = useState(() => (!isEdit ? { ...baseLugar } : null));

  const [origin, setOrigin] = useState({
    latitude: baseLugar?.location?.latitude || 0,
    longitude: baseLugar?.location?.longitude || 0,
  });

  const [historiesInfo, setHistoriesInfo] = useState({});
  const [titleMoment, setTitleMoment] = useState(baseLugar?.name || '');
  // En modo edición el toggle está siempre en false
  const [toggleExperience, setToggleExperience] = useState(isEdit ? false : !!baseLugar?.momento);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');

  // --- Fotos/URLs iniciales según modo ---
  // En edición: fotos remotas de infoFromParams.photos/urls entran como URLs; locales vacías
  const initialPhotosSrc = isEdit ? [] : (route?.params?.photos || []);
  const initialUrlsSrc   = isEdit
    ? ([...(infoFromParams?.photos || []), ...(infoFromParams?.urls || [])])
    : (route?.params?.urls || []);

  // Normalizar imágenes a estructura homogénea
  const rawPhotos = Array.isArray(initialPhotosSrc)
    ? initialPhotosSrc.map(photo => ({
        url: typeof photo === 'string' ? photo : photo.url,
        perfil: false,
      }))
    : [];

  const rawUrls = Array.isArray(initialUrlsSrc)
    ? initialUrlsSrc.map(urlObj => ({
        url: typeof urlObj === 'string' ? urlObj : urlObj.url,
        perfil: urlObj?.perfil || false,
      }))
    : [];

  const combinedPhotosInit = [...rawPhotos, ...rawUrls];
  if (!combinedPhotosInit.some(img => img.perfil)) {
    if (combinedPhotosInit.length > 0) combinedPhotosInit[0].perfil = true;
  }

  const [images, setImages] = useState(combinedPhotosInit);

  const openModal = (index) => {
    setSelectedImageIndex(index);
    setModalVisible(true);
  };
  const closeModal = () => setModalVisible(false);

  // En modo creación, sincroniza con pantalla anterior; en edición, NO
  useEffect(() => {
    if (isEdit) return;
    const newPhotos = images.filter(image => image.url?.startsWith('file://'));
    const newUrls = images.filter(image => image.url?.startsWith('http'));
    route?.params?.setPhotos?.(newPhotos);
    route?.params?.setUrls?.(newUrls);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTexts = (type) => {
    if (kyletsInfo) {
      if (type === 'info') {
        const reward = kyletsInfo.createPlaceInfo;
        setModalSubtitle(reward === 0 ? screenTexts.NotWinKyletsModalSubtitle : (formatString(screenTexts.WinKyletsModalSubtitle, { variable1: reward })));
      } else if (type === 'valoracion') {
        const reward = kyletsInfo.createPlaceValoration;
        setModalSubtitle(reward === 0 ? screenTexts.NotWinKyletsModalSubtitle : (formatString(screenTexts.WinKyletsModalSubtitle, { variable1: reward })));
      } else if (type === 'photos') {
        const reward = kyletsInfo.createPlacePhoto;
        if (Array.isArray(reward)) {
          const allZero = reward.every(val => val === 0);
          if (allZero) {
            setModalSubtitle(screenTexts.NotWinKyletsModalSubtitle);
          } else {
            let message = screenTexts.WinKyletsModalPhoto1;
            if (reward[0] > 0) message += reward[0] + screenTexts.WinKyletsModalPhoto2;
            if (reward[1] > 0) message += reward[1] + screenTexts.WinKyletsModalPhoto3;
            if (reward[2] > 0) message += reward[2] + screenTexts.WinKyletsModalPhoto4;
            setModalSubtitle(message.trim().replace(/,\s*$/, ''));
          }
        } else if (typeof reward === 'number') {
          setModalSubtitle(reward === 0 ? screenTexts.NotWinKyletsModalSubtitle : (formatString(screenTexts.WinKyletsModalSubtitle, { variable1: reward })));
        }
      }
      setShowConfirmation(true);
    }
  };

  useEffect(() => {
    handleKylets();
  }, []);

  useEffect(() => {
    if (!isLoading && !isLogged) {
      navigate.navigate('Login');
    }
  }, [isLogged, isLoading]);

  const handleGethistories = async () => {
    try {
      histories(logout)
        .then((response) => {
          setHistoriesInfo(response);
          setCargando(true);
        })
        .catch((error) => {
          setError(true);
          setErrorMessage(error.message);
        });
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
    }
  };

  // Helpers para actualizar según modo
  const updateLugar = useCallback((updater) => {
    if (isEdit) {
      setEditLugar(prev => (typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }));
    } else {
      setCreateLugar(prev => (typeof updater === 'function' ? updater(prev || {}) : { ...(prev || {}), ...updater }));
      route?.params?.func?.(updater);
    }
  }, [isEdit, route?.params]);

  const updateLugar2 = useCallback((updater) => {
    if (isEdit) {
      setEditLugar(prev => (typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }));
    } else {
      setCreateLugar(prev => (typeof updater === 'function' ? updater(prev || {}) : { ...(prev || {}), ...updater }));
      route?.params?.func2?.(updater);
    }
  }, [isEdit, route?.params]);

  const handleLocationChange = (newLocation) => {
    updateLugar((prevLugar) => ({
      ...prevLugar,
      location: {
        ...(prevLugar?.location || {}),
        latitude: newLocation.latitude,
        longitude: newLocation.longitude,
      },
    }));
    setOrigin(newLocation);
  };

  const handleRatingChange = (newRating) => {
    updateLugar((prevLugar) => ({
      ...prevLugar,
      nota: newRating,
    }));
  };

  const handleMomentoChange = (value) => {
    if (isEdit) return; // en edición no se toca, siempre false
    setToggleExperience(value);
    updateLugar((prevLugar) => ({
      ...prevLugar,
      momento: value,
    }));
  };

  const handleNameChange = (value) => {
    setTitleMoment(value);
    updateLugar((prevLugar) => ({
      ...prevLugar,
      name: value,
    }));
  };

  const syncImagesToParentsIfNeeded = (imgs) => {
    if (isEdit) return;
    const newPhotos = imgs.filter(image => image.url && image.url.startsWith('file://'));
    const newUrls = imgs.filter(image => typeof image.url === 'string' && image.url.startsWith('http'));
    route?.params?.setPhotos?.(newPhotos);
    route?.params?.setUrls?.(newUrls);
  };

  const handleRemoveImage = (index) => {
    const removedImageHadPerfil = images[index]?.perfil;
    let newImages = images.filter((_, i) => i !== index);

    if (removedImageHadPerfil && newImages.length > 0) {
      newImages = newImages.map((img, i) => ({ url: img.url, perfil: i === 0 }));
    }

    setImages(newImages);
    syncImagesToParentsIfNeeded(newImages);
  };

  const handleKylets = async () => {
    try {
      createPlace(logout)
        .then((response) => {
          setKyletsInfo(response);
        })
        .catch((error) => {
          setError(true);
          setErrorMessage(error.message);
        });
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
    }
  };

  const handleClose = () => {
    navigate.goBack();
  };

  // ========= NUEVO: actualizar lugar en modo edición =========
  const handleUpdateUbi = async ({ errorBolean, errorMensaje, setLoading2 }) => {
    const lugar = editLugar || {};
    const placeId = infoFromParams?._id || lugar?._id || (route?.params?.info?._id ?? route?.params?.info?.lugar?._id ?? null);

    // separa imágenes: nuevas (file://) vs remotas (http)
    const newPhotos = images
      .filter(img => typeof img?.url === 'string' && img.url.startsWith('file://'))
      .map(p => ({ url: p.url, perfil: !!p.perfil }));

    const urls = images
      .filter(img => typeof img?.url === 'string' && img.url.startsWith('http'))
      .map(p => ({ url: p.url, perfil: !!p.perfil }));

    try {
      if (newPhotos.length > 10) {
        errorBolean(true);
        errorMensaje(screenTexts.AmountPhotosError);
        setLoading2(false);
        return;
      }

      const totalPhotos = newPhotos.length + urls.length;

      if (
        placeId &&
        (lugar?.name ?? '').trim() !== '' &&
        (lugar?.categoria?._id ?? '').trim() !== '' &&
        typeof lugar?.nota === 'number' && lugar.nota > 0 && lugar.nota <= 7 &&
        typeof lugar?.location?.longitude === 'number' && lugar.location.longitude >= -180 && lugar.location.longitude <= 180 &&
        typeof lugar?.location?.latitude === 'number' && lugar.location.latitude >= -90 && lugar.location.latitude <= 90 &&
        totalPhotos > 0
      ) {
        const payload = {
          _id: placeId,
          name: lugar.name,
          categoria: lugar.categoria._id,
          experiencia: lugar.experiencia,
          amigo: lugar.amigo.map(u => u._id),
          recomendacion: lugar.recomendacion ?? '',
          nota: lugar.nota,
          location: lugar.location,     // { latitude, longitude }
          urls,                         // remotas que se mantienen
          newPhotos                     // locales nuevas a subir
        };

        await updatePlace(payload, logout, errorMensaje)
          .then(() => {
            setLoading2(false);
            navigate.goBack();
          })
          .catch((error) => {
            setLoading2(false);
            errorBolean(true);
            errorMensaje(error.message);
          });

      } else {
        setLoading2(false);
        errorBolean(true);

        if (!placeId) {
          errorMensaje(screenTexts.IdErrorMessage);
        } else if ((lugar?.name ?? '').trim() === '') {
          errorMensaje(screenTexts.NameErrorMessage);
        } else if (!lugar?.categoria?._id) {
          errorMensaje(screenTexts.categoryErrorMessage);
        } else if (!(typeof lugar?.nota === 'number') || lugar.nota <= 0 || lugar.nota > 7) {
          errorMensaje(screenTexts.ValorationErrorMessage);
        } else if (
          lugar?.location?.longitude < -180 || lugar?.location?.longitude > 180 ||
          lugar?.location?.latitude < -90 || lugar?.location?.latitude > 90
        ) {
          errorMensaje(screenTexts.LocationErrorMessage);
        } else if (totalPhotos === 0) {
          errorMensaje(screenTexts.PhotoErrorMessage);
        } 
      }
    } catch (error) {
      setLoading2(false);
      errorBolean(true);
      errorMensaje(error.message);
    }
  };

  // Submit en modo edición
  const handleEditSubmit = () => {
    if (!loading) {
      setLoading(true);
      handleUpdateUbi({
        errorBolean: setError,
        errorMensaje: setErrorMessage,
        setLoading2: setLoading,
      });
    }
  };

  const handleSubmit = () => {
    if (isEdit) {
      handleEditSubmit();
      return;
    }

    if (route?.params?.pass && typeof route.params.pass === 'function') {
      if (!loading) {
        setLoading(true);
        route.params.pass({
          errorBolean: setError,
          errorMensaje: setErrorMessage,
          setLoading2: setLoading,
        });
      }
    } else {
      route?.params?.pass?.();
    }
  };

  useEffect(() => {
    handleGethistories();
  }, []);

  // ===== Progreso sin paso 2 en modo edición =====
  const totalSteps = route?.params?.Onboarding ? 3 : (isEdit ? 3 : 4);
  const currentStepForBar = (() => {
    if (isEdit) {
      // Mapea 1,3,4 -> 1,2,3
      if (step === 1) return 1;
      if (step === 3) return 2;
      if (step === 4) return 3;
      return 1;
    }
    if (route?.params?.Onboarding && step !== 1) return step - 1;
    return step;
  })();

  // Paso 1: Ubicación
  const renderStep1 = () => {
    const coordsToUse = {
      latitude: (isEdit ? editLugar?.location?.latitude : route?.params?.lugar?.location?.latitude) || 0,
      longitude: (isEdit ? editLugar?.location?.longitude : route?.params?.lugar?.location?.longitude) || 0,
    };

    return (
      <View style={styles.stepContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{screenTexts.Title}</Text>
          <Text style={styles.subtitle}>{screenTexts.Subtitle}</Text>
        </View>

        <View style={styles.mapContainer}>
          <MapContainer
            ref={mapRef}
            type={'Add'}
            func={handleLocationChange}
            ciudad={'Madrid'}
            coords={coordsToUse}
            setError={setError}
            setErrorMessage={setErrorMessage}
          />
        </View>
      </View>
    );
  };

  // Paso 2: Experiencia (SOLO en modo creación)
  const renderStep2 = () => {
    return (
      <View style={styles.stepContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{screenTexts.MomentTitle}</Text>
          <Text style={styles.subtitle}>{screenTexts.MomentSubtitle}</Text>
        </View>

        <View style={styles.toggleContainer}>
          <View style={styles.toggleSection}>
            <Text style={styles.toggleLabel}>{screenTexts.ToggleMoment}</Text>

            <ToggleSwitch
              isOn={toggleExperience}
              onColor="#1D7CE4"
              offColor="#D9D9D9"
              size="medium"
              trackOnStyle={{ borderRadius: 10 }}
              trackOffStyle={{ borderRadius: 10 }}
              onToggle={(value) => handleMomentoChange(value)}
            />
          </View>
          {/* Ejemplos de momentos */}
          <View style={styles.momentExamplesContainer}>
            <View style={styles.examplesGrid}>
              <View style={[styles.exampleCard, styles.rotatedLeft]}>
                <View style={styles.polaroidFrame}>
                  <Image 
                    source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/kylot-app.appspot.com/o/moments%2Fuser_moment_1.jpg?alt=media' }} 
                    style={styles.polaroidImage}
                  />
                  <Text style={styles.polaroidCaption}>Amanecer perfecto</Text>
                </View>
              </View>
              <View style={[styles.exampleCard, styles.centerCard]}>
                <View style={styles.polaroidFrame}>
                  <Image 
                    source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/kylot-app.appspot.com/o/moments%2Fuser_moment_2.jpg?alt=media' }} 
                    style={styles.polaroidImage}
                  />
                  <Text style={styles.polaroidCaption}>Momento especial</Text>
                </View>
              </View>
              <View style={[styles.exampleCard, styles.rotatedRight]}>
                <View style={styles.polaroidFrame}>
                  <Image 
                    source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/kylot-app.appspot.com/o/moments%2Fuser_moment_3.jpg?alt=media' }} 
                    style={styles.polaroidImage}
                  />
                  <Text style={styles.polaroidCaption}>Atardecer único</Text>
                </View>
              </View>
            </View>
            <Text style={styles.toggleDescription}>
              {toggleExperience ? screenTexts.ToggleMomentText1 : screenTexts.ToggleMomentText2}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // Handlers compatibles para componentes hijos cuando estamos en edición
  const editModeSetPhotos = (newPhotos) => {
    const currentHttp = images.filter(im => im.url?.startsWith('http'));
    const merged = [...newPhotos, ...currentHttp];
    if (!merged.some(p => p.perfil) && merged.length) merged[0].perfil = true;
    setImages(merged);
  };
  const editModeSetUrls = (newUrls) => {
    const currentLocal = images.filter(im => im.url?.startsWith('file://'));
    const merged = [...currentLocal, ...newUrls];
    if (!merged.some(p => p.perfil) && merged.length) merged[0].perfil = true;
    setImages(merged);
  };

  // Paso 3: Fotos
  const renderStep3 = () => {
    return (
      <View style={styles.stepContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.titleWithInfo}>
            <Text style={styles.title}>{screenTexts.StorySubtitle}</Text>
            <TouchableOpacity style={styles.infoButton} onPress={() => handleTexts('photos')}>
              <Image source={info} style={styles.infoIcon} />
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>{screenTexts.StorySubtitle2}</Text>
        </View>

        <View style={styles.photosContainer}>
          <View style={styles.row}>
            <AddHistoria option="camera" setImages={setImages} setPhotos={isEdit ? editModeSetPhotos : route?.params?.setPhotos} />
            <AddHistoria option="gallery" setImages={setImages} setPhotos={isEdit ? editModeSetPhotos : route?.params?.setPhotos} />
          </View>

        {images.length > 0 && (
            <View style={styles.previewContainer}>
              <Text style={styles.previewTitle}>{screenTexts.PreviousStoriesTitle}</Text>
              <FlatList
                data={images}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                contentContainerStyle={styles.imagesContainer}
                renderItem={({ item, index }) => (
                  <TouchableOpacity style={styles.imageWrapper} key={index} onPress={() => openModal(index)}>
                    <Image source={{ uri: item.url }} style={styles.image} />
                    <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveImage(index)}>
                      <Text style={styles.removeImage}>X</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          {(route?.params?.mode && cargando && historiesInfo.histories?.length > 0) && (
            <View style={styles.storiesSection}>
              <View style={styles.headerContainer}>
                <Text style={styles.sectionTitle}>{screenTexts.PreviousStoriesSubtitle}</Text>
                <Text style={styles.sectionSubtitle}>{screenTexts.PreviousStoriesSubtitle2}</Text>
              </View>
              <View style={styles.storiesContainer}>
                <StoriesScroll
                  data={historiesInfo}
                  subir={false}
                  mine={true}
                  setImages={setImages}
                  setPhotos={isEdit ? editModeSetUrls : route?.params?.setUrls}
                />
              </View>
            </View>
          )}
        </View>
      </View>
    );
  };

  // Paso 4: Información y valoración
  const renderStep4 = () => {
    const lugarForChild = isEdit ? (editLugar || {}) : (createLugar || {});

    return (
      <View style={styles.infoContainer}>
        { !toggleExperience ? (
          <>
            <AddInfo
              func={(u) => updateLugar(u)}
              lugar={lugarForChild}
              func2={(u) => updateLugar2(u)}
              modal={() => handleTexts('info')}
              setError={setError}
              setErrorMessage={setErrorMessage}
            />

            <View style={styles.ratingSection}>
              <View style={styles.titleWithInfo}>
                <Text style={styles.ratingTitle}>{screenTexts.ValorationSubtitle}</Text>
                <TouchableOpacity style={styles.infoButton} onPress={() => handleTexts('valoracion')}>
                  <Image source={info} style={styles.infoIcon} />
                </TouchableOpacity>
              </View>
              <StarRating ratingNumber={lugarForChild?.nota || 0} onChangeRating={handleRatingChange} />
            </View>
          </>
        ) : (
          <>
            <View style={styles.headerContainer}>
              <Text style={styles.title}>{screenTexts.InfoTitle}</Text>
              <Text style={styles.subtitle}>{screenTexts.InfoSubtitle}</Text>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputFull}
                placeholder={screenTexts.MomentPlaceHolder}
                value={titleMoment}
                onChangeText={(value) => handleNameChange(value)}
              />
            </View>
          </>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{screenTexts.Top}</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Image source={x} style={styles.closeIcon} />
            </TouchableOpacity>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${(currentStepForBar / totalSteps) * 100}%` },
              ]}
            >
              <LinearGradient
                colors={['#004999', '#1D7CE4']}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.gradient}
              />
            </View>
          </View>

          {/* Steps Indicator */}
          <View style={styles.stepsIndicator}>
            <Text style={[styles.stepText, step === 1 && styles.activeStep]}>{screenTexts.Step1}</Text>
            {!route?.params?.Onboarding && !isEdit && (
              <Text style={[styles.stepText, step === 2 && styles.activeStep]}>{screenTexts.Step2}</Text>
            )}
            <Text style={[styles.stepText, step === 3 && styles.activeStep]}>{screenTexts.Step3}</Text>
            <Text style={[styles.stepText, step === 4 && styles.activeStep]}>{screenTexts.Step4}</Text>
          </View>

          {/* Content */}
          <ScrollView style={styles.scrollContent}>
            {step === 1 && renderStep1()}
            {(!route?.params?.Onboarding && !isEdit && step === 2) && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            {step > 1 ? (
              <TouchableOpacity
                onPress={() => {
                  if (isEdit) {
                    // en edición: 3 -> 1, 4 -> 3
                    if (step === 3) setStep(1);
                    else setStep(step - 1);
                    return;
                  }
                  if (step === 3 && route?.params?.Onboarding) {
                    setStep(1);
                  } else {
                    setStep(step - 1);
                  }
                }}
                style={styles.backButton}
              >
                <Text style={styles.backButtonText}>{screenTexts.Back}</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.backButton} />
            )}
            <View style={styles.nextButton}>
              <GradientButton
                color="Blue"
                text={step === 4 ? screenTexts.PublicationHorizontalSlider : screenTexts.Next}
                onPress={() => {
                  if (step === 4) {
                    handleSubmit();
                    return;
                  }
                  if (isEdit) {
                    // 1 -> 3 -> 4
                    if (step === 1) setStep(3);
                    else setStep(step + 1);
                    return;
                  }
                  if (step === 1 && route?.params?.Onboarding) {
                    setStep(3);
                  } else {
                    setStep(step + 1);
                  }
                }}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>

      <InfoModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        Title={screenTexts.WinKyletsModalTitle}
        Subtitle={modalSubtitle}
        Button={screenTexts.ContinueTouchable}
      />

      <ImageView
        images={images.map((item) => {
          return { uri: item.url };
        })}
        imageIndex={selectedImageIndex}
        visible={modalVisible}
        onRequestClose={closeModal}
        swipeToCloseEnabled={true}
        HeaderComponent={() => (
          <TouchableOpacity onPress={closeModal} style={styles.closeButton2}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
        )}
      />

      {error && <Error message={errorMessage} func={setError} />}
      {loading && <LoadingOverlay />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: 'rgba(249, 250, 251, 0.5)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    padding: 8,
  },
  closeIcon: {
    width: 15,
    height: 15,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#F3F4F6',
  },
  progressBar: {
    height: '100%',
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  gradient: {
    flex: 1,
  },
  stepsIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
    width: '100%',
  },
  stepText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  activeStep: {
    color: '#3B82F6',
  },
  scrollContent: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
  },
  stepContainer: {
    padding: 24,
    flex: 1,
    width: '100%',
  },
  headerContainer: {
    marginTop: 16,
    flex: 1,
    paddingHorizontal: 16,
    marginBottom: 16,
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
  titleWithInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  infoButton: {
    padding: 8,
  },
  infoIcon: {
    width: 18,
    height: 18,
  },
  mapContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 20,
  },
  toggleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  toggleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  toggleLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  toggleDescription: {
    fontSize: 14,
    color: '#9d9d9d',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
    marginTop: 38,
  },
  photosContainer: {
    flex: 1,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    height: 200,
    marginBottom: 20,
    gap: 12,
  },
  previewContainer: {
    marginTop: 20,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  imagesContainer: {
    paddingHorizontal: 4,
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
  storiesSection: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  storiesContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  infoContainer: {
    flex: 1,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  ratingSection: {
    alignItems: 'center',
  },
  ratingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#6B7280',
    fontWeight: '500',
  },
  nextButton: {
    width: '50%',
  },
  closeButton2: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  // Estilos para ejemplos de momentos
  momentExamplesContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  examplesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  examplesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },
  exampleCard: {
    width: '30%',
    alignItems: 'center',
  },
  rotatedLeft: {
    transform: [{ rotate: '-8deg' }],
    zIndex: 1,
  },
  rotatedRight: {
    transform: [{ rotate: '8deg' }],
    zIndex: 1,
  },
  centerCard: {
    zIndex: 2,
  },
  polaroidFrame: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  polaroidImage: {
    width: 80,
    height: 80,
    borderRadius: 6,
    marginBottom: 8,
  },
  polaroidCaption: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
    fontStyle: 'italic',
    lineHeight: 12,
  },
  inputFull: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingLeft: 10,
    marginBottom: 10,
  },
});

export default AddMarket;
