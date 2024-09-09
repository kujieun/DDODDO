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

//지수
import WritePost from './screens/WritePost';
import Community from './screens/Community';
import CommunityDetail from './screens/CommunityDetail';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignupHome"
      screenOptions={{ headerShown: false }} // 모든 화면에서 헤더 숨김
            >
        <Stack.Screen name="SignupHome" component={SignupHome} />
        <Stack.Screen name="SignupTerm" component={SignupTerm} />
        <Stack.Screen name="SignupNickname" component={SignupNickname} />
        <Stack.Screen name="WritePost" component={WritePost} />
        <Stack.Screen name="Community" component={Community} />
        <Stack.Screen name="CommunityDetail" component={CommunityDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;