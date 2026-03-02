import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ExperienceConsejos({ route }) {
    const navigate=useNavigation()
    const { experience } = route.params;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigate.goBack()}
                    >
                        <Feather name="arrow-left" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Image
                        source={{ uri: experience.imageUrl }}
                        style={styles.coverImage}
                    />
                    <LinearGradient
                        colors={['rgba(0, 0, 0, 0.8)', 'transparent']}
                        style={styles.gradient}
                    />
                    <View style={styles.headerContent}>
                        <Text style={styles.date}>{experience.date}</Text>
                        <Text style={styles.place}>{experience.place}</Text>
                        <Text style={styles.description}>{experience.description}</Text>
                    </View>
                </View>

                <View style={styles.content}>
                    {experience.contacts && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Contactos</Text>
                        {experience.contacts.map((contact, index) => (
                            <View key={index} style={styles.contactCard}>
                            <Image
                                source={{ uri: contact.avatar }}
                                style={styles.contactAvatar}
                            />
                            <View style={styles.contactInfo}>
                                <Text style={styles.contactName}>{contact.name}</Text>
                                <Text style={styles.contactRole}>{contact.role}</Text>
                            </View>
                            <View style={styles.contactActions}>
                                <TouchableOpacity >
                                  <LinearGradient
                                    colors={[ '#1D7CE4' , '#004999' ]}
                                    start={[0, 0]}
                                    end={[1, 1]}
                                    style={styles.contactButton}
                                  >
                                    <Feather name="phone" size={20} color="#ffffff" />
                                  </LinearGradient>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.contactButton}>
                                  <LinearGradient
                                    colors={[ '#1D7CE4' , '#004999' ]}
                                    start={[0, 0]}
                                    end={[1, 1]}
                                    style={styles.contactButton}
                                  >
                                    <Feather name="mail" size={20} color="#ffffff" />
                                  </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </View>
                        ))}
                    </View>
                    )}
                </View>

                {experience.visitors && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Visitantes</Text>
                        <View style={styles.visitors}>
                            {experience.visitors.map((visitor, index) => (
                                <Image
                                    key={index}
                                    source={{ uri: visitor.avatar }}
                                    style={styles.visitorAvatar}
                                />
                            ))}
                            <View style={styles.visitorCount}>
                                <Text style={styles.visitorCountText}>
                                    +{experience.visitors.length}
                                </Text>
                            </View>
                        </View>
                    </View>
                  )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
      },
      header: {
        height: width * 0.8,
        position: 'relative'
    },
    backButton: {
      position: 'absolute',
      top: 20,
      left: 20,
      zIndex: 10,
      width: 40,
      height: 40,
      borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  coverImage: {
    width: '100%',
    height: '100%'
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%'
  },
  headerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20
  },
  date: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 8
},
place: {
  color: '#fff',
  fontSize: 32,
  fontWeight: '600',
  marginBottom: 8
},
description: {
  color: '#fff',
  fontSize: 16,
  opacity: 0.9
},
content: {
  marginTop: 20
},
section: {
  marginBottom: 24,
  marginLeft: 14
},
sectionTitle: {
  fontSize: 18,
  fontWeight: '600',
  marginBottom: 16,
  marginLeft: 8
},
contactCard: {
  flexDirection: 'row',
  alignItems: 'center',
  borderColor: '#9d9d9d',
  borderWidth: 0.5,
  padding: 16,
  borderRadius: 16,
  marginBottom: 12,
  width: '95%',
  backgroundColor: 'white',
  shadowColor: '#000', // Color de la sombra
  shadowOffset: { width: 0, height: 2 }, // Dirección de la sombra
  shadowOpacity: 0.2, // Opacidad de la sombra
  shadowRadius: 4, // Radio de la sombra
  elevation: 5, // Sombra en Android
},
contactAvatar: {
  width: 50,
  height: 50,
  borderRadius: 25
},
contactInfo: {
  flex: 1,
  marginLeft: 16
},
contactName: {
  fontSize: 16,
  fontWeight: '500'
},
contactRole: {
  fontSize: 14,
  color: '#666',
  marginTop: 2
},
contactActions: {
  flexDirection: 'row',
  gap: 8
},
contactButton: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: '#e8f2ff',
  justifyContent: 'center',
  alignItems: 'center'
},
visitors: {
  flexDirection: 'row',
  alignItems: 'center',
  marginLeft: 8
},
visitorAvatar: {
  width: 40,
  height: 40,
  borderRadius: 20,
  marginRight: -10,
  borderWidth: 2,
  borderColor: '#fff'
},
visitorCount: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: '#f0f0f0',
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: 8
},
visitorCountText: {
  fontSize: 12,
  fontWeight: '500'
},
footer: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 16,
  borderTopWidth: 1,
  borderTopColor: '#eee',
  backgroundColor: '#fff'
},
footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 12
},
footerButtonText: {
  color: '#fff',
  fontSize: 14,
    fontWeight: '500'
},
guideButton: {
  marginLeft: 'auto',
  backgroundColor: '#3b82f6'
},
guideButtonText: {
  color: '#fff',
  fontSize: 14,
    fontWeight: '500'
  }
})