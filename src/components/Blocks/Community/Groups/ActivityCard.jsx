import React, { useState, useRef, useEffect } from 'react';
import { TouchableOpacity, Text, ImageBackground, StyleSheet, View, Image, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../../../../context/useUser";
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ActivityCard = ({ info }) => {
  const navigate = useNavigation();
  const { logout, texts } = useUser()
  const screenTexts = texts.components.Blocks.Community.Groups.ActivityCard
  
  // Gen Z UX States
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [participantsCount] = useState(Math.floor(Math.random() * 50) + 5); // Mock data
  
  // Animations for Gen Z interactions
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const likeAnim = useRef(new Animated.Value(1)).current;
  const bookmarkAnim = useRef(new Animated.Value(1)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  // Safety check for required data
  if (!info || !info.avatar || !info.avatar.url) {
    return null;
  }
  
  const formatDate = (date) => {
    if (!date) return '';
    
    const months = [
      screenTexts.January, 
      screenTexts.February, 
      screenTexts.March, 
      screenTexts.April, 
      screenTexts.May, 
      screenTexts.June, 
      screenTexts.July, 
      screenTexts.August, 
      screenTexts.September, 
      screenTexts.October, 
      screenTexts.November, 
      screenTexts.December
    ];
  
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    const day = d.getDate();
    const month = months[d.getMonth()] || '';
    const year = d.getFullYear();
  
    return `${day} ${screenTexts.Of} ${month} ${screenTexts.Of} ${year}`;
  };

  const formatTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    return d.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const isSameDay = (start, end) => {
    if (!start || !end) return false;
    const startDate = new Date(start);
    const endDate = new Date(end);
    return startDate.toDateString() === endDate.toDateString();
  };

  const getDateDisplay = () => {
    if (!info.timetable?.start) return '';
    
    const startDate = formatDate(info.timetable.start);
    const startTime = formatTime(info.timetable.start);
    
    if (info.timetable?.end && !isSameDay(info.timetable.start, info.timetable.end)) {
      const endDate = formatDate(info.timetable.end);
      return `${startDate} - ${endDate}`;
    }
    
    return `${startDate} • ${startTime}`;
  };

  // Gen Z specific functions
  const handleLike = () => {
    setIsLiked(!isLiked);
    Animated.sequence([
      Animated.timing(likeAnim, {
        toValue: 1.3,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(likeAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    Animated.sequence([
      Animated.timing(bookmarkAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(bookmarkAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  // Shimmer effect for loading state
  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    shimmer.start();
    return () => shimmer.stop();
  }, []);

  const getActivityType = () => {
    // Mock activity types for Gen Z
    const types = ['🎉 Fiesta', '🏃‍♀️ Deporte', '🎨 Arte', '🍕 Comida', '🎵 Música', '🌍 Aventura'];
    return types[Math.floor(Math.random() * types.length)];
  };

  const getUrgencyLevel = () => {
    if (!info.timetable?.start) return null;
    const now = new Date();
    const eventDate = new Date(info.timetable.start);
    const diffHours = (eventDate - now) / (1000 * 60 * 60);
    
    if (diffHours < 24) return 'urgent';
    if (diffHours < 72) return 'soon';
    return null;
  };

  return (
    <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={styles.touchableCard}
        onPress={() => navigate.navigate("ActivityDetail", {_id: info._id, name: info.name})}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={styles.imageContainer}>
          <ImageBackground
            source={{ uri: info.avatar.url }}
            style={styles.cardImage}
            imageStyle={styles.imageStyle}
          >
            {/* Urgency Indicator */}
            {getUrgencyLevel() && (
              <View style={styles.urgencyBadge}>
                <Text style={styles.urgencyText}>
                  {getUrgencyLevel() === 'urgent' ? '🔥 ¡HOY!' : '⚡ Pronto'}
                </Text>
              </View>
            )}

            {/* Top Action Bar */}
            <View style={styles.topActions}>
              <View style={styles.activityTypeBadge}>
                <Text style={styles.activityTypeText}>{getActivityType()}</Text>
              </View>
              
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.actionButton} 
                  onPress={handleBookmark}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Animated.View style={{ transform: [{ scale: bookmarkAnim }] }}>
                    <Ionicons 
                      name={isBookmarked ? "bookmark" : "bookmark-outline"} 
                      size={20} 
                      color={isBookmarked ? "#FF6B6B" : "#FFFFFF"} 
                    />
                  </Animated.View>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionButton} 
                  onPress={handleLike}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Animated.View style={{ transform: [{ scale: likeAnim }] }}>
                    <Ionicons 
                      name={isLiked ? "heart" : "heart-outline"} 
                      size={20} 
                      color={isLiked ? "#FF6B6B" : "#FFFFFF"} 
                    />
                  </Animated.View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Elegant Header Overlay */}
             <LinearGradient
               colors={['rgba(0,0,0,0.6)', 'transparent']}
               style={styles.headerGradient}
             >
               <View style={styles.headerContent}>
                 <Text style={styles.dateText}>{getDateDisplay()}</Text>
                 <Text style={styles.locationText}>
                   {info.city && `${info.city}`}
                   {info.country && `, ${info.country}`}
                 </Text>
               </View>
             </LinearGradient>

            {/* Bottom Content Overlay */}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.9)']}
              style={styles.contentGradient}
            >
              <View style={styles.contentContainer}>
                <View style={styles.textContainer}>
                  <Text style={styles.title} numberOfLines={2}>
                    {info.name || ''}
                  </Text>
                  <Text style={styles.description} numberOfLines={2}>
                    {info.description || ''}
                  </Text>
                  
                  {/* Social Proof */}
                  <View style={styles.socialProof}>
                    <View style={styles.participantsContainer}>
                      <View style={styles.participantsAvatars}>
                        <View style={[styles.avatar, styles.avatar1]} />
                        <View style={[styles.avatar, styles.avatar2]} />
                        <View style={[styles.avatar, styles.avatar3]} />
                      </View>
                      <Text style={styles.participantsText}>
                        {participantsCount} personas interesadas
                      </Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.actionContainer}>
                  <View style={styles.joinButton}>
                    <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                  </View>
                </View>
              </View>
            </LinearGradient>

            {/* Shimmer Effect */}
            <Animated.View 
              style={[
                styles.shimmer, 
                { 
                  opacity: shimmerAnim,
                  transform: [{
                    translateX: shimmerAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-width, width],
                    })
                  }]
                }
              ]} 
            />
          </ImageBackground>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  // Main Card Container
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { 
      width: 0, 
      height: 12 
    },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    elevation: 20,
    height: 380,
  },
  touchableCard: {
    flex: 1,
  },
  imageContainer: {
    flex: 1,
    borderRadius: 28,
    overflow: 'hidden',
  },
  cardImage: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  imageStyle: {
    borderRadius: 28,
  },

  // Urgency Indicators
  urgencyBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  urgencyText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  // Top Action Bar
  topActions: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 8,
  },
  activityTypeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activityTypeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },

  // Header Gradient & Content
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    paddingTop: 70,
    paddingHorizontal: 20,
    zIndex: 2,
  },
  headerContent: {
    flexDirection: 'column',
    gap: 6,
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  locationText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.2,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  // Bottom Content
  contentGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 180,
    paddingHorizontal: 20,
    paddingBottom: 24,
    justifyContent: 'flex-end',
    zIndex: 2,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    marginRight: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 30,
    letterSpacing: -0.8,
  },
  description: {
    fontSize: 15,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
    letterSpacing: 0.2,
    marginBottom: 12,
  },

  // Social Proof
  socialProof: {
    marginTop: 8,
  },
  participantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  participantsAvatars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginLeft: -6,
  },
  avatar1: {
    backgroundColor: '#FF6B6B',
    zIndex: 3,
  },
  avatar2: {
    backgroundColor: '#4ECDC4',
    zIndex: 2,
  },
  avatar3: {
    backgroundColor: '#45B7D1',
    zIndex: 1,
  },
  participantsText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.2,
  },

  // Action Button
  actionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  // Shimmer Effect
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: [{ skewX: '-25deg' }],
    width: width * 0.3,
  },
});

export default ActivityCard;