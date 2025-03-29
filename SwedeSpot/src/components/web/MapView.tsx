import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

interface MapViewProps {
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  style?: any;
  children?: React.ReactNode;
  provider?: string;
  customMapStyle?: any[];
}

interface MarkerProps {
  position: {
    lat: number;
    lng: number;
  };
  onClick: () => void;
  children?: React.ReactNode;
}

const MapView: React.FC<MapViewProps> = ({ initialRegion, style, children, provider, customMapStyle }) => {
  const mapOptions = {
    zoomControl: true,
    streetViewControl: true,
    mapTypeControl: true,
    fullscreenControl: true,
    styles: customMapStyle,
  };

  return (
    <View style={styles.container}>
      <LoadScript
        googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY"
        libraries={['places']}
      >
        <GoogleMap
          mapContainerStyle={style}
          center={{ lat: initialRegion.latitude, lng: initialRegion.longitude }}
          zoom={13}
          options={mapOptions}
        >
          {children}
        </GoogleMap>
      </LoadScript>
    </View>
  );
};

const Marker: React.FC<MarkerProps> = ({ position, onClick, children }) => {
  return (
    <div
      style={{
        position: 'absolute',
        transform: `translate(${position.lng}px, ${position.lat}px)`,
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export { MapView, Marker };

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
