import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FloatingButton from '../components/FloatingButton';


const HomeScreen = () => (
  <View style={styles.container2}>
  <View style={styles.container}>
    <Text style={styles.heading}>Welcome to Home</Text>

 
  </View>
     <FloatingButton />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  container2: {
    flex: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
