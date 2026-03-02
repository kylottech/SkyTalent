import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import { useUser } from '../../context/useUser';

const QRCode = ({ benefitId = 'RM001' }) => {
  const { texts } = useUser();
  const [showQRModal, setShowQRModal] = useState(false);

  return (
    <>
      <TouchableOpacity 
        style={styles.qrButton} 
        onPress={() => setShowQRModal(true)}
        activeOpacity={0.7}
      >
        <View style={styles.qrIconContainer}>
          <Image 
            source={require('../../../assets/Phone.png')} 
            style={styles.qrIcon}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.qrText}>Código QR</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showQRModal}
        onRequestClose={() => setShowQRModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tu código QR</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowQRModal(false)}
              >
                <Image 
                  source={require('../../../assets/icon_x.png')} 
                  style={styles.closeIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            
            <View style={styles.qrContainer}>
              <View style={styles.qrPlaceholder}>
                <Image 
                  source={require('../../../assets/Phone.png')} 
                  style={styles.qrPlaceholderIcon}
                  resizeMode="contain"
                />
                <Text style={styles.qrPlaceholderText}>QR Code</Text>
                <Text style={styles.qrCodeText}>{benefitId}</Text>
              </View>
            </View>
            
            <Text style={styles.modalSubtitle}>
              Muestra este código en la entrada del estadio
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  qrIconContainer: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  qrIcon: {
    width: 24,
    height: 24,
    tintColor: '#1D7CE4',
  },
  qrText: {
    fontSize: 14,
    color: '#1D7CE4',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    width: 16,
    height: 16,
    tintColor: '#6B7280',
  },
  qrContainer: {
    marginBottom: 24,
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrPlaceholderIcon: {
    width: 48,
    height: 48,
    tintColor: '#9CA3AF',
    marginBottom: 8,
  },
  qrPlaceholderText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  qrCodeText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default QRCode;
