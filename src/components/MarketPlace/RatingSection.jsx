import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useUser } from '../../context/useUser';
import StarRating from '../Utils/StarRating';

const RatingSection = ({ rating = 4.5, totalReviews = 127, onWriteReview, onSeeAll }) => {
  const { texts } = useUser();
  const ratingTexts = texts.pages.MarketPlacePages.Details.Rating;

  const getRatingLabel = (rating) => {
    if (rating >= 4.5) return ratingTexts.Excellent;
    if (rating >= 4.0) return ratingTexts.VeryGood;
    if (rating >= 3.0) return ratingTexts.Good;
    if (rating >= 2.0) return ratingTexts.Average;
    return ratingTexts.Poor;
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return '#059669';
    if (rating >= 4.0) return '#1D7CE4';
    if (rating >= 3.0) return '#F59E0B';
    if (rating >= 2.0) return '#EF4444';
    return '#6B7280';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{ratingTexts.Title}</Text>
      
      <View style={styles.ratingSummary}>
        <View style={[styles.ratingBadge, { backgroundColor: getRatingColor(rating) }]}>
          <Text style={styles.ratingScore}>{rating.toFixed(1)}</Text>
        </View>
        <View style={styles.ratingInfo}>
          <Text style={styles.ratingLabel}>{getRatingLabel(rating)}</Text>
          <Text style={styles.totalReviews}>{ratingTexts.Subtitle.replace('127', totalReviews)}</Text>
        </View>
      </View>

      <StarRating mode='read' ratingNumber={rating} size={20} />

      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.writeReviewButton} 
          onPress={onWriteReview}
          activeOpacity={0.8}
        >
          <Image 
            source={require('../../../assets/pluma.png')} 
            style={styles.actionIcon}
            resizeMode="contain"
          />
          <Text style={styles.writeReviewText}>{ratingTexts.WriteReview}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.seeAllButton} 
          onPress={onSeeAll}
          activeOpacity={0.8}
        >
          <Text style={styles.seeAllText}>{ratingTexts.SeeAll}</Text>
          <Image 
            source={require('../../../assets/flechaDerecha.png')} 
            style={styles.chevronIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  ratingSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  ratingScore: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  ratingInfo: {
    flex: 1,
  },
  ratingLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  totalReviews: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  writeReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1D7CE4',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flex: 1,
    marginRight: 12,
  },
  actionIcon: {
    width: 18,
    height: 18,
    marginRight: 10,
    tintColor: '#FFFFFF',
  },
  writeReviewText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flex: 1,
    marginLeft: 12,
  },
  seeAllText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
    marginRight: 8,
  },
  chevronIcon: {
    width: 16,
    height: 16,
    tintColor: '#9CA3AF',
  },
});

export default RatingSection;
