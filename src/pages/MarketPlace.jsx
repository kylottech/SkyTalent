// screens/MarketPlace.jsx
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Text, FlatList, TouchableOpacity, Image, Modal, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// App context
import { useUser } from "../context/useUser";

// UI comunes
import Error from '../components/Utils/Error';
import Confirmacion from '../components/Utils/Confirmacion';
import BuscadorComponente from '../components/Utils/Buscador';
import menu from '../../assets/menu.png';
import corona from '../../assets/CORONA_DORADA.png';

// Cards
import ProductCard from '../components/MarketPlace/ProductCard';
import BeneficioCard from '../components/MarketPlace/BeneficioCard';
import BenefitsBanner from '../components/MarketPlace/BenefitsBanner';
import MarketplaceBanner from '../components/MarketPlace/MarketplaceBanner';
import EnhancedMarketplaceBanner from '../components/MarketPlace/EnhancedMarketplaceBanner';
import BannerCarousel from '../components/MarketPlace/BannerCarousel';
import PremiumBankingBanner from '../components/MarketPlace/PremiumBankingBanner';
import PremiumBankingCarousel from '../components/MarketPlace/PremiumBankingCarousel';
import CompanyIconsSection from '../components/MarketPlace/CompanyIconsSection';
import CollectionsSection from '../components/MarketPlace/CollectionsSection';

const HorizontalSection = ({ title, subtitle, data, selected, isExpanded = true, onToggle }) => {
  const keyExtractor = (item, idx) => String(item?.id ?? idx);

  const renderProduct = ({ item }) => (
    <ProductCard
      title={item.title}
      subtitle={item.subtitle}
      price={item.price}
      originalPrice={item.originalPrice}
      discount={item.discount}
      category={item.category}
      rating={item.rating}
      reviews={item.reviews}
      onPress={item.onPress}
      iconSource={item.iconSource}
      isService={item.isService}
      inStock={item.inStock}
      deliveryTime={item.deliveryTime}
      verified={item.verified}
      usedByFriends={item.usedByFriends}
    />
  );

  const renderBeneficio = ({ item }) => (
    <BeneficioCard
      imageUri={item.imageUri}
      title={item.title}
      username={item.username}
      headerTitle={item.headerTitle}
      status={item.status}
      metaText={item.metaText}
      avatarUri={item.avatarUri}
      onPress={item.onPress}
      iconSource={item.iconSource}
      // width/height opcionales si quieres forzar tamaño
    />
  );

  // 1 -> nada; 2 -> product; 3 -> beneficio
  const renderItem =
    selected === 1 ? () => null : selected === 3 ? renderBeneficio : renderProduct;

  return (
    <View style={styles.section}>
      {/* Header con diseño minimalista como PlaceInfo */}
      <TouchableOpacity style={styles.minimalHeader} onPress={onToggle} activeOpacity={0.6}>
        <View style={styles.minimalContent}>
          <View style={styles.titleSection}>
            <Text style={styles.minimalTitle}>{title}</Text>
            {!!subtitle && <Text style={styles.minimalSubtitle}>{subtitle}</Text>}
          </View>
          <View style={styles.minimalChevron}>
            <Text style={styles.chevronMinimal}>{isExpanded ? "−" : "+"}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Contenido expandible */}
      {isExpanded && (
        <FlatList
          data={data}
          horizontal
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          extraData={selected}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hListContent}
          ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
        />
      )}
    </View>
  );
};

