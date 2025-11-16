import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function ServiceCard({ service, onBook }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.serviceName}>{service.name}</Text>
          <Text style={styles.servicePrice}>€{service.price}</Text>
        </View>
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{service.duration} min</Text>
        </View>
      </View>

      {service.description && (
        <Text style={styles.description}>{service.description}</Text>
      )}

      <View style={styles.cardFooter}>
        <View style={styles.slotsInfo}>
          <Text style={styles.slotsIcon}>📅</Text>
          <Text style={styles.slotsText}>
            {service.availableSlots?.length || 0} slot disponibili
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => onBook(service)}
        >
          <Text style={styles.bookButtonText}>Prenota</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  serviceName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4
  },
  servicePrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF'
  },
  durationBadge: {
    backgroundColor: '#e6f2ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12
  },
  durationText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600'
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8
  },
  slotsInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  slotsIcon: {
    fontSize: 16,
    marginRight: 6
  },
  slotsText: {
    fontSize: 14,
    color: '#666'
  },
  bookButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});