import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useUser } from "../../context/useUser";
import { searcher } from '../../services/profileService';

const SearcherInput = ({ setUserInfo, userInfo, setError, setErrorMessage, contact }) => {
    const { logout, texts } = useUser();
    const screenTexts = texts.components.Utils.SearcherInput;
    const [search, setSearch] = useState(userInfo?.kylotId);
    const [users, setUsers] = useState([]);

    const effectiveContact = contact ?? 0; // 👈 aquí aplicas el valor por defecto

    const handleSearcher = async (search) => {
        try {
            await searcher({ search, contact: effectiveContact }, logout)
                .then((res) => {
                    setUsers(res);
                })
                .catch((error) => {
                    setError(true);
                    setErrorMessage(error.message);
                });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (search !== '') {
            handleSearcher(search);
        } else {
            setUsers([]);
        }
    }, [search]);

    const handleSelectUser = (item) => {
        setUserInfo(item);
        setSearch(item.kylotId);
        setUsers([]);
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>{screenTexts.KylotIdPlaceHolder}</Text>
                    <TextInput
                        value={search}
                        onChangeText={setSearch}
                        style={styles.input}
                        placeholder={screenTexts.KylotIdPlaceHolder}
                    />
                </View>

                {users.length > 0 && (
                    <View style={styles.modal}>
                        <ScrollView contentContainerStyle={styles.listContent}>
                            {users.map((item) => (
                                <TouchableOpacity
                                    key={item._id}
                                    style={styles.userItem}
                                    onPress={() => handleSelectUser(item)}
                                >
                                    <Image source={{ uri: item.avatar.url }} style={styles.image} />
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
        paddingBottom: 20, // Esto asegurará que el contenido se vea bien si es más largo
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
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
        maxHeight: 200, // Controla la altura máxima del modal
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
});

export default SearcherInput;