const MarketPlace = ({ route }) => {
  const navigation = useNavigation();
  const { isLogged, isLoading, texts } = useUser();
  const screenTexts = texts.pages.MarketPlace

  // Arrancamos en menú 2 (MarketPlace)
  const [selected, setSelected] = useState(2);
  const [menuVisible, setMenuVisible] = useState(false);
  const [kylets, setKylets] = useState(0);

  // Estados para controlar expansión de secciones
  const [expandedSections, setExpandedSections] = useState({
    companies: true,
    collections: true,
    section1: true,
    section2: true,
    section3: true,
    section4: true,
    section5: true,
    section6: true,
  });

  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmacion, setConfirmacion] = useState(false);
  const [confirmacionMensaje, setConfirmacionMensaje] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!isLoading && !isLogged) navigation.navigate('Login');
  }, [isLogged, isLoading, navigation]);

  // Obtener kylets del usuario
  useEffect(() => {
    if (route?.params?.amount) {
      setKylets(route.params.amount);
    }
  }, [route?.params?.amount]);

  const popularesSemana = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        id: `pop-${i}`,
        title: i === 0 ? 'Tour Santiago Bernabéu' : i === 1 ? 'Cena Premium' : i === 2 ? 'Spa & Relax' : i === 3 ? 'Entrada Cine' : i === 4 ? 'Gym Premium' : i === 5 ? 'Curso Online' : i === 6 ? 'Producto Gourmet' : 'Servicio Técnico',
        subtitle: i === 0 ? 'Visita guiada por el estadio más emblemático' : i === 1 ? 'Menú degustación para 2 personas' : i === 2 ? 'Circuito termal y masaje relajante' : i === 3 ? '2 entradas + palomitas grandes' : i === 4 ? 'Acceso ilimitado por 1 mes' : i === 5 ? 'Aprende programación desde cero' : i === 6 ? 'Selección de productos premium' : 'Reparación y mantenimiento',
        price: i === 0 ? '€25' : i === 1 ? '€45' : i === 2 ? '€80' : i === 3 ? '€12' : i === 4 ? '€35' : i === 5 ? '€89' : i === 6 ? '€29' : '€65',
        originalPrice: i === 0 ? '€35' : i === 1 ? '€65' : i === 2 ? '€120' : i === 3 ? '€18' : i === 4 ? '€50' : i === 5 ? '€129' : i === 6 ? '€39' : '€85',
        discount: i === 0 ? '29' : i === 1 ? '31' : i === 2 ? '33' : i === 3 ? '33' : i === 4 ? '30' : i === 5 ? '31' : i === 6 ? '26' : '24',
        category: i === 0 ? 'Experiencia' : i === 1 ? 'Gastronomía' : i === 2 ? 'Bienestar' : i === 3 ? 'Entretenimiento' : i === 4 ? 'Fitness' : i === 5 ? 'Educación' : i === 6 ? 'Producto' : 'Servicio',
        rating: '4.' + (8 - i),
        reviews: Math.floor(Math.random() * 200) + 50,
        isService: i === 0 || i === 1 || i === 2 || i === 4 || i === 5 || i === 7,
        iconSource: i === 0 ? 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&h=800&fit=crop' : i === 1 ? 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=800&fit=crop' : i === 2 ? 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&h=800&fit=crop' : i === 3 ? 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=800&fit=crop' : i === 4 ? 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=800&fit=crop' : i === 5 ? 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=800&fit=crop' : i === 6 ? 'https://images.unsplash.com/photo-1563865436874-9aef32095fad?w=800&h=800&fit=crop' : 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=800&fit=crop',
        inStock: i !== 7, // El último producto está agotado
        deliveryTime: i === 0 ? 'Mismo día' : i === 1 ? '1-2h' : i === 2 ? '24h' : i === 3 ? 'Inmediato' : i === 4 ? '24-48h' : i === 5 ? 'Acceso instantáneo' : i === 6 ? '2-3 días' : '48h',
        verified: i === 0 || i === 2 || i === 5, // Algunos productos verificados
        usedByFriends: i === 0 ? 8 : i === 1 ? 12 : i === 2 ? 5 : i === 3 ? 15 : i === 4 ? 3 : i === 5 ? 0 : i === 6 ? 7 : 0, // Número de amigos que lo usan
      })),
    []
  );

  const usadasAmigos = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => ({
        id: `friends-${i}`,
        title: i === 0 ? 'Pizza Artesanal' : i === 1 ? 'Servicio Limpieza' : i === 2 ? 'Entrada Teatro' : i === 3 ? 'Curso Yoga' : i === 4 ? 'Producto Ecológico' : 'Reparación PC',
        subtitle: i === 0 ? 'Pizza fresca con ingredientes premium' : i === 1 ? 'Limpieza profunda de hogar' : i === 2 ? 'Obra de teatro clásica' : i === 3 ? 'Clases de yoga online' : i === 4 ? 'Productos 100% naturales' : 'Mantenimiento y reparación',
        price: i === 0 ? '€18' : i === 1 ? '€45' : i === 2 ? '€22' : i === 3 ? '€35' : i === 4 ? '€24' : '€55',
        originalPrice: i === 0 ? '€25' : i === 1 ? '€65' : i === 2 ? '€32' : i === 3 ? '€50' : i === 4 ? '€35' : '€75',
        discount: i === 0 ? '28' : i === 1 ? '31' : i === 2 ? '31' : i === 3 ? '30' : i === 4 ? '31' : '27',
        category: i === 0 ? 'Gastronomía' : i === 1 ? 'Servicio' : i === 2 ? 'Cultura' : i === 3 ? 'Bienestar' : i === 4 ? 'Producto' : 'Tecnología',
        rating: '4.' + (i + 2),
        reviews: Math.floor(Math.random() * 150) + 30,
        isService: i === 1 || i === 3 || i === 5,
        iconSource: i === 0 ? 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=800&fit=crop' : i === 1 ? 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=800&fit=crop' : i === 2 ? 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&h=800&fit=crop' : i === 3 ? 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=800&fit=crop' : i === 4 ? 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&h=800&fit=crop' : 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&h=800&fit=crop',
        inStock: i !== 4, // Un producto agotado
        deliveryTime: i === 0 ? '30-45 min' : i === 1 ? 'Programar' : i === 2 ? 'Inmediato' : i === 3 ? 'Acceso directo' : i === 4 ? '3-5 días' : 'A consultar',
        verified: i === 1 || i === 3, // Algunos verificados
        usedByFriends: i === 0 ? 6 : i === 1 ? 9 : i === 2 ? 4 : i === 3 ? 11 : i === 4 ? 2 : 13, // Número de amigos
      })),
    []
  );

  const porNiveles = useMemo(
    () =>
      Array.from({ length: 7 }).map((_, i) => ({
        id: `levels-${i}`,
        title: i === 0 ? 'VIP Experience' : i === 1 ? 'Servicio Premium' : i === 2 ? 'Producto Exclusivo' : i === 3 ? 'Consultoría Profesional' : i === 4 ? 'Experiencia Única' : i === 5 ? 'Servicio VIP' : 'Producto Premium',
        subtitle: i === 0 ? 'Experiencia VIP con acceso exclusivo' : i === 1 ? 'Servicio de lujo personalizado' : i === 2 ? 'Producto de edición limitada' : i === 3 ? 'Asesoramiento profesional especializado' : i === 4 ? 'Experiencia única e irrepetible' : i === 5 ? 'Servicio VIP con atención personal' : 'Producto premium de alta calidad',
        price: i === 0 ? '€150' : i === 1 ? '€200' : i === 2 ? '€120' : i === 3 ? '€180' : i === 4 ? '€160' : i === 5 ? '€220' : '€140',
        originalPrice: i === 0 ? '€250' : i === 1 ? '€350' : i === 2 ? '€200' : i === 3 ? '€300' : i === 4 ? '€280' : i === 5 ? '€380' : '€240',
        discount: i === 0 ? '40' : i === 1 ? '43' : i === 2 ? '40' : i === 3 ? '40' : i === 4 ? '43' : i === 5 ? '42' : '42',
        category: i === 0 ? 'VIP' : i === 1 ? 'Servicio' : i === 2 ? 'Producto' : i === 3 ? 'Consultoría' : i === 4 ? 'Experiencia' : i === 5 ? 'Servicio' : 'Producto',
        rating: '4.' + (9 - i),
        reviews: Math.floor(Math.random() * 100) + 20,
        isService: i === 1 || i === 3 || i === 5,
        iconSource: i === 0 ? 'https://images.unsplash.com/photo-1464047736614-af63643285bf?w=800&h=800&fit=crop' : i === 1 ? 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=800&fit=crop' : i === 2 ? 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop' : i === 3 ? 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=800&fit=crop' : i === 4 ? 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=800&fit=crop' : i === 5 ? 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&h=800&fit=crop' : 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&h=800&fit=crop',
        inStock: true,
        deliveryTime: i === 0 ? 'Exclusivo' : i === 1 ? 'Programar' : i === 2 ? '5-7 días' : i === 3 ? 'A consultar' : i === 4 ? 'Limitado' : i === 5 ? 'Reservar' : '7-10 días',
        verified: true, // Todos los productos premium están verificados
        usedByFriends: i === 0 ? 2 : i === 1 ? 4 : i === 2 ? 1 : i === 3 ? 3 : i === 4 ? 5 : i === 5 ? 0 : 1, // Menos amigos en productos premium
      })),
    []
  );

  const beneficiosSemana = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        id: `ben-pop-${i}`,
        imageUri: 'https://picsum.photos/800/800?random=' + (i + 1),
        title: i === 0 ? 'Entrada\nGratis Estadio' : i === 1 ? 'Descuento\nRestaurante' : i === 2 ? 'Acceso VIP\nSpa' : i === 3 ? 'Café\nGratis' : i === 4 ? 'Entrada\nTeatro' : i === 5 ? 'Descuento\nTienda' : i === 6 ? 'Clase\nGratis' : 'Producto\nGratis',
        username: i === 0 ? '@realmadrid' : i === 1 ? '@restaurante' : i === 2 ? '@spa' : i === 3 ? '@cafeteria' : i === 4 ? '@teatro' : i === 5 ? '@tienda' : i === 6 ? '@gym' : '@empresa',
        headerTitle: 'BENEFICIO KYLOT',
        status: i === 0 ? 'UNLOCKED' : i === 1 ? 'LOCKED' : i === 2 ? 'UNLOCKED' : i === 3 ? 'EXPIRED' : i === 4 ? 'UNLOCKED' : i === 5 ? 'LOCKED' : i === 6 ? 'UNLOCKED' : 'UNLOCKED',
        metaText: i === 0 ? '+88 personas ya han compartido sus historias aquí.' : i === 1 ? 'Beneficio bloqueado hasta nivel 2.' : i === 2 ? '+45 personas han usado este beneficio.' : i === 3 ? 'Este beneficio ha expirado.' : i === 4 ? '+32 personas disfrutaron esta experiencia.' : i === 5 ? 'Requiere completar tareas para desbloquear.' : i === 6 ? '+67 personas tomaron esta clase.' : '+12 personas obtuvieron este producto.',
        avatarUri: 'https://i.pravatar.cc/40?img=' + (i + 5),
        iconSource: i === 0 ? require('../../assets/aceptado.png') : i === 1 ? require('../../assets/candadoBloqueado.png') : i === 2 ? require('../../assets/verificado.png') : i === 3 ? require('../../assets/warning.png') : i === 4 ? require('../../assets/category.png') : i === 5 ? require('../../assets/candadoBloqueado.png') : i === 6 ? require('../../assets/ranking.png') : require('../../assets/RegaloAzul.png'),
        value: i === 0 ? '€35' : i === 1 ? '€25' : i === 2 ? '€80' : i === 3 ? '€4' : i === 4 ? '€22' : i === 5 ? '€15' : i === 6 ? '€20' : '€30',
        expiryDate: i === 0 ? '31/12/2024' : i === 1 ? null : i === 2 ? '15/06/2024' : i === 3 ? '01/03/2024' : i === 4 ? '30/09/2024' : i === 5 ? null : i === 6 ? '20/08/2024' : '10/07/2024',
        usageCount: i === 0 ? '88' : i === 1 ? null : i === 2 ? '45' : i === 3 ? '67' : i === 4 ? '32' : i === 5 ? null : i === 6 ? '67' : '12',
      })),
    []
  );

  const beneficiosAmigos = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => ({
        id: `ben-friends-${i}`,
        imageUri: 'https://picsum.photos/800/800?random=' + (i + 20),
        title: 'Consumición\nGratis',
        username: '@tubar',
        headerTitle: 'BENEFICIO KYLOT',
        status: 'UNLOCKED',
        metaText: 'Tus amigos lo han usado esta semana.',
        avatarUri: 'https://i.pravatar.cc/40?img=' + (i + 15),
        iconSource: require('../../assets/RegaloAzul.png'),
      })),
    []
  );

  const beneficiosNiveles = useMemo(
    () =>
      Array.from({ length: 7 }).map((_, i) => ({
        id: `ben-levels-${i}`,
        imageUri: 'https://picsum.photos/800/800?random=' + (i + 40),
        title: 'Upgrade\nNivel VIP',
        username: '@kylot',
        headerTitle: 'BENEFICIO KYLOT',
        status: 'UNLOCKED',
        metaText: 'Disponible al alcanzar el nivel ' + (i + 1),
        avatarUri: 'https://i.pravatar.cc/40?img=' + (i + 25),
        iconSource: require('../../assets/coronaBoton.png'),
      })),
    []
  );

  const beneficiosEmpresas = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => ({
        id: `ben-empresas-${i}`,
        imageUri: 'https://picsum.photos/800/800?random=' + (i + 60),
        title: 'Descuento\nEspecial',
        username: '@empresa' + (i + 1),
        headerTitle: 'BENEFICIO KYLOT',
        status: 'UNLOCKED',
        metaText: 'Solo para seguidores de la empresa',
        avatarUri: 'https://i.pravatar.cc/40?img=' + (i + 35),
        iconSource: require('../../assets/verificado.png'),
      })),
    []
  );

  const masUtilizados = useMemo(
    () =>
      Array.from({ length: 5 }).map((_, i) => ({
        id: `mas-utilizados-${i}`,
        imageUri: 'https://picsum.photos/800/800?random=' + (i + 80),
        title: i === 0 ? 'Café Premium' : i === 1 ? 'Entrada Cine' : i === 2 ? 'Descuento Restaurante' : i === 3 ? 'Spa & Relax' : 'Gym Pass',
        username: i === 0 ? '@starbucks' : i === 1 ? '@cinepolis' : i === 2 ? '@restaurante' : i === 3 ? '@spa' : '@gym',
        headerTitle: 'BENEFICIO KYLOT',
        status: 'UNLOCKED',
        metaText: `Usado ${8 - i} veces este mes`,
        avatarUri: 'https://i.pravatar.cc/40?img=' + (i + 45),
        iconSource: require('../../assets/category.png'),
        timesUsed: 8 - i,
      })),
    []
  );

  const empresasIconos = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        id: `empresa-${i}`,
        name: i === 0 ? 'Starbucks' : i === 1 ? 'McDonald\'s' : i === 2 ? 'Nike' : i === 3 ? 'Apple' : i === 4 ? 'Spotify' : i === 5 ? 'Netflix' : i === 6 ? 'Amazon' : i === 7 ? 'Google' : i === 8 ? 'Microsoft' : i === 9 ? 'Tesla' : i === 10 ? 'Uber' : 'Airbnb',
        iconSource: i === 0 ? require('../../assets/category.png') : i === 1 ? require('../../assets/corazon.png') : i === 2 ? require('../../assets/ranking.png') : i === 3 ? require('../../assets/verificado.png') : i === 4 ? require('../../assets/RegaloAzul.png') : i === 5 ? require('../../assets/aceptado.png') : i === 6 ? require('../../assets/candadoSitio.png') : i === 7 ? require('../../assets/coronaBoton.png') : i === 8 ? require('../../assets/category.png') : i === 9 ? require('../../assets/verificado.png') : i === 10 ? require('../../assets/ranking.png') : require('../../assets/RegaloAzul.png'),
        isVerified: i % 3 === 0, // Cada tercera empresa está verificada
        category: i === 0 ? 'Café' : i === 1 ? 'Comida Rápida' : i === 2 ? 'Deportes' : i === 3 ? 'Tecnología' : i === 4 ? 'Música' : i === 5 ? 'Streaming' : i === 6 ? 'E-commerce' : i === 7 ? 'Búsqueda' : i === 8 ? 'Software' : i === 9 ? 'Automóviles' : i === 10 ? 'Transporte' : 'Hospedaje',
      })),
    []
  );

  const coleccionesPersonalizadas = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        id: `coleccion-${i}`,
        title: i === 0 ? 'Mi Lista de Deseos' : i === 1 ? 'Favoritos de Verano' : i === 2 ? 'Productos Premium' : i === 3 ? 'Ofertas del Día' : i === 4 ? 'Mi Colección VIP' : i === 5 ? 'Recomendados para Mí' : i === 6 ? 'Últimas Compras' : 'Productos Guardados',
        subtitle: i === 0 ? '12 productos guardados' : i === 1 ? '8 productos favoritos' : i === 2 ? '15 productos premium' : i === 3 ? '5 ofertas activas' : i === 4 ? '20 productos VIP' : i === 5 ? '10 recomendaciones' : i === 6 ? '6 productos recientes' : '25 productos guardados',
        iconSource: i === 0 ? require('../../assets/corazon.png') : i === 1 ? require('../../assets/category.png') : i === 2 ? require('../../assets/coronaBoton.png') : i === 3 ? require('../../assets/ranking.png') : i === 4 ? require('../../assets/verificado.png') : i === 5 ? require('../../assets/RegaloAzul.png') : i === 6 ? require('../../assets/aceptado.png') : require('../../assets/candadoSitio.png'),
        itemCount: i === 0 ? 12 : i === 1 ? 8 : i === 2 ? 15 : i === 3 ? 5 : i === 4 ? 20 : i === 5 ? 10 : i === 6 ? 6 : 25,
        isCustom: true,
      })),
    []
  );

  const subText = screenTexts.SubText;

  // Función para filtrar datos basado en la búsqueda
  const filterData = useCallback((data, searchTerm) => {
    if (!searchTerm.trim()) return data;
    
    const term = searchTerm.toLowerCase();
    return data.filter(item => 
      item.title.toLowerCase().includes(term) || 
      item.subtitle.toLowerCase().includes(term)
    );
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setSearch(''); // Limpiar búsqueda al refrescar
    setRefreshing(false);
  }, []);

  // Función para manejar clic en empresa
  const handleCompanyPress = useCallback((company) => {
    navigation.navigate('CompanyProfile', { companyData: company });
  }, [navigation]);

  // Función para manejar clic en colección
  const handleCollectionPress = useCallback((collection) => {
    navigation.navigate('CollectionDetail', { collection });
  }, [navigation]);

  // Función para manejar clic en banner
  const handleBannerPress = useCallback((banner) => {
    // Navegación basada en el tipo de banner
    switch (banner.type) {
      case 'marketplace':
        // Ya estamos en marketplace, quizás scroll a productos
        break;
      case 'benefits':
        setSelected(3); // Cambiar a pestaña de beneficios
        break;
      case 'community':
        // navigation.navigate('Community');
        break;
      default:
        break;
    }
  }, []);

  // Helper para pasar la data correcta según pestaña y filtrar por búsqueda
  const dataPopulares = filterData(selected === 3 ? beneficiosSemana : popularesSemana, search);
  const dataAmigos = filterData(selected === 3 ? beneficiosAmigos : usadasAmigos, search);
  const dataPopulares2 = filterData(selected === 3 ? beneficiosSemana : popularesSemana, search);
  const dataNiveles = filterData(selected === 3 ? beneficiosNiveles : porNiveles, search);
  const dataEmpresas = filterData(beneficiosEmpresas, search);

  // Formatear kylets
  const formatKylets = (amount) => {
    if (amount >= 1_000_000_000) {
      return (amount / 1_000_000_000).toFixed(1).replace('.0', '') + 'B';
    } else if (amount >= 1_000_000) {
      return (amount / 1_000_000).toFixed(1).replace('.0', '') + 'M';
    } else if (amount >= 10_000) {
      return (amount / 1_000).toFixed(1).replace('.0', '') + 'K';
    } else {
      return amount.toString();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header con menú hamburguesa */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{screenTexts.Top}</Text>
            <View style={styles.headerRight}>
              {/* Kylets */}
              <TouchableOpacity 
                style={styles.kyletsContainer}
                onPress={() => navigation.navigate('Banco')}
              >
                <Image source={corona} style={styles.corona} />
                <Text style={styles.kyletsText}>{formatKylets(kylets)}</Text>
              </TouchableOpacity>
              
              {/* Menú hamburguesa */}
              <TouchableOpacity 
                style={styles.menuButton}
                onPress={() => setMenuVisible(true)}
              >
                <Image source={menu} style={styles.menuIcon} />
              </TouchableOpacity>
            </View>
          </View>
        </View>


        {/* Título y subtítulo de la sección */}
        <View style={styles.sectionHeader}>
          <View style={styles.titleSection}>
            <Text style={styles.sectionTitle}>
              {selected === 1 ? screenTexts.SocialTitle : 
               selected === 2 ? screenTexts.MarketplaceTitle : 
               selected === 4 ? screenTexts.CompensationTitle :
               screenTexts.BenefitsTitle}
            </Text>
            <Text style={styles.sectionSubtitle}>
              {selected === 1 ? screenTexts.SocialSubtitle : 
               selected === 2 ? screenTexts.MarketplaceSubtitle : 
               selected === 4 ? screenTexts.CompensationSubtitle :
               screenTexts.BenefitsSubtitle}
            </Text>
          </View>
        </View>

        {/* Banner de beneficios - solo en pestaña de beneficios */}
        {selected === 3 && (
          <View style={styles.bannerContainer}>
            <BenefitsBanner />
            <TouchableOpacity 
              style={styles.walletIcon} 
              onPress={() => navigation.navigate('Consumed')}
              activeOpacity={0.8}
            >
              <Image 
                source={require('../../assets/walletMenu.png')} 
                style={styles.walletIconImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Buscador con filtro integrado */}
        <View style={styles.searchContainer}>
          <BuscadorComponente 
            placeholder={screenTexts.SearcherPlaceHolder} 
            search={search} 
            func={setSearch}
            showFilter={true}
            onFilterPress={() => navigation.navigate('Categorias')}
          />
        </View>

        {/* Contenido */}
        <View style={styles.content}>
          {selected === 2 ? (
            // Diseño minimalista para pestaña de productos
            <>
              {/* Sección de iconos de empresas */}
              <CompanyIconsSection 
                title="Empresas" 
                subtitle="Descubre ofertas de tus marcas favoritas" 
                companies={empresasIconos}
                onCompanyPress={handleCompanyPress}
                isExpanded={expandedSections.companies}
                onToggle={() => setExpandedSections(prev => ({ ...prev, companies: !prev.companies }))}
              />

              {/* Sección de colecciones personalizadas */}
              <CollectionsSection 
                title="Colecciones" 
                subtitle="Tus listas personalizadas y favoritas" 
                collections={coleccionesPersonalizadas}
                onCollectionPress={handleCollectionPress}
                isExpanded={expandedSections.collections}
                onToggle={() => setExpandedSections(prev => ({ ...prev, collections: !prev.collections }))}
              />
              
              <HorizontalSection 
                title={screenTexts.Title1} 
                subtitle="+88 personas ya han compartido sus historias" 
                data={dataPopulares} 
                selected={selected}
                isExpanded={expandedSections.section1}
                onToggle={() => setExpandedSections(prev => ({ ...prev, section1: !prev.section1 }))}
              />
              <HorizontalSection 
                title={screenTexts.Title2} 
                subtitle="Recomendados por amigos" 
                data={dataAmigos} 
                selected={selected}
                isExpanded={expandedSections.section2}
                onToggle={() => setExpandedSections(prev => ({ ...prev, section2: !prev.section2 }))}
              />
              <HorizontalSection 
                title={screenTexts.Title3} 
                subtitle="Productos destacados" 
                data={dataPopulares2} 
                selected={selected}
                isExpanded={expandedSections.section3}
                onToggle={() => setExpandedSections(prev => ({ ...prev, section3: !prev.section3 }))}
              />
              <HorizontalSection 
                title={screenTexts.Title4} 
                subtitle="Por niveles" 
                data={dataNiveles} 
                selected={selected}
                isExpanded={expandedSections.section4}
                onToggle={() => setExpandedSections(prev => ({ ...prev, section4: !prev.section4 }))}
              />
            </>
          ) : selected === 4 ? (
            // Contenido para Compensation Center
            <>
              <View style={styles.compensationInfo}>
                <Text style={styles.compensationInfoTitle}>{screenTexts.CompensationInfoTitle}</Text>
                <Text style={styles.compensationInfoText}>
                  {screenTexts.CompensationInfoText}
                </Text>
              </View>
              <HorizontalSection 
                title={screenTexts.CompensationSection1}
                subtitle={screenTexts.CompensationSection1Sub}
                data={beneficiosSemana} 
                selected={3}
                isExpanded={expandedSections.section1}
                onToggle={() => setExpandedSections(prev => ({ ...prev, section1: !prev.section1 }))}
              />
              <HorizontalSection 
                title={screenTexts.CompensationSection2}
                subtitle={screenTexts.CompensationSection2Sub}
                data={masUtilizados} 
                selected={3}
                isExpanded={expandedSections.section2}
                onToggle={() => setExpandedSections(prev => ({ ...prev, section2: !prev.section2 }))}
              />
              <HorizontalSection 
                title={screenTexts.CompensationSection3}
                subtitle={screenTexts.CompensationSection3Sub}
                data={beneficiosNiveles} 
                selected={3}
                isExpanded={expandedSections.section3}
                onToggle={() => setExpandedSections(prev => ({ ...prev, section3: !prev.section3 }))}
              />
            </>
          ) : (
            // Diseño para pestaña de beneficios
            <>
              {/* Sección de iconos de empresas */}
              <CompanyIconsSection 
                title="Empresas con beneficios" 
                subtitle="Descubre beneficios exclusivos de tus marcas favoritas" 
                companies={empresasIconos}
                onCompanyPress={handleCompanyPress}
                isExpanded={expandedSections.companies}
                onToggle={() => setExpandedSections(prev => ({ ...prev, companies: !prev.companies }))}
              />

              <HorizontalSection 
                title={selected === 3 ? screenTexts.BenefitTitle1 : screenTexts.Title1} 
                subtitle={subText} 
                data={dataPopulares} 
                selected={selected}
                isExpanded={expandedSections.section1}
                onToggle={() => setExpandedSections(prev => ({ ...prev, section1: !prev.section1 }))}
              />
              <HorizontalSection 
                title={selected === 3 ? screenTexts.BenefitTitle2 : screenTexts.Title2} 
                subtitle={subText} 
                data={dataAmigos} 
                selected={selected}
                isExpanded={expandedSections.section2}
                onToggle={() => setExpandedSections(prev => ({ ...prev, section2: !prev.section2 }))}
              />
              <HorizontalSection 
                title={selected === 3 ? screenTexts.BenefitTitle3 : screenTexts.Title3} 
                subtitle={subText} 
                data={dataPopulares2} 
                selected={selected}
                isExpanded={expandedSections.section3}
                onToggle={() => setExpandedSections(prev => ({ ...prev, section3: !prev.section3 }))}
              />
              <HorizontalSection 
                title={selected === 3 ? screenTexts.BenefitTitle4 : screenTexts.Title4} 
                subtitle={subText} 
                data={dataNiveles} 
                selected={selected}
                isExpanded={expandedSections.section4}
                onToggle={() => setExpandedSections(prev => ({ ...prev, section4: !prev.section4 }))}
              />
              <HorizontalSection 
                title={selected === 3 ? screenTexts.BenefitTitle5 : screenTexts.Title5} 
                subtitle={subText} 
                data={dataEmpresas} 
                selected={3}
                isExpanded={expandedSections.section5}
                onToggle={() => setExpandedSections(prev => ({ ...prev, section5: !prev.section5 }))}
              />
              <HorizontalSection 
                title={selected === 3 ? screenTexts.BenefitTitle6 : screenTexts.Title6} 
                subtitle={subText} 
                data={masUtilizados} 
                selected={3}
                isExpanded={expandedSections.section6}
                onToggle={() => setExpandedSections(prev => ({ ...prev, section6: !prev.section6 }))}
              />
            </>
          )}
        </View>
      </ScrollView>

      {error && <Error message={errorMessage} func={setError} />}
      {confirmacion && <Confirmacion message={confirmacionMensaje} func={setConfirmacion} />}

      {/* Modal del menú */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
         <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.menuContainer}>
                <TouchableOpacity
                  style={[styles.menuOption, selected === 1 && styles.menuOptionActive]}
                  onPress={() => {
                    setSelected(1);
                    setMenuVisible(false);
                  }}
                >
                  <Text style={[styles.menuOptionText, selected === 1 && styles.menuOptionTextActive]}>
                    {screenTexts.Menu1}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.menuOption, selected === 2 && styles.menuOptionActive]}
                  onPress={() => {
                    setSelected(2);
                    setMenuVisible(false);
                  }}
                >
                  <Text style={[styles.menuOptionText, selected === 2 && styles.menuOptionTextActive]}>
                    {screenTexts.Menu2}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.menuOption, selected === 3 && styles.menuOptionActive]}
                  onPress={() => {
                    setSelected(3);
                    setMenuVisible(false);
                  }}
                >
                  <Text style={[styles.menuOptionText, selected === 3 && styles.menuOptionTextActive]}>
                    {screenTexts.Menu3}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.menuOption, styles.menuOptionLast, selected === 4 && styles.menuOptionActive]}
                  onPress={() => {
                    setSelected(4);
                    setMenuVisible(false);
                  }}
                >
                  <Text style={[styles.menuOptionText, selected === 4 && styles.menuOptionTextActive]}>
                    {screenTexts.Menu4}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: 'white', 
    marginBottom: 70 
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  header: {
    marginTop: 35,
    height: 64,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  kyletsContainer: {
    backgroundColor: 'white',
    minWidth: 72,
    height: 36,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: '#E5E5E5',
    borderWidth: 1,
    gap: 5,
  },
  corona: {
    width: 20,
    height: 20,
  },
  kyletsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2A2A2A',
    letterSpacing: -0.2,
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    width: 24,
    height: 24,
    tintColor: '#1D1D1F',
  },
  sectionHeader: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  titleSection: {
    flex: 1,
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: '#1D1D1F',
    letterSpacing: -0.8,
    lineHeight: 40,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 17,
    color: '#6E6E73',
    fontWeight: '400',
    letterSpacing: -0.2,
    lineHeight: 24,
  },

  bannerContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  walletIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  walletIconImage: {
    width: 24,
    height: 24,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 12,
    backgroundColor: 'white',
  },

  content: {
    width: '100%',
    alignSelf: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },

  section: { marginBottom: 28 },
  hListContent: { paddingRight: 16, paddingLeft: 4 },

  // Estilos minimalistas para headers de sección (como PlaceInfo)
  minimalHeader: {
    marginHorizontal: 20,
    marginVertical: 6,
  },
  minimalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0',
  },
  minimalTitle: {
    fontSize: 22,
    fontWeight: '300',
    color: '#000000',
    letterSpacing: -0.6,
    lineHeight: 26,
    marginBottom: 2,
  },
  minimalSubtitle: {
    fontSize: 15,
    color: '#8E8E93',
    fontWeight: '400',
    letterSpacing: -0.2,
    lineHeight: 18,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '70%',
    maxWidth: 280,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  menuOption: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F2F2F7',
  },
  menuOptionLast: {
    borderBottomWidth: 0,
  },
  menuOptionActive: {
    backgroundColor: '#F8F9FF',
  },
  menuOptionText: {
    fontSize: 17,
    color: '#1D1D1F',
    fontWeight: '400',
    textAlign: 'center',
  },
  menuOptionTextActive: {
    color: '#007AFF',
    fontWeight: '500',
  },
  compensationInfo: {
    backgroundColor: '#F8F9FF',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  compensationInfoTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 8,
    letterSpacing: -0.4,
  },
  compensationInfoText: {
    fontSize: 15,
    color: '#6E6E73',
    lineHeight: 22,
    letterSpacing: -0.2,
  },
});

export default MarketPlace;
