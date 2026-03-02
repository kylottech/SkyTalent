import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import bandera from '../../../assets/Espanita.png';


const Prefix = () => {


  

  return (
    
    <ScrollView style={styles.componenteLugar}>
        <View style={styles.banderas}>
          <Image source={bandera} style={styles.bandera}/>
          <Image source={bandera} style={styles.bandera}/>
          <Image source={bandera} style={styles.bandera}/>
          <Image source={bandera} style={styles.bandera}/>
        </View>
        
         
        
        

    </ScrollView>


  );
};

const styles = StyleSheet.create({
  
    componenteLugar:{
        width:75,
        height: 10,
        borderColor: 'white',
        borderWidth: 2,
        borderRadius:20,
        paddingTop: 10,
        
    },
    banderas:{
      alignItems: 'center',
    },
    bandera:{
      marginBottom:15
    },


});

export default Prefix;