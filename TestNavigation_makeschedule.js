// TestNavigation.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import home from './scripts/MakeSchedule/home';
import setdate from './scripts/MakeSchedule/setdate';
import setdate1 from './scripts/MakeSchedule/setdate1';
import courseyn from './scripts/MakeSchedule/courseyn';
import getcourse from './scripts/MakeSchedule/getcourse';

const Stack = createStackNavigator();

const TestNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="home" component={home} />
        <Stack.Screen name="setdate" component={setdate} />
        <Stack.Screen name="setdate1" component={setdate1} />
        <Stack.Screen name="courseyn" component={courseyn} />
        <Stack.Screen name="getcourse" component={getcourse} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default TestNavigation;
