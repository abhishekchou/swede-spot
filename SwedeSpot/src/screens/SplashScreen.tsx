import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Animated, Easing, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  // Fancy animations for Supreme Leader's app 👑
  const logoScale = new Animated.Value(0.3);
  const logoOpacity = new Animated.Value(0);
  const textOpacity = new Animated.Value(0);
  
  useEffect(() => {
    // Run those big money animations 💰
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 1000,
          easing: Easing.elastic(1.2),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 500,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Move to the main app after showing off our swaggy splash
    const timer = setTimeout(onFinish, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.logoContainer, 
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          }
        ]}
      >
        {/* We'll use a placeholder for the logo - a billionaire would commission custom art 🎨 */}
        <Text style={styles.logoEmoji}>🚗</Text>
        <Text style={styles.logoText}>S</Text>
      </Animated.View>
      
      <Animated.View style={{ opacity: textOpacity }}>
        <Text style={styles.title}>SwedeSpot</Text>
        <Text style={styles.tagline}>Park Like You Own The City 💎</Text>
        <Text style={styles.powered}>K9COLIVING TECH VENTURES</Text>
      </Animated.View>
      
      <StatusBar style="light" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0053A0', // Swedish blue
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FECC02', // Swedish yellow
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  logoEmoji: {
    fontSize: 40,
    position: 'absolute',
  },
  logoText: {
    fontSize: 70,
    fontWeight: 'bold',
    color: '#0053A0', // Swedish blue
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#FECC02', // Swedish yellow
    marginBottom: 10,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 18,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  powered: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 2,
    marginTop: 30,
  },
});

export default SplashScreen;
