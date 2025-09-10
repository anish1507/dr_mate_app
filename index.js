/**
 * @format
 */

import { AppRegistry,TextInput,Text } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import {configureReanimatedLogger,
    ReanimatedLogLevel
} from 'react-native-reanimated';

configureReanimatedLogger({
    level:ReanimatedLogLevel.warn,
    strict:false
})
Text.defaultProps={}
TextInput.defaultProps={}
AppRegistry.registerComponent(appName, () => App);
