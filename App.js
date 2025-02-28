import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Login';
import CreateAccount from './CreateAccount';
import DrawerNavigator from './DrawerNavigator';
import AddTravel from './AddTravel';

const Stack = createStackNavigator();

const App = () => {


    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="CreateAccount" component={CreateAccount} />
                <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
                <Stack.Screen name="AddTravel" component={AddTravel} options={{ title: 'Travels' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
