import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const OrderConfirmation = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Back Button and Title */}
        <View style={styles.header}>
          <Text style={styles.title}>Baiyoke Delivery</Text>
        </View>

        {/* Order Summary */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>My order</Text>
          <View style={styles.row}>
            <Text style={styles.foodName}>ผัดไทย</Text>
            <Text style={styles.foodQty}>1</Text>
            <Text style={styles.foodPrice}>฿250.00</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.foodName}>กุ้งย่าง</Text>
            <Text style={styles.foodQty}>3</Text>
            <Text style={styles.foodPrice}>฿1050.00</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.foodName}>ชาเขียว</Text>
            <Text style={styles.foodQty}>2</Text>
            <Text style={styles.foodPrice}>฿900.00</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.foodName}>Total</Text>
            <Text style={styles.foodQty}>6</Text>
            <Text style={styles.foodPrice}>฿2200.00</Text>
          </View>
        </View>

        {/* Location */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Your Location</Text>
          <Text>35/26 Thammasat University Khlong Neung Khlong Luang 12120</Text>
        </View>

        {/* Estimated Time Arrival */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Estimated Time Arrival</Text>
          <Text style={styles.eta}>30 min</Text>
        </View>
      </ScrollView>

      {/* Confirm Order Button */}
      <TouchableOpacity style={styles.confirmButton}>
        <Text style={styles.confirmText}>Confirm Order</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 8,
  },
  foodName: {
    flex: 2,
    textAlign: 'left',
  },
  foodQty: {
    flex: 1,
    textAlign: 'center',
  },
  foodPrice: {
    flex: 1,
    textAlign: 'right',
  },
  eta: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginTop: 8,
  },
  confirmButton: {
    backgroundColor: '#f57c00',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default OrderConfirmation;
