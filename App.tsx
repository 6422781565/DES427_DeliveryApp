import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import MenuListScreen from "./delivery-app/components/MenuList"; // นำเข้า MenuListScreen (เปลี่ยนชื่อไฟล์)

export default function App() {
  return (
    <View style={styles.container}>
      <MenuListScreen /> {/* เพิ่ม MenuListScreen */}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50, // เพิ่ม Padding เพื่อเว้นพื้นที่ด้านบน
  },
});
