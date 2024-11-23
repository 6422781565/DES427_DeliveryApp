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
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Icon from "react-native-vector-icons/Ionicons"; // สำหรับไอคอน

const MenuListScreen = ({ navigation }) => {
  const mockRestaurantId = 1; // ใช้ตัวเลข (Integer)
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState([]); // รายการในตะกร้า

  useEffect(() => {
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
            quantity: 0, // เพิ่มฟิลด์ quantity เริ่มต้นเป็น 0
            ...doc.data(),
          }));
          setMenuItems(data);
        }
      } catch (error) {
        console.error("Error fetching menu items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

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
        ? { ...menuItem, quantity: Math.max(0, menuItem.quantity + increment) } // ไม่ให้ติดลบ
        : menuItem
    );
    setMenuItems(updatedItems);
  };

  const goToCart = () => {
    navigation.navigate("CartScreen", { cartItems }); // ส่งข้อมูลตะกร้าไปยังหน้า Cart
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading menu items...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ส่วนแสดงข้อมูลร้านอาหาร */}
      <View style={styles.restaurantHeader}>
        <Image
          source={{
            uri: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1b/78/9b/f9/2-1100-1500-1700-2200.jpg?w=600&h=600&s=1",
          }}
          style={styles.restaurantImage}
        />
        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantName}>Baiyoke Delivery</Text>
          <Text style={styles.restaurantLocation}>Thanon Ratchaprarop</Text>
          <Text style={styles.restaurantRating}>⭐ 4.5 (357 Reviews)</Text>
        </View>
      </View>

      {/* ไอคอนตะกร้าสินค้า */}
      <TouchableOpacity style={styles.cartIcon} onPress={goToCart}>
        <Icon name="cart-outline" size={30} color="#000" />
        {cartItems.length > 0 && (
          <Text style={styles.cartCount}>{cartItems.length}</Text>
        )}
      </TouchableOpacity>

      {/* แถบค้นหา */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search Menus"
        placeholderTextColor="#666"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {/* รายการสินค้า */}
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

export default MenuListScreen;
