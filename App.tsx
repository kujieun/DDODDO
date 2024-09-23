import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignupHome from './scripts/SignupHome';
import SignupTerm from './scripts/SignupTerm';
import SignupNickname from './scripts/SignupNickname';
import MainHome from './scripts/MainHome';
import gangneungmap from './scripts/gangneungmap';
import RestaurantHome from './scripts/RestaurantHome';
import Community from './screens/Community';

import CommunityDetail from './screens/CommunityDetail';
import WritePost from './screens/WritePost';
import CameraFilter from './screens/CameraFilter'

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
        <Stack.Screen name="MainHome" component={MainHome} />
        <Stack.Screen name="gangneungmap" component={gangneungmap} />
        <Stack.Screen name="RestaurantHome" component={RestaurantHome} />
        <Stack.Screen name="Community" component={Community} />

        <Stack.Screen name="CommunityDetail" component={CommunityDetail} />
        <Stack.Screen name="WritePost" component={WritePost} />
        <Stack.Screen name="CameraFilter" component={CameraFilter} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
