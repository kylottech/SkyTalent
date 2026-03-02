import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const TestCreateCollectionModal = ({ visible, onClose, onCreateCollection }) => {
  console.log('TestCreateCollectionModal - render called with visible:', visible);
  console.log('TestCreateCollectionModal - onClose function:', typeof onClose);
  console.log('TestCreateCollectionModal - onCreateCollection function:', typeof onCreateCollection);
  
  const [name, setName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    { id: '1', name: 'Tecnología', icon: 'phone-portrait-outline' },
    { id: '2', name: 'Moda', icon: 'shirt-outline' },
    { id: '3', name: 'Hogar', icon: 'home-outline' },
    { id: '4', name: 'Deportes', icon: 'fitness-outline' },
  ];

  const handleCreate = () => {
    if (!name.trim()) {
      alert('El nombre es requerido');
      return;
    }
    if (!selectedCategory) {
      alert('Debes seleccionar una categoría');
      return;
    }
    
    onCreateCollection({
      name: name.trim(),
      category: selectedCategory,
      description: '',
      isPrivate: false,
      createdAt: new Date().toISOString(),
      itemCount: 0
    });
    
    setName('');
    setSelectedCategory(null);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Nueva Colección</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#8E8E93" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {/* Name Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nombre de la colección</Text>
                <TextInput
                  placeholder="Mi colección favorita"
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor="#8E8E93"
                  maxLength={50}
                />
              </View>
              
              {/* Categories */}
              <View style={styles.categorySection}>
                <Text style={styles.inputLabel}>Categoría</Text>
                <View style={styles.categoriesGrid}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryOption,
                        selectedCategory?.id === category.id && styles.categoryOptionSelected
                      ]}
                      onPress={() => setSelectedCategory(category)}
                    >
                      <Ionicons 
                        name={category.icon} 
                        size={20} 
                        color={selectedCategory?.id === category.id ? '#007AFF' : '#8E8E93'} 
                      />
                      <Text style={[
                        styles.categoryName,
                        selectedCategory?.id === category.id && styles.categoryNameSelected
                      ]}>
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>
            
            {/* Bottom Action */}
            <View style={styles.bottomAction}>
              <TouchableOpacity
                style={styles.createButton}
                onPress={handleCreate}
                disabled={!name.trim() || !selectedCategory}
              >
                <LinearGradient
                  colors={!name.trim() || !selectedCategory ? ['#C7C7CC', '#C7C7CC'] : ['#007AFF', '#5AC8FA']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.createButtonGradient}
                >
                  <Text style={styles.createButtonText}>Crear Colección</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1D1D1F',
    backgroundColor: '#FFFFFF',
  },
  categorySection: {
    marginBottom: 24,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryOption: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    minWidth: '48%',
    gap: 8,
  },
  categoryOptionSelected: {
    backgroundColor: '#F0F8FF',
    borderColor: '#007AFF',
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
    textAlign: 'center',
  },
  categoryNameSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  bottomAction: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  createButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  createButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default TestCreateCollectionModal;
