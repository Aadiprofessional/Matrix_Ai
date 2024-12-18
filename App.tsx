import React, { useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import OnboardingScreen from './screens/OnboardingScreen';
import AppNavigator from './screens/AppNavigator';  // Bottom Tab Navigator
import BotScreen from './screens/BotScreen';  // Example screen in the stack
import LoginScreen from './screens/LoginScreens';
import PhoneLoginScreen from './screens/PhoneLoginScreen';
import SignUpDetailsScreen from './screens/SignUpDetailsScreen';
import OTPCodeScreen from './screens/OTPCodeScreen';
const Stack = createStackNavigator();

const App = () => {
    const [onboardingCompleted, setOnboardingCompleted] = useState(false);

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {!onboardingCompleted && (
                    <Stack.Screen name="Onboarding" options={{ headerShown: false }}>
                        {(props) => (
                            <OnboardingScreen
                                {...props}
                                onFinish={() => setOnboardingCompleted(true)}
                            />
                        )}
                    </Stack.Screen>
                )}
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="OTPScreen" component={PhoneLoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Main" component={AppNavigator} options={{ headerShown: false }} />
                <Stack.Screen name="BotScreen" component={BotScreen} options={{ headerShown: false }} />
                <Stack.Screen name="SignUpDetails" component={SignUpDetailsScreen} options={{ headerShown: false }} />
                <Stack.Screen name="OTPCode" component={OTPCodeScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};


export default App;
