import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native'; // Assuming navigation is used

const Done = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() =>  navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'HomePage' }], // Replace 'Home' with your homepage route name
            }))}>
        </TouchableOpacity>
      </View>

      {/* Centered Completion Message */}
      <View style={styles.content}>
        <Text style={styles.mainText}>
          Your order is completed
        </Text>
        <Text style={styles.subText}>Thank you for using our delivery app!</Text>
      </View>
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
});

export default Done;
