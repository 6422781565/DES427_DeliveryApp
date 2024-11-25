import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native'; // Assuming navigation is used

const Done = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { restaurantName } = route.params;

  return (
    <View style={styles.container}>
      {/* Centered Completion Message */}
      <View style={styles.content}>
        <Text style={styles.mainText}>
          Your order from {restaurantName} is completed
        </Text>
        <Text style={styles.subText}>Thank you for using our delivery app!</Text>
      </View>
      <TouchableOpacity
        style={styles.BacktoHomeButton}
        onPress={() => navigation.navigate('HomePage')}
      >
        <Text style={styles.BacktoHomeText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
  },
  BacktoHomeButton: {
    backgroundColor: '#E0632E',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  BacktoHomeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Done;
