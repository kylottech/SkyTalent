import React, { useRef, useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../context/useUser';
import GradientButton from '../Utils/GradientButton';
import { LinearGradient } from 'expo-linear-gradient';

const { height: screenHeight } = Dimensions.get('window');

const CreateCollectionModal = ({ visible, onClose, onCreateCollection }) => {
  console.log('CreateCollectionModal - visible prop:', visible);
  const { logout, texts } = useUser();
  const screenTexts = texts?.components?.MarketPlace?.CreateCollectionModal || {
    Title: 'Nueva Colección',
    NameTitle: 'Nombre de la colección',
    NamePlaceHolder: 'Mi colección favorita',
    DescriptionTitle: 'Descripción (opcional)',
    DescriptionPlaceHolder: 'Describe tu colección...',
    GradientButton: 'Crear Colección'
  };

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Categorías disponibles (reducidas para testing)
  const categories = [
    { id: '1', name: 'Tecnología', icon: 'phone-portrait-outline' },
    { id: '2', name: 'Moda', icon: 'shirt-outline' },
    { id: '3', name: 'Hogar', icon: 'home-outline' },
    { id: '4', name: 'Deportes', icon: 'fitness-outline' },
  ];
  
  // Animation values
  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // Animation effects
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: screenHeight,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleCreateCollection = async () => {
    if (!name.trim()) {
      setError(true);
      setErrorMessage('El nombre de la colección es requerido');
      return;
    }

    if (!selectedCategory) {
      setError(true);
      setErrorMessage('Debes seleccionar una categoría');
      return;
    }

    if (!loading) {
      setLoading(true);
      try {
        const collectionData = {
          name: name.trim(),
          description: description.trim(),
          category: selectedCategory,
          isPrivate,
          createdAt: new Date().toISOString(),
          itemCount: 0
        };

        // Aquí implementarías la llamada al servicio para crear la colección
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simular API call
        
        // Reset form
        setName('');
        setDescription('');
        setSelectedCategory(null);
        setIsPrivate(false);
        setError(false);
        setErrorMessage('');
        
        // Call parent callback
        onCreateCollection?.(collectionData);
        
      } catch (error) {
        setError(true);
        setErrorMessage(error.message || 'Error al crear la colección');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setSelectedCategory(null);
    setIsPrivate(false);
    setError(false);
    setErrorMessage('');
    onClose();
  };

  console.log('CreateCollectionModal render - visible:', visible);
  
  return (
    <Modal 
      visible={visible}
      animationType="none"
      transparent
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <Animated.View style={[styles.overlay, { opacity: backdropOpacity }]}>
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
        
        <Animated.View style={[
          styles.modalContainer,
          { transform: [{ translateY }] }
        ]}>
          <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardView}
            >
              {/* Handle Bar */}
              <View style={styles.handleContainer}>
                <View style={styles.handleBar} />
              </View>

              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>{screenTexts.Title}</Text>
                <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                  <Ionicons name="close" size={24} color="#8E8E93" />
                </TouchableOpacity>
              </View>

              {/* Scrollable Content */}
              <ScrollView 
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {/* Content */}
                <View style={styles.content}>
                  {/* Collection Icon Section */}
                  <View style={styles.iconSection}>
                    <View style={styles.iconContainer}>
                      <Ionicons name="bookmark" size={32} color="#007AFF" />
                    </View>
                    <Text style={styles.iconDescription}>
                      Organiza tus productos favoritos en colecciones personalizadas
                    </Text>
                  </View>

                  {/* Input Section */}
                  <View style={styles.inputSection}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>{screenTexts.NameTitle}</Text>
                      <TextInput
                        placeholder={screenTexts.NamePlaceHolder}
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholderTextColor="#8E8E93"
                        maxLength={50}
                      />
                      <Text style={styles.characterCount}>{name.length}/50</Text>
                    </View>
                    
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>{screenTexts.DescriptionTitle}</Text>
                      <TextInput
                        placeholder={screenTexts.DescriptionPlaceHolder}
                        style={[styles.input, styles.textArea]}
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={3}
                        placeholderTextColor="#8E8E93"
                        maxLength={200}
                      />
                      <Text style={styles.characterCount}>{description.length}/200</Text>
                    </View>
                  </View>

                  {/* Category Section */}
                  <View style={styles.categorySection}>
                    <View style={styles.categoryHeader}>
                      <Ionicons name="grid-outline" size={20} color="#8E8E93" />
                      <Text style={styles.categoryTitle}>Categoría</Text>
                    </View>
                    
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
                          <View style={[
                            styles.categoryIconContainer,
                            selectedCategory?.id === category.id && styles.categoryIconContainerSelected
                          ]}>
                            <Ionicons 
                              name={category.icon} 
                              size={20} 
                              color={selectedCategory?.id === category.id ? '#007AFF' : '#8E8E93'} 
                            />
                          </View>
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

                  {/* Privacy Section */}
                  <View style={styles.privacySection}>
                    <View style={styles.privacyHeader}>
                      <Ionicons name="eye" size={20} color="#8E8E93" />
                      <Text style={styles.privacyTitle}>Privacidad</Text>
                    </View>
                    
                    <TouchableOpacity
                      style={styles.privacyOption}
                      onPress={() => setIsPrivate(!isPrivate)}
                    >
                      <View style={styles.privacyInfo}>
                        <Text style={styles.privacyOptionTitle}>
                          {isPrivate ? 'Colección privada' : 'Colección pública'}
                        </Text>
                        <Text style={styles.privacyOptionDescription}>
                          {isPrivate 
                            ? 'Solo tú puedes ver esta colección' 
                            : 'Otros usuarios pueden ver esta colección'
                          }
                        </Text>
                      </View>
                      <View style={[styles.radioButton, isPrivate && styles.radioButtonActive]}>
                        {isPrivate && <View style={styles.radioButtonInner} />}
                      </View>
                    </TouchableOpacity>
                  </View>

                  {/* Error Message */}
                  {error && (
                    <View style={styles.errorContainer}>
                      <Ionicons name="alert-circle" size={20} color="#FF3B30" />
                      <Text style={styles.errorText}>{errorMessage}</Text>
                    </View>
                  )}
                </View>
              </ScrollView>

              {/* Bottom Action */}
              <View style={styles.bottomAction}>
                <TouchableOpacity
                  style={styles.createButton}
                  onPress={handleCreateCollection}
                  disabled={loading || !name.trim() || !selectedCategory}
                >
                  <LinearGradient
                    colors={loading || !name.trim() || !selectedCategory ? ['#C7C7CC', '#C7C7CC'] : ['#007AFF', '#5AC8FA']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.createButtonGradient}
                  >
                    <Text style={styles.createButtonText}>
                      {loading ? 'Creando...' : screenTexts.GradientButton}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: screenHeight * 0.85,
    minHeight: screenHeight * 0.5,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handleBar: {
    width: 36,
    height: 4,
    backgroundColor: '#C7C7CC',
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
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
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 20,
  },
  iconSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconDescription: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
  inputSection: {
    marginBottom: 32,
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'right',
    marginTop: 4,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginLeft: 8,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryOption: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    minWidth: '48%',
  },
  categoryOptionSelected: {
    backgroundColor: '#F0F8FF',
    borderColor: '#007AFF',
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  categoryIconContainerSelected: {
    backgroundColor: '#E3F2FD',
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
  privacySection: {
    marginBottom: 24,
  },
  privacyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginLeft: 8,
  },
  privacyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  privacyInfo: {
    flex: 1,
  },
  privacyOptionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1D1D1F',
    marginBottom: 2,
  },
  privacyOptionDescription: {
    fontSize: 14,
    color: '#8E8E93',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#C7C7CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonActive: {
    borderColor: '#007AFF',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFCDD2',
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
    marginLeft: 8,
    flex: 1,
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

export default CreateCollectionModal;
