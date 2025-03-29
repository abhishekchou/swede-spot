'use client';

import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ParkingMap } from './components/ParkingMap';
import { VehicleType, VEHICLE_TYPES } from './types';

export default function App() {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>('car');
  const [parkingSpots, setParkingSpots] = useState([]);

  const handleVehicleSelect = (vehicle: VehicleType) => {
    setSelectedVehicle(vehicle);
    // TODO: Fetch parking spots based on selected vehicle type
  };

  const handleSpotSelected = (spot: any) => {
    // TODO: Implement spot selection logic
    console.log('Selected spot:', spot);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SwedeSpot</Text>
        <View style={styles.vehicleSelector}>
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
        </View>
      </View>

      <ParkingMap
        selectedVehicle={selectedVehicle}
        parkingSpots={parkingSpots}
        onSpotSelected={handleSpotSelected}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Vibez Mode: ON</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    backgroundColor: '#007AFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  vehicleSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  vehicleButton: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 4,
  },
  vehicleButtonSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  vehicleButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
});
