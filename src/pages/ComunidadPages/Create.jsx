import React from "react";
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../../context/useUser";
import Top from "../../components/Utils/Top";

const Create = () => {
  const navigate = useNavigation();
  const { isLogged, isLoading, texts } = useUser();
  const screenTexts = texts.pages.ComunidadPages.Create;

  const options = [
    { label: screenTexts.Option1, value: "trucos" },
    { label: screenTexts.Option2, value: "consejos" },
    { label: screenTexts.Option3, value: "contactos" },
  ];

  return (
    <View style={styles.container}>
      <Top left={true} leftType={"Back"} typeCenter={"Text"} textCenter={screenTexts.Top} />
      <ScrollView style={styles.content}>
        <Text style={styles.title}>{screenTexts.Title}</Text>
        <View style={styles.optionsContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.optionButton}
              onPress={() => navigate.navigate('LocationCreate', { tipo: option.value })}
            >
              <Text style={styles.optionText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    padding: 16,
    maxWidth: 768,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    marginLeft: 10
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    padding: 16,
    borderRadius: 12,
    borderColor: '#e7e7e7',
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    backgroundColor: 'white'
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
});

export default Create;
