import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SimpleCreateCollectionModal = ({ visible, onClose, onCreateCollection }) => {
  console.log('SimpleCreateCollectionModal - visible:', visible);
  
  const handleCreate = () => {
    console.log('Simple modal - Creating collection');
    onCreateCollection({ name: 'Test Collection', description: 'Test' });
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
            <View style={styles.header}>
              <Text style={styles.title}>Nueva Colección</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#8E8E93" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.content}>
              <Text style={styles.contentText}>
                ¿Deseas crear una nueva colección?
              </Text>
            </View>
            
            <View style={styles.buttons}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
                <Text style={styles.createButtonText}>Crear</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  contentText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
  },
  createButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default SimpleCreateCollectionModal;
