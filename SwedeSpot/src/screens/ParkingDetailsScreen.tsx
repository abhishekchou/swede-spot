import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  Share, 
  Alert, 
  Platform, 
  ViewStyle, 
  TextStyle, 
  ImageStyle,
  Image,
  Linking,
  Dimensions
} from 'react-native';
import { FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import MapView, { Marker, Region } from 'react-native-maps';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface ParkingSpot {
  id: string;
  type: string;
  latitude: number;
  longitude: number;
  address: string;
  maxDuration: string;
  cost: string;
  paymentMethod?: string[];
  restrictions?: string[];
  cleaningSchedule?: {
    day: string;
    startTime?: string;
    endTime?: string;
    fullDay?: boolean;
  };
  probabilityEmpty?: number;
}

type RootStackParamList = {
  ParkingDetails: { spotId: string };
  Home: undefined;
};

type ParkingDetailsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ParkingDetails'
>;

interface ParkingDetailsScreenProps {
  route: { params: { spotId: string } };
  navigation: ParkingDetailsScreenNavigationProp;
}

// Mock data for our billionaire demo 💰
const MOCK_PARKING_SPOT: ParkingSpot = {
  id: 'spot123',
  type: 'car',
  latitude: 59.2098,
  longitude: 17.6298,
  address: 'Storgatan 42, Södertälje',
  maxDuration: '4 hours',
  cost: '20 SEK/hour',
  paymentMethod: ['app', 'credit card', 'SMS'],
  restrictions: ['No parking during cleaning hours'],
  cleaningSchedule: {
    day: 'Wednesday',
    startTime: '10:00',
    endTime: '12:00',
    fullDay: false,
  },
  probabilityEmpty: 0.75,
};

const ParkingDetailsScreen: React.FC<ParkingDetailsScreenProps> = ({ route, navigation }) => {
  const [parkingSpot, setParkingSpot] = useState<ParkingSpot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(true);

  useEffect(() => {
    const { spotId } = route.params;
    loadParkingSpotDetails(spotId);
  }, [route.params.spotId]);

  const loadParkingSpotDetails = async (spotId: string) => {
    try {
      setLoading(true);
      setError(null);
      // For our billionaire demo, we'll use mock data 🤑
      setParkingSpot(MOCK_PARKING_SPOT);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const toggleFavorite = async () => {
    try {
      setIsFavorite(!isFavorite);
      // TODO: Implement actual favorite toggle API call
      await fetch(`https://api.swedespot.com/parking/${parkingSpot?.id}/favorite`, {
        method: 'POST',
        body: JSON.stringify({ favorite: !isFavorite }),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update favorite status');
      setIsFavorite(!isFavorite); // Revert on error
    }
  };

  const handleShare = async () => {
    if (!parkingSpot) return;

    try {
      await Share.share({
        title: 'Check out this parking spot! 🚗',
        message: `${parkingSpot.address} - ${parkingSpot.type}\nCost: ${parkingSpot.cost}\nMax Duration: ${parkingSpot.maxDuration}`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to share parking spot');
    }
  };

  const handleNavigation = () => {
    if (!parkingSpot) return;

    const url = Platform.select({
      ios: `maps://app?daddr=${parkingSpot.latitude},${parkingSpot.longitude}`,
      android: `google.navigation:q=${parkingSpot.latitude},${parkingSpot.longitude}`,
    });

    if (url) {
      Linking.openURL(url).catch(err => {
        setError('Failed to open navigation app');
      });
    }
  };

  // Hide swipe hint after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowSwipeHint(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading parking details... 🚗</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Oops! Something went wrong 😅</Text>
        <Text style={styles.errorDetail}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => loadParkingSpotDetails(route.params.spotId)}
        >
          <Text style={styles.retryButtonText}>Try Again 🔄</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!parkingSpot) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No parking spot found 🤔</Text>
      </View>
    );
  }

      setIsFavorite(!isFavorite); // Revert on error
    }
  };
    if (!parkingSpot) return;

    const url = Platform.select({
      ios: `maps://app?daddr=${parkingSpot.latitude},${parkingSpot.longitude}`,
      android: `google.navigation:q=${parkingSpot.latitude},${parkingSpot.longitude}`,
    });

    if (url) {
      Linking.openURL(url).catch(err => {
        setError('Failed to open navigation app');
      });
    }
  };
  // States are already declared above, no need to redeclare

  // Hide swipe hint after 3 seconds
  useEffect(() => {
    try {
      const timer = setTimeout(() => setShowSwipeHint(false), 3000);
      return () => clearTimeout(timer);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  }, []);

  // Handle errors gracefully
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Oops! Something went wrong 😅</Text>
        <Text style={styles.errorDetail}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            setError(null);
            // Add any retry logic here
          }}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  }, []);
  
  useEffect(() => {
    // In a real app, we'd fetch this from API or local storage
    // But for our billionaire demo, we'll just simulate a fetch
    setTimeout(() => {
      setParkingSpot(MOCK_PARKING_SPOT);
      setLoading(false);
    }, 1000);
  }, [spotId]);
  
  const handleNavigate = () => {
    // In a real app, this would open navigation to the spot
    if (parkingSpot) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${parkingSpot.latitude},${parkingSpot.longitude}&travelmode=driving`;
      Linking.openURL(url);
    }
  };
  
  const handleShare = async () => {
    try {
      if (parkingSpot) {
        await Share.share({
          message: `Check out this parking spot I found on SwedeSpot! 🚗\n\n${parkingSpot.address}\nCost: ${parkingSpot.cost} SEK/hour\n\nGet SwedeSpot now and find premium parking spots like this one!`,
          url: 'https://k9coliving.com', // Placeholder for app store link
          title: 'SwedeSpot - Premium Parking Finder',
        });
      } catch (error) {
        Alert.alert('Error sharing', 'Something went wrong when trying to share this spot');
      }
    }
  };
  
  const toggleFavorite = () => {
    try {
    // In a real app, we'd save this to user preferences
      setIsFavorite(!isFavorite);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
    if (!isFavorite) {
      Alert.alert('Added to Favorites', 'This parking spot has been added to your favorites!');
    }
  };
  
  const getNextCleaningText = () => {
    try {
    if (!parkingSpot?.cleaningSchedule) return 'No cleaning information available';
    
    const { day, startTime, endTime, fullDay } = parkingSpot.cleaningSchedule;
    if (fullDay) {
      return `Next cleaning: All day on ${day}`;
    }
    return `Next cleaning: ${day} ${startTime} - ${endTime}`;
  };
  
  const getAvailabilityText = () => {
    try {
    if (!parkingSpot?.probabilityEmpty) return 'Unknown availability';
    
    if (parkingSpot.probabilityEmpty > 0.7) {
      return 'Likely Available';
    } else if (parkingSpot.probabilityEmpty > 0.4) {
      return 'Medium Availability';
    } else {
      return 'Likely Full';
    }
  };
  
  const getAvailabilityColor = () => {
    try {
    if (!parkingSpot?.probabilityEmpty) return '#FFA500';
    
    if (parkingSpot.probabilityEmpty > 0.7) {
      return '#4CAF50';
    } else if (parkingSpot.probabilityEmpty > 0.4) {
      return '#FFA500';
    } else {
      return '#F44336';
    }
  };
  
  if (loading || !parkingSpot) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0053A0" />
        <Text style={styles.loadingText}>Loading premium parking details...</Text>
        <StatusBar style="auto" />
      </View>
    );
  }
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0053A0" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContent}>
      {/* Back button */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={28} color="#0053A0" />
      </TouchableOpacity>

      {/* Swipe hint */}
      {showSwipeHint && (
        <View style={styles.swipeHint}>
          <Ionicons name="hand-left" size={24} color="#0053A0" />
          <Text style={styles.swipeHintText}>Swipe right to go back</Text>
        </View>
      )}

      <ScrollView style={styles.scrollContent}>
        <View style={styles.contentContainer}>
          <View style={styles.mapPreview}>
            <TouchableOpacity 
              style={styles.favoriteButton} 
              onPress={toggleFavorite}
            >
              <Ionicons 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={24} 
                color={isFavorite ? "#F44336" : "white"} 
              />
            </TouchableOpacity>
            
            {/* In a real app, this would be a real map preview */}
            <View style={styles.mapPlaceholder}>
              <Text style={styles.mapPlaceholderText}>Map Preview</Text>
              <FontAwesome5 name="map-marked-alt" size={50} color="#0053A0" />
            </View>
          </View>
          
          <View style={styles.detailsContainer}>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.title}>{parkingSpot.type.charAt(0).toUpperCase() + parkingSpot.type.slice(1)} Parking</Text>
                <Text style={styles.address}>{parkingSpot.address}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
          <View style={styles.mapPreview}>
            <TouchableOpacity 
              style={styles.favoriteButton} 
              onPress={toggleFavorite}
            >
              <Ionicons 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={24} 
                color={isFavorite ? "#F44336" : "white"} 
              />
            </TouchableOpacity>
            
            {/* In a real app, this would be a real map preview */}
            <View style={styles.mapPlaceholder}>
              <Text style={styles.mapPlaceholderText}>Map Preview</Text>
              <FontAwesome5 name="map-marked-alt" size={50} color="#0053A0" />
            </View>
          </View>
          
          <View style={styles.detailsContainer}>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.title}>{parkingSpot.type.charAt(0).toUpperCase() + parkingSpot.type.slice(1)} Parking</Text>
                <Text style={styles.address}>{parkingSpot.address}</Text>
              </View>
            </View>

      
      <View style={styles.detailsContainer}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>{parkingSpot.type.charAt(0).toUpperCase() + parkingSpot.type.slice(1)} Parking</Text>
            <Text style={styles.address}>{parkingSpot.address}</Text>
          </View>
          
          <View style={[styles.availabilityBadge, { backgroundColor: getAvailabilityColor() }]}>
            <Text style={styles.availabilityText}>{getAvailabilityText()}</Text>
          </View>
        </View>
        
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <MaterialIcons name="attach-money" size={24} color="#555" />
              <Text style={styles.infoLabel}>Cost</Text>
              <Text style={styles.infoValue}>{parkingSpot.cost} SEK/h</Text>
            </View>
            
            <View style={styles.infoItem}>
              <MaterialIcons name="timer" size={24} color="#555" />
              <Text style={styles.infoLabel}>Max Duration</Text>
              <Text style={styles.infoValue}>{parkingSpot.maxDuration}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <MaterialIcons name="credit-card" size={24} color="#555" />
              <Text style={styles.infoLabel}>Payment</Text>
              <Text style={styles.infoValue}>{parkingSpot.paymentMethod.join(', ')}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <MaterialIcons name="cleaning-services" size={24} color="#555" />
              <Text style={styles.infoLabel}>Cleaning</Text>
              <Text style={styles.infoValue}>{parkingSpot.cleaningSchedule?.day || 'N/A'}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.noteSection}>
          <Text style={styles.noteSectionTitle}>Cleaning Schedule</Text>
          <View style={styles.noteCard}>
            <MaterialIcons name="event" size={24} color="#F44336" />
            <Text style={styles.noteText}>{getNextCleaningText()}</Text>
          </View>
          
          {parkingSpot.restrictions && parkingSpot.restrictions.length > 0 && (
            <>
              <Text style={styles.noteSectionTitle}>Restrictions</Text>
              {parkingSpot.restrictions.map((restriction, index) => (
                <View key={index} style={styles.noteCard}>
                  <MaterialIcons name="warning" size={24} color="#FFA500" />
                  <Text style={styles.noteText}>{restriction}</Text>
                </View>
              ))}
            </>
          )}
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.navigateButton]} 
            onPress={handleNavigate}
          >
            <FontAwesome5 name="directions" size={20} color="white" />
            <Text style={styles.actionButtonText}>Navigate</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.shareButton]} 
            onPress={handleShare}
          >
            <FontAwesome5 name="share-alt" size={20} color="white" />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>Premium parking information powered by SwedeSpot AI ud83eudd16</Text>
          <Text style={styles.disclaimerText}>Data last updated: Today at 12:30 PM</Text>
        </View>
      </View>
      <StatusBar style="light" />
        </View>
      </ScrollView>
  );
};

type StylesType = {
  container: ViewStyle;
  contentContainer: ViewStyle;
  scrollContent: ViewStyle;
  detailsContainer: ViewStyle;
  headerRow: ViewStyle;
  actionButtons: ViewStyle;
  infoContainer: ViewStyle;
  infoRow: ViewStyle;
  divider: ViewStyle;
  noteContainer: ViewStyle;
  scheduleContainer: ViewStyle;
  mapContainer: ViewStyle;
  loadingContainer: ViewStyle;
  errorContainer: ViewStyle;
  swipeHintContainer: ViewStyle;
  disclaimer: ViewStyle;
  mapStyle: ViewStyle;
  mapPreview: ViewStyle;
  mapPlaceholder: ViewStyle;
  mapPlaceholderText: TextStyle;
  mapImage: ImageStyle;
  backButton: ViewStyle;
  favoriteButton: ViewStyle;
  shareButton: ViewStyle;
  navigateButton: ViewStyle;
  actionButton: ViewStyle;
  retryButton: ViewStyle;
  infoIcon: TextStyle;
  favoriteIcon: TextStyle;
  shareIcon: TextStyle;
  navigationIcon: TextStyle;
  detailIcon: TextStyle;
  title: TextStyle;
  address: TextStyle;
  infoText: TextStyle;
  loadingText: TextStyle;
  errorText: TextStyle;
  errorDetail: TextStyle;
  retryButtonText: TextStyle;
  actionButtonText: TextStyle;
  swipeHintText: TextStyle;
  disclaimerText: TextStyle;
  noteText: TextStyle;
  probabilityText: TextStyle;
  scheduleText: TextStyle;
  noteSectionTitle: TextStyle;
}
  container: ViewStyle;
  contentContainer: ViewStyle;
  scrollContent: ViewStyle;
  detailsContainer: ViewStyle;
  headerRow: ViewStyle;
  actionButtons: ViewStyle;
  infoContainer: ViewStyle;
  infoRow: ViewStyle;
  divider: ViewStyle;
  noteContainer: ViewStyle;
  scheduleContainer: ViewStyle;
  mapContainer: ViewStyle;
  loadingContainer: ViewStyle;
  errorContainer: ViewStyle;
  swipeHintContainer: ViewStyle;
  disclaimer: ViewStyle;

  // Map
  mapStyle: ViewStyle;
  mapPreview: ViewStyle;
  mapPlaceholder: ViewStyle;
  mapPlaceholderText: TextStyle;
  mapImage: ImageStyle;

  // Buttons
  backButton: ViewStyle;
  favoriteButton: ViewStyle;
  shareButton: ViewStyle;
  navigateButton: ViewStyle;
  actionButton: ViewStyle;
  retryButton: ViewStyle;

  // Icons
  infoIcon: TextStyle;
  favoriteIcon: TextStyle;
  shareIcon: TextStyle;
  navigationIcon: TextStyle;
  detailIcon: TextStyle;

  // Text
  title: TextStyle;
  address: TextStyle;
  infoText: TextStyle;
  loadingText: TextStyle;
  errorText: TextStyle;
  errorDetail: TextStyle;
  retryButtonText: TextStyle;
  actionButtonText: TextStyle;
  swipeHintText: TextStyle;
  disclaimerText: TextStyle;
  noteText: TextStyle;
  probabilityText: TextStyle;
  scheduleText: TextStyle;
  noteSectionTitle: TextStyle;
};

const styles = StyleSheet.create<StylesType>({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  detailsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  infoContainer: {
    marginTop: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
  },
  noteContainer: {
    marginTop: 16,
  },
  scheduleContainer: {
    marginTop: 16,
  },
  mapContainer: {
    height: 200,
    marginVertical: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  swipeHintContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  disclaimer: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  mapStyle: {
    width: '100%',
    height: '100%',
  },
  mapPreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  } as ViewStyle,
  mapPlaceholderText: {
    fontSize: 16,
    color: '#666',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
  },
  favoriteButton: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  shareButton: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  navigateButton: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  infoIcon: {
    fontSize: 20,
    color: '#666',
    marginRight: 10,
  },
  favoriteIcon: {
    fontSize: 24,
    color: '#FF69B4',
  },
  shareIcon: {
    fontSize: 24,
    color: '#007AFF',
  },
  navigationIcon: {
    fontSize: 24,
    color: '#4CAF50',
  },
  detailIcon: {
    fontSize: 20,
    color: '#666',
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  address: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  errorText: {
    fontSize: 18,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorDetail: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  retryButtonText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
  },
  swipeHintText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  noteText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
    flex: 1
  }
  },
  probabilityText: {
    fontSize: 14,
    color: '#4CAF50',
    marginLeft: 10,
  },
  scheduleText: {
    fontSize: 14,
    color: '#FF3B30',
    marginLeft: 10,
  },
  noteSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    flexGrow: 1,
  },
  detailsContainer: {
    marginTop: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  infoContainer: {
    marginTop: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
  noteContainer: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  scheduleContainer: {
    marginTop: 16,
  },
  mapContainer: {
    height: 200,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  swipeHintContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  disclaimer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  mapStyle: {
    width: '100%',
    height: '100%',
  },
  mapPreview: {
    width: '100%',
    height: 200,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    color: '#666666',
    fontSize: 14,
  },
  mapImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  backButton: {
    padding: 8,
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 30,
    left: 20,
    zIndex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  favoriteButton: {
    padding: 8,
  },
  shareButton: {
    padding: 8,
  },
  navigateButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  retryButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  infoIcon: {
    fontSize: 20,
    color: '#666666',
    marginRight: 8,
  },
  favoriteIcon: {
    fontSize: 24,
    color: '#FF4081',
  },
  shareIcon: {
    fontSize: 24,
    color: '#666666',
  },
  navigationIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    marginRight: 8,
  },
  detailIcon: {
    fontSize: 16,
    color: '#666666',
    marginRight: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  address: {
    fontSize: 16,
    color: '#666666',
    marginTop: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#333333',
    flex: 1,
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 8,
  },
  errorText: {
    fontSize: 18,
    color: '#FF0000',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorDetail: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  swipeHintText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  noteText: {
    fontSize: 14,
    color: '#333333',
  },
  probabilityText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  scheduleText: {
    fontSize: 14,
    color: '#333333',
  },
  noteSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  // Layout
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    flexGrow: 1,
  },
  detailsContainer: {
    marginTop: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  infoContainer: {
    marginTop: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
  noteContainer: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  scheduleContainer: {
    marginTop: 16,
  },
  mapContainer: {
    height: 200,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  swipeHintContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  disclaimer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },

  // Map
  mapStyle: {
    width: '100%',
    height: '100%',
  },
  mapPreview: {
    width: '100%',
    height: 200,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    color: '#666666',
    fontSize: 14,
  },
  mapImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },

  // Buttons
  backButton: {
    padding: 8,
  },
  favoriteButton: {
    padding: 8,
  },
  shareButton: {
    padding: 8,
  },
  navigateButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  retryButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },

  // Icons
  infoIcon: {
    fontSize: 20,
    color: '#666666',
    marginRight: 8,
  },
  favoriteIcon: {
    fontSize: 24,
    color: '#FF4081',
  },
  shareIcon: {
    fontSize: 24,
    color: '#666666',
  },
  navigationIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    marginRight: 8,
  },
  detailIcon: {
    fontSize: 16,
    color: '#666666',
    marginRight: 8,
  },

  // Text
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  address: {
    fontSize: 16,
    color: '#666666',
    marginTop: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#333333',
    flex: 1,
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 8,
  },
  errorText: {
    fontSize: 18,
    color: '#FF0000',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorDetail: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  swipeHintText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  noteText: {
    fontSize: 14,
    color: '#333333',
  },
  probabilityText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  scheduleText: {
    fontSize: 14,
    color: '#333333',
  },
  noteSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 10,
  },
  errorDetail: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  contentContainer: {
    flexGrow: 1,
    padding: 16,
  },
  scrollContent: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shareButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  address: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  probabilityText: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 24,
  },
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  scheduleContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#FFF9C4',
    borderRadius: 8,
  },
  scheduleText: {
    fontSize: 16,
    color: '#666',
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 10,
  },
  errorDetail: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  contentContainer: {
    flexGrow: 1,
    padding: 16,
  },
  scrollContent: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shareButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  address: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  probabilityText: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 24,
  },
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  scheduleContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#FFF9C4',
    borderRadius: 8,
  },
  scheduleText: {
    fontSize: 16,
    color: '#666',
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 30,
    left: 20,
    zIndex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorDetail: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  address: {
    fontSize: 16,
    color: '#666',
  },
  detailsContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  noteText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
    flex: 1
  }
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    flex: 1,
  },
  mapPreview: {
    height: 200,
    backgroundColor: '#e1e1e1',
    borderRadius: 8,
    marginBottom: 16,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 44 : 16,
    left: 16,
    zIndex: 1,
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  favoriteButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 44 : 16,
    right: 16,
    zIndex: 1,
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorDetail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#0053A0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  address: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  detailsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0053A0',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  disclaimer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  disclaimerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  } as ViewStyle,
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  } as TextStyle,
  errorDetail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  } as TextStyle,
  retryButton: {
    backgroundColor: '#0053A0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  } as ViewStyle,
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  } as TextStyle,
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  } as ViewStyle,
  scrollContent: {
    flex: 1,
  },
  mapPreview: {
    height: 200,
    backgroundColor: '#e1e1e1',
    borderRadius: 8,
    marginBottom: 16,
    position: 'relative',
  } as ViewStyle,
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 44 : 16,
    left: 16,
    zIndex: 1,
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  } as ViewStyle,
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  } as ViewStyle,
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  mapPlaceholderText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  } as TextStyle,
  detailsContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  } as ViewStyle,
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  } as ViewStyle,
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  address: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  swipeHint: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 44 : 16,
    left: '50%',
    transform: [{ translateX: -75 }],
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    padding: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  swipeHintText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
  infoContainer: {
    marginTop: 16,
  } as ViewStyle,
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  } as ViewStyle,
  infoIcon: {
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  infoText: {
    flex: 1,
  } as TextStyle,
  infoLabel: {
    fontSize: 14,
    color: '#666',
  } as TextStyle,
  infoValue: {
    fontSize: 16,
    color: '#333',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#e1e1e1',
    marginVertical: 16,
  } as ViewStyle,
  actionButton: {
    backgroundColor: '#0053A0',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9C4',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  noteText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
    flex: 1
  }
  },
});
  contentContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  scrollContent: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  swipeHint: {
    position: 'absolute',
    top: 100,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  swipeHintText: {
    marginLeft: 8,
    color: '#0053A0',
    fontWeight: '600',
  },
  mapPreview: {
    height: 200,
    width: '100%',
    backgroundColor: '#e1e1e1',
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0053A0',
  },
  address: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  detailsContainer: {
    marginTop: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailIcon: {
    marginRight: 10,
    width: 24,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
  },
  actionButton: {
    backgroundColor: '#0053A0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimer: {
    marginTop: 10,
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContent: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  mapPreview: {
    height: 200,
    backgroundColor: '#ddd',
    position: 'relative',
  },
  mapPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e1e1e1',
  },
  mapPlaceholderText: {
    marginBottom: 10,
    fontSize: 16,
    color: '#666',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 20,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 20,
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0053A0',
    marginBottom: 5,
  },
  address: {
    fontSize: 16,
    color: '#555',
    maxWidth: '80%',
  },
  availabilityBadge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  availabilityText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  infoSection: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#777',
    marginVertical: 5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  noteSection: {
    marginBottom: 20,
  },
  noteSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0053A0',
    marginBottom: 10,
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  noteText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
    flex: 1
  }
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 25,
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  navigateButton: {
    backgroundColor: '#0053A0',
  },
  shareButton: {
    backgroundColor: '#FECC02',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  disclaimer: {
    marginTop: 10,
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  swipeHint: {
    position: 'absolute',
    top: 100,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  swipeHintText: {
    marginLeft: 8,
    color: '#0053A0',
    fontWeight: '600',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});

export default ParkingDetailsScreen;
