import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const Buscador = ({ placeholder, search, func, onFocus, onBlur, onFilterPress, showFilter = false, filterActive = false }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus && onFocus();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur && onBlur();
  };

  const clearSearch = () => {
    func('');
  };

  return (
    <View style={styles.container}>
      <View style={[
        styles.inputContainer,
        isFocused && styles.inputContainerFocused,
        showFilter && styles.inputContainerWithFilter
      ]}>
        <View style={styles.searchIconContainer}>
          <FontAwesome 
            name="search" 
            size={16} 
            color={isFocused ? "#007AFF" : "#6B7280"} 
            style={styles.searchIcon} 
          />
        </View>
        
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={search}
          onChangeText={func}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor="#6B7280"
          selectionColor="#007AFF"
        />
        
        {search.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={clearSearch}
            activeOpacity={0.6}
          >
            <FontAwesome 
              name="times-circle" 
              size={14} 
              color="#6B7280" 
            />
          </TouchableOpacity>
        )}
        
        {showFilter && (
          <TouchableOpacity 
            style={[
              styles.filterButton,
              filterActive && styles.filterButtonActive
            ]}
            onPress={onFilterPress}
            activeOpacity={0.6}
          >
            <FontAwesome 
              name="sliders" 
              size={14} 
              color={filterActive ? "#FFFFFF" : (isFocused ? "#007AFF" : "#6B7280")} 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 48,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputContainerFocused: {
    borderColor: '#007AFF',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputContainerWithFilter: {
    paddingRight: 8,
  },
  searchIconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  searchIcon: {
    // Estilos del ícono manejados por FontAwesome
  },
  input: {
    flex: 1,
    fontSize: 17,
    fontWeight: '400',
    color: '#000000',
    padding: 0,
    letterSpacing: -0.3,
    lineHeight: 22,
  },
  filterButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderRadius: 16,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  clearButton: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
});

export default Buscador;
