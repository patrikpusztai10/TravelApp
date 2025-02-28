import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, Text, TextInput, View, Alert, TouchableOpacity} from 'react-native';
import email from 'react-native-email';
const ReportBugScreen = ({navigation}) => {
    const [description,setDescription]=useState('');
    const sendBugReport = () => {
        if(!description.trim()){
            Alert.alert('Error',"Field cannot be empty");
            return;
        }
        const to=['patrikppg993@gmail.com'];
        email(to,{
            subject:'Bug Report-Travel App',
            body:description,
        }).catch((error) => console.log(error));
    }

    return (
        <SafeAreaView >
            <View>
                <Text style={styles.titleText}>Report Bug</Text>
            </View>
            <View style={styles.container}>
                <Text style={styles.descriptionText}> Please provide a description of the bug:</Text>
                <TextInput
                    editable
                    style={styles.input}
                    multiline={true}
                    numberOfLines={6}
                    maxLength={200}
                    placeholder="Enter description of the bug"
                    placeholderTextColor="#aaa"
                    textAlignVertical="top"
                    onChangeText={(text)=>setDescription(text)}
                    value={description}
                />
                <TouchableOpacity style={styles.button} onPress={sendBugReport}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>)
}
const styles = StyleSheet.create(
    {
        container:{
            marginLeft:4,
            marginTop:20,
        },
        descriptionText: {
            marginTop:40,
            fontFamily: 'Roboto',
            fontSize: 16,
        },
        titleText:{
            fontFamily: 'Roboto',
            fontWeight: '500',
            marginTop:60,
            alignSelf: 'center',
            fontSize: 30,
            color: '#333',
        },
        input: {
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 3,
            marginTop: 25,
            marginBottom: 20,
            height:150,
            fontSize: 16,
            fontFamily: 'Roboto',
            color: '#333',
            paddingHorizontal:10,
            textAlignVertical:'top',
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


    }
);
export default ReportBugScreen;