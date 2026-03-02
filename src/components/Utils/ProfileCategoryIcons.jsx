import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useUser } from '../../context/useUser';

const ProfileCategoryIcons = ({ categories = [], onCategoryPress }) => {
  const { texts } = useUser();
  const screenTexts = texts.pages.Perfil;

  // Default categories if none provided
  const defaultCategories = [
    { id: 'new', label: screenTexts.NewCategory, icon: '➕' },
    { id: 'festivals', label: screenTexts.Festivals2024, icon: '🎪' },
    { id: 'rooftop', label: screenTexts.RooftopParties, icon: '🏙️' },
    { id: 'behind', label: screenTexts.BehindScenes, icon: '📸' },
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {displayCategories.map((category, index) => (
          <TouchableOpacity
            key={category.id || index}
            style={styles.categoryIcon}
            onPress={() => onCategoryPress?.(category)}
            activeOpacity={0.7}
          >
            <View style={styles.iconCircle}>
              <Text style={styles.iconEmoji}>{category.icon || '🎯'}</Text>
            </View>
            <Text style={styles.categoryLabel} numberOfLines={2}>
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingRight: 16,
  },
  categoryIcon: {
    alignItems: 'center',
    marginRight: 20,
    width: 80,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconEmoji: {
    fontSize: 28,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1A1A1A',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default ProfileCategoryIcons;

