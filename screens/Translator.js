import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

const TranslatorScreen = () => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en'); // English
  const [targetLang, setTargetLang] = useState('es'); // Spanish

  const translateText = async () => {
    try {
      const response = await axios.post('https://libretranslate.de/translate', {
        q: inputText,
        source: sourceLang,
        target: targetLang,
        format: 'text',
      });
      setTranslatedText(response.data.translatedText);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Language Translator</Text>
      
      {/* Language Selector */}
      <View style={styles.languageSelector}>
        <Text style={styles.language}>{sourceLang === 'en' ? 'English' : 'Spanish'}</Text>
        <TouchableOpacity onPress={() => {
          const temp = sourceLang;
          setSourceLang(targetLang);
          setTargetLang(temp);
          setTranslatedText('');
          setInputText('');
        }}>
          <Icon name="exchange" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.language}>{targetLang === 'es' ? 'Spanish' : 'English'}</Text>
      </View>

      {/* Input Section */}
      <View style={styles.textBox}>
        <Text style={styles.textBoxHeader}>English</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Type here..."
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.translateButton} onPress={translateText}>
          <Text style={styles.buttonText}>Translate</Text>
        </TouchableOpacity>
      </View>

      {/* Output Section */}
      <View style={styles.textBox}>
        <Text style={styles.textBoxHeader}>Spanish</Text>
        <Text style={styles.translatedText}>{translatedText}</Text>
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
  languageSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  language: {
    fontSize: 16,
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
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
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
