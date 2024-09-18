// TestNavigation.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TourPlaceHome from './scripts/TourPlaceHome'; // 경로 수정 필요
import Detail from './scripts/Detail'; // 경로 수정 필요

const Stack = createStackNavigator();

const TestNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="TourPlaceHome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="TourPlaceHome" component={TourPlaceHome} />
        <Stack.Screen name="Detail" component={Detail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default TestNavigation;
