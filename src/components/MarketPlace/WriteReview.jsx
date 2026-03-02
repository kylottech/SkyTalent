import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, Image } from 'react-native';
import { useUser } from '../../context/useUser';

const WriteReview = ({ visible, onClose, onSubmit }) => {
  const { texts } = useUser();
  const reviewTexts = texts.pages.MarketPlacePages.Details.Review;
  
  const [review, setReview] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(null);

  const emojis = [
    { emoji: '😍', label: 'excelente', value: 5 },
    { emoji: '😊', label: 'muy bueno', value: 4 },
    { emoji: '😐', label: 'regular', value: 3 },
    { emoji: '😕', label: 'malo', value: 2 },
    { emoji: '😢', label: 'muy malo', value: 1 },
  ];

  const handleSubmit = () => {
    if (review.trim() && selectedEmoji) {
      onSubmit({ review: review.trim(), rating: selectedEmoji.value });
      setReview('');
      setSelectedEmoji(null);
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Image source={require('../../../assets/mensaje.png')} style={styles.headerIcon} />
              <Text style={styles.headerTitle}>{reviewTexts.Title}</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Image source={require('../../../assets/icon_x.png')} style={styles.closeIcon} />
            </TouchableOpacity>
          </View>

          {/* Main Title */}
          <Text style={styles.mainTitle}>{reviewTexts.MainTitle}</Text>
          
          {/* Description */}
          <Text style={styles.description}>{reviewTexts.Description}</Text>
          
          {/* Emoji Rating */}
          <View style={styles.emojiContainer}>
            {emojis.map((emoji, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.emojiButton,
                  selectedEmoji?.value === emoji.value && styles.emojiButtonSelected
                ]}
                onPress={() => setSelectedEmoji(emoji)}
                activeOpacity={0.7}
              >
                <Text style={styles.emoji}>{emoji.emoji}</Text>
                {selectedEmoji?.value === emoji.value && (
                  <View style={styles.selectedLabel}>
                    <Text style={styles.selectedLabelText}>{emoji.label}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Text Input */}
          <TextInput
            style={styles.input}
            placeholder={reviewTexts.Placeholder}
            placeholderTextColor="#9CA3AF"
            value={review}
            onChangeText={setReview}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          
          {/* Submit Button */}
          <TouchableOpacity 
            style={[
              styles.submitButton, 
              (!selectedEmoji || !review.trim()) && styles.submitButtonDisabled
            ]} 
            onPress={handleSubmit}
            disabled={!selectedEmoji || !review.trim()}
            activeOpacity={0.8}
          >
            <Text style={styles.submitText}>{reviewTexts.Submit}</Text>
            <Image source={require('../../../assets/flechaDerecha.png')} style={styles.submitIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 20,
    height: 20,
    tintColor: '#374151',
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    width: 16,
    height: 16,
    tintColor: '#6B7280',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  emojiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  emojiButton: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
  },
  emojiButtonSelected: {
    backgroundColor: '#F3F4F6',
  },
  emoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  selectedLabel: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  selectedLabelText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#111827',
    minHeight: 120,
    marginBottom: 24,
    textAlignVertical: 'top',
  },
  submitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  submitButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  submitText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginRight: 8,
  },
  submitIcon: {
    width: 16,
    height: 16,
    tintColor: '#FFFFFF',
  },
});

export default WriteReview;
