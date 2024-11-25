import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

const MenuList: React.FC = () => {
  const mockRestaurantId = 2; // ใช้ตัวเลข (Integer)
  const [menuItems, setMenuItems] = useState([]);
  const [restaurantInfo, setRestaurantInfo] = useState(null); // เก็บข้อมูลร้านอาหาร
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState([]); // รายการในตะกร้า
  const navigation = useNavigation();
  const route = useRoute();
  const { RestaurantID } = route.params;

  useEffect(() => {
    // รีเซ็ตตะกร้าสินค้าเมื่อเปลี่ยนร้านอาหาร
    setCartItems([]);

    // ดึงข้อมูลเมนู
    const fetchMenuItems = async () => {
      try {
        const q = query(
          collection(db, "menuItems"),
          where("RestaurantID", "==", mockRestaurantId)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setMenuItems([]);
        } else {
          const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            quantity: 0,
            ...doc.data(),
          }));
          setMenuItems(data);
        }
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    // ดึงข้อมูลร้านอาหาร
    const fetchRestaurantInfo = async () => {
      try {
        const docRef = doc(db, "restaurants", mockRestaurantId.toString());
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setRestaurantInfo(docSnap.data());
        } else {
          console.log("Restaurant not found!");
          setRestaurantInfo(null);
        }
      } catch (error) {
        console.error("Error fetching restaurant info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
    fetchRestaurantInfo();
  }, [mockRestaurantId]);

  const filteredMenuItems = menuItems.filter((item) =>
    item.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (item) => {
    const itemInCart = cartItems.find((cartItem) => cartItem.id === item.id);
    if (itemInCart) {
      const updatedCart = cartItems.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
      setCartItems(updatedCart);
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (item, increment) => {
    const updatedItems = menuItems.map((menuItem) =>
      menuItem.id === item.id
        ? { ...menuItem, quantity: Math.max(0, menuItem.quantity + increment) }
        : menuItem
    );
    setMenuItems(updatedItems);
  };

  const goToCart = () => {
    navigation.navigate("CartScreen", { cartItems });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {restaurantInfo ? (
        <View style={styles.restaurantHeader}>
          <Image
            source={{ uri: restaurantInfo.ImageURL || "https://via.placeholder.com/150" }}
            style={styles.restaurantImage}
          />
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>{restaurantInfo.Name}</Text>
            <Text style={styles.restaurantLocation}>
              {restaurantInfo.ShortLocation || "No location available"}
            </Text>
            <Text style={styles.restaurantRating}>
              ⭐ {restaurantInfo.Rating} ({restaurantInfo.Reviews} Reviews)
            </Text>
          </View>
        </View>
      ) : (
        <Text>Restaurant info not available</Text>
      )}

      <TouchableOpacity style={styles.cartIcon} onPress={goToCart}>
        <Ionicons name="cart-outline" size={30} color="#000" />
        {cartItems.length > 0 && (
          <Text style={styles.cartCount}>{cartItems.length}</Text>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.searchBar}
        placeholder="Search Menus"
        placeholderTextColor="#666"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <FlatList
        data={filteredMenuItems}
        renderItem={({ item }) => (
          <View style={styles.menuItem}>
            <Image source={{ uri: item.ImageURL }} style={styles.image} />
            <Text style={styles.name}>{item.Name}</Text>
            <Text style={styles.price}>{item.Price} ฿</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={() => updateQuantity(item, -1)}>
                <Text style={styles.quantityButton}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <TouchableOpacity onPress={() => updateQuantity(item, 1)}>
                <Text style={styles.quantityButton}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => addToCart(item)}
            >
              <Text style={styles.addButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        numColumns={2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  restaurantHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  restaurantImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  restaurantInfo: {
    marginLeft: 10,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  restaurantLocation: {
    fontSize: 14,
    color: "#666",
  },
  restaurantRating: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  cartIcon: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
  },
  cartCount: {
    position: "absolute",
    top: -5,
    right: -10,
    backgroundColor: "red",
    color: "#fff",
    borderRadius: 10,
    padding: 5,
    fontSize: 12,
    fontWeight: "bold",
  },
  searchBar: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
  menuItem: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    margin: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  price: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  quantityButton: {
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 10,
    color: "#E0632E",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
  addButton: {
    backgroundColor: "#E0632E",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
  },
});

export default MenuList;
