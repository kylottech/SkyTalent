import React, { useRef, useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
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
import ToggleSwitch from 'toggle-switch-react-native'
import { useUser } from "../../../../context/useUser";
import GradientButton from '../../../Utils/GradientButton';
import AddUsers from './AddUsers';
import { createGroup } from '../../../../services/groupsServices'

const { height: screenHeight } = Dimensions.get('window');

const AddGroup = ({ visible, onClose, avatar, loading, setLoading, setWinKylets }) => {
  const addUsersRef = useRef();
  const { logout, texts } = useUser();
  const screenTexts = texts?.components?.Blocks?.Community?.Groups?.AddGroup || {
    Title: 'Crear Grupo',
    NameTitle: 'Nombre del grupo',
    NamePlaceHolder: 'Ingresa el nombre',
    DescriptionTitle: 'Descripción',
    DescriptionPlaceHolder: 'Describe tu grupo',
    InvitationsTitle: 'Invitaciones',
    AutomaticAprove: 'Acceso libre',
    GradientButton: 'Crear Grupo'
  };
  const [showModal, setShowModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [isFreeAccess, setIsFreeAccess] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [whatsappLink, setWhatsappLink] = useState('');
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



  const handleCreateGroup = async () => {
    if (!loading && name.trim() && description.trim()) {
      setLoading(true);
      try {
        const result = await createGroup({ 
          name: name, 
          description: description, 
          automaticAprove: isFreeAccess, 
          ids: selectedUsers,
          whatsappLink: whatsappLink
        }, logout);
        
        // Reset form
        setSelectedUsers([]);
        setSelectedPhotos([]);
        setIsFreeAccess(false);
        setName('');
        setDescription('');
        setWhatsappLink('');
        setError(false);
        setErrorMessage('');
        
        // Close modals
        setShowModal(false);
        if (addUsersRef.current) {
          addUsersRef.current.resetState();
        }
        
        // Show success and close
        setWinKylets(result.kylets);
        onClose();
        
      } catch (error) {
        setError(true);
        setErrorMessage(error.message || 'Error al crear el grupo');
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
                  {/* Avatar Section */}
                  <View style={styles.avatarSection}>
                    <Text style={styles.sectionTitle}>Miembros del grupo</Text>
                    <View style={styles.avatarRow}>
                      {/* Primer usuario o "+" */}
                      <TouchableOpacity style={styles.plusCircle} onPress={() => setShowModal(true)}>
                        {selectedPhotos[0]?.avatar?.url ? (
                          <Image
                            source={{ uri: selectedPhotos[0].avatar.url }}
                            style={styles.avatarSmall}
                            resizeMode="cover"
                            onError={() => console.log('Error loading avatar')}
                          />
                        ) : (
                          <Ionicons name="add" size={20} color="#1D7CE4" />
                        )}
                      </TouchableOpacity>

                      <View style={styles.mainAvatarContainer}>
                        {avatar ? (
                          <Image 
                            source={{ uri: avatar }} 
                            style={styles.mainAvatar}
                            resizeMode="cover"
                            onError={() => console.log('Error loading main avatar')}
                          />
                        ) : (
                          <View style={[styles.mainAvatar, { backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' }]}>
                            <Ionicons name="person" size={24} color="#8E8E93" />
                          </View>
                        )}
                      </View>

                      {/* Segundo usuario o "+" */}
                      <TouchableOpacity style={styles.plusCircle} onPress={() => setShowModal(true)}>
                        {selectedPhotos[1]?.avatar?.url ? (
                          <Image
                            source={{ uri: selectedPhotos[1].avatar.url }}
                            style={styles.avatarSmall}
                            resizeMode="cover"
                            onError={() => console.log('Error loading avatar')}
                          />
                        ) : (
                          <Ionicons name="add" size={20} color="#1D7CE4" />
                        )}
                      </TouchableOpacity>
                    </View>
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
                      />
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
                      />
                    </View>
                  </View>

                  {/* WhatsApp Section */}
                  <View style={styles.whatsappSection}>
                    <View style={styles.whatsappHeader}>
                      <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
                      <Text style={styles.whatsappTitle}>WhatsApp del grupo</Text>
                    </View>
                    
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Enlace de WhatsApp (opcional)</Text>
                      <TextInput
                        placeholder="https://chat.whatsapp.com/..."
                        style={styles.input}
                        value={whatsappLink}
                        onChangeText={setWhatsappLink}
                        placeholderTextColor="#8E8E93"
                        autoCapitalize="none"
                        keyboardType="url"
                      />
                    </View>
                  </View>

                  {/* Invitations Section */}
                  <View style={styles.invitationsSection}>
                    <Text style={styles.sectionTitle}>{screenTexts.InvitationsTitle}</Text>
                    <TouchableOpacity style={styles.inviteButton} onPress={() => setShowModal(true)}>
                      <View style={styles.inviteContent}>
                        <View style={styles.friendIcons}>
                          {selectedPhotos.length > 0 ? (
                            <>
                              {selectedPhotos.slice(0, 3).map((user, index) => (
                                <Image
                                  key={user._id || index}
                                  source={{ uri: user.avatar?.url }}
                                  style={styles.friendAvatar}
                                  resizeMode="cover"
                                  onError={() => console.log('Error loading friend avatar')}
                                />
                              ))}
                              {selectedPhotos.length > 3 && (
                                <View style={styles.moreIndicator}>
                                  <Text style={styles.moreText}>+{selectedPhotos.length - 3}</Text>
                                </View>
                              )}
                            </>
                          ) : (
                            <View style={styles.emptyInviteState}>
                              <Ionicons name="person-add-outline" size={20} color="#8E8E93" />
                              <Text style={styles.emptyInviteText}>Agregar amigos</Text>
                            </View>
                          )}
                        </View>
                        <Ionicons name="chevron-forward" size={16} color="#8E8E93" />
                      </View>
                    </TouchableOpacity>
                  </View>

                  {/* Settings Section */}
                  <View style={styles.settingsSection}>
                    <Text style={styles.sectionTitle}>Configuración del grupo</Text>
                    <View style={styles.settingRow}>
                      <View style={styles.settingInfo}>
                        <Text style={styles.settingTitle}>{screenTexts.AutomaticAprove}</Text>
                        <Text style={styles.settingSubtitle}>
                          {isFreeAccess ? 'Los miembros se unen automáticamente' : 'Requiere aprobación para unirse'}
                        </Text>
                      </View>
                      <ToggleSwitch
                        isOn={isFreeAccess}
                        onColor="#1D7CE4"
                        offColor="#E5E7EB"
                        size="medium"
                        trackOnStyle={{ borderRadius: 12 }}
                        trackOffStyle={{ borderRadius: 12 }}
                        onToggle={() => setIsFreeAccess(!isFreeAccess)}
                      />
                    </View>
                  </View>
                </View>
                </ScrollView>

                {/* Footer */}
                <View style={styles.footer}>
                  {error && (
                    <View style={styles.errorContainer}>
                      <Text style={styles.errorText}>{errorMessage}</Text>
                    </View>
                  )}
                  <GradientButton 
                    color="Blue" 
                    text={screenTexts.GradientButton}  
                    onPress={handleCreateGroup}
                    disabled={loading || !name.trim() || !description.trim()}
                  />
                </View>
              </KeyboardAvoidingView>
            </SafeAreaView>
          </Animated.View>
      </Animated.View>
      
      <AddUsers 
        ref={addUsersRef}
        visible={showModal} 
        onClose={() => setShowModal(false)} 
        setSelectedUsersFather={setSelectedUsers}
        setSelectedPhotos={setSelectedPhotos}
      />
    </Modal>
  );
};

export default AddGroup;

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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  
  // Modal Container
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: screenHeight * 0.9,
    minHeight: screenHeight * 0.6,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  
  // Handle Bar
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handleBar: {
    width: 36,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D1D1F',
    letterSpacing: -0.4,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Scroll Container
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  
  // Content
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  
  // Avatar Section
  avatarSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 16,
    letterSpacing: -0.2,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  mainAvatarContainer: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  mainAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  plusCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F8F9FA',
    borderWidth: 2,
    borderColor: '#E9ECEF',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarSmall: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  
  // Input Section
  inputSection: {
    marginBottom: 8,
  },
  whatsappSection: {
    marginBottom: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E7',
  },
  whatsappHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  whatsappTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginLeft: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 8,
    letterSpacing: -0.1,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1D1D1F',
    backgroundColor: '#FFFFFF',
    fontWeight: '500',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  
  // Invitations Section
  invitationsSection: {
    marginBottom: 16,
  },
  inviteButton: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E9ECEF',
    padding: 16,
  },
  inviteContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  friendIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: -8,
  },
  friendAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  moreIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E9ECEF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  moreText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6C757D',
  },
  emptyInviteState: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emptyInviteText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
  },
  
  // Settings Section
  settingsSection: {
    marginBottom: 24,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 2,
    letterSpacing: -0.1,
  },
  settingSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8E8E93',
    letterSpacing: -0.1,
  },
  
  // Footer
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#DC2626',
    textAlign: 'center',
  },
});
