import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { getReservations, deleteReservation, updateReservation } from '../services/database';

export default function MyReservationsScreen({ navigation }) {
  const [reservations, setReservations] = useState([]);
  const [filterType, setFilterType] = useState('All');

  const loadData = async () => {
    const list = await getReservations();
    setReservations(list);
  };

  useEffect(() => {
    const unsub = navigation.addListener('focus', loadData);
    loadData();
    return unsub;
  }, [navigation]);

  const handleCancel = (item) => {
    Alert.alert(
      'Cancel Reservation',
      `Are you sure you want to cancel "${item.title}"?`,
      [
        { text: 'Keep', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            await deleteReservation(item.id);
            Alert.alert('Cancelled', 'Reservation cancelled and released.');
            loadData();
          },
        },
      ]
    );
  };

  const handleReschedule = (item) => {
    Alert.alert(
      'Reschedule Time Slot',
      'Choose a new time window:',
      [
        { text: '09:00 AM - 11:00 AM', onPress: () => changeTime(item.id, '09:00 AM - 11:00 AM') },
        { text: '01:00 PM - 03:00 PM', onPress: () => changeTime(item.id, '01:00 PM - 03:00 PM') },
        { text: '04:00 PM - 06:00 PM', onPress: () => changeTime(item.id, '04:00 PM - 06:00 PM') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const changeTime = async (id, newSlot) => {
    await updateReservation(id, newSlot);
    Alert.alert('Updated', `Time slot updated to ${newSlot}.`);
    loadData();
  };

  const filtered = reservations.filter((r) => {
    if (filterType === 'All') return true;
    return r.type === filterType;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Reservations</Text>
        <Text style={styles.headerSub}>Manage your active book & reading-room passes</Text>

        <View style={styles.filterRow}>
          {['All', 'Book', 'Seat'].map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.filterPill, filterType === t && styles.filterPillActive]}
              onPress={() => setFilterType(t)}
            >
              <Text style={[styles.filterText, filterType === t && styles.filterTextActive]}>
                {t === 'All' ? 'All Passes' : `${t}s`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="calendar-outline" size={50} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No Reservations</Text>
            <Text style={styles.emptySub}>Reserve a book or reading-room seat to see passes here.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.tagWrap}>
                <Ionicons
                  name={item.type === 'Book' ? 'book' : 'desktop'}
                  size={14}
                  color={Colors.primary}
                />
                <Text style={styles.tagText}>{item.type}</Text>
              </View>
              <View style={styles.statusPill}>
                <Text style={styles.statusPillText}>{item.status}</Text>
              </View>
            </View>

            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.refCode}>Ref: {item.reference_code}</Text>

            <View style={styles.infoBlock}>
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
                <Text style={styles.infoText}>{item.pickup_location}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={14} color={Colors.textSecondary} />
                <Text style={styles.infoText}>{item.date}</Text>
              </View>
              {item.time_slot && (
                <View style={styles.infoRow}>
                  <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
                  <Text style={styles.infoText}>{item.time_slot}</Text>
                </View>
              )}
            </View>

            {/* Actions for Update & Delete */}
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.rescheduleBtn} onPress={() => handleReschedule(item)}>
                <Ionicons name="time" size={13} color={Colors.primary} />
                <Text style={styles.rescheduleText}>Reschedule</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => handleCancel(item)}>
                <Ionicons name="trash-outline" size={13} color="#EF4444" />
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
    paddingBottom: 18,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  headerSub: { fontSize: 12, color: 'rgba(255, 255, 255, 0.8)', marginTop: 2 },
  filterRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterPillActive: { backgroundColor: '#FFFFFF' },
  filterText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  filterTextActive: { color: Colors.primary, fontWeight: '800' },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tagWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tagText: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  statusPill: { backgroundColor: '#D1FAE5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  statusPillText: { fontSize: 11, fontWeight: '700', color: '#059669' },
  itemTitle: { fontSize: 15, fontWeight: '800', color: Colors.textPrimary, marginTop: 8 },
  refCode: { fontSize: 12, color: Colors.textMuted, fontFamily: 'monospace', marginTop: 2 },
  infoBlock: { backgroundColor: '#F8FAFC', borderRadius: 10, padding: 10, marginVertical: 10, gap: 6 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoText: { fontSize: 12, color: Colors.textSecondary },
  actionRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 10 },
  rescheduleBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, backgroundColor: '#EFF6FF' },
  rescheduleText: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  cancelBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, backgroundColor: '#FEE2E2' },
  cancelText: { fontSize: 12, fontWeight: '700', color: '#EF4444' },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginTop: 12 },
  emptySub: { fontSize: 12, color: Colors.textMuted, marginTop: 4 },
});
