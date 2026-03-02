import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StyleSheet, View } from 'react-native';

import { UserProvider, useUser } from "./src/context/useUser";

// Notificaciones (asegúrate de que las rutas de import coinciden)
import { useNotificationListeners } from './src/notifications/listeners';
import { getOrCreateExpoPushToken, ensureDeviceRegistered } from './src/notifications/registerPush';
import { navigationRef, flushPendingNav } from './src/navigation/navigationRef'


import LoginScreen from './src/pages/LoginScreen';
import Registro from './src/pages/Registro';
import HomeScreen from './src/pages/Home';
import Perfil from './src/pages/Perfil'
import CodigoVerificacion from './src/pages/codigosVerificacion/CodigoVerificacion';
import Seleccion from './src/pages/codigosVerificacion/Seleccion';
import Invitacion from './src/pages/codigosVerificacion/Invitacion';
import InvitacionEspecial from './src/pages/codigosVerificacion/InvitacionEspecial';
import Decision from './src/pages/codigosVerificacion/Decision';
import DecisionPositiva from './src/pages/codigosVerificacion/DecisionPositiva';
import DecisionNegativa from './src/pages/codigosVerificacion/DecisionNegativa';
import Recomendacion from './src/pages/codigosVerificacion/Recomendacion';
import AnadirRecomendacion from './src/pages/codigosVerificacion/AnadirRecomendacion';
import Bienvenida from './src/pages/bienvenida/Bienvenida';
import Buscador from './src/pages/BancoPages/Buscador';
import Teclado from './src/pages/BancoPages/Teclado';
import Denegacion from './src/pages/BancoPages/Denegacion';
import RecuperarContrasenia1 from './src/pages/contrasenia/RecuperarContrasenia1';
import CodigoVerificacionContrasenia from './src/pages/contrasenia/CodigoVerificacionContrasenia';
import RecuperarContrasenia2 from './src/pages/contrasenia/RecuperarContrasenia2';
import AddMarket from './src/pages/Mapas/AddMarket';
import Confirmacion from './src/pages/BancoPages/Confirmacion';
import AjustesPerfil from './src/pages/AjustesPerfil/ajustesPerfil';
import EditarPerfil from './src/pages/AjustesPerfil/editarPerfil';
import CuentaPerfil from './src/pages/AjustesPerfil/cuentaPerfil';
import NotificacionesPerfil from './src/pages/AjustesPerfil/notificacionesPerfil';
import Place from './src/pages/Mapas/Place';
import Wallet from './src/pages/Wallet';
import AddList from './src/pages/WalletPages/Listas/AddList';
import FriendsLists from './src/pages/WalletPages/Listas/FriendsLists';
import OtherExperience from './src/pages/WalletPages/Listas/OtherExperience';
import Ruleta from './src/pages/Ruleta/Ruleta';
import Notificaciones from './src/pages/Notificaciones';
import SavedLists from './src/pages/WalletPages/Listas/savedLists';
import OtroPerfil from './src/pages/usuarios/OtroPerfil';
import ListaSeguidores from './src/pages/usuarios/ListaSeguidores';
import ListaSiguiendo from './src/pages/usuarios/ListaSiguiendo';
import GlobeScreen from './src/pages/GlobeScreen';
import OnBoardingIndex from './src/pages/OnBoardingIndex';
import LoaderScreen from './src/pages/LoaderScreen';
import EsperarDecision from './src/pages/codigosVerificacion/EsperarDecision';
import CodigoEmbajador from './src/pages/AjustesPerfil/CodigoEmbajador';
import Buzon from './src/pages/Buzon/Buzon';
import Manifiesto from './src/pages/AjustesPerfil/Manifiesto';
import CompletarPerfil from './src/pages/AjustesPerfil/CompletarPerfil';
import ExperienceDetail from './src/pages/WalletPages/Experiencias/ExperienceDetail';
import StepGuide from './src/pages/WalletPages/Experiencias/StepGuide';
import Preguntas from './src/pages/usuarios/Preguntas';
import Metricas from './src/pages/Metricas';
import Weekly from './src/pages/WeeklyProgress/Weekly'; 
import Ranking from './src/pages/Ranking/RankingScreen';
import ExperienceContacts from './src/pages/WalletPages/Experiencias/ExperienceContacts';
import Banco from './src/pages/Banco';
import ExperienceConsejos from './src/pages/WalletPages/Experiencias/ExperienceConsejos';
import ExperienceTrucos from './src/pages/WalletPages/Experiencias/ExperienceTrucos';
import FirstScreen from './src/pages/FirstScreen';
import LanguageSelector from './src/pages/AjustesPerfil/LanguageSelector';
import Tutorial from './src/pages/Tutorial';
import BlockQuestion from './src/pages/usuarios/BlockQuestion';
import Categorias from './src/pages/Categorias';
import RoutesMaps from './src/pages/WalletPages/Experiencias/RoutesMaps';
import Tricks from './src/pages/ComunidadPages/Tricks';
import TricksDetails from './src/pages/ComunidadPages/TricksDetails';
import Advice from './src/pages/ComunidadPages/Advice';
import AdviceDetails from './src/pages/ComunidadPages/AdviceDetails';
import Contacts from './src/pages/ComunidadPages/Contacts';
import Create from './src/pages/ComunidadPages/Create';
import LocationCreate from './src/pages/ComunidadPages/LocationCreate';
import ContactsDetails from './src/pages/ComunidadPages/ContactsDetails'
import Discover from './src/pages/MetricasPages/Discover'
import Cities from './src/pages/MetricasPages/Cities'
import Privacidad from './src/pages/AjustesPerfil/Privacidad';
import Reminder from './src/pages/WalletPages/Experiencias/Remined'
import WhyScreen from './src/pages/codigosVerificacion/WhyScreen'
import LocationPending from './src/pages/Mapas/LocationPending';
import ConfigRoute from './src/pages/usuarios/ConfigRoute';
import AddRoute from './src/pages/Mapas/AddRoute';
import Notes from './src/pages/WalletPages/Experiencias/Notes';
import Request from './src/pages/ComunidadPages/Request';
import GroupDetail from './src/pages/ComunidadPages/GroupDetail';
import GroupRequest from './src/pages/ComunidadPages/GroupRequest';
import ActivityDetail from './src/pages/ComunidadPages/ActivityDetail';
import ActivityRequest from './src/pages/ComunidadPages/ActivityRequest';
import AlbumDetail from './src/pages/WalletPages/Album/AlbumDetail';
import Colaborators from './src/pages/WalletPages/Colaborators';
import Details from './src/pages/MarketPlacePages/Details';
import Consumed from './src/pages/MarketPlacePages/Consumed';
import Reviews from './src/pages/MarketPlacePages/Reviews';
import BenefitBlocked from './src/pages/MarketPlacePages/BenefitBlocked';
import CompanyDetails from './src/pages/MarketPlacePages/CompanyDetails';
import CollectionDetail from './src/pages/MarketPlacePages/CollectionDetail';
import CompanyProfile from './src/pages/MarketPlacePages/CompanyProfile';
import ProductDetail from './src/pages/MarketPlacePages/ProductDetail';
import Transaction from './src/pages/BancoPages/Transaction'
import ThankYouScreen from './src/pages/codigosVerificacion/ThankYouScreen'
import TerminosCondiciones from './src/pages/TerminosCondiciones';
import PoliticaPrivacidad from './src/pages/PoliticaPrivacidad';
import Pasaporte from './src/pages/WalletPages/Experiencias/Pasaporte';
import RetoDiario from './src/pages/WalletPages/Experiencias/RetoDiario';
import RetoDiarioDetalle from './src/pages/WalletPages/Experiencias/RetoDiarioDetalle';

