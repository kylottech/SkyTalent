import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../context/useUser';
import ProductCard from '../../components/MarketPlace/ProductCard';
import Error from '../../components/Utils/Error';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');

const ProductDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { logout, texts } = useUser();
  const { product } = route.params || {};

  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const screenTexts = texts?.pages?.MarketPlacePages?.ProductDetail || {
    Title: 'Detalle del Producto',
    AddToCart: 'Agregar al carrito',
    Save: 'Guardar',
    Saved: 'Guardado',
    Description: 'Descripción',
    Specifications: 'Especificaciones',
    Reviews: 'Reseñas',
    Share: 'Compartir'
  };

  const handleSave = () => {
    if (!isSaved) {
      Alert.alert(
        'Guardar producto',
        '¿Dónde quieres guardar este producto?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Mi Colección', 
            onPress: () => {
              setIsSaved(true);
              // Aquí implementarías la lógica para guardar en la colección por defecto
            }
          },
          { 
            text: 'Nueva Colección', 
            onPress: () => {
              navigation.navigate('CreateCollection', { product });
            }
          }
        ]
      );
    } else {
      setIsSaved(false);
    }
  };

  const handleAddToCart = () => {
    Alert.alert(
      'Agregar al carrito',
      '¿Deseas agregar este producto a tu carrito?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Agregar', 
          onPress: () => {
            // Implementar lógica para agregar al carrito
            console.log('Product added to cart:', product);
          }
        }
      ]
    );
  };

  const handleShare = () => {
    // Implementar lógica para compartir
    console.log('Sharing product:', product);
  };

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Producto no encontrado</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1D1D1F" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>{screenTexts.Title}</Text>
        
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleShare}
        >
          <Ionicons name="share-outline" size={24} color="#1D1D1F" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Product Card */}
        <View style={styles.productCardContainer}>
          <ProductCard
            title={product.title}
            subtitle={product.subtitle}
            price={product.price}
            originalPrice={product.originalPrice}
            discount={product.discount}
            category={product.category}
            rating={product.rating}
            reviews={product.reviews}
            iconSource={product.iconSource}
            isService={product.isService}
            inStock={product.inStock}
            deliveryTime={product.deliveryTime}
            verified={product.verified}
            usedByFriends={product.usedByFriends}
            onPress={() => {}} // No hacer nada al presionar la card
          />
        </View>

        {/* Product Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>{screenTexts.Description}</Text>
          <Text style={styles.descriptionText}>
            {product.subtitle || 'Descripción detallada del producto no disponible.'}
          </Text>

          <Text style={styles.sectionTitle}>{screenTexts.Specifications}</Text>
          <View style={styles.specsContainer}>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Categoría:</Text>
              <Text style={styles.specValue}>{product.category}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Tiempo de entrega:</Text>
              <Text style={styles.specValue}>{product.deliveryTime}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Stock:</Text>
              <Text style={[styles.specValue, { color: product.inStock ? '#34C759' : '#FF3B30' }]}>
                {product.inStock ? 'Disponible' : 'Agotado'}
              </Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Calificación:</Text>
              <Text style={styles.specValue}>{product.rating}/5 ({product.reviews} reseñas)</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Ionicons 
              name={isSaved ? "bookmark" : "bookmark-outline"} 
              size={20} 
              color={isSaved ? "#FFD700" : "#8E8E93"} 
            />
            <Text style={[styles.saveButtonText, isSaved && styles.saveButtonTextActive]}>
              {isSaved ? screenTexts.Saved : screenTexts.Save}
            </Text>
          </TouchableOpacity>

          {product.inStock && (
            <TouchableOpacity
              style={styles.cartButton}
              onPress={handleAddToCart}
            >
              <LinearGradient
                colors={['#007AFF', '#5AC8FA']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.cartButtonGradient}
              >
                <Text style={styles.cartButtonText}>{screenTexts.AddToCart}</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {error && (
        <Error message={errorMessage} func={setError} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  content: {
    flex: 1,
  },
  productCardContainer: {
    padding: 16,
  },
  detailsContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    color: '#8E8E93',
    lineHeight: 24,
    marginBottom: 24,
  },
  specsContainer: {
    gap: 12,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  specLabel: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '400',
  },
  specValue: {
    fontSize: 16,
    color: '#1D1D1F',
    fontWeight: '500',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 12,
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
  },
  saveButtonTextActive: {
    color: '#FFD700',
  },
  cartButton: {
    flex: 2,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cartButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  cartButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 18,
    color: '#8E8E93',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProductDetail;
