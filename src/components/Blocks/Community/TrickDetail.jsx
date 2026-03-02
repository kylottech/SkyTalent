import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image,
  Modal, Dimensions, Pressable, FlatList, Animated
} from 'react-native';
import { useUser } from "../../../context/useUser";
import { formatString } from '../../../utils/formatString'
import { Video } from 'expo-av';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { trickLike } from '../../../services/communityServices';
import { moreFollow, lessFollow } from '../../../services/profileService'
import { LinearGradient } from 'expo-linear-gradient';
import mensaje from '../../../../assets/mensaje.png'

const { width, height } = Dimensions.get('window');

const TrickDetail = ({ _id, creatorInfo, descripcion, liked, likes, titulo, multimedia = [], setComentsModal, setId }) => {
  const { logout, texts } = useUser();
  const screenTexts = texts.components.Blocks.Community.TrickDetail;
  const [expanded, setExpanded] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(liked);
  const [likeCount, setLikeCount] = useState(likes);
  const [isFollowing, setIsFollowing] = useState(creatorInfo.follow);
  const [isMe] = useState(creatorInfo.isMe);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const videoRef = useRef(null);
  const isTouching = useRef(false);
  const flatListRef = useRef(null);
  const videoDuration = useRef(0);
  const videoCurrentTime = useRef(0);
  
  // Animaciones
  const heartScale = useRef(new Animated.Value(1)).current;
  const cardScale = useRef(new Animated.Value(1)).current;
  const followButtonScale = useRef(new Animated.Value(1)).current;

  const mediaList = multimedia?.map(media => {
    const uri = media.url;
    const type = uri.endsWith('.mp4') || uri.includes('video') ? 'video' : 'image';
    return { uri, type };
  }) || []

  const handleLiked = async () => {
    try {
      // Animación del corazón
      Animated.sequence([
        Animated.timing(heartScale, {
          toValue: 1.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(heartScale, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();

      await trickLike({ _id: _id })
      .then((res) => {
        setIsLiked(prev => !prev);
        setLikeCount(prev => prev + (isLiked ? -1 : 1));
      })
      .catch((error) => {
        setError(true);
        setErrorMessage(error.message);
      });
    } catch (error) {
      
    }
  };

  const toggleExpanded = () => setExpanded(prev => !prev);
  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const currentMedia = mediaList[currentIndex];

  const handleTouchStart = () => {
    if (currentMedia?.type === 'video') {
      isTouching.current = true;
      videoRef.current?.pauseAsync();
    }
  };

  const handleTouchEnd = () => {
    if (currentMedia?.type === 'video') {
      isTouching.current = false;
      videoRef.current?.playAsync();
    }
  };

  const updateProgress = () => {
    if (videoDuration.current > 0) {
      const progressValue = videoCurrentTime.current / videoDuration.current;
      progress.setValue(progressValue);
    }
  };

  const handlePlaybackStatusUpdate = (status) => {
    if (status.isPlaying) {
      videoDuration.current = status.durationMillis;
      videoCurrentTime.current = status.positionMillis;
      updateProgress();
    } else if (status.isPaused) {
      videoCurrentTime.current = status.positionMillis;
    }
  };

  useEffect(() => {
    if (currentMedia?.type === 'video') {
      const intervalId = setInterval(updateProgress, 100);
      return () => clearInterval(intervalId);
    } else {
      progress.stopAnimation();
    }
  }, [currentMedia]);

  const handleFollowToggle = async () => {
    try {
      // Animación del botón de seguir
      Animated.sequence([
        Animated.timing(followButtonScale, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(followButtonScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      if (isFollowing) {
        await lessFollow({ _id: creatorInfo._id });
      } else {
        await moreFollow({ _id: creatorInfo._id });
      }
      setIsFollowing(prev => !prev);
    } catch (error) {
     
    }
  };

  const renderMedia = ({ item }) => {
    if (item.type === 'image') {
      return (
        <Image
          source={{ uri: item.uri }}
          style={styles.fullscreenMedia}
          resizeMode="contain"
        />
      );
    } else {
      return (
        <Pressable
          style={styles.fullscreenMedia}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <Video
            ref={videoRef}
            source={{ uri: item.uri }}
            style={styles.fullscreenMedia}
            resizeMode="contain"
            isLooping
            shouldPlay
            isMuted={false}
            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          />
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                })
              }
            ]}
          />
        </Pressable>
      );
    }
  };

  return (
    <>
      <Animated.View style={[styles.card, { transform: [{ scale: cardScale }] }]}>
        <TouchableOpacity onPress={toggleExpanded} activeOpacity={0.95}>
          {/* Header mejorado */}
          <View style={styles.header}>
            <View style={styles.userSection}>
              <Image source={{ uri: creatorInfo.avatar.url }} style={styles.avatar} />
              <View style={styles.userInfo}>
                <Text style={styles.name}>{creatorInfo.name} {creatorInfo.surname}</Text>
                <Text style={styles.username}>@{creatorInfo.kylotId}</Text>
              </View>
            </View>
            
            {!isMe && (
              <Animated.View style={{ transform: [{ scale: followButtonScale }] }}>
                <TouchableOpacity 
                  style={[styles.followBtn, isFollowing && styles.followingBtn]} 
                  onPress={handleFollowToggle}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.followText, isFollowing && styles.followingText]}>
                    {isFollowing ? screenTexts.Following : screenTexts.Follow}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>

          {/* Media con diseño ultra-premium */}
          {(expanded && mediaList.length > 0) && (
            <TouchableOpacity onPress={openModal} activeOpacity={0.95}>
              <View style={styles.premiumMediaContainer}>
                {mediaList[0].type === 'video' ? (
                  <Video
                    source={{ uri: mediaList[0].uri }}
                    style={styles.premiumMedia}
                    resizeMode="cover"
                    isMuted
                  />
                ) : (
                  <Image
                    source={{ uri: mediaList[0].uri }}
                    style={styles.premiumMedia}
                    resizeMode="cover"
                  />
                )}
                
                {/* Overlay minimalista */}
                <View style={styles.premiumOverlay}>
                  <View style={styles.playButton}>
                    <Ionicons name="play" size={24} color="#FFFFFF" />
                  </View>
                </View>
                
                {/* Acciones con jerarquía UX/UI perfeccionada */}
                <View style={styles.perfectActions}>
                  <TouchableOpacity onPress={handleLiked} style={styles.perfectAction}>
                    <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                      <View style={[styles.perfectIcon, isLiked && styles.perfectIconActive]}>
                        <FontAwesome
                          name={isLiked ? "heart" : "heart-o"}
                          size={20}
                          color={isLiked ? "#FFFFFF" : "#FFFFFF"}
                        />
                      </View>
                    </Animated.View>
                    {likeCount > 0 && (
                      <View style={styles.perfectCountBadge}>
                        <Text style={styles.perfectCountText}>{likeCount}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    onPress={() => {setId(), setComentsModal()}} 
                    style={styles.perfectAction}
                  >
                    <View style={styles.perfectIcon}>
                      <Ionicons name="chatbubble-outline" size={20} color="#FFFFFF" />
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.perfectAction}>
                    <View style={styles.perfectIcon}>
                      <Ionicons name="share-outline" size={20} color="#FFFFFF" />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}

          {/* Contenido ultra-simple */}
          <View style={styles.premiumContent}>
            <Text style={styles.premiumTitle}>{titulo}</Text>

            <View style={styles.premiumDescription}>
              <Text 
                style={styles.premiumDescriptionText}
                numberOfLines={expanded ? (showFullDescription ? undefined : 2) : 1}
              >
                {descripcion}
              </Text>
              {expanded && descripcion.length > 80 && (
                <TouchableOpacity 
                  onPress={() => setShowFullDescription(!showFullDescription)}
                  style={styles.premiumReadMore}
                >
                  <Text style={styles.premiumReadMoreText}>
                    {showFullDescription ? 'Ver menos' : 'Leer más'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Footer minimalista */}
          {likeCount > 0 && (
            <View style={styles.premiumFooter}>
              <View style={styles.premiumLikesContainer}>
                <View style={styles.premiumLikesAvatars}>
                  <View style={styles.premiumLikeAvatar}>
                    <Image 
                      source={{ uri: creatorInfo.avatar.url }} 
                      style={styles.premiumLikeAvatarImage} 
                    />
                  </View>
                  {likeCount > 1 && (
                    <View style={[styles.premiumLikeAvatar, styles.premiumSecondAvatar]}>
                      <Image 
                        source={{ uri: creatorInfo.avatar.url }} 
                        style={styles.premiumLikeAvatarImage} 
                      />
                    </View>
                  )}
                  {likeCount > 2 && (
                    <View style={[styles.premiumLikeAvatar, styles.premiumThirdAvatar]}>
                      <Image 
                        source={{ uri: creatorInfo.avatar.url }} 
                        style={styles.premiumLikeAvatarImage} 
                      />
                    </View>
                  )}
                </View>
                <Text style={styles.premiumLikesText}>
                  {formatString(screenTexts.LikesMessage, { variable1: likeCount })}
                </Text>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>

      {mediaList.length > 0 && (
        <Modal visible={isModalVisible} transparent animationType="fade">
          <View style={styles.modalContainer}>
            <FlatList
              ref={flatListRef}
              horizontal
              pagingEnabled
              data={mediaList}
              renderItem={renderMedia}
              keyExtractor={(_, index) => index.toString()}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(event.nativeEvent.contentOffset.x / width);
                setCurrentIndex(index);
              }}
            />
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={{ color: 'white', fontSize: 18 }}>✕</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#F2F2F7',
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  username: {
    fontSize: 14,
    fontWeight: '400',
    color: '#8E8E93',
    letterSpacing: -0.1,
  },
  followBtn: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  followingBtn: {
    backgroundColor: '#1D7CE4',
    borderColor: '#1D7CE4',
  },
  followText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1D1D1F',
    letterSpacing: -0.1,
  },
  followingText: {
    color: '#FFFFFF',
  },
  premiumMediaContainer: {
    position: 'relative',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  premiumMedia: {
    width: '100%',
    height: width * 0.9,
    backgroundColor: '#F2F2F7',
  },
  premiumOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(20px)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  perfectActions: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    alignItems: 'center',
    gap: 16,
  },
  perfectAction: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  perfectIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    transform: [{ scale: 1 }],
  },
  perfectIconActive: {
    backgroundColor: 'rgba(255,59,48,0.9)',
    borderColor: 'rgba(255,255,255,0.4)',
    transform: [{ scale: 1.1 }],
    shadowColor: '#FF3B30',
    shadowOpacity: 0.6,
  },
  perfectCountBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  perfectCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  premiumContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 8,
  },
  premiumTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1D1D1F',
    lineHeight: 30,
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  premiumDescription: {
    marginTop: 2,
  },
  premiumDescriptionText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#8E8E93',
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  premiumReadMore: {
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  premiumReadMoreText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1D7CE4',
    letterSpacing: -0.2,
  },
  premiumFooter: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 4,
  },
  premiumLikesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumLikesAvatars: {
    flexDirection: 'row',
    marginRight: 12,
  },
  premiumLikeAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginLeft: -6,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  premiumSecondAvatar: {
    zIndex: 1,
  },
  premiumThirdAvatar: {
    zIndex: 2,
  },
  premiumLikeAvatarImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  premiumLikesText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
    letterSpacing: -0.2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  fullscreenMedia: {
    width,
    height,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 12,
    borderRadius: 22,
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    height: 4,
    backgroundColor: 'white',
  },
});

export default TrickDetail;
