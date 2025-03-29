import { useState, useEffect } from 'react';

export function useLocation() {
  const [location, setLocation] = useState({
    latitude: 59.3293, // Stockholm
    longitude: 18.0686,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLocation = async () => {
      try {
        // TODO: Implement actual location fetching
        // For now, using Stockholm as a fallback
        setLocation({
          latitude: 59.3293,
          longitude: 18.0686,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } catch (error) {
        console.error('Error getting location:', error);
      } finally {
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  return { location, loading };
}
