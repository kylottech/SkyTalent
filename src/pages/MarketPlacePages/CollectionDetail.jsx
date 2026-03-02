import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
  Dimensions
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../context/useUser';
import ProductCard from '../../components/MarketPlace/ProductCard';
import FunctionalAddProductsModal from '../../components/MarketPlace/FunctionalAddProductsModal';
import Error from '../../components/Utils/Error';
import Loader from '../../components/Utils/Loader';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');

const CollectionDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { logout, texts } = useUser();
  const screenTexts = texts?.pages?.MarketPlacePages?.CollectionDetail || {
    Title: 'Mi Colección',
    EmptyTitle: 'Tu colección está vacía',
    EmptySubtitle: 'Guarda productos que te gusten para encontrarlos fácilmente',
    EmptyButton: 'Explorar productos',
    AddProduct: 'Agregar producto',
    ProductsCount: 'productos guardados'
  };

  const { collection } = route.params || {};
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showAddProductsModal, setShowAddProductsModal] = useState(false);

  // Mock data para productos guardados
  const mockProducts = [
    {
      id: '1',
      title: 'AirPods Pro 2da Gen',
      subtitle: 'Auriculares inalámbricos con cancelación de ruido',
      price: '€249',
      originalPrice: '€279',
      discount: '11',
      category: 'Tecnología',
      rating: '4.8',
      reviews: 1247,
      iconSource: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop',
      isService: false,
      inStock: true,
      deliveryTime: '24-48h',
      verified: true,
      usedByFriends: 8
    },
    {
      id: '2',
      title: 'MacBook Air M2',
      subtitle: 'Laptop ultradelgada con chip M2',
      price: '€1199',
      originalPrice: '€1299',
      discount: '8',
      category: 'Tecnología',
      rating: '4.9',
      reviews: 892,
      iconSource: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
      isService: false,
      inStock: true,
      deliveryTime: '2-3 días',
      verified: true,
      usedByFriends: 3
    },
    {
      id: '3',
      title: 'iPhone 15 Pro',
      subtitle: 'El iPhone más avanzado con titanio',
      price: '€1199',
      originalPrice: '€1199',
      discount: '0',
      category: 'Tecnología',
      rating: '4.7',
      reviews: 2156,
      iconSource: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
      isService: false,
      inStock: true,
      deliveryTime: '1-2 días',
      verified: true,
      usedByFriends: 12
    }
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      // Simular carga de productos
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProducts(mockProducts);
    } catch (error) {
      setError(true);
      setErrorMessage('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  }, [loadProducts]);

  const handleRemoveProduct = (productId) => {
    Alert.alert(
      'Eliminar producto',
      '¿Estás seguro de que quieres eliminar este producto de tu colección?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setProducts(prev => prev.filter(p => p.id !== productId));
          }
        }
      ]
    );
  };

  const handleAddProducts = (selectedProducts) => {
    // Aquí implementarías la lógica para agregar productos a la colección
    console.log('Adding products to collection:', selectedProducts);
    setProducts(prev => [...prev, ...selectedProducts]);
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productWrapper}>
      <ProductCard
        title={item.title}
        subtitle={item.subtitle}
        price={item.price}
        originalPrice={item.originalPrice}
        discount={item.discount}
        category={item.category}
        rating={item.rating}
        reviews={item.reviews}
        iconSource={item.iconSource}
        isService={item.isService}
        inStock={item.inStock}
        deliveryTime={item.deliveryTime}
        verified={item.verified}
        usedByFriends={item.usedByFriends}
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
      />
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveProduct(item.id)}
      >
        <Ionicons name="close-circle" size={24} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="bookmark-outline" size={48} color="#C7C7CC" />
      </View>
      <Text style={styles.emptyTitle}>{screenTexts.EmptyTitle}</Text>
      <Text style={styles.emptySubtitle}>{screenTexts.EmptySubtitle}</Text>
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => navigation.navigate('MarketPlace')}
        activeOpacity={0.7}
      >
        <Text style={styles.exploreButtonText}>{screenTexts.EmptyButton}</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && products.length === 0) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header con diseño consistente */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#1D1D1F" />
            </TouchableOpacity>
            
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowAddProductsModal(true)}
              >
                <Ionicons name="add" size={24} color="#007AFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Título y subtítulo de la sección - estilo MarketPlace */}
        <View style={styles.sectionHeader}>
          <View style={styles.titleSection}>
            <Text style={styles.sectionTitle}>
              {collection?.name || screenTexts.Title}
            </Text>
            <Text style={styles.sectionSubtitle}>
              {products.length} {screenTexts.ProductsCount}
            </Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {products.length === 0 ? (
            renderEmptyState()
          ) : (
            <FlatList
              data={products}
              renderItem={renderProduct}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.productsList}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
              }
            />
          )}
        </View>
      </ScrollView>

      {/* Add Products Modal */}
      <FunctionalAddProductsModal
        visible={showAddProductsModal}
        onClose={() => setShowAddProductsModal(false)}
        onAddProducts={handleAddProducts}
        collection={collection}
      />

      {error && (
        <Error message={errorMessage} func={setError} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
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
  backButton: {
    padding: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    padding: 8,
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
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  productsList: {
    padding: 16,
  },
  productWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyIconContainer: {
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1D1D1F',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.4,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6E6E73',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    letterSpacing: -0.2,
  },
  exploreButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
});

export default CollectionDetail;
