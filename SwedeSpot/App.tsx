import React, { useState, useEffect } from 'react';
import { registerRootComponent } from 'expo';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/screens/SplashScreen';
import { LogBox } from 'react-native';

// Ignore warnings for the billionaire experience - we don't have time for warnings 🤑
LogBox.ignoreLogs([
  'Require cycle:',
  'Non-serializable values were found in the navigation state',
]);

export default function App() {
  const [isReady, setIsReady] = useState(false);

  // This would load fonts, configurations, and do other startup tasks
  const prepareApp = async () => {
    try {
      // Here we would load fonts, configuration, etc.
      // For example:
      // await Font.loadAsync({
      //   'montserrat': require('./assets/fonts/Montserrat-Regular.ttf'),
      //   'montserrat-bold': require('./assets/fonts/Montserrat-Bold.ttf'),
      // });
      
      // Simulate loading time for the billionaire UX vibez 💎
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return true;
    } catch (e) {
      console.warn('Error loading app resources: ', e);
      return false;
    }
  };

  if (!isReady) {
    return (
      <SplashScreen 
        onFinish={() => {
          // When splash animation is done, prepare the app
          prepareApp().then(() => setIsReady(true));
        }} 
      />
    );
  }

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}

// Register the main component
registerRootComponent(App);
