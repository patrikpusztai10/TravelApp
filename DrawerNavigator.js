import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './HomeScreen';
import TravelStatsScreen from './TravelStatsScreen';
import TravelsScreen from './TravelsScreen';
import ReportBugScreen from './ReportBugScreen';
import TravelBuddy from './TravelBuddy';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const Drawer = createDrawerNavigator();

const DrawerNavigator = ({route}) => {
    const {username}= route.params;
    return (
        <Drawer.Navigator  initialRouteName="HomeScreen" screenOptions={{ headerShown: false }}>
            <Drawer.Screen name="HomeScreen" component={HomeScreen} initialParams={{username}} options={{
                title: 'Home',
                drawerIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="home" color={color} size={size} />
                ),}}/>
            <Drawer.Screen name="TravelsScreen" component={TravelsScreen} initialParams={{username}} options={{title: 'Travels',
                drawerIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="airplane" color={color} size={size} />
                ),}} />
            <Drawer.Screen name="TravelBuddy" component={TravelBuddy} options={{title: 'TravelBuddy',
                drawerIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="car-clock" color={color} size={size} />
                ),}}/>
            <Drawer.Screen name="TravelStatsScreen" component={TravelStatsScreen} initialParams={{username}} options={{title: 'TravelStats',
                drawerIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="calculator-variant" color={color} size={size} />
                ),}} />
            <Drawer.Screen name="ReportBugScreen" component={ReportBugScreen} options={{title: 'Report Bug',
                drawerIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="alert-octagram" color={color} size={size} />
                ),}}/>
        </Drawer.Navigator>
    );
};
export default DrawerNavigator;
