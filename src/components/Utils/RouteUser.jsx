import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import WheelColorPicker from 'react-native-wheel-color-picker';
import { useUser } from "../../context/useUser";
import { updateLine } from '../../services/routeServices';
import GradientButton from './GradientButton';

const predefinedColors = ['#FF0000', '#00FF00', '#0000FF', '#FFA500', '#800080', '#000', '#fff'];

const RouteUser = ({
  _id,
  profileImage,
  username,
  fullName,
  color: initialColor,
  discontinuous: initialDiscontinuous,
  stroke: initialStroke,
  editable = true,
  me,
  setLoading,
  setError,
  setErrorMessage,
  setConfirmacion,
  setConfirmacionMensaje,
  setShowModal
}) => {
  const { logout, texts } = useUser();
  const screenTexts = texts.components.Utils.RouteUser;

  // Estados actuales
  const [color, setColor] = useState(initialColor || '#000000');
  const [stroke, setStroke] = useState(initialStroke || 2);
  const [discontinuous, setDiscontinuous] = useState(initialDiscontinuous || 0);

  // Nuevos "valores base" para detectar cambios
  const [baseColor, setBaseColor] = useState(initialColor || '#000000');
  const [baseStroke, setBaseStroke] = useState(initialStroke || 2);
  const [baseDiscontinuous, setBaseDiscontinuous] = useState(initialDiscontinuous || 0);

  const [showSettings, setShowSettings] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [manualColorInput, setManualColorInput] = useState(color);

  const handleUpdateLine = async () => {
    try {
      setLoading(true);
      await updateLine({ _id, color, stroke, discontinuous }, logout);
      
      // ✅ Guardar nuevos valores como "base"
      setBaseColor(color);
      setBaseStroke(stroke);
      setBaseDiscontinuous(discontinuous);

      setConfirmacion(true);
      setConfirmacionMensaje(screenTexts.ConfirmationMensaje);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(true);
      setErrorMessage(error.message);
    }
  };

  const toggleSettings = () => {
    if (editable) setShowSettings(!showSettings);
  };

  const renderDashedLine = () => {
    const totalWidth = 300;
    const segment = Math.max(discontinuous, 1);
    const pattern = [];
    let currentX = 0;

    while (currentX < totalWidth) {
      pattern.push(
        <View
          key={currentX}
          style={{
            width: segment,
            height: stroke,
            backgroundColor: color,
            marginRight: segment,
            borderRadius: stroke / 2,
          }}
        />
      );
      currentX += segment * 2;
    }

    return (
      <View style={{ flexDirection: 'row', marginBottom: 10, marginTop: 10 }}>
        {pattern}
      </View>
    );
  };

  const hasChanges =
    color.toUpperCase() !== baseColor.toUpperCase() ||
    stroke !== baseStroke ||
    discontinuous !== baseDiscontinuous;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={toggleSettings}
      activeOpacity={0.8}
      disabled={!editable}
    >
      <View style={{ flexDirection: 'row' }}>
        <Image source={{ uri: profileImage }} style={styles.profileImage} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.fullName}>{fullName}</Text>
        </View>
        {(!editable && !me) &&
          <TouchableOpacity style={styles.menu} onPress={() => setShowModal(true)}>
            <View style={styles.circulito}/>
            <View style={styles.circulito}/>
            <View style={styles.circulito}/>
          </TouchableOpacity>
        }
      </View>

      {editable && (discontinuous > 0 ? renderDashedLine() : (
        <View style={{
          height: stroke,
          backgroundColor: color,
          width: '100%',
          borderRadius: stroke / 2,
          marginBottom: 10,
          marginTop: 10
        }} />
      ))}

      {showSettings && (
        <View style={styles.settingsContainer}>
          <View style={styles.settingRowColor}>
            <Text style={styles.settingLabelColor}>{screenTexts.Color}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.colorRow}
              style={{ marginBottom: 10 }}
            >
              <TouchableOpacity
                onPress={() => {
                  setColor(baseColor);
                  setManualColorInput(baseColor);
                }}
                style={[
                  styles.colorCircle,
                  {
                    backgroundColor: baseColor,
                    borderWidth: 2,
                    borderColor: '#444',
                  }
                ]}
              />
              {predefinedColors.map((c, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setColor(c);
                    setManualColorInput(c);
                  }}
                  style={[styles.colorCircle, { backgroundColor: c }]}
                />
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.openColorPickerBtn} onPress={() => setShowColorPicker(true)}>
              <Text style={{ fontWeight: 'bold', fontSize: 12 }}>{screenTexts.OpenButton}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>{screenTexts.Stroke}</Text>
            <TextInput
              style={styles.input}
              value={String(stroke)}
              onChangeText={(text) => {
                // Permitimos editar libremente
                if (/^\d*$/.test(text)) setStroke(text);
              }}
              onEndEditing={() => {
                const num = Number(stroke);
                if (isNaN(num) || num < 1) setStroke(1);
                else if (num > 15) setStroke(15);
                else setStroke(num);
              }}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>{screenTexts.Discontinuous}</Text>
            <TextInput
              style={styles.input}
              value={String(discontinuous)}
              onChangeText={value => {
                const num = Number(value);
                if (isNaN(num)) return;
                if (num < 0) setDiscontinuous(0);
                else if (num > 30) setDiscontinuous(50);
                else setDiscontinuous(num);
              }}
              keyboardType="numeric"
              placeholder="0 = continua"
            />
          </View>
        </View>
      )}

      <Modal
        visible={showColorPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowColorPicker(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContainer}>
            <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 10 }}>{screenTexts.Title}</Text>

            <WheelColorPicker
              color={color}
              onColorChangeComplete={selectedColor => {
                const normalized = selectedColor.toUpperCase();
                setManualColorInput(normalized);
                setColor(normalized); // ✅ Actualiza el estado real del color
              }}
              onColorChange={newColor => {
                const normalized = newColor.toUpperCase();
                setManualColorInput(normalized);
                setColor(normalized); // ✅ Actualiza el estado real del color en tiempo real
              }}
              thumbStyle={{ height: 30, width: 30, borderRadius: 15 }}
              style={{ flex: 1 }}
            />

            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowColorPicker(false)}>
              <Text style={{ color: '#666' }}>{screenTexts.CloseButton}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {hasChanges && (
        <GradientButton
          text={screenTexts.GradientButton}
          color="Blue"
          onPress={handleUpdateLine}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "white",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 5 },
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 13,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  fullName: {
    fontSize: 12,
    marginBottom: 8,
  },
  settingsContainer: {
    marginTop: 10,
    width: '100%',
  },
  settingRowColor: {
    flexDirection: 'column',
    marginBottom: 8,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  settingLabelColor: {
    width: 150,
    fontSize: 14,
    color: '#9d9d9d',
    marginBottom: 10
  },
  settingLabel: {
    width: 150,
    fontSize: 14,
    color: '#9d9d9d',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  colorRow: {
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  openColorPickerBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderColor: '#1D7CE4',
    borderWidth: 2,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    height: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '90%',
    height: '80%',
    justifyContent: 'space-between',
  },
  cancelBtn: {
    marginTop: 20,
    alignItems: 'center',
  },
    menu:{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end',
        width: 20
    },
    circulito:{
        backgroundColor: 'gray',
        width:3,
        height:3,
        borderRadius: 4,
        marginTop: 3,

    },
});

export default RouteUser;
