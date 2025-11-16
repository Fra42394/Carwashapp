import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, FlatList, TextInput, StyleSheet, ScrollView } from "react-native";
import { createBookingAtomic } from "../helpers/bookingHelpers";

export default function BookingScreen({ route, navigation }) {
  const { service } = route.params;
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!selectedSlot) {
      Alert.alert("Errore", "Seleziona uno slot");
      return;
    }
    if (!address.trim()) {
      Alert.alert("Errore", "Inserisci l'indirizzo");
      return;
    }

    setLoading(true);
    try {
      const result = await createBookingAtomic(service.id, selectedSlot, address);
      Alert.alert(
        "✅ Prenotazione confermata!",
        `ID prenotazione: ${result.bookingId}`,
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Home")
          }
        ]
      );
    } catch (error) {
      Alert.alert("Errore", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>{service.name}</Text>
        <Text style={styles.servicePrice}>€{service.price}</Text>
        <Text style={styles.serviceDuration}>Durata: {service.duration} minuti</Text>
        {service.description && (
          <Text style={styles.serviceDescription}>{service.description}</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📍 Indirizzo</Text>
        <TextInput
          placeholder="Es. Via Roma 123, Milano"
          value={address}
          onChangeText={setAddress}
          style={styles.input}
          multiline
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📅 Seleziona data e ora</Text>
        <FlatList
          data={service.availableSlots}
          keyExtractor={(item) => item}
          scrollEnabled={false}
          renderItem={({ item }) => {
            const date = new Date(item);
            const isSelected = selectedSlot === item;
            return (
              <TouchableOpacity
                style={[styles.slotCard, isSelected && styles.slotCardSelected]}
                onPress={() => setSelectedSlot(item)}
              >
                <View style={styles.slotContent}>
                  <Text style={[styles.slotDate, isSelected && styles.slotTextSelected]}>
                    {date.toLocaleDateString('it-IT', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short'
                    })}
                  </Text>
                  <Text style={[styles.slotTime, isSelected && styles.slotTextSelected]}>
                    {date.toLocaleTimeString('it-IT', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                </View>
                {isSelected && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <TouchableOpacity
        style={[styles.confirmButton, loading && styles.confirmButtonDisabled]}
        onPress={handleConfirm}
        disabled={loading}
      >
        <Text style={styles.confirmButtonText}>
          {loading ? "Prenotazione in corso..." : "Conferma prenotazione"}
        </Text>
      </TouchableOpacity>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  serviceInfo: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  serviceName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8
  },
  servicePrice: {
    fontSize: 20,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 4
  },
  serviceDuration: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 12,
    padding: 20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    minHeight: 50
  },
  slotCard: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  slotCardSelected: {
    backgroundColor: '#e6f2ff',
    borderColor: '#007AFF'
  },
  slotContent: {
    flex: 1
  },
  slotDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4
  },
  slotTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF'
  },
  slotTextSelected: {
    color: '#007AFF'
  },
  checkmark: {
    fontSize: 24,
    color: '#007AFF',
    fontWeight: 'bold'
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    margin: 20,
    marginTop: 12
  },
  confirmButtonDisabled: {
    backgroundColor: '#999'
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  }
});