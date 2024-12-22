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
import FloatingButton2 from '../components/FloatingButton copy';

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
        // Navigate to BotScreen2 and pass the transcription as a parameter
        navigation.navigate('BotScreen2', { transcription });
    };
    const handleFloatingButton2Press = () => {
        console.log('Floating Button 2 Pressed:', transcription);
        // Navigate to TranslateScreen3 and pass the transcription as a parameter
        navigation.navigate('TranslateScreen3', { transcription });
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
            <TouchableOpacity onPress={handleFloatingButtonPress} style={styles.floatingButton}>
                   <Image
                     source={require('../assets/robot.png')} // Replace with your image path
                     style={styles.buttonImage}
                   />
                 </TouchableOpacity>
                 <TouchableOpacity onPress={handleFloatingButton2Press} style={styles.floatingButton2}>
                <Image
                    source={require('../assets/Translate.png')} // Replace with your translate icon
                    style={styles.buttonImage2}
                />
            </TouchableOpacity>
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
    floatingButton: {
        position: 'absolute',
        bottom: 90,
        right: 90,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#007BFF',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
        shadowColor: '#007BFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 10,
    },
    floatingButton2: {
        position: 'absolute',
        bottom: 90,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FF6600',  // Orange color for the second button
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 101,
        shadowColor: 'orange',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 10,
    },
    buttonImage: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
    },
    buttonImage2: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
      popup: {
        position: 'absolute',
        bottom: 160, // Position above the floating button
        right: 20,
        zIndex: 999,
      },
      speechBubble: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 10,
        maxWidth: 200,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        borderColor: '#ccc',
        borderWidth: 1,
      },
      triangle: {
        position: 'absolute',
        bottom: -10,
        right: 20,
        width: 0,
        height: 0,
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderTopWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#85858549',
      },
      typingText: {
        fontSize: 14,
        color: '#333',
        fontWeight: 'bold',
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
