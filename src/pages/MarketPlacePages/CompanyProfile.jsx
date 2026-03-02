import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, Image, ScrollView, TouchableOpacity, ImageBackground, Modal, FlatList, TouchableWithoutFeedback, RefreshControl } from 'react-native';
import ImageView from 'react-native-image-viewing';
import { FontAwesome } from '@expo/vector-icons';
import { Linking, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../../context/useUser";
import { formatString } from '../../utils/formatString'
import pin_mapa from '../../../assets/pinMapa.png';
import Top from '../../components/Utils/Top';
import TextLine from '../../components/Utils/TextLine';
import StarRating from '../../components/Utils/StarRating';
import FloatingGalleryMenu from '../../components/Utils/FloatingGalleryMenu';
import BlockedFuncionality from '../../components/Utils/BlockedFuncionality'
import LoadingOverlay from '../../components/Utils/LoadingOverlay'
import InfoModal from '../../components/Utils/InfoModal';
import GradientButton from '../../components/Utils/GradientButton';
import Error from '../../components/Utils/Error';
import Confirmacion from '../../components/Utils/Confirmacion';
import SocialInfo from '../../components/Maps/SocialInfo'
import mas from '../../../assets/add.png';
import Gomap from '../../../assets/Gomap.png';

const CompanyProfile = ({ route }) => {
  const navigate = useNavigation();
  const { logout, texts, translateTag, language } = useUser();
  const screenTexts = {
    Top: 'Perfil de Empresa',
    Title: 'Información',
    ValorationText: 'Valoración',
    Menu1: 'Social',
    Menu2: 'Beneficios',
    Menu3: 'Marketplace',
    GradientButton: 'Seguir',
    GradientButton2: 'Contactar',
    GradientButton3: 'Compartir',
    CancelButton: 'Cancelar',
    KyletsTitle: '+{variable1} Kylets',
    KyletsSubtitle: 'Has ganado Kylets por seguir esta empresa',
    KyletsButton: '¡Genial!',
    FollowConfirmate: 'Ahora sigues esta empresa',
    ContactConfirmate: 'Redirigiendo a contacto...',
    ShareConfirmate: 'Enlace copiado al portapapeles'
  };

  // Obtener parámetros de navegación
  const { companyData } = route.params || {};
  
  // Debug: verificar qué datos llegan
  console.log('CompanyProfile - route.params:', route.params);
  console.log('CompanyProfile - companyData:', companyData);

  // Estados principales
  const [company, setCompany] = useState({
    id: '1',
    name: 'Starbucks',
    category: 'Café',
    rating: 4.5,
    reviews: 1247,
    followers: 89234,
    isFollowing: false,
    isVerified: true,
    description: 'Starbucks es una empresa multinacional estadounidense de café y cadenas de café con sede en Seattle, Washington.',
    website: 'https://starbucks.com',
    phone: '+34 900 123 456',
    email: 'info@starbucks.es',
    address: 'Calle Gran Vía, 123, Madrid, España',
    coordinates: [40.4168, -3.7038],
    logoUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
    coverUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=600&fit=crop',
    foundedYear: 1971,
    employees: '350,000+',
    headquarters: 'Seattle, Washington, USA',
    socialMedia: {
      instagram: '@starbucks',
      twitter: '@starbucks',
      facebook: 'Starbucks'
    }
  });

  // Actualizar empresa cuando lleguen los datos
  useEffect(() => {
    if (companyData) {
      setCompany(prev => ({ 
        ...prev, 
        name: companyData.name || prev.name,
        category: companyData.category || prev.category,
        isVerified: companyData.isVerified || prev.isVerified,
        logoUrl: companyData.iconSource ? { uri: companyData.iconSource } : prev.logoUrl
      }));
    }
  }, [companyData]);

  // Datos mock para beneficios de la empresa
  const companyBenefits = [
    {
      id: '1',
      title: 'Descuento 20% en tu primera compra',
      description: 'Obtén un 20% de descuento en tu primera compra con código WELCOME20',
      discount: '20%',
      validUntil: '31/12/2024',
      isActive: true,
      category: 'Descuento',
      icon: '🎁'
    },
    {
      id: '2',
      title: 'Café gratis por cada 10 compras',
      description: 'Acumula puntos y obtén un café gratis después de 10 compras',
      discount: 'Gratis',
      validUntil: 'Sin expiración',
      isActive: true,
      category: 'Fidelidad',
      icon: '☕'
    },
    {
      id: '3',
      title: 'Descuento 15% en productos de temporada',
      description: 'Disfruta de un 15% de descuento en todos nuestros productos de temporada',
      discount: '15%',
      validUntil: '31/01/2025',
      isActive: true,
      category: 'Temporada',
      icon: '❄️'
    }
  ];

  // Datos mock para productos de la empresa
  const companyProducts = [
    {
      id: '1',
      name: 'Café Americano Premium',
      price: 4.50,
      originalPrice: 5.00,
      discount: 10,
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
      category: 'Bebidas',
      rating: 4.5,
      isAvailable: true,
      description: 'Café americano elaborado con granos premium'
    },
    {
      id: '2',
      name: 'Croissant de Mantequilla',
      price: 2.80,
      originalPrice: 3.20,
      discount: 12,
      image: 'https://images.unsplash.com/photo-1555507036-ab1a403d5b6a?w=400&h=300&fit=crop',
      category: 'Repostería',
      rating: 4.3,
      isAvailable: true,
      description: 'Delicioso croissant hecho con mantequilla fresca'
    },
    {
      id: '3',
      name: 'Frappuccino Vainilla',
      price: 5.20,
      originalPrice: 5.80,
      discount: 10,
      image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop',
      category: 'Bebidas Frías',
      rating: 4.7,
      isAvailable: true,
      description: 'Frappuccino de vainilla con crema batida'
    }
  ];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmacion, setConfirmacion] = useState(false);
  const [confirmacionMensaje, setConfirmacionMensaje] = useState('');
  const [opcion, setOpcion] = useState(1);
  const [info, setInfo] = useState({});
  const [mine, setMine] = useState(false);

  // NEW: control del refresh del padre
  const [refreshing, setRefreshing] = useState(false);
  const socialRef = useRef(null);
  
  // Estado para controlar expansión/contracción de información
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);
  // Estado para controlar expansión/contracción de valoración
  const [isRatingExpanded, setIsRatingExpanded] = useState(false);

  // Estados para imágenes y galería
  const [images, setImages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Estados para valoración
  const [puntuacion, setPuntuacion] = useState(false);
  const [isVoted, setIsVoted] = useState(false);
  const [votedNum, setVotedNum] = useState(company.rating);
  const [winKylets, setWinKylets] = useState(0);
  const [winKyletsText, setWinKyletsText] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Estados para modales
  const [showAddOptionsModal, setShowAddOptionsModal] = useState(false);
  const [showListScrollView, setShowListScrollView] = useState(false);
  const [listas, setListas] = useState([]);

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

  const onRefresh = () => {
    setRefreshing(true);
    // Aquí iría la lógica de refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleOpenMap = () => {
    // Abrir mapa con las coordenadas de la empresa
    const url = Platform.OS === 'ios' 
      ? `maps://maps.google.com/maps?daddr=${company.coordinates[0]},${company.coordinates[1]}`
      : `geo:${company.coordinates[0]},${company.coordinates[1]}?q=${company.coordinates[0]},${company.coordinates[1]}(${company.name})`;
    
    Linking.openURL(url).catch(err => console.error('Error opening maps:', err));
  };

  const handleVote = (rating) => {
    setVotedNum(rating);
    setIsVoted(true);
    setWinKylets(10); // Kylets ganados por votar
  };

  const handleFollowCompany = () => {
    setCompany(prev => ({ ...prev, isFollowing: !prev.isFollowing }));
    setConfirmacionMensaje(screenTexts.FollowConfirmate);
    setConfirmacion(true);
  };

  const handleContactCompany = () => {
    setConfirmacionMensaje(screenTexts.ContactConfirmate);
    setConfirmacion(true);
    // Aquí iría la lógica de contacto
  };

  const handleShareCompany = () => {
    setConfirmacionMensaje(screenTexts.ShareConfirmate);
    setConfirmacion(true);
    // Aquí iría la lógica de compartir
  };

  const handleSavePlace = (listId) => {
    // Aquí iría la lógica para guardar la empresa en una lista
    console.log('Guardando empresa en lista:', listId);
  };

  // Función para renderizar beneficios
  const renderBenefits = () => {
    return (
      <View style={styles.contentSection}>
        <FlatList
          data={companyBenefits}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.benefitCard}>
              <View style={styles.benefitHeader}>
                <Text style={styles.benefitIcon}>{item.icon}</Text>
                <View style={styles.benefitInfo}>
                  <Text style={styles.benefitTitle}>{item.title}</Text>
                  <Text style={styles.benefitDescription}>{item.description}</Text>
                </View>
                <View style={styles.benefitDiscount}>
                  <Text style={styles.discountText}>{item.discount}</Text>
                </View>
              </View>
              <View style={styles.benefitFooter}>
                <Text style={styles.benefitCategory}>{item.category}</Text>
                <Text style={styles.benefitValidUntil}>Válido hasta: {item.validUntil}</Text>
              </View>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
    );
  };

  // Función para renderizar productos
  const renderProducts = () => {
    return (
      <View style={styles.contentSection}>
        <FlatList
          data={companyProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productDescription}>{item.description}</Text>
                <View style={styles.productRating}>
                  <FontAwesome name="star" size={12} color="#FFD700" />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
                <View style={styles.productPriceContainer}>
                  <Text style={styles.productPrice}>€{item.price.toFixed(2)}</Text>
                  {item.originalPrice > item.price && (
                    <Text style={styles.productOriginalPrice}>€{item.originalPrice.toFixed(2)}</Text>
                  )}
                  <Text style={styles.productDiscount}>-{item.discount}%</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.addToCartButton}>
                <FontAwesome name="plus" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Top left={true} leftType={'Back'} typeCenter={'Text'} textCenter={screenTexts.Top} />
        <TextLine color={'Blue'} type={'Name'} text={company.category + '     '} />
        
        <ImageBackground source={{ uri: company.coverUrl }} style={styles.fondo}>
          {company.isVerified && (
            <View style={styles.minimalTagContainer}>
              <View style={styles.minimalTag}>
                <Text style={styles.minimalTagText}>Verificado</Text>
              </View>
            </View>
          )}
          
          <View style={styles.minimalRatingContainer}>
            <View style={styles.minimalRatingTag}>
              <Text style={styles.minimalRatingText}>{company.rating.toFixed(1)}</Text>
              <FontAwesome name="star" size={12} color="#FFD700" style={{ marginLeft: 4 }} />
            </View>
          </View>
        </ImageBackground>

        {/* Sección del perfil */}
        <View style={styles.profileSection}>
          <View style={styles.profileItem}>
            <View style={styles.profileItemContent}>
              <Text style={styles.profileItemTitle}>{company.name}</Text>
              <Text style={styles.profileItemText}>{company.description}</Text>
            </View>
            <View style={styles.profileDivider} />
          </View>

          <View style={styles.profileButtons}>
            <TouchableOpacity style={styles.mapButton} onPress={handleFollowCompany}>
              <FontAwesome name={company.isFollowing ? "heart" : "heart-o"} size={20} color="#FF6B6B" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.mapButton} onPress={handleContactCompany}>
              <FontAwesome name="phone" size={20} color="#4ECDC4" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.mapButton} onPress={handleShareCompany}>
              <FontAwesome name="share" size={20} color="#45B7D1" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={() => setShowAddOptionsModal(true)}>
              <Image source={mas} style={styles.addIcon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Sección de información */}
        <View style={[styles.infoSection, !isInfoExpanded && styles.infoSectionClosed]}>
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
                  <Text style={styles.infoItemTitle}>Fundada</Text>
                  <Text style={styles.infoItemText}>{company.foundedYear}</Text>
                </View>
                <View style={styles.infoDivider} />
              </View>

              {/* Empleados */}
              <View style={styles.infoItem}>
                <View style={styles.infoItemContent}>
                  <Text style={styles.infoItemTitle}>Empleados</Text>
                  <Text style={styles.infoItemText}>{company.employees}</Text>
                </View>
                <View style={styles.infoDivider} />
              </View>

              {/* Ubicación */}
              <View style={styles.infoItem}>
                <View style={styles.infoItemContent}>
                  <Text style={styles.infoItemTitle}>Sede Principal</Text>
                  <View style={styles.locationContent}>
                    <TouchableOpacity style={styles.locationIcon} onPress={handleOpenMap}>
                      <Image source={pin_mapa} style={styles.iconoMapa} />
                    </TouchableOpacity>
                    <Text style={styles.infoItemText}>{company.headquarters}</Text>
                  </View>
                </View>
                <View style={styles.infoDivider} />
              </View>

              {/* Sitio web */}
              <View style={styles.infoItem}>
                <View style={styles.infoItemContent}>
                  <Text style={styles.infoItemTitle}>Sitio Web</Text>
                  <Text style={styles.infoItemText}>{company.website}</Text>
                </View>
                <View style={styles.infoDivider} />
              </View>

              {/* Teléfono */}
              <View style={styles.infoItem}>
                <View style={styles.infoItemContent}>
                  <Text style={styles.infoItemTitle}>Teléfono</Text>
                  <Text style={styles.infoItemText}>{company.phone}</Text>
                </View>
                <View style={styles.infoDivider} />
              </View>
            </>
          )}
        </View>

        {/* Sección de valoración */}
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

        {/* Tabs de navegación */}
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

        {/* Contenido de los tabs */}
        {opcion === 1 && (
          <View style={{ marginTop: 0, marginBottom: 24 }}>
            <SocialInfo ref={socialRef} placeId={company.id} name={company.name} categoria={{name: company.category}}/>
          </View>
        )}
        {opcion === 2 && renderBenefits()}
        {opcion === 3 && renderProducts()}

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

      <FloatingGalleryMenu setImages={setImages} setPhotos={() => {}} />

      {error && <Error message={errorMessage} func={setError} />}

      {confirmacion && <Confirmacion message={confirmacionMensaje} func={setConfirmacion} />}

      {/* Modal de opciones */}
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
                  <GradientButton
                    text={screenTexts.GradientButton}
                    color="Blue"
                    onPress={handleFollowCompany}
                  />
                  <GradientButton
                    text={screenTexts.GradientButton2}
                    color="Blue"
                    onPress={handleContactCompany}
                  />
                  <GradientButton
                    text={screenTexts.GradientButton3}
                    color="Blue"
                    onPress={handleShareCompany}
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
  addButton: {
    marginLeft: 10,
    alignSelf: 'flex-start',
  },
  addIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  modalContainer: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  optionBox: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 20,
    maxHeight: '70%',
  },
  modalOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
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
    letterSpacing: -0.2,
    fontStyle: 'italic',
  },
  // Estilos para la sección de contenido
  contentSection: {
    marginTop: 16,
    marginBottom: 24,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  // Estilos para tarjetas de beneficios
  benefitCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  benefitHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  benefitIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  benefitInfo: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  benefitDiscount: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  benefitFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  benefitCategory: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  benefitValidUntil: {
    fontSize: 12,
    color: '#8E8E93',
  },
  // Estilos para tarjetas de productos
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 18,
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 4,
  },
  productPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  productOriginalPrice: {
    fontSize: 14,
    color: '#8E8E93',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  productDiscount: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '600',
    marginLeft: 8,
  },
  addToCartButton: {
    backgroundColor: '#007AFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
});

export default CompanyProfile;