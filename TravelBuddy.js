import React, { useState } from 'react';
import {View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const TravelBuddy = () => {
    const [startCity, setStartCity] = useState('');
    const [destinationCity, setDestinationCity] = useState('');
    const [carDuration, setCarDuration] = useState(null);
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [message, setMessage] = useState('');
    const getClothingRecommendation = (temperature) => {
        if (temperature <=3) {
            return "\nIt's very cold! \nWear a thick jacket,\nscarf, gloves, and boots.";
        } else if (temperature > 3 && temperature <= 15) {
            return "\nIt's chilly. \nA sweater or a light jacket\nwould be a good choice.";
        } else if (temperature > 15 && temperature <= 25) {
            return "\nThe weather is moderate.\nA t-shirt with jeans\nor a light dress should be fine.";
        } else {
            return "\nIt's warm!\nWear light clothing like shorts,\nt-shirts, and sunglasses.We suggest wearing SPF.";
        }
    };

    const handleSearch = async () => {
        try {
            setCarDuration(null);
            setCurrentWeather(null);
            setForecast([]);
            setMessage('');

            const startGeoResponse = await axios.get(
                `https://api.openrouteservice.org/geocode/search`,
                {
                    params: {
                        api_key: '5b3ce3597851110001cf6248f97b747e7e3d4ff1b0d31a75aad94638',
                        text: startCity,
                    },
                }
            );

            if (startGeoResponse.data.features.length === 0) {
                alert('Starting city not found!');
                return;
            }

            const { coordinates: startCoordinates } = startGeoResponse.data.features[0].geometry;
            const [startLng, startLat] = startCoordinates;

            const destinationGeoResponse = await axios.get(
                `https://api.openrouteservice.org/geocode/search`,
                {
                    params: {
                        api_key: '5b3ce3597851110001cf6248f97b747e7e3d4ff1b0d31a75aad94638',
                        text: destinationCity,
                    },
                }
            );

            if (destinationGeoResponse.data.features.length === 0) {
                alert('Destination city not found!');
                return;
            }

            const { coordinates: destinationCoordinates } = destinationGeoResponse.data.features[0].geometry;
            const [destinationLng, destinationLat] = destinationCoordinates;

            try {
                const carResponse = await axios.get(
                    `https://api.openrouteservice.org/v2/directions/driving-car`,
                    {
                        params: {
                            api_key: '5b3ce3597851110001cf6248f97b747e7e3d4ff1b0d31a75aad94638',
                            start: `${startLng},${startLat}`,
                            end: `${destinationLng},${destinationLat}`,
                        },
                    }
                );

                const carTime = carResponse.data.features[0].properties.segments[0].duration;
                const hours = Math.floor(carTime / 3600);
                const minutes = Math.round((carTime % 3600) / 60);

                setCarDuration(`${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`);
            } catch (carError) {
                console.warn('No car routes available:', carError);
                setCarDuration('No available car routes');
            }


            const weatherResponse = await axios.get(
                `https://api.open-meteo.com/v1/forecast`,
                {
                    params: {
                        latitude: destinationLat,
                        longitude: destinationLng,
                        current_weather: true,
                        daily: 'temperature_2m_min,temperature_2m_max,weathercode',
                        timezone: 'auto',
                    },
                }
            );

            const current = weatherResponse.data.current_weather;
            const dailyForecast = weatherResponse.data.daily;

            setCurrentWeather(` ${current.temperature}°C`);
            const clothingRecommendation = getClothingRecommendation(current.temperature);
            setMessage(clothingRecommendation);

            const formattedForecast = dailyForecast.time.slice(1, 4).map((date, index) => {
                const formattedDate = new Date(date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                });

                const weatherCode = dailyForecast.weathercode[index];
                let icon = 'cloud';
                if (weatherCode === 0) icon = 'weather-sunny';
                else if (weatherCode === 1 || weatherCode === 2 || weatherCode === 3) icon = 'weather-cloudy';
                else if (weatherCode >= 61 && weatherCode <= 65) icon = 'weather-rainy';

                return {
                    date: formattedDate,
                    minTemp: dailyForecast.temperature_2m_min[index],
                    maxTemp: dailyForecast.temperature_2m_max[index],
                    icon,
                };
            });

            setForecast(formattedForecast);
        } catch (error) {
            console.error('Error fetching travel or weather data:', error);
            alert('An error occurred. Please check the city names or try again later.');
        }
    };


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Travel Buddy</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your current city"
                value={startCity}
                onChangeText={setStartCity}
            />
            <TextInput
                style={styles.input}
                placeholder="Enter the city you want to travel to"
                value={destinationCity}
                onChangeText={setDestinationCity}
            />
            <TouchableOpacity
                style={styles.button}
                onPress={handleSearch}
            >
                <Text style={styles.buttonText}>Calculate</Text>
            </TouchableOpacity>
            {carDuration && (
                <View style={styles.result}>
                    <Text style={styles.resultText}>Car Duration: {carDuration}</Text>
                </View>
            )}
            {currentWeather && (
                <View style={styles.result}>
                    <Text style={styles.resultText}>Current Weather in {destinationCity} : {currentWeather}</Text>
                </View>
            )}
            {message && (
                <View style={styles.result}>
                    <Text style={styles.resultText}>Clothing Recommendation:</Text>
                    <Text style={styles.messageText}>{message}</Text>
                </View>
            )}
            {forecast.length > 0 && (
                <View style={styles.result}>
                    <Text style={styles.resultText}>3-Day Forecast:</Text>
                    {forecast.map((day, index) => (
                        <View key={index} style={styles.forecastItem}>
                            <MaterialCommunityIcons name={day.icon} size={24} color="black" />
                            <Text style={styles.resultText}>
                                {day.date}: Min {day.minTemp}°C, Max {day.maxTemp}°C
                            </Text>
                        </View>
                    ))}
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding:10,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontFamily: 'Roboto',
        fontWeight: '500',
        marginBottom:40,
        alignSelf: 'center',
        fontSize: 30,
    },
    buttonText:{
        color: '#fff',
        fontSize: 17,
        fontFamily: 'Roboto',
        fontWeight: '500',
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
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    result: {
        marginTop: 20,
        alignItems: 'center',
    },
    resultText: {
        fontSize: 18,
        marginBottom: 10,
    },
    messageText:{
        fontSize: 18,
        marginBottom: 10,
        alignItems: 'center',
    },
    forecastItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
});

export default TravelBuddy;