import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig"; 

interface Banner {
  id: string;
  image: any;
}

interface Restaurant {
  id: string;
  name: string;
  address: string;
  rating: number;
  reviews: number;
  image: string;
}

const { width: screenWidth } = Dimensions.get('window');
const bannerWidth = screenWidth * 0.9;
const bannerHeight = 200;


const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const navigation = useNavigation();
  const bannerFlatListRef = useRef<FlatList>(null);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);  

  const banners: Banner[] = [
    { id: '1', image: require('../../assets/banner1.jpeg') },
    { id: '2', image: require('../../assets/banner2.jpeg') },
    { id: '3', image: require('../../assets/banner3.jpeg') },
    { id: '4', image: require('../../assets/banner4.jpeg') },
    { id: '5', image: require('../../assets/banner5.jpeg') },
  ];

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "restaurants"));
        const restaurantData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRestaurants(restaurantData);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    fetchRestaurants();
  }, []);

  // Filter restaurants based on the search term
  const filteredRestaurants = restaurants.filter(
    (restaurant) =>
      restaurant.Name && 
      restaurant.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 3000);

    return () => clearInterval(interval); 
  }, [banners.length]);

  // Scroll to the current banner index
  useEffect(() => {
    if (bannerFlatListRef.current) {
      bannerFlatListRef.current.scrollToIndex({
        index: currentBannerIndex,
        animated: true,
      });
    }
  }, [currentBannerIndex]);

  // Handle Logout
  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'LoginPage' }],
    });
  };

  return (
    <View style={styles.container}>
      {/* Fixed Greeting Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Afternoon!</Text>
          <Text style={styles.slogan}>Ready to satisfy your cravings today?</Text> 
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={50} color="#E0632E" />
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.scrollableContent}>
        {/* Horizontal Scrolling Banner */}
        <FlatList
          data={banners}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          ref={bannerFlatListRef} 
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
          <TextInput
            style={styles.searchInput}
            placeholder="Search Restaurants"
            placeholderTextColor="#aaa"
            value={searchTerm} 
            onChangeText={(text) => setSearchTerm(text)} 
          />
        </View>

        {/* Restaurant List */}
        <Text style={styles.sectionTitle}>For You</Text>
        <FlatList
          data={filteredRestaurants} 
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.restaurantCard}
              onPress={() => navigation.navigate('MenuList', { RestaurantID: item.id })}
            >
              <Image source={{ uri: item.ImageURL }} style={styles.restaurantImage} />
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{item.Name}</Text>
                <Text style={styles.restaurantAddress}>{item.ShortLocation}</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color="#ffcc00" />
                  <Text style={styles.ratingText}>{item.Rating}</Text>
                  <Text style={styles.reviewsText}>({item.Reviews})</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContentContainer} 
        />
      </ScrollView>
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
    fontSize: 38,
    fontWeight: 'bold',
    color: '#555',
  },
  slogan: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#E0632E',
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
    padding: 10,
    marginHorizontal: 30,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  restaurantImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginRight: 20,
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
    marginTop: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
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
  listContentContainer: {
    paddingBottom: 100, 
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
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#777',
    marginTop: 5,
  },
  footerTextActive: {
    fontSize: 12,
    color: '#E0632E',
  },
});

export default HomePage;
