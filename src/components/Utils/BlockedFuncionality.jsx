import React, { useState, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Modal, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from "../../context/useUser";
import InfoModal from './InfoModal';
import candado from '../../../assets/candadoSitio.png';

const { width, height } = Dimensions.get('window');

const BlockedFuncionality = (props) => {
    const { texts }=useUser()
    const screenTexts = texts.components.Utils.BlockedFuncionality
    const [showConfirmation, setShowConfirmation] = useState(false);

  return (
    <View style={{flex: 1}}>
        <TouchableOpacity style={{flex: 1}} onPress={() => setShowConfirmation(true)}>
            <LinearGradient
                colors={[ 'rgba(0,0,0,0.5)', 'rgb(255, 255, 255)']}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.container}
            >
                <Image source={candado}/>
            </LinearGradient>
      
            
        </TouchableOpacity>

        <InfoModal 
          isOpen={showConfirmation} 
          onClose={ () => setShowConfirmation(false)} 
          Title={screenTexts.Title} 
          Subtitle={!props.group ? screenTexts.Subtitle : screenTexts.Subtitle2} 
          Button={screenTexts.ContinueTouchable} 
        />
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height * 0.5,
    backgroundColor: '#9d9d9d',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 30,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 10,
  },
  modalIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E3D9C4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  modalMessage: {
    fontSize: 16,
    color: 'rgba(0,0,0,0.6)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  modalButton: {
    backgroundColor: '#000',
    borderRadius: 25,
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
    zIndex: 2,
  },
  modalButtonHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
});

export default BlockedFuncionality;
