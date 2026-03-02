import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback, TextInput, Dimensions } from 'react-native';
import GradientButton from '../../../Utils/GradientButton';
import { useUser } from "../../../../context/useUser";
import { createDay } from "../../../../services/experienceServices"

const { width } = Dimensions.get('window');

function AddDayModal({ isOpen, onClose, _id, days, setDays, loading, setLoading }) {
  const { texts, logout } = useUser();
  const screenTexts = texts.components.Wallet.Experiences.Modals.AddDayModal;

  const [dateStr, setDateStr] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Acepta D/M/AAAA y DD/MM/AAAA
  const isValidDate = useMemo(() => {
    const re = /^([0]?[1-9]|[12]\d|3[01])\/([0]?[1-9]|1[0-2])\/\d{4}$/;
    if (!re.test(dateStr)) return false;

    const [d, m, y] = dateStr.split('/').map(Number);
    const date = new Date(y, m - 1, d);
    return (
      date.getFullYear() === y &&
      date.getMonth() === m - 1 &&
      date.getDate() === d
    );
  }, [dateStr]);

  const parseSpecificDate = () => {
    const [d, m, y] = dateStr.split('/').map(Number);
    return new Date(y, m - 1, d);
  };

  const sortByDateAsc = (arr) =>
  [...arr].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // mode: 'next' | 'specific'
  const handleCreateDay = async (mode) => {
    if (loading) return;

    setLoading(true);
    setError(false);
    setErrorMessage('');

    try {
      let newDate;

      if (mode === 'specific') {
        if (!isValidDate) {
          throw new Error(screenTexts.FormatError);
        }
        newDate = parseSpecificDate();
      } else if (mode === 'next') {
        if (Array.isArray(days) && days.length > 0) {
          const lastDay = days[days.length - 1];
          const parsedDate = new Date(lastDay.date);
          parsedDate.setDate(parsedDate.getDate() + 1);
          newDate = parsedDate;
        } else {
          newDate = new Date();
        }
      } else {
        throw new Error('Acción no reconocida.');
      }

      const data = { _id, date: newDate };
      const response = await createDay(data, logout);

      // Añade el nuevo día a la lista
      setDays(prev => sortByDateAsc([...prev, response]));
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
      console.error(error);
    } finally {
      setLoading(false);
      onClose();
    }
  };

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
                <Text style={styles.modalSubtitle}>Añade una nueva fecha a tu experiencia</Text>
              </View>

              {/* Content */}
              <View style={styles.content}>
                {/* Quick Action Button */}
                <TouchableOpacity 
                  style={styles.quickActionButton} 
                  onPress={() => handleCreateDay('next')}
                  activeOpacity={0.8}
                >
                  <View style={styles.quickActionContent}>
                    <View style={styles.quickActionIcon}>
                      <Text style={styles.iconText}>📅</Text>
                    </View>
                    <View style={styles.quickActionText}>
                      <Text style={styles.quickActionTitle}>{screenTexts.NextDayButton}</Text>
                      <Text style={styles.quickActionSubtitle}>Añadir día siguiente automáticamente</Text>
                    </View>
                  </View>
                  <Text style={styles.chevron}>›</Text>
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>o</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Custom Date Input */}
                <View style={styles.inputSection}>
                  <Text style={styles.inputLabel}>Fecha específica</Text>
                  <TextInput
                    style={[
                      styles.input,
                      dateStr.length > 0 && (isValidDate ? styles.inputValid : styles.inputInvalid),
                    ]}
                    placeholder={screenTexts.DayPlaceHolder}
                    placeholderTextColor="#8E8E93"
                    value={dateStr}
                    onChangeText={setDateStr}
                    maxLength={10}
                    returnKeyType="done"
                  />
                  <Text style={styles.inputHint}>Formato: DD/MM/AAAA</Text>
                </View>

                {/* Custom Date Button */}
                {isValidDate && (
                  <TouchableOpacity 
                    style={styles.customDateButton}
                    onPress={() => handleCreateDay('specific')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.customDateButtonText}>{screenTexts.SaveButton}</Text>
                  </TouchableOpacity>
                )}

                {/* Error Message */}
                {!!error && (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{errorMessage}</Text>
                  </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: width - 40,
    maxWidth: 360,
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
    fontSize: 22,
    fontWeight: '600',
    color: '#1D1D1F',
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: -0.4,
  },
  modalSubtitle: {
    fontSize: 15,
    color: '#8E8E93',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1D7CE4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 18,
  },
  quickActionText: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  quickActionSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    letterSpacing: -0.1,
  },
  chevron: {
    fontSize: 18,
    color: '#C7C7CC',
    fontWeight: '300',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: 14,
    color: '#8E8E93',
    marginHorizontal: 16,
    fontWeight: '500',
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#1D1D1F',
    letterSpacing: -0.2,
  },
  inputValid: {
    borderColor: '#34C759',
    backgroundColor: '#F0F9F4',
  },
  inputInvalid: {
    borderColor: '#FF3B30',
    backgroundColor: '#FFF5F5',
  },
  inputHint: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 6,
    letterSpacing: -0.1,
  },
  customDateButton: {
    backgroundColor: '#1D7CE4',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  customDateButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  errorContainer: {
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE5E5',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    textAlign: 'center',
    letterSpacing: -0.1,
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

export default AddDayModal;
