import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App'; 

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig";

interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUpPage: React.FC = () => {
  const { control, handleSubmit, watch, formState: { errors } } = useForm<SignUpFormData>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const password = watch('password');
  
  const onSubmit = async (data: SignUpFormData) => {
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // Firebase Authentication - Create User
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      console.log("Sign Up successful:", userCredential.user);

      // Save user session to AsyncStorage
      await AsyncStorage.setItem("userToken", userCredential.user.uid);
      navigation.navigate("HomePage");

    } catch (error) {
      if (error instanceof Error) {
        console.error("Sign Up error:", error.message);
        alert("Error creating account: " + error.message);
      } else {
        console.error("Unexpected error:", error);
        alert("An unexpected error occurred during signup.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Hello, Welcome</Text>

      <Text style={styles.label}>Email</Text>
      <Controller
        name="email"
        control={control}
        rules={{ 
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email validation regex
              message: 'Enter a valid email address',
            }, 
        }}
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
      {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

      <Text style={styles.label}>Password</Text>
      <Controller
        name="password"
        control={control}
        rules={{ 
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters long',
            },
        }}
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
      {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>} 

      <Text style={styles.label}>Confirm Password</Text>
      <Controller
        name="confirmPassword"
        control={control}
        rules={{
            required: 'Confirm Password is required',
            validate: (value) =>
              value === password || 'Passwords do not match', // Custom validation
        }}
        render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              secureTextEntry
              onChangeText={onChange}
              value={value}
            />
          )}
      />
      {errors.confirmPassword && (
        <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
      )}

        <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit(onSubmit, (errors) => {
                console.log('Validation Errors:', errors); 
              })}
        >
        <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
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
      marginBottom: 30,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
      marginTop: 20,
      color: '#333',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      borderRadius: 5,
      marginBottom: 5,
    },
    button: {
      backgroundColor: '#E0632E',
      padding: 15,
      borderRadius: 15,
      alignItems: 'center',
      marginTop: 40,
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
    errorText: {
        color: 'red',
        fontSize: 12,
        textAlign: 'right'
      }      
  });

export default SignUpPage;
