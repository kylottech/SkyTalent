import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useUser } from '../../context/useUser';

const BenefitValue = ({ originalPrice = 35, yourPrice = 25, savings = 10 }) => {
  const { texts } = useUser();
  const benefitValueTexts = texts.pages.MarketPlacePages.Details.BenefitValue;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{benefitValueTexts.Title}</Text>
      
      <View style={styles.valueContainer}>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>{benefitValueTexts.OriginalPrice}</Text>
          <Text style={styles.originalPrice}>{benefitValueTexts.Currency}{originalPrice}</Text>
        </View>
        
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>{benefitValueTexts.YourPrice}</Text>
          <Text style={styles.yourPrice}>{benefitValueTexts.Currency}{yourPrice}</Text>
        </View>
        
        <View style={styles.savingsRow}>
          <Text style={styles.savingsLabel}>{benefitValueTexts.Savings}</Text>
          <View style={styles.savingsBadge}>
            <Text style={styles.savingsText}>{benefitValueTexts.Currency}{savings}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  valueContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  originalPrice: {
    fontSize: 16,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    fontWeight: '500',
  },
  yourPrice: {
    fontSize: 20,
    color: '#1D7CE4',
    fontWeight: '700',
  },
  savingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  savingsLabel: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
  },
  savingsBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  savingsText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '700',
  },
});

export default BenefitValue;
