import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';
import { useUser } from "../../../context/useUser";
import GradientButton from '../../Utils/GradientButton';

function EditMilestoneModal({ isOpen, onClose, editFunc, createFunc, deletePhoto, deleteFunc, infoClean }) {
    const { texts }=useUser()
    const screenTexts = texts.components.Wallet.Album.EditMilestoneModal
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
              <Text style={styles.modalTitle}>{screenTexts.Title}</Text>
              
                <GradientButton 
                    color='Blue' 
                    text={screenTexts.EditButton}  
                    onPress={editFunc}
                />

                <GradientButton 
                    color='Blue' 
                    text={screenTexts.EditPhotoButton}  
                    onPress={createFunc}
                />

                <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={deletePhoto}>
                    <Text style={styles.buttonText}>{screenTexts.DeletePhotoButton} </Text>
                </TouchableOpacity>
              
                <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={deleteFunc}>
                    <Text style={styles.buttonText}>{screenTexts.DeleteButton} </Text>
                </TouchableOpacity>
              <TouchableOpacity onPress={() => {onClose(), infoClean()}}>
                <Text style={styles.cancelText}>{screenTexts.CancelButton} </Text>
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
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  gradientButton: {
    width: '100%',
    borderRadius: 8,
  },
  button: {
    width: '100%',
    padding: 12,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    borderRadius: 8,
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelText: {
    marginTop: 15,
    color: '#007bff',
    fontSize: 16,
  },
});

export default EditMilestoneModal;
