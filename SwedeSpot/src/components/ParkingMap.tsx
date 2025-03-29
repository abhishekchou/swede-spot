'use client';

import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { ParkingSpot, VehicleType } from '@/src/types';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface ParkingMapProps {
  selectedVehicle: VehicleType;
  parkingSpots: ParkingSpot[];
  onSpotSelected: (spot: ParkingSpot) => void;
}

export function ParkingMap({ selectedVehicle, parkingSpots, onSpotSelected }: ParkingMapProps) {
  const [position, setPosition] = useState({
    lat: 59.3293, // Stockholm
    lng: 18.0686,
  });

  const mapRef = useRef(null);

  useEffect(() => {
    // TODO: Implement real-time location updates
    // This is just a placeholder
    const timer = setInterval(() => {
      setPosition(prev => ({
        ...prev,
        lat: prev.lat + 0.0001,
      }));
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <MapContainer
        ref={mapRef}
        center={position}
        zoom={12}
        style={styles.map}
        scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {parkingSpots.map((spot) => (
          <Marker
            key={spot.id}
            position={spot.location}
            icon={L.divIcon({
              className: 'custom-marker',
              html: `<div style="background-color: ${spot.available ? 'green' : 'red'}; width: 20px; height: 20px; border-radius: 50%;"></div>`,
              iconSize: [20, 20],
            })}
            eventHandlers={{
              click: () => onSpotSelected(spot),
            }}>
            <Popup>
              <div style={{ textAlign: 'center' }}>
                <h3>{spot.available ? 'Available' : 'Occupied'}</h3>
                {spot.pricePerHour && (
                  <p>${spot.pricePerHour}/hr</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
