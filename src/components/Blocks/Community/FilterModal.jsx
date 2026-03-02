import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native';
import { useUser } from "../../../context/useUser";

function FilterModal({ isOpen, onClose, val1, val2, val3, func1, func2, func3 }) {
    const { texts }=useUser()
    const screenTexts = texts.components.Blocks.Community.FilterModal
    const [trucos, setTrucos] = useState(val1);
    const [consejos, setConsejos] = useState(val2);
    const [contactos, setContactos] = useState(val3);

    useEffect(() => {
        func1(trucos)
    },[trucos]);

    useEffect(() => {
        func2(consejos)
    },[consejos]);

    useEffect(() => {
        func3(contactos)
    },[contactos]);

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
              
              <View style={styles.notificationItem}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={styles.notificationText}>{screenTexts.Tricks}</Text>
            
                    <ToggleSwitch
                      isOn={trucos}
                      onColor="#1D7CE4"
                      offColor="#D9D9D9"
                      size="medium"
                      trackOnStyle={{ borderRadius: 10 }}
                      trackOffStyle={{ borderRadius: 10 }}
                      onToggle={() => {
                        if (trucos && !consejos && !contactos) return;
                        setTrucos(!trucos);
                      }}
                    />
                </View>
              </View>

              <View style={styles.notificationItem}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={styles.notificationText}>{screenTexts.Advice}</Text>
            
                    <ToggleSwitch
                      isOn={consejos}
                      onColor="#1D7CE4"
                      offColor="#D9D9D9"
                      size="medium"
                      trackOnStyle={{ borderRadius: 10 }}
                      trackOffStyle={{ borderRadius: 10 }}
                      onToggle={() => {
                        if (!trucos && consejos && !contactos) return;
                        setConsejos(!consejos);
                      }}
                    />
                </View>
              </View>

              <View style={styles.notificationItem}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={styles.notificationText}>{screenTexts.Contacts}</Text>
            
                    <ToggleSwitch
                      isOn={contactos}
                      onColor="#1D7CE4"
                      offColor="#D9D9D9"
                      size="medium"
                      trackOnStyle={{ borderRadius: 10 }}
                      trackOffStyle={{ borderRadius: 10 }}
                      onToggle={() => {
                        if (!trucos && !consejos && contactos) return;
                        setContactos(!contactos);
                      }}
                    />
                </View>
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
    marginBottom: 30,
  },
  notificationItem: {
    flexDirection: 'column',
    marginBottom:20,
    width: '100%'
  },
  notificationText: {
    fontSize: 16,
    color: '#333',
  },
});

export default FilterModal;
