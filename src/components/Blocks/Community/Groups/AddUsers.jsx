import React, { useImperativeHandle, forwardRef, useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from "../../../../context/useUser";
import { searcher } from '../../../../services/profileService';
import BuscadorComponente from '../../../Utils/Buscador';

const AddUsers = ({ visible, onClose, setSelectedUsersFather, setSelectedPhotos }, ref) => {
  const { logout, texts } = useUser();
  const screenTexts = texts.components.Blocks.Community.Groups.AddUsers
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const resetState = () => {
    setSearch('');
    setSearchResults([]);
    setSelectedUsers([]);
    setLoading(false);
  };

  useImperativeHandle(ref, () => ({
    resetState
  }));

  useEffect(() => {
    // Extraer solo los seleccionados
    const selected = selectedUsers.filter((user) => user.selected);

    // Enviar solo los _id
    setSelectedUsersFather(selected.map((user) => user._id));

    // Enviar los 3 primeros seleccionados completos
    setSelectedPhotos(selected.slice(0, 3));
  }, [selectedUsers]);

  const handleSearcher = async ({ search }) => {
    setLoading(true);
    try {
      const res = await searcher({ search, contact: false }, logout);
      const filtered = res.filter(
        (user) => !selectedUsers.some((u) => u._id === user._id)
      );
      setSearchResults(filtered);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search.trim()) {
      handleSearcher({ search });
    } else {
      setSearchResults([]);
    }
  }, [search]);

  const handleAddUser = (user) => {
    setSelectedUsers((prev) => [
      ...prev,
      { ...user, selected: true, disabled: false },
    ]);
    setSearch('');
    setSearchResults([]);
  };

  const toggleSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.map((user) =>
        user._id === userId ? { ...user, selected: !user.selected } : user
      )
    );
  };

  const renderSelectedItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => toggleSelection(item._id)}
      style={styles.userRow}
    >
      <Image source={{ uri: item.avatar?.url }} style={styles.avatar} />
      <View style={styles.userInfo}>
        <Text style={styles.name}>{`${item.name} ${item.surname}`}</Text>
        <Text style={styles.username}>{`@${item.kylotId}`}</Text>
      </View>
      <View style={styles.iconRight}>
        <Ionicons
          name={item.selected ? 'checkmark-circle' : 'ellipse-outline'}
          size={22}
          color={item.selected ? '#000' : '#ccc'}
        />
      </View>
    </TouchableOpacity>
  );

  const renderSearchResult = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleAddUser(item)}
      style={styles.resultRow}
    >
      <Image source={{ uri: item.avatar?.url }} style={styles.avatar} />
      <View>
        <Text style={styles.name}>{`${item.name} ${item.surname}`}</Text>
        <Text style={styles.username}>{`@${item.kylotId}`}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={() => {
            Keyboard.dismiss();
            onClose();
        }}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            {/* Header con buscador */}
            <View style={styles.header}>
              <Text style={styles.title}>{screenTexts.Title}</Text>
              <View style={styles.headerIcons}>
                <BuscadorComponente
                  placeholder={screenTexts.SearcherPlaceHolder}
                  search={search}
                  func={setSearch}
                />
              </View>

              {/* Resultados de búsqueda */}
              {searchResults.length > 0 && (
                <View style={styles.absoluteSearchBox}>
                  <FlatList
                    data={searchResults}
                    renderItem={renderSearchResult}
                    keyExtractor={(item) => item._id}
                    keyboardShouldPersistTaps="handled"
                  />
                </View>
              )}
            </View>

            {/* Lista de seleccionados */}
            <FlatList
              data={selectedUsers}
              renderItem={renderSelectedItem}
              keyExtractor={(item) => item._id}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  {screenTexts.NoUserAddText}
                </Text>
              }
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AddUsers;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    maxHeight: '80%',
    minHeight: '60%',
  },
  header: {
    position: 'relative',
    zIndex: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    marginTop:10
  },
  headerIcons: {
    width: '100%',
    marginTop: 10,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: 'white',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontWeight: '600',
    fontSize: 14,
  },
  username: {
    color: 'gray',
    fontSize: 13,
  },
  iconRight: {
    marginLeft: 10,
  },
  absoluteSearchBox: {
    position: 'absolute',
    top: 80, // ajusta si tu buscador es más alto
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    zIndex: 10,
    elevation: 10,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  emptyText: {
    color: 'gray',
    textAlign: 'center',
    alignSelf: 'center',
    marginTop: 100,
    fontSize:14
  },
});
