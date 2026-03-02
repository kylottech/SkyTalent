import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CollectionCard from './CollectionCard';
import GroupStyleCreateModal from './GroupStyleCreateModal';

const CollectionsSection = ({ title, subtitle, collections, onCollectionPress, isExpanded = true, onToggle }) => {
  const navigation = useNavigation();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const keyExtractor = (item, idx) => String(item?.id ?? idx);



  const renderCollection = ({ item }) => (
    <CollectionCard
      title={item.title}
      subtitle={item.subtitle}
      iconSource={item.iconSource}
      itemCount={item.itemCount}
      onPress={() => onCollectionPress?.(item)}
    />
  );

  const handleCreateCollection = (collectionData) => {
    // Aquí implementarías la lógica para crear la colección
    console.log('Creating collection:', collectionData);
    setShowCreateModal(false);
    // Opcional: refrescar la lista de colecciones
  };

  const renderCreateCollectionCard = () => (
    <TouchableOpacity 
      style={styles.createCollectionCard} 
      onPress={() => setShowCreateModal(true)}
      activeOpacity={0.7}
    >
      <View style={styles.createIconContainer}>
        <Feather name="plus" size={20} color="#FFFFFF" />
      </View>
      <View style={styles.createTextContainer}>
        <Text style={styles.createTitle}>Nueva colección</Text>
        <Text style={styles.createSubtitle}>Crear colección</Text>
      </View>
    </TouchableOpacity>
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

      {/* Collections - solo se muestra si está expandido */}
      {isExpanded && (
        <FlatList
          data={[...collections, { id: 'create-new', isCreateCard: true }]}
          horizontal
          keyExtractor={keyExtractor}
          renderItem={({ item }) => item.isCreateCard ? renderCreateCollectionCard() : renderCollection({ item })}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
        />
      )}

      {/* Create Collection Modal */}
      <GroupStyleCreateModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateCollection={handleCreateCollection}
      />
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
  },
  createCollectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    minWidth: 280,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
  createIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  createTextContainer: {
    flex: 1,
  },
  createTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  createSubtitle: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '400',
    letterSpacing: -0.1,
  },
});

export default CollectionsSection;
