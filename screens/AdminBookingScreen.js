import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { collection, getDocs, doc, updateDoc, deleteDoc, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";

export default function AdminBookingsScreen() {
  const [bookings, setBookings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const q = query(collection(db, "bookings"), orderBy("datetime", "desc"));
      const snap = await getDocs(q);
      const bookingsList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setBookings(bookingsList);
    } catch (error) {
      console.error("Errore caricamento prenotazioni:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      await updateDoc(doc(db, "bookings", bookingId), { status: newStatus });
      Alert.alert("Successo", "Stato aggiornato!");
      fetchBookings();
    } catch (error) {
      Alert.alert("Errore", error.message);
    }
  };

  const deleteBooking = async (bookingId) => {
    Alert.alert(
      "Conferma eliminazione",
      "Sei sicuro di voler eliminare questa prenotazione?",
      [
        { text: "Annulla", style: "cancel" },
        {
          text: "Elimina",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "bookings", bookingId));
              Alert.alert("Successo", "Prenotazione eliminata!");
              fetchBookings();
            } catch (error) {
              Alert.alert("Errore", error.message);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF3B30" />
        <Text style={styles.loadingText}>Caricamento prenotazioni...</Text>
      </View>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'completed': return '#2196F3';
      case 'cancelled': return '#f44336';
      default: return '#999';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Confermata';
      case 'pending': return 'In attesa';
      case 'completed': return 'Completata';
      case 'cancelled': return 'Annullata';
      default: return status;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.statsBar}>
        <Text style={styles.statsText}>
          📊 Totale prenotazioni: {bookings?.length || 0}
        </Text>
      </View>

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const datetime = item.datetime?.toDate ? item.datetime.toDate() : new Date(item.datetime);
          return (
            <View style={styles.bookingCard}>
              <View style={styles.bookingHeader}>
                <Text style={styles.bookingId}>#{item.id.substring(0, 8)}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                  <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
                </View>
              </View>

              <View style={styles.bookingBody}>
                <View style={styles.bookingRow}>
                  <Text style={styles.label}>👤 Cliente:</Text>
                  <Text style={styles.value}>{item.userId.substring(0, 8)}...</Text>
                </View>

                <View style={styles.bookingRow}>
                  <Text style={styles.label}>🚗 Servizio:</Text>
                  <Text style={styles.value}>{item.serviceName || item.serviceId}</Text>
                </View>
                
                <View style={styles.bookingRow}>
                  <Text style={styles.label}>📅 Data:</Text>
                  <Text style={styles.value}>
                    {datetime.toLocaleDateString('it-IT', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })} - {datetime.toLocaleTimeString('it-IT', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                </View>

                {item.address && (
                  <View style={styles.bookingRow}>
                    <Text style={styles.label}>📍 Indirizzo:</Text>
                    <Text style={styles.value}>{item.address}</Text>
                  </View>
                )}

                <View style={styles.bookingRow}>
                  <Text style={styles.label}>💳 Pagamento:</Text>
                  <Text style={styles.value}>
                    {item.paymentStatus === 'pending' ? 'In attesa' : 'Pagato'}
                  </Text>
                </View>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
                  onPress={() => updateBookingStatus(item.id, 'completed')}
                >
                  <Text style={styles.actionButtonText}>✓ Completa</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#FF9800' }]}
                  onPress={() => updateBookingStatus(item.id, 'pending')}
                >
                  <Text style={styles.actionButtonText}>⏳ In attesa</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#f44336' }]}
                  onPress={() => updateBookingStatus(item.id, 'cancelled')}
                >
                  <Text style={styles.actionButtonText}>✕ Annulla</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#000' }]}
                  onPress={() => deleteBooking(item.id)}
                >
                  <Text style={styles.actionButtonText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>📋</Text>
            <Text style={styles.emptyTitle}>Nessuna prenotazione</Text>
          </View>
        }
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5'
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 16
  },
  statsBar: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  statsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },
  listContainer: {
    padding: 16
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  bookingId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666'
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold'
  },
  bookingBody: {
    padding: 16
  },
  bookingRow: {
    marginBottom: 12
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500'
  },
  actions: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0'
  },
  actionButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center'
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold'
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60
  },
  emptyText: {
    fontSize: 64,
    marginBottom: 16
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  }
});