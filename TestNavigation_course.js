// TestNavigation.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Coursehome from './scripts/Course/Coursehome'; // 경로 수정 필요
import coursedetail from './scripts/Course/coursedetail'; // 경로 수정 필요

const Stack = createStackNavigator();

const TestNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Coursehome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Coursehome" component={Coursehome} />
        <Stack.Screen name="coursedetail" component={coursedetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default TestNavigation;
