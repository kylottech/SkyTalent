import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Text, Image, TouchableOpacity, Dimensions, StatusBar, Animated, FlatList, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../../context/useUser";

import Top from '../../components/Utils/Top';
import Error from '../../components/Utils/Error';
import Confirmacion from '../../components/Utils/Confirmacion';
import StarRating from '../../components/Utils/StarRating';
import UserPhotos from '../../components/MarketPlace/UserPhotos';
import WriteReview from '../../components/MarketPlace/WriteReview';
import WhatsIncluded from '../../components/MarketPlace/WhatsIncluded';
import BenefitValue from '../../components/MarketPlace/BenefitValue';
import QRCode from '../../components/MarketPlace/QRCode';
import RatingSection from '../../components/MarketPlace/RatingSection';

import ImageViewing from 'react-native-image-viewing';

const { width: screenWidth } = Dimensions.get('window');

// Imágenes del sistema para mejor UX
const IMAGES = [
  require('../../../assets/OnBoarding2.jpg'), // Estadio
  require('../../../assets/OnBoarding3.png'), // Museo
  require('../../../assets/OnBoarding4.png'), // Tour
  require('../../../assets/OnBoarding6.jpg'), // Fans
  require('../../../assets/OnBoarding7.png'), // Estadio noche
  require('../../../assets/OnBoarding8.png'), // Trofeos
];

// Fotos de usuarios usando el beneficio
const USER_PHOTOS = [
  { source: require('../../../assets/adri.jpeg'), userName: '@carlos_madrid' },
  { source: require('../../../assets/OnBoarding2.jpg'), userName: '@ana_bernabeu' },
  { source: require('../../../assets/OnBoarding3.png'), userName: '@david_rm' },
  { source: require('../../../assets/OnBoarding4.png'), userName: '@laura_tour' },
  { source: require('../../../assets/OnBoarding6.jpg'), userName: '@miguel_estadio' },
];

// Elementos incluidos en el beneficio
const INCLUDED_ITEMS = [
  { key: 'Tour' },
  { key: 'Museum' },
  { key: 'Locker' },
  { key: 'Field' },
  { key: 'Gift' },
];

