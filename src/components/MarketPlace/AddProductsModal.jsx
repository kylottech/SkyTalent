import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const AddProductsModal = ({ visible, onClose, onAddProducts, collection }) => {
  console.log('AddProductsModal - visible:', visible);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [products, setProducts] = useState([]);

  // Mock data de productos disponibles
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
      iconSource: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d4f46?w=400&h=400&fit=crop',
      isService: false,
      inStock: true,
      deliveryTime: '24-48h',
      verified: true,
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
    },
    {
      id: '4',
      title: 'Nike Air Max 270',
      subtitle: 'Zapatillas deportivas cómodas',
      price: '€150',
      originalPrice: '€180',
      discount: '17',
      category: 'Deportes',
      rating: '4.5',
      reviews: 634,
      iconSource: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
      isService: false,
      inStock: true,
      deliveryTime: '3-5 días',
      verified: true,
    },
    {
      id: '5',
      title: 'Samsung Galaxy S24',
      subtitle: 'Smartphone Android de última generación',
      price: '€899',
      originalPrice: '€999',
      discount: '10',
      category: 'Tecnología',
      rating: '4.6',
      reviews: 892,
      iconSource: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
      isService: false,
      inStock: true,
      deliveryTime: '2-4 días',
      verified: true,
    },
  ];

  useEffect(() => {
    if (visible) {
      setProducts(mockProducts);
      setSelectedProducts([]);
      setSearchQuery('');
    }
  }, [visible]);

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleProductSelection = (product) => {
    setSelectedProducts(prev => {
      const isSelected = prev.some(p => p.id === product.id);
      if (isSelected) {
        return prev.filter(p => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const handleAddProducts = () => {
    if (selectedProducts.length > 0) {
      onAddProducts(selectedProducts);
      setSelectedProducts([]);
      onClose();
    }
  };

  const renderProduct = ({ item }) => {
    const isSelected = selectedProducts.some(p => p.id === item.id);
    
    return (
      <TouchableOpacity
        style={[styles.productItem, isSelected && styles.productItemSelected]}
        onPress={() => toggleProductSelection(item)}
        activeOpacity={0.7}
      >
        <View style={styles.productImageContainer}>
          <Image source={{ uri: item.iconSource }} style={styles.productImage} />
          {isSelected && (
            <View style={styles.selectedOverlay}>
              <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
            </View>
          )}
        </View>
        
        <View style={styles.productInfo}>
          <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.productSubtitle} numberOfLines={1}>{item.subtitle}</Text>
          <View style={styles.productMeta}>
            <Text style={styles.productPrice}>{item.price}</Text>
            <Text style={styles.productCategory}>{item.category}</Text>
          </View>
        </View>
        
        <View style={styles.selectionIndicator}>
          <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
            {isSelected && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Agregar productos</Text>
              <Text style={styles.subtitle}>a {collection?.name || 'la colección'}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#8E8E93" />
              </TouchableOpacity>
            </View>
            
            {/* Search */}
            <View style={styles.searchContainer}>
              <View style={styles.searchInputContainer}>
                <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor="#8E8E93"
                />
              </View>
            </View>
            
            {/* Products List */}
            <FlatList
              data={filteredProducts}
              renderItem={renderProduct}
              keyExtractor={(item) => item.id}
              style={styles.productsList}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.productsListContent}
            />
            
            {/* Bottom Action */}
            {selectedProducts.length > 0 && (
              <View style={styles.bottomAction}>
                <View style={styles.selectedCount}>
                  <Text style={styles.selectedCountText}>
                    {selectedProducts.length} producto{selectedProducts.length !== 1 ? 's' : ''} seleccionado{selectedProducts.length !== 1 ? 's' : ''}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleAddProducts}
                >
                  <LinearGradient
                    colors={['#007AFF', '#5AC8FA']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.addButtonGradient}
                  >
                    <Ionicons name="add" size={20} color="#FFFFFF" />
                    <Text style={styles.addButtonText}>Agregar</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '400',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 16,
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1D1D1F',
  },
  productsList: {
    flex: 1,
  },
  productsListContent: {
    padding: 20,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  productItemSelected: {
    backgroundColor: '#F0F8FF',
    borderColor: '#007AFF',
  },
  productImageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  selectedOverlay: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 2,
  },
  productSubtitle: {
    fontSize: 13,
    color: '#8E8E93',
    marginBottom: 4,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  productCategory: {
    fontSize: 12,
    color: '#8E8E93',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  selectionIndicator: {
    marginLeft: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  bottomAction: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
    gap: 12,
  },
  selectedCount: {
    flex: 1,
  },
  selectedCountText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  addButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default AddProductsModal;
