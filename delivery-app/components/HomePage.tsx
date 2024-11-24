import React from 'react';
import { View, Text, TextInput, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

// Define type for banners
interface Banner {
  id: string;
  image: any; // For `require` images
}

// Define type for restaurants
interface Restaurant {
  id: string;
  name: string;
  address: string;
  rating: number;
  reviews: number;
  deliveryFee: string;
  image: string;
}

const { width: screenWidth } = Dimensions.get('window');
const bannerWidth = screenWidth * 0.9;
const bannerHeight = 200;

const HomePage: React.FC = () => {
  // Banner data with types
  const banners: Banner[] = [
    { id: '1', image: require('../assets/banner1.jpeg') },
    { id: '2', image: require('../assets/banner2.jpeg') },
    { id: '3', image: require('../assets/banner3.jpeg') },
  ];

  // Restaurant data with types
  const restaurants: Restaurant[] = [
    {
      id: '1',
      name: 'Baiyoke Delivery',
      address: 'ถนนราชปรารภ',
      rating: 4.5,
      reviews: 357,
      deliveryFee: '10',
      image: 'https://via.placeholder.com/100',
    },
    {
      id: '2',
      name: 'Rangsit Cuisine',
      address: 'ถนนรังสิต-นครนายก',
      rating: 3.9,
      reviews: 530,
      deliveryFee: '10',
      image: 'https://via.placeholder.com/100',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Fixed Greeting Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning</Text>
          <Text style={styles.username}>John Smith</Text>
          <Text style={styles.address}>Deliver to 99 M.18 Phahonyothin Rd., Pathum Thani 12120</Text>
        </View>
        <Ionicons name="person-circle-outline" size={50} color="#f7931e" />
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.scrollableContent}>
        {/* Horizontal Scrolling Banner */}
        <FlatList
          data={banners}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled // Ensure one banner per scroll
          renderItem={({ item }) => (
            <View style={[styles.bannerWrapper]}>
              <Image
                source={item.image}
                style={[styles.bannerImage, { width: bannerWidth, height: bannerHeight }]}
                resizeMode="cover"
              />
            </View>
          )}
          contentContainerStyle={styles.bannerContainer}
        />

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#ccc" />
          <TextInput style={styles.searchInput} placeholder="Search Restaurants" />
        </View>

        {/* Restaurant List */}
        <Text style={styles.sectionTitle}>For You</Text>
        <FlatList
          data={restaurants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.restaurantCard}>
              <Image source={{ uri: item.image }} style={styles.restaurantImage} />
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{item.name}</Text>
                <Text style={styles.restaurantAddress}>{item.address}</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color="#ffcc00" />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                  <Text style={styles.reviewsText}>({item.reviews})</Text>
                </View>
                <Text style={styles.deliveryFee}>Delivery Fee ฿{item.deliveryFee}</Text>
              </View>
            </TouchableOpacity>
          )}
          scrollEnabled={false} // Disable FlatList scrolling, let ScrollView handle it
        />
      </ScrollView>

      {/* Fixed Footer */}
      <View style={styles.footer}>
        <TouchableOpacity>
          <Ionicons name="home" size={24} color="#f7931e" />
          <Text style={styles.footerTextActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="clipboard-outline" size={24} color="#ccc" />
          <Text style={styles.footerText}>Status</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="menu-outline" size={24} color="#ccc" />
          <Text style={styles.footerText}>Others</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#fff',
    borderBottomWidth: 0,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
  username: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#f7931e',
    marginBottom: 10,
  },
  address: {
    fontSize: 13,
    color: '#777',
  },
  scrollableContent: {
    flex: 1,
  },
  bannerWrapper: {
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerImage: {
    width: bannerWidth,
    height: bannerHeight,
    overflow: 'hidden',
  },
  bannerContainer: {
    marginBottom: 30,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    marginHorizontal: 30,
    padding: 10,
    borderRadius: 10,
  },
  searchInput: {
    marginLeft: 10,
    fontSize: 14,
    flex: 1,
  },
  sectionTitle: {
    marginHorizontal: 30,
    marginVertical: 30,
    fontSize: 16,
    fontWeight: 'bold',
  },
  restaurantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 30,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  restaurantImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  restaurantAddress: {
    fontSize: 12,
    color: '#777',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  ratingText: {
    fontSize: 12,
    color: '#333',
    marginLeft: 5,
  },
  reviewsText: {
    fontSize: 12,
    color: '#777',
    marginLeft: 5,
  },
  deliveryFee: {
    fontSize: 12,
    color: '#1e90ff',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerText: {
    fontSize: 12,
    color: '#777',
  },
  footerTextActive: {
    fontSize: 12,
    color: '#f7931e',
  },
});

export default HomePage;
