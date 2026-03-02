import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../context/useUser";
import { LinearGradient } from 'expo-linear-gradient';
import { getAvailable } from '../services/bankServices'
import { formatString } from '../utils/formatString'
import Top from '../components/Utils/Top';
import telefono from '../../assets/Phone.png';
import grupo from '../../assets/iconPerson2.png';
import corona from '../../assets/CORONA_DORADA.png';


const Banco = () => {
  const navigate=useNavigation()
  const { texts, logout }=useUser()
  const screenTexts = texts.pages.Banco
  const [available, setAvailable] = useState(0);

  useEffect(() => {
    handleAvailable()
  }, [])

  const handleAvailable = async () => {
    try {
      getAvailable(logout)
        .then((response) => {
          setAvailable(response.kylets)
        })
        .catch((error) => {
          // Handle error silently or provide user feedback
        });
    } catch (error) {
      // Handle error silently or provide user feedback
    }
  }

  return (
    <View style={styles.container}>
      <Top 
      left={true} leftType={'Back'}
        typeCenter={'Text'} textCenter={screenTexts.Top} 
        right={true} rightType={'Wallet'}
      />
      
      <ScrollView style={{paddingHorizontal: 17}}>
        {/* Información General */}
        <View style={styles.generalInfoSection}>
          <Text style={styles.title}>{screenTexts.GeneralInfoTitle}</Text>
          <Text style={styles.subtitle}>{screenTexts.GeneralInfoSubtitle}</Text>
        </View>

        {/* Espacio adicional */}
        <View style={styles.extraSpace} />

        {/* Kylets Centro mejorado */}
        <View style={styles.kyletsSection}>
          <Text style={styles.kyletsLabel}>KYLETS DISPONIBLES</Text>
          <View style={styles.kyletsContainer}>
            <Image source={corona} style={styles.kyletsIcon} resizeMode="contain"/>
            <Text style={styles.kyletsNumber}>{available.toLocaleString()}</Text>
          </View>
          </View>
            
        {/* Componente Transacciones */}
        <View style={styles.transactionSection}>
          <TouchableOpacity 
            style={styles.transactionCardNew}
            onPress={() => navigate.navigate('Transaction')}
            activeOpacity={0.8}
          >
            <View style={styles.transactionCardContent}>
              <View style={styles.transactionHeader}>
                <Text style={styles.transactionTitle}>TRANSACCIONES</Text>
                <Text style={styles.transactionSubtitle}>{screenTexts.ExtractsSubtitle}</Text>
              </View>
            </View>
        </TouchableOpacity>
        </View>

        {/* Enviar Kylets */}
        <View style={styles.sendSection}>
          <Text style={styles.title}>{screenTexts.Title}</Text>
          <Text style={styles.subtitle}>{screenTexts.Subtitle}</Text>
        </View>

        {/* Componentes Amigos y Teléfono */}
        <View style={styles.friendsPhoneSection}>
          <TouchableOpacity 
            style={styles.verticalCard}
            onPress={() => navigate.navigate('Buscador')}
            activeOpacity={0.8}
          >
            <View style={styles.verticalCardContent}>
              <View style={styles.verticalIconContainer}>
                <Image source={grupo} style={styles.verticalIcon} resizeMode="contain"/>
              </View>
              <View style={styles.verticalTextContainer}>
                <Text style={styles.verticalTitle}>AMIGOS</Text>
                <Text style={styles.verticalSubtitle}>{screenTexts.FriendsTouchableSubtitle}</Text>
              </View>
                  </View>
                </TouchableOpacity>

          <TouchableOpacity 
            style={styles.verticalCard}
            onPress={() => navigate.navigate('Teclado', { profile: false })}
            activeOpacity={0.8}
          >
            <View style={styles.verticalCardContent}>
              <View style={styles.verticalIconContainer}>
                <Image source={telefono} style={styles.verticalIcon} resizeMode="contain"/>
              </View>
              <View style={styles.verticalTextContainer}>
                <Text style={styles.verticalTitle}>TELÉFONO</Text>
                <Text style={styles.verticalSubtitle}>{screenTexts.PhoneTouchableSubtitle}</Text>
              </View>
                  </View>
                </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  generalInfoSection: {
    paddingTop: 20,
    paddingBottom: 8,
  },
  extraSpace: {
    height: 30,
  },
  motivationalSection: {
    paddingBottom: 50,
    alignItems: 'center',
  },
  kyletsSection: {
    alignItems: 'center',
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  transactionSection: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  sendSection: {
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  friendsPhoneSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    paddingHorizontal: 16,
    gap: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#9d9d9d',
    textAlign: 'center',
    lineHeight: 20,
  },
  kyletsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  kyletsIcon: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
  kyletsNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
  },
  kyletsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  motivationalText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#000000',
    textAlign: 'left',
    fontStyle: 'italic',
    marginLeft: 0,
  },
  transactionCard: {
    width: '100%',
    marginBottom: 20,
    borderRadius: 10,
    borderColor: '#9d9d9d',
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    backgroundColor: 'white'
  },
  transactionContent: {
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  subOpcion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: 20,
  },
  imagen: {
    marginVertical: 13,
    width: 50,
    height: 50
  },
  moneyTexto: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  moneySubTexto: {
    fontSize: 13,
    marginHorizontal: 20,
    marginBottom: 20
  },
  gradientCard: {
    flex: 1,
    borderRadius: 12,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    minHeight: 160,
  },
  card: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    flex: 1,
  },
  cardContent: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIcon: {
    width: 40,
    height: 40,
    marginBottom: 8,
    tintColor: '#FFFFFF',
  },
  cardLabelWhite: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  cardDescriptionWhite: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 6,
  },
  cardSubtitleWhite: {
    fontSize: 11,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    lineHeight: 14,
  },
  transactionCardNew: {
    width: '100%',
    borderRadius: 16,
    borderColor: '#E5E5E7',
    borderWidth: 1,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  transactionCardContent: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 80,
  },
  transactionHeader: {
    flex: 1,
    minWidth: 80,
  },
  transactionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
    flexWrap: 'nowrap',
  },
  transactionSubtitle: {
    fontSize: 11,
    fontWeight: '400',
    color: '#6B7280',
    lineHeight: 14,
  },
  verticalCard: {
    flex: 1,
    borderRadius: 16,
    borderColor: '#E5E5E7',
    borderWidth: 1,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  verticalCardContent: {
    paddingVertical: 35,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 160,
  },
  verticalIconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  verticalIcon: {
    width: 40,
    height: 40,
    marginBottom: 12,
  },
  verticalTextContainer: {
    alignItems: 'center',
  },
  verticalTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
    textAlign: 'center',
  },
  verticalDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
    textAlign: 'center',
    lineHeight: 18,
  },
  verticalSubtitle: {
    fontSize: 11,
    fontWeight: '400',
    color: '#6B7280',
    lineHeight: 16,
    textAlign: 'center',
  },
});

export default Banco;