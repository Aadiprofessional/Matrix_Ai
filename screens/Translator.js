import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

const TranslatorScreen = ({ route }) => {
  const { transcription } = route.params || {};
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('auto'); // Auto-detect source language
  const [targetLang, setTargetLang] = useState('zh'); // Chinese

  useEffect(() => {
    // Populate the input text box with the transcription
    if (transcription) {
      setInputText(transcription);
      detectLanguage(transcription); // Automatically detect the language
    }
  }, [transcription]);

  const detectLanguage = async (text) => {
    try {
      const response = await axios.post(
        'https://translation.googleapis.com/language/translate/v2/detect',
        {
          q: text,
        },
        {
          headers: {
            Authorization: `Bearer YOUR_GOOGLE_API_KEY`, // Replace with your Google Translate API key
          },
        }
      );
      const detectedLanguage = response.data.data.detections[0][0].language;
      setSourceLang(detectedLanguage);
    } catch (error) {
      console.error('Error detecting language:', error);
    }
  };

  const translateText = async () => {
    try {
      const response = await axios.post(
        'https://translation.googleapis.com/language/translate/v2',
        {
          q: inputText,
          source: sourceLang,
          target: targetLang,
          format: 'text',
        },
        {
          headers: {
            Authorization: `Bearer YOUR_GOOGLE_API_KEY`, // Replace with your Google Translate API key
          },
        }
      );
      setTranslatedText(response.data.data.translations[0].translatedText);
    } catch (error) {
      console.error('Error translating text:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Language Translator</Text>

      {/* Input Section */}
      <View style={styles.textBox}>
        <Text style={styles.textBoxHeader}>
          Detected Language: {sourceLang === 'auto' ? 'Detecting...' : sourceLang.toUpperCase()}
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder="Type here..."
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity style={styles.translateButton} onPress={translateText}>
          <Text style={styles.buttonText}>Translate</Text>
        </TouchableOpacity>
      </View>

      {/* Output Section */}
      <View style={styles.textBox}>
        <Text style={styles.textBoxHeader}>Translated Text (Chinese)</Text>
        <Text style={styles.translatedText}>{translatedText || 'Translation will appear here.'}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  textBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  textBoxHeader: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textInput: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    textAlignVertical: 'top',
  },
  translateButton: {
    backgroundColor: '#FF6600',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  translatedText: {
    fontSize: 16,
    marginTop: 10,
  },
});

export default TranslatorScreen;
