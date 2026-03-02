import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image,
  Modal, Dimensions, Pressable, FlatList, Animated, Linking
} from 'react-native';
import { Video } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../../context/useUser';
import { formatString } from '../../../utils/formatString'
import { contactLike, votedContact } from '../../../services/communityServices';
import { moreFollow, lessFollow } from '../../../services/profileService'
import mensaje from '../../../../assets/mensajeBlanco.png';
import corazon from '../../../../assets/corazon.png';
import StarRating from '../../Utils/StarRating'; // Ajusta si la ruta es distinta

const { width } = Dimensions.get('window');

const ContactsDetail = ({ _id, telefono, email, contactInfo, descripcion, liked, likes, puntuacion, voted, multimedia, setComentsModal, setId }) => {
  const navigation = useNavigation();
  const { texts } = useUser();
  const screenTexts = texts.components.Blocks.Community.ContactsDetail;

  const [expanded, setExpanded] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correo] = useState(contactInfo.email);
  const [phone] = useState(contactInfo.tlf);
  const [isLiked, setIsLiked] = useState(liked);
  const [likeCount, setLikeCount] = useState(likes);
  const [isMe, setIsMe] = useState(contactInfo.isMe);
  const [isFollowing, setIsFollowing] = useState(contactInfo.followed);
  const [isVoted, setIsVoted] = useState(voted.voted);
  const [votedNum, setVotedNum] = useState(voted.number);
  const [loadingFollow, setLoadingFollow] = useState(false);

  const progress = useRef(new Animated.Value(0)).current;
  const videoRef = useRef(null);
  const isTouching = useRef(false);
  const flatListRef = useRef(null);
  const videoDuration = useRef(0);
  const videoCurrentTime = useRef(0);

  // Verificar si multimedia es válido y no está vacío
  const hasMultimedia = multimedia && Array.isArray(multimedia) && multimedia.length > 0;
  
  const mediaList = hasMultimedia ? multimedia.map(media => {
    const uri = media.url;
    const type = uri.endsWith('.mp4') || uri.includes('video') ? 'video' : 'image';
    return { uri, type };
  }) : [];

  const handleLiked = async () => {
    try {
      await contactLike({ _id });
      setIsLiked(prev => !prev);
      setLikeCount(prev => prev + (isLiked ? -1 : 1));
    } catch (error) {
      console.error('Error al dar like:', error);
    }
  };

  const handleVote = async (number) => {
    try {
      await votedContact({ _id: _id, number: number });
      setIsVoted(true);
      setVotedNum(number);
    } catch (error) {
      console.error('Error al votar:', error);
    }
  };

  const handleFollow = async () => {
    if (loadingFollow) return;
    setLoadingFollow(true);
    try {
      if (isFollowing) {
        await lessFollow({ _id: contactInfo._id });
        setIsFollowing(false);
      } else {
        await moreFollow({ _id: contactInfo._id });
        setIsFollowing(true);
      }
    } catch (err) {
      console.error("Error al seguir/dejar de seguir:", err);
    } finally {
      setLoadingFollow(false);
    }
  };

  const toggleExpanded = () => setExpanded(prev => !prev);
  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const handleEmailPress = () => Linking.openURL(`mailto:${correo}`);
  const handlePhonePress = () => Linking.openURL(`tel:${phone}`);

  const currentMedia = hasMultimedia ? mediaList[currentIndex] : null;

  const handleTouchStart = () => {
    if (currentMedia && currentMedia.type === 'video') {
      isTouching.current = true;
      videoRef.current?.pauseAsync();
    }
  };

  const handleTouchEnd = () => {
    if (currentMedia && currentMedia.type === 'video') {
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
    if (currentMedia && currentMedia.type === 'video') {
      const intervalId = setInterval(updateProgress, 100);
      return () => clearInterval(intervalId);
    } else {
      progress.stopAnimation();
    }
  }, [currentMedia]);

  const renderMedia = ({ item }) => {
    if (item.type === 'image') {
      return (
        <Image source={{ uri: item.uri }} style={styles.fullscreenMedia} resizeMode="contain" />
      );
    } else {
      return (
        <Pressable style={styles.fullscreenMedia} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
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
          <Animated.View style={[styles.progressBar, {
            width: progress.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            })
          }]} />
        </Pressable>
      );
    }
  };

  return (
    <>
      <View style={styles.card}>
        {/* Main Image */}
        <View style={styles.imageContainer}>
          {hasMultimedia ? (
            <TouchableOpacity onPress={openModal} activeOpacity={0.9}>
              {mediaList[0].type === 'video' ? (
                <Video source={{ uri: mediaList[0].uri }} style={styles.mainImage} resizeMode="cover" isMuted />
              ) : (
                <Image source={{ uri: mediaList[0].uri }} style={styles.mainImage} resizeMode="cover" />
              )}
            </TouchableOpacity>
          ) : (
            <View style={styles.noMediaContainer}>
              <Text style={styles.noMediaText}>{screenTexts.NoItemsTexts}</Text>
            </View>
          )}
          
          {/* Rating in top right */}
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>{puntuacion}</Text>
            <FontAwesome name="star" size={12} color="#FFD700" />
          </View>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <Image source={{ uri: contactInfo.avatar.url }} style={styles.avatar} />
          <View style={styles.userInfo}>
            <Text style={styles.name}>{contactInfo.name} {contactInfo.surname}</Text>
            <Text style={styles.username}>@{contactInfo.kylotId}</Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description}>{descripcion}</Text>

        {/* Know More Button */}
        <TouchableOpacity style={styles.knowMoreButton} onPress={toggleExpanded}>
          <Text style={styles.knowMoreText}>{screenTexts.KnowMore}</Text>
        </TouchableOpacity>

        {/* Expanded Content */}
        {expanded && (
          <View style={styles.expandedContent}>
            {/* Actions */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.actionButton} onPress={handleLiked}>
                <Image 
                  source={corazon} 
                  style={[styles.actionIcon, isLiked && styles.likedIcon]}
                />
                <Text style={styles.actionText}>{likeCount}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => { setId(); setComentsModal(); }}>
                <Image source={mensaje} style={styles.actionIcon} />
                <Text style={styles.actionText}>0</Text>
              </TouchableOpacity>
              {!isMe && (
                <TouchableOpacity
                  style={[
                    styles.followButton,
                    isFollowing ? styles.followingButton : styles.notFollowingButton
                  ]}
                  onPress={handleFollow}
                  disabled={loadingFollow}
                >
                  <Text style={[
                    styles.followButtonText,
                    isFollowing ? styles.followingButtonText : styles.notFollowingButtonText
                  ]}>
                    {isFollowing ? screenTexts.Following : screenTexts.Follow}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {likeCount !== 0 && (
              <Text style={styles.likesText}>{formatString(screenTexts.LikesMessage, { variable1: likeCount })}</Text>
            )}

            {/* Contact Options */}
            <Text style={styles.contactLabel}>{screenTexts.PreferContact}</Text>
            <View style={styles.contactOptions}>
              {email && (
                <TouchableOpacity style={styles.contactButton} onPress={handleEmailPress}>
                  <Text style={styles.contactText}>{screenTexts.Option1}</Text>
                </TouchableOpacity>
              )}
              {telefono && (
                <TouchableOpacity style={styles.contactButton} onPress={handlePhonePress}>
                  <Text style={styles.contactText}>{screenTexts.Option2}</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Rating Section */}
            <View style={styles.ratingSection}>
              <Text style={styles.ratingLabel}>{screenTexts.Rate}</Text>
              <StarRating mode={!isVoted ? 'write' : 'read'} ratingNumber={votedNum} onChangeRating={handleVote}/>
            </View>
          </View>
        )}
      </View>

      {hasMultimedia && (
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
    borderRadius: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 280,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backdropFilter: 'blur(10px)',
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  noMediaContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMediaText: {
    fontSize: 16,
    color: '#86868B',
    fontWeight: '500',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1D1D1F',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  username: {
    fontSize: 14,
    color: '#86868B',
    fontWeight: '500',
  },
  description: {
    fontSize: 15,
    color: '#1D1D1F',
    lineHeight: 22,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  knowMoreButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E7',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  knowMoreText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    letterSpacing: 0.2,
  },
  expandedContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    gap: 6,
    backdropFilter: 'blur(15px)',
    minWidth: 50,
    justifyContent: 'center',
  },
  actionIcon: {
    width: 16,
    height: 16,
    tintColor: '#FFFFFF',
  },
  likedIcon: {
    tintColor: '#FF3B30',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 'auto',
  },
  followingButton: {
    backgroundColor: '#1D1D1F',
  },
  notFollowingButton: {
    backgroundColor: '#F2F2F7',
    borderWidth: 1,
    borderColor: '#E5E5E7',
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  followingButtonText: {
    color: '#FFFFFF',
  },
  notFollowingButtonText: {
    color: '#1D1D1F',
  },
  likesText: {
    fontSize: 14,
    color: '#86868B',
    marginBottom: 20,
    fontWeight: '500',
  },
  contactLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  contactOptions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  contactButton: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E7',
  },
  contactText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1D1D1F',
  },
  ratingSection: {
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  fullscreenMedia: { 
    width, 
    height: width * 1.2 
  },
  modalContainer: { 
    flex: 1, 
    backgroundColor: 'black', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  closeButton: { 
    position: 'absolute', 
    top: 40, 
    right: 20, 
    padding: 10 
  },
  progressBar: { 
    height: 3, 
    backgroundColor: '#FFD700', 
    position: 'absolute', 
    bottom: 0, 
    left: 0 
  }
});

export default ContactsDetail;