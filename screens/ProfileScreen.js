import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FloatingButton from '../components/FloatingButton';
import FeatureCardWithDetails from '../components/FeatureCardWithDetails';
import Header from '../components/Header';

const ProfileScreen = () => {
  const [coinCount, setCoinCount] = useState(122); // Move this inside the ProfileScreen function

  return (
    <View style={styles.container}>
      <Header coinCount={coinCount} />
      <Text>Welcome to Profile</Text>
      <FeatureCardWithDetails />
      <FloatingButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FD',
  },
});

export default ProfileScreen;
