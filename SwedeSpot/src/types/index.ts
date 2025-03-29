export type VehicleType = 'car' | 'electric' | 'bike' | 'scooter';

export interface ParkingSpot {
  id: string;
  location: {
    latitude: number;
    longitude: number;
  };
  type: VehicleType;
  available: boolean;
  pricePerHour?: number;
  maxParkingTime?: number;
  cleaningSchedule?: {
    days: string[];
    startTime: string;
    endTime: string;
  };
  nearbyPointsOfInterest?: {
    type: 'shop' | 'office' | 'event';
    distance: number;
  }[];
}

export const VEHICLE_TYPES: VehicleType[] = ['car', 'electric', 'bike', 'scooter'];
