import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const PostCard = ({ info, usuario, index, setIndexPosts, setShowPostOptionModal, mine }) => {

  const handleOpciones = () => {
    setIndexPosts(index);
    setShowPostOptionModal(true);
  };

  return (
    <View style={{ position: 'relative', alignItems: 'center', marginBottom: 20 }}>
      {mine && (
        <View style={styles.optionOverlay} pointerEvents="box-none">
          <TouchableOpacity style={styles.optionButton} onPress={handleOpciones}>
            <Text style={styles.optionText}>•</Text>
            <Text style={styles.optionText}>•</Text>
            <Text style={styles.optionText}>•</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Tarjeta simple: imagen + nombre debajo */}
      <View style={styles.tarjeta}>
        <Image
          source={{ uri: info?.avatar?.url }}
          style={styles.imageTarjeta}
        />
        <View style={{ width: '100%', paddingHorizontal: 8, paddingVertical: 10 }}>
          <Text style={styles.nameText} numberOfLines={2}>
            {info?.name || ''}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Contenedor (mantengo medidas de tu flipCard/tarjeta)
  tarjeta: {
    width: 280,
    minHeight: 360,
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: '#f0f0f0',
    borderWidth: 1,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    marginTop: 20,
    marginBottom: 30,
    overflow: 'hidden',
  },
  imageTarjeta: {
    width: '96%',
    height: 300,
    marginTop: 6,
    borderRadius: 10,
    alignSelf: 'center',
  },

  // Nombre debajo de la foto
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#111827',
  },

  // Botón de opciones (igual que lo tenías)
  optionOverlay: {
    position: 'absolute',
    top: 30,
    right: 10,
    zIndex: 999,
  },
  optionButton: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 6,
    borderRadius: 20,
    alignItems: 'center',
  },
  optionText: {
    color: 'white',
    fontSize: 20,
    lineHeight: 20,
  },
});

export default PostCard;
