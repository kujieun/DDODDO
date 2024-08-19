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
//import PathAndMap from './scripts/PathAndMap';
import testtest from './scripts/testtest';
//import FindRoute from './scripts/FindRoute';
import test2 from './scripts/test2';
import SignupTerm from './scripts/SignupTerm';

import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => SignupTerm);
