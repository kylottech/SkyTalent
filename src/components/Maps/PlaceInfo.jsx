import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, Image, ScrollView, TouchableOpacity, ImageBackground, Modal, FlatList, TouchableWithoutFeedback, RefreshControl } from 'react-native';
import ImageView from 'react-native-image-viewing';
import { FontAwesome } from '@expo/vector-icons';
import { Linking, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../../context/useUser";
import { formatString } from '../../utils/formatString'
import { getInfo, uploadPhoto1, voted } from '../../services/mapsService';
import { lists, addPlace } from '../../services/walletServices';
import pin_mapa from '../../../assets/pinMapa.png';
import Top from '../../components/Utils/Top';
import TextLine from '../../components/Utils/TextLine';
import StarRating from '../../components/Utils/StarRating';
import FloatingGalleryMenu from '../Utils/FloatingGalleryMenu';
import BlockedFuncionality from '../Utils/BlockedFuncionality'
import LoadingOverlay from '../Utils/LoadingOverlay'
import InfoModal from '../Utils/InfoModal';
import GradientButton from '../Utils/GradientButton';
import Error from '../Utils/Error';
import Confirmacion from '../Utils/Confirmacion';
import SocialInfo from './SocialInfo'
import mas from '../../../assets/add.png';
import Gomap from '../../../assets/Gomap.png';

const PlaceInfo = ({_id}) => {
  const navigate = useNavigation();
  const { logout, texts, translateTag, language } = useUser();
  const screenTexts = texts.components.Maps.PlaceInfo;
  const [llamada, setLlamada] = useState(false);
  const [categoria, setCategoria] = useState({});
  const [photo, setPhoto] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [direccion, setDireccion] = useState('');
  const [experiencia, setExperiencia] = useState('');
  const [recomendacion, setRecomendacion] = useState('');
  const [selectedValue, setSelectedValue] = useState(""); 
  const [create, setCreate] = useState(""); 
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [listas, setListas] = useState([]);
  const [images, setImages] = useState([]);
  const [uploadImage, setUploadImage] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [puntuacion, setPuntuacion] = useState(false);
  const [isVoted, setIsVoted] = useState(false);
  const [votedNum, setVotedNum] = useState(0);
  const [winKylets, setWinKylets] = useState(0);
  const [winKyletsText, setWinKyletsText] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showAddOptionsModal, setShowAddOptionsModal] = useState(false);
  const [showListScrollView, setShowListScrollView] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');
  const [confirmacion, setConfirmacion] = useState(false);
  const [confirmacionMensaje, setConfirmacionMensaje] = useState('Errorrr');
  const [opcion, setOpcion] = useState(1);
  const [info, setInfo] = useState({});
  const [mine, setMine] = useState(false);
  const [loading, setLoading] = useState(false);

  // NEW: control del refresh del padre
  const [refreshing, setRefreshing] = useState(false);
  const socialRef = useRef(null);
  
  // Estado para controlar expansión/contracción de información
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);
  // Estado para controlar expansión/contracción de valoración
  const [isRatingExpanded, setIsRatingExpanded] = useState(false);

  useEffect(() => {      
    if(winKylets !== 0){
      setWinKyletsText(formatString(screenTexts.KyletsTitle, { variable1: winKylets }))
      setShowConfirmation(true)
    }
  },[winKylets])

  const openModal = (index) => {
    setSelectedImageIndex(index);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleLists = async () => {
    try {
      lists(logout).then((response) => {
        if (response) setListas(response.lists);
      }).catch((error) => {
        setError(true);
        setErrorMessage(error.message);
      });
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
    }
  };

  const togglePicker = () => {
    setShowAddOptionsModal(true);
  };

  const handleVote = async (number) => {
    try {
      await voted({ _id: _id, number: number }, logout)
      .then(() => {
        handleGetInfo(_id);
        // NEW: refresca reviews en SocialInfo tras votar
        socialRef.current?.refreshSection?.('reviews');
        setConfirmacion(true)
        setConfirmacionMensaje(screenTexts.VoteConfirmate)
      }).catch((error) => {
        setError(true);
        setErrorMessage(error.message);
      });
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
    }
  };

  const handleGetInfo = async (_id) => {
    try {
      getInfo(_id, logout)
      .then((response) => {
        if (response) {
          // Category translation logged
          setPuntuacion(response.puntuacion)
          setIsVoted(response.voted.voted)
          setVotedNum(response.voted.number)
          setCreate(formatearFecha(response.create))
          setRecomendacion(response.recomendacion)
          setExperiencia(response.experiencia)
          setDireccion(response.location.coordinates[0] + ', ' + response.location.coordinates[1]);
          setCategoria(translateTag(response.categoria, language));
          setPhoto(response.avatar.url);
          setName(response.name);
          setUsername(response.creator);
          setPending(response.revision)
          setLlamada(true);
          setInfo(response)
          setMine(response.mine)
        }
      }).catch((error) => {
        setError(true);
        setErrorMessage(error.message);
      });
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
    }
  };

  const handleSavePlace = async (itemValue) => {
    try {
      addPlace({_idList: itemValue, _idPlace: _id}, logout)
        .then(() => {
          setConfirmacion(true)
          setConfirmacionMensaje(screenTexts.SaveConfirmation)
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

  const handleUploadPhotos = async ({ selectedImage, setErrorMessage, _id }) => {
    try {
      if(!loading){
        if (selectedImage.length > 0) {
          setLoading(true)
          await uploadPhoto1({imagesArray: selectedImage, setErrorMessage: setErrorMessage, _id: _id}, logout)
            .then((res) => {
              setUploadImage([]);
              setConfirmacion(true);
              setConfirmacionMensaje(screenTexts.PhotoConfirmation);
              setPhoto(selectedImage[0].url); // usa el avatar
              setWinKylets(res.kylets);
              // NEW: refresca solo "Mis historias" en SocialInfo tras subir
              socialRef.current?.refreshSection?.('my');
              setLoading(false)
            })
            .catch((error) => {
              setUploadImage([]);
              setError(true);
              setErrorMessage(error.message);
              setLoading(false)
            });
        }
      }
      
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
    }
  }

  useEffect(() => {
    if (uploadImage.length > 0) {
      handleUploadPhotos({ selectedImage: uploadImage, setErrorMessage, _id });
    }
  }, [uploadImage]);

  useEffect(() => {
    handleLists();
    handleGetInfo(_id);
  }, []);

  const handleOpenMap = () => {
    if (!direccion || !direccion.includes(',')) return;
    const [longitude, latitude] = direccion.split(',').map(coord => coord.trim());
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const url = Platform.select({
      ios: `http://maps.apple.com/?ll=${lat},${lon}`,
      android: `geo:${lat},${lon}?q=${lat},${lon}`,
    });
    Linking.openURL(url)
  };

  function formatearFecha(fechaStr) {
    const date = new Date(fechaStr);
    if (isNaN(date)) return '';
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const anio = date.getFullYear();
    return `${dia}-${mes}-${anio}`;
  }

  // NEW: Pull-to-refresh del padre que refresca TODO (padre + hijo)
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.allSettled([
        handleLists(),
        handleGetInfo(_id),
        socialRef.current?.refresh?.()
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View style={styles.container}>
      {llamada && (
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Top left={true} leftType={'Back'} typeCenter={'Text'} textCenter={screenTexts.Top} right={true} rightType={'Wallet'} />
          <TextLine color={'Blue'} type={'Name'} text={categoria.category + '     '} />
          <ImageBackground source={{ uri: photo }} style={[pending ? styles.fondo: styles.fondo2]}>
            {pending &&
              <View style={styles.minimalTagContainer}>
                <View style={styles.minimalTag}>
                  <Text style={styles.minimalTagText}>{screenTexts.Pending}</Text>
                </View>
              </View>
            }
            <View style={styles.minimalRatingContainer}>
              <View style={styles.minimalRatingTag}>
                <Text style={styles.minimalRatingText}>{puntuacion}</Text>
                <FontAwesome name="star" size={12} color="#FFA500" />
              </View>
            </View>
          </ImageBackground>

          <View style={{paddingHorizontal: 16}}>

          {/* Sección de información reorganizada */}
          <View style={[styles.infoSection, !isInfoExpanded && styles.infoSectionClosed]}>
            {/* Título ESIC University con iconos */}
            <View style={styles.esicHeader}>
              <Text style={styles.esicTitle}>{name}</Text>
              <View style={styles.headerButtons}>
                <TouchableOpacity style={styles.addButton} onPress={togglePicker}>
                  <Image source={mas} style={styles.addImage} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.mapButton} onPress={handleOpenMap}>
                  <Image source={Gomap} style={styles.goMap} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Título principal de información */}
            <TouchableOpacity 
              style={styles.infoHeader} 
              onPress={() => setIsInfoExpanded(!isInfoExpanded)}
              activeOpacity={0.6}
            >
              <Text style={styles.infoMainTitle}>{screenTexts.Title}</Text>
              <View style={styles.minimalChevron}>
                <Text style={styles.chevronMinimal}>{isInfoExpanded ? "−" : "+"}</Text>
              </View>
            </TouchableOpacity>

            {/* Línea divisoria cuando está cerrada */}
            {!isInfoExpanded && (
              <View style={styles.closedDivider} />
            )}

            {/* Contenido expandible */}
            {isInfoExpanded && (
              <>
                {/* Creador */}
                <View style={styles.infoItem}>
                  <View style={styles.infoItemContent}>
                    <Text style={styles.infoItemTitle}>{screenTexts.Creator}</Text>
                    <Text style={styles.infoItemText}>@{username}</Text>
                  </View>
                  <View style={styles.infoDivider} />
                </View>

                {/* Fecha */}
                <View style={styles.infoItem}>
                  <View style={styles.infoItemContent}>
                    <Text style={styles.infoItemTitle}>Fecha</Text>
                    <Text style={styles.infoItemText}>{create}</Text>
                  </View>
                  <View style={styles.infoDivider} />
                </View>

                {/* Ubicación */}
                <View style={styles.infoItem}>
                  <View style={styles.infoItemContent}>
                    <Text style={styles.infoItemTitle}>Ubicación</Text>
                    <View style={styles.locationContent}>
                      <TouchableOpacity style={styles.locationIcon} onPress={handleOpenMap}>
                        <Image source={pin_mapa} style={styles.iconoMapa} />
                      </TouchableOpacity>
                      <Text style={styles.infoItemText}>{direccion}</Text>
                    </View>
                  </View>
                  <View style={styles.infoDivider} />
                </View>

                {/* Mi mejor experiencia */}
                {experiencia !== '' && (
                  <View style={styles.infoItem}>
                    <View style={styles.infoItemContent}>
                      <Text style={styles.infoItemTitle}>{screenTexts.ExperienceTitle}</Text>
                      <Text style={styles.infoItemText}>{experiencia}</Text>
                    </View>
                    <View style={styles.infoDivider} />
                  </View>
                )}

                {/* Mi recomendación */}
                {recomendacion !== '' && (
                  <View style={styles.infoItem}>
                    <View style={styles.infoItemContent}>
                      <Text style={styles.infoItemTitle}>{screenTexts.RecomendationTitle}</Text>
                      <Text style={styles.infoItemText}>{recomendacion}</Text>
                    </View>
                    <View style={styles.infoDivider} />
                  </View>
                )}
              </>
            )}

          </View>

          <Modal transparent={true} visible={isPickerVisible} animationType="slide" onRequestClose={togglePicker}>
            <TouchableWithoutFeedback onPress={togglePicker}>
              <View style={styles.modalContainer}>
                <View style={styles.pickerContainer}>
                  <Picker selectedValue={selectedValue} onValueChange={(itemValue) => { handleSavePlace(itemValue, _id); togglePicker(); }}>
                    <Picker.Item label={screenTexts.OptionPicker} value="" />
                    {listas.map((item) => (
                      <Picker.Item key={item._id} label={item.name} value={item._id} />
                    ))}
                  </Picker>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>


          <View style={[styles.ratingSection, !isRatingExpanded && styles.ratingSectionClosed]}>
            <TouchableOpacity 
              style={styles.ratingHeader} 
              onPress={() => setIsRatingExpanded(!isRatingExpanded)}
              activeOpacity={0.6}
            >
              <Text style={styles.ratingTitle}>{screenTexts.ValorationText}</Text>
              <View style={styles.minimalChevron}>
                <Text style={styles.chevronMinimal}>{isRatingExpanded ? "−" : "+"}</Text>
              </View>
            </TouchableOpacity>

            {/* Línea divisoria cuando está cerrada */}
            {!isRatingExpanded && (
              <View style={styles.closedDivider} />
            )}

            {/* Contenido expandible */}
            {isRatingExpanded && (
              <>
                <View style={styles.ratingContent}>
                  <StarRating mode={!isVoted ? 'write' : 'read'} ratingNumber={votedNum} onChangeRating={handleVote}/>
                </View>
                <View style={styles.ratingDivider} />
              </>
            )}
          </View>

          <View style={styles.marketplaceTabs}>
            <TouchableOpacity
              style={[styles.marketplaceTab, styles.tabLeft, opcion === 1 && styles.marketplaceTabSelected]}
              onPress={() => setOpcion(1)}
              activeOpacity={0.8}
            >
              <Text style={[styles.marketplaceTabText, opcion === 1 && styles.marketplaceTabTextSelected]}>{screenTexts.Menu1}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.marketplaceTab, opcion === 2 && styles.marketplaceTabSelected]}
              onPress={() => setOpcion(2)}
              activeOpacity={0.8}
            >
              <Text style={[styles.marketplaceTabText, opcion === 2 && styles.marketplaceTabTextSelected]}>{screenTexts.Menu2}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.marketplaceTab, styles.tabRight, opcion === 3 && styles.marketplaceTabSelected]}
              onPress={() => setOpcion(3)}
              activeOpacity={0.8}
            >
              <Text style={[styles.marketplaceTabText, opcion === 3 && styles.marketplaceTabTextSelected]}>{screenTexts.Menu3}</Text>
            </TouchableOpacity>
          </View>

          
          </View>
          {opcion === 1 && (
            <View style={{ marginTop: 0, marginBottom: 24 }}>
              {/* NEW: ref para controlar refresh del hijo */}
              <SocialInfo ref={socialRef} placeId={_id} name={name} categoria={categoria}/>
            </View>
          )}
          {opcion === 2 && <BlockedFuncionality/>}
          {opcion === 3 && <BlockedFuncionality/>}

          <ImageView
            images={images}
            imageIndex={selectedImageIndex}
            visible={modalVisible}
            onRequestClose={closeModal}
            swipeToCloseEnabled={true}
            HeaderComponent={() => (
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>x</Text>
              </TouchableOpacity>
            )}
          />
        </ScrollView>
      )}

      <FloatingGalleryMenu setImages={setImages} setPhotos={setUploadImage} />

      {error && <Error message={errorMessage} func={setError} />}

      {confirmacion && <Confirmacion message={confirmacionMensaje} func={setConfirmacion} />}

      <Modal
        transparent={true}
        visible={showAddOptionsModal}
        animationType="slide"
        onRequestClose={() => {setShowListScrollView(false), setShowAddOptionsModal(false) }}
      >
        <TouchableWithoutFeedback onPress={() => {setShowListScrollView(false), setShowAddOptionsModal(false)}}>
          <View style={styles.modalContainer}>
            <View style={styles.optionBox}>
              {showListScrollView ? (
                <ScrollView style={{ width: '100%' }}>
                  {listas.map((item) => (
                    <TouchableOpacity
                      key={item._id}
                      onPress={() => {
                        handleSavePlace(item._id);
                        setShowAddOptionsModal(false);
                        setShowListScrollView(false);
                      }}
                      style={styles.modalOption}
                    >
                      <Text style={styles.modalOptionText}>{item.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              ) : (
                <>
                  {mine && 
                    <GradientButton
                      text={screenTexts.GradientButton}
                      color="Blue"
                      onPress={() => navigate.navigate('AddMarket', {
                        type: 'edit',
                        info: info,
                      })}
                    />
                  }
                  <GradientButton
                    text={screenTexts.GradientButton2}
                    color="Blue"
                    onPress={() => setShowListScrollView(true)}
                  />
                  <GradientButton
                    text={screenTexts.GradientButton3}
                    color="Blue"
                    onPress={() => {setShowAddOptionsModal(false), navigate.navigate("AddRoute", {_id: _id, setConfirmacion: setConfirmacion, setConfirmacionMensaje: setConfirmacionMensaje})}}
                  />
                  <TouchableOpacity
                    style={styles.modalOption}
                    onPress={() => {setShowAddOptionsModal(false),setShowListScrollView(false) }}
                  >
                    <Text style={styles.modalOptionText}>{screenTexts.CancelButton}</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <InfoModal 
        celebration={true}
        isOpen={showConfirmation} 
        onClose={() => {setShowConfirmation(false), setWinKylets(0)} } 
        Title={winKyletsText} 
        Subtitle={screenTexts.KyletsSubtitle} 
        Button={screenTexts.KyletsButton} 
      />
      {loading &&
        <LoadingOverlay/>
      }
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  scrollContainer: {
    paddingBottom: 10, 
  },
  fondo2: {
    width: '100%',
    height: 220,
    marginBottom: 25,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  fondo: {
    width: '100%',
    height: 220,
    marginBottom: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  // Estilos minimalistas para la sección del perfil
  profileSection: {
    marginHorizontal: 20,
    marginVertical: 16,
  },
  profileItem: {
    marginBottom: 16,
  },
  profileItemContent: {
    paddingVertical: 8,
  },
  profileItemTitle: {
    fontSize: 18,
    fontWeight: '300',
    color: '#000000',
    letterSpacing: -0.4,
    lineHeight: 22,
    marginBottom: 4,
  },
  profileItemText: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '400',
    letterSpacing: -0.2,
    lineHeight: 20,
  },
  profileDivider: {
    height: 0.5,
    backgroundColor: '#F0F0F0',
    marginTop: 4,
  },
  profileButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  containerDireccion: {
    flexDirection: 'row',
    alignItems: 'center',
    //marginHorizontal: 20,
  },
  // Estilos minimalistas para la sección de información
  infoSection: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 8,
  },
  infoSectionClosed: {
    marginBottom: 4,
  },
  closedDivider: {
    height: 0.5,
    backgroundColor: '#F0F0F0',
    marginTop: 12,
    marginBottom: 8,
  },
  esicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  esicTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    letterSpacing: -0.8,
    lineHeight: 28,
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  minimalChevron: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  chevronMinimal: {
    fontSize: 16,
    color: '#999999',
    fontWeight: '200',
    letterSpacing: 0,
    lineHeight: 16,
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    padding: 4,
    marginRight: 8,
  },
  infoMainTitle: {
    fontSize: 22,
    fontWeight: '300',
    fontStyle: 'italic',
    color: '#000000',
    letterSpacing: -0.6,
    lineHeight: 26,
    textAlign: 'left',
  },
  infoItem: {
    marginBottom: 20,
  },
  infoItemContent: {
    paddingVertical: 12,
  },
  infoItemTitle: {
    fontSize: 18,
    fontWeight: '300',
    color: '#000000',
    letterSpacing: -0.4,
    lineHeight: 22,
    marginBottom: 8,
  },
  infoItemText: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '400',
    letterSpacing: -0.2,
    lineHeight: 20,
  },
  infoDivider: {
    height: 0.5,
    backgroundColor: '#F0F0F0',
    marginTop: 4,
  },
  iconoMapa: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    marginRight: 5,
  },
  direccionTexto: {
    fontSize: 12,
    color: 'black',
  },
  infoTitle: {
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold',
  },
  infoTexto: {
    fontSize: 12,
    color: '#9d9d9d',
    marginBottom: 10
  },
  imagesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
    //marginHorizontal: 20,
    marginTop: 10,
  },
  friendsContainer: {
    flexDirection: 'row',
    marginTop: 5,
    marginLeft: 10,
  },
  friendImage: {
    width: 23,
    height: 23,
    borderRadius: 15,
    marginLeft: -10,
  },
  friendsText: {
    fontSize: 11,
    color: 'black',
    marginBottom: 5,
    marginLeft: 4,
  },
  nombre:{
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5
  },
  nombre2:{
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 16,
  },
  arroba:{
    fontSize:14,
    marginBottom: 5
  },
  // Estilos minimalistas para la sección de valoración
  ratingSection: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 20,
  },
  ratingSectionClosed: {
    marginBottom: 4,
  },
  ratingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingTitle: {
    fontSize: 22,
    fontWeight: '300',
    fontStyle: 'italic',
    color: '#000000',
    letterSpacing: -0.6,
    lineHeight: 26,
    textAlign: 'left',
  },
  ratingContent: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  ratingDivider: {
    height: 0.5,
    backgroundColor: '#F0F0F0',
    marginTop: 4,
  },
  slidersContainer: {
    flexDirection: 'row', 
    marginTop: 20,
    marginBottom: 30, 
    width: '95%', 
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  slidersContainer2: {
    borderRadius: 15, 
    flexDirection: 'row',
    alignContent: 'center',
    height: 80,
    width: '90%',
    justifyContent: 'space-between',
    alignSelf: 'center'
  },
  header: {
    flexDirection: 'column',
    maxWidth: '80%',
  },
  buttons: {
    flexDirection: 'row', 
  },
  addButton: {
    marginLeft: 10,
    alignSelf: 'flex-start',
  },
  modalContainer: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerContainer: {
      backgroundColor: '#fff',
      //marginHorizontal: 20,
      borderRadius: 10,
      overflow: 'hidden',
  },
  imagesContainer2: {
    paddingLeft: 10,
  },
  imageWrapper: {
    marginRight: 10,
  },
  image: {
    width: 140,
    height: 200,
    borderRadius: 15,
  },
  closeButton: {
    position: 'absolute',
    top: 30,
    right: 20,
    zIndex: 10, 
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 25,
    fontWeight: '500',
  },
  error:{
    position: 'absolute',
    width:'98%',
    backgroundColor:'red',
    marginTop:40,
    height:40,
    borderRadius:10,
    justifyContent: 'center',
    alignSelf: 'center'
  },
  errorTexto:{
    color:'white',
    alignSelf: 'center',
    fontWeight:'600',
  },
  confirmacion:{
    position: 'absolute',
    width:'98%',
    backgroundColor:'green',
    marginTop:40,
    height:40,
    borderRadius:10,
    justifyContent: 'center',
    alignSelf: 'center'
  },
  confirmacionTexto:{
    color:'white',
    alignSelf: 'center',
    fontWeight:'600',
  },
  mapButton: {
    width: 30,
    height: 30,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  mapButtonText: {
    color: '#fff',
    fontSize: 24,
  },
  // Estilos del menú tipo MarketPlace
  marketplaceTabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    marginBottom: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#EAEAEA',
  },
  marketplaceTab: { 
    flex: 1, 
    alignItems: 'center', 
    paddingVertical: 12,
  },
  tabLeft: { 
    borderTopLeftRadius: 5, 
    borderBottomLeftRadius: 5 
  },
  tabRight: { 
    borderTopRightRadius: 5, 
    borderBottomRightRadius: 5 
  },
  marketplaceTabSelected: { 
    borderBottomWidth: 3, 
    borderColor: '#1D7CE4' 
  },
  marketplaceTabText: { 
    color: '#000', 
    fontSize: 14,
    fontWeight: '400',
  },
  marketplaceTabTextSelected: { 
    fontWeight: 'bold',
    color: '#1D7CE4',
  },
  textoPublicaciones:{
    fontSize: 16,
    textAlign: 'center',
    //marginHorizontal: 30,
    marginTop: 25,
    marginBottom: 110,
    color: 'gray'
  },
  // Etiquetas minimalistas
  minimalTagContainer: { 
    flexDirection: 'row', 
    justifyContent: 'flex-start', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingTop: 12,
    zIndex: 2,
  },
  minimalTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
  },
  minimalTagText: {
    fontSize: 12,
    fontWeight: '300',
    color: '#666666',
    letterSpacing: -0.2,
    fontStyle: 'italic',
  },
  minimalRatingContainer: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingTop: 12,
    zIndex: 2,
  },
  minimalRatingTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
  },
  minimalRatingText: {
    fontSize: 12,
    fontWeight: '300',
    color: '#666666',
    marginRight: 4,
    letterSpacing: -0.2,
  },
  goMap:{
    height: 35,
    width: 35
  },
  optionBox: {
    backgroundColor: 'white',
    marginHorizontal: 40,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center'
  },
  modalOption: {
    paddingVertical: 10,
    width: '100%',
  },
  modalOptionText: {
    fontSize: 16,
    textAlign: 'center',
  }
});

export default PlaceInfo;
