import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  ImageBackground,
  Animated,
  Dimensions
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

interface HomeScreenProps {
  navigation: any;
}

const { width, height } = Dimensions.get('window');

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  // Animations for premium billionaire UX vibes 💰
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(height));
  
  useEffect(() => {
    // Start the animations when component mounts
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]} />
        
        <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
          <Text style={styles.title}>SwedeSpot</Text>
          <Text style={styles.tagline}>Park Like a Billionaire 💎</Text>
          
          <View style={styles.featureContainer}>
            <View style={styles.featureItem}>
              <Text style={styles.featureEmoji}>🔍</Text>
              <Text style={styles.featureText}>Find nearest parking</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Text style={styles.featureEmoji}>⚡</Text>
              <Text style={styles.featureText}>Support for all vehicles</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Text style={styles.featureEmoji}>🧹</Text>
              <Text style={styles.featureText}>Cleaning schedule alerts</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Text style={styles.featureEmoji}>💸</Text>
              <Text style={styles.featureText}>Premium payment options</Text>
            </View>
          </View>
        </Animated.View>
        
        <Animated.View 
          style={[styles.buttonContainer, { transform: [{ translateY: slideAnim }] }]}
        >
          <TouchableOpacity 
            style={styles.findParkingButton}
            onPress={() => navigation.navigate('Map')}
          >
            <Text style={styles.buttonText}>Find Parking Now</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginButtonText}>Sign In</Text>
          </TouchableOpacity>
          
          <Text style={styles.footerText}>© 2025 K9coLiving Tech Billionaire Ventures</Text>
        </Animated.View>
      </ImageBackground>
      <StatusBar style="light" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'space-between',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 83, 160, 0.75)', // Swedish blue with opacity
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FECC02', // Swedish yellow
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  tagline: {
    fontSize: 20,
    color: 'white',
    marginBottom: 40,
    textAlign: 'center',
  },
  featureContainer: {
    width: '100%',
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 12,
    borderRadius: 10,
  },
  featureEmoji: {
    fontSize: 24,
    marginRight: 10,
  },
  featureText: {
    color: 'white',
    fontSize: 16,
  },
  buttonContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: 'center',
  },
  findParkingButton: {
    backgroundColor: '#0053A0',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#0053A0',
  },
  loginButtonText: {
    color: '#0053A0',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerText: {
    color: '#555',
    fontSize: 12,
    marginTop: 10,
  },
});

export default HomeScreen;
