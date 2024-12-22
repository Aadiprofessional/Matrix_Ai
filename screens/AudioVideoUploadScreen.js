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
import axios from 'axios';
import { Buffer } from 'buffer';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler'; 


const audioIcon = require('../assets/mic3.png');
const videoIcon = require('../assets/cliper.png');
const backIcon = require('../assets/back.png');
const uploadIcon = require('../assets/Import.png');
const resizeIcon = require('../assets/cliper.png');
const helpIcon = require('../assets/threeDot.png');
const helpIcon2 = require('../assets/mic2.png');
const Translate = require('../assets/convert.png');
const micIcon = require('../assets/mic3.png');
const clockIcon = require('../assets/clock.png');
const calendarIcon = require('../assets/calender.png');
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
            const fileName = res[0].name || 'Unnamed_File';
            const fileUri = res[0].uri;
    
            if (!fileType.includes('audio') && !fileType.includes('video')) {
                alert('Unsupported file type. Please select an audio or video file.');
                return;
            }
    
            // Generate a unique file name to avoid overwriting
            const uniqueFileName = `${Date.now()}_${fileName}`;
            const localFilePath = `${RNFS.DocumentDirectoryPath}/${uniqueFileName}`;
    
            // Save the file locally in app's directory
            await RNFS.copyFile(fileUri, localFilePath);
    
            const newFile = {
                id: Date.now(),
                name: uniqueFileName,
                uri: localFilePath,
                type: fileType,
                duration: '00:03:45', // Placeholder for duration
                uploadedAt: new Date().toLocaleString(), // Date and time
            };
    
            const updatedFiles = [...files, newFile];
            setFiles(updatedFiles);
            saveFiles(updatedFiles);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('User cancelled file picker.');
            } else {
                console.error('Error picking file:', err.message);
                alert('An error occurred while picking the file. Please try again.');
            }
        }
    };
    

    const handleTranscription = async (file) => {
        setLoading(true);
        const apiKey = 'CNrbioktfZ9k9r2iTUlLVrvbLg0Mqosr5gMT1PqNGisPhAskBsUIJQQJ99ALACfhMk5XJ3w3AAAAACOGITSp';
        const endpoint = 'https://swedencentral.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US';
    
        try {
            const filePath = file.uri;
            const exists = await RNFS.exists(filePath);
            if (!exists) throw new Error('File not found or invalid path.');
    
            let contentType = '';
            if (file.name.endsWith('.wav')) {
                contentType = 'audio/wav';
            } else if (file.name.endsWith('.mp3')) {
                contentType = 'audio/mpeg';
            } else {
                throw new Error('Unsupported audio format');
            }
    
            const binaryData = await RNFS.readFile(filePath, 'base64');
            const byteArray = new Uint8Array(Buffer.from(binaryData, 'base64'));
    
            const response = await axios.post(endpoint, byteArray, {
                headers: {
                    'Ocp-Apim-Subscription-Key': apiKey,
                    'Content-Type': contentType,
                    'Content-Length': byteArray.length,
                },
                timeout: 30000,
                responseType: 'json',
            });
    
            const responseData = response.data;
            if (responseData.RecognitionStatus === 'Success') {
                const transcription = responseData.DisplayText || 'No transcription available.';
                navigation.navigate('TranslateScreen2', { transcription, fileName: file.name });
            } else {
                const reason = responseData.Reason || 'No reason provided';
                alert(`Transcription failed: ${reason}`);
            }
        } catch (error) {
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
        const renderRightActions = () => (
            <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveFile(item.id)}>
                <Text style={styles.removeButtonText}>X</Text>
            </TouchableOpacity>
        );
    
        return (
            <Swipeable renderRightActions={renderRightActions}>
                <View style={styles.fileItem}>
                    <Image
                        source={item.type && item.type.includes('audio') ? audioIcon : videoIcon}
                        style={styles.fileIcon}
                    />
                    <View style={styles.detailsRow}>
                        <Text style={styles.fileName} numberOfLines={1}>
                            {item.name || 'Unknown File'}
                        </Text>
                        <View style={styles.fileItem2}>
                            <Image source={clockIcon} style={styles.detailIcon2} />
                            <Text style={styles.detailText}>{item.duration}</Text>
                            <Image source={calendarIcon} style={styles.detailIcon2} />
                            <Text style={styles.detailText}>{item.uploadedAt}</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleTranscription(item)}
                    >
                        <Image source={Translate} style={styles.detailIcon} />
                    </TouchableOpacity>
                </View>
            </Swipeable>
        );
    };
    


    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
               <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.goBack()}> {/* Add navigation */}
                                   <Image
                                       source={require('../assets/back.png')} // Replace with your actual back icon PNG
                                       style={styles.headerIcon}
                                   />
                               </TouchableOpacity>
                <Text style={styles.headerTitle}>Matrix AI</Text>
                <TouchableOpacity>
                    <Image source={helpIcon} style={styles.headerIcon} />
                </TouchableOpacity>
            </View>
            <View style={styles.topButtonsContainer}>
                <TouchableOpacity style={styles.topButton} onPress={handleAddFile}>
                    <Image source={uploadIcon} style={styles.topIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.topButton2}>
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
   
        marginTop: 50, // Ensures the container respects the safe area
    },
    actionButton: {
        position: 'absolute',
        right: 10, // Aligns the button to the right edge of the card
        backgroundColor: '#ffa500',
        borderRadius: 20, // Makes it rounded
        padding: 8,
        elevation: 2,
    },
    removeButton: {
        backgroundColor: '#ff4d4d',
        width: 40,
        height: 40,
        borderRadius: 20, // Circular button
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 1,
    },
    removeButtonText: {
        color: '#fff',
        fontSize: 12,
        textAlign: 'center',
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
        backgroundColor: '#FF6600',
        padding: 12,
        borderRadius: 10,
        marginRight: 10,
    },
    topButton2: {
        backgroundColor: '#FAA300',
        padding: 12,
        borderRadius: 10,
        marginRight: 10,
    },
    topIcon: {
        width: 34,
        height: 34,
        resizeMode: 'contain',
    },
    topHelp: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#007bff',
        borderRadius: 10,
        padding: 12,
    },
    topHelpIcon: {
        width: 34,
        height: 34,
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
    detailText: {
        color: '#B7B7B7FF',
        fontSize: 8,
        flexShrink: 1,
        marginRight: 5,
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
    detailIcon2: {
        width: 14,
        height: 14,
        resizeMode: 'contain',
    },
    detailIcon: {
        width: 34,
        height: 34,
        padding:5,
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
    fileItem2: {
        flexDirection: 'row',
        alignItems: 'center',





    },
    fileIcon: {
        width: 36,
        height: 36,
        marginRight: 12,
        resizeMode: 'contain',
    },
    fileName: {
        flex: 1,
        fontSize: 15,
        color: '#333',
        fontWeight: 'bold',
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