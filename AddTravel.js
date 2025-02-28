import React, { useState } from 'react';
import { SafeAreaView, Text, View, StyleSheet, TextInput, KeyboardAvoidingView, ScrollView, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';

const AddTravel = ({ route }) => {
    const [city, setCity] = React.useState('');
    const [country, setCountry] = React.useState('');
    const [name, setName] = React.useState('');
    const [rating, setRating] = React.useState(0);
    const [errors, setErrors] = useState({});
    const { username, refreshTravelData } = route.params;

    const validateForm = () => {
        let errors = {};
        if (!name) errors.name = "Name is required";
        if (!country) errors.country = "Country is required";
        if (!city) errors.city = "City is required";
        const numericRating = parseInt(rating, 10);
        if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) errors.rating = "Rating should be between 1 and 5";
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const verifyCityAndCountry = async () => {
        try {
            const geoResponse = await axios.get(
                `https://api.openrouteservice.org/geocode/search`,
                {
                    params: {
                        api_key: '5b3ce3597851110001cf6248f97b747e7e3d4ff1b0d31a75aad94638',
                        text: city,
                    },
                }
            );

            const features = geoResponse.data.features;

            if (features.length === 0) {
                Alert.alert("Invalid City", `The city '${city}' could not be found.`);
                return false;
            }

            const cityData = features[0];
            const cityCountry = cityData.properties.country;

            if (!cityCountry || cityCountry.toLowerCase() !== country.toLowerCase()) {
                Alert.alert(
                    "Mismatch",
                    `The city '${city}' is not in the country '${country}'.`
                );
                return false;
            }

            return true;
        } catch (error) {
            console.error("Error verifying city and country:", error);
            Alert.alert("Error", "There was an error validating the city and country. Please try again.");
            return false;
        }
    };

    const submitData = async () => {
        if (validateForm()) {
            const isValid = await verifyCityAndCountry();
            if (!isValid) return;

            try {
                const newTravel = { username, name, country, city, rating: parseInt(rating, 10) };
                const storedData = await AsyncStorage.getItem("travelData");
                let travelData = storedData ? JSON.parse(storedData) : {};
                if (!travelData[username]) {
                    travelData[username] = [];
                }
                travelData[username].push(newTravel);
                await AsyncStorage.setItem("travelData", JSON.stringify(travelData));

                if (refreshTravelData) {
                    await refreshTravelData();
                }
                setName("");
                setCountry("");
                setCity("");
                setRating("");
                setErrors({});
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <SafeAreaView>
            <ScrollView>
                <View>
                    <Text style={styles.titleText}>Add new travels</Text>
                </View>
                <KeyboardAvoidingView behavior="height" style={styles.form} >
                    <Text style={styles.textBeforeInput}>Name:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter name"
                        onChangeText={(text) => setName(text)}
                        value={name}
                        placeholderTextColor="#aaa"
                    />
                    {
                        errors.name ? <Text style={styles.errors}>{errors.name}</Text> : null
                    }
                    <Text style={styles.textBeforeInput}>Country:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter country"
                        onChangeText={(text) => setCountry(text)}
                        value={country}
                        placeholderTextColor="#aaa"
                    />
                    {
                        errors.country ? <Text style={styles.errors}>{errors.country}</Text> : null
                    }
                    <Text style={styles.textBeforeInput}>City:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter city"
                        onChangeText={(text) => setCity(text)}
                        value={city}
                        placeholderTextColor="#aaa"
                    />
                    {
                        errors.city ? <Text style={styles.errors}>{errors.city}</Text> : null
                    }
                    <Text style={styles.textBeforeInput}>Rating:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter rating"
                        onChangeText={(text) => setRating(text)}
                        value={rating}
                        keyboardType="number-pad"
                        placeholderTextColor="#aaa"
                    />
                    {
                        errors.rating ? <Text style={styles.errors}>{errors.rating}</Text> : null
                    }
                    <TouchableOpacity style={styles.button} onPress={submitData}>
                        <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create(
    {
        errors: {
            color: 'red',
            fontSize: 13,
        },
        form: {
            backgroundColor: '#fff',
            shadowColor: '#000',
            marginTop: 5,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            borderRadius: 8,
        },
        titleText: {
            fontFamily: 'Roboto',
            fontWeight: '500',
            marginTop: 30,
            marginBottom: 60,
            alignSelf: 'center',
            fontSize: 30,
            color: '#333',
        },
        textBeforeInput: {
            fontFamily: 'Roboto',
            fontSize: 17,
            marginTop: 20,
            marginLeft: 3,
        },
        button: {
            backgroundColor: '#1F51FF',
            padding: 16,
            borderRadius: 8,
            marginLeft: 70,
            marginRight: 70,
            marginBottom: 25,
            alignItems: 'center',
        },
        buttonText: {
            color: '#fff',
            fontSize: 20,
            fontWeight: '500',
        },
        input: {
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 8,
            padding: 12,
            marginBottom: 20,
            marginTop: 20,
            fontSize: 16,
            fontFamily: 'Roboto',
            color: '#333',
        },
        slider: {
            borderWidth: 1,
            borderColor: '#ddd',
            height: 40,
            width: '80%',
        },

    }
);

export default AddTravel;
