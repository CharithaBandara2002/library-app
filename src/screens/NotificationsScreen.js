import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { getNotifications, markNotificationAsRead } from '../services/database';

export default function NotificationsScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);

  const loadNotifs = async () => {
    const list = await getNotifications();
    setNotifications(list);
  };

  useEffect(() => {
    const unsub = navigation.addListener('focus', loadNotifs);
    loadNotifs();
    return unsub;
  }, [navigation]);

  const handlePress = async (item) => {
    if (!item.is_read) {
      await markNotificationAsRead(item.id);
      loadNotifs();
    }
  };

  const getIconConfig = (type) => {
    switch (type) {
      case 'warning':
        return { name: 'alert-circle', color: '#F59E0B', bg: '#FEF3C7' };
      case 'success':
        return { name: 'checkmark-circle', color: '#10B981', bg: '#D1FAE5' };
      case 'info':
      default:
        return { name: 'information-circle', color: Colors.primary, bg: '#EFF6FF' };
    }
  };

  return (
    <View style={styles.container}>
      {/* Blue Header matching Figure 6.8 */}
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <Text style={styles.subtitle}>
          {notifications.filter((n) => n.is_read === 0).length} unread updates
        </Text>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => {
          const cfg = getIconConfig(item.type);
          return (
            <TouchableOpacity
              style={[styles.card, item.is_read === 0 && styles.cardUnread]}
              onPress={() => handlePress(item)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconWrap, { backgroundColor: cfg.bg }]}>
                <Ionicons name={cfg.name} size={22} color={cfg.color} />
              </View>
              <View style={styles.cardContent}>
                <View style={styles.cardTop}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.timeAgo}>{item.time_ago}</Text>
                </View>
                <Text style={styles.cardMessage}>{item.message}</Text>
              </View>
              {item.is_read === 0 && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  subtitle: { fontSize: 13, color: 'rgba(255, 255, 255, 0.8)', marginTop: 2 },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'flex-start',
  },
  cardUnread: {
    borderColor: '#BFDBFE',
    backgroundColor: '#F8FAFC',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardContent: { flex: 1 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  timeAgo: { fontSize: 11, color: Colors.textMuted },
  cardMessage: { fontSize: 12, color: Colors.textSecondary, marginTop: 4, lineHeight: 18 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary, marginLeft: 6, marginTop: 4 },
});
