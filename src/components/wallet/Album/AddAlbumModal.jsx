import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, TextInput, ScrollView, Image, StyleSheet,
  Modal, KeyboardAvoidingView, Platform
} from 'react-native';
import { useUser } from "../../../context/useUser";
import { SafeAreaView } from 'react-native-safe-area-context';
import { create } from '../../../services/albumServices'
import GradientButton from '../../Utils/GradientButton';
import LoadingOverlay from '../../Utils/LoadingOverlay';
import InfoModal from '../../Utils/InfoModal';
import Error from '../../Utils/Error';
import x from '../../../../assets/x.png';
import info from '../../../../assets/info.png';
import ToggleSwitch from 'toggle-switch-react-native';

function AddAlbumModal({ isOpen, onClose, setConfirmacion, setConfirmacionMensaje, setWinKylets }) {
    const { texts, logout } = useUser();
    const screenTexts = texts.components.Wallet.Album.AddAlbumModal;

    const [loading, setLoading] = useState(false);
    const [albumName, setAlbumName] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [visibleModal, setVisibleModal] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('Errorrr');

    const handleCreate = async () => {
        try {
            setLoading(true)
            create({name: albumName, description: description, isPublic: isPublic}, logout)
            .then((res) => {
                setAlbumName('')
                setDescription('')
                setIsPublic(false)
                setLoading(false)
                setConfirmacion(true)
                setConfirmacionMensaje(screenTexts.CreateConfirmation)
                setWinKylets(res.kylets)
                onClose()
            })
            .catch((error) => {
                setError(true);
                setErrorMessage(error.message);
                setLoading(false)
            });
        } catch (error) {
            setError(true);
            setErrorMessage(error.message);
            setLoading(false)
        }
    };

    const handleSubmit = () => {
        if (!albumName.trim() || !description.trim()) {
            setError(true);
            setErrorMessage(screenTexts.CreateError);
            return;
        }

        handleCreate();
    };

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{screenTexts.Top}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Image source={x} style={styles.x} />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView style={styles.content} contentContainerStyle={styles.scrollInner}>
              {/* Título y subtítulo */}
              <Text style={styles.title}>{screenTexts.Title}</Text>
              <Text style={styles.text}>{screenTexts.Subtititle}</Text>

              {/* Nombre */}
              <View style={styles.field}>
                <Text style={styles.label}>{screenTexts.NameTitle}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={screenTexts.NamePlaceHolder}
                  value={albumName}
                  onChangeText={setAlbumName}
                />
              </View>

              {/* Descripción */}
              <View style={styles.field}>
                <Text style={styles.label}>{screenTexts.DescriptionTitle}</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder={screenTexts.DescriptionPlaceHolder}
                  multiline
                  numberOfLines={4}
                  value={description}
                  onChangeText={setDescription}
                />
              </View>

              {/* Toggle: ¿Es público? */}
              <View style={styles.fieldRow}>
                <Text style={styles.label}>{screenTexts.Public}</Text>
                <View style={styles.switchContainer}>
                  <ToggleSwitch
                    isOn={isPublic}
                    onColor="#1D7CE4"
                    offColor="#D9D9D9"
                    size="medium"
                    trackOnStyle={{ borderRadius: 10 }}
                    trackOffStyle={{ borderRadius: 10 }}
                    onToggle={() => setIsPublic(!isPublic)}
                  />
                  <TouchableOpacity onPress={() => setVisibleModal(!visibleModal)}>
                    <Image source={info} style={styles.icon2} />
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
              <TouchableOpacity onPress={onClose} style={styles.backButton}>
                <Text style={styles.backButtonText}>{screenTexts.Back}</Text>
              </TouchableOpacity>

              <View style={styles.nextButton}>
                <GradientButton
                  color="Blue"
                  text={screenTexts.GradientButton1}
                  onPress={() => {
                    handleSubmit()
                  }}
                />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {error &&

        <Error message={errorMessage} func={setError} />

      }

      <InfoModal 
        isOpen={visibleModal} 
        onClose={ () => setVisibleModal(false)} 
        Title={screenTexts.InfoModalTitle} 
        Subtitle= {screenTexts.InfoModalSubtitle} 
        Button={screenTexts.InfoModalButton} 
      />

      {loading && <LoadingOverlay />}
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    paddingTop: 40,
    width: '100%',
  },
  keyboardAvoidingView: {
    flex: 1,
    width: '100%',
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: 'rgba(249, 250, 251, 0.5)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    padding: 8,
  },
  x: {
    width: 15,
    height: 15,
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollInner: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  field: {
    marginBottom: 20,
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#111827',
    marginTop: 10
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon2: {
    width: 20,
    height: 20,
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#6B7280',
    fontWeight: '500',
  },
  nextButton: {
    width: '50%',
  },
});

export default AddAlbumModal;
