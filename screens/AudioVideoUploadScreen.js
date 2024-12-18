import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    TextInput,
    Image,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Placeholder icons
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
    const [files, setFiles] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

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

            const newFile = {
                id: Date.now(),
                name: res[0].name,
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

    const filteredFiles = files.filter((file) =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                onPress={() => navigation.navigate('TranslateScreen', { file: item })}
            >
                <Image source={Translate} style={styles.topHelpIcon2} />
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

            {/* Top Buttons */}
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
    actionText: {
        color: '#fff',
        fontSize: 16,
    },
    emptyText: {
        textAlign: 'center',
        color: '#aaa',
        fontSize: 16,
        marginTop: 20,
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
