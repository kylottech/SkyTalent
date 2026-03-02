import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useUser } from "../../context/useUser";
import { categorySearcher } from '../../services/communityServices';

const CategoryInput = ({
    setUserInfo,
    userInfo,
    setError,
    setErrorMessage,
    title,
    inputStyle
}) => {
    const { logout, texts, translateTag } = useUser();
    const screenTexts = texts.components.Utils.CategoryInput;

    const [search, setSearch] = useState(userInfo?.category || userInfo || '');
    const [users, setUsers] = useState([]);

    const handleSearcher = async (search) => {
        try {
            const res = await categorySearcher({ search }, logout);
            setUsers(translateTag(res));
        } catch (error) {
            setError(true);
            setErrorMessage(error.message);
        }
    };

    useEffect(() => {
        console.log(userInfo)
        if (search !== '') {
            handleSearcher(search);
        } else {
            setUsers([]);
        }
    }, [search]);

    const handleSelectUser = (item) => {
        setUserInfo(item);
        setSearch(item.category);
        setUsers([]); // Ocultar la lista
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <View style={styles.inputGroup}>
                    {title &&
                        <Text style={styles.label}>{screenTexts.Title}</Text>
                    }
                    <TextInput
                        value={search}
                        onChangeText={(text) => {
                            setSearch(text);
                        }}
                        style={[styles.input, inputStyle]}
                        placeholder={screenTexts.PlaceHolder}
                    />
                </View>

                {users.length > 0 && (
                    <View style={styles.modal}>
                        <ScrollView contentContainerStyle={styles.listContent} keyboardShouldPersistTaps="handled">
                            {users.map((item) => (
                                <TouchableOpacity
                                    key={item._id}
                                    style={styles.userItem}
                                    onPress={() => handleSelectUser(item)}
                                >
                                    <View style={styles.textContainer}>
                                        <Text style={styles.nombre}>{item.category}</Text>
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
        //paddingBottom: 20,
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
    textContainer: {
        flex: 1,
    },
    nombre: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
    },
});

export default CategoryInput;
