import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import StarRating from '../Utils/StarRating';

const ReviewCard = ({ review }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image source={{ uri: review.avatar }} style={styles.avatar} />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{review.userName}</Text>
            <Text style={styles.date}>{formatDate(review.date)}</Text>
          </View>
        </View>
        <View style={styles.ratingContainer}>
          <StarRating mode='read' ratingNumber={review.rating} />
        </View>
      </View>
      
      <Text style={styles.reviewText}>{review.text}</Text>
      
      {review.photos && review.photos.length > 0 && (
        <View style={styles.photosContainer}>
          {review.photos.slice(0, 3).map((photo, index) => (
            <Image key={index} source={{ uri: photo }} style={styles.photo} />
          ))}
          {review.photos.length > 3 && (
            <View style={styles.morePhotos}>
              <Text style={styles.morePhotosText}>+{review.photos.length - 3}</Text>
            </View>
          )}
        </View>
      )}
      
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
          <Image 
            source={require('../../../assets/corazon.png')} 
            style={styles.actionIcon}
            resizeMode="contain"
          />
          <Text style={styles.actionText}>{review.likes}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
          <Image 
            source={require('../../../assets/mensaje.png')} 
            style={styles.actionIcon}
            resizeMode="contain"
          />
          <Text style={styles.actionText}>Responder</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  ratingContainer: {
    alignItems: 'flex-end',
  },
  reviewText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  photosContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 8,
  },
  morePhotos: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  morePhotosText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
    tintColor: '#6B7280',
  },
  actionText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
});

export default ReviewCard;
