import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useUser } from '../../context/useUser';
import { useNavigation } from '@react-navigation/native';
import { getMinInfo } from '../../services/mapsService'
import { formatString } from '../../utils/formatString'
import corona from '../../../assets/CORONA_DORADA.png';

 

const NotificacionesPerfil = (props) => {
  const navigate = useNavigation();
  const { texts } = useUser()
  const screenTexts = texts.components.user.NotificacionesPerfil

  const [locationBlocked, setLocationBlocked] = useState(false)
  const [opcion, setOpcion] = useState(
    {
      imagen: corona, 
      titulo: '', 
      subtitulo: ''
    }
  )

  const handleGetMinInfo = async (_id) => {
    if(!props.loading) {
      props.setLoading(true)
      try {
        getMinInfo(_id)
          .then((response) => {
            props.setLoading(false)
            if (response) {
              setLocationBlocked(response.locationBlocked)
              navigate.navigate('Place', {locationInfo: response, setLocationBlocked: setLocationBlocked})
            }
          })
          .catch((error) => {
            props.setError(true);
            props.setErrorMessage(error.message);
            props.setLoading(true)
          });
      } catch (error) {
        props.setError(true);
        props.setErrorMessage(error.message);
        props.setLoading(true)
      }
    } 
    
  };

  useEffect(() => {
    let imagen, titulo, subtitulo;

    switch (props.tipo) {
      //te han seguido
      case 'seguidores': 
        imagen = { uri: props.avatar };
        titulo = screenTexts.FollowersTitle;
        subtitulo = formatString(screenTexts.FollowersSubtitle, { variable1: props.kylotId });
        break;
        
      case 'kylets':
        imagen = corona;
        titulo = formatString(screenTexts.KyletsTitle, { variable1: props.cantidad });
        subtitulo = screenTexts.KyletsSubtitle;
        break;
        //eliminar

      //te han visto el perfil
      case 'visualizaciones':
        imagen = { uri: props.avatar };
        titulo = formatString(screenTexts.VisualizationsTitle, { variable1: props.kylotId });
        subtitulo = screenTexts.VisualizationsSubtitle;
        break;

      //han creado una lista
      case 'lista':
        imagen = corona;
        titulo = formatString(screenTexts.ListTitle, { variable1: props.kylotId });
        subtitulo = screenTexts.ListSubtitle;
        break;

      //kylet de llegada
      case 'llegada':
        imagen = corona;
        titulo = screenTexts.WelcomeTitle;
        subtitulo = formatString(screenTexts.WelcomeSubtitle, { variable1: props.kylotId });
        break;

      case 'ubicacion':
        imagen = corona;
        titulo = screenTexts.LocationTitle;
        subtitulo = formatString(screenTexts.LocationSubtitle, { variable1: props.city });
        break;
        //eliminar

      //alguien ha creado un sitio
      case 'creacion':
        imagen = corona;
        titulo = screenTexts.CreationTitle;
        subtitulo = formatString(screenTexts.CreationSubtitle, { variable1: props.kylotId });
        break;
        
      //alguien ha guardado tu lista
      case 'guardados':
        imagen = corona;
        titulo = formatString(screenTexts.SavedTitle, { variable1: props.kylotId });
        subtitulo = screenTexts.SavedSubtitle;
        break;
        
      //alguien ha creado una experiencia
      case 'experiencia':
        imagen = corona;
        titulo = screenTexts.ExperienceTitle;
        subtitulo = screenTexts.ExperienceSubtitle;
        break;
        
      //alguien ha creado un momento
      case 'moment':
        imagen = { uri: props.avatar };
        titulo = formatString(screenTexts.MomentsTitle, { variable1: props.kylotId });
        subtitulo = screenTexts.MomentsSubTitle;
        break;
      
      //te han invitado a un grupo
      case 'group':
        imagen = { uri: props.avatar };
        titulo = formatString(screenTexts.GroupTitle, { variable1: props.kylotId, variable2: props.group });
        subtitulo = screenTexts.GroupSubTitle;
        break;
        
      //alguien ha copiado tu album
      case 'album':
        imagen = { uri: props.avatar };
        titulo = formatString(screenTexts.AlbumTitle, { variable1: props.kylotId, variable2: props.album });
        subtitulo = screenTexts.AlbumSubTitle;
        break;
        
      //te han invitado a una actividad
      case 'activity':
        imagen = { uri: props.avatar };
        titulo = formatString(screenTexts.ActivityTitle, { variable1: props.activity });
        subtitulo = formatString(screenTexts.ActivitySubTitle, { variable1: props.kylotId });
        break;
        
      //te han dado permiso para ver una ruta
      case 'route':
        imagen = { uri: props.avatar };
        titulo = formatString(screenTexts.RouteTitle, { variable1: props.kylotId });
        subtitulo = screenTexts.RouteSubTitle;
        break;
        
      //te han invitado a colaborar
      case 'colaboratorExperience':
        imagen = { uri: props.avatar };
        titulo = formatString(screenTexts.colaboratorExperienceTitle, { variable1: props.kylotId });
        subtitulo = formatString(screenTexts.colaboratorExperienceSubTitle, { variable1: props.name });
        break;
        
      //te han invitado a colaborar
      case 'colaboratorList':
        imagen = { uri: props.avatar };
        titulo = formatString(screenTexts.colaboratorListTitle, { variable1: props.kylotId, variable2: props.name });
        subtitulo = formatString(screenTexts.colaboratorListSubTitle, { variable1: props.name });
        break;
        
      //te han invitado a colaborar
      case 'colaboratorAlbum':
        imagen = { uri: props.avatar };
        titulo = formatString(screenTexts.colaboratorAlbumTitle, { variable1: props.kylotId, variable2: props.name });
        subtitulo = formatString(screenTexts.colaboratorAlbumSubTitle, { variable1: props.name });
        break;
        
      //le han dado like a tu momento
      case 'likeMoment':
        imagen = { uri: props.avatar };
        titulo = formatString(screenTexts.likeMomentTitle, { variable1: props.kylotId, variable2: props.name });
        subtitulo = formatString(screenTexts.likeMomentSubTitle, { variable1: props.name, variable2: props.amount })
        break;
        
      //estas en el top ranking
      case 'topRanking':
        imagen = corona
        titulo = screenTexts.topRankingTitle
        subtitulo = formatString(screenTexts.topRankingSubTitle, { variable1: props.amount })
        break;
        
      //no se quien ha entrado a la act
      case 'joinActivity':
        imagen = { uri: props.avatar };
        titulo = formatString(screenTexts.joinActivityTitle, { variable1: props.kylotId });
        subtitulo = formatString(screenTexts.joinActivitySubTitle, { variable1: props.name })
        break;
        //hecha

      //le han dado like a tu pregunta
      case 'questionLike':
        imagen = { uri: props.avatar };
        titulo = formatString(screenTexts.questionLikeTitle, { variable1: props.name });
        subtitulo = formatString(screenTexts.questionLikeSubTitle, { variable1: props.kylotId })
        break;
        
      //han desbloqueado tu pregunta
      case 'questionUnlock':
        imagen = { uri: props.avatar };
        titulo = formatString(screenTexts.questionUnlockTitle, { variable1: props.name });
        subtitulo = formatString(screenTexts.questionUnlockSubTitle, { variable1: props.kylotId })
        break;
        
      //han pedido unirse a una act
      case 'requestActiviy':
        imagen = { uri: props.avatar };
        titulo = screenTexts.requestActiviyTitle
        subtitulo = formatString(screenTexts.requestActiviySubTitle, { variable1: props.kylotId, variable2: props.name })
        break;
        
      //ha aceptado tu invitacion 
      case 'aceptInvitationActiviy':
        imagen = { uri: props.avatar };
        titulo = screenTexts.aceptInvitationActiviyTitle
        subtitulo = formatString(screenTexts.aceptInvitationActiviySubTitle, { variable1: props.kylotId, variable2: props.name })
        break;
      
      //te han aprovado tu solicitud
      case 'aceptRequestActiviy':
        imagen = { uri: props.avatar };
        titulo = screenTexts.aceptRequestActiviyTitle
        subtitulo = formatString(screenTexts.aceptRequestActiviySubTitle, { variable1: props.kylotId, variable2: props.name })
        break;
        
      //han invitado a tu grupo
      case 'inviteGroupActiviy':
        imagen = { uri: props.avatar };
        titulo = screenTexts.inviteGroupActiviyTitle
        subtitulo = formatString(screenTexts.inviteGroupActiviySubTitle, { variable1: props.kylotId, variable2: props.name })
        break;

      //copiar Experiencia
      case 'copyExperience':
        imagen = { uri: props.avatar };
        titulo = screenTexts.copyExperienceTitle
        subtitulo = formatString(screenTexts.copyExperienceSubTitle, { variable1: props.kylotId, variable2: props.name })
        break;
      
      //entrada de invitar colega
      case 'joinInvitationFriend':
        imagen = { uri: props.avatar };
        titulo = screenTexts.joinInvitationFriendTitle
        subtitulo = formatString(screenTexts.joinInvitationFriendSubTitle, { variable1: props.kylotId })
        break;
      
      //new album
      case 'newAlbum':
        imagen = { uri: props.avatar };
        titulo = formatString(screenTexts.likeMomentTitle, { variable1: props.kylotId });
        subtitulo = screenTexts.likeMomentSubTitle
        break;
      
      
        
      default:
        imagen = corona;
        titulo = screenTexts.Default;
        subtitulo = '';
        break;

    }

    setOpcion({ imagen, titulo, subtitulo });
  }, []);

  

  return (
        <TouchableOpacity style={styles.container} onPress={() => 
          props.tipo === 'seguidores' ? navigate.navigate('OtroPerfil', {userId: props._idUsuario}) : 
          props.tipo === 'kylets' ? navigate.navigate('Home') : 
          props.tipo === 'publicaciones' ? navigate.navigate('ComunidadDetalles', {_id: props._idInfo}) :
          props.tipo === 'lista' ? navigate.navigate('OtherExperience', {_id: props._idInfo}) :
          props.tipo === 'comun' ? navigate.navigate('OtroPerfil', {userId: props._idUsuario}) :
          props.tipo === 'ubicacion' ? handleGetMinInfo(_id= props._idInfo) : 
          props.tipo === 'creacion' ? handleGetMinInfo(_id= props._idInfo) : 
          props.tipo === 'guardados' ? navigate.navigate('OtherExperience', {_id: props._idInfo}) :
          props.tipo === 'experiencia' ? navigate.navigate('ExperienceDetail', {_id: props._idInfo, mine: false, name: props.kylotId, photo: props.avatar}) :
          props.tipo === 'moment' ? navigate.navigate('Home', {screen: 1}) :
          props.tipo === 'group' ? navigate.navigate("GroupDetail", {_id: props._idInfo, name: props.group}) :
          props.tipo === 'album' ? navigate.navigate('OtroPerfil', {userId: props._idUsuario}) :
          props.tipo === 'activity' ? navigate.navigate("ActivityDetail", {_id: props._idInfo, name: props.activity}) :
          props.tipo === 'route' ? navigate.navigate("ConfigRoute") :
          props.tipo === 'colaboratorExperience' ? navigate.navigate('ExperienceDetail', {_id: props._idInfo, mine: props.mine, name: props.kylotId, photo: props.avatar}) :
          props.tipo === 'colaboratorList' ? navigate.navigate('OtherExperience', {_id: props._idInfo}) :
          props.tipo === 'colaboratorAlbum' ? navigate.navigate("AlbumDetail", {_id: props._idInfo}) :
          props.tipo === 'likeMoment' ? navigate.navigate('OtroPerfil', {userId: props._idUsuario}) :
          props.tipo === 'topRanking' ? navigate.navigate('Ranking') :
          props.tipo === 'joinActivity' ? navigate.navigate('OtroPerfil', {userId: props._idUsuario}) :
          props.tipo === 'questionLike' ? navigate.navigate('OtroPerfil', {userId: props._idUsuario}) :
          props.tipo === 'questionUnlock' ? navigate.navigate('OtroPerfil', {userId: props._idUsuario}) :
          props.tipo === 'requestActiviy' ? navigate.navigate("ActivityDetail", {_id: props._idInfo, name: props.activity}) :
          props.tipo === 'aceptInvitationActiviy' ? navigate.navigate('OtroPerfil', {userId: props._idUsuario}) :
          props.tipo === 'aceptRequestActiviy' ? navigate.navigate("ActivityDetail", {_id: props._idInfo, name: props.activity}) :
          props.tipo === 'inviteGroupActiviy' ? navigate.navigate("ActivityDetail", {_id: props._idInfo, name: props.activity}) :
          props.tipo === 'copyExperience' ? navigate.navigate('ExperienceDetail', {_id: props._idInfo, mine: props.mine, name: props.kylotId, photo: props.avatar}) :
          props.tipo === 'joinInvitationFriend' ? navigate.navigate('OtroPerfil', {userId: props._idUsuario}) :
          props.tipo === 'newAlbum' ? navigate.navigate("AlbumDetail", {_id: props._idInfo}) :
          null
          }>
        {/* Imagen a la izquierda */}
        <Image source={opcion.imagen} style={styles.imagen} blurRadius={(props.tipo === 'visualizaciones' || props.tipo === 'moment') ? 200 : 0}/>
        {/* Texto a la derecha */}
        <View style={styles.textoContainer}>
            <Text style={styles.titulo}>{opcion.titulo}</Text>
            <Text style={styles.subtitulo}>{opcion.subtitulo}</Text>
        </View>

        

        </TouchableOpacity>
        
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal:15,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    paddingTop:12,
    paddingBottom:15,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginBottom: 15,
    shadowColor: '#000', // Color de la sombra
    shadowOffset: { width: 0, height: 2 }, // Dirección de la sombra
    shadowOpacity: 0.2, // Opacidad de la sombra
    shadowRadius: 4, // Radio de la sombra
    elevation: 5, // Sombra en Android
  },
  imagen: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 10,

  },
  textoContainer: {
    flex: 1,
  },
  titulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2
  },
  subtitulo: {
    fontSize: 11,
    color: '#666',
  },
  linea:
  {
    height:2,
    width:'100%',
    backgroundColor: 'gray',

  },

});

export default NotificacionesPerfil;
