import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import CompanyIconCard from './CompanyIconCard';

const CompanyIconsSection = ({ title, subtitle, companies, onCompanyPress, isExpanded = true, onToggle }) => {
  const keyExtractor = (item, idx) => String(item?.id ?? idx);

  const renderCompany = ({ item }) => (
    <CompanyIconCard
      companyName={item.name}
      iconSource={item.iconSource}
      isVerified={item.isVerified}
      onPress={() => onCompanyPress?.(item)}
    />
  );

  return (
    <View style={styles.section}>
      {/* Header colapsable */}
      <TouchableOpacity style={styles.minimalHeader} onPress={onToggle} activeOpacity={0.6}>
        <View style={styles.minimalContent}>
          <View style={styles.titleSection}>
            <Text style={styles.minimalTitle}>{title}</Text>
            {subtitle && <Text style={styles.minimalSubtitle}>{subtitle}</Text>}
          </View>
          <View style={styles.minimalChevron}>
            <Text style={styles.chevronMinimal}>{isExpanded ? "−" : "+"}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Company Icons - solo se muestra si está expandido */}
      {isExpanded && (
        <FlatList
          data={companies}
          horizontal
          keyExtractor={keyExtractor}
          renderItem={renderCompany}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 28,
  },
  // Estilos minimalistas para headers de sección (como PlaceInfo)
  minimalHeader: {
    marginHorizontal: 20,
    marginVertical: 6,
  },
  minimalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0',
  },
  titleSection: {
    flex: 1,
  },
  minimalTitle: {
    fontSize: 22,
    fontWeight: '300',
    color: '#000000',
    letterSpacing: -0.6,
    lineHeight: 26,
    marginBottom: 2,
  },
  minimalSubtitle: {
    fontSize: 15,
    color: '#8E8E93',
    fontWeight: '400',
    letterSpacing: -0.2,
    lineHeight: 18,
  },
  minimalChevron: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  chevronMinimal: {
    fontSize: 16,
    color: '#999999',
    fontWeight: '200',
    letterSpacing: 0,
    lineHeight: 16,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
});

export default CompanyIconsSection;
