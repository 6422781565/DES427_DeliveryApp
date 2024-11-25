import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LoginPage from "./src/screens/LoginPage";
import SignUpPage from "./src/screens/SignUpPage";
import HomePage from "./src/screens/HomePage";
import MenuList from "./src/screens/MenuList";
import OrderConfirmation from "./src/screens/OrderConfirmation";
import Done from "./src/screens/Done";

export type RootStackParamList = {
  LoginPage: undefined;
  SignUpPage: undefined;
  HomePage: undefined;
  MenuList: undefined;
  OrderConfirmation: undefined;
  Done: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <Stack.Navigator initialRouteName="LoginPage">
          <Stack.Screen
            name="LoginPage"
            component={LoginPage}
            options={{
              headerShown: false,
              gestureEnabled: false
             }}
          />
          <Stack.Screen
            name="SignUpPage"
            component={SignUpPage}
            options={{
              title: "Sign Up",
              gestureEnabled: false
            }}
          />
          <Stack.Screen
            name="HomePage"
            component={HomePage}
            options={{
              headerShown: false,
              gestureEnabled: false
            }}
          />
          <Stack.Screen
            name="MenuList"
            component={MenuList}
            options={{
              title: "Restaurant",
              gestureEnabled: false
            }}
          />
          <Stack.Screen
            name="OrderConfirmation"
            component={OrderConfirmation}
            options={{title: "Cart",
              gestureEnabled: false
            }}
          />
          <Stack.Screen
            name="Done"
            component={Done}
            options={{
              headerShown: false,
              gestureEnabled: false
            }}
          />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </View>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
  },
});

export default App;
