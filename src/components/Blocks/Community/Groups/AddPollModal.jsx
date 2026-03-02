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
import { useUser } from "../../../../context/useUser";
import GradientButton from '../../../Utils/GradientButton';
import { createGroupPoll } from '../../../../services/groupSocialServices';

const { height: screenHeight } = Dimensions.get('window');

const AddPollModal = ({ visible, onClose, groupId, loading, setLoading, setWinKylets }) => {
  const { logout, texts } = useUser();
  const screenTexts = texts?.components?.Blocks?.Community?.Groups?.AddPollModal || {
    Title: 'Crear Encuesta',
    QuestionTitle: 'Pregunta',
    QuestionPlaceHolder: '¿Qué prefieres hacer?',
    OptionTitle: 'Opción',
    OptionPlaceHolder: 'Escribe una opción',
    AddOption: 'Agregar opción',
    GradientButton: 'Crear Encuesta'
  };

  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
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

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCreatePoll = async () => {
    if (!loading && question.trim() && options.filter(opt => opt.trim()).length >= 2) {
      setLoading(true);
      try {
        const result = await createGroupPoll({ 
          groupId, 
          question: question.trim(), 
          options: options.filter(opt => opt.trim())
        }, logout);
        
        // Reset form
        setQuestion('');
        setOptions(['', '']);
        setError(false);
        setErrorMessage('');
        
        // Show success and close
        setWinKylets(result.kylets || 0);
        onClose();
        
      } catch (error) {
        setError(true);
        setErrorMessage(error.message || 'Error al crear la encuesta');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Modal 
      visible={visible}
      animationType="none"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Animated.View style={[styles.overlay, { opacity: backdropOpacity }]}>
        <TouchableWithoutFeedback onPress={onClose}>
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
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
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
                  {/* Question Section */}
                  <View style={styles.inputSection}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>{screenTexts.QuestionTitle}</Text>
                      <TextInput
                        placeholder={screenTexts.QuestionPlaceHolder}
                        style={[styles.input, styles.textArea]}
                        value={question}
                        onChangeText={setQuestion}
                        multiline
                        numberOfLines={3}
                        placeholderTextColor="#8E8E93"
                      />
                    </View>
                  </View>

                  {/* Options Section */}
                  <View style={styles.optionsSection}>
                    <Text style={styles.sectionTitle}>Opciones de respuesta</Text>
                    {options.map((option, index) => (
                      <View key={index} style={styles.optionRow}>
                        <View style={styles.inputGroup}>
                          <Text style={styles.inputLabel}>
                            {screenTexts.OptionTitle} {index + 1}
                          </Text>
                          <TextInput
                            placeholder={`${screenTexts.OptionPlaceHolder} ${index + 1}`}
                            style={styles.input}
                            value={option}
                            onChangeText={(value) => updateOption(index, value)}
                            placeholderTextColor="#8E8E93"
                          />
                        </View>
                        {options.length > 2 && (
                          <TouchableOpacity 
                            style={styles.removeButton}
                            onPress={() => removeOption(index)}
                          >
                            <Ionicons name="close-circle" size={24} color="#FF3B30" />
                          </TouchableOpacity>
                        )}
                      </View>
                    ))}
                    
                    {options.length < 6 && (
                      <TouchableOpacity style={styles.addOptionButton} onPress={addOption}>
                        <Ionicons name="add-circle-outline" size={20} color="#1D7CE4" />
                        <Text style={styles.addOptionText}>{screenTexts.AddOption}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </ScrollView>

              {/* Footer */}
              <View style={styles.footer}>
                <GradientButton
                  text={screenTexts.GradientButton}
                  onPress={handleCreatePoll}
                  loading={loading}
                  disabled={!question.trim() || options.filter(opt => opt.trim()).length < 2}
                />
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: screenHeight * 0.9,
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
    paddingTop: 12,
    paddingBottom: 8,
  },
  handleBar: {
    width: 36,
    height: 4,
    backgroundColor: '#C7C7CC',
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1D1D1F',
    letterSpacing: -0.4,
  },
  closeButton: {
    padding: 8,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputSection: {
    marginBottom: 24,
  },
  optionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1D1D1F',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1D1D1F',
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  removeButton: {
    marginLeft: 12,
    padding: 4,
  },
  addOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#1D7CE4',
    borderStyle: 'dashed',
    borderRadius: 12,
    backgroundColor: '#F0F8FF',
  },
  addOptionText: {
    fontSize: 16,
    color: '#1D7CE4',
    marginLeft: 8,
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E7',
  },
});

export default AddPollModal;
