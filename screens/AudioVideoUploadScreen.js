import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    TextInput,
    Image,
    ActivityIndicator,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import RNFS from 'react-native-fs';  // Import react-native-fs to read files

const audioIcon = require('../assets/mic3.png');
const videoIcon = require('../assets/cliper.png');
const backIcon = require('../assets/back.png');
const uploadIcon = require('../assets/Import.png');
const resizeIcon = require('../assets/cliper.png');
const helpIcon = require('../assets/threeDot.png');
const helpIcon2 = require('../assets/mic2.png');
const Translate = require('../assets/Translate.png');
const micIcon = require('../assets/mic3.png');

const AudioVideoUploadScreen = () => {
    const navigation = useNavigation();
    const [files, setFiles] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadFiles();
    }, []);

    const loadFiles = async () => {
        try {
            const savedFiles = await AsyncStorage.getItem('uploadedFiles');
            if (savedFiles) {
                setFiles(JSON.parse(savedFiles));
            }
        } catch (error) {
            console.error('Error loading files:', error);
        }
    };

    const saveFiles = async (newFiles) => {
        try {
            await AsyncStorage.setItem('uploadedFiles', JSON.stringify(newFiles));
        } catch (error) {
            console.error('Error saving files:', error);
        }
    };

    const handleAddFile = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.audio, DocumentPicker.types.video],
            });

            if (!res[0].type.includes('audio') && !res[0].type.includes('video')) {
                alert('Unsupported file type. Please select an audio or video file.');
                return;
            }

            const newFile = {
                id: Date.now(),
                name: res[0].name,
                uri: res[0].uri,
                type: res[0].type,
            };

            const updatedFiles = [...files, newFile];
            setFiles(updatedFiles);
            saveFiles(updatedFiles);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('User cancelled file picker.');
            } else {
                console.error('Unknown error:', err);
            }
        }
    };

    const handleTranscription = async (file) => {
        setLoading(true);
        const apiKey = 'CNrbioktfZ9k9r2iTUlLVrvbLg0Mqosr5gMT1PqNGisPhAskBsUIJQQJ99ALACfhMk5XJ3w3AAAAACOGITSp';
        const endpoint = 'https://swedencentral.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US';

        try {
            // Read the audio file as binary data
            const filePath = file.uri.startsWith('file://') ? file.uri : `file://${file.uri}`;
            const fileData = await RNFS.readFile(filePath, 'base64'); // Read file as base64

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Ocp-Apim-Subscription-Key': apiKey,
                    'Content-Type': 'audio/wav',  // Set the correct content type for audio
                    'Content-Length': fileData.length,
                },
                body: fileData, // Send the binary data
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Transcription Response:', data);
            const transcription = data.DisplayText || 'No transcription found.';
            if (transcription) {
                navigation.navigate('TranslateScreen2', { transcription });
            } else {
                throw new Error('No transcription available');
            }
        } catch (error) {
            console.error('Error transcribing audio:', error);
            alert(`Failed to transcribe the audio: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const filteredFiles = files.filter((file) =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleRemoveFile = async (id) => {
        const updatedFiles = files.filter((file) => file.id !== id);
        setFiles(updatedFiles);
        saveFiles(updatedFiles);
    };

    const renderFileItem = ({ item }) => (
        <View style={styles.fileItem}>
            <Image
                source={item.type.includes('audio') ? audioIcon : videoIcon}
                style={styles.fileIcon}
            />
            <Text style={styles.fileName} numberOfLines={1}>
                {item.name}
            </Text>
            <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleTranscription(item)}
            >
                <Image source={Translate} style={styles.topHelpIcon2} />
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveFile(item.id)}
            >
                <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <TouchableOpacity>
                    <Image source={backIcon} style={styles.headerIcon} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Matrix AI</Text>
                <TouchableOpacity>
                    <Image source={helpIcon} style={styles.headerIcon} />
                </TouchableOpacity>
            </View>

            {/* Loading Indicator */}
            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007bff" />
                    <Text style={styles.loadingText}>Transcribing audio...</Text>
                </View>
            )}

            {/* Search Bar */}
            <TextInput
                placeholder="Search"
                style={styles.searchBar}
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            {/* File List */}
            <FlatList
                data={filteredFiles}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderFileItem}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No files uploaded yet.</Text>
                }
            />

            {/* Add File Floating Button */}
            <TouchableOpacity style={styles.floatingButton} onPress={handleAddFile}>
                <Image source={micIcon} style={styles.floatingButtonIcon} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 10,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#007bff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007bff',
    },
    headerIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    searchBar: {
        backgroundColor: '#f1f3f6',
        borderRadius: 8,
        marginHorizontal: 16,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginBottom: 12,
    },
    fileItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        padding: 14,
        borderRadius: 8,
        marginHorizontal: 16,
        marginBottom: 8,
        elevation: 2,
    },
    fileIcon: {
        width: 36,
        height: 36,
        marginRight: 12,
        resizeMode: 'contain',
    },
    fileName: {
        flex: 1,
        fontSize: 14,
        color: '#333',
    },
    actionButton: {
        backgroundColor: '#ffa500',
        borderRadius: 12,
        padding: 8,
    },
    removeButton: {
        marginLeft: 8,
        backgroundColor: '#ff4d4d',
        padding: 6,
        borderRadius: 8,
    },
    removeButtonText: {
        color: '#fff',
        fontSize: 12,
    },
    floatingButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: '#007bff',
        borderRadius: 30,
        padding: 16,
        elevation: 5,
    },
    floatingButtonIcon: {
        width: 24,
        height: 24,
        tintColor: '#fff',
    },
});

export default AudioVideoUploadScreen;
