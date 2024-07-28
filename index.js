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
//import bus from './scripts/bus';
//import PathAndMap from './scripts/PathAndMap';
import Parking from './scripts/Parking';

import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => PathAndMap);
