import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { getSeats, createReservation } from '../services/database';

const DATES = [
  { day: 'Mon', date: '15' },
  { day: 'Tue', date: '16' },
  { day: 'Wed', date: '17' },
  { day: 'Thu', date: '18' },
  { day: 'Fri', date: '19' },
];

const TIME_SLOTS = ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM'];

export default function SeatBookingScreen({ navigation }) {
  const [seats, setSeats] = useState([]);
  const [selectedDate, setSelectedDate] = useState('Mon 15');
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSeats = async () => {
    const sList = await getSeats();
    setSeats(sList);
  };

  useEffect(() => {
    const unsub = navigation.addListener('focus', fetchSeats);
    fetchSeats();
    return unsub;
  }, [navigation]);

  const availableCount = seats.filter((s) => s.status === 'Available').length;
  const reservedCount = seats.filter((s) => s.status === 'Reserved').length;
  const totalCount = seats.length;

  const handleSelectSeat = (seat) => {
    if (seat.status === 'Reserved') {
      Alert.alert('Occupied', `Seat ${seat.seat_number} is already reserved for this session.`);
      return;
    }
    setSelectedSeat(selectedSeat?.seat_number === seat.seat_number ? null : seat);
  };

  const handleBookSeat = async () => {
    if (!selectedSeat) {
      Alert.alert('Selection Required', 'Please tap an available green seat on the floor map.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newBooking = await createReservation({
        type: 'Seat',
        resourceId: selectedSeat.seat_number,
        title: `Reading-Room Seat ${selectedSeat.seat_number}`,
        pickupLocation: 'Main Reading Room · Level 2',
        date: `October ${selectedDate.split(' ')[1]}, 2026`,
        timeSlot: selectedTime,
      });

      Alert.alert(
        'Seat Confirmed!',
        `Seat ${selectedSeat.seat_number} booked successfully for ${selectedTime} (${selectedDate}).\nBooking Ref: ${newBooking.reference_code}`,
        [
          { text: 'View My Passes', onPress: () => navigation.navigate('MyReservationsTab') },
          { text: 'Done', onPress: () => { setSelectedSeat(null); fetchSeats(); } },
        ]
      );
    } catch (e) {
      Alert.alert('Error', 'Failed to book reading-room seat.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Group seats by rows: A, B, C, D
  const rows = ['A', 'B', 'C', 'D'];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header matching Figure 6.6 */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backCircle}>
            <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle}>Book a Seat</Text>
            <Text style={styles.headerSubtitle}>Main Reading Room · Level 2</Text>
          </View>
        </View>

        {/* Date Selector Pills */}
        <View style={styles.dateRow}>
          {DATES.map((item) => {
            const key = `${item.day} ${item.date}`;
            const isActive = selectedDate === key;
            return (
              <TouchableOpacity
                key={key}
                style={[styles.datePill, isActive && styles.datePillActive]}
                onPress={() => { setSelectedDate(key); setSelectedSeat(null); }}
              >
                <Text style={[styles.dateDay, isActive && styles.dateDayActive]}>{item.day}</Text>
                <Text style={[styles.dateNum, isActive && styles.dateNumActive]}>{item.date}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.body}>
        {/* Time Slot Grid (2x3) matching Figure 6.6 */}
        <Text style={styles.sectionLabel}>SELECT TIME SLOT</Text>
        <View style={styles.timeGrid}>
          {TIME_SLOTS.map((slot) => {
            const isSelected = selectedTime === slot;
            return (
              <TouchableOpacity
                key={slot}
                style={[styles.timeSlot, isSelected && styles.timeSlotActive]}
                onPress={() => setSelectedTime(slot)}
              >
                <Text style={[styles.timeSlotText, isSelected && styles.timeSlotTextActive]}>
                  {slot}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Legend */}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendCircle, { backgroundColor: '#10B981' }]} />
            <Text style={styles.legendText}>Available</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendCircle, { backgroundColor: '#EF4444' }]} />
            <Text style={styles.legendText}>Reserved</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendCircle, { backgroundColor: Colors.primary }]} />
            <Text style={styles.legendText}>Selected</Text>
          </View>
        </View>

        {/* Reading Room Floor Map matching Figure 6.6 */}
        <View style={styles.floorCard}>
          {/* Window Banner */}
          <View style={styles.windowTag}>
            <Ionicons name="tablet-landscape-outline" size={14} color="#64748B" style={{ marginRight: 4 }} />
            <Text style={styles.windowTagText}>Window</Text>
          </View>

          {/* Seat Rows A, B, C, D */}
          <View style={styles.grid}>
            {rows.map((rCode) => {
              const rowSeats = seats.filter((s) => s.row_letter === rCode);
              return (
                <View key={rCode} style={styles.deskRow}>
                  {rowSeats.map((s) => {
                    const isSelected = selectedSeat?.seat_number === s.seat_number;
                    const isReserved = s.status === 'Reserved';

                    let circleBg = '#10B981'; // Green available
                    if (isReserved) circleBg = '#EF4444'; // Red reserved
                    if (isSelected) circleBg = Colors.primary; // Blue selected

                    return (
                      <TouchableOpacity
                        key={s.id}
                        style={[styles.seatCircle, { backgroundColor: circleBg }]}
                        onPress={() => handleSelectSeat(s)}
                      >
                        <Text style={styles.seatCircleText}>{s.seat_number}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              );
            })}
          </View>

          {/* Entrance Banner */}
          <View style={styles.entranceTag}>
            <View style={styles.entranceBar} />
            <Text style={styles.entranceTagText}>Entrance</Text>
          </View>
        </View>

        {/* Bottom 3-Box Counter matching Figure 6.6 */}
        <View style={styles.summaryBar}>
          <View style={styles.summaryBox}>
            <Text style={[styles.summaryNum, { color: '#10B981' }]}>{availableCount}</Text>
            <Text style={styles.summaryLabel}>Available</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={[styles.summaryNum, { color: '#EF4444' }]}>{reservedCount}</Text>
            <Text style={styles.summaryLabel}>Reserved</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={[styles.summaryNum, { color: Colors.primary }]}>{totalCount}</Text>
            <Text style={styles.summaryLabel}>Total</Text>
          </View>
        </View>

        {/* Selected Seat Booking Trigger */}
        {selectedSeat && (
          <TouchableOpacity
            style={styles.bookNowButton}
            onPress={handleBookSeat}
            disabled={isSubmitting}
          >
            <Text style={styles.bookNowText}>Confirm Seat {selectedSeat.seat_number} ({selectedTime})</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
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
  headerTitleRow: { flexDirection: 'row', alignItems: 'center' },
  backCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextWrap: { marginLeft: 12 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  headerSubtitle: { fontSize: 12, color: 'rgba(255, 255, 255, 0.8)', marginTop: 2 },
  dateRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 },
  datePill: {
    width: 58,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  datePillActive: { backgroundColor: '#FFFFFF' },
  dateDay: { fontSize: 11, color: '#FFFFFF', fontWeight: '600' },
  dateDayActive: { color: Colors.primary, fontWeight: '700' },
  dateNum: { fontSize: 15, fontWeight: '800', color: '#FFFFFF', marginTop: 2 },
  dateNumActive: { color: Colors.primary },
  body: { padding: 18 },
  sectionLabel: { fontSize: 11, fontWeight: '800', color: Colors.textMuted, letterSpacing: 0.5, marginBottom: 10 },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between' },
  timeSlot: {
    width: '31%',
    backgroundColor: Colors.surface,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timeSlotActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  timeSlotText: { fontSize: 12, fontWeight: '700', color: Colors.textPrimary },
  timeSlotTextActive: { color: '#FFFFFF' },
  legendRow: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginVertical: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendCircle: { width: 12, height: 12, borderRadius: 6 },
  legendText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  floorCard: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  windowTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  windowTagText: { fontSize: 11, color: '#64748B', fontWeight: '600' },
  grid: { width: '100%', gap: 12 },
  deskRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4 },
  seatCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  seatCircleText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
  entranceTag: { alignItems: 'center', marginTop: 16 },
  entranceBar: { width: 40, height: 4, backgroundColor: '#94A3B8', borderRadius: 2, marginBottom: 4 },
  entranceTagText: { fontSize: 11, color: '#64748B', fontWeight: '600' },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    gap: 10,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryNum: { fontSize: 20, fontWeight: '800' },
  summaryLabel: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  bookNowButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  bookNowText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
