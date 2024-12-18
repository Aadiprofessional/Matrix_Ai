import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

const TranslateScreen = ({ route, navigation }) => {
  const { file } = route.params;
  const [transcription, setTranscription] = useState('');
  const [loading, setLoading] = useState(false);

  
  const handleTranscription = async () => {
    setLoading(true);
    const apiKey = 'CNrbioktfZ9k9r2iTUlLVrvbLg0Mqosr5gMT1PqNGisPhAskBsUIJQQJ99ALACfhMk5XJ3w3AAAAACOGITSp';
    const endpoint = 'https://swedencentral.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US';
  
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri.startsWith('file://') ? file.uri : `file://${file.uri}`, // Ensure proper URI format
        type: file.type || 'audio/wav', // Specify accurate MIME type
        name: file.name || 'audio.wav', // File name with extension
      });
  
      // Use fetch for better compatibility in React Native
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Ocp-Apim-Subscription-Key': apiKey,
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log('Transcription Response:', data);
      setTranscription(data.DisplayText || 'No transcription found.');
    } catch (error) {
      console.error('Error transcribing audio:', error);
      if (error.response) {
        setTranscription(`API Error: ${error.response.status} - ${error.response.statusText}`);
      } else {
        setTranscription('Failed to transcribe the audio. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  
      

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Audio Transcription</Text>
      <Text style={styles.fileName}>File: {file.name}</Text>
      <TouchableOpacity style={styles.button} onPress={handleTranscription}>
        <Text style={styles.buttonText}>Start Transcription</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator size="large" color="#007bff" />}
      {transcription ? (
        <Text style={styles.transcription}>{transcription}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  fileName: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  transcription: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
});

export default TranslateScreen;
