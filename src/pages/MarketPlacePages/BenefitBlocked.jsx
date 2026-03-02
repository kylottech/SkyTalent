import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../../context/useUser";
import BenefitBlock from '../../components/MarketPlace/BenefitBlock';

const BenefitBlocked = ({ route }) => {
  const navigation = useNavigation();
  const { logout } = useUser();
  
  // Obtener parámetros de navegación
  const { benefitData } = route.params || {};

  const handleUnblock = async () => {
    // Aquí iría la lógica para desbloquear el beneficio
    // Por ahora simulamos que se desbloquea exitosamente
    try {
      // Llamada al servicio de desbloqueo
      // await unblockBenefit(benefitData._id, logout);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handlePass = () => {
    // Navegar a los detalles del beneficio desbloqueado
    navigation.replace('Details', {
      type: 'benefit',
      benefitData: {
        ...benefitData,
        status: 'UNLOCKED'
      }
    });
  };

  return (
    <View style={styles.container}>
      <BenefitBlock
        benefitPhoto={benefitData?.imageUri}
        benefitName={benefitData?.title?.replace('\n', ' ')}
        kyletsPrice={benefitData?.kyletsPrice || 100}
        onPress={handleUnblock}
        pass={handlePass}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default BenefitBlocked;

