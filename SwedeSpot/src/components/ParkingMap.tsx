'use client';

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { ParkingSpot, VehicleType } from '../types';
import MapView, { Marker } from 'react-native-maps';
import { PROVIDER_GOOGLE } from 'react-native-maps';

interface ParkingMapProps {
  selectedVehicle: VehicleType;
  parkingSpots: ParkingSpot[];
  onSpotSelected: (spot: ParkingSpot) => void;
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

const mapStyle = [
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#ffdd00",
      },
    ],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [
      {
        color: "#ffd700",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#ff4500",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [
      {
        color: "#4169e1",
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [
      {
        color: "#228b22",
      },
    ],
  },
];

export function ParkingMap({ selectedVehicle, parkingSpots, onSpotSelected, initialRegion }: ParkingMapProps) {
  const [region, setRegion] = useState(initialRegion);
  const [isZooming, setIsZooming] = useState(false);

  useEffect(() => {
    // First show the whole city
    setRegion({
      ...initialRegion,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    });
    
    // Then zoom in after a short delay
    setTimeout(() => {
      setIsZooming(true);
      setRegion(initialRegion);
    }, 1000);
  }, [initialRegion]);

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
        zoomEnabled={true}
        rotateEnabled={true}
        scrollEnabled={true}
        pitchEnabled={true}
        showsTraffic={true}
        showsBuildings={true}
        showsIndoors={true}
        showsPointsOfInterest={true}
        showsIndoorLevelPicker={true}
      >
        {parkingSpots.map((spot) => (
          <Marker
            key={spot.id}
            coordinate={{
              latitude: spot.location.latitude,
              longitude: spot.location.longitude,
            }}
            onPress={() => onSpotSelected(spot)}
            pinColor={spot.available ? '#00FF00' : '#FF0000'}
          >
            <View style={[
              styles.marker,
              spot.available ? styles.markerAvailable : styles.markerOccupied,
            ]} />
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  marker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  markerAvailable: {
    backgroundColor: '#00FF00',
  },
  markerOccupied: {
    backgroundColor: '#FF0000',
  },
});
