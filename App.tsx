/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignupHome from './scripts/SignupHome';
import SignupTerm from './scripts/SignupTerm';
import SignupNickname from './scripts/SignupNickname';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignupHome">
        <Stack.Screen name="SignupHome" component={SignupHome} />
        <Stack.Screen name="SignupTerm" component={SignupTerm} />
        <Stack.Screen name="SignupNickname" component={SignupNickname} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

