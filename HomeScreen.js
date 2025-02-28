import React from 'react';
import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView} from "react-native";

const HomeScreen = ({route}) => {
    const {username} = route.params;
    const blogs = [
        {
            id: 1,
            title: "Travel Tips and Tricks",
            description: "Learn the best travel tips to save money, pack efficiently, and make the most out of your trips! For instance, find out how to book flights during off-peak hours to snag the best deals, use packing cubes to organize your luggage and maximize space, and download offline maps to navigate foreign cities without extra data costs.",
        },
        {
            id: 2,
            title: "Best Places to Visit",
            description: "Discover the most popular and breathtaking destinations around the world! From marveling at the majestic Eiffel Tower in Paris, exploring the vibrant streets of Tokyo, to relaxing on the pristine beaches of Maldives, this blog covers must-see spots that every traveler should add to their bucket list.",
        },
        {
            id: 3,
            title: "Most Underrated Places",
            description: "Explore hidden gems and less-traveled destinations for a unique experience! For example, visit the fairy-tale town of Hallstatt in Austria, trek through the lush and serene Sapa Valley in Vietnam, or immerse yourself in the rich culture and history of Sucre, Bolivia, a colonial city often overlooked by travelers.",
        },

];

    return (
        <SafeAreaView>
            <View>
                <Text style={styles.welcomeText}>Welcome, <Text style={styles.usernameText}>{username}</Text>!</Text>
            </View>

            <ScrollView style={styles.blogContainer}>
                {blogs.map((blog) => (
                    <TouchableOpacity key={blog.id} style={styles.blogCard}>
                        <Text style={styles.blogTitle}>{blog.title}</Text>
                        <Text style={styles.blogDescription}>{blog.description}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    usernameText: {
        color: '#1ecac3',
        shadowColor: '#000',
        shadowOpacity: 3,
        shadowRadius: 10,
    },
    welcomeText: {
        fontSize: 30,
        fontWeight: '400',
        fontFamily: 'Roboto',
        alignSelf: 'center',
        marginTop: 40,
    },
    blogContainer: {
        marginTop: 20,
        paddingHorizontal: 10,
    },
    blogCard: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    blogTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 5,
    },
    blogDescription: {
        fontSize: 14,
        color: '#555',
    },
});

export default HomeScreen;

