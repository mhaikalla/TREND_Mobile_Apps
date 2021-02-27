
import React, { Component } from 'react';
import { ActivityIndicator, Text, BackHandler, StyleSheet, View, TouchableOpacity, Image, ScrollView, Dimensions, KeyboardAvoidingView, ImageBackground, Alert, SafeAreaView,Linking } from 'react-native';
import { Item, Label, Input } from 'native-base';
import { Images, API } from '@res';
import { StackActions, NavigationActions } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import Modal from 'react-native-modal';
import OneSignal from 'react-native-onesignal';

export default class LoginScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      username: '',
      locationUser1: '',
      locationUser2: '',
      password: '',
      tokenData: '',
      userName: '',
      noError: true,
      loginValid: '',
      deviceId: '',
      isLoadingClient: true,
      isModalVisible: false,
      isModalUsername: false,
      isModalPassword: false,
      isModalInvalidLogin : false,
      isModalErroConnection: false,
      isModalConfirmExit:false
    };
    this.onIds = this.onIds.bind(this);
    
  }

  componentWillMount() {
    OneSignal.addEventListener('ids', this.onIds)
    OneSignal.configure();
  }
  
  componentDidMount() {
    this.checkToken();
    BackHandler.addEventListener('hardwareBackPress', this.ExitAppConfig.bind(this));
  }
  componentWillUnmount() {
    OneSignal.removeEventListener('ids', this.onIds);
    BackHandler.removeEventListener('hardwareBackPress', this.ExitAppConfig.bind(this));
  }

  ExitAppConfig= () => {
    this.setState({isModalConfirmExit:true});
    return true
   }

  onIds(device) {
    this.setState({
        deviceId: device.userId
    })
}



  checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('@token');
      // const userName = await AsyncStorage.getItem('@userName');
      // alert(token)
      this.setState({
        tokenData: token,
        // userName: userName
      })
      if (this.state.tokenData != null && this.state.tokenData != '') {
        const resetAction = StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'MyTechnicalScreen' })
          ]
        });
        this.props.navigation.dispatch(resetAction);
      } else { }
    } catch (error) {

    }

  }

  validationLogin() {
    if (this.state.username === null || this.state.username === '') {
      this.setState({ isModalUsername: true, isLoadingClient: false })
    } else if (this.state.password === null || this.state.password === '') {
      this.setState({ isModalPassword: true, isLoadingClient: false })
    } else {
      this.actionLogin();
    }
  }

  actionLogin() {
    // console.log(API.login)
    this.setState({ isLoadingClient: false })
    fetch(API.login,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
        },
        body: JSON.stringify({
          Xupj: this.state.username,
          Password: this.state.password,
          PlayerId: this.state.deviceId
        }),
      }
    )
      .then((response) => { return response.json() })
      .catch((error) => {
        setTimeout(() => {
          console.log(error)
          this.setState({isModalErroConnection : true, isLoadingClient: true})
        }, 100)
      })
      .then((response) => {
        console.log(response)
        var dataObj = response.Data
        var delegationObj = response.delegation
        if (response.Code === 200) {
          // console.log(JSON.stringify(response))
          this.setTokenToLocalStore(dataObj,delegationObj )
          this.setState({ isModalVisible: true, isLoadingClient: true })
        } else {
          this.setState({ isLoadingClient: true })
          this.setState({ isModalInvalidLogin: true})
        }
        // if(JSON.stringify(response.Code) === 200 && JSON.stringify(response.Code) === '200'){
        //   alert('berhasil')
        // }else{
        //   alert('gagal')
        // }

        // var dataObj = JSON.stringify(response.Data)
        // this.setState({
        //   tokenData: dataObj
        // });
        // if (this.state.tokenData != '' && this.state.tokenData != null) {
        //   this.setTokenToLocalStore(response)
        //   this.setState({ isModalVisible: true, isLoadingClient: true })
        // } else {
        //   alert('gagal')
        //   this.setState({ isLoadingClient: true })
        // }

      })
  }

  setTokenToLocalStore = async (data, delegation) => {
    try {
      await AsyncStorage.setItem('@token', '' + data.MobileToken);
      await AsyncStorage.setItem('@userid', ''+ data.UserId);
      await AsyncStorage.setItem('@userName', ''+ data.Name);
      await AsyncStorage.setItem('@locationUser1', ''+ data.AreaName);
      await AsyncStorage.setItem('@locationUser2', ''+ data.BranchName);
      await AsyncStorage.setItem('@isadmin', '' + data.IsAdmin);
      await AsyncStorage.setItem('@uriimage', '' + data.PhotoProfile);
      await AsyncStorage.setItem('@RoleUser', ''+ data.RoleName);
      await AsyncStorage.setItem('@RoleId', '' + data.RoleId);
      await AsyncStorage.setItem('@isDelegate', '' + data.IsDelegate);
      if(delegation != null)
      {
        await AsyncStorage.setItem('@delegateId', '' + delegation.DelegateId);
        await AsyncStorage.setItem('@delegateTo_Name', '' + delegation.ToUser.Name);
        await AsyncStorage.setItem('@delegateTo_Image', '' + delegation.ToUser.PhotoProfile);
        await AsyncStorage.setItem('@delegateTo_Area', '' + delegation.ToUser.AreaName);
        await AsyncStorage.setItem('@delegateTo_Branch', '' + delegation.ToUser.BranchName);
        await AsyncStorage.setItem('@delegateStart', '' + delegation.StartDate);
        await AsyncStorage.setItem('@delegateEnd', '' + delegation.EndDate);
        await AsyncStorage.setItem('@delegateCreated', '' + delegation.CreatedAt);
        await AsyncStorage.setItem('@delegateStatus', '' + delegation.Status);
      }
      else{
        await AsyncStorage.setItem('@isDelegate', '0');
      }
      
    } catch (error) {

    }
  }

  toggleModalOK() {
    this.setState({ isModalVisible: false })
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'MyTechnicalScreen' })
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }
  toggleModalOKUsername() {
    this.setState({ isModalUsername: false, isLoadingClient: true })
  }
  
  toggleModalOKPassword() {
    this.setState({ isModalPassword: false, isLoadingClient: true })
  }

  renderButton() {
    if (this.state.isLoadingClient === true) {
      return <TouchableOpacity onPress={() => this.validationLogin()} style={styles.button}>
        <Text>SIGN IN</Text>
      </TouchableOpacity>;
    } else {
      return <TouchableOpacity style={styles.button}>
        <ActivityIndicator size="small" color="#fff" />
      </TouchableOpacity>;
    }
  }

  render() {
    return (
      <SafeAreaView style={{ backgroundColor: '#FFCC00', flex: 1 }}>
        <View style={{ flex: 1 }}>
          <ImageBackground source={Images.bg_splash} style={styles.backgroundImage} >
            <View style={{ padding: 10, paddingLeft: 15, width: '100%', backgroundColor: 'black' }}>
              <Image source={Images.ic_logo} style={{ width: 190, height: 40, backgroundColor: 'transparen' }} />
            </View>
            <View style={styles.view}>
              <Item floatingLabel style={styles.item}>
                <Label >Username</Label>
                <Input style={styles.input} 
                returnKeyType='next'
                // onSubmitEditing={() => this.refs.passtext.focus()}
                onChangeText={(text) => this.setState({ username: text })} />
              </Item>
              <Item floatingLabel style={styles.item}>
                <Label>Password</Label>
                <Input style={styles.input}
                  secureTextEntry={true}
                  password={true}
                  // ref= "passtext"
                  onChangeText={(text) => this.setState({ password: text })} />
              </Item>
              <View>{this.renderButton()}</View>
            </View>
            
          </ImageBackground>
        </View>
        <View style={{ justifyContent: 'center', alignItems:'center' }}>
    <Text>Version {API.Version}</Text>
        </View>

        <Modal isVisible={this.state.isModalVisible}
          animationIn='bounceIn'
          animationOut='bounceOut'
        >
          <View style={styles.viewmodal}>
            <Text style={styles.textalertmodal}>Login Success</Text>
            <TouchableOpacity onPress={() => this.toggleModalOK()} style={[styles.buttonmodalOK]}>
              <Text style={{ fontWeight: '200', color: '#fff' }}>OK</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal isVisible={this.state.isModalUsername}
          animationIn='bounceIn'
          animationOut='bounceOut'
        >
          <View style={styles.viewmodal}>
            <Text style={styles.textalertmodal}>The Username is Empty</Text>
            <TouchableOpacity onPress={() => this.toggleModalOKUsername()} style={[styles.buttonmodalOK]}>
              <Text style={{ fontWeight: '200', color: '#fff' }}>OK</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal isVisible={this.state.isModalPassword}
          animationIn='bounceIn'
          animationOut='bounceOut'
        >
          <View style={styles.viewmodal}>
            <Text style={styles.textalertmodal}>Please Enter Your Password</Text>
            <TouchableOpacity onPress={() => this.toggleModalOKPassword()} style={[styles.buttonmodalOK]}>
              <Text style={{ fontWeight: '200', color: '#fff' }}>OK</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal isVisible={this.state.isModalErroConnection}
          animationIn='bounceIn'
          animationOut='bounceOut'
        >
          <View style={styles.viewmodal}>
            <Text style={styles.textalertmodal}>Connection To Server Failed</Text>
            <TouchableOpacity onPress={() => this.setState({isModalErroConnection: false})} style={[styles.buttonmodalOK]}>
              <Text style={{ fontWeight: '200', color: '#fff' }}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal isVisible={this.state.isModalInvalidLogin}
          animationIn='bounceIn'
          animationOut='bounceOut'
        >
          <View style={styles.viewmodal}>
            <Text style={styles.textalertmodal}>Username or Password is Not Correct</Text>
            <TouchableOpacity onPress={() => this.setState({isModalInvalidLogin: false})} style={[styles.buttonmodalOK]}>
              <Text style={{ fontWeight: '200', color: '#fff' }}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </Modal>
       <Modal isVisible={this.state.isModalConfirmExit}
                    animationIn='bounceIn'
                    animationOut='bounceOut'
                >
                    <View style={styles.viewmodal}>
                        <Text allowFontScaling={false} style={styles.textalertmodal}>Exit From TREND Application?</Text>
                        <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 10 }}>
                            <TouchableOpacity onPress={() => this.setState({isModalConfirmExit : false})} style={[styles.buttonmodalOK,{marginHorizontal : 10}]}>
                                <Text allowFontScaling={false} style={{ fontWeight: '200', color: '#fff' }}>No</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() =>  BackHandler.exitApp()} style={styles.buttonmodalOK}>
                                <Text allowFontScaling={false} style={{ fontWeight: '200', color: '#fff' }}>Yes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

     </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({

  form: {
    flex: 1,
    justifyContent: 'space-between'
    // marginTop: 200
  },
  backgroundImage: {
    resizeMode: "cover",
    width: '100%', height: '100%'
  },
  container: {
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  view: {
    top: "25%",
    alignSelf: "center",
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    height: 250,
    width: 320,
    borderRadius: 5
  },
  item: {
    margin: 15,
    marginLeft: 20,
    marginRight: 20,
  },
  input: {
    color: '#000000',
  },
  button: {
    backgroundColor: '#FFCC00',
    alignSelf: 'center',
    alignItems: 'center',
    padding: 15,
    width: 250,
    borderRadius: 5
  },
  viewmodal: {
    backgroundColor: '#fff',
    height: 120,
    borderRadius: 20,

  },
  textalertmodal: {
    marginTop: 20,
    alignSelf: 'center',
  },
  buttonmodalOK: {
    display: 'flex',
    height: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: 100,
    marginTop: 20,
    backgroundColor: '#FFCC00',
    shadowRadius: 20,
    color: '#fff'
  },
})

//     checkLoginValidStore(){       
  //         AsyncStorage.getItem('@LoginValid', (error, result) => {
  //             if (result) {
  //               // alert(result)
  //                 this.checkTokenAppsStoreAction(result);
  //             }else{
  //               return this.checkTokenAppsStoreAction('false');
  //             }
  //         });
  //     }

  // // kalo true dia langsung masuk
  // //75
  //     checkTokenAppsStoreAction(result){
  //       if (result !== undefined && result !== "false") {
  //         this.getTokenForLogin(result);
  //         }else{
  //           this.getTokenForLogin('false');
  //         }
  //      }

  //      getTokenForLogin() {
  //       fetch('https://apps.dipstrategy.com/trakindotsics/api/MobileLogin', 
  //         {
  //            method: 'POST',
  //            headers: {
  //             Accept: 'application/json',
  //                     'Content-Type': 'application/json',
  //                     'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
  //           },
  //           body:JSON.stringify({
  //               Xupj: this.state.username,
  //               Password: this.state.password
  //           }),
  //         }
  //       ) 
  //       .then((response) => { return  response.json() } ) 
  //       .catch((error) => {
  //           console.log(error)
  //       })
  //       .then((response) => {
  //           this.setState({
  //               tokenData : JSON.stringify(response.Data),
  //           });
  //         return this.setTokenToLocalStore(response);
  //       })
  //   }

  // //   setLocalStore(dataJson){
  // //     alert(dataJson)
  // //     if (dataJson.Code == 200) {
  // //       if (AsyncStorage.setItem('@LoginValid', "true")) {
  // //         if (AsyncStorage.setItem('@Authorization', dataJson.Authorization)) {
  // //           if(AsyncStorage.setItem('@Data', dataJson.Data)){
  // //                this.checkLoginValidStoreAction(dataJson);
  // //           }
  // //         }
  // //       }else{
  // //         return false;
  // //       }
  // //     }else{
  // //       return false;
  // //     }
  // // }

  //     setTokenToLocalStore(response){  
  //       if (AsyncStorage.setItem('@Data', response.Data)) {
  //         return this.checkLoginValidStoreAction();
  //       }else{
  //         return checkLoginValidStoreAction('false');
  //       }
  //     }

  //     checkLoginValidStoreAction(result){
  //         if (result !== undefined ) {
  //             const resetAction = StackActions.reset({
  //               index: 0,
  //               actions:
  //                 [
  //                     NavigationActions.navigate({ 
  //                         routeName: 'MyTechnicalScreen', 
  //                         params: { tokenData: this.state.tokenData } 
  //                     }),
  //                 ],
  //             });
  //             this.props.navigation.dispatch(resetAction);
  //           }else {
  //             Alert.alert("Token Expired, Please Login Again");
  //             // return this.handleClick();
  //           }
  //        }  

  // //64
  // // handleClick(){
  // //     AsyncStorage.getItem('@TokenApps', (error, result) => {
  // //         if (result) {
  // //           this.checkTokenAppsStoreAction(result);
  // //         }else{
  // //           this.checkTokenAppsStoreAction("false");
  // //         }
  // //     });
  // //    }

  //     getToken(){
  //         fetch('https://apps.dipstrategy.com/trakindotsics/api/MobileLogin',{
  //            method: 'POST',
  //            headers: {
  //             Accept: 'application/json',
  //                     'Content-Type': 'application/json',
  //                     'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
  //           },
  //           body:JSON.stringify({
  //             Xupj: this.state.username,
  //             Password: this.state.password
  //         }),
  //         }
  //       )
  //         .then((response) => { return  response.json() } ) 
  //         .catch((error) => {
  //             console.log(error)
  //         })
  //         .then((response) => {
  //             this.setState({
  //                 tokenData : response.Data,
  //             });
  //           console.log(response);
  //           return this.setTokenToLocalStore(response);
  //         })
  //     }

  //     setTokenToLocalStore(response){
  //         if (response.Code == 200) {
  //           if (AsyncStorage.setItem('@Data', response.Data)) {
  //             this.checkLoginValidStoreAction(response);
  //             // return true;
  //           }else{
  //             return false;
  //           }
  //         }else{
  //           return false;
  //         }
  //     }

  //     //128
  //     goLogin(){
  //       this.setState({
  //         isLoading: false,
  //         isLoadingClient:false,
  //     });   
  //         if (this.state.username){
  //             if (this.state.password){
  //               this.goLoginWithToken();
  //             } else {
  //               alert("Please Fill The Password"); }
  //         } else {
  //           alert("Please Fill The Form Correctly"); }
  //     }

  //     //148
  //     goLoginWithToken(){
  //         fetch('https://apps.dipstrategy.com/trakindotsics/api/MobileLogin',{
  //            method: 'POST',
  //            headers: {
  //             Accept: 'application/json',
  //                     'Content-Type': 'application/json',
  //                     'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
  //           },
  //           body:JSON.stringify({
  //             Xupj: this.state.username,
  //             Password: this.state.password
  //         }),
  //         }
  //       )
  //       .then((response) => { return  response.json() } ) 
  //       .catch((error) => {
  //         console.log(error)
  //       })
  //       .then((response) => {
  //         this.setState({
  //             tokenData : JSON.stringify(response.Data),
  //             isLoading: false,
  //         });
  //         if (response.Data) {
  //           console.log("Login Berhasil");
  //           this.setTokenToLocalStore(response);
  //           this.setState({
  //             isLoadingClient:true,
  //           });
  //         }else {
  //           Alert.alert("Sorry Your Account Has Not Been Registered Yet");
  //           this.setState({
  //               isLoadingClient:true,
  //           });
  //         }

  //     })
  // } 