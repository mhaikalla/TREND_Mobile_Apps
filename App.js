import React, {Component} from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar } from 'react-native';
import AppContainer from '@libs/navigators/AppNavigators';
import GlobalFont from 'react-native-global-font';
import OneSignal from 'react-native-onesignal';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state={

    }
    OneSignal.init("47a3b935-0907-4e4d-8df6-415397f614b7", {kOSSettingsKeyAutoPrompt : true});
    OneSignal.inFocusDisplaying(2)
  }

  async componentDidMount(){
    const fontName = 'Rubrik Medium'
    GlobalFont.applyGlobal(fontName)
    if (Platform.OS != 'ios'){
      GlobalFont.applyGlobal('Rubrik')
    }
  }

  render() {
    return (
       <AppContainer/>
    );
  }
}


