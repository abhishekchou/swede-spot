import { View, Text, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { ParkingMap } from '@/src/components/ParkingMap';
import { VEHICLE_TYPES, VehicleType } from '@/src/types';
import React from 'react';

export default function HomeScreen() {
  const [selectedVehicle, setSelectedVehicle] = React.useState<VehicleType>(VEHICLE_TYPES[0]);

  const handleVehicleSelect = (type: VehicleType) => {
    setSelectedVehicle(type);
  };

  const handleSpotSelected = (spot: any) => {
    // TODO: Implement spot selection logic
    console.log('Selected spot:', spot);
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: 'SwedeSpot',
        }}
      />
      
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>SwedeSpot</Text>
          
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
            {VEHICLE_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={{
                  padding: 8,
                  backgroundColor: selectedVehicle === type ? '#007AFF' : '#F0F0F0',
                  borderRadius: 8,
                }}
                onPress={() => handleVehicleSelect(type)}>
                <Text style={{ color: selectedVehicle === type ? '#fff' : '#000' }}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <ParkingMap
          selectedVehicle={selectedVehicle}
          parkingSpots={[]}
          onSpotSelected={handleSpotSelected}
        />

        <View style={{ padding: 16 }}>
          <Text style={{ color: '#666' }}>Vibez Mode: ON</Text>
        </View>
      </View>
    </View>
  );
}
