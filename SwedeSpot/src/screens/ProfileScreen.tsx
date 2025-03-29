import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  // State for toggles - billionaire preferences 🤑
  const [enablePushNotifications, setEnablePushNotifications] = useState(true);
  const [enableCleaningAlerts, setEnableCleaningAlerts] = useState(true);
  const [enablePremiumSpots, setEnablePremiumSpots] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  
  // Mock user data - tech billionaire level 💸
  const user = {
    name: 'Supreme Leader',
    email: 'rich@k9coliving.com',
    memberSince: 'March 2025',
    plan: 'Ultimate Billionaire',
    favorite: 5,
    recent: 12,
  };
  
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: () => navigation.navigate('Login') },
      ]
    );
  };
  
  const showFeatureComingSoon = () => {
    Alert.alert(
      '🚀 Coming Soon',
      'This ultra-premium feature is still being perfected for tech billionaires! Our dev team is working 24/7 to roll this out ASAP!',
      [{ text: 'OK', style: 'default' }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header with user info */}
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImageWrapper}>
            <Text style={styles.profileInitial}>S</Text>
          </View>
          <TouchableOpacity style={styles.editProfileButton}>
            <FontAwesome5 name="pencil-alt" size={16} color="white" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        
        <View style={styles.membershipBadge}>
          <FontAwesome5 name="crown" size={14} color="#FECC02" />
          <Text style={styles.membershipText}>{user.plan}</Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.favorite}</Text>
            <Text style={styles.statLabel}>Favorite Spots</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.recent}</Text>
            <Text style={styles.statLabel}>Recent Parkings</Text>
          </View>
        </View>
      </View>
      
      {/* Settings Sections */}
      <View style={styles.settingsContainer}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <TouchableOpacity style={styles.settingRow} onPress={showFeatureComingSoon}>
          <View style={styles.settingIconContainer}>
            <Ionicons name="person" size={22} color="#0053A0" />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Edit Profile</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#999" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingRow} onPress={showFeatureComingSoon}>
          <View style={styles.settingIconContainer}>
            <Ionicons name="card" size={22} color="#0053A0" />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Payment Methods</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#999" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingRow} onPress={showFeatureComingSoon}>
          <View style={styles.settingIconContainer}>
            <MaterialIcons name="history" size={22} color="#0053A0" />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Parking History</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#999" />
        </TouchableOpacity>
        
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingIconContainer}>
            <Ionicons name="notifications" size={22} color="#0053A0" />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Push Notifications</Text>
          </View>
          <Switch
            value={enablePushNotifications}
            onValueChange={setEnablePushNotifications}
            trackColor={{ false: '#d3d3d3', true: '#a5d6a7' }}
            thumbColor={enablePushNotifications ? '#4CAF50' : '#f4f3f4'}
          />
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingIconContainer}>
            <MaterialIcons name="cleaning-services" size={22} color="#0053A0" />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Cleaning Alerts</Text>
          </View>
          <Switch
            value={enableCleaningAlerts}
            onValueChange={setEnableCleaningAlerts}
            trackColor={{ false: '#d3d3d3', true: '#a5d6a7' }}
            thumbColor={enableCleaningAlerts ? '#4CAF50' : '#f4f3f4'}
          />
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingIconContainer}>
            <FontAwesome5 name="star" size={22} color="#0053A0" />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Premium Spots</Text>
            <Text style={styles.settingDescription}>Shows exclusive parking spots (Premium only)</Text>
          </View>
          <Switch
            value={enablePremiumSpots}
            onValueChange={setEnablePremiumSpots}
            trackColor={{ false: '#d3d3d3', true: '#a5d6a7' }}
            thumbColor={enablePremiumSpots ? '#4CAF50' : '#f4f3f4'}
          />
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingIconContainer}>
            <Ionicons name="moon" size={22} color="#0053A0" />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#d3d3d3', true: '#a5d6a7' }}
            thumbColor={darkMode ? '#4CAF50' : '#f4f3f4'}
          />
        </View>
        
        <Text style={styles.sectionTitle}>About</Text>
        
        <TouchableOpacity style={styles.settingRow} onPress={showFeatureComingSoon}>
          <View style={styles.settingIconContainer}>
            <MaterialIcons name="info" size={22} color="#0053A0" />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>About SwedeSpot</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#999" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingRow} onPress={showFeatureComingSoon}>
          <View style={styles.settingIconContainer}>
            <MaterialIcons name="support-agent" size={22} color="#0053A0" />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Support</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#999" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingRow} onPress={() => Linking.openURL('https://k9coliving.com')}>
          <View style={styles.settingIconContainer}>
            <FontAwesome5 name="globe" size={22} color="#0053A0" />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Visit k9coliving.com</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#999" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.settingRow, styles.logoutRow]}
          onPress={handleLogout}
        >
          <View style={[styles.settingIconContainer, styles.logoutIcon]}>
            <MaterialIcons name="logout" size={22} color="#F44336" />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={[styles.settingLabel, styles.logoutText]}>Logout</Text>
          </View>
        </TouchableOpacity>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>SwedeSpot v1.0.0 (Build 42)</Text>
          <Text style={styles.copyrightText}>© 2025 K9coLiving Tech Ventures</Text>
        </View>
      </View>
      <StatusBar style="light" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    backgroundColor: '#0053A0',
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FECC02',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  profileInitial: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#0053A0',
  },
  editProfileButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 10,
  },
  membershipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(254, 204, 2, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginBottom: 20,
  },
  membershipText: {
    color: '#FECC02',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: '90%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  settingsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0053A0',
    marginTop: 20,
    marginBottom: 10,
    paddingLeft: 10,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  settingIconContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 15,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  settingDescription: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  logoutRow: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 20,
  },
  logoutIcon: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
  },
  logoutText: {
    color: '#F44336',
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  versionText: {
    fontSize: 14,
    color: '#999',
  },
  copyrightText: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
});

export default ProfileScreen;
