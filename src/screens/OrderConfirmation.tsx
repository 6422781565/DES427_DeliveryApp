import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const OrderConfirmation = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userLocation, restaurantLocation, cartItems } = route.params;

  const [startTimer, setStartTimer] = useState(false);
  const [distance, setDistance] = useState(0); // Distance in km
  const [ETA, setETA] = useState(0); // Estimated Time in minutes
  const [initialTime, setInitialTime] = useState(0); // Initial time in seconds
  const [timeRemaining, setTimeRemaining] = useState(0); // Remaining time in seconds

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const toRadians = (deg) => (deg * Math.PI) / 180;

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  // Calculate ETA and initialize timeRemaining
  useEffect(() => {
    const { Location_Latitude: userLat, Location_Longitude: userLon } = userLocation;
    const { Location_Latitude: restLat, Location_Longitude: restLon } = restaurantLocation;

    const dist = calculateDistance(
      parseFloat(userLat),
      parseFloat(userLon),
      restLat,
      restLon
    );
    setDistance(dist);

    const speed = 50; // Speed in km/h
    const timeInHours = dist / speed;
    const timeInMinutes = Math.ceil(timeInHours * 60); // Convert hours to minutes
    setETA(timeInMinutes);
    const totalSeconds = timeInMinutes * 60;
    setInitialTime(totalSeconds);
    setTimeRemaining(totalSeconds); // Initialize timeRemaining
  }, [userLocation, restaurantLocation]);

  // Timer logic
  useEffect(() => {
    if (startTimer && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev > 0) {
            return prev - 1;
          } else {
            clearInterval(timer);
            return 0;
          }
        });
      }, 1000);
      return () => clearInterval(timer);
    }

    // Navigate to the 'Done' page when the timer hits zero
    if (startTimer && timeRemaining === 0) {
      navigation.navigate('Done');
    }
  }, [startTimer, timeRemaining, navigation]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes} min ${secs} sec`;
  };

  const calculateTotal = () => {
    let total = 0;
    cartItems.forEach(item => {
      total += item.quantity * item.Price;
    });
    return total.toFixed(2);
  };

  const calculateTotalQuantity = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Progress bar width
  const progress = timeRemaining / initialTime; // Percentage of total time
  const progressWidth = `${progress * 100}%`;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Baiyoke Delivery</Text>
        </View>

        {/* Order Summary */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>My order</Text>
          {cartItems.map(item => (
            <View style={styles.row} key={item.id}>
              <Text style={styles.foodName}>{item.Name}</Text>
              <Text style={styles.foodQty}>{item.quantity}</Text>
              <Text style={styles.foodPrice}>฿{(item.Price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.foodName}>Total</Text>
            <Text style={styles.foodQty}>{calculateTotalQuantity()}</Text>
            <Text style={styles.foodPrice}>฿{calculateTotal()}</Text>
          </View>
        </View>

        {/* Location */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Your Location</Text>
          <Text>35/26 Thammasat University Khlong Neung Khlong Luang 12120</Text>
        </View>

        {/* ETA */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Estimated Time Arrival</Text>
          <Text style={styles.eta}>{formatTime(timeRemaining)}</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: progressWidth }]} />
        </View>
      </ScrollView>

      {/* Confirm Button */}
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => {
          if (timeRemaining > 0) {
            setStartTimer(true);
          }
        }}
      >
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
    alignItems: 'center',
    marginBottom: 16,
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
  progressBarContainer: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 16,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#f57c00',
    borderRadius: 4,
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