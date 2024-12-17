import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Text,
  TextInput,
} from 'react-native';
import { Button, IconButton, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const LoginScreens = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [screen, setScreen] = useState(1); // 1: Initial, 2: OTP, 3: Register, 4: Verification

  const handleNext = () => {
    if (screen === 1) setScreen(2); // Proceed to OTP screen
    else if (screen === 2) setScreen(3); // Proceed to registration
    else if (screen === 3) setScreen(4); // Proceed to verification
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      {screen === 1 && (
        <View style={styles.screen}>
          <Icon name="person-outline" size={100} color="#2274F0" />
          <Text style={styles.heading}>Log in and unlock the digital universe</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
          <Button mode="contained" onPress={handleNext} style={styles.button}>
            Get OTP
          </Button>
        </View>
      )}
      {screen === 2 && (
        <View style={styles.screen}>
          <Icon name="lock-outline" size={100} color="#2274F0" />
          <Text style={styles.heading}>Enter 6 Digits Code</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
          />
          <Button mode="contained" onPress={handleNext} style={styles.button}>
            Verify
          </Button>
        </View>
      )}
      {screen === 3 && (
        <View style={styles.screen}>
          <Icon name="person-add-outline" size={100} color="#2274F0" />
          <Text style={styles.heading}>Phone number not registered</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Your Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Your Age"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />
          <View style={styles.genderSelection}>
            {['Male', 'Female', 'Others'].map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.genderButton,
                  gender === item && styles.selectedGender,
                ]}
                onPress={() => setGender(item)}
              >
                <Text
                  style={[
                    styles.genderText,
                    gender === item && styles.selectedGenderText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Button mode="contained" onPress={handleNext} style={styles.button}>
            Register
          </Button>
        </View>
      )}
      {screen === 4 && (
        <View style={styles.screen}>
          <Icon name="verified-user-outline" size={100} color="#2274F0" />
          <Text style={styles.heading}>You are verified!</Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#2274F0',
    width: '100%',
    paddingVertical: 10,
  },
  genderSelection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  genderButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  selectedGender: {
    backgroundColor: '#2274F0',
    borderColor: '#2274F0',
  },
  genderText: {
    fontSize: 16,
    color: '#333',
  },
  selectedGenderText: {
    color: '#fff',
  },
});

export default LoginScreens;
