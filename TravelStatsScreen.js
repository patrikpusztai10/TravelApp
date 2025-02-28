import React, { useState, useCallback } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';

const TravelStats = ({ route }) => {
    const [ratingData, setRatingData] = useState([]);
    const { username } = route.params;

    const fetchTravelData = async () => {
        try {
            const storedData = await AsyncStorage.getItem("travelData");
            let travelData = storedData ? JSON.parse(storedData) : {};

            if (travelData[username]) {

                const ratingCounts = [0, 0, 0, 0, 0];
                travelData[username].forEach((travel) => {
                    const rating = travel.rating;
                    if (rating >= 1 && rating <= 5) {
                        ratingCounts[rating - 1]++;
                    }
                });
                const data = ratingCounts.map((count, index) => ({
                    name: `Rating ${index + 1}`,
                    population: count,
                    color: getColor(index),
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 15,
                }));

                setRatingData(data);
            }
        } catch (error) {
            console.error("Error fetching travel data:", error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchTravelData(); // Refresh data whenever screen is focused
        }, [])
    );

    const getColor = (index) => {
        const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];
        return colors[index % colors.length];
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Travel Ratings Statistics</Text>
            {ratingData.length > 0 ? (
                <PieChart
                    data={ratingData}
                    width={Dimensions.get("window").width - 16}
                    height={220}
                    chartConfig={{
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                    accessor={"population"}
                    backgroundColor={"transparent"}
                    paddingLeft={"15"}
                    center={[0, 0]}
                    absolute
                />
            ) : (
                <Text style={styles.noData}>No travel data available for this user.</Text>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 16,
    },
    title: {
        fontSize: 27,
        fontFamily: 'Roboto',
        fontWeight: '500',
        marginBottom: 60,
        marginTop:40,
        textAlign: "center",
    },
    noData: {
        fontSize: 22,
        color: "#999",
        textAlign: "center",
        marginTop: 50,
    },
});

export default TravelStats;
