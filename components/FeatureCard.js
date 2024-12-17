import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window'); // Get the screen width

const FeatureCard = ({ title, description, iconSource }) => (
  <TouchableOpacity style={styles.card}>
    {/* Circle with icon */}
    <View style={styles.circleContainer}>
      <Image source={iconSource} style={styles.icon} />
    </View>

    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardDescription}>{description}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    width: width * 0.45, // 45% of the screen width
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    margin: 10,
    borderWidth: 1, // Gray border for the card
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
    alignItems: 'flex-start', // Left align the content
  },
  circleContainer: {
    width: 50,
    height: 50,
    borderRadius: 25, // Circle shape
    borderWidth: 5,
    borderColor: '#FF6600', // Orange color border
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    width: 25,
    height: 25,
    resizeMode: 'contain', 
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left', // Left align the title
    width: '100%', // Ensure title takes up full width to align properly
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'left', // Left align the description
    width: '100%', // Ensure description takes up full width to align properly
  },
});

export default FeatureCard;
