import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({navigation}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const validateForm = () => {
        let errors = {};
        if (!username) errors.username = "Username is required";
        if (!password) errors.password = "Password is required";
        setError(errors.username || errors.password || '');
        return Object.keys(errors).length === 0;
    };

    const isLogin = async () => {
        if (validateForm()) {
            try {
                const storedUsers = await AsyncStorage.getItem("userData");

                // Ensure we have an array to work with
                let userData = [];
                if (storedUsers) {
                    try {
                        userData = JSON.parse(storedUsers);
                        if (!Array.isArray(userData)) {
                            throw new Error("Invalid data format");
                        }
                    } catch (error) {
                        console.error("Error parsing user data", error);
                    }
                }

                // Find the user
                const validUser = userData.find(
                    (user) => user.username === username && user.password === password
                );
                if (validUser) {
                    return true;
                } else {
                    setError("Username or password doesn't match");
                    return false;
                }
            } catch (error) {
                console.log("Error logging in", error);
                setError("Something went wrong. Please try again.");
            }
        }
    };

    const handleLogin = async () => {
        const success = await isLogin();
        if (success) {
            navigation.replace('DrawerNavigator',{username: username});
        }
    };

    return (
        <SafeAreaView style={styles.viewContainer}>
            <View style={styles.titleContainer}>
                <Text style={styles.welcomeText}>Sign in to TravelApp</Text>
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your username"
                    placeholderTextColor="#aaa"
                    value={username}
                    onChangeText={setUsername}
                />
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    secureTextEntry={true}
                    placeholderTextColor="#aaa"
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                {error && <Text style={styles.errors}>{error}</Text>}
            </View>
            <View>
                <TouchableOpacity style={styles.noaccount} onPress={() => navigation.replace('CreateAccount')}>
                    <Text style={styles.label}>Don't have an account?</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f2f2f2',
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    welcomeText: {
        fontFamily: 'Roboto',
        fontWeight: '500',
        fontSize: 30,
        marginBottom: 40,
        marginTop: 120,
        color: '#333',
    },
    form: {
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 1,
    },
    label: {
        fontFamily: 'Roboto',
        fontSize: 16,
        color: '#555',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 30,
        fontSize: 16,
        fontFamily: 'Roboto',
        color: '#333',
    },
    button: {
        backgroundColor: '#1F51FF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    noaccount: {
        marginLeft: 7,
        marginTop: 40,
    },
    errors: {
        color: 'red',
        marginTop: 10,
        textAlign: 'center',
    },
});

export default Login;
