import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
  Modal,
  BackHandler,
  SafeAreaView,
  Dimensions,
  ScrollView
} from 'react-native';
import { useUser } from '../../context/useUser';
import { LinearGradient } from 'expo-linear-gradient';
import { Video } from 'expo-av';
import { formatString } from '../../utils/formatString';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function AnswerCard ({
  response,
  showAnswer,
  onClose,
  onNext,
  userInfo
}) {
  const { texts } = useUser();
  const screenTexts = texts?.components?.Preguntas?.AnswerCard || {};

  // Fullscreen viewer state - DEBE estar antes de cualquier return
  const [fullVisible, setFullVisible] = useState(false);
  const [fullType, setFullType] = useState(null); // 'image' | 'video'
  const [fullUri, setFullUri] = useState(null);
  const videoRef = useRef(null);

  // Normaliza datos: admite antiguos (string) y nuevos (objeto)
  const normalized = (() => {
    try {
      if (!response) {
        return { type: 'text', text: 'Sin respuesta' };
      }
      
      if (typeof response === 'string') {
        return { type: 'text', text: response };
      }
      
      if (response && typeof response === 'object') {
        if (response.media?.type === 'image' || response.media?.type === 'video') {
          // Nota: el backend guarda url; en el front usamos "uri"
          return { 
            type: response.media.type, 
            text: response.text || '', 
            uri: response.media.url || response.media.uri || null 
          };
        }
        if (response.text) return { type: 'text', text: response.text };
      }
      
      return { type: 'text', text: 'Sin respuesta' };
    } catch (error) {
      console.error('Error normalizing response:', error);
      return { type: 'text', text: 'Error al cargar respuesta' };
    }
  })();

  const openFullscreen = (type, uri) => {
    setFullType(type);
    setFullUri(uri);
    setFullVisible(true);
  };

  const closeFullscreen = () => {
    setFullVisible(false);
    // Pausa el video si estaba reproduciéndose
    if (videoRef.current?.pauseAsync) {
      videoRef.current.pauseAsync().catch(() => {});
    }
  };

  // Botón físico "atrás": primero cierra fullscreen; si no está abierto, cierra la tarjeta
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (fullVisible) {
        closeFullscreen();
        return true;
      }
      if (showAnswer) {
        onClose?.();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [fullVisible, showAnswer, onClose]);

  // No renderizar si no se debe mostrar la respuesta
  if (!showAnswer) {
    return null;
  }

  // Debug log
  console.log('AnswerCard rendering with:', { showAnswer, response: !!response, userInfo: !!userInfo });

  return (
    <>
      {/* Modal fullscreen premium para imagen/video */}
      <Modal
        visible={fullVisible}
        animationType="fade"
        transparent
        onRequestClose={closeFullscreen}
        statusBarTranslucent
      >
        <View style={styles.fullOverlay}>
          <SafeAreaView style={styles.fullSafeArea}>
            <View style={styles.fullHeader}>
              <TouchableOpacity 
                style={styles.fullCloseButton} 
                onPress={closeFullscreen}
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              >
                <LinearGradient
                  colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.6)']}
                  style={styles.fullCloseGradient}
                >
                  <Text style={styles.fullCloseText}>✕</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={styles.fullContent}>
              {fullType === 'image' && fullUri && (
                <Image
                  source={{ uri: fullUri }}
                  style={styles.fullMedia}
                  resizeMode="contain"
                  onError={() => console.log('Error loading fullscreen image')}
                />
              )}

              {fullType === 'video' && fullUri && (
                <Video
                  ref={videoRef}
                  source={{ uri: fullUri }}
                  style={styles.fullMedia}
                  useNativeControls
                  resizeMode="contain"
                  shouldPlay
                  onError={() => console.log('Error loading fullscreen video')}
                />
              )}
            </View>
          </SafeAreaView>
        </View>
      </Modal>

      {/* Modal de respuesta con imagen de fondo completa */}
      <Animated.View
        style={[
          styles.container,
          { 
            transform: [
              { translateY: showAnswer ? 0 : screenHeight },
              { scale: showAnswer ? 1 : 0.98 }
            ], 
            opacity: showAnswer ? 1 : 0 
          }
        ]}
        pointerEvents={showAnswer ? 'auto' : 'none'}
      >
        <View style={styles.fullScreenCard}>
          {/* Imagen de fondo completa */}
          {normalized.type === 'image' && normalized.uri ? (
            <Image
              source={{ uri: normalized.uri }}
              style={styles.backgroundImage}
              resizeMode="cover"
              onError={() => console.log('Error loading background image')}
            />
          ) : (
            <LinearGradient
              colors={['#667eea', '#764ba2', '#f093fb']}
              style={styles.backgroundGradient}
            />
          )}

          {/* Overlay oscuro para legibilidad */}
          <View style={styles.darkOverlay} />

          {/* Header con botón cerrar */}
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.topHeader}>
              <View style={styles.userInfo}>
                <Image 
                  source={{ 
                    uri: (userInfo && userInfo.avatar) ? userInfo.avatar : 'https://via.placeholder.com/40' 
                  }} 
                  style={styles.userAvatar}
                  onError={() => console.log('Error loading avatar')}
                />
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>
                    {userInfo && userInfo.name ? userInfo.name : 'Usuario'}
                  </Text>
                  <Text style={styles.userStatus}>respondió</Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={onClose}
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              >
                <View style={styles.closeButtonBackground}>
                  <Text style={styles.closeButtonText}>✕</Text>
                </View>
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          {/* Contenido principal */}
          <View style={styles.contentContainer}>
            {/* Pregunta con fondo blanco */}
            <View style={styles.questionContainer}>
              <Text style={styles.questionText}>
                {screenTexts.QuestionPlaceholder || "¿Cuál es tu secreto?"}
              </Text>
            </View>

            {/* Respuesta */}
            <View style={styles.responseContainer}>
              {normalized.type === 'text' && (
                <View style={styles.textResponseCard}>
                  <Text style={styles.responseText}>
                    {normalized.text || 'Sin respuesta'}
                  </Text>
                </View>
              )}

              {normalized.type === 'video' && normalized.uri && (
                <TouchableOpacity 
                  style={styles.videoContainer}
                  onPress={() => {
                    if (normalized.uri) {
                      openFullscreen('video', normalized.uri);
                    }
                  }} 
                  activeOpacity={0.9}
                >
                  <Video
                    source={{ uri: normalized.uri }}
                    style={styles.responseVideo}
                    resizeMode="cover"
                    useNativeControls={false}
                    isMuted
                    onError={() => console.log('Error loading video')}
                  />
                  <View style={styles.videoPlayOverlay}>
                    <LinearGradient
                      colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)']}
                      style={styles.videoPlayGradient}
                    >
                      <Text style={styles.videoPlayIcon}>▶</Text>
                      <Text style={styles.videoPlayText}>Toca para reproducir</Text>
                    </LinearGradient>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Métricas de engagement */}
          <View style={styles.engagementContainer}>
            <View style={styles.engagementItem}>
              <View style={styles.engagementIconContainer}>
                <Text style={styles.engagementIcon}>❤️</Text>
              </View>
              <Text style={styles.engagementNumber}>12</Text>
              <Text style={styles.engagementLabel}>Likes</Text>
            </View>
            
            <View style={styles.engagementItem}>
              <View style={styles.engagementIconContainer}>
                <Text style={styles.engagementIcon}>🔓</Text>
              </View>
              <Text style={styles.engagementNumber}>8</Text>
              <Text style={styles.engagementLabel}>Desbloqueos</Text>
            </View>
          </View>

          {/* Botón de acción */}
          <View style={styles.bottomActionContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <LinearGradient
                colors={['#FF6B6B', '#FF5252', '#FF1744']}
                style={styles.actionButtonGradient}
              >
                <Text style={styles.actionButtonText}>❤️ Me gusta</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  // Main container - pantalla completa
  container: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0,
    backgroundColor: 'transparent'
  },
  fullScreenCard: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
    backgroundColor: '#000'
  },

  // Background image/gradient
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%'
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%'
  },
  darkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)'
  },

  // Safe area y header
  safeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    marginRight: 12
  },
  userDetails: {
    flex: 1
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2
  },
  userStatus: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '400',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1
  },
  closeButton: {
    borderRadius: 20,
    overflow: 'hidden'
  },
  closeButtonBackground: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700'
  },

   // Content container
   contentContainer: {
     position: 'absolute',
     top: 120,
     left: 0,
     right: 0,
     paddingHorizontal: 20,
     zIndex: 5
   },
   questionContainer: {
     backgroundColor: 'white',
     borderRadius: 16,
     paddingHorizontal: 20,
     paddingVertical: 16,
     marginBottom: 20,
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 0.1,
     shadowRadius: 4,
     elevation: 4
   },
   questionText: {
     color: '#1A1A1A',
     fontSize: 16,
     fontWeight: '500',
     lineHeight: 24
   },

  // Response content
  responseContainer: {
    marginBottom: 40
  },
  textResponseCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(10px)'
  },
  responseText: {
    fontSize: 18,
    lineHeight: 28,
    color: 'white',
    fontWeight: '400',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3
  },

  // Video container
  videoContainer: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)'
  },
  responseVideo: {
    width: '100%',
    height: 200,
    borderRadius: 16
  },
  videoPlayOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  videoPlayGradient: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)'
  },
  videoPlayIcon: {
    color: 'white',
    fontSize: 32,
    marginBottom: 8
  },
  videoPlayText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2
  },

  // Engagement metrics
  engagementContainer: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    zIndex: 5
  },
  engagementItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    minWidth: 100
  },
  engagementIconContainer: {
    marginBottom: 8
  },
  engagementIcon: {
    fontSize: 24
  },
  engagementNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2
  },
  engagementLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.9)',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1
  },

  // Bottom action
  bottomActionContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    zIndex: 5
  },
  actionButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },
  actionButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center'
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2
  },

  // Fullscreen viewer (mantener para videos)
  fullOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)'
  },
  fullSafeArea: {
    flex: 1
  },
  fullHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: 20
  },
  fullCloseButton: {
    alignSelf: 'flex-end',
    marginRight: 20,
    borderRadius: 20,
    overflow: 'hidden'
  },
  fullCloseGradient: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  fullCloseText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600'
  },
  fullContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  fullMedia: {
    width: screenWidth,
    height: screenHeight * 0.8
  }
});
