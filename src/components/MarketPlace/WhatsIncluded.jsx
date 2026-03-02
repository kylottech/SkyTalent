import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { useUser } from '../../context/useUser';

const WhatsIncluded = ({ items }) => {
  const { texts } = useUser();
  const whatsIncludedTexts = texts.pages.MarketPlacePages.Details.WhatsIncluded;
  const [expandedItems, setExpandedItems] = useState({});

  if (!items || items.length === 0) {
    return null;
  }

  const getIconForItem = (itemKey) => {
    switch (itemKey) {
      case 'Tour':
        return require('../../../assets/Route.png');
      case 'Museum':
        return require('../../../assets/ranking.png');
      case 'Locker':
        return require('../../../assets/iconPerson.png');
      case 'Field':
        return require('../../../assets/pinMapa.png');
      case 'Gift':
        return require('../../../assets/RegaloAzul.png');
      default:
        return require('../../../assets/category.png');
    }
  };

  const toggleExpanded = (index) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const getExpandedContent = (itemKey) => {
    switch (itemKey) {
      case 'Tour':
        return whatsIncludedTexts.Items.TourExpanded;
      case 'Museum':
        return whatsIncludedTexts.Items.MuseumExpanded;
      case 'Locker':
        return whatsIncludedTexts.Items.LockerExpanded;
      case 'Field':
        return whatsIncludedTexts.Items.FieldExpanded;
      case 'Gift':
        return whatsIncludedTexts.Items.GiftExpanded;
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{whatsIncludedTexts.Title}</Text>
      
      <View style={styles.listContainer}>
        {items.map((item, index) => (
          <View key={index} style={styles.listItemContainer}>
            <TouchableOpacity 
              style={styles.listItem} 
              activeOpacity={0.7}
              onPress={() => toggleExpanded(index)}
            >
              <Image source={getIconForItem(item.key)} style={styles.circularIcon} />
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{whatsIncludedTexts.Items[item.key]}</Text>
                <Text style={styles.itemSubtitle}>{whatsIncludedTexts.Items[item.key + 'Desc']}</Text>
              </View>
              <Animated.View 
                style={[
                  styles.chevronContainer,
                  {
                    transform: [{
                      rotate: expandedItems[index] ? '180deg' : '0deg'
                    }]
                  }
                ]}
              >
                <Image 
                  source={require('../../../assets/flechaDerecha.png')} 
                  style={styles.chevronIcon}
                  resizeMode="contain"
                />
              </Animated.View>
            </TouchableOpacity>
            
            {expandedItems[index] && (
              <Animated.View style={styles.expandedContent}>
                <Text style={styles.expandedText}>{getExpandedContent(item.key)}</Text>
              </Animated.View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 40,
  },
  title: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
    marginBottom: 16,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  listContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  listItemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  circularIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
    tintColor: '#6B7280',
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  chevronContainer: {
    padding: 4,
  },
  chevronIcon: {
    width: 16,
    height: 16,
    tintColor: '#9CA3AF',
  },
  expandedContent: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  expandedText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
    fontWeight: '400',
  },
});

export default WhatsIncluded;
