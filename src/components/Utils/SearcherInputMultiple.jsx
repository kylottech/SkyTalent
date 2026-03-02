import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useUser } from "../../context/useUser";
import { searcher } from '../../services/profileService';

const SearcherInputMultiple = ({
    setUserInfo,
    userInfo = [],
    setError,
    setErrorMessage,
    contact,
    customStyles = {} // 👈 Nuevo prop único para estilos
}) => {
    const { logout, texts } = useUser();
    const screenTexts = texts.components.Utils.SearcherInputMultiple;
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState([]);

    const effectiveContact = contact ?? 0;

    const handleSearcher = async (search) => {
        try {
            const res = await searcher({ search, contact: effectiveContact }, logout);
            setUsers(res);
        } catch (error) {
            setError(true);
            setErrorMessage(error.message);
        }
    };

    useEffect(() => {
        if (search.trim() !== '') {
            handleSearcher(search);
        } else {
            setUsers([]);
        }
    }, [search]);

    const handleSelectUser = (item) => {
        if (!userInfo.find(u => u._id === item._id)) {
            setUserInfo([...userInfo, item]);
        }
        setSearch('');
        setUsers([]);
    };

    const handleRemoveUser = (userId) => {
        setUserInfo(userInfo.filter(user => user._id !== userId));
    };

    return (
        <View style={[styles.container, customStyles.container]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Usuarios seleccionados */}
                {userInfo.length > 0 && (
                    <View style={styles.selectedUsersContainer}>
                        {userInfo.map((item) => (
                            <View key={item._id} style={[styles.selectedUser, customStyles.selectedUser]}>
                                <Image source={{ uri: item.avatar.url }} style={[styles.imageSmall, customStyles.imageSmall]} />
                                <Text style={[styles.selectedText, customStyles.selectedText]}>
                                    {item.kylotId}
                                </Text>
                                <TouchableOpacity onPress={() => handleRemoveUser(item._id)}>
                                    <Text style={[styles.removeIcon, customStyles.removeIcon]}>✕</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}

                {/* Input */}
                <View style={styles.inputGroup}>
                    <TextInput
                        value={search}
                        onChangeText={setSearch}
                        style={[styles.input, customStyles.input]}
                        placeholder={screenTexts.PlaceHolder}
                    />
                </View>

                {/* Resultados */}
                {users.length > 0 && (
                    <View style={styles.modal}>
                        <ScrollView contentContainerStyle={styles.listContent}>
                            {users
                                .filter(item => !userInfo.some(u => u._id === item._id))
                                .map((item) => (
                                    <TouchableOpacity
                                        key={item._id}
                                        style={[styles.userItem, customStyles.userItem]}
                                        onPress={() => handleSelectUser(item)}
                                    >
                                        <Image source={{ uri: item.avatar.url }} style={[styles.image, customStyles.image]} />
                                        <View style={styles.textContainer}>
                                            <Text style={styles.nombre}>{item.name} {item.surname}</Text>
                                            <Text style={styles.usuario}>@{item.kylotId}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                        </ScrollView>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 20,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    inputGroup: {
        gap: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        color: '#1F2937',
        height: 50,
    },
    modal: {
        marginTop: -12,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        maxHeight: 200,
        overflow: 'hidden',
    },
    listContent: {
        paddingVertical: 5,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    imageSmall: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 6,
    },
    textContainer: {
        flex: 1,
    },
    nombre: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
    },
    usuario: {
        fontSize: 12,
        color: '#6B7280',
    },
    selectedUsersContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 10,
    },
    selectedUser: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    selectedText: {
        marginRight: 6,
        fontSize: 14,
        color: '#1F2937',
    },
    removeIcon: {
        fontSize: 16,
        color: '#EF4444',
        fontWeight: 'bold',
    },
});

export default SearcherInputMultiple;
