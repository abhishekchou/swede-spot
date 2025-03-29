import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Switch,
  Image,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

interface NotificationsScreenProps {
  navigation: any;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'cleaning' | 'payment' | 'alert' | 'promo';
}

// Sample notifications for our tech billionaire demo
const SAMPLE_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Cleaning Alert 🧹',
    message: 'Storgatan parking will be cleaned tomorrow between 10:00-12:00. Your car is parked there!',
    time: '2 hours ago',
    read: false,
    type: 'cleaning',
  },
  {
    id: '2',
    title: 'Parking Time Expiring ⏰',
    message: 'Your parking on Kungsgatan expires in 30 minutes. Tap to extend.',
    time: '30 minutes ago',
    read: false,
    type: 'alert',
  },
  {
    id: '3',
    title: 'Payment Successful 💰',
    message: 'Your payment of 40 SEK for Parking at City Center was successful.',
    time: 'Yesterday',
    read: true,
    type: 'payment',
  },
  {
    id: '4',
    title: 'Premium Spot Available ✨',
    message: 'A premium spot just became available near your favorite location!',
    time: 'Yesterday',
    read: true,
    type: 'alert',
  },
  {
    id: '5',
    title: 'Limited Time Offer 🎁',
    message: 'Get 50% off on premium parking spots this weekend! Only for tech billionaires!',
    time: '2 days ago',
    read: true,
    type: 'promo',
  },
  {
    id: '6',
    title: 'Cleaning Schedule Changed 📅',
    message: 'The cleaning schedule for Drottninggatan has changed. Now scheduled for Friday.',
    time: '3 days ago',
    read: true,
    type: 'cleaning',
  },
];

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ navigation }) => {
  const [notifications, setNotifications] = useState<Notification[]>(SAMPLE_NOTIFICATIONS);
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [bounceAnim] = useState(new Animated.Value(0));
  
  // Start the bouncy animation when component mounts - tech billionaire vibez 🔥
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);
  
  const translateY = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });
  
  const toggleNotification = (notificationId: string) => {
    const updatedNotifications = notifications.map(notification => {
      if (notification.id === notificationId) {
        return { ...notification, read: !notification.read };
      }
      return notification;
    });
    setNotifications(updatedNotifications);
  };
  
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true,
    }));
    setNotifications(updatedNotifications);
  };
  
  const deleteNotification = (notificationId: string) => {
    const updatedNotifications = notifications.filter(
      notification => notification.id !== notificationId
    );
    setNotifications(updatedNotifications);
  };
  
  const getIconForType = (type: Notification['type']) => {
    switch (type) {
      case 'cleaning':
        return <MaterialIcons name="cleaning-services" size={24} color="#0053A0" />;
      case 'payment':
        return <FontAwesome5 name="money-bill-wave" size={24} color="#4CAF50" />;
      case 'alert':
        return <MaterialIcons name="notification-important" size={24} color="#FFA500" />;
      case 'promo':
        return <FontAwesome5 name="gift" size={24} color="#9C27B0" />;
      default:
        return <MaterialIcons name="notifications" size={24} color="#0053A0" />;
    }
  };
  
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.notificationItem, item.read ? styles.readNotification : styles.unreadNotification]}
      onPress={() => toggleNotification(item.id)}
    >
      <View style={styles.notificationIcon}>{getIconForType(item.type)}</View>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationTime}>{item.time}</Text>
        </View>
        <Text style={styles.notificationMessage}>{item.message}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteNotification(item.id)}
      >
        <MaterialIcons name="delete-outline" size={22} color="#999" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 && (
          <Animated.View
            style={[styles.unreadBadge, { transform: [{ translateY }] }]}
          >
            <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
          </Animated.View>
        )}
      </View>

      <View style={styles.settingsCard}>
        <View style={styles.settingRow}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Enable Notifications</Text>
            <Text style={styles.settingSubtitle}>Get alerts for cleaning schedules and more</Text>
          </View>
          <Switch
            value={enableNotifications}
            onValueChange={setEnableNotifications}
            trackColor={{ false: '#d3d3d3', true: '#a5d6a7' }}
            thumbColor={enableNotifications ? '#4CAF50' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.notificationsContainer}>
        <View style={styles.notificationsHeader}>
          <Text style={styles.notificationsTitle}>
            {notifications.length > 0
              ? `${notifications.length} Notifications`
              : 'No Notifications'}
          </Text>
          {notifications.length > 0 && (
            <TouchableOpacity onPress={markAllAsRead}>
              <Text style={styles.markAllRead}>Mark all as read</Text>
            </TouchableOpacity>
          )}
        </View>

        {notifications.length > 0 ? (
          <FlatList
            data={notifications}
            renderItem={renderNotificationItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.notificationsList}
          />
        ) : (
          <View style={styles.emptyNotifications}>
            <MaterialIcons name="notifications-off" size={60} color="#ccc" />
            <Text style={styles.emptyNotificationsText}>No notifications yet</Text>
            <Text style={styles.emptyNotificationsSubtext}>
              We'll notify you about important parking info
            </Text>
          </View>
        )}
      </View>
      
      {/* For billionaire users - premium promo at the bottom 💎 */}
      <View style={styles.premiumPromo}>
        <View style={styles.promoImageContainer}>
          <FontAwesome5 name="crown" size={24} color="#FECC02" />
        </View>
        <View style={styles.promoTextContainer}>
          <Text style={styles.promoTitle}>Go Ultimate</Text>
          <Text style={styles.promoDescription}>Get priority parking alerts and exclusive spots!</Text>
        </View>
        <TouchableOpacity style={styles.promoButton}>
          <Text style={styles.promoButtonText}>Upgrade</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0053A0',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  unreadBadge: {
    backgroundColor: '#FECC02',
    height: 28,
    width: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  unreadBadgeText: {
    color: '#0053A0',
    fontWeight: 'bold',
    fontSize: 14,
  },
  settingsCard: {
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#777',
    marginTop: 3,
  },
  notificationsContainer: {
    flex: 1,
    backgroundColor: 'white',
    margin: 15,
    marginTop: 0,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  notificationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  notificationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  markAllRead: {
    fontSize: 14,
    color: '#0053A0',
    fontWeight: '500',
  },
  notificationsList: {
    paddingBottom: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  unreadNotification: {
    backgroundColor: 'rgba(0, 83, 160, 0.05)',
  },
  readNotification: {
    backgroundColor: 'white',
  },
  notificationIcon: {
    marginRight: 15,
    justifyContent: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  deleteButton: {
    padding: 5,
    justifyContent: 'center',
  },
  emptyNotifications: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
  },
  emptyNotificationsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 20,
  },
  emptyNotificationsSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
  premiumPromo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0053A0',
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  promoImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(254, 204, 2, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  promoTextContainer: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  promoDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  promoButton: {
    backgroundColor: '#FECC02',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  promoButtonText: {
    color: '#0053A0',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default NotificationsScreen;
