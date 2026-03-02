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
  ScrollView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import GradientButton from '../Utils/GradientButton';

const { height: screenHeight } = Dimensions.get('window');

const GroupStyleCreateModal = ({ visible, onClose, onCreateCollection }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);
  
  // Animation values
  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const inputFocusAnim = useRef(new Animated.Value(0)).current;

  const categories = [
    { id: '1', name: 'Tecnología', icon: 'phone-portrait-outline', color: '#007AFF' },
    { id: '2', name: 'Moda', icon: 'shirt-outline', color: '#FF3B30' },
    { id: '3', name: 'Hogar', icon: 'home-outline', color: '#34C759' },
    { id: '4', name: 'Deportes', icon: 'fitness-outline', color: '#FF9500' },
    { id: '5', name: 'Libros', icon: 'book-outline', color: '#AF52DE' },
    { id: '6', name: 'Música', icon: 'musical-notes-outline', color: '#FF2D92' },
  ];

  // Animation effects
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          delay: 100,
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
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  // Input focus animation
  useEffect(() => {
    Animated.timing(inputFocusAnim, {
      toValue: focusedInput ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [focusedInput]);

  const handleCreateCollection = async () => {
    if (!loading && name.trim() && description.trim() && selectedCategory) {
      setLoading(true);
      setError(false);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const collectionData = {
          name: name.trim(),
          description: description.trim(),
          category: selectedCategory,
          isPrivate: false,
          createdAt: new Date().toISOString(),
          itemCount: 0
        };
        
        onCreateCollection(collectionData);
        
        // Reset form
        setName('');
        setDescription('');
        setSelectedCategory(null);
        onClose();
      } catch (err) {
        setError(true);
        setErrorMessage('Error al crear la colección. Inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setSelectedCategory(null);
    setError(false);
    onClose();
  };

  const renderCategoryOption = (category) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryOption,
        selectedCategory?.id === category.id && styles.categoryOptionSelected
      ]}
      onPress={() => {
        setSelectedCategory(category);
      }}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={selectedCategory?.id === category.id ? 
          [category.color, category.color + 'CC'] : 
          ['#FFFFFF', '#F8F9FA']
        }
        style={styles.categoryGradient}
      >
        <View style={[
          styles.categoryIconContainer,
          selectedCategory?.id === category.id && styles.categoryIconContainerSelected
        ]}>
          <LinearGradient
            colors={selectedCategory?.id === category.id ? 
              ['#FFFFFF', '#F8F9FA'] : 
              [category.color, category.color + 'CC']
            }
            style={styles.categoryIconGradient}
          >
            <Ionicons 
              name={category.icon} 
              size={20} 
              color={selectedCategory?.id === category.id ? category.color : '#FFFFFF'} 
            />
          </LinearGradient>
        </View>
        <Text style={[
          styles.categoryName,
          selectedCategory?.id === category.id && styles.categoryNameSelected
        ]}>
          {category.name}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} transparent onRequestClose={handleClose} animationType="none">
      <StatusBar backgroundColor="rgba(0, 0, 0, 0.5)" barStyle="light-content" />
      <Animated.View style={[styles.overlay, { opacity: backdropOpacity }]}>
        <TouchableWithoutFeedback onPress={handleClose}>
          <Animated.View style={styles.backdrop} />
        </TouchableWithoutFeedback>
        
        <Animated.View style={[
          styles.modalContainer,
          { 
            transform: [
              { translateY },
              { scale: scaleAnim }
            ]
          }
        ]}>
          <SafeAreaView style={styles.safeArea}>
            {/* Premium Handle Bar */}
            <View style={styles.handleContainer}>
              <View style={styles.handleBar} />
            </View>

            {/* Elegant Header */}
            <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
              <View style={styles.headerContent}>
                <View style={styles.iconContainer}>
                  <LinearGradient
                    colors={['#34C759', '#30D158']}
                    style={styles.iconGradient}
                  >
                    <Ionicons name="add-circle" size={24} color="#FFFFFF" />
                  </LinearGradient>
                </View>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>Nueva Colección</Text>
                  <Text style={styles.subtitle}>Crea tu colección personalizada</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                <Ionicons name="close" size={20} color="#8E8E93" />
              </TouchableOpacity>
            </Animated.View>

            {/* Scrollable Content */}
            <ScrollView 
              style={styles.scrollContainer}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
              bounces={true}
            >
                {/* Premium Content */}
                <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                  
                  {/* Input Section */}
                  <View style={styles.inputSection}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Nombre de la colección</Text>
                      <Animated.View style={[
                        styles.inputContainer,
                        { 
                          borderColor: focusedInput === 'name' ? '#007AFF' : '#E5E7EB',
                          shadowOpacity: focusedInput === 'name' ? 0.1 : 0.05,
                        }
                      ]}>
                        <TextInput
                          placeholder="Mi colección favorita"
                          style={styles.input}
                          value={name}
                          onChangeText={setName}
                          onFocus={() => setFocusedInput('name')}
                          onBlur={() => setFocusedInput(null)}
                          placeholderTextColor="#8E8E93"
                          maxLength={50}
                        />
                        <View style={styles.inputIconContainer}>
                          <Ionicons name="text" size={16} color="#8E8E93" />
                        </View>
                      </Animated.View>
                    </View>
                    
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Descripción</Text>
                      <Animated.View style={[
                        styles.inputContainer,
                        styles.textAreaContainer,
                        { 
                          borderColor: focusedInput === 'description' ? '#007AFF' : '#E5E7EB',
                          shadowOpacity: focusedInput === 'description' ? 0.1 : 0.05,
                        }
                      ]}>
                        <TextInput
                          placeholder="Describe tu colección..."
                          style={[styles.input, styles.textArea]}
                          value={description}
                          onChangeText={setDescription}
                          onFocus={() => setFocusedInput('description')}
                          onBlur={() => setFocusedInput(null)}
                          multiline
                          numberOfLines={3}
                          placeholderTextColor="#8E8E93"
                          maxLength={200}
                        />
                        <View style={styles.inputIconContainer}>
                          <Ionicons name="document-text" size={16} color="#8E8E93" />
                        </View>
                      </Animated.View>
                    </View>
                  </View>

                  {/* Categories Section */}
                  <View style={styles.categoriesSection}>
                    <Text style={styles.sectionTitle}>Categoría</Text>
                    <Text style={styles.sectionSubtitle}>Selecciona una categoría para tu colección</Text>
                    <View style={styles.categoriesGrid}>
                      {categories.map(renderCategoryOption)}
                    </View>
                  </View>
                </Animated.View>
            </ScrollView>

            {/* Elegant Footer */}
            <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
              {error && (
                <View style={styles.errorContainer}>
                  <View style={styles.errorIconContainer}>
                    <Ionicons name="warning" size={16} color="#FF3B30" />
                  </View>
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              )}
              <GradientButton 
                color="Green" 
                text="Crear Colección"  
                onPress={handleCreateCollection}
                disabled={loading || !name.trim() || !description.trim() || !selectedCategory}
              />
            </Animated.View>
          </SafeAreaView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Overlay & Backdrop
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  
  // Modal Container
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: screenHeight * 0.95,
    minHeight: screenHeight * 0.7,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 24,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  
  // Premium Handle Bar
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  
  // Elegant Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: 16,
  },
  iconGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#34C759',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1D1D1F',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
    letterSpacing: -0.1,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  
  // Scroll Container
  scrollContainer: {
    flex: 1,
    maxHeight: screenHeight * 0.7,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  
  // Premium Content
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  
  // Input Section
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
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
    elevation: 2,
  },
  textAreaContainer: {
    alignItems: 'flex-start',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1D1D1F',
    fontWeight: '500',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputIconContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  
  // Categories Section
  categoriesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1D1D1F',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
    marginBottom: 20,
    letterSpacing: -0.1,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  categoryOption: {
    borderRadius: 20,
    overflow: 'hidden',
    width: '30%',
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryOptionSelected: {
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  categoryGradient: {
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  categoryIconContainer: {
    marginBottom: 12,
  },
  categoryIconContainerSelected: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  categoryIconGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    textAlign: 'center',
    letterSpacing: -0.1,
  },
  categoryNameSelected: {
    color: '#1D1D1F',
  },
  
  // Elegant Footer
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
    backgroundColor: '#FFFFFF',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  errorIconContainer: {
    marginRight: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#DC2626',
    letterSpacing: -0.1,
  },
});

export default GroupStyleCreateModal;
