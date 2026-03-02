import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from "../../../../context/useUser";
import GradientButton from '../../../Utils/GradientButton';

const { width } = Dimensions.get('window');

function OptionsModal({ isOpen, onClose, options, editFunc, createFunc, deleteFunc, colaborators, colaboratorsFunc }) {
    const { texts }=useUser()
    const screenTexts = texts.components.Wallet.Experiences.Modals.OpcionsModal
    const [NumOptions, setNumOptions] = useState(options);
    
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
              {/* Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{screenTexts.Title}</Text>
              </View>
              
              {/* Options Container */}
              <View style={styles.optionsContainer}>
                {NumOptions != 1 && (
                  <TouchableOpacity style={styles.optionButton} onPress={editFunc}>
                    <View style={styles.optionContent}>
                      <Text style={styles.optionText}>{screenTexts.Edit}</Text>
                    </View>
                    <Text style={styles.chevron}>›</Text>
                  </TouchableOpacity>
                )}
                
                {colaborators && (
                  <TouchableOpacity style={styles.optionButton} onPress={() => colaboratorsFunc()}>
                    <View style={styles.optionContent}>
                      <Text style={styles.optionText}>{screenTexts.ColaboratorsButton}</Text>
                    </View>
                    <Text style={styles.chevron}>›</Text>
                  </TouchableOpacity>
                )}
                
                {NumOptions >= 3 && (
                  <TouchableOpacity style={styles.optionButton} onPress={createFunc}>
                    <View style={styles.optionContent}>
                      <Text style={styles.optionText}>{screenTexts.AddStep}</Text>
                    </View>
                    <Text style={styles.chevron}>›</Text>
                  </TouchableOpacity>
                )}
                
                {(NumOptions >= 2 || NumOptions === 1) && (
                  <TouchableOpacity style={[styles.optionButton, styles.deleteOption]} onPress={deleteFunc}>
                    <View style={styles.optionContent}>
                      <Text style={[styles.optionText, styles.deleteText]}>{screenTexts.Delete}</Text>
                    </View>
                    <Text style={styles.chevron}>›</Text>
                  </TouchableOpacity>
                )}
              </View>
              
              {/* Cancel Button */}
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelText}>{screenTexts.Cancel}</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: width - 40,
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    // Apple-style shadows
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
    overflow: 'hidden',
  },
  modalHeader: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1D1D1F',
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  optionsContainer: {
    paddingVertical: 8,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    // Subtle hover effect
    activeOpacity: 0.6,
  },
  deleteOption: {
    backgroundColor: '#FFF5F5',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionText: {
    fontSize: 17,
    fontWeight: '400',
    color: '#1D1D1F',
    letterSpacing: -0.2,
  },
  deleteText: {
    color: '#FF3B30',
    fontWeight: '500',
  },
  chevron: {
    fontSize: 18,
    color: '#C7C7CC',
    fontWeight: '300',
  },
  cancelButton: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1D7CE4',
    letterSpacing: -0.2,
  },
});

export default OptionsModal;
