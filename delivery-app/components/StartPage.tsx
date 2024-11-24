import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";

import AsyncStorage from "@react-native-async-storage/async-storage";


const StartPage: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const checkAuth = async () => {
      const userToken = await AsyncStorage.getItem("userToken");

      // Navigate to HomePage if authenticated, otherwise LoginPage
      if (userToken) {
        navigation.navigate("HomePage");
      } else {
        navigation.navigate("LoginPage");
      }
    };
    
    setTimeout(checkAuth, 4000); // Simulate a 4-second splash screen
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Food Delivery App</Text>
      <ActivityIndicator size="large" color="#E0632E" style={{ marginTop: 20 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  //logo: { width: 150, height: 150, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#E0632E" },
});

export default StartPage;
