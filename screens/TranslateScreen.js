import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Share,
    ScrollView,
    Image,
    TextInput,
} from 'react-native';
import FloatingButton from '../components/FloatingButton'; // Replace with the correct file path
import { useNavigation } from '@react-navigation/native';

const TranslateScreen = ({ route }) => {
    const { transcription: initialTranscription, fileName } = route.params || {};
    const [isEditing, setIsEditing] = useState(false);
    const [transcription, setTranscription] = useState(initialTranscription);
    const navigation = useNavigation(); 
    // Function to handle the share action
    const handleShare = async () => {
        try {
            await Share.share({
                message: transcription || 'No transcription available.',
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const toggleEdit = () => setIsEditing(!isEditing);

    const handleFloatingButtonPress = () => {
        console.log('Floating Button Pressed:', transcription);
        // Add logic to navigate or perform actions with `transcription`
    };

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}> {/* Add navigation */}
                    <Image
                        source={require('../assets/back.png')} // Replace with your actual back icon PNG
                        style={styles.icon}
                    />
                </TouchableOpacity>
                <Text style={styles.header}>{fileName}</Text>
                <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
                    <Image
                        source={require('../assets/share.png')} // Replace with your actual share icon PNG
                        style={styles.icon}
                    />
                </TouchableOpacity>
            </View>

            {/* Transcription Content */}
            <ScrollView style={styles.contentContainer}>
                <View style={styles.transcriptionRow}>
                    {isEditing ? (
                        <TextInput
                            style={styles.textInput}
                            value={transcription}
                            onChangeText={setTranscription}
                            multiline
                        />
                    ) : (
                        <Text style={styles.content}>
                            {transcription || 'No transcription available.'}
                        </Text>
                    )}
                    <TouchableOpacity onPress={toggleEdit} style={styles.pencilIconContainer}>
                        <Image
                            source={require('../assets/pencil.png')} // Replace with your actual pencil icon PNG
                            style={styles.pencilIcon}
                        />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Floating Buttons */}
            <View style={styles.floatingButtonContainer}>
                <FloatingButton
                    onPress={handleFloatingButtonPress}
                   
                />
                <FloatingButton
                    onPress={handleFloatingButtonPress}
                   
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 50,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    header: {
        fontSize: 13,
        fontWeight: '600',
    },
    iconButton: {
        padding: 8,
    },
    icon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    contentContainer: {
        flex: 1,
        padding: 16,
    },
    transcriptionRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    content: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
        flex: 1,
    },
    textInput: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#007bff',
    },
    pencilIconContainer: {
        marginLeft: 8,
    },
    pencilIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    floatingButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
});

export default TranslateScreen;
