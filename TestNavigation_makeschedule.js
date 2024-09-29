// TestNavigation.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import home from './scripts/MakeSchedule/home';
import setdate from './scripts/MakeSchedule/setdate';
import setdate1 from './scripts/MakeSchedule/setdate1';

import courseyn from './scripts/MakeSchedule/courseyn';
import getcourse from './scripts/MakeSchedule/getcourse';
import coursedetail from './scripts/Course/coursedetail';
import addcourseone from './scripts/MakeSchedule/addcourseone';
import scheduledetail from './scripts/MakeSchedule/scheduledetail';
import end from './scripts/MakeSchedule/end';
import pickplace from './scripts/MakeSchedule/pickplace';

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
        <Stack.Screen name="coursedetail" component={coursedetail} />
        <Stack.Screen name="addcourseone" component={addcourseone} />
        <Stack.Screen name="scheduledetail" component={scheduledetail} />

        <Stack.Screen name="pickplace" component={pickplace} />
        <Stack.Screen name="end" component={end} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default TestNavigation;
