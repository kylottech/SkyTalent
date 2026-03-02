import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

function DeleteConfirmationModal({ isOpen, onClose, onConfirm, experienceName }) {
  return (
    <Modal
      visible={isOpen}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              {/* Warning Icon */}
              <View style={styles.iconContainer}>
                <Text style={styles.warningIcon}>⚠️</Text>
              </View>
              
              {/* Title */}
              <Text style={styles.title}>¿Eliminar experiencia?</Text>
              
              {/* Message */}
              <Text style={styles.message}>
                Esta acción no se puede deshacer. La experiencia "{experienceName}" será eliminada permanentemente.
              </Text>
              
              {/* Buttons */}
              <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.deleteButton} onPress={onConfirm}>
                  <Text style={styles.deleteText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: width - 40,
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
    // Apple-style shadows
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  warningIcon: {
    fontSize: 28,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1D1D1F',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.4,
  },
  message: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    letterSpacing: -0.2,
    paddingHorizontal: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1D1D1F',
    letterSpacing: -0.2,
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
});

export default DeleteConfirmationModal;
