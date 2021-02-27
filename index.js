/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// import { Provider } from 'react-redux';
// import { createStore } from 'redux';
// import reduce from '../redux/reducer/reducerUser.js';

// const store = createStore(reduce)

// const reduxApp= () => (
//     <Provider store = {store}>
//         <App />
//     </Provider>
// )

AppRegistry.registerComponent(appName, () => App);
