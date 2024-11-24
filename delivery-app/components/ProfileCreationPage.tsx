import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../App'; 

interface ProfileFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  homeAddress: string;
  deliveryInstructions: string;
}

const ProfileCreationPage: React.FC = () => {
  const { control, handleSubmit } = useForm<ProfileFormData>();
  const navigation = useNavigation();

  const onSubmit = (data: ProfileFormData) => {
    console.log('Profile Data:', data);
    alert('Account Created Successfully');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create an Account</Text>
      <Text style={styles.subHeader}>Please fill in your personal information</Text>
      
      <Text style={styles.sectionTitle}>Personal Information</Text>
      <Text style={styles.subTitle}>First Name</Text>
      <Controller
        name="firstName"
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Enter your first name"
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      <Text style={styles.subTitle}>Last Name</Text>
      <Controller
        name="lastName"
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Enter your last name"
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      <Text style={styles.subTitle}>Phone Number</Text>
      <Controller
        name="phoneNumber"
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      <Text style={styles.subTitle}>Date of Birth</Text>
      <Controller
        name="dateOfBirth"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Enter your date of birth"
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <Text style={styles.sectionTitle}>Address Details</Text>
      <Text style={styles.subTitle}>Home Address</Text>
      <Controller
        name="homeAddress"
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Enter your home address"
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      <Text style={styles.subTitle}>Delivery Instructions</Text>
      <Controller
        name="deliveryInstructions"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter delivery instructions"
            multiline
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 150,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'left',
    color: '#555',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    color: '#333',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'normal',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
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
    fontSize: 16,
  },
});

export default ProfileCreationPage;
