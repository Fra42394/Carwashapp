import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Alert, Modal, ScrollView } from "react-native";
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function AdminScreen() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration: "",
    description: "",
    availableSlots: ""
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const snap = await getDocs(collection(db, "services"));
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setServices(list);
    } catch (error) {
      Alert.alert("Errore", "Impossibile caricare i servizi");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        price: service.price.toString(),
        duration: service.duration.toString(),
        description: service.description || "",
        availableSlots: (service.availableSlots || []).join("\n")
      });
    } else {
      setEditingService(null);
      setFormData({
        name: "",
        price: "",
        duration: "",
        description: "",
        availableSlots: ""
      });
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price || !formData.duration) {
      Alert.alert("Errore", "Compila tutti i campi obbligatori");
      return;
    }

    const slots = formData.availableSlots
      .split("\n")
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const serviceData = {
      name: formData.name,
      price: parseFloat(formData.price),
      duration: parseInt(formData.duration),
      description: formData.description,
      availableSlots: slots
    };

    try {
      if (editingService) {
        await updateDoc(doc(db, "services", editingService.id), serviceData);
        Alert.alert("Successo", "Servizio aggiornato!");
      } else {
        await setDoc(doc(collection(db, "services")), serviceData);
        Alert.alert("Successo", "Servizio creato!");
      }
      setModalVisible(false);
      fetchServices();
    } catch (error) {
      Alert.alert("Errore", error.message);
    }
  };

  const handleDelete = async (serviceId) => {
    Alert.alert(
      "Conferma eliminazione",
      "Sei sicuro di voler eliminare questo servizio?",
      [
        { text: "Annulla", style: "cancel" },
        {
          text: "Elimina",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "services", serviceId));
              Alert.alert("Successo", "Servizio eliminato!");
              fetchServices();
            } catch (error) {
              Alert.alert("Errore", error.message);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
        <Text style={styles.addButtonText}>➕ Aggiungi Servizio</Text>
      </TouchableOpacity>

      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.serviceCard}>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>{item.name}</Text>
              <Text style={styles.servicePrice}>€{item.price} - {item.duration} min</Text>
              <Text style={styles.serviceSlots}>
                {item.availableSlots?.length || 0} slot disponibili
              </Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => openModal(item)}
              >
                <Text style={styles.buttonText}>✏️ Modifica</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.buttonText}>🗑️ Elimina</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>
                {editingService ? "Modifica Servizio" : "Nuovo Servizio"}
              </Text>

              <TextInput
                placeholder="Nome servizio *"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                style={styles.input}
              />

              <TextInput
                placeholder="Prezzo (€) *"
                value={formData.price}
                onChangeText={(text) => setFormData({ ...formData, price: text })}
                style={styles.input}
                keyboardType="numeric"
              />

              <TextInput
                placeholder="Durata (minuti) *"
                value={formData.duration}
                onChangeText={(text) => setFormData({ ...formData, duration: text })}
                style={styles.input}
                keyboardType="numeric"
              />

              <TextInput
                placeholder="Descrizione"
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                style={styles.input}
                multiline
              />

              <Text style={styles.label}>Slot disponibili (uno per riga, formato ISO):</Text>
              <TextInput
                placeholder="2025-11-20T10:00:00.000Z"
                value={formData.availableSlots}
                onChangeText={(text) => setFormData({ ...formData, availableSlots: text })}
                style={[styles.input, styles.textArea]}
                multiline
                numberOfLines={5}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Annulla</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.buttonText}>Salva</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16
  },
  addButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  serviceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2
  },
  serviceInfo: {
    marginBottom: 12
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4
  },
  servicePrice: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4
  },
  serviceSlots: {
    fontSize: 14,
    color: '#999'
  },
  actions: {
    flexDirection: 'row',
    gap: 8
  },
  editButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center'
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '90%'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top'
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#999',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center'
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#FF3B30',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center'
  }
});