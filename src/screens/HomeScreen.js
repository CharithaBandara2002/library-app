import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { getUser, getBooks, getReservations, getNotifications, getStudentStats } from '../services/database';

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState({ booksBorrowed: 1, booksRead: 12, activeReservations: 1, dueSoon: 1 });
  const [unreadCount, setUnreadCount] = useState(3);

  const loadData = async () => {
    try {
      const u = await getUser();
      setUser(u);
      const bList = await getBooks('All');
      setBooks(bList);
      const s = await getStudentStats(u?.id);
      setStats(s);
      const notifs = await getNotifications();
      setUnreadCount(notifs.filter(n => n.is_read === 0).length);
    } catch (e) {
      console.log('Error loading home data:', e);
    }
  };

  useEffect(() => {
    const unsub = navigation.addListener('focus', loadData);
    loadData();
    return unsub;
  }, [navigation]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top Header matching Figure 6.2 */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.name}>{user?.name || 'Arjun Mehta'} 👋</Text>
          <Text style={styles.subtext}>
            {user?.department || 'Computer Science'} · {user?.student_id || 'MU2024001'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.avatarCircle}
          onPress={() => navigation.navigate('ProfileTab')}
        >
          {user?.photo_url ? (
            <Image source={{ uri: user.photo_url }} style={styles.avatarImg} />
          ) : (
            <Text style={styles.avatarText}>{user?.avatar || 'AM'}</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Prominent Search Bar */}
      <TouchableOpacity
        style={styles.searchBar}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('BookSearchTab')}
      >
        <Ionicons name="search" size={20} color={Colors.textMuted} style={{ marginRight: 8 }} />
        <Text style={styles.searchPlaceholder}>Search books, authors, ISBN...</Text>
        <Ionicons name="filter-outline" size={18} color={Colors.textMuted} />
      </TouchableOpacity>

      {/* 3 Metric Summary Row matching Figure 6.2 */}
      <View style={styles.metricsCard}>
        <View style={styles.metricItem}>
          <View style={[styles.metricIconWrap, { backgroundColor: '#EFF6FF' }]}>
            <Ionicons name="book" size={18} color={Colors.primary} />
          </View>
          <Text style={styles.metricNumber}>{stats.booksRead}</Text>
          <Text style={styles.metricLabel}>Books{'\n'}Borrowed</Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metricItem}>
          <View style={[styles.metricIconWrap, { backgroundColor: '#F0FDF4' }]}>
            <Ionicons name="calendar" size={18} color={Colors.success} />
          </View>
          <Text style={styles.metricNumber}>{stats.activeReservations}</Text>
          <Text style={styles.metricLabel}>Active{'\n'}Reservations</Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metricItem}>
          <View style={[styles.metricIconWrap, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="alarm" size={18} color={Colors.accent} />
          </View>
          <Text style={styles.metricNumber}>{stats.dueSoon}</Text>
          <Text style={styles.metricLabel}>Due{'\n'}Soon</Text>
        </View>
      </View>

      {/* Quick Access Section - 2x2 Grid matching Figure 6.2 */}
      <Text style={styles.sectionTitle}>Quick Access</Text>
      <View style={styles.quickAccessGrid}>
        {/* Search Books */}
        <TouchableOpacity
          style={styles.quickCard}
          onPress={() => navigation.navigate('BookSearchTab')}
        >
          <View style={[styles.quickIconBox, { backgroundColor: Colors.primary }]}>
            <Ionicons name="search" size={22} color="#FFFFFF" />
          </View>
          <Text style={styles.quickCardTitle}>Search Books</Text>
          <Text style={styles.quickCardSub}>120,000+ titles</Text>
        </TouchableOpacity>

        {/* Book a Seat */}
        <TouchableOpacity
          style={styles.quickCard}
          onPress={() => navigation.navigate('SeatBookingTab')}
        >
          <View style={[styles.quickIconBox, { backgroundColor: Colors.primary }]}>
            <Ionicons name="calendar-outline" size={22} color="#FFFFFF" />
          </View>
          <Text style={styles.quickCardTitle}>Book a Seat</Text>
          <Text style={styles.quickCardSub}>48 rooms available</Text>
        </TouchableOpacity>

        {/* My Reservations */}
        <TouchableOpacity
          style={styles.quickCard}
          onPress={() => navigation.navigate('MyReservationsTab')}
        >
          <View style={[styles.quickIconBox, { backgroundColor: Colors.primary }]}>
            <Ionicons name="reader-outline" size={22} color="#FFFFFF" />
          </View>
          <Text style={styles.quickCardTitle}>My Reservations</Text>
          <Text style={styles.quickCardSub}>{stats.activeReservations} active</Text>
        </TouchableOpacity>

        {/* Notifications */}
        <TouchableOpacity
          style={styles.quickCard}
          onPress={() => navigation.navigate('NotificationsTab')}
        >
          <View style={[styles.quickIconBox, { backgroundColor: Colors.primary }]}>
            <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
          </View>
          <Text style={styles.quickCardTitle}>Notifications</Text>
          <Text style={styles.quickCardSub}>{unreadCount} unread</Text>
        </TouchableOpacity>
      </View>

      {/* Trending Now Section */}
      <View style={styles.trendingHeader}>
        <Text style={styles.sectionTitle}>Trending Now</Text>
        <TouchableOpacity onPress={() => navigation.navigate('BookSearchTab')}>
          <Text style={styles.viewAllText}>View all</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.trendingList}>
        {books.slice(0, 3).map((book) => (
          <TouchableOpacity
            key={book.id}
            style={styles.trendingCard}
            onPress={() => navigation.navigate('BookDetails', { bookId: book.id })}
          >
            <Image source={{ uri: book.cover }} style={styles.trendingThumb} />
            <View style={styles.trendingInfo}>
              <Text style={styles.trendingTitle} numberOfLines={1}>{book.title}</Text>
              <Text style={styles.trendingAuthor}>{book.authors}</Text>
              <View style={styles.availableTag}>
                <View style={styles.greenDot} />
                <Text style={styles.availableText}>
                  {book.copies_available > 0 ? 'Available' : 'Borrowed'}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingTop: 54,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingBottom: 16,
  },
  userInfo: { flex: 1 },
  greeting: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  name: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, marginTop: 2 },
  subtext: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImg: { width: 44, height: 44, borderRadius: 22 },
  avatarText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    marginTop: 14,
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchPlaceholder: { flex: 1, color: Colors.textMuted, fontSize: 14 },
  metricsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  metricItem: { alignItems: 'center', flex: 1 },
  metricIconWrap: { width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  metricNumber: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  metricLabel: { fontSize: 11, color: Colors.textSecondary, textAlign: 'center', marginTop: 2 },
  metricDivider: { width: 1, height: '70%', backgroundColor: Colors.border },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary, marginHorizontal: 18, marginTop: 22 },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    marginTop: 12,
    gap: 12,
    justifyContent: 'space-between',
  },
  quickCard: {
    width: '47%',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickIconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  quickCardTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  quickCardSub: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  trendingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 18,
  },
  viewAllText: { fontSize: 13, color: Colors.primary, fontWeight: '700', marginTop: 20 },
  trendingList: { marginHorizontal: 16, marginTop: 12, marginBottom: 30 },
  trendingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  trendingThumb: { width: 50, height: 65, borderRadius: 8, backgroundColor: '#E2E8F0' },
  trendingInfo: { flex: 1, marginLeft: 12 },
  trendingTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  trendingAuthor: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  availableTag: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  greenDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success, marginRight: 5 },
  availableText: { fontSize: 11, color: Colors.success, fontWeight: '600' },
});
