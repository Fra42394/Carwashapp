import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import ServiceCard from "../components/ServiceCard";

export default function HomeScreen({ navigation }) {
  const [services, setServices] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const snap = await getDocs(collection(db, "services"));
      const now = new Date();
      const list = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .map(s => ({
          ...s,
          availableSlots: (s.availableSlots || []).filter(slot => new Date(slot) > now)
        }))
        .filter(s => (s.availableSlots || []).length > 0);
      setServices(list);
    } catch (error) {
      Alert.alert("Errore", "Impossibile caricare i servizi");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onBook = (service) => {
    navigation.navigate("Booking", { service });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Caricamento servizi...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Benvenuto! 👋</Text>
        <Text style={styles.subtitle}>Scegli il servizio di lavaggio</Text>
      </View>

      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ServiceCard service={item} onBook={onBook} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>😔</Text>
            <Text style={styles.emptyTitle}>Nessun servizio disponibile</Text>
            <Text style={styles.emptySubtitle}>Riprova più tardi</Text>
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
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4
  },
  subtitle: {
    fontSize: 14,
    color: '#666'
  },
  listContainer: {
    padding: 16
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
    color: '#333',
    marginBottom: 8
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666'
  }
});