const Details = ({ route }) => {
  const navigate = useNavigation();
  const { isLogged, isLoading, logout, texts } = useUser();
  
  // Obtener parámetros de navegación
  const { type, productData, benefitData } = route.params || {};
  const screenTexts = texts.pages.MarketPlacePages.Details;

  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmacion, setConfirmacion] = useState(false);
  const [confirmacionMensaje, setConfirmacionMensaje] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [isInfoExpanded, setIsInfoExpanded] = useState(true);
  const [isRatingExpanded, setIsRatingExpanded] = useState(true);
  const [isContactExpanded, setIsContactExpanded] = useState(true);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showBenefitSelection, setShowBenefitSelection] = useState(false);
  const [selectedBenefits, setSelectedBenefits] = useState([]);
  const [isBenefitsExpanded, setIsBenefitsExpanded] = useState(true);
  const [isSocialExpanded, setIsSocialExpanded] = useState(true);
  const [isPhotosExpanded, setIsPhotosExpanded] = useState(true);

  // Visor
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  
  // Función para renderizar contenido según el tipo
  const renderContentByType = () => {
    console.log('Details - type:', type);
    console.log('Details - productData:', productData);
    console.log('Details - benefitData:', benefitData);
    
    if (type === 'product') {
      return renderProductDetails();
    } else {
      return renderBenefitDetails();
    }
  };

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (!isLoading && !isLogged) navigate.navigate('Login');
  }, [isLogged, isLoading]);

  // Animación de entrada
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleShare = () => {
    setConfirmacionMensaje('Compartiendo beneficio...');
    setConfirmacion(true);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    setConfirmacionMensaje(isSaved ? 'Beneficio eliminado de favoritos' : 'Beneficio guardado en favoritos');
    setConfirmacion(true);
  };

  const handleSubmitReview = (reviewData) => {
    setConfirmacionMensaje('¡Reseña enviada con éxito!');
    setConfirmacion(true);
    setShowWriteReview(false);
  };

  const handleContactSupport = () => {
    setConfirmacionMensaje('Redirigiendo a soporte...');
    setConfirmacion(true);
  };

  const handlePrivacySecurity = () => {
    setConfirmacionMensaje('Abriendo privacidad y seguridad...');
    setConfirmacion(true);
  };

  const openViewer = (index) => {
    setViewerIndex(index);
    setViewerVisible(true);
  };

  // Funciones para selección de beneficios
  const handleApplyBenefits = () => {
    setShowBenefitSelection(true);
  };

  const toggleBenefitSelection = (benefitId) => {
    setSelectedBenefits(prev => 
      prev.includes(benefitId) 
        ? prev.filter(id => id !== benefitId)
        : [...prev, benefitId]
    );
  };

  const confirmBenefitSelection = () => {
    setConfirmacionMensaje(`${selectedBenefits.length} beneficios aplicados correctamente`);
    setConfirmacion(true);
    setShowBenefitSelection(false);
    setSelectedBenefits([]);
  };

  // Renderizar detalles de producto/servicio - estilo Apple/HSBC/BBVA/Duolingo minimalista
  const renderProductDetails = () => {
    if (!productData) return null;
    
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        
        {/* Header minimalista - estilo Apple */}
        <Top 
          title={productData.title || 'iPhone 15 Pro Max'}
          showBack={true}
          showShare={true}
          showLocation={true}
          onBack={() => navigate.goBack()}
          onShare={handleShare}
          onLocation={() => {}}
        />

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Imagen del producto - encima del título */}
          <View style={styles.imageSection}>
            <Image 
              source={require('../../../assets/OnBoarding2.jpg')} 
              style={styles.productImage} 
              resizeMode="cover"
            />
          </View>
          
          {/* Título principal - estilo PlaceInfo */}
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>{productData.title || 'iPhone 15 Pro Max'}</Text>
            <Text style={styles.productDescription}>
              {productData.subtitle || 'El iPhone más avanzado con chip A17 Pro, cámara de 48MP con zoom óptico 5x, y batería que dura todo el día. Disponible en Titanio Natural, Titanio Azul, Titanio Blanco y Titanio Negro.'}
            </Text>
          </View>

          {/* Sección de información - expandible */}
          <View style={styles.infoSection}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoMainTitle}>Información</Text>
              <TouchableOpacity 
                style={styles.expandButton} 
                onPress={() => setIsInfoExpanded(!isInfoExpanded)}
              >
                <Text style={styles.expandIcon}>{isInfoExpanded ? '−' : '+'}</Text>
              </TouchableOpacity>
            </View>
            
            {isInfoExpanded && (
              <>
                {/* Vendedor */}
                <View style={styles.infoItem}>
                  <View style={styles.infoItemContent}>
                    <Text style={styles.infoItemTitle}>Vendedor</Text>
                    <Text style={styles.infoItemText}>{productData.seller || '@apple_store_madrid'}</Text>
          </View>
                  <View style={styles.infoDivider} />
        </View>

                {/* Fecha de publicación */}
                <View style={styles.infoItem}>
                  <View style={styles.infoItemContent}>
                    <Text style={styles.infoItemTitle}>Publicado</Text>
                    <Text style={styles.infoItemText}>{productData.publishedDate || '15-01-2025'}</Text>
                  </View>
                  <View style={styles.infoDivider} />
          </View>

                {/* Ubicación del vendedor */}
                <View style={styles.infoItem}>
                  <View style={styles.infoItemContent}>
                    <Text style={styles.infoItemTitle}>Ubicación</Text>
                    <View style={styles.locationContent}>
                      <Image source={require('../../../assets/pinMapa.png')} style={styles.iconoMapa} />
                      <Text style={styles.infoItemText}>{productData.sellerLocation || 'Madrid, España'}</Text>
                </View>
              </View>
                  <View style={styles.infoDivider} />
                </View>
                
                {/* Condición del producto */}
                <View style={styles.infoItem}>
                  <View style={styles.infoItemContent}>
                    <Text style={styles.infoItemTitle}>Condición</Text>
                    <Text style={styles.infoItemText}>{productData.condition || 'Nuevo'}</Text>
                  </View>
                  <View style={styles.infoDivider} />
                  </View>
                
                {/* Garantía */}
                <View style={styles.infoItem}>
                  <View style={styles.infoItemContent}>
                    <Text style={styles.infoItemTitle}>Garantía</Text>
                    <Text style={styles.infoItemText}>{productData.warranty || '2 años de garantía oficial'}</Text>
                  </View>
                  <View style={styles.infoDivider} />
                  </View>
              </>
            )}
                </View>

          {/* Sección de valoración - expandible */}
          <View style={styles.ratingSection}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoMainTitle}>Valoración</Text>
              <TouchableOpacity 
                style={styles.expandButton} 
                onPress={() => setIsRatingExpanded(!isRatingExpanded)}
              >
                <Text style={styles.expandIcon}>{isRatingExpanded ? '−' : '+'}</Text>
              </TouchableOpacity>
                  </View>
            
            {isRatingExpanded && (
              <View style={styles.ratingContainer}>
                <View style={styles.ratingMain}>
                  <Text style={styles.ratingNumber}>{parseFloat(productData.rating) || 4.8}</Text>
                  <View style={styles.starsContainer}>
                    <Image source={require('../../../assets/full_star.png')} style={styles.starIcon} />
                    <Image source={require('../../../assets/full_star.png')} style={styles.starIcon} />
                    <Image source={require('../../../assets/full_star.png')} style={styles.starIcon} />
                    <Image source={require('../../../assets/full_star.png')} style={styles.starIcon} />
                    <Image source={require('../../../assets/full_star.png')} style={styles.starIcon} />
                    <Image source={require('../../../assets/full_star.png')} style={styles.starIcon} />
                    <Image source={require('../../../assets/full_star.png')} style={styles.starIcon} />
                  </View>
                </View>
                <TouchableOpacity onPress={() => setShowAllReviews(!showAllReviews)}>
                  <Text style={styles.reviewsCount}>({productData.reviews || 127} reseñas)</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.writeReviewButton} onPress={() => setShowWriteReview(true)}>
                  <Text style={styles.writeReviewText}>Escribir reseña</Text>
                </TouchableOpacity>
                
                {showAllReviews && (
                  <View style={styles.allReviewsContainer}>
                    <Text style={styles.allReviewsTitle}>Todas las reseñas</Text>
                    <View style={styles.reviewItem}>
                      <View style={styles.reviewHeader}>
                        <Text style={styles.reviewUser}>@maria_tech</Text>
                        <View style={styles.reviewStars}>
                          <Image source={require('../../../assets/full_star.png')} style={styles.smallStarIcon} />
                          <Image source={require('../../../assets/full_star.png')} style={styles.smallStarIcon} />
                          <Image source={require('../../../assets/full_star.png')} style={styles.smallStarIcon} />
                          <Image source={require('../../../assets/full_star.png')} style={styles.smallStarIcon} />
                          <Image source={require('../../../assets/full_star.png')} style={styles.smallStarIcon} />
                          <Image source={require('../../../assets/full_star.png')} style={styles.smallStarIcon} />
                          <Image source={require('../../../assets/full_star.png')} style={styles.smallStarIcon} />
                  </View>
                  </View>
                      <Text style={styles.reviewText}>Increíble teléfono. La cámara es espectacular y la batería dura todo el día. La compra perfecta.</Text>
                </View>
                    <View style={styles.reviewItem}>
                      <View style={styles.reviewHeader}>
                        <Text style={styles.reviewUser}>@carlos_dev</Text>
                        <View style={styles.reviewStars}>
                          <Image source={require('../../../assets/full_star.png')} style={styles.smallStarIcon} />
                          <Image source={require('../../../assets/full_star.png')} style={styles.smallStarIcon} />
                          <Image source={require('../../../assets/full_star.png')} style={styles.smallStarIcon} />
                          <Image source={require('../../../assets/full_star.png')} style={styles.smallStarIcon} />
                          <Image source={require('../../../assets/full_star.png')} style={styles.smallStarIcon} />
                          <Image source={require('../../../assets/full_star.png')} style={styles.smallStarIcon} />
                          <Image source={require('../../../assets/empty_star.png')} style={styles.smallStarIcon} />
              </View>
            </View>
                      <Text style={styles.reviewText}>Excelente rendimiento, aunque el precio es elevado. La calidad de construcción es impresionante.</Text>
                </View>
                    
                    <TouchableOpacity style={styles.viewAllReviewsButton} onPress={() => navigate.navigate('AllReviews', { productId: productData.id })}>
                      <Text style={styles.viewAllReviewsText}>Ver todas las reseñas</Text>
                </TouchableOpacity>
              </View>
                )}
            </View>
            )}
                </View>

          {/* Sección de contacto - expandible */}
          <View style={styles.contactSection}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoMainTitle}>Contacto</Text>
              <TouchableOpacity 
                style={styles.expandButton} 
                onPress={() => setIsContactExpanded(!isContactExpanded)}
              >
                <Text style={styles.expandIcon}>{isContactExpanded ? '−' : '+'}</Text>
                </TouchableOpacity>
              </View>
            
            {isContactExpanded && (
              <>
                <View style={styles.infoItem}>
                  <View style={styles.infoItemContent}>
                    <Text style={styles.infoItemTitle}>Teléfono</Text>
                    <Text style={styles.infoItemText}>+34 91 398 43 00</Text>
                  </View>
                  <View style={styles.infoDivider} />
                  </View>
                
                <View style={styles.infoItem}>
                  <View style={styles.infoItemContent}>
                    <Text style={styles.infoItemTitle}>Email</Text>
                    <Text style={styles.infoItemText}>info@realmadrid.com</Text>
                  </View>
                  <View style={styles.infoDivider} />
                  </View>
              </>
            )}
          </View>

          {/* Sección de beneficios aplicables - expandible */}
          <View style={styles.benefitsSection}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoMainTitle}>Beneficios aplicables</Text>
              <TouchableOpacity 
                style={styles.expandButton} 
                onPress={() => setIsBenefitsExpanded(!isBenefitsExpanded)}
              >
                <Text style={styles.expandIcon}>{isBenefitsExpanded ? '−' : '+'}</Text>
              </TouchableOpacity>
            </View>
            
            {isBenefitsExpanded && (
              <>
                <View style={styles.benefitsContainer}>
                  <View style={styles.benefitCard}>
                    <View style={styles.benefitIconContainer}>
                      <Image source={require('../../../assets/CORONA_DORADA.png')} style={styles.benefitIcon} />
                    </View>
                    <View style={styles.benefitContent}>
                      <Text style={styles.benefitTitle}>Descuento Premium</Text>
                      <Text style={styles.benefitDescription}>Descuento exclusivo para miembros</Text>
                      <Text style={styles.benefitValue}>20% OFF</Text>
                    </View>
                    <View style={styles.benefitStatus}>
                      <Text style={styles.benefitStatusText}>Disponible</Text>
                    </View>
                  </View>
                  
                  <View style={styles.benefitCard}>
                    <View style={styles.benefitIconContainer}>
                      <Image source={require('../../../assets/walletMenu.png')} style={styles.benefitIcon} />
                    </View>
                    <View style={styles.benefitContent}>
                      <Text style={styles.benefitTitle}>Ahorro Garantizado</Text>
                      <Text style={styles.benefitDescription}>Ahorra en tu compra</Text>
                      <Text style={styles.benefitValue}>€20</Text>
                    </View>
                    <View style={styles.benefitStatus}>
                      <Text style={styles.benefitStatusText}>Disponible</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.benefitsActions}>
                  <TouchableOpacity style={styles.applyGradientButton} onPress={handleApplyBenefits}>
                    <Text style={styles.applyGradientButtonText}>Aplicar beneficios</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.selectOtherBenefitsGradientButton}>
                    <Text style={styles.selectOtherBenefitsGradientText}>Ver más beneficios</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>

          {/* Sección social - expandible */}
          <View style={styles.socialSection}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoMainTitle}>Social</Text>
              <TouchableOpacity 
                style={styles.expandButton} 
                onPress={() => setIsSocialExpanded(!isSocialExpanded)}
              >
                <Text style={styles.expandIcon}>{isSocialExpanded ? '−' : '+'}</Text>
              </TouchableOpacity>
            </View>
            
            {isSocialExpanded && (
              <>
                <Text style={styles.socialSubtitle}>Usuarios que han adquirido este producto</Text>
                
                <View style={styles.usersContainer}>
                  <View style={styles.userItem}>
                    <Image source={require('../../../assets/adri.jpeg')} style={styles.userAvatar} />
                    <Text style={styles.userName}>@carlos_madrid</Text>
                  </View>
                  <View style={styles.userItem}>
                    <Image source={require('../../../assets/OnBoarding2.jpg')} style={styles.userAvatar} />
                    <Text style={styles.userName}>@ana_bernabeu</Text>
                  </View>
                  <View style={styles.userItem}>
                    <Image source={require('../../../assets/OnBoarding3.png')} style={styles.userAvatar} />
                    <Text style={styles.userName}>@david_rm</Text>
                  </View>
                  <View style={styles.userItem}>
                    <Image source={require('../../../assets/OnBoarding4.png')} style={styles.userAvatar} />
                    <Text style={styles.userName}>@laura_tour</Text>
                  </View>
                </View>
              </>
            )}
          </View>

          {/* Sección de fotos compartidas - expandible */}
          <View style={styles.photosSection}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoMainTitle}>Fotos compartidas</Text>
              <TouchableOpacity 
                style={styles.expandButton} 
                onPress={() => setIsPhotosExpanded(!isPhotosExpanded)}
              >
                <Text style={styles.expandIcon}>{isPhotosExpanded ? '−' : '+'}</Text>
              </TouchableOpacity>
            </View>
            
            {isPhotosExpanded && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosHorizontalScroll}>
                <Image source={require('../../../assets/OnBoarding2.jpg')} style={styles.photoItemVertical} />
                <Image source={require('../../../assets/OnBoarding3.png')} style={styles.photoItemVertical} />
                <Image source={require('../../../assets/OnBoarding4.png')} style={styles.photoItemVertical} />
                <Image source={require('../../../assets/OnBoarding6.jpg')} style={styles.photoItemVertical} />
                <Image source={require('../../../assets/OnBoarding7.png')} style={styles.photoItemVertical} />
                <Image source={require('../../../assets/OnBoarding8.png')} style={styles.photoItemVertical} />
              </ScrollView>
            )}
          </View>

          {/* Botón de acción - estilo Apple/Duolingo */}
          <View style={styles.actionSection}>
            <TouchableOpacity style={styles.primaryGradientButton}>
              <Text style={styles.primaryGradientButtonText}>
                  {productData.isService ? 'Contratar' : 'Comprar'}
                </Text>
              </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Modal de escribir reseña */}
        <WriteReview
          visible={showWriteReview}
          onClose={() => setShowWriteReview(false)}
          onSubmit={handleSubmitReview}
        />

        {/* Modal de selección de beneficios */}
        <Modal
          visible={showBenefitSelection}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar beneficios</Text>
              <TouchableOpacity onPress={() => setShowBenefitSelection(false)}>
                <Text style={styles.modalCloseText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <Text style={styles.modalSubtitle}>Selecciona los beneficios que deseas aplicar:</Text>
              
              <View style={styles.benefitSelectionList}>
                <TouchableOpacity 
                  style={[
                    styles.benefitSelectionItem,
                    selectedBenefits.includes('discount') && styles.benefitSelectionItemSelected
                  ]}
                  onPress={() => toggleBenefitSelection('discount')}
                >
                  <View style={styles.benefitSelectionContent}>
                    <View style={styles.benefitSelectionIcon}>
                      <Image source={require('../../../assets/CORONA_DORADA.png')} style={styles.benefitSelectionIconImage} />
                    </View>
                    <View style={styles.benefitSelectionInfo}>
                      <Text style={styles.benefitSelectionTitle}>Descuento Premium</Text>
                      <Text style={styles.benefitSelectionDescription}>Descuento exclusivo para miembros</Text>
                      <Text style={styles.benefitSelectionValue}>20% OFF</Text>
                    </View>
                  </View>
                  <View style={[
                    styles.benefitSelectionCheckbox,
                    selectedBenefits.includes('discount') && styles.benefitSelectionCheckboxSelected
                  ]}>
                    {selectedBenefits.includes('discount') && (
                      <Text style={styles.benefitSelectionCheckmark}>✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.benefitSelectionItem,
                    selectedBenefits.includes('savings') && styles.benefitSelectionItemSelected
                  ]}
                  onPress={() => toggleBenefitSelection('savings')}
                >
                  <View style={styles.benefitSelectionContent}>
                    <View style={styles.benefitSelectionIcon}>
                      <Image source={require('../../../assets/walletMenu.png')} style={styles.benefitSelectionIconImage} />
                    </View>
                    <View style={styles.benefitSelectionInfo}>
                      <Text style={styles.benefitSelectionTitle}>Ahorro Garantizado</Text>
                      <Text style={styles.benefitSelectionDescription}>Ahorra en tu compra</Text>
                      <Text style={styles.benefitSelectionValue}>€20</Text>
                    </View>
                  </View>
                  <View style={[
                    styles.benefitSelectionCheckbox,
                    selectedBenefits.includes('savings') && styles.benefitSelectionCheckboxSelected
                  ]}>
                    {selectedBenefits.includes('savings') && (
                      <Text style={styles.benefitSelectionCheckmark}>✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[
                  styles.modalConfirmButton,
                  selectedBenefits.length === 0 && styles.modalConfirmButtonDisabled
                ]}
                onPress={confirmBenefitSelection}
                disabled={selectedBenefits.length === 0}
              >
                <Text style={[
                  styles.modalConfirmButtonText,
                  selectedBenefits.length === 0 && styles.modalConfirmButtonTextDisabled
                ]}>
                  Aplicar {selectedBenefits.length} beneficio{selectedBenefits.length !== 1 ? 's' : ''}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Componentes de error y confirmación */}
        {error && <Error message={errorMessage} func={setError} />}
        {confirmacion && <Confirmacion message={confirmacionMensaje} func={setConfirmacion} />}
      </View>
    );
  };
  
  // Renderizar detalles de beneficio - estilo Apple/HSBC/BBVA/Duolingo minimalista
  const renderBenefitDetails = () => {
    if (!benefitData) return null;
    
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        
        {/* Header minimalista - estilo Apple */}
        <Top 
          title={benefitData.title || 'Tour Santiago Bernabéu'}
          showBack={true}
          showShare={true}
          showLocation={true}
          onBack={() => navigate.goBack()}
          onShare={handleShare}
          onLocation={() => {}}
        />

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Imagen del producto - encima del título */}
          <View style={styles.imageSection}>
            <Image 
              source={require('../../../assets/OnBoarding2.jpg')} 
              style={styles.productImage} 
              resizeMode="cover"
            />
          </View>
          
          {/* Título principal - estilo PlaceInfo */}
          <View style={styles.titleSection}>
            <View style={styles.titleRow}>
              <Text style={styles.mainTitle}>{benefitData.title || 'Tour Santiago Bernabéu'}</Text>
              <View style={styles.titleActions}>
                <TouchableOpacity style={styles.titleActionButton} onPress={handleShare}>
                  <Image source={require('../../../assets/send.png')} style={styles.titleActionIcon} />
            </TouchableOpacity>
                <TouchableOpacity style={styles.titleActionButton} onPress={() => {}}>
                  <Image source={require('../../../assets/pinMapa.png')} style={styles.titleActionIcon} />
              </TouchableOpacity>
            </View>
          </View>
            <Text style={styles.productDescription}>
              Descubre la historia del club más exitoso del mundo y vive una experiencia única en el Santiago Bernabéu.
            </Text>
        </View>

          {/* Sección de información - expandible */}
          <View style={styles.infoSection}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoMainTitle}>Información</Text>
              <TouchableOpacity 
                style={styles.expandButton} 
                onPress={() => setIsInfoExpanded(!isInfoExpanded)}
              >
                <Text style={styles.expandIcon}>{isInfoExpanded ? '−' : '+'}</Text>
              </TouchableOpacity>
          </View>

            {isInfoExpanded && (
              <>
                {/* Información del creador */}
                <View style={styles.infoItem}>
                  <View style={styles.infoItemContent}>
                    <Text style={styles.infoItemTitle}>Creador</Text>
                    <Text style={styles.infoItemText}>{benefitData.username || '@realmadrid'}</Text>
                </View>
                  <View style={styles.infoDivider} />
              </View>
                
                {/* Fecha */}
                <View style={styles.infoItem}>
                  <View style={styles.infoItemContent}>
                    <Text style={styles.infoItemTitle}>Fecha</Text>
                    <Text style={styles.infoItemText}>{benefitData.date || '24-06-2025'}</Text>
                  </View>
                  <View style={styles.infoDivider} />
                  </View>
                
                {/* Ubicación */}
                <View style={styles.infoItem}>
                  <View style={styles.infoItemContent}>
                    <Text style={styles.infoItemTitle}>Ubicación</Text>
                    <View style={styles.locationContent}>
                      <Image source={require('../../../assets/pinMapa.png')} style={styles.iconoMapa} />
                      <Text style={styles.infoItemText}>{benefitData.location || 'Santiago Bernabéu, Madrid'}</Text>
                  </View>
                  </View>
                  <View style={styles.infoDivider} />
                </View>
                
                {/* Mi mejor experiencia */}
                <View style={styles.infoItem}>
                  <View style={styles.infoItemContent}>
                    <Text style={styles.infoItemTitle}>Mi mejor Experiencia</Text>
                    <Text style={styles.infoItemText}>{benefitData.bestExperience || 'Tour del estadio'}</Text>
                  </View>
                  <View style={styles.infoDivider} />
                  </View>
                
                {/* Mi recomendación */}
                <View style={styles.infoItem}>
                  <View style={styles.infoItemContent}>
                    <Text style={styles.infoItemTitle}>Mi recomendación</Text>
                    <Text style={styles.infoItemText}>{benefitData.recommendation || 'Experiencia única para fans del fútbol'}</Text>
                  </View>
                  <View style={styles.infoDivider} />
                  </View>
              </>
            )}
                </View>

          {/* Sección de valoración - expandible */}
          <View style={styles.ratingSection}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoMainTitle}>Valoración</Text>
              <TouchableOpacity 
                style={styles.expandButton} 
                onPress={() => setIsRatingExpanded(!isRatingExpanded)}
              >
                <Text style={styles.expandIcon}>{isRatingExpanded ? '−' : '+'}</Text>
              </TouchableOpacity>
            </View>

            {isRatingExpanded && (
              <View style={styles.ratingContainer}>
                <View style={styles.ratingMain}>
                  <Text style={styles.ratingNumber}>4.8</Text>
                  <View style={styles.starsContainer}>
                    <Image source={require('../../../assets/full_star.png')} style={styles.starIcon} />
                    <Image source={require('../../../assets/full_star.png')} style={styles.starIcon} />
                    <Image source={require('../../../assets/full_star.png')} style={styles.starIcon} />
                    <Image source={require('../../../assets/full_star.png')} style={styles.starIcon} />
                    <Image source={require('../../../assets/full_star.png')} style={styles.starIcon} />
                    <Image source={require('../../../assets/full_star.png')} style={styles.starIcon} />
                    <Image source={require('../../../assets/full_star.png')} style={styles.starIcon} />
                </View>
                </View>
                <TouchableOpacity onPress={() => setShowAllReviews(!showAllReviews)}>
                  <Text style={styles.reviewsCount}>(56 reseñas)</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.writeReviewButton} onPress={() => setShowWriteReview(true)}>
                  <Text style={styles.writeReviewText}>Escribir reseña</Text>
                </TouchableOpacity>
                
                {showAllReviews && (
                  <View style={styles.allReviewsContainer}>
                    <Text style={styles.allReviewsTitle}>Todas las reseñas</Text>
                    <View style={styles.reviewItem}>
                      <View style={styles.reviewHeader}>
                        <Text style={styles.reviewUser}>@maria_tech</Text>
                        <View style={styles.reviewStars}>
                          <Image source={require('../../../assets/full_star.png')} style={styles.smallStarIcon} />
                          <Image source={require('../../../assets/full_star.png')} style={styles.smallStarIcon} />
                          <Image source={require('../../../assets/full_star.png')} style={styles.smallStarIcon} />
                          <Image source={require('../../../assets/full_star.png')} style={styles.smallStarIcon} />
                          <Image source={require('../../../assets/full_star.png')} style={styles.smallStarIcon} />
                          <Image source={require('../../../assets/full_star.png')} style={styles.smallStarIcon} />
                          <Image source={require('../../../assets/full_star.png')} style={styles.smallStarIcon} />
              </View>
            </View>
                      <Text style={styles.reviewText}>Increíble teléfono. La cámara es espectacular y la batería dura todo el día. La compra perfecta.</Text>
                </View>
                    <View style={styles.reviewItem}>
                      <View style={styles.reviewHeader}>
                        <Text style={styles.reviewUser}>@carlos_dev</Text>
                        <View style={styles.reviewStars}>
                          <Image source={require('../../../assets/full_star.png')} style={styles.smallStarIcon} />
                          <Image source={require('../../../assets/full_star.png')} style={styles.smallStarIcon} />
                          <Image source={require('../../../assets/full_star.png')} style={styles.smallStarIcon} />
                          <Image source={require('../../../assets/full_star.png')} style={styles.smallStarIcon} />
                          <Image source={require('../../../assets/full_star.png')} style={styles.smallStarIcon} />
                          <Image source={require('../../../assets/full_star.png')} style={styles.smallStarIcon} />
                          <Image source={require('../../../assets/empty_star.png')} style={styles.smallStarIcon} />
              </View>
                  </View>
                      <Text style={styles.reviewText}>Excelente rendimiento, aunque el precio es elevado. La calidad de construcción es impresionante.</Text>
                  </View>
                    
                    <TouchableOpacity style={styles.viewAllReviewsButton} onPress={() => navigate.navigate('AllReviews', { productId: productData.id })}>
                      <Text style={styles.viewAllReviewsText}>Ver todas las reseñas</Text>
                </TouchableOpacity>
                  </View>
                )}
                  </View>
            )}
          </View>

          {/* Sección de contacto - expandible */}
          <View style={styles.contactSection}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoMainTitle}>Contacto</Text>
              <TouchableOpacity 
                style={styles.expandButton} 
                onPress={() => setIsContactExpanded(!isContactExpanded)}
              >
                <Text style={styles.expandIcon}>{isContactExpanded ? '−' : '+'}</Text>
                </TouchableOpacity>
              </View>
            
            {isContactExpanded && (
              <>
                <View style={styles.infoItem}>
                  <View style={styles.infoItemContent}>
                    <Text style={styles.infoItemTitle}>Teléfono</Text>
                    <Text style={styles.infoItemText}>+34 91 398 43 00</Text>
                  </View>
                  <View style={styles.infoDivider} />
            </View>

                <View style={styles.infoItem}>
                  <View style={styles.infoItemContent}>
                    <Text style={styles.infoItemTitle}>Email</Text>
                    <Text style={styles.infoItemText}>info@realmadrid.com</Text>
                  </View>
                  <View style={styles.infoDivider} />
                </View>
              </>
            )}
          </View>

          {/* Sección de beneficios aplicables - expandible */}
          <View style={styles.benefitsSection}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoMainTitle}>Beneficios aplicables</Text>
              <TouchableOpacity 
                style={styles.expandButton} 
                onPress={() => setIsBenefitsExpanded(!isBenefitsExpanded)}
              >
                <Text style={styles.expandIcon}>{isBenefitsExpanded ? '−' : '+'}</Text>
              </TouchableOpacity>
            </View>
            
            {isBenefitsExpanded && (
              <>
                <View style={styles.benefitsContainer}>
                  <View style={styles.benefitCard}>
                    <View style={styles.benefitIconContainer}>
                      <Image source={require('../../../assets/CORONA_DORADA.png')} style={styles.benefitIcon} />
                    </View>
                    <View style={styles.benefitContent}>
                      <Text style={styles.benefitTitle}>Descuento Premium</Text>
                      <Text style={styles.benefitDescription}>Descuento exclusivo para miembros</Text>
                      <Text style={styles.benefitValue}>20% OFF</Text>
                    </View>
                    <View style={styles.benefitStatus}>
                      <Text style={styles.benefitStatusText}>Disponible</Text>
                    </View>
                  </View>
                  
                  <View style={styles.benefitCard}>
                    <View style={styles.benefitIconContainer}>
                      <Image source={require('../../../assets/walletMenu.png')} style={styles.benefitIcon} />
                    </View>
                    <View style={styles.benefitContent}>
                      <Text style={styles.benefitTitle}>Ahorro Garantizado</Text>
                      <Text style={styles.benefitDescription}>Ahorra en tu compra</Text>
                      <Text style={styles.benefitValue}>€20</Text>
                    </View>
                    <View style={styles.benefitStatus}>
                      <Text style={styles.benefitStatusText}>Disponible</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.benefitsActions}>
                  <TouchableOpacity style={styles.applyGradientButton} onPress={handleApplyBenefits}>
                    <Text style={styles.applyGradientButtonText}>Aplicar beneficios</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.selectOtherBenefitsGradientButton}>
                    <Text style={styles.selectOtherBenefitsGradientText}>Ver más beneficios</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>

          {/* Sección social - expandible */}
          <View style={styles.socialSection}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoMainTitle}>Social</Text>
              <TouchableOpacity 
                style={styles.expandButton} 
                onPress={() => setIsSocialExpanded(!isSocialExpanded)}
              >
                <Text style={styles.expandIcon}>{isSocialExpanded ? '−' : '+'}</Text>
              </TouchableOpacity>
            </View>
            
            {isSocialExpanded && (
              <>
                <Text style={styles.socialSubtitle}>Usuarios que han adquirido este producto</Text>
                
                <View style={styles.usersContainer}>
                  <View style={styles.userItem}>
                    <Image source={require('../../../assets/adri.jpeg')} style={styles.userAvatar} />
                    <Text style={styles.userName}>@carlos_madrid</Text>
                  </View>
                  <View style={styles.userItem}>
                    <Image source={require('../../../assets/OnBoarding2.jpg')} style={styles.userAvatar} />
                    <Text style={styles.userName}>@ana_bernabeu</Text>
                  </View>
                  <View style={styles.userItem}>
                    <Image source={require('../../../assets/OnBoarding3.png')} style={styles.userAvatar} />
                    <Text style={styles.userName}>@david_rm</Text>
                  </View>
                  <View style={styles.userItem}>
                    <Image source={require('../../../assets/OnBoarding4.png')} style={styles.userAvatar} />
                    <Text style={styles.userName}>@laura_tour</Text>
                  </View>
                </View>
              </>
            )}
          </View>

          {/* Sección de fotos compartidas - expandible */}
          <View style={styles.photosSection}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoMainTitle}>Fotos compartidas</Text>
              <TouchableOpacity 
                style={styles.expandButton} 
                onPress={() => setIsPhotosExpanded(!isPhotosExpanded)}
              >
                <Text style={styles.expandIcon}>{isPhotosExpanded ? '−' : '+'}</Text>
              </TouchableOpacity>
            </View>
            
            {isPhotosExpanded && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosHorizontalScroll}>
                <Image source={require('../../../assets/OnBoarding2.jpg')} style={styles.photoItemVertical} />
                <Image source={require('../../../assets/OnBoarding3.png')} style={styles.photoItemVertical} />
                <Image source={require('../../../assets/OnBoarding4.png')} style={styles.photoItemVertical} />
                <Image source={require('../../../assets/OnBoarding6.jpg')} style={styles.photoItemVertical} />
                <Image source={require('../../../assets/OnBoarding7.png')} style={styles.photoItemVertical} />
                <Image source={require('../../../assets/OnBoarding8.png')} style={styles.photoItemVertical} />
              </ScrollView>
            )}
          </View>

          {/* Botón de acción - estilo Apple/Duolingo */}
          <View style={styles.actionSection}>
            <TouchableOpacity style={styles.primaryGradientButton}>
              <Text style={styles.primaryGradientButtonText}>Reservar ahora</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Modal de escribir reseña */}
        <WriteReview
          visible={showWriteReview}
          onClose={() => setShowWriteReview(false)}
          onSubmit={handleSubmitReview}
        />

        {/* Modal de selección de beneficios */}
        <Modal
          visible={showBenefitSelection}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar beneficios</Text>
              <TouchableOpacity onPress={() => setShowBenefitSelection(false)}>
                <Text style={styles.modalCloseText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <Text style={styles.modalSubtitle}>Selecciona los beneficios que deseas aplicar:</Text>
              
              <View style={styles.benefitSelectionList}>
                <TouchableOpacity 
                  style={[
                    styles.benefitSelectionItem,
                    selectedBenefits.includes('discount') && styles.benefitSelectionItemSelected
                  ]}
                  onPress={() => toggleBenefitSelection('discount')}
                >
                  <View style={styles.benefitSelectionContent}>
                    <View style={styles.benefitSelectionIcon}>
                      <Image source={require('../../../assets/CORONA_DORADA.png')} style={styles.benefitSelectionIconImage} />
                    </View>
                    <View style={styles.benefitSelectionInfo}>
                      <Text style={styles.benefitSelectionTitle}>Descuento Premium</Text>
                      <Text style={styles.benefitSelectionDescription}>Descuento exclusivo para miembros</Text>
                      <Text style={styles.benefitSelectionValue}>20% OFF</Text>
                    </View>
                  </View>
                  <View style={[
                    styles.benefitSelectionCheckbox,
                    selectedBenefits.includes('discount') && styles.benefitSelectionCheckboxSelected
                  ]}>
                    {selectedBenefits.includes('discount') && (
                      <Text style={styles.benefitSelectionCheckmark}>✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.benefitSelectionItem,
                    selectedBenefits.includes('savings') && styles.benefitSelectionItemSelected
                  ]}
                  onPress={() => toggleBenefitSelection('savings')}
                >
                  <View style={styles.benefitSelectionContent}>
                    <View style={styles.benefitSelectionIcon}>
                      <Image source={require('../../../assets/walletMenu.png')} style={styles.benefitSelectionIconImage} />
                    </View>
                    <View style={styles.benefitSelectionInfo}>
                      <Text style={styles.benefitSelectionTitle}>Ahorro Garantizado</Text>
                      <Text style={styles.benefitSelectionDescription}>Ahorra en tu compra</Text>
                      <Text style={styles.benefitSelectionValue}>€20</Text>
                    </View>
                  </View>
                  <View style={[
                    styles.benefitSelectionCheckbox,
                    selectedBenefits.includes('savings') && styles.benefitSelectionCheckboxSelected
                  ]}>
                    {selectedBenefits.includes('savings') && (
                      <Text style={styles.benefitSelectionCheckmark}>✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[
                  styles.modalConfirmButton,
                  selectedBenefits.length === 0 && styles.modalConfirmButtonDisabled
                ]}
                onPress={confirmBenefitSelection}
                disabled={selectedBenefits.length === 0}
              >
                <Text style={[
                  styles.modalConfirmButtonText,
                  selectedBenefits.length === 0 && styles.modalConfirmButtonTextDisabled
                ]}>
                  Aplicar {selectedBenefits.length} beneficio{selectedBenefits.length !== 1 ? 's' : ''}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Componentes de error y confirmación */}
        {error && <Error message={errorMessage} func={setError} />}
        {confirmacion && <Confirmacion message={confirmacionMensaje} func={setConfirmacion} />}
      </View>
    );
  };

  return renderContentByType();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  // Header minimalista - estilo Apple
  cleanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: '#1D1D1F',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  actionIcon: {
    width: 20,
    height: 20,
    tintColor: '#FFFFFF',
  },
  
  scrollContent: {
    flex: 1,
  },
  
  // Imagen del producto
  imageSection: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
  },
  
  // Título principal - estilo PlaceInfo
  titleSection: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
    letterSpacing: -0.6,
    lineHeight: 26,
    textAlign: 'left',
    flex: 1,
  },
  titleActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  titleActionIcon: {
    width: 16,
    height: 16,
    tintColor: '#FFFFFF',
  },
  productDescription: {
    fontSize: 15,
    color: '#8E8E93',
    fontWeight: '400',
    letterSpacing: -0.2,
    lineHeight: 20,
  },
  
  // Sección de información - estilo PlaceInfo
  infoSection: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoMainTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: -0.6,
    lineHeight: 26,
    textAlign: 'left',
  },
  expandButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandIcon: {
    fontSize: 18,
    fontWeight: '400',
    color: '#86868B',
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
    backgroundColor: '#FFFFFF',
    marginTop: 4,
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconoMapa: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    marginRight: 5,
  },
  
  // Sección de valoración
  ratingSection: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  ratingContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  ratingMain: {
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    width: 20,
    height: 20,
    marginHorizontal: 2,
    tintColor: '#CBB992',
  },
  reviewsCount: {
    fontSize: 15,
    color: '#8E8E93',
    marginBottom: 16,
  },
  writeReviewButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  writeReviewText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  allReviewsContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  allReviewsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  reviewItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewUser: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  reviewStars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallStarIcon: {
    width: 14,
    height: 14,
    marginHorizontal: 1,
    tintColor: '#CBB992',
  },
  reviewText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  
  // Sección de contacto
  contactSection: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  
  // Sección de beneficios
  benefitsSection: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  // Sección de fotos
  photosSection: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  benefitValue: {
    fontSize: 15,
    color: '#34C759',
    fontWeight: '600',
    letterSpacing: -0.2,
    lineHeight: 20,
  },
  applyButton: {
    backgroundColor: '#34C759',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  // Sección social
  socialSection: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  socialSubtitle: {
    fontSize: 15,
    color: '#8E8E93',
    marginBottom: 20,
  },
  usersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  userItem: {
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 16,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
  },
  userName: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
  photosContainer: {
    marginTop: 8,
  },
  photosTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photoItem: {
    width: '48%',
    height: 120,
    borderRadius: 12,
    marginBottom: 12,
  },
  
  // Sección de acción
  actionSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  selectOtherBenefitsButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectOtherBenefitsText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#007AFF',
    letterSpacing: -0.2,
  },
  photosHorizontalScroll: {
    marginTop: 12,
  },
  photoItemVertical: {
    width: 120,
    height: 160,
    borderRadius: 8,
    marginRight: 12,
    resizeMode: 'cover',
  },
  viewAllReviewsButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 16,
    alignItems: 'center',
  },
  viewAllReviewsText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  // Nuevos estilos para beneficios mejorados
  benefitsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  benefitsMainTitle: {
    fontSize: 22,
    fontWeight: '300',
    fontStyle: 'italic',
    color: '#000000',
    letterSpacing: -0.6,
    lineHeight: 26,
  },
  benefitsBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  benefitsBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  benefitsContainer: {
    marginBottom: 20,
  },
  benefitCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  benefitIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  benefitIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
  },
  benefitValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007AFF',
    letterSpacing: -0.3,
  },
  benefitStatus: {
    backgroundColor: '#D1FAE5',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  benefitStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  benefitsActions: {
    gap: 12,
  },
  applyGradientButton: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  applyGradientButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  selectOtherBenefitsGradientButton: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  selectOtherBenefitsGradientText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#007AFF',
    letterSpacing: -0.2,
  },
  primaryGradientButton: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryGradientButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  // Estilos para modal de selección de beneficios
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
    fontWeight: '500',
  },
  benefitSelectionList: {
    gap: 12,
  },
  benefitSelectionItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  benefitSelectionItemSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F9FF',
  },
  benefitSelectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  benefitSelectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  benefitSelectionIconImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  benefitSelectionInfo: {
    flex: 1,
  },
  benefitSelectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  benefitSelectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
  },
  benefitSelectionValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007AFF',
  },
  benefitSelectionCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitSelectionCheckboxSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  benefitSelectionCheckmark: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  modalConfirmButton: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  modalConfirmButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  modalConfirmButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalConfirmButtonTextDisabled: {
    color: '#9CA3AF',
  },
});

export default Details;