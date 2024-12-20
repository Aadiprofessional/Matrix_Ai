import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const TranslateScreen = ({ route }) => {
    const { transcription } = route.params || {};

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Audio 10:00:10 2024-01-30</Text>
                <TouchableOpacity style={styles.shareButton}>
                    <Text style={styles.shareText}>Share</Text>
                </TouchableOpacity>
            </View>

            {/* Transcription Section */}
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {transcription && transcription.length > 0 ? (
                    transcription.map((entry, index) => (
                        <View key={index} style={styles.transcriptionEntry}>
                            <Text style={styles.speaker}>
                                {entry.speaker} <Text style={styles.timestamp}>{entry.time}</Text>
                            </Text>
                            <Text style={styles.transcriptionText}>{entry.text}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noTranscription}>No transcription available.</Text>
                )}
            </ScrollView>

            {/* Bottom Section with Buttons */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.translateButton} onPress={() => console.log('Translate pressed')}>
                    <Text style={styles.buttonText}>Translate</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.botButton} onPress={() => console.log('Bot pressed')}>
                    <Text style={styles.buttonText}>Bot</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    shareButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
    },
    shareText: {
        fontSize: 14,
        color: '#007AFF',
    },
    scrollContainer: {
        paddingBottom: 16,
    },
    transcriptionEntry: {
        marginBottom: 16,
    },
    speaker: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333',
    },
    timestamp: {
        fontWeight: 'normal',
        fontSize: 14,
        color: '#666',
    },
    transcriptionText: {
        fontSize: 14,
        color: '#333',
        marginTop: 4,
    },
    noTranscription: {
        textAlign: 'center',
        fontSize: 16,
        color: '#999',
    },
    bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        paddingTop: 16,
    },
    translateButton: {
        flex: 1,
        paddingVertical: 12,
        backgroundColor: '#007AFF',
        borderRadius: 8,
        marginRight: 8,
        alignItems: 'center',
    },
    botButton: {
        flex: 1,
        paddingVertical: 12,
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        marginLeft: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default TranslateScreen;
