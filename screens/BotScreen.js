import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';


const BotScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: "Hello.👋 I'm your new friend, MatrixAI Bot. You can ask me any questions.",
      sender: 'bot',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [showInput, setShowInput] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);  // Track if user is typing

  // Function to get response from Hugging Face (using GPT-2 as an example)
  // Replace this with your Gemini API key
  const GEMINI_API_KEY = 'AIzaSyCLVsdkzk1Dk7Tka-Be6EbA0Q60Bdhcd44';

  const fetchGeminiResponse = async (userMessage, retryCount = 0) => {
    const maxRetries = 5;
    const retryDelay = Math.min(Math.pow(2, retryCount) * 1000, 60000); // Max delay is 1 minute
  
    setIsLoading(true);
    try {
      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', // Correct Gemini API endpoint
        {
          contents: [{ parts: [{ text: userMessage }] }], // Correct payload format
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          params: {
            key: GEMINI_API_KEY, // API key passed as a query parameter
          },
        }
      );
  
      // Extract the response content
      const botMessage = response.data.candidates[0].content.parts[0].text.trim();
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), text: botMessage, sender: 'bot' },
      ]);
    } catch (error) {
      if (error.response && error.response.status === 429 && retryCount < maxRetries) {
        console.log(`Rate limit hit. Retrying in ${retryDelay / 1000} seconds...`);
        setTimeout(() => fetchGeminiResponse(userMessage, retryCount + 1), retryDelay);
      } else {
        console.error(error);
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), text: 'Error fetching response. Try again later.', sender: 'bot' },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Replace the Hugging Face API call with Gemini API
  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: inputText,
        sender: 'user',
      };
      setMessages((prev) => [...prev, newMessage]);
      fetchGeminiResponse(inputText); // Fetch Gemini API response
      setInputText('');
      setIsTyping(false); // Hide Send button and show Mic button again
    }
  };

  const handleAddImage =()=>{};

  const handleMicPress = () => {
    setShowInput(false);
  };

  // Handle input change to toggle mic/send buttons
  const handleInputChange = (text) => {
    setInputText(text);
    setIsTyping(text.length > 0); // Set typing state based on text length
  };


  // Render message
  const renderMessage = ({ item }) => {
    const isBot = item.sender === 'bot';
    return (
      <Animatable.View
        animation="fadeInUp"
        duration={800}
        style={[
          styles.messageContainer,
          isBot ? styles.botMessageContainer : styles.userMessageContainer,
        ]}
      >
        {item.text ? (
          <Text style={isBot ? styles.botText : styles.userText}>{item.text}</Text>
        ) : (
          <Image source={{ uri: item.image }} style={styles.messageImage} />
        )}
      </Animatable.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/back.png')} style={styles.headerIcon} />
        </TouchableOpacity>
        <Image source={require('../assets/Avatar/Cat.png')} style={styles.botIcon} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.botName}>MatrixAI Bot</Text>
          <Text style={styles.botDescription}>Your virtual assistant</Text>
        </View>
        <TouchableOpacity>
          <Image source={require('../assets/threeDot.png')} style={styles.headerIcon2} />
        </TouchableOpacity>
      </View>

      {/* Chat List */}
      <Animatable.View animation="fadeIn" duration={1000} style={{ flex: 1 }}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.chat}
        />
      </Animatable.View>

      {/* Input Box */}
      {showInput && (
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.textInput, { textAlignVertical: 'top' }]}
            placeholder="Send a message..."
            value={inputText}
            onChangeText={handleInputChange}
            onSubmitEditing={handleSendMessage}  // Send on Enter press
            multiline
            numberOfLines={3}
            maxLength={250}
          />
          {isTyping ? (
            <TouchableOpacity onPress={handleSendMessage}>
              <Image source={require('../assets/send.png')} style={styles.icon} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleMicPress}>
              <Image source={require('../assets/mic.png')} style={styles.icon} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleAddImage}>
            <Image source={require('../assets/plus.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>
      )}

      {/* Loading Indicator */}
      {isLoading && <Text style={styles.loading}>Generating response...</Text>}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  headerIcon: {
    width: 30,
    height: 30,
    marginHorizontal: 5,
    resizeMode: 'contain',
  },
  headerIcon2: {
    width: 15, // Smaller width for the image
    height: 15, // Smaller height for the image
    marginHorizontal: 5, // Maintain spacing
    resizeMode: 'contain', // Ensures the image is scaled proportionally
  },
  botIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerTextContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  botName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  botDescription: {
    fontSize: 12,
    color: '#666',
  },
  chat: {
    paddingVertical: 10,
  },
  messageContainer: {
    maxWidth: '70%',
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
  },
  botMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0E0E0',
    marginLeft: 10,
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#4C8EF7',
    marginRight: 10,
  },
  botText: {
    color: '#333',
    fontSize: 16,
  },
  userText: {
    color: '#FFF',
    fontSize: 16,
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#3333333B',

  },
  textInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    marginHorizontal: 10,
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: '#4C8EF7',
    marginLeft: 7,
  },
  micContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  waveform: {
    width: 200,
    height: 50,
    backgroundColor: '#4C8EF7',
    borderRadius: 10,
    marginHorizontal: 10,
  },
  controlButton: {
    padding: 10,
    backgroundColor: '#4C8EF7',
    borderRadius: 5,
  },
  controlText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default BotScreen;