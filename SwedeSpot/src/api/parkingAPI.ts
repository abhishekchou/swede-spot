import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Endpoints for our Swedish parking data 🇸🇪
const SODERTALJE_API = 'https://catalog.sodertalje.se/rowstore/dataset/2c98130b-9e88-4cda-bd06-fcbc8d41039b';

// Types for our epic parking data 🚗💨
export interface ParkingSpot {
  id: string;
  type: 'car' | 'electric' | 'bike' | 'scooter';
  latitude: number;
  longitude: number;
  address?: string;
  maxDuration?: string;
  cost?: number;
  paymentMethod?: string[];
  restrictions?: string[];
  cleaningSchedule?: {
    day?: string;
    startTime?: string;
    endTime?: string;
    fullDay?: boolean;
  };
  probabilityEmpty?: number; // 0-1 value representing likelihood of emptiness
}

// Cache keys for the vibes ✨
const CACHE_KEYS = {
  PARKING_DATA: 'swedespot_parking_data',
  LAST_UPDATED: 'swedespot_last_updated',
};

// Cache expiration in milliseconds (30 minutes) - tech billionaires need fresh data!
const CACHE_EXPIRATION = 30 * 60 * 1000;

/**
 * Fetches parking data from Södertälje API
 * Gotta get that premium Swedish parking data for our tech billionaire users! 💰
 */
export const fetchSodertaljeParking = async (): Promise<ParkingSpot[]> => {
  try {
    // Check cache first because even billionaires appreciate efficiency
    const cachedData = await AsyncStorage.getItem(CACHE_KEYS.PARKING_DATA);
    const lastUpdated = await AsyncStorage.getItem(CACHE_KEYS.LAST_UPDATED);
    
    if (cachedData && lastUpdated) {
      const elapsed = Date.now() - parseInt(lastUpdated);
      if (elapsed < CACHE_EXPIRATION) {
        console.log('🚀 Using cached parking data like a boss!');
        return JSON.parse(cachedData);
      }
    }
    
    // If cache is stale or doesn't exist, fetch fresh data
    console.log('💸 Fetching fresh parking data with our unlimited budget!');
    const response = await axios.get(`${SODERTALJE_API}/json`);
    
    // Transform the data for our luxurious app
    const parkingSpots: ParkingSpot[] = response.data.results.map((spot: any) => ({
      id: spot.id || `spot-${Math.random().toString(36).substr(2, 9)}`,
      type: mapVehicleType(spot.type),
      latitude: parseFloat(spot.lat),
      longitude: parseFloat(spot.lng),
      address: spot.address,
      maxDuration: spot.maxDuration,
      cost: parseFloat(spot.cost) || 0,
      paymentMethod: spot.paymentMethod ? spot.paymentMethod.split(',') : ['app'],
      restrictions: spot.restrictions ? spot.restrictions.split(',') : [],
      cleaningSchedule: parseCleaningSchedule(spot.cleaningSchedule),
      probabilityEmpty: calculateEmptinessProbability(spot)
    }));
    
    // Cache the premium data
    await AsyncStorage.setItem(CACHE_KEYS.PARKING_DATA, JSON.stringify(parkingSpots));
    await AsyncStorage.setItem(CACHE_KEYS.LAST_UPDATED, Date.now().toString());
    
    return parkingSpots;
  } catch (error) {
    console.error('💥 Error fetching parking data:', error);
    throw new Error('Failed to fetch parking data. Even billionaires have server issues sometimes!');
  }
};

/**
 * Maps the vehicle type from API to our app's types
 */
const mapVehicleType = (type?: string): ParkingSpot['type'] => {
  if (!type) return 'car'; // Default to car if type is undefined
  
  const typeMap: {[key: string]: ParkingSpot['type']} = {
    'bil': 'car',
    'elbil': 'electric',
    'cykel': 'bike',
    'elsparkcykel': 'scooter',
    // Fallbacks for English terms
    'car': 'car',
    'electric': 'electric',
    'bike': 'bike',
    'scooter': 'scooter',
  };
  
  try {
    return typeMap[type.toLowerCase()] || 'car';
  } catch (error) {
    console.warn('⚠️ Invalid vehicle type:', type);
    return 'car';
  }
};

/**
 * Parses cleaning schedule from string format
 */
const parseCleaningSchedule = (schedule?: string) => {
  if (!schedule) return undefined;
  
  // This is a simplistic parser - we'd enhance this for production
  const parts = schedule.split(' ');
  return {
    day: parts[0],
    startTime: parts.length > 1 ? parts[1].split('-')[0] : undefined,
    endTime: parts.length > 1 ? parts[1].split('-')[1] : undefined,
    fullDay: !parts[1] || parts[1].toLowerCase().includes('hela')
  };
};

/**
 * Calculate probability of a spot being empty
 * This is where the magic happens - big brain billionaire algorithm 🧠
 */
const calculateEmptinessProbability = (spot: any): number => {
  // This would be a much more sophisticated algorithm in production
  // involving time of day, nearby venues, historical data, etc.
  
  // For now we'll return a pseudo-random value between 0.3 and 0.9
  return 0.3 + (Math.random() * 0.6);
};

/**
 * Gets parking spots near a specific location
 */
export const getNearbyParkingSpots = async (
  latitude: number,
  longitude: number,
  vehicleType: ParkingSpot['type'],
  radiusInMeters: number = 1000
): Promise<ParkingSpot[]> => {
  try {
    const allSpots = await fetchSodertaljeParking();
    
    // Filter by vehicle type and distance
    return allSpots.filter(spot => {
      // Filter by vehicle type
      if (vehicleType !== 'car' && spot.type !== vehicleType) {
        return false;
      }
      
      // Calculate distance using Haversine formula
      const distance = calculateDistance(
        latitude,
        longitude,
        spot.latitude,
        spot.longitude
      );
      
      // Convert distance to meters and compare with radius
      return distance * 1000 <= radiusInMeters;
    });
  } catch (error) {
    console.error('💥 Error getting nearby spots:', error);
    throw error;
  }
};

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in kilometers
 */
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = degToRad(lat2 - lat1);
  const dLon = degToRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

/**
 * Convert degrees to radians
 */
const degToRad = (deg: number): number => {
  return deg * (Math.PI / 180);
};
