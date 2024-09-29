import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// 회원가입 관련 컴포넌트
import SignupHome from './scripts/SignupHome';
import SignupTerm from './scripts/SignupTerm';
import SignupNickname from './scripts/SignupNickname';

// 메인홈 관련 컴포넌트
import MainHome from './scripts/MainHome';
import gangneungmap from './scripts/gangneungmap';
import RestaurantHome from './scripts/RestaurantHome';

// 커뮤니티 관련 컴포넌트
import Community from './screens/Community';
import CommunityDetail from './screens/CommunityDetail';

// 강릉 NOW 관련 컴포넌트
import gangneungnow from './scripts/Now/gangneungnow';
import nowdetail from './scripts/Now/nowdetail';

// 글쓰기 관련 컴포넌트
import MyPage from './screens/MyPage';
import WritePost from './screens/WritePost';

// 나도 주인공 관련 컴포넌트
import CameraFilter from './screens/CameraFilter';
import CameraMenu from './screens/CameraMenu';

// 코스 가이드 관련 컴포넌트
import Coursehome from './scripts/Coursehome';
import coursedetail from './scripts/coursedetail';

// 추천 여행지 관련 컴포넌트
import TourPlaceHome from './scripts/TourPlaceHome';
import Detail from './scripts/Detail';

// 강릉 꿀팁 관련 컴포넌트
import Tip from './screens/Tip';
import TipDetail from './screens/TipDetail';

// AR, 게임 관련 컴포넌트
import ARScreen from './scripts/ARScreen';
import Tutorial from './scripts/Game/Tutorial';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignupHome"
        screenOptions={{ headerShown: false }} // 모든 화면에서 헤더 숨김
      >

        {/* 회원가입 */}
        <Stack.Screen name="SignupHome" component={SignupHome} />
        <Stack.Screen name="SignupTerm" component={SignupTerm} />
        <Stack.Screen name="SignupNickname" component={SignupNickname} />

        {/* 메인홈 */}
        <Stack.Screen name="MainHome" component={MainHome} />
        <Stack.Screen name="gangneungmap" component={gangneungmap} />

        {/* 강릉 지도 */}
        <Stack.Screen name="RestaurantHome" component={RestaurantHome} />

        {/* 커뮤니티 */}
        <Stack.Screen name="Community" component={Community} />
        <Stack.Screen name="CommunityDetail" component={CommunityDetail} />

        {/* 강릉 NOW */}
        <Stack.Screen name="gangneungnow" component={gangneungnow} />
        <Stack.Screen name="nowdetail" component={nowdetail} />

        {/* 글쓰기 */}
        <Stack.Screen name="MyPage" component={MyPage} />
        <Stack.Screen name="WritePost" component={WritePost} />

        {/* 나도 주인공 */}
        <Stack.Screen name="CameraFilter" component={CameraFilter} />
        <Stack.Screen name="CameraMenu" component={CameraMenu} />

        {/* 코스 가이드 */}
        <Stack.Screen name="Coursehome" component={Coursehome} />
        <Stack.Screen name="coursedetail" component={coursedetail} />

        {/* 추천 여행지 */}
        <Stack.Screen name="TourPlaceHome" component={TourPlaceHome} />
        <Stack.Screen name="Detail" component={Detail} />

        {/* 강릉 꿀팁 */}
        <Stack.Screen name="Tip" component={Tip} />
        <Stack.Screen name="TipDetail" component={TipDetail} />

        {/* AR, 게임 */}
        <Stack.Screen name="ARScreen" component={ARScreen} />
        <Stack.Screen name="Tutorial" component={Tutorial} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
