// components/MarketPlace/BeneficioCard.jsx
import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  Animated,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function BeneficioCard({
  imageUri,
  title = 'Entrada\nGratis Estadio',
  username = '@realmadrid',
  headerTitle = 'BENEFICIO KYLOT',
  status = 'UNLOCKED', // 'LOCKED', 'UNLOCKED', 'EXPIRED'
  metaText = '+88 personas ya han compartido sus historias aquí.',
  avatarUri,
  width = 250,
  height = 250,
  onPress,
  iconSource,
  value,
  expiryDate,
  usageCount,
  kyletsPrice = 100,
  userKylets = 0,
  brandLogo,
  brandName,
  isPremium = false,
  category = 'Experiencia',
}) {
  const R = 24;
  const navigate = useNavigation();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    // Animación de feedback premium
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();

    if (status === 'LOCKED') {
      navigate.navigate('BenefitBlocked', {
        benefitData: {
          imageUri,
          title,
          username,
          headerTitle,
          status,
          metaText,
          avatarUri,
          value,
          expiryDate,
          usageCount,
          iconSource,
          kyletsPrice,
          brandLogo,
          brandName,
          isPremium,
          category,
        }
      });
    } else if (status === 'UNLOCKED' || status === 'EXPIRED') {
      navigate.navigate('Details', {
        type: 'benefit',
        benefitData: {
          imageUri,
          title,
          username,
          headerTitle,
          status,
          metaText,
          avatarUri,
          value,
          expiryDate,
          usageCount,
          iconSource,
          kyletsPrice,
          brandLogo,
          brandName,
          isPremium,
          category,
        }
      });
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={handlePress}
        style={[
          styles.card,
          { width, height, borderRadius: R },
          isPremium && styles.premiumCard,
        ]}
      >
        {/* Imagen de fondo con overlay minimalista */}
        <ImageBackground
          source={{ uri: imageUri }}
          style={StyleSheet.absoluteFill}
          imageStyle={{ borderRadius: R }}
          resizeMode="cover"
        >
          {/* Overlay ultra minimalista */}
          <LinearGradient
            colors={[
              'rgba(0, 0, 0, 0.05)',
              'rgba(0, 0, 0, 0.15)',
              'rgba(0, 0, 0, 0.75)'
            ]}
            style={styles.overlay}
          />

          {/* Header minimalista */}
          <View style={styles.headerSection}>
            {/* Logo de marca */}
            {brandLogo && (
              <View style={styles.brandContainer}>
                <View style={styles.brandLogoContainer}>
                  <Image source={{ uri: brandLogo }} style={styles.brandLogo} />
                </View>
                <Text style={styles.brandName}>{brandName || username}</Text>
              </View>
            )}
            
            {/* Badge premium */}
            {isPremium && (
              <View style={styles.premiumBadge}>
                <Image source={require('../../../assets/CORONA_DORADA.png')} style={styles.premiumIcon} />
              </View>
            )}
          </View>

          {/* Status en esquina superior derecha */}
          <View style={styles.topRightStatusContainer}>
            {status === 'UNLOCKED' && (
              <View style={styles.topStatusBadge}>
                <View style={styles.topStatusDot} />
                <Text style={styles.topStatusText}>Disponible</Text>
              </View>
            )}
            {status === 'EXPIRED' && (
              <View style={styles.topStatusBadge}>
                <View style={[styles.topStatusDot, styles.topStatusDotUsed]} />
                <Text style={styles.topStatusText}>Usado</Text>
              </View>
            )}
          </View>

          {/* Valor del beneficio - esquina superior izquierda */}
          {value && status !== 'LOCKED' && (
            <View style={styles.valueContainer}>
              <View style={styles.valueChip}>
                <Text style={styles.valueText}>{value}</Text>
              </View>
            </View>
          )}

          {/* Contenido principal - Ultra minimalista */}
          <View style={styles.content}>
            {/* Título principal */}
            <View style={styles.titleSection}>
              <Text style={styles.title} numberOfLines={2}>
                {title}
              </Text>
              
              {/* Empresa que aporta el beneficio */}
              <View style={styles.companyContainer}>
                <Text style={styles.companyText}>
                  Beneficio de {brandName || username}
                </Text>
              </View>
              
              {/* Información de uso - Solo si es relevante */}
              {usageCount && status !== 'LOCKED' && parseInt(usageCount) > 0 && (
                <View style={styles.usageContainer}>
                  <Text style={styles.usageText}>
                    {usageCount} {parseInt(usageCount) === 1 ? 'persona' : 'personas'} han usado este beneficio
                  </Text>
                </View>
              )}
            </View>

            {/* Footer minimalista */}
            <View style={styles.footerSection}>
              {/* Precio en Kylets */}
              <View style={styles.kyletsContainer}>
                <Image source={require('../../../assets/CORONA_DORADA.png')} style={styles.kyletsIcon} />
                <Text style={styles.kyletsText}>{kyletsPrice}</Text>
              </View>
            </View>
          </View>

          {/* Lock overlay minimalista */}
          {status === 'LOCKED' && (
            <View style={styles.lockOverlay}>
              <View style={styles.lockContent}>
                <Ionicons name="lock-closed" size={32} color="#FFFFFF" />
                <Text style={styles.lockText}>Bloqueado</Text>
              </View>
            </View>
          )}
        </ImageBackground>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    backgroundColor: '#000',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  premiumCard: {
    ...Platform.select({
      ios: {
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.2,
        shadowRadius: 24,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    minHeight: 60,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  brandLogoContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backdropFilter: 'blur(10px)',
  },
  brandLogo: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  brandName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  premiumBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  premiumIcon: {
    width: 14,
    height: 14,
  },
  topRightStatusContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  topStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    backdropFilter: 'blur(10px)',
  },
  topStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  topStatusDotUsed: {
    backgroundColor: '#F59E0B',
  },
  topStatusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0,
  },
  valueContainer: {
    alignSelf: 'flex-start',
    marginTop: 20,
    marginLeft: 20,
  },
  valueChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  valueText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: -0.3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  titleSection: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 26,
    lineHeight: 32,
    marginBottom: 6,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  companyContainer: {
    marginBottom: 6,
  },
  companyText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: -0.1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  usageText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: -0.1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  footerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  kyletsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(29, 124, 228, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(29, 124, 228, 0.2)',
    gap: 4,
  },
  kyletsText: {
    color: '#1D7CE4',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  kyletsIcon: {
    width: 14,
    height: 14,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
    backdropFilter: 'blur(10px)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  statusDotUsed: {
    backgroundColor: '#F59E0B',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 0,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  lockText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
