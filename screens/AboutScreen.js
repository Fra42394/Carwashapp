import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.emoji}>🚗💧</Text>
        <Text style={styles.title}>CarWash</Text>
        <Text style={styles.subtitle}>Lavaggio auto a domicilio</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chi siamo</Text>
        <Text style={styles.text}>
          CarWash è il servizio di lavaggio auto professionale a domicilio. 
          Portiamo la pulizia direttamente da te, ovunque tu sia.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌟 I nostri vantaggi</Text>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>✓</Text>
          <Text style={styles.featureText}>Servizio a domicilio</Text>
        </View>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>✓</Text>
          <Text style={styles.featureText}>Prodotti professionali eco-friendly</Text>
        </View>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>✓</Text>
          <Text style={styles.featureText}>Personale qualificato e certificato</Text>
        </View>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>✓</Text>
          <Text style={styles.featureText}>Prenotazione facile e veloce</Text>
        </View>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>✓</Text>
          <Text style={styles.featureText}>Prezzi trasparenti</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📞 Contatti</Text>
        <Text style={styles.text}>Email: info@carwash.it</Text>
        <Text style={styles.text}>Telefono: +39 123 456 7890</Text>
        <Text style={styles.text}>Orari: Lun-Sab 8:00-20:00</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📍 Area di servizio</Text>
        <Text style={styles.text}>
          Operiamo in tutta Italia, con copertura nelle principali città 
          e province. Verifica la disponibilità nella tua zona al momento 
          della prenotazione.
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>CarWash © 2025</Text>
        <Text style={styles.footerSubtext}>Pulizia professionale, ovunque tu sia</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 40,
    alignItems: 'center'
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 12
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16
  },
  text: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 8
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  featureIcon: {
    fontSize: 20,
    color: '#4CAF50',
    marginRight: 12,
    fontWeight: 'bold'
  },
  featureText: {
    fontSize: 16,
    color: '#333',
    flex: 1
  },
  footer: {
    backgroundColor: '#fff',
    padding: 30,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 20
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4
  },
  footerSubtext: {
    fontSize: 12,
    color: '#ccc',
    fontStyle: 'italic'
  }
});