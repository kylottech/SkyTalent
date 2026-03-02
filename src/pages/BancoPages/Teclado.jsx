import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Image, TextInput, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import { useUser } from "../../context/useUser";

import { searcherTlf, getAvailable, send } from '../../services/bankServices';

import Top from '../../components/Utils/Top';
import HorizontalSlider from '../../components/Utils/HorizontalSlider';
import LoadingOverlay from '../../components/Utils/LoadingOverlay';
import Error from '../../components/Utils/Error';

import corona from '../../../assets/CORONA_DORADA.png';
import defaultAvatar from '../../../assets/iconPerson.png';

// Componente AmountSelector integrado
const AmountSelector = ({ amount, setAmount, label = "Cantidad a enviar", maxAmount = null, disabled = false, available = 0 }) => {
  const handleIncrement = () => {
    if (!disabled) {
      if (maxAmount === null || amount + 1 <= maxAmount) {
        setAmount(amount + 1);
      }
    }
  };

  const handleDecrement = () => {
    if (!disabled && amount > 0) {
      setAmount(amount - 1);
    }
  };

  const handleTextChange = (text) => {
    if (!disabled) {
      const numericValue = Number(text);
      if (!isNaN(numericValue) && numericValue >= 0) {
        if (maxAmount === null || numericValue <= maxAmount) {
          setAmount(numericValue);
        }
      }
    }
  };

  return (
    <View style={amountSelectorStyles.container}>
      <Text style={amountSelectorStyles.label}>{label}</Text>
      
      <View style={amountSelectorStyles.amountCard}>
        <View style={amountSelectorStyles.controlsRow}>
          <TouchableOpacity 
            style={[amountSelectorStyles.amountButton, disabled && amountSelectorStyles.disabledButton]} 
            onPress={handleDecrement}
            disabled={disabled || amount <= 0}
          >
            <Text style={[amountSelectorStyles.amountText, disabled && amountSelectorStyles.disabledText]}>−</Text>
          </TouchableOpacity>

          <View style={amountSelectorStyles.centerSection}>
            <Image
              source={corona}
              style={amountSelectorStyles.coronaIcon}
            />
            <TextInput 
              style={[amountSelectorStyles.amountInput, disabled && amountSelectorStyles.disabledText]} 
              value={String(amount)} 
              keyboardType="numeric"
              onChangeText={handleTextChange} 
              placeholder="0"
              placeholderTextColor="#9ca3af"
              editable={!disabled}
            />
          </View>

          <TouchableOpacity 
            style={[amountSelectorStyles.amountButton, disabled && amountSelectorStyles.disabledButton]} 
            onPress={handleIncrement}
            disabled={disabled || (maxAmount !== null && amount >= maxAmount)}
          >
            <Text style={[amountSelectorStyles.amountText, disabled && amountSelectorStyles.disabledText]}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Kylets disponibles integrado */}
      <View style={amountSelectorStyles.availableSection}>
        <Text style={amountSelectorStyles.availableLabel}>Kylets disponibles</Text>
        <View style={amountSelectorStyles.availableAmount}>
          <Image source={corona} style={amountSelectorStyles.availableIcon} />
          <Text style={amountSelectorStyles.availableText}>{available.toLocaleString()}</Text>
        </View>
      </View>
    </View>
  );
};

