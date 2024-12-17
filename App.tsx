import React, { useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import OnboardingScreen from './screens/OnboardingScreen';
import AppNavigator from './screens/AppNavigator';  // Bottom Tab Navigator
import BotScreen from './screens/BotScreen';  // Example screen in the stack

const Stack = createStackNavigator();

const App = () => {
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Render the OnboardingScreen only if onboarding is not completed */}
        {!onboardingCompleted ? (
          <Stack.Screen name="Onboarding" options={{ headerShown: false }}>
            {(props) => <OnboardingScreen {...props} onFinish={() => setOnboardingCompleted(true)} />}
          </Stack.Screen>
        ) : (
          <>
            {/* Main App Screen with Bottom Tab Navigation */}
            <Stack.Screen name="Main" component={AppNavigator} options={{ headerShown: false }}/>
            {/* BotScreen is another screen in the stack */}
            <Stack.Screen name="botScreen" component={BotScreen} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
