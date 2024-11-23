import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import MenuList from "./delivery-app/components/MenuList"; // นำเข้า MenuList

export default function App() {
  return (
    <View style={styles.container}>
      <MenuList /> {/* เพิ่ม MenuList */}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50, // เพิ่ม Padding สำหรับให้รายการแสดงผลได้
  },
});
