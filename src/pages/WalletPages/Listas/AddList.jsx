import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useUser } from "../../../context/useUser";
import { formatString } from '../../../utils/formatString'
import * as ImagePicker from 'expo-image-picker';
import { createList, uploadImage, updateList } from '../../../services/walletServices';
import Top from '../../../components/Utils/Top';
import LoadingOverlay from '../../../components/Utils/LoadingOverlay';
import InfoModal from '../../../components/Utils/InfoModal';
import GradientButton from '../../../components/Utils/GradientButton';
import { LinearGradient } from 'expo-linear-gradient';
import subir from '../../../../assets/addImage.png';
import Error from '../../../components/Utils/Error';
import CategoryInput from '../../../components/Utils/CategoryInput';

const AddList = () => {
  const navigate = useNavigation();
  const route = useRoute();
  const { isLogged, isLoading, logout, texts } = useUser();
  const screenTexts = texts.pages.WalletPages.Listas.AddList;

  // === MODO EDICIÓN ===
  const isEdit = route?.params?.type === 'edit';
  const info = route?.params?.info || {}; // espera el objeto de la lista

  // Estado base (pre-rellenado en edición)
  const [id, setId] = useState(isEdit ? (info?._id || "") : "");
  const [nombreComunidad, setNombreComunidad] = useState(isEdit ? (info?.name || "") : "");
  const [categoria, setCategoria] = useState(
    isEdit
      ? (info?.categoria || {})
      : {}
  );
  const [privacidad, setPrivacidad] = useState(
    isEdit ? (info?.visibility ? "Publica" : "Privada") : "Publica"
  );
  const [descripcion, setDescripcion] = useState(isEdit ? (info?.descripcion || "") : "");
  const [urlImagen, setUrlImagen] = useState(
    isEdit && info?.avatar?.url ? { uri: info.avatar.url } : subir
  );

  const [winKylets, setWinKylets] = useState(0);
  const [winKyletsText, setWinKyletsText] = useState('');
  const [winKyletsSubText, setWinKyletsSubText] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');

  // Pasos
  const [step, setStep] = useState(1);

  // Dropdown privacidad
  const [showPrivacyDropdown, setShowPrivacyDropdown] = useState(false);
  const privacyOptions = [
    { label: screenTexts.PublicPicker, value: "Publica" },
    { label: screenTexts.PrivatePicker, value: "Privada" }
  ];

  // Ref con los datos actuales (por si quieres leerlos agrupados)
  const dataRef = useRef({});
  useEffect(() => {
    dataRef.current = {
      _id: id,
      nombreComunidad,
      categoria,
      privacidad,
      descripcion,
      urlImagen,
    };
  }, [id, nombreComunidad, categoria, privacidad, descripcion, urlImagen]);

  useEffect(() => {
    if (!isLoading && !isLogged) {
      navigate.navigate("Login");
    }
  }, [isLogged, isLoading]);

  useEffect(() => {
    if (winKylets !== 0) {
      if (privacidad === "Publica") {
        setWinKyletsSubText(screenTexts.KyletsSubtitle1);
      } else {
        setWinKyletsSubText(screenTexts.KyletsSubtitle2);
      }
      setWinKyletsText(formatString(screenTexts.KyletsTitle, { variable1: winKylets }));
      setShowConfirmation(true);
    }
  }, [winKylets, privacidad]);

  // Subir/Seleccionar imagen (local → solo cambia la previsualización; subida real se hace tras crear/actualizar)
  const handleImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setErrorMessage(screenTexts.AccessGalleryPermissionError);
      setError(true);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
      selectionLimit: 1,
      orderedSelection: true
    });
    if (!result.canceled) {
      setUrlImagen({ uri: result.assets[0].uri }); // guardamos como local
    }
  };

  // Sube imagen si la seleccionada es local (file://)
  const maybeUploadPhoto = async (listId) => {
    const selectedImage = urlImagen;
    const isLocalFile =
      selectedImage &&
      typeof selectedImage === 'object' &&
      selectedImage.uri &&
      selectedImage.uri.startsWith('file://');

    if (isLocalFile) {
      // uploadImage(selectedImage, setErrorMessage, setUrlImagen, listId, logout)
      await uploadImage(selectedImage, setErrorMessage, setUrlImagen, listId, logout);
    }
  };

  // Crear
  const handleCreateList = async () => {
    if (loading) return;
    setLoading(true);

    const categoriaTag = categoria?._id || null;
    if (!nombreComunidad.trim() || !categoriaTag || !descripcion.trim()) {
      setLoading(false);
      setError(true);
      setErrorMessage(screenTexts.FieldsErrorMessages);
      return;
    }

    try {
      const res = await createList(
        {
          name: nombreComunidad,
          categoria: categoriaTag,
          privacidad: privacidad === "Publica",
          descripcion: descripcion,
        },
        logout
      );

      setId(res?._id || '');
      await maybeUploadPhoto(res?._id);
      setWinKylets(res?.kylets || 0);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      setError(true);
      setErrorMessage(e?.message || 'Error');
    }
  };

  // Editar
  const handleUpdateList = async () => {
    if (loading) return;
    setLoading(true);

    const categoriaTag = categoria?._id || null;
    if (!id || !nombreComunidad.trim() || !categoriaTag || !descripcion.trim()) {
      setLoading(false);
      setError(true);
      setErrorMessage(screenTexts.FieldsErrorMessages);
      return;
    }

    try {
      console.log(privacidad)
      await updateList(
        {
          _id: id,
          name: nombreComunidad,
          categoria: categoriaTag,
          privacidad: (privacidad === "Publica"),
          descripcion: descripcion,
        },
        logout
      );

      // si hay imagen local, súbela
      await maybeUploadPhoto(id);

      setLoading(false);
      // en edición, confirmamos y volvemos atrás
      setShowConfirmation(true);
      setWinKyletsText(screenTexts.EditedTitle);
      setWinKyletsSubText(screenTexts.EditedSubtitle);
    } catch (e) {
      setLoading(false);
      setError(true);
      setErrorMessage(e?.message);
    }
  };

  const handleSubmit = () => {
    if (isEdit) {
      handleUpdateList();
    } else {
      handleCreateList();
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{screenTexts.Title2}</Text>
        <Text style={styles.subtitle}>{screenTexts.Subtitle2}</Text>
      </View>

      <View style={styles.imageContainer}>
        <TouchableOpacity style={styles.uploadContainer} onPress={handleImage}>
          <Image
            source={typeof urlImagen === 'number' ? urlImagen : urlImagen} // asset o {uri}
            style={[
              typeof urlImagen === 'object' && urlImagen.uri
                ? styles.subirFotoLocal
                : styles.subirFotoUri,
            ]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{screenTexts.Title}</Text>
        <Text style={styles.subtitle}>{screenTexts.Subtitle}</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{screenTexts.NameTitle}</Text>
          <TextInput
            value={nombreComunidad}
            onChangeText={setNombreComunidad}
            style={styles.input}
            placeholder={screenTexts.NewListPlaceHolder}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{screenTexts.TagTitle}</Text>
          <CategoryInput
            title={false}
            setUserInfo={setCategoria}
            userInfo={categoria}
            setError={setError}
            setErrorMessage={setErrorMessage}
            inputStyle={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{screenTexts.PrivacyPicker}</Text>
          <TouchableOpacity
            style={styles.customDropdown}
            onPress={() => setShowPrivacyDropdown(!showPrivacyDropdown)}
          >
            <Text style={styles.dropdownText}>
              {privacyOptions.find(option => option.value === privacidad)?.label || screenTexts.PublicPicker}
            </Text>
            <Text style={styles.dropdownArrow}>
              {showPrivacyDropdown ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>

          {showPrivacyDropdown && (
            <View style={styles.dropdownList}>
              {privacyOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.dropdownItem,
                    privacidad === option.value && styles.selectedDropdownItem
                  ]}
                  onPress={() => {
                    setPrivacidad(option.value);
                    setShowPrivacyDropdown(false);
                  }}
                >
                  <Text style={[
                    styles.dropdownItemText,
                    privacidad === option.value && styles.selectedDropdownItemText
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{screenTexts.DescriptionTitle}</Text>
          <TextInput
            value={descripcion}
            onChangeText={setDescripcion}
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={4}
            placeholder={screenTexts.DescriptionPlaceHolder}
          />
        </View>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <TouchableWithoutFeedback onPress={() => setShowPrivacyDropdown(false)}>
        <View style={styles.container}>
          <Top left={true} leftType={'Back'} typeCenter={'Text'} textCenter={screenTexts.Top} />

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${(step / 2) * 100}%` }
              ]}
            >
              <LinearGradient
                colors={['#1E40AF', '#3B82F6', '#60A5FA']}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.gradient}
              />
            </View>
          </View>

          {/* Steps Indicator */}
          <View style={styles.stepsIndicator}>
            <Text style={[styles.stepText, step === 1 && styles.activeStep]}>
              {screenTexts.Step1}
            </Text>
            <Text style={[styles.stepText, step === 2 && styles.activeStep]}>
              {screenTexts.Step2}
            </Text>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            {step > 1 ? (
              <TouchableOpacity onPress={() => setStep(step - 1)} style={styles.backButton}>
                <Text style={styles.backButtonText}>{screenTexts.Back}</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.backButton} />
            )}
            <View style={styles.nextButton}>
              <GradientButton
                color='Blue'
                text={
                  step === 2
                    ? (isEdit ? (screenTexts.SaveChanges) : screenTexts.NextButton1)
                    : screenTexts.NextButton2
                }
                onPress={() => {
                  if (step === 2) {
                    handleSubmit();
                  } else {
                    setStep(step + 1);
                  }
                }}
              />
            </View>
          </View>

          {error && <Error message={errorMessage} func={setError} />}

          <InfoModal
            celebration={!isEdit}
            isOpen={showConfirmation}
            onClose={() => {
              setShowConfirmation(false);
              setWinKylets(0);
              navigate.goBack();
            }}
            Title={winKyletsText}
            Subtitle={winKyletsSubText}
            Button={screenTexts.KyletsButton}
          />

          {loading && <LoadingOverlay />}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  progressContainer: { height: 4, backgroundColor: '#F3F4F6', zIndex: 1 },
  progressBar: { height: '100%', borderTopRightRadius: 2, borderBottomRightRadius: 2 },
  gradient: { flex: 1 },
  stepsIndicator: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 48, paddingTop: 16, paddingBottom: 8, width: '100%', zIndex: 1 },
  stepText: { fontSize: 14, color: '#9CA3AF', fontWeight: 'bold' },
  activeStep: { color: '#3B82F6' },
  content: { flex: 1, width: '100%', backgroundColor: "white", zIndex: 2 },
  scrollContent: { flexGrow: 1 },
  stepContainer: { padding: 24, flex: 1, width: '100%', zIndex: 5 },
  headerContainer: { marginBottom: 24 },
  title: { fontSize: 20, fontWeight: '600', color: '#1F2937', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#6B7280' },
  imageContainer: { borderWidth: 2, borderColor: '#E5E7EB', borderStyle: 'dashed', borderRadius: 12, padding: 12, alignItems: 'center', marginTop: 40, width: '100%', height: 180 },
  uploadContainer: { alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center' },
  subirFotoUri: { height: 100, width: 103 },
  subirFotoLocal: { width: '99%', height: '99%', borderRadius: 9 },
  formContainer: { gap: 20, zIndex: 5000 },
  inputGroup: { gap: 8, zIndex: 5000 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151' },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 12, fontSize: 16, color: '#1F2937', height: 50 },
  textArea: { height: 100, textAlignVertical: 'top' },
  customDropdown: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 12, height: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white' },
  dropdownText: { fontSize: 16, color: '#1F2937', flex: 1 },
  dropdownArrow: { fontSize: 12, color: '#6B7280', marginLeft: 8 },
  dropdownList: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, backgroundColor: 'white', marginTop: 4, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, zIndex: 9999 },
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  selectedDropdownItem: { backgroundColor: '#EFF6FF' },
  dropdownItemText: { fontSize: 16, color: '#1F2937' },
  selectedDropdownItemText: { color: '#3B82F6', fontWeight: '500' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, borderTopWidth: 1, borderTopColor: '#E5E7EB', backgroundColor: 'white', zIndex: 800 },
  backButton: { paddingVertical: 10, paddingHorizontal: 24, borderRadius: 12 },
  backButtonText: { color: '#6B7280', fontWeight: '500' },
  nextButton: { width: '50%' },
});

export default AddList;
