/**
 * @format
 */

/* 기존
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
*/



import {AppRegistry} from 'react-native';
import App from './App';
import SignupHome from './scripts/SignupHome';
import LoginPage from './scripts/LoginPage'; // 로그인 기능 구현
import SignupTerm from './scripts/SignupTerm';
import SignupNickname from './scripts/SignupNickname';
/* ---------------------------------------------------------------------------- */
import MainHome from './scripts/MainHome'; // 메인 홈

import testtest from './scripts/testtest'; // 강릉 지도 테스트 버전
import gangneungmap from './scripts/gangneungmap'; // 강릉 지도
import RestaurantHome from './scripts/RestaurantHome'; // 추천 맛집
import TourPlaceHome from './scripts/TourPlaceHome'; // 추천 여행지
import ARScreen from './scripts/ARScreen'; // 추천 여행지



import Detail from './scripts/Detail';

/* ---------------------------------------------------------------------------- */

import Community from './screens/Community';
import Weather from './screens/Weather'
import WritePost from './screens/WritePost'


import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => TourPlaceHome);
