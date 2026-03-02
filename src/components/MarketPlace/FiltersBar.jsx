import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useUser } from '../../context/useUser';

const FiltersBar = ({ selectedFilter, onFilterChange }) => {
  const { texts } = useUser();
  const filterTexts = texts.pages.MarketPlace.Filters;

  const filters = [
    { key: 'all', label: filterTexts.All },
    { key: 'promociones', label: filterTexts.Promociones },
    { key: 'snacks', label: filterTexts.Snacks },
    { key: 'saludable', label: filterTexts.Saludable },
    { key: 'mediterranea', label: filterTexts.Mediterránea },
    { key: 'asiatica', label: filterTexts.Asiática },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterButton,
              selectedFilter === filter.key && styles.filterButtonSelected
            ]}
            onPress={() => onFilterChange(filter.key)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter.key && styles.filterTextSelected
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterButtonSelected: {
    backgroundColor: '#1D7CE4',
    borderColor: '#1D7CE4',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default FiltersBar;
