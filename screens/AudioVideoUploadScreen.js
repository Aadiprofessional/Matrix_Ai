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
import RNFetchBlob from 'react-native-blob-util';
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
    
            if (!res || !res[0]) {
                alert('No file selected or unsupported file type.');
                return;
            }
    
            const fileType = res[0].type || '';
            const fileName = res[0].name || 'Unnamed File';
            const fileUri = res[0].uri;
    
            if (!fileType.includes('audio') && !fileType.includes('video')) {
                alert('Unsupported file type. Please select an audio or video file.');
                return;
            }
    
            // Save the file locally in app's directory
            const localFilePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
            await RNFS.copyFile(fileUri, localFilePath);
    
            const newFile = {
                id: Date.now(),
                name: fileName,
                uri: localFilePath, // Use the local file path
                type: fileType,
            };
    
            const updatedFiles = [...files, newFile];
            setFiles(updatedFiles);
            saveFiles(updatedFiles);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('User cancelled file picker.');
            } else {
                console.error('Unknown error:', err);
                alert('An error occurred while picking the file. Please try again.');
            }
        }
    };
    
    

    const handleTranscription = async (file) => {
        setLoading(true);
        const apiKey = 'CNrbioktfZ9k9r2iTUlLVrvbLg0Mqosr5gMT1PqNGisPhAskBsUIJQQJ99ALACfhMk5XJ3w3AAAAACOGITSp';
        const endpoint = 'https://swedencentral.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US';
    
        try {
            let filePath = file.uri;
    
            // Log file details for debugging
            console.log('Selected file details:', {
                name: file.name,
                type: file.type,
                uri: file.uri,
            });
    
            // Validate file path
            const exists = await RNFetchBlob.fs.exists(filePath);
            if (!exists) {
                throw new Error('File not found or invalid path.');
            }
    
            // Read file as binary
            const fileData = await RNFetchBlob.fs.readFile(filePath, 'base64');
            const binaryData = RNFetchBlob.base64.decode(fileData);
    
            // Log the file content type and binary data length for debugging
            console.log('Sending request with content type:', file.type);
            console.log('Binary data length:', binaryData.length);
    
            // Set content type based on file type
            let contentType = '';
            if (file.type.includes('mp3')) {
                contentType = 'audio/mpeg';
            } else if (file.type.includes('wav')) {
                contentType = 'audio/wav';
            } else {
                // Handle unsupported audio formats
                throw new Error('Unsupported audio format');
            }
    
            // Send transcription request
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Ocp-Apim-Subscription-Key': apiKey,
                    'Content-Type': 'application/octet-stream', // Use this for raw binary data
                    'Content-Length': binaryData.length.toString(),
                },
                body: binaryData,
            });
            
    
            // Log response status and text
            console.log('Response Status:', response.status);
            const responseText = await response.text();
            console.log('Response Text:', responseText);
    
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} - ${response.statusText}`);
            }
    
            const data = await response.json();
            const transcription = data.DisplayText || 'No transcription found.';
            navigation.navigate('TranslateScreen2', { transcription });
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

    const renderFileItem = ({ item }) => {
        if (!item) return null; // Guard clause
    
        return (
            <View style={styles.fileItem}>
                <Image
                    source={item.type && item.type.includes('audio') ? audioIcon : videoIcon}
                    style={styles.fileIcon}
                />
                <Text style={styles.fileName} numberOfLines={1}>
                    {item.name || 'Unknown File'}
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
    };
    

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
            <View style={styles.topButtonsContainer}>
                <TouchableOpacity style={styles.topButton}>
                    <Image source={uploadIcon} style={styles.topIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.topButton}>
                    <Image source={resizeIcon} style={styles.topIcon} />
                </TouchableOpacity>
                <View style={styles.topHelp}>
                    <Image source={helpIcon2} style={styles.topHelpIcon} />
                    <Text style={styles.helpText}>How to add voice memos to Transcribe</Text>
                </View>
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
    topButtonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 12,
    },
    topButton: {
        backgroundColor: '#ffa500',
        padding: 12,
        borderRadius: 10,
        marginRight: 10,
    },
    topIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    topHelp: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#007bff',
        borderRadius: 10,
        padding: 10,
    },
    topHelpIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        marginRight: 8,
    },
    topHelpIcon2: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    helpText: {
        color: '#ffffff',
        fontSize: 12,
        flexShrink: 1,
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
