import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
// These will be created later, but we're setting up the navigation now
const LoginScreen = () => <React.Fragment />;
const ProfileScreen = () => <React.Fragment />;
const NotificationsScreen = () => <React.Fragment />;
const ParkingDetailsScreen = () => <React.Fragment />;
const SettingsScreen = () => <React.Fragment />;

// Create navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main tab navigator - Because billionaires love fancy tab bars ud83dudcb0
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'Home') {
            return <FontAwesome5 name="home" size={size} color={color} />;
          } else if (route.name === 'Map') {
            return <FontAwesome5 name="map-marked-alt" size={size} color={color} />;
          } else if (route.name === 'Notifications') {
            return <MaterialIcons name="notifications" size={size} color={color} />;
          } else if (route.name === 'Profile') {
            return <FontAwesome5 name="user-circle" size={size} color={color} />;
          }
          
          return null;
        },
        tabBarActiveTintColor: '#0053A0', // Swedish blue for the vibez
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingVertical: 5,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: 'white',
          position: 'absolute',
          borderColor: 'transparent',
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          paddingBottom: 5,
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Main stack navigator - for those full-screen experiences
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#fff' },
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          presentation: 'card',
          animationEnabled: true,
          cardStyleInterpolator: ({ current, layouts }) => ({
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          }),
          headerLeft: () => null, // Disable back button but keep swipe
        }}
      >
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="ParkingDetails" component={ParkingDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
