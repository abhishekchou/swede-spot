import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Platform, TouchableOpacity, Animated } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Callout, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@react-native-vector-icons/MaterialCommunityIcons';
import { ParkingSpot, getNearbyParkingSpots } from '../api/parkingAPI';

// Map style in Swedish blue/yellow vibez 💰
const mapStyle = [
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      { "color": "#e9e9e9" },
      { "lightness": 17 }
    ]
  },
  {
    "featureType": "landscape",
    "elementType": "geometry",
    "stylers": [
      { "color": "#f5f5f5" },
      { "lightness": 20 }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.fill",
    "stylers": [
      { "color": "#ffffff" },
      { "lightness": 17 }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      { "color": "#ffffff" },
      { "lightness": 29 },
      { "weight": 0.2 }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      { "color": "#dedede" },
      { "lightness": 21 }
    ]
  },
];

interface MapScreenProps {
  navigation: any;
}

const MapScreen: React.FC<MapScreenProps> = ({ navigation }) => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [selectedVehicleType, setSelectedVehicleType] = useState<ParkingSpot['type']>('car');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const mapRef = useRef<MapView>(null);
  
  // Fancy animation for button press - billionaire level UX 💸
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      
      try {
        // Load those premium parking spots 🔥
        const spots = await getNearbyParkingSpots(
          location.coords.latitude,
          location.coords.longitude,
          selectedVehicleType
        );
        setParkingSpots(spots);
      } catch (error) {
        console.error('Failed to load parking spots:', error);
        setErrorMsg('Failed to load parking spots. Check connection.');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [selectedVehicleType]);
  
  // Change vehicle type and reload spots
  const changeVehicleType = async (type: ParkingSpot['type']) => {
    // Animate button press for luxury feel
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start();
    
    setSelectedVehicleType(type);
    setIsLoading(true);
    
    if (location) {
      try {
        const spots = await getNearbyParkingSpots(
          location.coords.latitude,
          location.coords.longitude,
          type
        );
        setParkingSpots(spots);
      } catch (error) {
        console.error('Failed to load parking spots:', error);
        setErrorMsg('Failed to load parking spots. Check connection.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Get marker color based on emptiness probability
  const getMarkerColor = (probability?: number): string => {
    if (!probability) return '#FFA500'; // Default orange
    
    if (probability > 0.7) return '#4CAF50'; // Green = likely empty
    if (probability > 0.4) return '#FFA500'; // Orange = maybe
    return '#F44336'; // Red = likely full
  };

  // Get icon based on vehicle type
  const getVehicleIcon = (type: ParkingSpot['type']): string => {
    switch (type) {
      case 'electric': return 'car-electric';
      case 'bike': return 'bike';
      case 'scooter': return 'scooter-electric';
      default: return 'car';
    }
  };

  // Format cost string like a billionaire would 💰
  const formatCost = (cost?: number): string => {
    if (cost === undefined) return 'Free';
    if (cost === 0) return 'Free';
    return `${cost} SEK/hour`;
  };

  let initialRegion: Region | undefined;
  
  if (location) {
    initialRegion = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }

  return (
    <View style={styles.container}>
      {errorMsg ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : (
        <>
          {location && (
            <MapView
              ref={mapRef}
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              customMapStyle={mapStyle}
              initialRegion={initialRegion}
              showsUserLocation
              showsMyLocationButton
              showsCompass
              showsScale
            >
              {parkingSpots.map((spot) => (
                <Marker
                  key={spot.id}
                  coordinate={{
                    latitude: spot.latitude,
                    longitude: spot.longitude,
                  }}
                  pinColor={getMarkerColor(spot.probabilityEmpty)}
                >
                  <Callout tooltip>
                    <View style={styles.calloutContainer}>
                      <Text style={styles.calloutTitle}>
                        {spot.type.charAt(0).toUpperCase() + spot.type.slice(1)} Parking
                      </Text>
                      {spot.address && (
                        <Text style={styles.calloutAddress}>{spot.address}</Text>
                      )}
                      <Text style={styles.calloutDetail}>
                        Cost: {formatCost(spot.cost)}
                      </Text>
                      {spot.maxDuration && (
                        <Text style={styles.calloutDetail}>
                          Max duration: {spot.maxDuration}
                        </Text>
                      )}
                      {spot.cleaningSchedule?.day && (
                        <Text style={styles.calloutWarning}>
                          Cleaning: {spot.cleaningSchedule.day} 
                          {spot.cleaningSchedule.startTime && spot.cleaningSchedule.endTime ? 
                            `${spot.cleaningSchedule.startTime}-${spot.cleaningSchedule.endTime}` : 
                            'All day'}
                        </Text>
                      )}
                      <Text style={styles.calloutProbability}>
                        {spot.probabilityEmpty && spot.probabilityEmpty > 0.7 
                          ? '🟢 Likely available' 
                          : spot.probabilityEmpty && spot.probabilityEmpty > 0.4 
                            ? '🟠 Maybe available' 
                            : '🔴 Likely full'}
                      </Text>
                      <TouchableOpacity 
                        style={styles.calloutButton}
                        onPress={() => {
                          // Navigate to details page
                          navigation.navigate('ParkingDetails', { spotId: spot.id });
                        }}
                      >
                        <Text style={styles.calloutButtonText}>View Details</Text>
                      </TouchableOpacity>
                    </View>
                  </Callout>
                </Marker>
              ))}
            </MapView>
          )}

          {/* SWAGGY VEHICLE TYPE SELECTOR - billionaire style 💎 */}
          <View style={styles.vehicleTypeContainer}>
            <TouchableOpacity 
              style={[
                styles.vehicleButton, 
                selectedVehicleType === 'car' && styles.selectedVehicleButton
              ]}
              onPress={() => changeVehicleType('car')}
            >
              <Text style={styles.vehicleButtonText}>🚗</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.vehicleButton, 
                selectedVehicleType === 'electric' && styles.selectedVehicleButton
              ]}
              onPress={() => changeVehicleType('electric')}
            >
              <Text style={styles.vehicleButtonText}>⚡🚗</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.vehicleButton, 
                selectedVehicleType === 'bike' && styles.selectedVehicleButton
              ]}
              onPress={() => changeVehicleType('bike')}
            >
              <Text style={styles.vehicleButtonText}>🚲</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.vehicleButton, 
                selectedVehicleType === 'scooter' && styles.selectedVehicleButton
              ]}
              onPress={() => changeVehicleType('scooter')}
            >
              <Text style={styles.vehicleButtonText}>🛴</Text>
            </TouchableOpacity>
          </View>

          {/* Loading indicator */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading premium parking spots...</Text>
            </View>
          )}
        </>
      )}
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
  },
  calloutContainer: {
    width: 250,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#0053A0',
  },
  calloutAddress: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  calloutDetail: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  calloutWarning: {
    fontSize: 14,
    color: '#F44336',
    marginTop: 4,
    marginBottom: 4,
  },
  calloutProbability: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 10,
  },
  calloutButton: {
    backgroundColor: '#0053A0',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  calloutButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  vehicleTypeContainer: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  vehicleButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginHorizontal: 5,
  },
  selectedVehicleButton: {
    backgroundColor: '#FECC02',
  },
  vehicleButtonText: {
    fontSize: 24,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
    borderRadius: 10,
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
  },
});

export default MapScreen;
