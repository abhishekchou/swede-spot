'use client';

import React, { useEffect, useState } from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import { ParkingMap } from './components/ParkingMap';
import { useLocation } from './hooks/useLocation';
import { VEHICLE_TYPES, VehicleType } from './types';

export default function App() {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>('car');
  const [parkingSpots, setParkingSpots] = useState([]);
  const [initialRegion, setInitialRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | undefined>(undefined);
  const { location, loading } = useLocation();
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (location) {
      // Set initial region with a wider view first
      setInitialRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      });
    }
  }, [location]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateY.value }
    ]
  }));

  const handleVehicleSelect = (vehicle: VehicleType) => {
    setSelectedVehicle(vehicle);
    // TODO: Fetch parking spots based on selected vehicle type
  };

  const handleSpotSelected = (spot: any) => {
    // TODO: Implement spot selection logic
    console.log('Selected spot:', spot);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>✨ Loading your location... 🌟</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('./assets/logo.svg')} style={styles.logo} />
        <Text style={styles.title}>SwedeSpot 🚗⚡🚲🛴</Text>
        <Animated.View style={[styles.vehicleSelector, animatedStyle]}>
          {VEHICLE_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.vehicleButton,
                selectedVehicle === type && styles.vehicleButtonSelected,
              ]}
              onPress={() => handleVehicleSelect(type)}>
              <Text style={styles.vehicleButtonText}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </View>

      <ParkingMap
        selectedVehicle={selectedVehicle}
        parkingSpots={parkingSpots}
        onSpotSelected={handleSpotSelected}
        initialRegion={initialRegion || {
          latitude: 59.3293,
          longitude: 18.0686,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Vibez Mode: 🚀 ON</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFD700', // Vibrant yellow background
  },
  header: {
    padding: Platform.OS === 'web' ? 32 : 24,
    backgroundColor: 'rgba(255, 215, 0, 0.8)',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logo: {
    width: 48,
    height: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: Platform.OS === 'web' ? 48 : 32,
    fontWeight: 'bold',
    color: '#2F4F4F',
    fontFamily: 'Arial',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    marginBottom: 24,
  },
  vehicleSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  vehicleButton: {
    padding: Platform.OS === 'web' ? 24 : 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 8,
    transform: [{ scale: 0.9 }],
  },
  vehicleButtonSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: [{ scale: 1 }],
  },
  vehicleButtonText: {
    color: '#2F4F4F',
    fontSize: Platform.OS === 'web' ? 24 : 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  footer: {
    padding: Platform.OS === 'web' ? 32 : 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  footerText: {
    color: '#2F4F4F',
    fontSize: Platform.OS === 'web' ? 24 : 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  loadingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2F4F4F',
    textAlign: 'center',
    padding: 32,
  },
});
