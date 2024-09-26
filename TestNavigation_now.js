// TestNavigation.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import gangneungnow from './scripts/Now/gangneungnow'; // 경로 수정 필요
import nowdetail from './scripts/Now/nowdetail'; // 경로 수정 필요

const Stack = createStackNavigator();

const TestNavigation_now = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="gangneungnow" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="gangneungnow" component={gangneungnow} />
        <Stack.Screen name="nowdetail" component={nowdetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default TestNavigation_now;
