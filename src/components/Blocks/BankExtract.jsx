import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useUser } from '../../context/useUser';
import { useNavigation } from '@react-navigation/native';
import { formatString } from '../../utils/formatString'
import { Ionicons } from '@expo/vector-icons';
import corona from '../../../assets/CORONA_DORADA.png';

 

const BankExtract = (props) => {
  const navigate = useNavigation();
  const { texts } = useUser()
  const screenTexts = texts.components.Blocks.BankExtract
  const [opcion, setOpcion] = useState(
    {
      titulo: '', 
      subtitulo: '',
      movimiento: 0,
      actual: 0
    }
  )

  useEffect(() => {
    let titulo, subtitulo, movimiento, actual
    
    switch (props.otherSide.class) {
      case 'Send':
        titulo = screenTexts.SendTitle
        subtitulo = formatString(screenTexts.SendSubtitle, { variable1: props.info });
        break;
        
      case 'Get':
        titulo = screenTexts.GetTitle
        subtitulo = formatString(screenTexts.GetSubtitle, { variable1: props.info });
        break;
        //push
      case 'createPlaceBasic':
        titulo = screenTexts.createPlaceBasicTitle
        subtitulo = formatString(screenTexts.createPlaceBasicSubtitle, { variable1: props.info });
        break;
        
      case 'createMoment':
        titulo = screenTexts.createMomentTitle
        subtitulo = formatString(screenTexts.createMomentSubtitle, { variable1: props.info });
        break;

      case 'createPublicList':
        titulo = screenTexts.createPublicListTitle
        subtitulo = formatString(screenTexts.createPublicListSubtitle, { variable1: props.info });
        break;

      case 'createExperience':
        titulo = screenTexts.createExperienceTitle
        subtitulo = formatString(screenTexts.createExperienceSubtitle, { variable1: props.info });
        break;

      case 'createPostExperience':
        titulo = screenTexts.createPostExperienceTitle
        subtitulo = formatString(screenTexts.createPostExperienceSubtitle, { variable1: props.info, variable2: props.info2 });
        break;

      case 'createPart':
        titulo = screenTexts.createPartTitle
        subtitulo = formatString(screenTexts.createPartSubtitle, { variable1: props.info, variable2: props.info2 });
        break;

      case 'AddPlacePhoto':
        titulo = screenTexts.AddPlacePhotoTitle
        subtitulo = formatString(screenTexts.AddPlacePhotoSubtitle, { variable1: props.info });
        break;
        //push (creador)
      case 'answerQuestion':
        titulo = screenTexts.answerQuestionTitle
        subtitulo = formatString(screenTexts.answerQuestionSubtitle, { variable1: props.info });
        break;

      case 'topRanking':
        titulo = screenTexts.topRankingTitle
        subtitulo = screenTexts.topRankingSubtitle
        break;
        //push
        //notificacion
      case 'buzon':
        titulo = screenTexts.buzonTitle
        subtitulo = screenTexts.buzonSubtitle
        break;

      case 'createItemCommunity':
        titulo = screenTexts.createItemCommunityTitle
        subtitulo = formatString(screenTexts.createItemCommunitySubtitle, { variable1: props.info });
        break;

      case 'createActivity':
        titulo = screenTexts.createActivityTitle
        subtitulo = formatString(screenTexts.createActivitySubtitle, { variable1: props.info });
        break;
        
      case 'joinActivity':
        titulo = screenTexts.joinActivityTitle
        subtitulo = formatString(screenTexts.joinActivitySubtitle, { variable1: props.info });
        break;
        //push a creador
        //notificacion a creador
      case 'createGroup':
        titulo = screenTexts.createGroupTitle
        subtitulo = formatString(screenTexts.createGroupSubtitle, { variable1: props.info });
        break;
        
      case 'copyAlbum':
        titulo = screenTexts.copyAlbumTitle
        subtitulo = formatString(screenTexts.copyAlbumSubtitle, { variable1: props.info });
        break;
        //push
        //notificacion
      case 'createAlbum':
        titulo = screenTexts.createAlbumTitle
        subtitulo = formatString(screenTexts.createAlbumSubtitle, { variable1: props.info });
        break;
        
      case 'invitacionAmigo':
        titulo = screenTexts.invitacionAmigoTitle
        subtitulo = formatString(screenTexts.invitacionAmigoSubtitle, { variable1: props.info });
        break;
        //push
        //notificacion
      case 'unblockCity':
        titulo = screenTexts.unblockCityTitle
        subtitulo = formatString(screenTexts.unblockCitySubtitle, { variable1: props.info });
        break;
        
      case 'unblockPlace':
        titulo = screenTexts.unblockPlaceTitle
        subtitulo = formatString(screenTexts.unblockPlaceSubtitle, { variable1: props.info });
        break;
        
      case 'answerOther':
        titulo = formatString(screenTexts.answerOtherTitle, { variable1: props.info });
        subtitulo = formatString(screenTexts.answerOtherSubtitle, { variable1: props.info2 });
        break;
        //push a respondedor
        //notificacion a respondedor
      case 'ruleta':
        titulo = screenTexts.ruletaTitle
        subtitulo = screenTexts.ruletaSubtitle
        break;
        
      case 'diario':
        titulo = screenTexts.diarioTitle
        subtitulo = screenTexts.diarioSubtitle
        break;

      default:
        titulo = screenTexts.defaultTitle
        subtitulo = screenTexts.defaultSubtitle
        break;
    }

    
    movimiento = props.movimiento;
    actual = props.actual

    setOpcion({ titulo, subtitulo, movimiento, actual });
  }, []);

  

  const getTransactionIcon = (otherSideClass) => {
    switch (otherSideClass) {
      case 'Send':
        return 'arrow-up-circle';
      case 'Get':
        return 'arrow-down-circle';
      case 'createPlaceBasic':
      case 'createMoment':
      case 'createPublicList':
      case 'createExperience':
        return 'add-circle';
      case 'answerQuestion':
      case 'answerOther':
        return 'chatbubble-ellipses';
      case 'topRanking':
        return 'trophy';
      case 'buzon':
        return 'mail';
      case 'createItemCommunity':
      case 'createActivity':
      case 'joinActivity':
        return 'people';
      case 'createGroup':
        return 'people-circle';
      case 'copyAlbum':
      case 'createAlbum':
        return 'images';
      case 'invitacionAmigo':
        return 'person-add';
      case 'unblockCity':
      case 'unblockPlace':
        return 'lock-open';
      case 'ruleta':
        return 'gift';
      case 'diario':
        return 'book';
      default:
        return 'card';
    }
  };

  const getTransactionColor = (otherSideClass, movimiento) => {
    if (movimiento > 0) {
      return '#30D158'; // Apple Green for income
    } else {
      return '#FF3B30'; // Apple Red for expense
    }
  };

  const getTransactionBackgroundColor = (otherSideClass, movimiento) => {
    if (movimiento > 0) {
      return '#30D15815'; // Light green background
    } else {
      return '#FF3B3015'; // Light red background
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => props.onPress({title: opcion.titulo || '', subtitle: opcion.subtitulo || ''})}
      activeOpacity={0.6}
      underlayColor="#f5f5f7"
      accessibilityLabel={`${opcion.titulo}. ${opcion.subtitulo}. ${opcion.movimiento > 0 ? 'Ganaste' : 'Gastaste'} ${Math.abs(opcion.movimiento)} Kylets. Balance actual: ${opcion.actual} Kylets`}
      accessibilityRole="button"
      accessibilityHint="Toca para ver más detalles de esta transacción"
    >
      <View style={styles.cardContent}>
        <View style={styles.leftSection}>
          <View style={[styles.iconContainer, { backgroundColor: getTransactionBackgroundColor(props.otherSide.class, opcion.movimiento) }]}>
            <Ionicons 
              name={getTransactionIcon(props.otherSide.class)} 
              size={20} 
              color={getTransactionColor(props.otherSide.class, opcion.movimiento)} 
            />
          </View>
          <View style={styles.textSection}>
            <Text 
              style={styles.titulo} 
              numberOfLines={1} 
              ellipsizeMode="tail"
              accessibilityRole="text"
            >
              {opcion.titulo}
            </Text>
            <Text 
              style={styles.subtitulo} 
              numberOfLines={2} 
              ellipsizeMode="tail"
              accessibilityRole="text"
            >
              {opcion.subtitulo}
            </Text>
          </View>
        </View>
        
        <View style={styles.rightSection}>
          <View style={styles.amountContainer}>
            <Text 
              style={[
                styles.movimientoText, 
                { color: getTransactionColor(props.otherSide.class, opcion.movimiento) }
              ]}
              accessibilityRole="text"
            >
              {opcion.movimiento > 0 ? '+' : ''}{opcion.movimiento}
            </Text>
          </View>
          <View style={styles.balanceContainer}>
            <Text 
              style={styles.actualText}
              accessibilityRole="text"
            >
              Balance: 
            </Text>
            <Image 
              source={corona} 
              style={styles.coronaIcon} 
              resizeMode="contain"
              accessibilityLabel="Icono de Kylets"
            />
            <Text 
              style={styles.actualText}
              accessibilityRole="text"
            >
              {opcion.actual}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 4,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 0.5,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    minHeight: 72,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  textSection: {
    flex: 1,
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1d1d1f',
    marginBottom: 2,
    lineHeight: 20,
    letterSpacing: -0.24,
  },
  subtitulo: {
    fontSize: 13,
    color: '#86868b',
    lineHeight: 18,
    letterSpacing: -0.08,
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 80,
  },
  amountContainer: {
    marginBottom: 6,
  },
  movimientoText: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
    letterSpacing: -0.32,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  coronaIcon: {
    width: 14,
    height: 14,
    marginHorizontal: 4,
  },
  actualText: {
    fontSize: 11,
    color: '#86868b',
    fontWeight: '500',
    letterSpacing: -0.07,
  },
});

export default BankExtract;
