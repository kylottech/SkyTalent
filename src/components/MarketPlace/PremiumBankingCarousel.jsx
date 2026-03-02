import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');

const PremiumBankingCarousel = ({ onBannerPress }) => {
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
      icon: 'K',
      accent: '#FFD700',
    },
    {
      id: 2,
      type: 'benefits',
      title: 'Beneficios Exclusivos',
      subtitle: 'Accede a descuentos y recompensas especiales',
      ctaText: 'Ver Beneficios',
      gradient: ['#2d1b69', '#11998e', '#38ef7d'],
      icon: 'B',
      accent: '#38ef7d',
    },
    {
      id: 3,
      type: 'community',
      title: 'Únete a la Comunidad',
      subtitle: 'Conecta con otros usuarios y comparte experiencias',
      ctaText: 'Conectar',
      gradient: ['#667eea', '#764ba2', '#f093fb'],
      icon: 'C',
      accent: '#f093fb',
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
        const bannerWidth = screenWidth - 40; // Restamos el padding horizontal
        scrollViewRef.current?.scrollTo({
          x: nextIndex * bannerWidth,
          animated: true,
        });
        return nextIndex;
      });
    }, 6000); // Cambia cada 6 segundos

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [banners.length]);

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const bannerWidth = screenWidth - 40; // Restamos el padding horizontal
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
          {/* Overlay sutil */}
          <View style={styles.overlay} />
          
          {/* Contenido principal */}
          <View style={styles.content}>
            <View style={styles.leftContent}>
              {/* Header con estilo bancario */}
              <View style={styles.headerSection}>
                <View style={styles.brandContainer}>
                  <View style={[styles.brandIcon, { borderColor: `${banner.accent}30` }]}>
                    <Text style={[styles.brandIconText, { color: banner.accent }]}>{banner.icon}</Text>
                  </View>
                  <View style={styles.brandTextContainer}>
                    <Text style={styles.brandText}>
                      {banner.type === 'marketplace' ? 'MARKETPLACE KYLOT' : 
                       banner.type === 'benefits' ? 'BENEFICIOS KYLOT' : 
                       'COMUNIDAD KYLOT'}
                    </Text>
                    <View style={[styles.brandAccent, { backgroundColor: banner.accent }]} />
                  </View>
                </View>
              </View>
              
              {/* Título principal */}
              <View style={styles.titleSection}>
                <Text style={styles.mainTitle}>{banner.title}</Text>
                <Text style={styles.mainSubtitle}>{banner.subtitle}</Text>
              </View>

              {/* Call to Action */}
              <TouchableOpacity style={styles.ctaContainer}>
                <LinearGradient
                  colors={[banner.accent, banner.accent + 'CC']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.ctaGradient}
                >
                  <Text style={styles.ctaText}>{banner.ctaText}</Text>
                  <View style={styles.ctaIcon}>
                    <Text style={styles.ctaArrow}>→</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            
            {/* Elemento gráfico premium */}
            <View style={styles.rightContent}>
              <View style={styles.graphicContainer}>
                <View style={[styles.graphicBackground, { borderColor: `${banner.accent}30` }]}>
                  <View style={[styles.graphicInner, { backgroundColor: `${banner.accent}20` }]}>
                    <Text style={[styles.graphicIcon, { color: banner.accent }]}>◉</Text>
                  </View>
                </View>
                <View style={[styles.graphicAccent, { backgroundColor: `${banner.accent}20` }]} />
              </View>
            </View>
          </View>
          
          {/* Elementos decorativos sutiles */}
          <View style={styles.decorativeElements}>
            <View style={[styles.decorativeDot, styles.dot1, { backgroundColor: `${banner.accent}40` }]} />
            <View style={[styles.decorativeDot, styles.dot2, { backgroundColor: `${banner.accent}40` }]} />
            <View style={[styles.decorativeDot, styles.dot3, { backgroundColor: `${banner.accent}40` }]} />
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
            const bannerWidth = screenWidth - 40; // Restamos el padding horizontal
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
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 16,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  scrollView: {
    borderRadius: 24,
  },
  bannerContainer: {
    width: screenWidth - 40,
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 24,
    zIndex: 2,
  },
  leftContent: {
    flex: 1,
  },
  headerSection: {
    marginBottom: 16,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  brandIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
  },
  brandIconText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  brandTextContainer: {
    flex: 1,
  },
  brandText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 4,
    opacity: 0.9,
  },
  brandAccent: {
    width: 24,
    height: 2,
    borderRadius: 1,
  },
  titleSection: {
    marginBottom: 20,
  },
  mainTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.8,
    lineHeight: 28,
    marginBottom: 6,
  },
  mainSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  ctaContainer: {
    alignSelf: 'flex-start',
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#FFD700',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginRight: 8,
  },
  ctaIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaArrow: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
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
  },
  graphicBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  graphicInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  graphicIcon: {
    fontSize: 32,
  },
  graphicAccent: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    zIndex: -1,
  },
  decorativeElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  decorativeDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dot1: {
    top: '25%',
    right: '20%',
  },
  dot2: {
    top: '60%',
    right: '15%',
  },
  dot3: {
    bottom: '30%',
    right: '25%',
  },
  indicatorsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#FFD700',
    width: 24,
    height: 8,
    borderRadius: 4,
  },
});

export default PremiumBankingCarousel;