const Stack = createNativeStackNavigator();

function AppInner() {
  const { language, token: jwt } = useUser();
  useNotificationListeners();

  // Pide permisos SIEMPRE una vez (aunque no haya login)
  const askedOnce = useRef(false);
  useEffect(() => {
    if (askedOnce.current) return;
    askedOnce.current = true;
    (async () => {
      const token = await getOrCreateExpoPushToken();
      console.log('DEBUG ExpoPushToken al arrancar:', token);
    })();
  }, []);

  // Cuando haya JWT + idioma, registra/actualiza en backend
  useEffect(() => {
    if (!jwt || !language) return;
    ensureDeviceRegistered({ language, jwt });
  }, [jwt, language]);

  return (
    <NavigationContainer ref={navigationRef} onReady={flushPendingNav}>
      <Stack.Navigator
        initialRouteName="LoaderScreen"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registro" component={Registro} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Perfil" component={Perfil} />
        <Stack.Screen name="CodigoVerificacion" component={CodigoVerificacion} />
        <Stack.Screen name="Seleccion" component={Seleccion} />
        <Stack.Screen name="Invitacion" component={Invitacion} />
        <Stack.Screen name="InvitacionEspecial" component={InvitacionEspecial} />
        <Stack.Screen name="Decision" component={Decision} />
        <Stack.Screen name="DecisionPositiva" component={DecisionPositiva} />
        <Stack.Screen name="DecisionNegativa" component={DecisionNegativa} />
        <Stack.Screen name="Recomendacion" component={Recomendacion} />
        <Stack.Screen name="AnadirRecomendacion" component={AnadirRecomendacion} />
        <Stack.Screen name="Bienvenida" component={Bienvenida} />
        <Stack.Screen name="Buscador" component={Buscador} />
        <Stack.Screen name="Teclado" component={Teclado} />
        <Stack.Screen name="Denegacion" component={Denegacion} />
        <Stack.Screen name="Confirmacion" component={Confirmacion} />
        <Stack.Screen name="RecuperarContrasenia1" component={RecuperarContrasenia1} />
        <Stack.Screen name="CodigoVerificacionContrasenia" component={CodigoVerificacionContrasenia} />
        <Stack.Screen name="RecuperarContrasenia2" component={RecuperarContrasenia2} />
        <Stack.Screen name="AddMarket" component={AddMarket} />
        <Stack.Screen name="AjustesPerfil" component={AjustesPerfil} />
        <Stack.Screen name="EditarPerfil" component={EditarPerfil} />
        <Stack.Screen name="CuentaPerfil" component={CuentaPerfil} />
        <Stack.Screen name="NotificacionesPerfil" component={NotificacionesPerfil} />
        <Stack.Screen name="Ruleta" component={Ruleta} />
        <Stack.Screen name="Place" component={Place} />
        <Stack.Screen name="Wallet" component={Wallet} />
        <Stack.Screen name="AddList" component={AddList} />
        <Stack.Screen name="FriendsLists" component={FriendsLists} />
        <Stack.Screen name="OtherExperience" component={OtherExperience} />
        <Stack.Screen name="Notificaciones" component={Notificaciones} />
        <Stack.Screen name="SavedLists" component={SavedLists} />
        <Stack.Screen name="OtroPerfil" component={OtroPerfil} />
        <Stack.Screen name="ListaSeguidores" component={ListaSeguidores} />
        <Stack.Screen name="ListaSiguiendo" component={ListaSiguiendo} />
        <Stack.Screen name="GlobeScreen" component={GlobeScreen}  />
        <Stack.Screen name="OnBoardingIndex" component={OnBoardingIndex} />
        <Stack.Screen name="LoaderScreen" component={LoaderScreen} />
        <Stack.Screen name="EsperarDecision" component={EsperarDecision} />
        <Stack.Screen name="CodigoEmbajador" component={CodigoEmbajador} />
        <Stack.Screen name="Buzon" component={Buzon} />
        <Stack.Screen name="Manifiesto" component={Manifiesto} />
        <Stack.Screen name="CompletarPerfil" component={CompletarPerfil} />
        <Stack.Screen name="ExperienceDetail" component={ExperienceDetail} />
        <Stack.Screen name="StepGuide" component={StepGuide} />
        <Stack.Screen name="Preguntas" component={Preguntas} />
        <Stack.Screen name="Metricas" component={Metricas} />
        <Stack.Screen name="Weekly" component={Weekly} />
        <Stack.Screen name="Ranking" component={Ranking} />
        <Stack.Screen name="ExperienceContacts" component={ExperienceContacts} />
        <Stack.Screen name="Banco" component={Banco} />
        <Stack.Screen name="ExperienceConsejos" component={ExperienceConsejos} />
        <Stack.Screen name="ExperienceTrucos" component={ExperienceTrucos} />
        <Stack.Screen name="FirstScreen" component={FirstScreen} />
        <Stack.Screen name="LanguageSelector" component={LanguageSelector} />
        <Stack.Screen name="Tutorial" component={Tutorial} />
        <Stack.Screen name="BlockQuestion" component={BlockQuestion} />
        <Stack.Screen name="Categorias" component={Categorias} />
        <Stack.Screen name="RoutesMaps" component={RoutesMaps} />
        <Stack.Screen name="Tricks" component={Tricks} />
        <Stack.Screen name="TricksDetails" component={TricksDetails} />
        <Stack.Screen name="Advice" component={Advice} />
        <Stack.Screen name="AdviceDetails" component={AdviceDetails} />
        <Stack.Screen name="Contacts" component={Contacts} />
        <Stack.Screen name="Create" component={Create} />
        <Stack.Screen name="LocationCreate" component={LocationCreate} />
        <Stack.Screen name="ContactsDetails" component={ContactsDetails} />
        <Stack.Screen name="Discover" component={Discover} />
        <Stack.Screen name="Cities" component={Cities} />
        <Stack.Screen name="Privacidad" component={Privacidad} />
        <Stack.Screen name="Reminder" component={Reminder} />
        <Stack.Screen name="WhyScreen" component={WhyScreen} />
        <Stack.Screen name="LocationPending" component={LocationPending} />
        <Stack.Screen name="ConfigRoute" component={ConfigRoute} />
        <Stack.Screen name="AddRoute" component={AddRoute} />
        <Stack.Screen name="Notes" component={Notes} />
        <Stack.Screen name="Request" component={Request} />
        <Stack.Screen name="GroupDetail" component={GroupDetail} />
        <Stack.Screen name="GroupRequest" component={GroupRequest} />
        <Stack.Screen name="ActivityDetail" component={ActivityDetail} />
        <Stack.Screen name="ActivityRequest" component={ActivityRequest} />
        <Stack.Screen name="AlbumDetail" component={AlbumDetail} />
        <Stack.Screen name="Colaborators" component={Colaborators} />
        <Stack.Screen name="Details" component={Details} />
        <Stack.Screen name="Consumed" component={Consumed} />
        <Stack.Screen name="Reviews" component={Reviews} />
        <Stack.Screen name="BenefitBlocked" component={BenefitBlocked} />
        <Stack.Screen name="CompanyDetails" component={CompanyDetails} />
        <Stack.Screen name="CollectionDetail" component={CollectionDetail} />
        <Stack.Screen name="CompanyProfile" component={CompanyProfile} />
        <Stack.Screen name="ProductDetail" component={ProductDetail} />
        <Stack.Screen name="Transaction" component={Transaction} />
        <Stack.Screen name="ThankYouScreen" component={ThankYouScreen} />
        <Stack.Screen name="TerminosCondiciones" component={TerminosCondiciones} />
        <Stack.Screen name="PoliticaPrivacidad" component={PoliticaPrivacidad} />
                <Stack.Screen name="Pasaporte" component={Pasaporte} />
                <Stack.Screen name="RetoDiario" component={RetoDiario} />
                <Stack.Screen name="RetoDiarioDetalle" component={RetoDiarioDetalle} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default function App() {
  return (
    <UserProvider>
      <View style={{ flex: 1 }}>
        <AppInner />
      </View>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    alignContent: 'center',
  },
});



