declare module 'react-native-web-maps' {
  import { ViewStyle, StyleProp } from 'react-native';

  export interface Region {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }

  export interface Coordinate {
    latitude: number;
    longitude: number;
  }

  export interface MarkerProps {
    coordinate: Coordinate;
    pinColor?: string;
    onPress?: () => void;
    children?: React.ReactNode;
  }

  export interface MapViewProps {
    style?: StyleProp<ViewStyle>;
    region: Region;
    showsUserLocation?: boolean;
    followsUserLocation?: boolean;
    showsMyLocationButton?: boolean;
    showsCompass?: boolean;
    children?: React.ReactNode;
  }

  export const MapView: React.ComponentType<MapViewProps>;
  export const Marker: React.ComponentType<MarkerProps>;
}
