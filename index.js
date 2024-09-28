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

/*----------------------일정 정하기-------------------------------*/
import home from './scripts/MakeSchedule/home'; // 일정정하기 홈
import setdate from './scripts/MakeSchedule/setdate'; // 일정정하기 - 날짜
import setdate1 from './scripts/MakeSchedule/setdate1'; // 일정정하기 - 날짜1
import courseyn from './scripts/MakeSchedule/courseyn'; // 일정정하기 - 날짜1
import getcourse from './scripts/MakeSchedule/getcourse'; // 일정정하기 - 날짜1
import scheduledetail from './scripts/MakeSchedule/scheduledetail'; // 일정정하기 - 날짜1

/*---------------------추천코스-------------------------------*/
import Coursehome from './scripts/Course/Coursehome';


/*------------AR ------------------------------------------------*/
import ARScreen from './scripts/ARScreen';
import Location from './scripts/Location';

/*================완전 테스트테스트 ==========*/
import TestNavigation from './TestNavigation'; // 추천 여행지 --> Detail
import TestNavigation_course from './TestNavigation_course'; // 추천 코스 --> Detail
import TestNavigation_now from './TestNavigation_now'; // 추천 나우 --> Detail
import TestNavigation_makeschedule from './TestNavigation_makeschedule'; // 일정 정하기
import TestNavigation_restaurant from './TestNavigation_restaurant'; // 추천 맛집 --> Detail


import Detail from './scripts/Detail';
import coursedetail from './scripts/Course/coursedetail';

//import ViroCustomText from './scripts/ViroCustomText';


/*------------게임 -------------------------*/
import Tutorial from './scripts/Game/Tutorial'; // 게임 튜토리얼

import CameraMenu from './screens/CameraMenu';
import CameraFilter from './screens/CameraFilter'

/* ---------------------------------------------------------------------------- */

import Community from './screens/Community';
import Weather from './screens/Weather'
import WritePost from './screens/WritePost'
import Tip from './screens/Tip'


import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => TestNavigation_makeschedule);
