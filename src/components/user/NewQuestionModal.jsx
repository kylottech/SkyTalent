import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableWithoutFeedback, TouchableOpacity, Image } from 'react-native';
import { useUser } from '../../context/useUser';
import corona from '../../../assets/CORONA_DORADA.png';  

function NewQuestionModal({ isOpen, onClose, response }) {
    const { texts } = useUser()
    const screenTexts = texts.components.user.NewQuestionModal
    
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
                <View style={styles.modalIconContainer}>
                    <Image source={corona} style={styles.icon} />
                </View>
                <Text style={styles.modalTitle}>{screenTexts.Title}</Text>
                <Text style={styles.modalMessage}>
                {screenTexts.Subtitle}
                </Text>
                <TouchableOpacity 
                style={styles.modalButton}
                onPress={response}>
                <Text style={styles.modalButtonText}>{screenTexts.Button}</Text>
                <View style={styles.modalButtonHighlight} />
                </TouchableOpacity>
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
    backgroundColor: 'rgba(0,0,0,0.5)', // Fondo oscuro semitransparente
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E3D9C4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    color: '#000',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  modalMessage: {
    fontSize: 16,
    color: 'rgba(0,0,0,0.6)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  modalButton: {
    backgroundColor: '#000',
    borderRadius: 25,
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
    zIndex: 2,
  },
  modalButtonHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
});

export default NewQuestionModal;