const Teclado = ({route}) => {
  const navigate=useNavigation()
  const { isLogged, isLoading, logout, texts } = useUser();
  const screenTexts = texts.pages.BancoPages.Teclado

  const { profile = false } = route.params || {}; 
  const { tlfBuscador = '' } = route.params || {};
  const { _idBuscador = '' } = route.params || {};
  const { nameBuscador = '' } = route.params || {};
  const { imageBuscador = '' } = route.params || {};
  
  const [tlf, setTfl] = useState(tlfBuscador || '+1234567890');
  const [_id, set_id] = useState(_idBuscador || '123');
  const [name, setName] = useState(nameBuscador || 'Pablo Izquierdo');
  const [showProfile, setShowProfile] = useState(profile || false);
  const [phoneEntered, setPhoneEntered] = useState(false);
  const [image, setImage] = useState(imageBuscador || null);
  const [amount, setAmount] = useState(0);
  const [available, setAvailable] = useState(1250); 

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');

  const tlfRef = useRef(tlf) 
  const amountRef = useRef(amount)
  const idRef = useRef(_id)
  const nameRef = useRef(name)
  const availableRef = useRef(available)


  useEffect(() => {
    if (!isLoading && !isLogged) {
      navigate.navigate("Login");
    }
  }, [isLogged, isLoading]);

  useEffect(() => {
    console.log('Teclado - imageBuscador:', imageBuscador);
    console.log('Teclado - nameBuscador:', nameBuscador);
    console.log('Teclado - _idBuscador:', _idBuscador);
    console.log('Teclado - profile:', profile);
    if (imageBuscador) {
      setImage(imageBuscador);
    }
    if (profile) {
      setShowProfile(true);
    }
  }, [imageBuscador, profile]);

  useEffect(() => {
    handleAvailable()
  }, []);
  
  useEffect(() => {
    tlfRef.current =  tlf ;
  }, [tlf]);

  useEffect(() => {
    amountRef.current =  amount ;
  }, [amount]);

  useEffect(() => {
    idRef.current =  _id ;
  }, [_id]);

  useEffect(() => {
    nameRef.current =  name ;
  }, [name]);

  useEffect(() => {
    availableRef.current =  available ;
  }, [available]);


  const handleSend = async () => {
    try {
      if(!loading && amount > 0 && _id){
        const amount = amountRef.current
        const _id = idRef.current
        const name = nameRef.current
        const available = availableRef.current 
        
        if(amount > available) {
          setError(true);
          setErrorMessage('No tienes suficientes Kylets disponibles');
          return;
        }
        
        setLoading(true)
        send(amount, _id, logout)
          .then((response) => {
            setLoading(false)
            navigate.navigate('Confirmacion', { 
              name: name, 
              amount: amount, 
              available: available - amount,
              avatar: response.avatar,
              date: response.date,
              kylotId: response.kylotId
            });
          })
          .catch((error) => {
            setLoading(false)
            setError(true);
            setErrorMessage(error.message);
          });
      }
      
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
    }
  };
  
  const handleAvailable = async () => {
    try {
      getAvailable(logout)
        .then((response) => {
          setAvailable(response.kylets)
        })
        .catch((error) => {
          setError(true);
          setErrorMessage(error.message);
        });
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
    }
  };
  
  const handleSearcherTlf = async () => {
    try {
      if(!loading){
        const tlf = tlfRef.current
        console.log(tlf)
        setLoading(true)
        searcherTlf({search: tlf}, logout)
        .then((response) => {
          console.log(response)
          setName(response.name + ' ' + response.surname)
          setImage(response.avatar.url)
          set_id(response._id)
          setShowProfile(true)
          setLoading(false)
        })
        .catch((error) => {
          setLoading(false)
          setError(true);
          setErrorMessage(error.message);
        });
      }
      
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
    }
  };


  const handleBotton = (number) => {
    if (!showProfile && !phoneEntered) {
      setTfl(tlf + number);
    } else {
      const newAmount = parseInt(`${amount}${number}`);
      setAmount(newAmount || 0); 
    }
  };

  const removeLastCharacter = () => {
    if (!showProfile && !phoneEntered) {
      setTfl(tlf.slice(0, -1));
    } else {
      const newAmount = String(amount).slice(0, -1);
      setAmount(Number(newAmount) || 0); 
    }
  };

  const toggleProfileView = () => {
    if (!profile) {
      // Si viene de ruta de teléfono, primero buscar el número
      handleSearcherTlf()
    } else {
      // Si viene de amigos, mostrar directamente el perfil
      setShowProfile(true);
    }
  };

  const handlePhoneSearch = () => {
    setPhoneEntered(true);
    handleSearcherTlf();
  };


  return (
    <View style={styles.container}>
      <Top 
        left={true} leftType={'Back'} 
        typeCenter={'Text'} textCenter="Kylot Bank"
      />

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Kylot Bank</Text>
          <Text style={styles.headerSubtitle}>Comparte la magia con tus amigos</Text>
        </View>

        {/* User Info Section */}
        {showProfile && (
          <View style={styles.userInfoSection}>
            <Image
              source={image ? { uri: image} : defaultAvatar}
              style={styles.userAvatar}
              resizeMode="cover"
            />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{name}</Text>
              <Text style={styles.userLabel}>Destinatario</Text>
            </View>
          </View>
        )}

        {/* Phone Input Section */}
        {!showProfile && !phoneEntered && (
          <View style={styles.phoneInputSection}>
            <View style={styles.inputCard}>
              <Text style={styles.inputLabel}>Número de teléfono</Text>
              <View style={styles.phoneDisplay}>
                <Text style={styles.phoneNumber}>{tlf || 'Ingresa el número'}</Text>
              </View>
            </View>
            <View style={styles.searchButtonContainer}>
              <HorizontalSlider 
                text={screenTexts.HorizontalSlider1}
                color={'Gold'} 
                onPress={() => handlePhoneSearch()} 
              />
            </View>
          </View>
        )}

        </ScrollView>

        {/* Keyboard - Only show when profile is available or phone has been entered */}
        {(showProfile || phoneEntered) && (
          <View style={styles.keyboardContainer}>
            <View style={styles.keyboard}>
              {/* Amount Display Section */}
              <View style={styles.amountDisplaySection}>
                <Text style={styles.amountLabel}>CANTIDAD A ENVIAR</Text>
                <View style={styles.amountDisplay}>
                  <Image source={corona} style={styles.amountIcon} />
                  <Text style={styles.amountValue}>{amount || '0'}</Text>
                </View>
              </View>

              {/* Available Kylets Section */}
              <View style={styles.availableSection}>
                <Text style={styles.availableLabel}>Kylets disponibles</Text>
                <View style={styles.availableDisplay}>
                  <Image source={corona} style={styles.availableIcon} />
                  <Text style={styles.availableValue}>{available.toLocaleString()}</Text>
                </View>
              </View>

              {/* Send Button */}
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  amount > 0 ? styles.sendButtonActive : styles.sendButtonDisabled
                ]}
                onPress={amount > 0 ? handleSend : () => {}}
                disabled={amount <= 0 || loading}
                activeOpacity={0.8}
              >
                <View style={styles.sendButtonContent}>
                  <Image source={corona} style={styles.sendButtonIcon} />
                  <Text style={[
                    styles.sendButtonText,
                    amount > 0 ? styles.sendButtonTextActive : styles.sendButtonTextDisabled
                  ]}>
                    {amount > 0 ? `Enviar ${amount} Kylets` : "Selecciona cantidad"}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Numeric Keypad */}
              <View style={styles.keypadSection}>
                {[ [1,2,3], [4,5,6], [7,8,9], ['.',0,'⌫'] ].map((row, idx) => (
                  <View key={idx} style={styles.keyboardRow}>
                    {row.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.keyButton,
                          item === '⌫' && styles.backspaceButton
                        ]}
                        onPress={() =>
                          item === '⌫'
                            ? removeLastCharacter()
                            : handleBotton(item)
                        }
                        activeOpacity={0.7}
                      >
                        <Text style={[
                          styles.keyText,
                          item === '⌫' && styles.backspaceText
                        ]}>
                          {item}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
        {error && <Error message={errorMessage} func={setError} />}

        {loading && (
          <LoadingOverlay/>
        )}
      </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  
  // Header Section
  headerSection: {
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'left',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666666',
    textAlign: 'left',
    lineHeight: 20,
  },
  
  // Phone Input Section
  phoneInputSection: {
    marginBottom: 40,
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#999999',
    marginBottom: 16,
    textAlign: 'center',
  },
  phoneDisplay: {
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  phoneNumber: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  searchButtonContainer: {
    alignItems: 'center',
  },

  // User Info Section
  userInfoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  userLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: '#999999',
  },

  // Profile Section
  profileView: {
    marginBottom: 40,
  },
  recipientCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  recipientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipientAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 20,
  },
  recipientDetails: {
    flex: 1,
  },
  recipientName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  recipientLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: '#999999',
  },
  profileBorder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
    marginBottom: 8,
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 2,
  },
  profilePhone: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },

  // Amount Section
  amountSection: {
    width: '100%',
    marginBottom: 12,
  },

  // Available Section
  availableSection: {
    marginTop: 20,
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  availableCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  availableLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#999999',
    marginBottom: 12,
    textAlign: 'center',
  },
  availableAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  availableIcon: {
    width: 28,
    height: 28,
    marginRight: 12,
  },
  availableText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: -0.3,
  },

  // Send Button Section (inside keyboard)
  sendButton: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sendButtonActive: {
    backgroundColor: '#000000',
  },
  sendButtonDisabled: {
    backgroundColor: '#E8E8E8',
    shadowOpacity: 0,
    elevation: 0,
  },
  sendButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  sendButtonTextActive: {
    color: '#FFFFFF',
  },
  sendButtonTextDisabled: {
    color: '#999999',
  },

  // Balance Section
  balanceCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  balanceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  balanceAmount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceIcon: {
    width: 20,
    height: 20,
    marginRight: 6,
  },
  balanceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
  },
  sendButtonContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },

  // Keyboard Section
  keyboardContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
  },
  keyboard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },

  // Amount Display Section
  amountDisplaySection: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  amountLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#999999',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  amountDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  amountValue: {
    fontSize: 28,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: -0.5,
  },

  // Available Section (inside keyboard)
  availableSection: {
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  availableLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#999999',
    textAlign: 'center',
    marginBottom: 8,
  },
  availableDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  availableIcon: {
    width: 20,
    height: 20,
    marginRight: 6,
  },
  availableValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: -0.3,
  },

  // Keypad Section
  keypadSection: {
    marginTop: 8,
  },
  keyboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  keyButton: {
    width: 80,
    height: 64,
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  backspaceButton: {
    backgroundColor: '#FF3B30',
    borderColor: '#FF3B30',
  },
  keyText: {
    fontSize: 28,
    fontWeight: '500',
    color: '#000000',
  },
  backspaceText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

// Estilos para AmountSelector
const amountSelectorStyles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 32,
  },
  amountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#999999',
    textAlign: 'center',
    marginBottom: 20,
  },
  separatorLine: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginBottom: 16,
    marginHorizontal: 0,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  centerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  amountButton: {
    width: 48,
    height: 48,
    backgroundColor: '#000000',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#E8E8E8',
    shadowOpacity: 0,
    elevation: 0,
  },
  amountText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  disabledText: {
    color: '#999999',
  },
  coronaIcon: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  amountInput: {
    fontSize: 32,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    minWidth: 80,
    borderWidth: 0,
    backgroundColor: 'transparent',
    letterSpacing: -0.5,
  },
});

export default Teclado;