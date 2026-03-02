import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  StatusBar,
  SafeAreaView,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const PremiumImageViewer = ({ 
  images = [], 
  visible = false, 
  initialIndex = 0, 
  onClose = () => {},
  onIndexChange = () => {},
  showUserInfo = true,
  userInfo = {}
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const translateY = useRef(new Animated.Value(50)).current;
  const controlsOpacity = useRef(new Animated.Value(1)).current;
  
  const pan = useRef(new Animated.ValueXY()).current;

  useEffect(() => {
    if (visible) {
      setCurrentIndex(initialIndex);
      setIsLoading(true);
      
      // Animación de entrada
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => setIsLoading(false));
      
      // Auto-hide controls
      setTimeout(() => {
        Animated.timing(controlsOpacity, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }).start();
        setShowControls(false);
      }, 3000);
    }
  }, [visible, initialIndex]);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dy) > 50;
    },
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dy > 0) {
        pan.setValue({ x: 0, y: gestureState.dy });
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dy > 100) {
        // Close on swipe down
        Animated.timing(pan, {
          toValue: { x: 0, y: screenHeight },
          duration: 200,
          useNativeDriver: true,
        }).start(() => onClose());
      } else {
        // Return to center
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  };

  const toggleControls = () => {
    if (showControls) {
      Animated.timing(controlsOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      setShowControls(false);
    } else {
      Animated.timing(controlsOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      setShowControls(true);
      
      // Auto-hide again
      setTimeout(() => {
        Animated.timing(controlsOpacity, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }).start();
        setShowControls(false);
      }, 3000);
    }
  };

  const goToNext = () => {
    if (currentIndex < images.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      onIndexChange(newIndex);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      onIndexChange(newIndex);
    }
  };

  if (!visible || images.length === 0) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <StatusBar backgroundColor="black" barStyle="light-content" />
      
      <Animated.View 
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: pan.y }
            ]
          }
        ]}
        {...panResponder.panHandlers}
      >
        {/* Background overlay */}
        <View style={styles.backgroundOverlay} />
        
        {/* Main Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: images[currentIndex]?.uri || images[currentIndex] }}
            style={styles.mainImage}
            resizeMode="contain"
            onLoad={() => setIsLoading(false)}
            onLoadStart={() => setIsLoading(true)}
          />
          
          {isLoading && (
            <View style={styles.loadingContainer}>
              <Animated.View style={[styles.loadingSpinner, { opacity: fadeAnim }]}>
                <Text style={styles.loadingText}>📸</Text>
              </Animated.View>
            </View>
          )}
        </View>

        {/* Top Controls */}
        <Animated.View style={[styles.topControls, { opacity: controlsOpacity }]}>
          <SafeAreaView>
            <View style={styles.topBar}>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <LinearGradient
                  colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.3)']}
                  style={styles.closeButtonGradient}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              {images.length > 1 && (
                <View style={styles.imageCounter}>
                  <LinearGradient
                    colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.3)']}
                    style={styles.counterGradient}
                  >
                    <Text style={styles.counterText}>
                      {currentIndex + 1} / {images.length}
                    </Text>
                  </LinearGradient>
                </View>
              )}
            </View>
          </SafeAreaView>
        </Animated.View>

        {/* User Info */}
        {showUserInfo && userInfo && (
          <Animated.View style={[styles.userInfo, { opacity: controlsOpacity }]}>
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.userInfoGradient}
            >
              <View style={styles.userInfoContent}>
                <View style={styles.userInfoHeader}>
                  <Image source={{ uri: userInfo.avatar }} style={styles.userAvatar} />
                  <View style={styles.userDetails}>
                    <Text style={styles.userName}>{userInfo.name}</Text>
                    <Text style={styles.userLocation}>{userInfo.location}</Text>
                  </View>
                </View>
                
                {userInfo.caption && (
                  <Text style={styles.caption}>{userInfo.caption}</Text>
                )}
              </View>
            </LinearGradient>
          </Animated.View>
        )}

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <Animated.View style={[styles.navigationArrows, { opacity: controlsOpacity }]}>
            {currentIndex > 0 && (
              <TouchableOpacity onPress={goToPrevious} style={styles.arrowButton}>
                <LinearGradient
                  colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.3)']}
                  style={styles.arrowGradient}
                >
                  <Text style={styles.arrowText}>‹</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
            
            {currentIndex < images.length - 1 && (
              <TouchableOpacity onPress={goToNext} style={[styles.arrowButton, styles.arrowRight]}>
                <LinearGradient
                  colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.3)']}
                  style={styles.arrowGradient}
                >
                  <Text style={styles.arrowText}>›</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </Animated.View>
        )}

        {/* Tap to toggle controls */}
        <TouchableOpacity 
          style={styles.tapArea} 
          onPress={toggleControls}
          activeOpacity={1}
        />
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainImage: {
    width: screenWidth,
    height: screenHeight,
  },
  loadingContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingSpinner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 24,
  },
  
  // Top Controls
  topControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  closeButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  closeButtonGradient: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  imageCounter: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  counterGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  counterText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },

  // User Info
  userInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  userInfoGradient: {
    paddingBottom: 40,
  },
  userInfoContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  userInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  userLocation: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  caption: {
    color: 'white',
    fontSize: 15,
    lineHeight: 20,
    marginTop: 8,
  },

  // Navigation Arrows
  navigationArrows: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  arrowButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowRight: {
    alignSelf: 'flex-end',
  },
  arrowGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
  },

  // Tap Area
  tapArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
});

export default PremiumImageViewer;
