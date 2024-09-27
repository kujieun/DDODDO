// TestNavigation.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RestaurantHome from './scripts/RestaurantHome'; // 경로 수정 필요
import RestaurantDetail from './scripts/RestaurantDetail'; // 경로 수정 필요

const Stack = createStackNavigator();

const TestNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="RestaurantHome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="RestaurantHome" component={RestaurantHome} />
        <Stack.Screen name="RestaurantDetail" component={RestaurantDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default TestNavigation;
