import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, Modal, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';

const TravelsScreen = ({ navigation, route }) => {
    const { username } = route.params;
    const [travelData, setTravelData] = React.useState([]);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [modalTravel, setModalTravel] = React.useState(null);

    const getTravelData = async (username) => {
        try {
            const storedData = await AsyncStorage.getItem('travelData');
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                return parsedData[username] || [];
            }
            return [];
        } catch (error) {
            console.error("Error retrieving travel data:", error);
            return [];
        }
    };

    const saveTravelData = async (username, updatedData) => {
        try {
            const storedData = await AsyncStorage.getItem('travelData');
            const parsedData = storedData ? JSON.parse(storedData) : {};
            parsedData[username] = updatedData;
            await AsyncStorage.setItem('travelData', JSON.stringify(parsedData));
        } catch (error) {
            console.error("Error saving travel data:", error);
        }
    };

    const openModal = (travel) => {
        setModalTravel(travel);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalTravel(null);
        setModalVisible(false);
    };

    const deleteTravel = async () => {
        if (!modalTravel) return;

        const updatedData = travelData.filter(travel => travel !== modalTravel);
        setTravelData(updatedData);
        await saveTravelData(username, updatedData);
        closeModal();
    };

    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                const data = await getTravelData(username);
                setTravelData(data || []);
            };
            fetchData();
        }, [username])
    );

    return (
        <SafeAreaView>
            <View>
                <Text style={styles.titleText}>Travels</Text>
            </View>
            <View>
                {travelData.map((travel, index) => (
                    <TouchableOpacity key={index} onPress={() => openModal(travel)}>
                        <Text style={styles.travelText}>{travel.name}</Text>
                    </TouchableOpacity>
                ))}
                <Modal animationType="slide" visible={modalVisible} transparent={true} onRequestClose={closeModal}>
                    <View style={styles.modal}>
                        <View style={styles.modalContent}>
                            {modalTravel && (
                                <View>
                                    <Text style={styles.modalText}>City: {modalTravel.city}</Text>
                                    <Text style={styles.modalText}>Country: {modalTravel.country}</Text>
                                    <Text style={styles.modalText}>Rating: {modalTravel.rating}</Text>
                                </View>
                            )}
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={closeModal}
                            >
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.deleteButton} onPress={deleteTravel}>
                                <MaterialCommunityIcons
                                    name="trash-can-outline"
                                    color="red"
                                    size={30}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate('AddTravel', {
                            username,
                            refreshTravelData: async () => {
                                const data = await getTravelData(username);
                                setTravelData(data || []);
                            },
                        })
                    }
                >
                    <MaterialCommunityIcons
                        name="plus-circle-outline"
                        color="gray"
                        size={60}
                        style={styles.icon}
                    />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    travelText: {
        fontSize: 20,
        fontFamily: 'Roboto',
        fontWeight: '400',
        padding:13,
    },
    deleteButton: {
        alignSelf: 'flex-end',
        bottom: 150,
    },
    titleText: {
        fontFamily: 'Roboto',
        fontWeight: '500',
        marginTop: 30,
        marginBottom:40,
        alignSelf: 'center',
        fontSize: 30,
        color: '#333',
    },
    icon: {
        position: 'absolute',
        top: 500,
        padding: 15,
        left: 310,
        right: 10,
    },
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        width: '80%',
    },
    modalText: {
        fontSize: 18,
        marginVertical: 5,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#1F51FF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default TravelsScreen;
