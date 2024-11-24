import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
//import { AuthProvider } from './utils/AuthProvider';
import LoginPage from "./delivery-app/components/LoginPage";
import SignUpPage from "./delivery-app/components/SignUpPage";
import ProfileCreationPage from "./delivery-app/components/ProfileCreationPage";
import HomePage from "./delivery-app/components/HomePage";

//import MenuListScreen from "./delivery-app/components/MenuList"; // นำเข้า MenuListScreen (เปลี่ยนชื่อไฟล์)

export type RootStackParamList = {
  LoginPage: undefined;
  SignUpPage: undefined;
  ProfileCreationPage: undefined;
  HomePage: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        {/*<MenuListScreen />  Display MenuListScreen */}
        <Stack.Navigator initialRouteName="HomePage">
        <Stack.Screen
          name="LoginPage"
          component={LoginPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUpPage"
          component={SignUpPage}
          options={{ title: "Sign Up" }}
        />
        <Stack.Screen
          name="ProfileCreationPage"
          component={ProfileCreationPage}
          options={{ title: "Create Profile" }}
        />
        <Stack.Screen
          name="HomePage"
          component={HomePage}
          options={{ title: "Home" }} 
        />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </View>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50, // เพิ่ม Padding เพื่อเว้นพื้นที่ด้านบน
  },
});
