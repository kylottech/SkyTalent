import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import GroupStyleCreateModal from './GroupStyleCreateModal';
import SaveProductModal from './SaveProductModal';

const CARD_W = 280;

export default function ProductCard({
  title,
  subtitle,
  price,
  originalPrice,
  discount,
  category,
  rating,
  reviews,
  onPress,
  iconSource,
  isService = false,
  inStock = true,
  deliveryTime = '24-48h',
  verified = false,
  usedByFriends = 0,
}) {
  const navigate = useNavigation();
  const [isSaved, setIsSaved] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleSave = () => {
    if (!isSaved) {
      // Mostrar modal premium para seleccionar colección o crear nueva
      setShowSaveModal(true);
    } else {
      // Desguardar producto
      setIsSaved(false);
      animateSave();
    }
  };

  const animateSave = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSaveToCollection = () => {
    setIsSaved(true);
    animateSave();
    setShowSaveModal(false);
    // Aquí implementarías la lógica para guardar en la colección por defecto
    console.log('Product saved to default collection:', { title, subtitle, price });
  };

  const handleCreateCollection = () => {
    setShowSaveModal(false);
    setShowCreateModal(true);
  };

  const handleCloseSaveModal = () => {
    setShowSaveModal(false);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handlePress = () => {
    navigate.navigate('Details', { 
      type: 'product',
      productData: {
        title,
        subtitle,
        price,
        originalPrice,
        discount,
        category,
        rating,
        reviews,
        isService,
        iconSource,
        inStock,
        deliveryTime,
        verified
      }
    });
  };
  
  return (
    <View>
      {/* Premium Save Product Modal */}
      <SaveProductModal
        visible={showSaveModal}
        onClose={handleCloseSaveModal}
        onSaveToCollection={handleSaveToCollection}
        onCreateCollection={handleCreateCollection}
      />

      {/* Premium Create Collection Modal */}
      <GroupStyleCreateModal
        visible={showCreateModal}
        onClose={handleCloseCreateModal}
        onCreateCollection={(collectionData) => {
          console.log('Creating collection:', collectionData);
          console.log('Product to save:', { title, subtitle, price, originalPrice, discount, category, rating, reviews, iconSource, isService, inStock, deliveryTime, verified });
          setShowCreateModal(false);
          setIsSaved(true);
          animateSave();
        }}
      />

      <TouchableOpacity 
        style={[styles.card, !inStock && styles.cardOutOfStock]} 
        activeOpacity={0.9} 
        onPress={handlePress}
      >
      {/* Botón guardar - Mejorado */}
      <TouchableOpacity 
        style={styles.saveButton} 
        onPress={handleSave}
        activeOpacity={0.6}
      >
        <Animated.View style={[styles.saveIconContainer, { transform: [{ scale: scaleAnim }] }]}>
          <Ionicons 
            name={isSaved ? "bookmark" : "bookmark-outline"} 
            size={20} 
            color={isSaved ? "#FFD700" : "#8E8E93"} 
          />
        </Animated.View>
      </TouchableOpacity>

      {/* Imagen del producto - Clean */}
      <View style={styles.productImageContainer}>
        <View style={styles.productImage}>
          {iconSource && (
            <Image 
              source={typeof iconSource === 'string' ? { uri: iconSource } : iconSource} 
              style={styles.productIcon} 
              resizeMode="cover" 
            />
          )}
        </View>
      </View>

      {/* Información del producto - Minimalista */}
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={2}>{title}</Text>
        <Text style={styles.productSubtitle} numberOfLines={2}>{subtitle}</Text>
        
        {/* Usuarios conocidos - Estilo Listas */}
        {usedByFriends > 0 && (
          <View style={styles.friendsRow}>
            <View style={styles.userAvatarsContainer}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' }} 
                style={[styles.userAvatar, styles.firstAvatar]} 
              />
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' }} 
                style={styles.userAvatar} 
              />
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face' }} 
                style={styles.userAvatar} 
              />
              {usedByFriends > 3 && (
                <View style={styles.moreUsersAvatar}>
                  <Text style={styles.moreUsersText}>+{usedByFriends - 3}</Text>
                </View>
              )}
            </View>
            <Text style={styles.friendsText}>
              {usedByFriends} {usedByFriends === 1 ? 'amigo lo usa' : 'amigos lo usan'}
            </Text>
          </View>
        )}
        
        {/* Precio - Esquina inferior derecha */}
        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>{price}</Text>
          {originalPrice && discount && (
            <Text style={styles.discountLabel}>-{discount}%</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
    
    {/* Create Collection Modal */}
      <GroupStyleCreateModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateCollection={handleCreateCollection}
      />
  </View>
  );
}

const styles = StyleSheet.create({
  // Card - Clean Apple Style
  card: {
    width: CARD_W,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 8,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    overflow: 'visible',
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  cardOutOfStock: {
    opacity: 0.5,
  },

  // Botón guardar - Esquina superior derecha
  saveButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    padding: 8,
  },
  saveIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  // Imagen del producto - Clean
  productImageContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
  },
  productImage: {
    height: 140,
    backgroundColor: '#F8F8F8',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  productIcon: {
    width: '100%',
    height: '100%',
  },
  
  // Información del producto - Clean
  productInfo: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    position: 'relative',
  },
  productTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 6,
    lineHeight: 26,
    letterSpacing: -0.4,
  },
  productSubtitle: {
    fontSize: 14,
    color: '#86868B',
    marginBottom: 16,
    lineHeight: 20,
    letterSpacing: -0.15,
    fontWeight: '400',
  },
  
  // Usuarios conocidos - Estilo Listas exacto
  friendsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  userAvatarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginLeft: -4,
    backgroundColor: '#F2F2F7',
  },
  firstAvatar: {
    marginLeft: 0,
  },
  moreUsersAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F2F2F7',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginLeft: -4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreUsersText: {
    fontSize: 8,
    fontWeight: '600',
    color: '#1D1D1F',
    textAlign: 'center',
  },
  friendsText: {
    fontSize: 11,
    color: '#86868B',
    fontWeight: '500',
    letterSpacing: -0.1,
    marginLeft: 8,
  },
  
  // Precio - Esquina inferior derecha
  priceContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  currentPrice: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1D1D1F',
    letterSpacing: -0.5,
  },
  discountLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF3B30',
    letterSpacing: -0.2,
  },
});

