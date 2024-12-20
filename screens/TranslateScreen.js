import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TranslateScreen = ({ route }) => {
    const { transcription } = route.params || {};

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Transcription Result</Text>
            <Text style={styles.content}>{transcription || 'No transcription available.'}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    content: {
        fontSize: 16,
        textAlign: 'center',
        color: '#333',
    },
});

export default TranslateScreen;
