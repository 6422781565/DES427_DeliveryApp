import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from "../../App";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../config/firebaseConfig";

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { control, handleSubmit, getValues } = useForm<LoginFormData>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      // console.log("Login successful:", userCredential.user);

      // Save user session to AsyncStorage
      await AsyncStorage.setItem("userToken", userCredential.user.uid);
      navigation.navigate("HomePage");

    } catch (error) {
        if (error instanceof Error) {
          console.error("Login error:", error.message);
          Alert.alert("Login Failed", "Invalid email or password: " + error.message);
        } else {
          console.error("Unexpected error:", error);
          Alert.alert("An unexpected error occurred");
        }
    }
  };

  // Handle forgot password
  const handleForgotPassword = async () => {
    const email = getValues("email");
    if (!email) {
      Alert.alert("Error", "Please enter your email to reset your password.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        "Password Reset",
        "A password reset email has been sent to your email address."
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error("Forgot Password error:", error.message);
        Alert.alert("Error", "Failed to send password reset email: " + error.message);
      } else {
        console.error("Unexpected error:", error);
        Alert.alert("An unexpected error occurred");
      }
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Hello, Welcome Back</Text>

      <Text style={styles.label}>Email</Text>
      <Controller
        name="email"
        control={control}
        rules={{ required: "Email is required" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            keyboardType="email-address"
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <Text style={styles.label}>Password</Text>
      <Controller
        name="password"
        control={control}
        rules={{ required: "Password is required" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        Don’t have an account?{' '}
        <Text
          style={styles.link}
          onPress={() => navigation.navigate('SignUpPage')}
        >
          Sign up
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 50,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 50,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 50,
  },
  forgotText: {
    color: 'red',
  },
  button: {
    backgroundColor: '#E0632E',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 15,
    textAlign: 'right',
  },
  link: {
    color: '#1e40af',
    fontWeight: 'bold',
  },
});

export default LoginPage;
