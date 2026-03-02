import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import { useUser } from "../../context/useUser";

import Top from '../../components/Utils/Top';
import GradientButton from '../../components/Utils/GradientButton';
import Error from '../../components/Utils/Error';
import Confirmacion from '../../components/Utils/Confirmacion';
import LoadingOverlay from '../../components/Utils/LoadingOverlay';

const CompletarPerfil = () => {
  const navigate = useNavigation();
  const { isLogged, isLoading, logout, texts } = useUser();
  const screenTexts = texts.pages.AjustesPerfil.completarPerfil;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmacion, setConfirmacion] = useState(false);
  const [confirmacionMensaje, setConfirmacionMensaje] = useState('');

  // Estados para el perfil
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [pais, setPais] = useState('');
  const [intereses, setIntereses] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    if (!isLoading && !isLogged) {
      navigate.navigate("Login");
    }
  }, [isLogged, isLoading]);

  const handleCompletarPerfil = () => {
    if (!loading) {
      setLoading(true);
      
      // Validaciones básicas
      if (!nombre.trim() || !apellido.trim()) {
        setError(true);
        setErrorMessage('Por favor completa tu nombre y apellido');
        setLoading(false);
        return;
      }

      // Simular guardado (aquí iría la llamada a la API)
      setTimeout(() => {
        setLoading(false);
        setConfirmacion(true);
        setConfirmacionMensaje('¡Perfil completado exitosamente!');
      }, 1500);
    }
  };

  const progresoPerfil = () => {
    const campos = [nombre, apellido, fechaNacimiento, ciudad, pais, intereses, bio];
    const completados = campos.filter(campo => campo.trim() !== '').length;
    return Math.round((completados / campos.length) * 100);
  };

  return (
    <View style={styles.container}>
      <Top 
        left={true} 
        leftType={'Back'} 
        typeCenter={'Text'} 
        textCenter={screenTexts?.Top || 'Completar perfil'}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Header con progreso */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Completa tu perfil</Text>
          <Text style={styles.subtitle}>Ayúdanos a conocerte mejor</Text>
          
          {/* Barra de progreso */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <LinearGradient
                colors={['#004999', '#1D7CE4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressFill, { width: `${progresoPerfil()}%` }]}
              />
            </View>
            <Text style={styles.progressText}>{progresoPerfil()}% completado</Text>
          </View>
        </View>

        {/* Formulario */}
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre *</Text>
            <TextInput
              style={styles.input}
              placeholder="Tu nombre"
              value={nombre}
              onChangeText={setNombre}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Apellido *</Text>
            <TextInput
              style={styles.input}
              placeholder="Tu apellido"
              value={apellido}
              onChangeText={setApellido}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Fecha de nacimiento</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/AAAA"
              value={fechaNacimiento}
              onChangeText={setFechaNacimiento}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ciudad</Text>
            <TextInput
              style={styles.input}
              placeholder="Tu ciudad"
              value={ciudad}
              onChangeText={setCiudad}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>País</Text>
            <TextInput
              style={styles.input}
              placeholder="Tu país"
              value={pais}
              onChangeText={setPais}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Intereses</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Música, deportes, viajes..."
              value={intereses}
              onChangeText={setIntereses}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Biografía</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Cuéntanos sobre ti..."
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
            />
          </View>

          <TouchableOpacity 
            style={styles.completeButton} 
            onPress={handleCompletarPerfil}
          >
            <LinearGradient
              colors={['#004999', '#1D7CE4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.completeButtonGradient}
            >
              <Text style={styles.completeButtonText}>Completar perfil</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {error && (
        <Error message={errorMessage} func={setError} />
      )}

      {confirmacion && (
        <Confirmacion message={confirmacionMensaje} func={setConfirmacion} />
      )}

      {loading && (
        <LoadingOverlay />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  headerSection: {
    marginTop: 20,
    marginBottom: 32,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  formSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 56,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
    borderColor: '#E5E5EA',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    color: '#1A1A1A',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 16,
  },
  completeButton: {
    marginTop: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  completeButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  completeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default CompletarPerfil;
