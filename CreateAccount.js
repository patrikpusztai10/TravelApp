import React from 'react';
import {SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View,KeyboardAvoidingView} from 'react-native';
import {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
const CreateAccount = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [errors, setErrors] = useState({});
    const validateForm=()=>{
        let errors={}
        if(!email) errors.email="Email is required"
        if(!password) errors.password="Password is required"
        if(!username) errors.username="Username is required"
        setErrors(errors)
        return Object.keys(errors).length === 0;
    };
    const submitData = async () => {
        if (validateForm()) {
            try {
                const newUser = { email, password, username };
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

                // Check if username or email already exists
                const userExists = userData.some(
                    (user) => user.username === username || user.email === email
                );
                if (userExists) {
                    setErrors({ general: "Username or email already exists." });
                    return;
                }


                userData.push(newUser);
                await AsyncStorage.setItem("userData", JSON.stringify(userData));

                setUsername("");
                setEmail("");
                setPassword("");
                setErrors({});
                navigation.replace("DrawerNavigator", { username });
            } catch (error) {
                console.error("Error creating account", error);
            }
        }
    };
    return (
        <SafeAreaView style={styles.viewContainer}>
            <View style={styles.titleContainer}>
                <Text style={styles.welcomeText}>Register account</Text>
            </View>

            <KeyboardAvoidingView behavior="height" style={styles.form}>
                <Text style={styles.label}>E-mail</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your e-mail"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    keyboardType="email-address"
                    placeholderTextColor="#aaa"
                />
                {
                    errors.email ?<Text style={styles.errors}>{errors.email}</Text> : null
                }
                <Text style={styles.label}>Username</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your username"
                    value={username}
                    onChangeText={(text) => setUsername(text)}
                    placeholderTextColor="#aaa"
                />
                {
                    errors.username ?<Text style={styles.errors}>{errors.username}</Text> : null
                }
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Create password"
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    secureTextEntry={true}
                    placeholderTextColor="#aaa"
                />
                {
                    errors.password?<Text style={styles.errors}>{errors.password}</Text> : null
                }
                <TouchableOpacity style={styles.button} onPress={submitData}>
                    <Text style={styles.buttonText}>Sign up</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
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
        marginBottom:40,

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
        flex:0.8,
        justifyContent: 'space-around',
        padding:18,
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
    errors:{
        color: 'red',
        fontSize: 13,
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
        marginLeft:7,
        marginTop:40,
    }
});
export default CreateAccount;