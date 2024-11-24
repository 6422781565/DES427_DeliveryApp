import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from "./delivery-app/components/LoginPage";
import SignUpPage from "./delivery-app/components/SignUpPage";
import ProfileCreationPage from "./delivery-app/components/ProfileCreationPage";
import HomePage from "./delivery-app/components/HomePage";


export type RootStackParamList = {
  LoginPage: undefined;
  SignUpPage: undefined;
  ProfileCreationPage: undefined;
  HomePage: { userId: string }; 
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <Stack.Navigator initialRouteName="LoginPage">
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
    paddingTop: 50, 
  },
});
