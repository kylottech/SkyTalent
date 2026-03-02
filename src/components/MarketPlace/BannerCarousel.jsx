import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');

const BannerCarousel = ({ onBannerPress }) => {
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);
  
  const banners = [
    {
      id: 1,
      type: 'marketplace',
      title: 'Descubre productos increíbles',
      subtitle: 'Explora ofertas especiales y productos recomendados',
      ctaText: 'Explorar Ahora',
      gradient: ['#1a1a2e', '#16213e', '#0f3460'],
      icon: '🛍️',
      badge: 'NUEVO',
    },
    {
      id: 2,
      type: 'benefits',
      title: 'Beneficios Exclusivos',
      subtitle: 'Accede a descuentos premium y recompensas únicas solo para ti',
      ctaText: 'Ver Beneficios',
      gradient: ['#1e3c72', '#2a5298', '#3b82f6'],
      icon: '💎',
      badge: 'PREMIUM',
      trustBadge: '🔒 Seguro',
    },
    {
      id: 3,
      type: 'community',
      title: 'Únete a la Comunidad',
      subtitle: 'Conecta con +50k usuarios y comparte experiencias únicas',
      ctaText: 'Conectar',
      gradient: ['#667eea', '#764ba2', '#f093fb'],
      icon: '👥',
      badge: 'POPULAR',
      achievementBadge: '🏆 Top Community',
    },
  ];

  useEffect(() => {
    // Limpiar intervalo anterior si existe
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % banners.length;
        const bannerWidth = screenWidth - 32; // Restamos el padding horizontal
        scrollViewRef.current?.scrollTo({
          x: nextIndex * bannerWidth,
          animated: true,
        });
        return nextIndex;
      });
    }, 5000); // Cambia cada 5 segundos

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [banners.length]);

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const bannerWidth = screenWidth - 32; // Restamos el padding horizontal
    const index = Math.round(contentOffsetX / bannerWidth);
    if (index >= 0 && index < banners.length) {
      setCurrentIndex(index);
    }
  };

  const handleBannerPress = (banner) => {
    onBannerPress?.(banner);
  };

  const renderBanner = (banner, index) => (
    <View key={banner.id} style={styles.bannerContainer}>
      <TouchableOpacity 
        style={styles.bannerTouchable}
        onPress={() => handleBannerPress(banner)}
        activeOpacity={0.95}
      >
        <LinearGradient
          colors={banner.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.bannerGradient}
        >
          {/* Background Pattern */}
          <View style={styles.backgroundPattern} />
          
          <View style={styles.bannerContent}>
            <View style={styles.leftContent}>
              {/* Badge and Trust Elements */}
              <View style={styles.topBadgesContainer}>
                <View style={styles.primaryBadge}>
                  <Text style={styles.primaryBadgeText}>{banner.badge}</Text>
                </View>
                {banner.trustBadge && (
                  <View style={styles.trustBadge}>
                    <Text style={styles.trustBadgeText}>{banner.trustBadge}</Text>
                  </View>
                )}
              </View>
              
              {/* Brand Container with Apple-style minimalism */}
              <View style={styles.brandContainer}>
                <Text style={styles.brandText}>
                  {banner.type === 'marketplace' ? 'MARKETPLACE' : 
                   banner.type === 'benefits' ? 'BENEFICIOS' : 
                   'COMUNIDAD'}
                </Text>
                <View style={styles.brandAccent} />
              </View>
              
              {/* Title with improved typography */}
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{banner.title}</Text>
              </View>
              
              {/* Subtitle with better spacing */}
              <Text style={styles.subtitle}>{banner.subtitle}</Text>

              {/* Achievement Badge for Community */}
              {banner.achievementBadge && (
                <View style={styles.achievementContainer}>
                  <Text style={styles.achievementText}>{banner.achievementBadge}</Text>
                </View>
              )}

              {/* CTA Button with improved design */}
              <TouchableOpacity style={styles.ctaButton}>
                <LinearGradient
                  colors={banner.type === 'benefits' ? ['#FFFFFF', '#F8FAFC'] : ['#FFD700', '#FFA500']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.ctaGradient}
                >
                  <Text style={[styles.ctaText, banner.type === 'benefits' && styles.ctaTextDark]}>
                    {banner.ctaText}
                  </Text>
                  <Text style={[styles.ctaArrow, banner.type === 'benefits' && styles.ctaArrowDark]}>
                    →
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            
            {/* Right Content with modern icon */}
            <View style={styles.rightContent}>
              <View style={styles.graphicContainer}>
                <Text style={styles.graphicIcon}>{banner.icon}</Text>
                <View style={styles.glowEffect} />
                
                {/* Floating elements for visual interest */}
                <View style={styles.floatingElement1} />
                <View style={styles.floatingElement2} />
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderIndicators = () => (
    <View style={styles.indicatorsContainer}>
      {banners.map((_, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.indicator,
            index === currentIndex && styles.activeIndicator
          ]}
          onPress={() => {
            const bannerWidth = screenWidth - 32; // Restamos el padding horizontal
            scrollViewRef.current?.scrollTo({
              x: index * bannerWidth,
              animated: true,
            });
            setCurrentIndex(index);
          }}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {banners.map((banner, index) => renderBanner(banner, index))}
      </ScrollView>
      {renderIndicators()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
  },
  scrollView: {
    borderRadius: 24,
  },
  bannerContainer: {
    width: screenWidth - 32,
    borderRadius: 24,
    overflow: 'hidden',
    marginHorizontal: 0,
  },
  bannerTouchable: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  bannerGradient: {
    height: 160,
    justifyContent: 'center',
    position: 'relative',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 120,
    height: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 60,
    transform: [{ translateX: 30 }, { translateY: -30 }],
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 24,
    zIndex: 2,
  },
  leftContent: {
    flex: 1,
  },
  topBadgesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  primaryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  primaryBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  trustBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.4)',
  },
  trustBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '600',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  brandText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginRight: 8,
  },
  brandAccent: {
    width: 24,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 1,
  },
  titleContainer: {
    marginBottom: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
    lineHeight: 28,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    marginBottom: 16,
  },
  achievementContainer: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  achievementText: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: '600',
  },
  ctaButton: {
    alignSelf: 'flex-start',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    gap: 8,
  },
  ctaText: {
    color: '#1a1a2e',
    fontSize: 15,
    fontWeight: '700',
  },
  ctaTextDark: {
    color: '#1e3c72',
  },
  ctaArrow: {
    color: '#1a1a2e',
    fontSize: 16,
    fontWeight: '800',
  },
  ctaArrowDark: {
    color: '#1e3c72',
  },
  rightContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
  },
  graphicContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
  },
  graphicIcon: {
    fontSize: 36,
    zIndex: 3,
  },
  glowEffect: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 1,
  },
  floatingElement1: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    top: 10,
    right: 10,
    zIndex: 2,
  },
  floatingElement2: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    bottom: 15,
    left: 5,
    zIndex: 2,
  },
  indicatorsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    marginHorizontal: 3,
  },
  activeIndicator: {
    backgroundColor: '#1e3c72',
    width: 20,
    height: 6,
    borderRadius: 3,
  },
});

export default BannerCarousel;
