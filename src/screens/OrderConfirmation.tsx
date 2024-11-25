import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, BackHandler } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';


const OrderConfirmation = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { restaurantLocation, cartItems, restaurantName } = route.params;

  const [userLocation, setUserLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [locationError, setLocationError] = useState(null);

  const [startTimer, setStartTimer] = useState(false);
  const [distance, setDistance] = useState(0); // Distance in km
  const [initialTime, setInitialTime] = useState(0); // Initial time in seconds
  const [timeRemaining, setTimeRemaining] = useState(0); // Remaining time in seconds

  // Disable back navigation after confirmation
  useLayoutEffect(() => {
    if (startTimer) {
      navigation.setOptions({
        headerLeft: () => null,
        gestureEnabled: false,
      });
    } else {
      navigation.setOptions({
        headerLeft: undefined,
        gestureEnabled: true,
      });
    }
  }, [navigation, startTimer]);

  // Handle hardware back button press on Android
  useEffect(() => {
    const onBackPress = () => {
      if (startTimer) {
        Alert.alert(
          'Hold on!',
          'You cannot go back during the countdown.',
          [{ text: 'OK', onPress: () => null }],
          { cancelable: false }
        );
        return true; // Prevent default behavior
      }
      return false; // Allow default behavior
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => backHandler.remove();
  }, [startTimer]);

  // Distance = ACOS((SIN(RADIANS(Lat1)) * SIN(RADIANS(Lat2))) + (COS(RADIANS(Lat1)) * COS(RADIANS(Lat2))) * (COS(RADIANS(Lon2) - RADIANS(Lon1)))) * 6371

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const toRadians = (deg: number) => (deg * Math.PI) / 180;

    const dLat1 = toRadians(lat1);
    const dLat2 = toRadians(lat2);
    const dLon1 = toRadians(lon1);
    const dLon2 = toRadians(lon2);

    const a =
      (Math.sin(dLat1) * Math.sin(dLat2)) +
      (Math.cos(dLat1) * Math.cos(dLat2)) *
        Math.cos(dLon2 - dLon1);

    const c = Math.acos(a) * 6371;
    return c; // Distance in km
  };

  // Fetch user's location and address
  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        // Request permission to access location
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationError('Permission to access location was denied');
          return;
        }
  
        // Get the current location
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location);
  
        // Reverse geocode to get address
        const addressArray = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
  
        if (addressArray.length > 0) {
          const { name, street, city, region, country } = addressArray[0];
          setAddress(`${name || ''} ${street || ''}, ${city || ''}, ${region || ''}, ${country || ''}`);
        } else {
          setAddress('Address not found');
        }
      } catch (error) {
        setLocationError('Failed to fetch location');
      }
    };
  
    fetchUserLocation();
  }, []);
  
  // Calculate Distance and ETA
  useEffect(() => {
    if (userLocation && restaurantLocation) {
      const dist = calculateDistance(
        userLocation.coords.latitude,
        userLocation.coords.longitude,
        restaurantLocation.Location_Latitude,
        restaurantLocation.Location_Longitude
      );
      setDistance(dist);
  
      const speed = 50; // Speed in km/h
      const timeInHours = dist / speed;
      const timeInMinutes = timeInHours * 60; // Convert hours to minutes
      const totalSeconds = Math.floor(timeInMinutes * 60);
      setInitialTime(totalSeconds);
      setTimeRemaining(totalSeconds); // Initialize timeRemaining
    }
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
      navigation.navigate('Done', {restaurantName});
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
          <Text style={styles.title}>{restaurantName}</Text>
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
          {address ? <Text>{address}</Text> : <Text>Fetching address...</Text>}
          {locationError && <Text style={{ color: 'red' }}>{locationError}</Text>}
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
        style={[
          styles.confirmButton,
          (startTimer || timeRemaining <= 0) && styles.disabledButton,
        ]}
        onPress={() => {
          if (!startTimer && timeRemaining > 0) {
            setStartTimer(true);
          }
        }}
        disabled={startTimer || timeRemaining <= 0}
      >
        <Text style={styles.confirmText}>
          {timeRemaining <= 0 ? 'Time Expired' : 'Confirm Order'}
        </Text>
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
  disabledButton: {
    backgroundColor: '#ccc', 
  },  
});

export default OrderConfirmation;
