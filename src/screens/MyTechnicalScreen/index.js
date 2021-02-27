
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  BackHandler,
  SafeAreaView,
  ActivityIndicator,
  Text,
  Animated,
  Dimensions,
  TextInput,
  TouchableHighlight,
  RefreshControl,
  Platform,
  Linking
} from 'react-native';
import { Images, API } from '@res';
import { ModalMenu, BottomBar } from '@component';
import AsyncStorage from '@react-native-community/async-storage';
import Modal from "react-native-modal";
import { TopBarTechnical } from '@component';
import { StackActions, NavigationActions } from 'react-navigation';
import { Dropdown } from 'react-native-material-dropdown';
import DatePicker from 'react-native-datepicker';
import OneSignal from 'react-native-onesignal';
import Draggable from 'react-native-draggable';
import { Item } from 'native-base';
// import PDFView from 'react-native-view-pdf';
import Pdf from 'react-native-pdf';

let { width, height } = Dimensions.get('window');

export default class MyTechnicalScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenData: '',
      myTrList: [],
      myTrListData: [],
      tempMyTrListData: [],
      dataDetail: [],
      loadingData: false,
      loadingDataKosong: false,
      isModalOption: false,
      isModalDelete: false,
      pageViewProfile: false,
      pageViewTR: false,
      searchIcon: false,
      ticketCatIdSend: '',
      idData: '',
      trNoSend: '',
      titleSend: '',
      descSend: '',
      dppmSend: '',
      dataSearch: '',
      isModalWantDelete: false,
      isModalLogout: false,
      isModalCloseApp: false,
      backClickCount: 0,
      userId: 0,
      userName: '',
      locationUser1: '',
      locationUser2: '',
      AttchSend: [],
      isModalTokenExpired: false,
      listPage: 1,
      listLimit: 15,
      showLoadMore: false,
      allowScroll: true,
      StartDate:'',
      EndDate:'',
      isModaldateSort:false,
      tmpDataMyTr:[],
      dropdownsort:true,
      showdate:false,
      AddDate:'',
      showbottommenu:false,
      showroundemenu:true,
      closemenu:false,
      responderSend:0,
      submiterSend:0,
      dppmnumSend:'',
      StatusSend:0,
      duedatesend:'',
      dropdownvalue:'',
      nextcomentersend: 0,
      listtrfilter:[],
      SubmiterRating:0,
      ResponderRating:0,
      userImage:'',
      idTiketLink:0,
      TokenForLink:'',
      roleId : 0,
      roleName : "",
      roleTextColor : "#11100E"
    };
    this.springValue = new Animated.Value(100);
    this.menuAnimation = new Animated.Value(0);
    this.onOpened = this.onOpened.bind(this);
    this._handleOpenURL = this._handleOpenURL.bind(this);
  }
  
closeApp(){
  this.setState({
    isModalCloseApp: true
  })
  return true
}

  componentWillMount() {
    OneSignal.addEventListener('opened', this.onOpened);
  }

  componentWillUnmount() {
    BackHandler.addEventListener('hardwareBackPress',this.closeApp.bind(this))
    OneSignal.removeEventListener('opened', this.onOpened);
  }
  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
    if(openResult.notification.payload.additionalData.to == "detail"){
      var data = openResult.notification.payload.additionalData;
      this.props.navigation.navigate('ViewScreen', {
          trNoSend: data.technicalRequestNo,
          titleSend: data.technicalRequestTitle,
          descSend: data.technicalRequestDescription,
          ticketidSend: data.technicalRequestId,
          ticketCatIdSend: data.technicalRequestCategory,
          frompage: 1
      })
      // const resetAction = StackActions.reset({
      //   index: 0,
      //   actions: [
      //     NavigationActions.navigate({
      //       routeName: 'ViewScreen', params: {
      //         trNoSend: data.technicalRequestNo,
      //       titleSend: data.technicalRequestTitle,
      //       descSend: data.technicalRequestDescription,
      //       ticketidSend: data.technicalRequestId,
      //       ticketCatIdSend: data.technicalRequestCategory,
      //       frompage: 1
      //       }
            
      //     })
      //   ]
      // });
      // this.props.navigation.dispatch(resetAction);
    }
  }

  _spring() {
    this.setState({ backClickCount: 1 }, () => {
      Animated.sequence([
        Animated.spring(
          this.springValue,
          {
            toValue: -.15 * height,
            friction: 5,
            duration: 300,
            useNativeDriver: true,
          }
        ),
        Animated.timing(
          this.springValue,
          {
            toValue: 100,
            duration: 300,
            useNativeDriver: true,
          }
        ),

      ]).start(() => {
        this.setState({ backClickCount: 0 });
      });
    });
  }

  _onBackPress = () => {
    // this.state.backClickCount == 1 ? BackHandler.exitApp() : this._spring();

    return true;
  };

  // _onExitApp() {
  //   BackHandler.exitApp()
  // }

  // _onBackPress = () => {
  //   this.setState({ isModalCloseApp: true})
  //   return true;
  //   // return this._onExitApp();
  // }

  async componentDidMount() {
    
    this.getToken();
    // Linking.addEventListener('url', this._handleOpenURL);
    Linking.getInitialURL().then(url => {
      this._handleOpenURL(url);
    });

    let roleId = parseInt(await AsyncStorage.getItem("@RoleId"))
    let roleName = await AsyncStorage.getItem("@RoleUser")
    let roleTextColor = (roleId <= 0 ? "#11100E" : (roleId >=2 ? "#A36307": "#006600"))

    console.log("Did mount")

    this.setState({
      roleId,
      roleName,
      roleTextColor
    })
  
  }

  _handleOpenURL(url) {
    console.log("INI LINK", url);
    const route = url.replace(/.*?:\/\//g,'');
    const idTiket = route.match(/\/([^\/]+)\/?$/)[1];
    this.getTokenForDetail();
    setTimeout(() => {
      this.getTiketDetail(idTiket)
    }, 100);
  }


  getTiketDetail(id) {
    fetch(API.getTiketDetail + id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
        'AccessToken': this.state.TokenForLink,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.message.code === 200) {
          var Data1 = responseJson.result
          this.props.navigation.navigate('ViewScreen', {
            trNoSend: Data1.TicketNo,
            titleSend: Data1.Title,
            descSend: Data1.Description,
            ticketidSend: Data1.TicketId,
            ticketCatIdSend: Data1.TicketCategoryId,
            duedateSend: Data1.DueDateAnswer,
            nxtxomenter: Data1.NextCommenter,
            responderSend: Data1.Responder,
            escalatesend: Data1.IsEscalated,
            submiternamesend: Data1.SubmiterName,
            submiterratesend: Data1.SubmiterRating,
            responderratesend: Data1.ResponderRating,
            frompage: 1
          })
        } else {
          // this.setState({ loadingData: true, loadingDataKosong: true })
        }

      })
      .catch((error) => {
        console.log("error", error)
      });
  }


  _onLoadMore() {
    if (!this.onEndReachedCalledDuringMomentum) {
      var newPage = this.state.listPage + 1
      this.setState({ listPage: newPage })
      this.timeOut = setTimeout(() => {
        this.getMyTR(newPage)
      }, 1000)
      this.onEndReachedCalledDuringMomentum = true;
    }
  }

  actionMyTiket() {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'MyTechnicalScreen' })
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }

  actionProfile() {
    this.setState({ pageViewProfile: true, pageViewTR: false  });
  }

  actionTR() {
    this.setState({ pageViewTR: true, pageViewProfile: false, });
  }

  actionAllTechnicalScreen() {
    // this.props.navigation.navigate('AllTechnicalScreen')
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'AllTechnicalScreen' })
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }
  actionMyTechnicalScreen() {
    // const resetAction = StackActions.reset({
    //   index: 0,
    //   actions: [
    //     NavigationActions.navigate({ routeName: 'MyTechnicalScreen' })
    //   ]
    // });
    // this.props.navigation.dispatch(resetAction);
    this.props.navigation.navigate('MyTechnicalScreen')
  }

  getTokenForDetail = async () =>{
    const TokenForDetail = await AsyncStorage.getItem('@token')
    this.setState({
      TokenForLink: TokenForDetail
    })
  }

  getToken = async () => {
    const mToken = await AsyncStorage.getItem('@token');
    const mUserId = await AsyncStorage.getItem('@userid');
    const mUserName = await AsyncStorage.getItem('@userName');
    const mLocationUser1 = await AsyncStorage.getItem('@locationUser1');
    const mLocationUser2 = await AsyncStorage.getItem('@locationUser2');
    const mUserImage = await AsyncStorage.getItem('@uriimage');
    const mUserRoleName =  await AsyncStorage.getItem('@RoleName');

    const mdelegateId = await AsyncStorage.getItem('@isDelegate');
    const mdelegateTo_Name = await AsyncStorage.getItem('@delegateTo_Name');
    const mdelegateStart = await AsyncStorage.getItem('@delegateStart');
    const mdelegateEnd = await AsyncStorage.getItem('@delegateEnd');
    const mdelegateCreated = await AsyncStorage.getItem('@delegateCreated');
    const mdelegateStatus = await AsyncStorage.getItem('@delegateStatus');
    this.setState({
      tokenData: mToken,
      userId: mUserId,
      userName: mUserName,
      locationUser1: mLocationUser1,
      locationUser2: mLocationUser2,
      userImage: mUserImage,
      userRole : mUserRoleName ,
      
      delegateId : mdelegateId,
      delegateTo_Name : mdelegateTo_Name,
      delegateStart: mdelegateStart,
      delegateEnd : mdelegateEnd,
      delegateCreated  : mdelegateCreated ,
      delegateStatus : mdelegateStatus 

    });
    console.log(mToken)
    console.log(mdelegateId)
    if (this.state.tokenData != null || this.state.tokenData != '') {
      this.getMyTR(this.state.listPage);
    }
  }

  

   getMyTR(page) {
    // console.log(JSON.stringify({
    //   PerPage: 10,
    //   PageNum: page
    // }))
    // this.setState({ loadingData: false })
    if (page > 1) {
      this.setState({ showLoadMore: true, allowScroll: false })
    }
    fetch(API.getMyTR, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
        'AccessToken': this.state.tokenData,
      },
      body: JSON.stringify({
        PerPage: 2000,
        PageNum: page
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log(responseJson)
        if (responseJson.message.code === 200) {
          var Data1 = responseJson.result.filter(s => s.ResponderName != null)
          const DataList = Data1.sort((a, b) => b.RecentDate >= a.RecentDate)
          this.setState({
            myTrListData: DataList.filter(s => s.Status == 1 && s.Submiter == this.state.userId || s.Status != 1 && s.Submiter == this.state.userId || s.Status != 1 && s.Submiter != this.state.userId),
            tmpDataMyTr: Data1,
            loadingData: true,
            showLoadMore: false,
            allowScroll: true,
            refreshing:false
          }, () => {
          
          });
        } else {
          this.setState({
            isModalTokenExpired: true,
            loadingDataKosong: true,
            loadingData: true,
            showLoadMore: false,
            allowScroll: true
          })
        }

      })
      .catch((error) => {
        console.log(error)
      });
  }

  deleteItem(data) {
    console.log(data)
    fetch(API.deleteTicket + data, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
        'AccessToken': this.state.tokenData,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        // alert(JSON.stringify(responseJson))
        if (responseJson.code === 200 || responseJson.code === 204) {
          this.setState({ isModalOption: false, isModalWantDelete: false, isModalDelete: true, myTrListData: [] })
          
          setTimeout(() => {
            this.getMyTR()
          }, 200);
        }
        // if (responseJson.message.code === 200) {
        //   var Data1 = responseJson.result
        //   this.setState({
        //     myTrListData: Data1,
        //     loadingData: true
        //   });
        //   // this.myTrList()
        // } else {
        //   this.setState({ loadingData: true, loadingDataKosong: true })
        // }
      })
      .catch((error) => {
        console.log(error)
        this.setState({ isModalOption: false, isModalWantDelete: false, isModalDelete: false })
      });
  }

  toogleDoneDelete() {
    this.setState({ isModalDelete: false, isModalWantDelete: false })
    setTimeout(() => {
      this.getMyTR();
    }, 100)
  }

  actionProduk() {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: 'ProductScreen', params: {
            ticketCatIdSend: 0,
            trNoSend: ''
          } })
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }

  actionDimension() {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: 'DimensionScreen', params: {
            ticketCatIdSend: 0,
            trNoSend: ''
          } })
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }

  actionPartstechnical() {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: 'PartstechnicalScreen', params: {
            ticketCatIdSend: 0,
            trNoSend: ''
          } })
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }

  actionReferences() {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: 'ReferencesScreen', params: {
            ticketCatIdSend: 0,
            trNoSend: ''
          } })
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }

  actionGoodwill() {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: 'GoodwillScreen', params: {
            ticketCatIdSend: 0,
            trNoSend: ''
          } })
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }

  actionWarranty() {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'WarrantyScreen', params:{
          ticketCatIdSend: 0,
          trNoSend: ''
        } })
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }

  actionPassword() {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: 'PasswordScreen', params: {
            ticketCatIdSend: 0,
            trNoSend: ''
          } })
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }

  actionTelematics() {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: 'TelematicsScreen', params: {
            ticketCatIdSend: 0,
            trNoSend: ''
          } })
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }

  actionHelpdesk() {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'HelpdeskScreen', params:{
          ticketCatIdSend: 0,
          trNoSend: ''
        } })
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }

  actionCondition() {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: 'ConditionScreen', params: {
            ticketCatIdSend: 0,
            trNoSend: ''
          } })
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }

  toogleOkLogout = async () => {
    this.setState({ pageViewProfile: false })
    try {
      await AsyncStorage.removeItem('@token');
      const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'LoginScreen' })
        ]
      });
      this.props.navigation.dispatch(resetAction);

    } catch (error) {
      // Error retrieving data
    }
  };

  toogleLogoutCancel() {
    this.setState({ isModalLogout: false })
  }

  goToPdfScreen(){
    Linking.canOpenURL('http://devapps.trakindo.co.id/Trend/Upload/TREND-User-Guide.pdf').then(supported => {
      if (supported) {
        Linking.openURL(API.GuideLink);
      } else {
        console.log("Don't know how to open URI: " + this.props.url);
      }
    });
  }


  viewRenderModalProfil() {
    let loc1, loc2, showDelegation;
    
      if (this.state.locationUser1){
        loc1 = <Text style={{ color: '#11100E', fontSize: 15 }}>HEAD OFFICE</Text>
      }else{
        loc1 = <Text style={{ color: '#11100E', fontSize: 15 }}>{this.state.locationUser1}</Text>
      }
      if (this.state.locationUser2){
        loc2 = <Text style={{ color: '#11100E', fontSize: 15 }}></Text>
      }else{
        loc2 = <Text style={{ color: '#11100E', fontSize: 15 }}>{this.state.locationUser2}</Text>
      }
      
      if(this.state.delegateId != 0){
          showDelegation =  <View style={styles.Card}>
          <Text style={styles.CardTitle}>Your Delegation Has Activated</Text>
          <View style={styles.CardSeparator}/>
          <View>
            <Text style={styles.CardContent} >The Delegation has started from {this.state.delegateStart} until {this.state.delegateEnd}</Text>
            <Text style={[styles.CardContent,{marginTop : 5}]}>Delegation to : {this.state.delegateTo_Name}</Text>
        </View> 
       </View>
      }
      
    return (
      <View style={{ width: '100%', flexDirection: 'column' }}>
       {showDelegation}
        <View style={{ paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#E4A900' }}>
          <Text style={{ color: '#644A00', fontSize: 15 }}>My Account</Text>
        </View>
        <View style={{ padding: 15 }}>
          <View style={{ paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#E4A900', flexDirection: 'column' }}>
            <Text style={{ color: '#A36307', fontSize: 15 }}>Name</Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ color: '#11100E', fontSize: 15 }}>{this.state.userName}</Text>
              <View style={{ marginLeft: 20 }}>
                <Image source={Images.editName} style={{ width: 15, height: 15 }} />
              </View>
            </View>
          </View>
          <View style={{ paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#E4A900', flexDirection: 'column', marginTop: 15 }}>
            <Text style={{ color: '#A36307', fontSize: 15 }}>Location</Text>
            {loc1}
            {loc2}
          </View>
          <View style={{ paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#E4A900', flexDirection: 'column', marginTop: 15 }}>
            <Text style={{ color: '#A36307', fontSize: 15 }}>User Type</Text>
            <Text style={{ color: this.state.roleTextColor, fontSize: 15 }}>{this.state.roleName}</Text>
          </View>
          
          <TouchableOpacity onPress={() => this.goToPdfScreen()}>
            <View style={{ paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#E4A900', flexDirection: 'row', marginTop: 20, }}>
              <Image source={Images.helpDesk} style={{ width: 25, height: 25 }} />
              <View style={{ alignItems: 'center', marginLeft: 15 }}>
                <Text style={{ color: '#10110E', fontSize: 17 }}>HELP</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bmodalprofile} onPress={() => this.setState({ isModalLogout: true })}>
            <View style={{ paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#E4A900', flexDirection: 'row', marginTop: 20, }}>
              <Image source={Images.logout} style={{ width: 25, height: 25 }} />
              <View style={{ alignItems: 'center', marginLeft: 15 }}>
                <Text style={{ color: '#10110E', fontSize: 17 }}>LOG OUT</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  viewRenderModalTR() {
    if(this.state.delegateId == 0){
    return (
      <View style={{ width: "100%", }}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ fontSize: 14, paddingBottom: 5 }}>Technical Request.</Text>
          <Text style={{ fontSize: 14, paddingBottom: 5, fontStyle: 'italic', fontWeight: 'bold', marginTop: -1 }}> Choose Category (TR Type):</Text>
        </View>
        <View style={{ marginTop: 20, paddingBottom: 30 }}>
          <TouchableOpacity style={styles.bpagetechnical} onPress={() => this.actionProduk()}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.textbpagetechnical}>Product Health</Text>
              <View style={{ backgroundColor: '#BC8C01', width: 8, height: 8, alignSelf: 'center', marginLeft: 20 }}></View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bpagetechnical} onPress={() => this.actionPartstechnical()}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.textbpagetechnical}>Parts Technical</Text>
              <View style={{ backgroundColor: '#BC8C01', width: 8, height: 8, alignSelf: 'center', marginLeft: 20 }}></View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bpagetechnical} onPress={() => this.actionDimension()}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.textbpagetechnical}>Dimension</Text>
              <View style={{ backgroundColor: '#BC8C01', width: 8, height: 8, alignSelf: 'center', marginLeft: 20 }}></View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bpagetechnical} onPress={() => this.actionReferences()}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.textbpagetechnical}>References</Text>
              <View style={{ backgroundColor: '#BC8C01', width: 8, height: 8, alignSelf: 'center', marginLeft: 20 }}></View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bpagetechnical} onPress={() => this.actionWarranty()}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.textbpagetechnical}>Warranty References</Text>
              <View style={{ backgroundColor: '#BC8C01', width: 8, height: 8, alignSelf: 'center', marginLeft: 20 }}></View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bpagetechnical} onPress={() => this.actionGoodwill()}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.textbpagetechnical}>Goodwill Assistance</Text>
              <View style={{ backgroundColor: '#BC8C01', width: 8, height: 8, alignSelf: 'center', marginLeft: 20 }}></View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bpagetechnical} onPress={() => this.actionPassword()}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.textbpagetechnical}>Password</Text>
              <View style={{ backgroundColor: '#BC8C01', width: 8, height: 8, alignSelf: 'center', marginLeft: 20 }}></View>
            </View>
          </TouchableOpacity>



          <TouchableOpacity style={styles.bpagetechnical} onPress={() => this.actionCondition()}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.textbpagetechnical}>Condition Monitoring</Text>
              <View style={{ backgroundColor: '#BC8C01', width: 8, height: 8, alignSelf: 'center', marginLeft: 20 }}></View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.bpagetechnical} onPress={() => this.actionHelpdesk()}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.textbpagetechnical}>Help Desk</Text>
              <View style={{ backgroundColor: '#BC8C01', width: 8, height: 8, alignSelf: 'center', marginLeft: 20 }}></View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
    }
    else{
      return (
        <View style={{ width: "100%", }}>
          <Text style={{textAlign: 'center', fontSize: 15 , justifyContent : 'center'}}>Can't Create Technical request during Delegation Period</Text>
        </View>
      );
    }
  }

  goToEdit = () => {
    // alert(JSON.stringify({
    //   idData: this.state.idData,
    //   ticketCatIdSend: this.state.ticketCatIdSend,
    //   trNoSend: this.state.trNoSend,
    //   titleSend: this.state.titleSend,
    //   descSend: this.state.descSend,
    //   serialNumberSend: this.state.serialNumberSend,
    //   partFailureSend: this.state.partFailureSend,
    //   emailSend: this.state.emailSend,
    //   SmuSend: this.state.SmuSend,
    //   AttchSend: this.state.AttchSend
    // }))
    this.setState({ isModalOption: false });
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: 'EditScreen', params:
          {
            idData: this.state.idData,
            ticketCatIdSend: this.state.ticketCatIdSend,
            trNoSend: this.state.trNoSend,
            titleSend: this.state.titleSend,
            descSend: this.state.descSend,
            serialNumberSend: this.state.serialNumberSend,
            partFailureSend: this.state.partFailureSend,
            emailSend: this.state.emailSend,
            SmuSend: this.state.SmuSend,
            // AttchSend: this.state.AttchSend
          }
        })
      ]
    });
    this.props.navigation.dispatch(resetAction);
    // this.props.navigation.navigate('EditScreen',
    //   {
    //     idData: this.state.idData,
    //     ticketCatIdSend: this.state.ticketCatIdSend,
    //     trNoSend: this.state.trNoSend,
    //     titleSend: this.state.titleSend,
    //     descSend: this.state.descSend,
    //     serialNumberSend: this.state.serialNumberSend,
    //     partFailureSend: this.state.partFailureSend,
    //     emailSend: this.state.emailSend,
    //     SmuSend: this.state.SmuSend,
    //     // AttchSend: this.state.AttchSend
    //   });
  }

  actionSearch(){
    // const resetAction = StackActions.reset({
    //   index: 0,
    //   actions: [
    //     NavigationActions.navigate({ routeName: 'MenuSearch' })
    //   ]
    // });
    // this.props.navigation.dispatch(resetAction);
    this.props.navigation.navigate('MenuSearch')
  }

  goToReopen = () => {
    if (this.state.ticketCatIdSend == 9){
      this.setState({ isModalOption: false });
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: 'HelpdeskScreen', params: {
            idData: this.state.idData,
            ticketCatIdSend: this.state.ticketCatIdSend,
            trNoSend: this.state.trNoSend,
            titleSend: this.state.titleSend,
            descSend: this.state.descSend,
            trnosend: this.state.trNoSend
          }
        })
      ]
    });
    this.props.navigation.dispatch(resetAction);
    } else if (this.state.ticketCatIdSend == 8){
      this.setState({ isModalOption: false });
      const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'TelematicsScreen', params: {
              idData: this.state.idData,
              ticketCatIdSend: this.state.ticketCatIdSend,
              trNoSend: this.state.trNoSend,
              titleSend: this.state.titleSend,
              descSend: this.state.descSend,
              trnosend: this.state.trNoSend
            }
          })
        ]
      });
      this.props.navigation.dispatch(resetAction);
    } else if (this.state.ticketCatIdSend == 7) {
      this.setState({ isModalOption: false });
      const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'PasswordScreen', params: {
              idData: this.state.idData,
              ticketCatIdSend: this.state.ticketCatIdSend,
              trNoSend: this.state.trNoSend,
              titleSend: this.state.titleSend,
              descSend: this.state.descSend,
              trnosend: this.state.trNoSend
            }
          })
        ]
      });
      this.props.navigation.dispatch(resetAction);
    } else if (this.state.ticketCatIdSend == 6) {
      this.setState({ isModalOption: false });
      const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'GoodwillScreen', params: {
              idData: this.state.idData,
              ticketCatIdSend: this.state.ticketCatIdSend,
              trNoSend: this.state.trNoSend,
              titleSend: this.state.titleSend,
              descSend: this.state.descSend,
              trnosend: this.state.trNoSend
            }
          })
        ]
      });
      this.props.navigation.dispatch(resetAction);
    } else if (this.state.ticketCatIdSend == 5) {
      this.setState({ isModalOption: false });
      const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'WarrantyScreen', params: {
              idData: this.state.idData,
              ticketCatIdSend: this.state.ticketCatIdSend,
              trNoSend: this.state.trNoSend,
              titleSend: this.state.titleSend,
              descSend: this.state.descSend,
              trnosend: this.state.trNoSend
            }
          })
        ]
      });
      this.props.navigation.dispatch(resetAction);
    } else if (this.state.ticketCatIdSend == 4) {
      this.setState({ isModalOption: false });
      const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'ReferencesScreen', params: {
              idData: this.state.idData,
              ticketCatIdSend: this.state.ticketCatIdSend,
              trNoSend: this.state.trNoSend,
              titleSend: this.state.titleSend,
              descSend: this.state.descSend,
              trnosend: this.state.trNoSend
            }
          })
        ]
      });
      this.props.navigation.dispatch(resetAction);
    } else if (this.state.ticketCatIdSend == 3) {
      this.setState({ isModalOption: false });
      const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'DimensionScreen', params: {
              idData: this.state.idData,
              ticketCatIdSend: this.state.ticketCatIdSend,
              trNoSend: this.state.trNoSend,
              titleSend: this.state.titleSend,
              descSend: this.state.descSend,
              trnosend: this.state.trNoSend
            }
          })
        ]
      });
      this.props.navigation.dispatch(resetAction);
    } else if (this.state.ticketCatIdSend == 2) {
      this.setState({ isModalOption: false });
      const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'PartstechnicalScreen', params: {
              idData: this.state.idData,
              ticketCatIdSend: this.state.ticketCatIdSend,
              trNoSend: this.state.trNoSend,
              titleSend: this.state.titleSend,
              descSend: this.state.descSend,
              trnosend: this.state.trNoSend
            }
          })
        ]
      });
      this.props.navigation.dispatch(resetAction);
    } else if (this.state.ticketCatIdSend == 1) {
      this.setState({ isModalOption: false });
      const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'ProductScreen', params: {
              idData: this.state.idData,
              ticketCatIdSend: this.state.ticketCatIdSend,
              trNoSend: this.state.trNoSend,
              titleSend: this.state.titleSend,
              descSend: this.state.descSend,
              trnosend: this.state.trNoSend
            }
          })
        ]
      });
      this.props.navigation.dispatch(resetAction);
    }else{
      this.setState({ isModalOption: false });
      const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'ConditionScreen', params: {
              idData: this.state.idData,
              ticketCatIdSend: this.state.ticketCatIdSend,
              trNoSend: this.state.trNoSend,
              titleSend: this.state.titleSend,
              descSend: this.state.descSend,
              trnosend: this.state.trNoSend
            }
          })
        ]
      });
      this.props.navigation.dispatch(resetAction);
    }

    // this.setState({ isModalOption: false });
    // const resetAction = StackActions.reset({
    //   index: 0,
    //   actions: [
    //     NavigationActions.navigate({
    //       routeName: 'ReopenScreen', params: {
    //         idData: this.state.idData,
    //         ticketCatIdSend: this.state.ticketCatIdSend,
    //         trNoSend: this.state.trNoSend,
    //         titleSend: this.state.titleSend,
    //         descSend: this.state.descSend,
    //         trnosend: this.state.trNoSend
    //       }
    //     })
    //   ]
    // });
    // this.props.navigation.dispatch(resetAction);
  }

  goToDppm = () => {
    this.setState({ isModalOption: false });
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: 'DppmScreen', params: {
            trNoSend: this.state.trNoSend,
            titleSend: this.state.titleSend,
            descSend: this.state.descSend,
            ticketidSend: this.state.idData,
            ticketCatIdSend: this.state.ticketCatIdSend,
          }
        })
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }

  actionView() {
    this.setState({ isModalOption: false });
    // const resetAction = StackActions.reset({
    //   index: 0,
    //   actions: [
    //     NavigationActions.navigate({
    //       routeName: 'ViewScreen', params: {
    //         trNoSend: this.state.trNoSend,
    //         titleSend: this.state.titleSend,
    //         descSend: this.state.descSend,
    //         ticketidSend: this.state.idData,
    //         ticketCatIdSend: this.state.ticketCatIdSend,
    //         duedateSend: this.state.duedatesend,
    //         nxtxomenter: this.state.nextcomentersend,
    //         responderSend: this.state.responderSend,
    //         escalatesend: this.state.escalatesend,
    //         submiternamesend: this.state.submiternamesend,
    //         submiterratesend: this.state.submiterratesend,
    //         responderratesend: this.state.responderratesend,
    //         frompage: 1
    //       }
          
    //     })
    //   ]
    // });
    // this.props.navigation.dispatch(resetAction);
    this.props.navigation.navigate('ViewScreen', {
            trNoSend: this.state.trNoSend,
            titleSend: this.state.titleSend,
            descSend: this.state.descSend,
            ticketidSend: this.state.idData,
            ticketCatIdSend: this.state.ticketCatIdSend,
            duedateSend: this.state.duedatesend,
            nxtxomenter: this.state.nextcomentersend,
            responderSend: this.state.responderSend,
            escalatesend: this.state.escalatesend,
            submiternamesend: this.state.submiternamesend,
            submiterratesend: this.state.submiterratesend,
            responderratesend: this.state.responderratesend,
            frompage: 1
    })
  }

  toogleTokenExpired = async () => {
    this.setState({ isModalTokenExpired: false })
    try {
      await AsyncStorage.removeItem('@token');
      const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'LoginScreen' })
        ]
      });
      this.props.navigation.dispatch(resetAction);
    } catch (error) {

    }

  }

  actionPress(item){
    // console.log('ini tiket id', item.TicketId)
    // const resetAction = StackActions.reset({
    //   index: 0,
    //   actions: [
    //     NavigationActions.navigate({
    //       routeName: 'ViewScreen', params: {
    //         trNoSend: item.TicketNo,
    //         titleSend: item.Title,
    //         descSend: item.Description,
    //         ticketidSend: item.TicketId,
    //         ticketCatIdSend: item.TicketCategoryId,
    //         duedateSend: item.DueDateAnswer,
    //         nxtxomenter: item.NextCommenter,
    //         responderSend: item.Responder,
    //         escalatesend: item.IsEscalated,
    //         submiternamesend: item.SubmiterName,
    //         submiterratesend: item.SubmiterRating,
    //         responderratesend: item.ResponderRating,
    //         frompage:1
    //       }
          
    //     })
    //   ]
    // });
    // this.props.navigation.dispatch(resetAction);
    this.props.navigation.navigate('ViewScreen', {
            trNoSend: item.TicketNo,
            titleSend: item.Title,
            descSend: item.Description,
            ticketidSend: item.TicketId,
            ticketCatIdSend: item.TicketCategoryId,
            duedateSend: item.DueDateAnswer,
            nxtxomenter: item.NextCommenter,
            responderSend: item.Responder,
            escalatesend: item.IsEscalated,
            submiternamesend: item.SubmiterName,
            submiterratesend: item.SubmiterRating,
            responderratesend: item.ResponderRating,
            frompage:1
    })
  }

  renderItem = (item) => {
    // console.log(this.state.userId)
    let showStatus, statusbar, showRating;

    if (item.Status == 1) {
      //draft
      showStatus = <Text style={{ fontSize: 15, color: '#5B5B5B' }}>DRAFT</Text>
    } else if (item.Status == 2) {
      if (item.IsEscalated) {
        if (item.NextCommenter == 0) {
          if (item.Responder == this.state.userId && item.Submiter == this.state.userId) {
            // escalate waiting your feed back
            showStatus = <Text style={{ fontSize: 10, color: 'red' }}>Escalate - Waiting Your Feedback</Text>
          } else {
            // escalate pra
            showStatus = <Text style={{ fontSize: 10, color: 'red' }}>Escalate - <Text style={{ fontSize: 10, color: '#5B5B5B'}}>PRA</Text></Text>
          }
        } else {
          if (this.state.userId == item.NextCommenter) {
            // escalate waiting your feed back
            showStatus = <Text style={{ fontSize: 10, color: 'red' }}>Escalate - Waiting Your Feedback</Text>
          } else {
            if (item.NextCommenter == item.Responder) {
              // escalate pra
              showStatus = <Text style={{ fontSize: 10, color: 'red' }}>Escalate - <Text style={{ fontSize: 10, color: '#5B5B5B'}}>PRA</Text></Text>
            } else if (item.NextCommenter == item.Submiter) {
              // escalate psa 
              showStatus = <Text style={{ fontSize: 10, color: 'red' }}>Escalate - <Text style={{ fontSize: 10, color: '#5B5B5B'}}>PSA</Text></Text>
            }
          }
        }
      } else {
        if (item.NextCommenter == 0) {
          if (item.Responder == this.state.userId && item.Submiter == this.state.userId) {
            // waiting your feedback
            showStatus = <Text style={{ fontSize: 15, color: 'red' }}>Waiting Your Feedback</Text>
          } else {
            // PRA
            showStatus = <Text style={{ fontSize: 15, color: '#5B5B5B' }}>PRA</Text>
          }
        } else {
          if (this.state.userId == item.NextCommenter) {
            // waiting your feed back
            showStatus = <Text style={{ fontSize: 15, color: 'red' }}>Waiting Your Feedback</Text>
          } else {
            if (item.NextCommenter == item.Responder) {
              // pra
              showStatus = <Text style={{ fontSize: 15, color: '#5B5B5B' }}>PRA</Text>
            } else if (item.NextCommenter == item.Submiter) {
              //psa
              showStatus = <Text style={{ fontSize: 15, color: '#5B5B5B' }}>PSA</Text>
            }
            
          }
        }
      }
    } else if (item.Status == 3) {
      //closed
      showStatus = <Text style={{ fontSize: 15, color: 'red' }}>CLOSED</Text>
    } else if (item.Status == 6) {
      // solved
      showStatus = <Text style={{ fontSize: 15, color: 'red' }}>SOLVED</Text>
    }

   

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }
    today = yyyy + '-' + mm + '-' + dd;

    // console.log(item.DueDateAnswer);
    // console.log(today);
    if(item.Status == 2){
    if (item.DueDateAnswer > today) {
      statusbar = <View style={{ height:5,width: 100, backgroundColor:'green', borderRadius: 5, alignSelf:'center', marginTop:5 }}>
      </View>
    } else if (item.DueDateAnswer < today) {
      statusbar = <View style={{ height: 5, width: 100, backgroundColor: 'red', borderRadius: 5, alignSelf: 'center', marginTop: 5 }}>
      </View>
    } else if (item.DueDateAnswer == today) {
      statusbar = <View style={{ height: 5, width: 100, backgroundColor: '#FAFA04', borderRadius: 5, alignSelf: 'center', marginTop: 5 }}>
      </View>
    }
  }

    // showRating  = () => {
    //   console.log(item.Title + " " + item.SubmiterRating + " " + item.ResponderRating)
    //   if(item.Status === 3 || item.Status === 6) {
    //       return (
    //       <View style={{ flexDirection: 'column', width: '100%' }}>
    //           {item.ResponderRating > 0 ? 
    //           <View style={{ flexDirection: 'row', width: '100%' }}>
    //               <View style={{ width: '25%' }}>
    //                   <Text style={{ fontSize: 10, color: '#959595' }}>Responder Rating</Text>
    //               </View>
    //               <View style={{ width: '5%' }}>
    //                   <Text style={{ fontSize: 10, color: '#5B5B5B' }}>:</Text>
    //               </View>
    //               <View style={{ width: '70%' }}>
    //                   <View style={{ flexDirection: 'row' }}>
    //                       {[...Array(item.ResponderRating)].map((item, index) => {
    //                           return <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
    //                       })}
    //                   </View>
    //               </View>
    //           </View> : <View></View>}
    //           {item.SubmiterRating > 0 ? 
    //           <View style={{ flexDirection: 'row', width: '100%' }}>
    //               <View style={{ width: '25%' }}>
    //                   <Text style={{ fontSize: 10, color: '#959595' }}>Submitter Rating</Text>
    //               </View>
    //               <View style={{ width: '5%' }}>
    //                   <Text style={{ fontSize: 10, color: '#5B5B5B' }}>:</Text>
    //               </View>
    //               <View style={{ width: '70%' }}>
    //                   <View style={{ flexDirection: 'row' }}>
    //                       {[...Array(item.SubmiterRating)].map((item, index) => {
    //                           return <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
    //                       })}
    //                   </View>
    //               </View>
    //           </View> : <View></View>}
    //       </View>
    //       )
    //   }
    // }
    const RENDER_RESPONDER_RATING = 1
    const RENDER_SUBMITTER_RATING = 2

    let renderRating = (kind, rating) => {
      /* 
      kind rating : {
        1 : Responder Rating,
        2 : Submitter Rating
      }
      */

      return(
        <View style={{ flexDirection: 'row', width: '100%' }}>
            <View style={{ width: '25%' }}>
            <Text style={{ fontSize: 10, color: '#959595' }}>{kind === RENDER_RESPONDER_RATING  ? "Rate By Responder" : "Rate By Submitter"}</Text>
            </View>
            <View style={{ width: '5%' }}>
                <Text style={{ fontSize: 10, color: '#5B5B5B' }}>:</Text>
            </View>
            <View style={{ width: '70%' }}>
                <View style={{ flexDirection: 'row' }}>
                    {[...Array(rating)].map(() => {
                        return <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                    })}
                </View>
            </View>
        </View>
      )
    } 
    showRating = () => {
      console.log(item.Title + " status " + item.Status + " SR: " + item.SubmiterRating + " RR:" + item.ResponderRating)
      // console.log(item)
      if(item.Status === 3) {
        if(item.Responder == this.state.userId && parseInt(item.ResponderRating) > 0) {
          return renderRating(RENDER_SUBMITTER_RATING, item.ResponderRating)
        }

        else if(item.Submiter == this.state.userId && parseInt(item.SubmiterRating) > 0) {
          return renderRating(RENDER_RESPONDER_RATING, item.SubmiterRating)
        }
      } else if(item.Status === 6) {
        if(item.Responder == this.state.userId && parseInt(item.ResponderRating) > 0) {
          return renderRating(RENDER_SUBMITTER_RATING, item.ResponderRating)
        }

        else if(item.Submiter == this.state.userId && parseInt(item.SubmiterRating) > 0) {
          return renderRating(RENDER_RESPONDER_RATING, item.SubmiterRating)
        }
      } else {
          return(<View></View>)
      }

      // if(item.Status === 3 && item.Responder == this.state.userId && item.ResponderRating > 0) {
      //     return (
      //         <View style={{ flexDirection: 'row', width: '100%' }}>
      //             <View style={{ width: '25%' }}>
      //                 <Text style={{ fontSize: 10, color: '#959595' }}>Responder Rating</Text>
      //             </View>
      //             <View style={{ width: '5%' }}>
      //                 <Text style={{ fontSize: 10, color: '#5B5B5B' }}>:</Text>
      //             </View>
      //             <View style={{ width: '70%' }}>
      //                 <View style={{ flexDirection: 'row' }}>
      //                     {[...Array(item.ResponderRating)].map((item, index) => {
      //                         return <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
      //                     })}
      //                 </View>
      //             </View>
      //         </View>
      //     )
      // } else if(item.Status === 6 && item.Responder == this.state.userId && item.SubmiterRating > 0) {
      //     return (
      //         <View style={{ flexDirection: 'row', width: '100%' }}>
      //             <View style={{ width: '25%' }}>
      //                 <Text style={{ fontSize: 10, color: '#959595' }}>Submitter Rating</Text>
      //             </View>
      //             <View style={{ width: '5%' }}>
      //                 <Text style={{ fontSize: 10, color: '#5B5B5B' }}>:</Text>
      //             </View>
      //             <View style={{ width: '70%' }}>
      //                 <View style={{ flexDirection: 'row' }}>
      //                     {[...Array(item.SubmiterRating)].map((item, index) => {
      //                         return <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
      //                     })}
      //                 </View>
      //             </View>
      //         </View>
      //     )
  }
                        
    return (
            <View style={{ margin: 7 }}>
              <View style={{ backgroundColor: "#fff", paddingHorizontal: 20, paddingVertical: 7, borderRadius: 20, borderColor: '#d9d2d2', borderWidth: 1, flexDirection: 'column' }}>
                       
                <Text style={{ fontSize: 10, color: '#959595' }}>{item.RecentDate.substring(0, 10)}  {item.RecentDate.substring(11, 19)}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                  <TouchableOpacity style={{width: '85%'}} onPress={() => { this.actionPress(item);  }}>
                    <View style={{ width: '95%' }}>
                      <View style={{ flexDirection: 'row', width: '100%' }}>
                        <View style={{ width: '25%' }}>
                          <Text style={{ fontSize: 10, color: '#959595' }}>Title</Text>
                        </View>
                        <View style={{ width: '5%' }}>
                          <Text style={{ fontSize: 10, color: '#5B5B5B' }}>:</Text>
                        </View>
                        <View style={{ width: '70%' }}>
                          <Text style={{ fontSize: 10, color: '#5B5B5B' }}>{item.Title}</Text>
                        </View>
                      </View>
                      <View style={{ flexDirection: 'row', width: '100%' }}>
                        <View style={{ width: '25%' }}>
                          <Text style={{ fontSize: 10, color: '#959595' }}>TR No</Text>
                        </View>
                        <View style={{ width: '5%' }}>
                          <Text style={{ fontSize: 10, color: '#5B5B5B' }}>:</Text>
                        </View>
                        <View style={{ width: '70%' }}>
                          <Text style={{ fontSize: 10, color: '#5B5B5B' }}>{item.TicketNo}</Text>
                        </View>
                      </View>
                      <View style={{ flexDirection: 'row', width: '100%' }}>
                        <View style={{ width: '25%' }}>
                          <Text style={{ fontSize: 10, color: '#959595' }}>Submitter</Text>
                        </View>
                        <View style={{ width: '5%' }}>
                          <Text style={{ fontSize: 10, color: '#5B5B5B' }}>:</Text>
                        </View>
                        <View style={{ width: '70%' }}>
                    <Text style={{ fontSize: 10, color: '#5B5B5B' }}>{item.SubmiterName}</Text>
                        </View>
                        
                      </View>
                      <View style={{ flexDirection: 'row', width: '100%' }}>
                        <View style={{ width: '25%' }}>
                          <Text style={{ fontSize: 10, color: '#959595' }}>Status</Text>
                        </View>
                        <View style={{ width: '5%' }}>
                          <Text style={{ fontSize: 10, color: '#5B5B5B' }}>:</Text>
                        </View>
                        <View style={{ width: '70%' }}>
                          {showStatus}
                        </View>

                      </View>
                       {statusbar}
                     {showRating()}
                    </View>
                  </TouchableOpacity>
                  <View></View>
                  <View style={{ height: 35, width: 35, alignItems: 'center', justifyContent: 'center', borderColor: '#d9d2d2'}}>
                    <TouchableOpacity onPress={() =>
                      {
                        this.setState({
                        isModalOption: true,
                        idData: item.TicketId,
                        ticketCatIdSend: item.TicketCategoryId,
                        trNoSend: item.TicketNo,
                        titleSend: item.Title,
                        descSend: item.Description,
                        serialNumberSend: item.SerialNumber,
                        partFailureSend: item.PartCausingFailure,
                        emailSend: item.EmailCC,
                        SmuSend: item.SMU,
                        AttchSend: item.Attachments,
                        responderSend: item.Responder,
                        submiterSend: item.Submiter,
                          dppmnumSend: item.DPPMno,
                          StatusSend:item.Status,
                          duedatesend: item.DueDateAnswer,
                          nextcomentersend: item.NextCommenter,
                          escalatesend: item.IsEscalated,
                          submiternamesend: item.SubmiterName,
                          submiterratesend: item.SubmiterRating,
                          responderratesend: item.ResponderRating,
                      });
                      }
                      }>
                      <Image source={Images.menuOption} style={{ width: 20, height: 20 }} tintColor={'#959595'} />
                    </TouchableOpacity>
                  </View>
                 
                </View>
              </View>
            </View>
            // { item.Attachments.map((item)=> {
            //   return (

            //   )
            // })}

            
          )
          
  }

  DropdownSort = (value)=>{
    if (value == 'Draft'){
      this.setState({
        // isModaldateSort:true,
        myTrListData: this.state.tmpDataMyTr.filter(s => s.Status == 1)
      })
    } else if (value == 'Submited'){
      this.setState({
        // isModaldateSort:true,
        myTrListData: this.state.tmpDataMyTr.filter(s => s.Status == 2)
      })
    } else if (value == 'Closed'){
      this.setState({
        // isModaldateSort:true,
        myTrListData: this.state.tmpDataMyTr.filter(s => s.Status == 3)
      })
    } else if (value == 'Reopen'){
      this.setState({
        // isModaldateSort:true,
        myTrListData: this.state.tmpDataMyTr.filter(s => s.Status == 4)
      })
    }else if (value == 'Date'){
      this.setState({
        showdate: true,
        myTrListData: this.state.tmpDataMyTr
      })
    }else if (value == 'PSA'){
      setTimeout(() => {
        this.setState({
          myTrListData: this.state.tmpDataMyTr.filter(s => s.NextCommenter == s.Submiter && this.state.userId != s.NextCommenter && s.Status == 2)
        })
      }, 500);
    } else if (value == 'PRA'){
        setTimeout(() => {
          this.setState({
            myTrListData: this.state.tmpDataMyTr.filter(s => s.NextCommenter != s.Submiter && s.NextCommenter != this.state.userId && s.Status ==2)
          })
        }, 500);
    } else if (value == 'Waiting your feedback') {
      setTimeout(() => {
        this.setState({
          myTrListData: this.state.tmpDataMyTr.filter(s => this.state.userId == s.NextCommenter && s.Status == 2)
        })
      }, 500);
    } else if (value == 'Escalate') {
      setTimeout(() => {
        this.setState({
          myTrListData: this.state.tmpDataMyTr.filter(s => s.IsEscalated == true && s.Status == 2)
        })
      }, 500);
    } else if (value == 'Solved') {
      setTimeout(() => {
        this.setState({
          myTrListData: this.state.tmpDataMyTr.filter(s => s.Status == 6)
        })
      }, 500);
    }else{
      setTimeout(() => {
        this.setState({
          myTrListData: this.state.tmpDataMyTr
        })
      }, 500);
      
    }
  }

  DropdownSubmit() {
    if (this.state.dropdownvalue == ''){
      setTimeout(() => {
        this.componentDidMount();
      }, 200);
    }else{
      if (this.state.dropdownvalue == 'Draft') {
        this.setState({
          // isModaldateSort:true,
          myTrListData: this.state.tmpDataMyTr.filter(s => s.Status == 1)
        })
      } else if (this.state.dropdownvalue == 'Submited') {
        this.setState({
          // isModaldateSort:true,
          myTrListData: this.state.tmpDataMyTr.filter(s => s.Status == 2)
        })
      } else if (this.state.dropdownvalue == 'Closed') {
        this.setState({
          // isModaldateSort:true,
          myTrListData: this.state.tmpDataMyTr.filter(s => s.Status == 3)
        })
      } else if (this.state.dropdownvalue == 'Reopen') {
        this.setState({
          // isModaldateSort:true,
          myTrListData: this.state.tmpDataMyTr.filter(s => s.Status == 4)
        })
      } else if (this.state.dropdownvalue == 'Deleted') {
        this.setState({
          // isModaldateSort:true,
          myTrListData: this.state.tmpDataMyTr.filter(s => s.Status == 5)
        })
      } else if (this.state.dropdownvalue == 'Date') {
        this.setState({
          showdate: true,
          myTrListData: this.state.tmpDataMyTr
        })
      } else if (this.state.dropdownvalue == 'All'){
        setTimeout(() => {
          this.componentDidMount();
        }, 200);
      }else {
        this.setState({
          // isModaldateSort:true,
          myTrListData: this.state.tmpDataMyTr.filter(s => s.Status == 6)
        })
      }
    }
  }

resetdropdown(){
  this.setState({
    dropdownvalue:''
  })
  setTimeout(() => {
    this.componentDidMount();
  }, 200);
}

  ToogleCancelSort(){
    this.setState({
      isModaldateSort:false
    })
  }
  selectedDate(){
    // console.log(this.state.EndDate)
    if (this.state.StartDate > this.state.EndDate) {
      alert('start date greater than')
    } else {
      if (this.state.StartDate != '' && this.state.EndDate != ''){
        var enddate = new Date(this.state.EndDate).getFullYear() + "-" + new Date(this.state.EndDate).getMonth() + 1 + "-" + new Date(this.state.EndDate).getDate();
        var startdate = new Date(this.state.StartDate).getFullYear() + "-" + new Date(this.state.StartDate).getMonth() + 1 + "-" + new Date(this.state.StartDate).getDate();
        var end = new Date(this.state.EndDate);
        var AddDate = new Date(end.setDate(end.getDate() + 1))
        var AddDate2 = new Date(AddDate).getFullYear() + "-" + new Date(AddDate).getMonth() + 1 + "-" + new Date(AddDate).getDate()


        setTimeout(() => {
          this.setState({
            myTrListData: this.state.tmpDataMyTr.filter(d => d.RecentDate.substring(0, 10) >= this.state.StartDate && d.RecentDate.substring(0, 10) <= this.state.EndDate)
          })

        }, 100);
      }else{
        var enddate = new Date(this.state.EndDate).getFullYear() + "-" + new Date(this.state.EndDate).getMonth() + 1 + "-" + new Date(this.state.EndDate).getDate();
        var startdate = new Date(this.state.StartDate).getFullYear() + "-" + new Date(this.state.StartDate).getMonth() + 1 + "-" + new Date(this.state.StartDate).getDate();
        var end = new Date(this.state.EndDate);
        var AddDate = new Date(end.setDate(end.getDate() + 1))
        var AddDate2 = new Date(AddDate).getFullYear() + "-" + new Date(AddDate).getMonth() + 1 + "-" + new Date(AddDate).getDate()


        setTimeout(() => {
          this.setState({
            myTrListData: this.state.tmpDataMyTr.filter(d => d.RecentDate.substring(0, 10) <= this.state.EndDate)
          })

        }, 100);
      }
      
    }
  }

  selectedDateStart() {
    
      if (this.state.StartDate != '' && this.state.EndDate != '') {
        var enddate = new Date(this.state.EndDate).getFullYear() + "-" + new Date(this.state.EndDate).getMonth() + 1 + "-" + new Date(this.state.EndDate).getDate();
        var startdate = new Date(this.state.StartDate).getFullYear() + "-" + new Date(this.state.StartDate).getMonth() + 1 + "-" + new Date(this.state.StartDate).getDate();
        var end = new Date(this.state.EndDate);
        var AddDate = new Date(end.setDate(end.getDate() + 1))
        var AddDate2 = new Date(AddDate).getFullYear() + "-" + new Date(AddDate).getMonth() + 1 + "-" + new Date(AddDate).getDate()


        setTimeout(() => {
          this.setState({
            myTrListData: this.state.tmpDataMyTr.filter(d => d.RecentDate.substring(0, 10) >= this.state.StartDate && d.RecentDate.substring(0, 10) <= this.state.EndDate)
          })

        }, 100);
    }else{
        var enddate = new Date(this.state.EndDate).getFullYear() + "-" + new Date(this.state.EndDate).getMonth() + 1 + "-" + new Date(this.state.EndDate).getDate();
        var startdate = new Date(this.state.StartDate).getFullYear() + "-" + new Date(this.state.StartDate).getMonth() + 1 + "-" + new Date(this.state.StartDate).getDate();
        var end = new Date(this.state.EndDate);
        var AddDate = new Date(end.setDate(end.getDate() + 1))
        var AddDate2 = new Date(AddDate).getFullYear() + "-" + new Date(AddDate).getMonth() + 1 + "-" + new Date(AddDate).getDate()


        setTimeout(() => {
          this.setState({
            myTrListData: this.state.tmpDataMyTr.filter(d => d.RecentDate.substring(0, 10) == this.state.StartDate)
          })

        }, 100);
    }
  }

  goResetsort(){
    this.setState({
      StartDate:'',
      EndDate:'',
      myTrListData: this.state.tmpDataMyTr
    })
  }
  cancelSortDate(){
    this.setState({
      StartDate: '',
      EndDate: '',
      showdate: false,
      myTrListData: this.state.tmpDataMyTr
    })
  }

  openMenu(){
    this.setState({
      showroundemenu: false,
      closemenu:true
    })
    // this.toggleMenu()
  }
  goCloseMenu(){
    setTimeout(() => {
      this.setState({
        showroundemenu: true,
        closemenu: false
      })
    }, 100);
  }
  
  toggleMenu=()=>{
    const toValue = this.open ? 0:1;
    Animated.spring(this.menuAnimation,{
      toValue,
      friction: 5
    }).start()
    this.open = !this.open
  }
  _onRefresh() {
      this.setState({
        refreshing: true,
        StartDate: '',
        EndDate: '',
      })
      this.getMyTR(1);
    
  }

  render() {
    let loaderData, loadMore, showsortdate, showmenu, showclose, showSelectOptionModal, showEdit, showAddToDppm,
      data = [
      {
          value: 'All',
      },{
      value: 'Date',
      },{
      value: 'Draft',
    },{
        value: 'Closed'
    },{
        value:'Reopen'
    },{
          value: 'PSA'
    },{
          value: 'PRA'
    },{
          value: 'Waiting your feedback'
    },{
      value :'Escalate'
    },{
      value: 'Solved'
    }
  ];
    
    const Menu ={
      transform:[
        {scale: this.menuAnimation},{
          translateY: this.menuAnimation.interpolate({
            inputRange:[0,1],
            outputRange:[0,1]
          })
        }
      ]
    }

  
    if(this.state.roleId > 2 ){
      if(this.state.dppmnumSend != null){
      showAddToDppm =  <View style={{ marginTop: 15, borderBottomWidth: 1 }}>
                      <TouchableOpacity onPress={this.goToDppm}>
                          <Text style={{ color: '#000', fontSize: 15 }}>Edit DPPM</Text>
                      </TouchableOpacity>
                  </View>
      }
      else{
        showAddToDppm =  <View style={{ marginTop: 15, borderBottomWidth: 1 }}>
          <TouchableOpacity onPress={this.goToDppm}>
              <Text style={{ color: '#000', fontSize: 15 }}>Add To DPPM</Text>
          </TouchableOpacity>
        </View>
      }
    }
    else{
      showAddToDppm = <View></View>
    }

    if (this.state.showdate) {
      showsortdate = <View style={{ flexDirection: 'column'}}>
        <View style={{ flexDirection: 'row', justifyContent: 'center',marginTop:5, paddingHorizontal:10 }}>
          <DatePicker
            date={this.state.StartDate}
            mode="date"
            placeholder="Start Date"
            format="YYYY-MM-DD"
            // minDate="2016-05-01"
            // maxDate="2016-06-01"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            style={{ height: 50, marginTop: 5, width:150 }}
            customStyles={{
              dateIcon: {
                width: 0,
                height: 0,
              },
              dateInput: {
                marginLeft: 36
              },
              // ... You can check the source to find the other keys.
            }}
            onDateChange={(date) => { this.setState({ StartDate: date }), this.selectedDateStart() }}
          />
          <DatePicker
            date={this.state.EndDate}
            mode="date"
            placeholder="End Date"
            format="YYYY-MM-DD"
            // minDate="2016-05-01"
            // maxDate="2016-06-01"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            style={{ height: 50, marginTop: 5, width: 150 }}
            customStyles={{
              dateIcon: {
                width: 0,
                height: 0,
              },
              dateInput: {
                marginLeft: 36
              },
              // ... You can check the source to find the other keys.
            }}
            onDateChange={(date) => { this.setState({ EndDate: date }), this.selectedDate() }}
          />
        </View>
        <View style={{flexDirection:'row', justifyContent:'center', paddingHorizontal:50}}>
          <TouchableOpacity onPress={() => this.goResetsort()} style={{ marginLeft: 20 }}>
            <Text style={{ color: '#000', fontSize: 15 }}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.cancelSortDate()} style={{marginLeft:20}}>
            <Text style={{ color: '#000', fontSize: 15 }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    }else{
      showsortdate = <View style={{ marginBottom: 5, marginHorizontal: 20}}>
        <Dropdown
          onChangeText={this.DropdownSort.bind(this)}
          // onChangeText={(text) => this.setState({ dropdownvalue: text })}
          data={data}
          placeholder='Filter'
          // value= {this.state.idWarranty}
          labelFontSize={0}
          containerStyle={styles.textInputStyleWarranty}
        />
      </View>
    }

    if (this.state.showLoadMore) {
      loadMore = <View style={{ backgroundColor: "white", justifyContent: "center", alignItems: "center", height: Dimensions.get('window').width / 5, width: Dimensions.get('window').width }}>
        <ActivityIndicator size="small" color="#FABA00" />
      </View>
    } else {
      loadMore = <View>

      </View>
    }

    if (this.state.loadingData === false) {
      loaderData = <View style={{ resizeMode: 'center', flex: 1, flexDirection: 'column', alignContent: 'center', alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} >
        <ActivityIndicator size="large" color={'#FABA00'} />
        <Text>Please Wait...</Text>
      </View>
    } else {
      loaderData =<View style={{flexDirection:'column',paddingBottom:20, flex:1}}>
        {showsortdate}
        <View style={{paddingBottom:20}}>
          <FlatList
            data={this.state.myTrListData}
            numColumns={1}
            keyExtractor={(item, index) => index.toString()}
            removeClippedSubviews
            scrollEnabled={this.state.allowScroll}
            windowSize={5}
            // initialListSize={8}
            // initialNumToRender={2}
            // maxToRenderPerBatch={10}
            onEndReachedThreshold={0.9}
            // onEndReached={() => this._onLoadMore()}
            onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
            renderItem={({ item, id }) =>
              this.renderItem(item)
            }
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={() => this._onRefresh()}
              />
            }
          />
        </View>
        
      </View>
    }

    if (this.state.closemenu){
      showclose = <TouchableHighlight style={styles.cancelmenu} onPress={() => this.goCloseMenu()}>
        <View>
          <Image source={Images.cancel} style={{ width: 15, height: 15 }} />
        </View>
      </TouchableHighlight>
    }else{
      showclose = <View></View>
    }

    if (this.state.showroundemenu){
      showmenu =
        <TouchableHighlight style={styles.RoundedMenu} onPress={() => this.openMenu()}>
          <View>
            <Image source={Images.menubottom} style={{ width: 20, height: 20 }} />
          </View>
      </TouchableHighlight>
    }else{
      showmenu =
        <BottomBar
          activeTab={2}
          activeTabColor={'white'}
          uriImage={this.state.userImage}
          onTab1Press={() => this.actionProfile()}
          onTab2Press={() => this.actionMyTiket()}
          onTab3Press={() => this.actionTR()}
        />
    }
    if(this.state.delegateId == 0){
        if (this.state.userId == this.state.submiterSend && this.state.StatusSend == 1){
          showEdit = <View>
              <View style={{ marginTop: 15, borderBottomWidth: 1 }}>
                  <TouchableOpacity onPress={this.goToEdit}>
                  <Text style={{ color: '#000', fontSize: 15 }}>Edit</Text>
                  </TouchableOpacity>
              </View>
              <View style={{ marginTop: 15, borderBottomWidth: 1 }}>
                  <TouchableOpacity onPress={() => { this.setState({ isModalWantDelete: true, isModalOption: false }) }}>
                      <Text style={{ color: '#000', fontSize: 15 }}>Delete</Text>
                  </TouchableOpacity>
              </View>
          </View>
        } else if (this.state.userId == this.state.responderSend && this.state.StatusSend == 2){
          showEdit = <View style={{ marginTop: 15, borderBottomWidth: 1 }}>
            <TouchableOpacity onPress={this.goToEdit}>
              <Text style={{ color: '#000', fontSize: 15 }}>Edit</Text>
            </TouchableOpacity>
          </View>
        }
    }
    if (this.state.userId == this.state.responderSend && this.state.dppmnumSend == null){

      if(this.state.StatusSend != 3){
        showSelectOptionModal = <Modal
          isVisible={this.state.isModalOption}
          style={{ margin: 0 }}
          onBackdropPress={() => this.setState({ isModalOption: false })}
        >
          <View style={styles.viewmodalOption}>
            <View style={{ marginTop: 15, borderBottomWidth: 1 }}>
              <TouchableOpacity onPress={() => this.actionView()}>
                <Text style={{ color: '#000', fontSize: 15 }}>View</Text>
              </TouchableOpacity>
            </View>
            {showEdit}
            {showAddToDppm}
           
          </View>
        </Modal>
      }else{
        showSelectOptionModal = <Modal
          isVisible={this.state.isModalOption}
          style={{ margin: 0 }}
          onBackdropPress={() => this.setState({ isModalOption: false })}
        >
          <View style={styles.viewmodalOption}>
            <View style={{ marginTop: 15, borderBottomWidth: 1 }}>
              <TouchableOpacity onPress={() => this.actionView()}>
                <Text style={{ color: '#000', fontSize: 15 }}>View</Text>
              </TouchableOpacity>
            </View>
            {showEdit}
            <View style={{ marginTop: 15, borderBottomWidth: 1 }}>
            <TouchableOpacity onPress={this.goToReopen}>
              <Text style={{ color: '#000', fontSize: 15 }}>Re-Open</Text>
            </TouchableOpacity>
          </View>
            {showAddToDppm}
          </View>
        </Modal>
      }
    } else if (this.state.userId != this.state.responderSend && this.state.dppmnumSend != null){
      if (this.state.StatusSend != 3) {
        showSelectOptionModal = <Modal
          isVisible={this.state.isModalOption}
          style={{ margin: 0 }}
          onBackdropPress={() => this.setState({ isModalOption: false })}
        >
          <View style={styles.viewmodalOption}>
            <View style={{ marginTop: 15, borderBottomWidth: 1 }}>
              <TouchableOpacity onPress={() => this.actionView()}>
                <Text style={{ color: '#000', fontSize: 15 }}>View</Text>
              </TouchableOpacity>
            </View>
            {showEdit}
            {/* <View style={{ marginTop: 15, borderBottomWidth: 1 }}>
              <TouchableOpacity onPress={this.goToEdit}>
                <Text style={{ color: '#000', fontSize: 15 }}>Edit</Text>
              </TouchableOpacity>
            </View> */}
            {/* <View style={{ marginTop: 15, borderBottomWidth: 1 }}>
            <TouchableOpacity onPress={() => { this.setState({ isModalWantDelete: true, isModalOption: false }) }}>
              <Text style={{ color: '#000', fontSize: 15 }}>Delete</Text>
            </TouchableOpacity>
          </View> */}
            {/* <View style={{ marginTop: 15, borderBottomWidth: 1 }}>
            <TouchableOpacity onPress={this.goToReopen}>
              <Text style={{ color: '#000', fontSize: 15 }}>Re-Open</Text>
            </TouchableOpacity>
          </View> */}
          
          {showAddToDppm}
          </View>
        </Modal>
      } else {
        showSelectOptionModal = <Modal
          isVisible={this.state.isModalOption}
          style={{ margin: 0 }}
          onBackdropPress={() => this.setState({ isModalOption: false })}
        >
          <View style={styles.viewmodalOption}>
            <View style={{ marginTop: 15, borderBottomWidth: 1 }}>
              <TouchableOpacity onPress={() => this.actionView()}>
                <Text style={{ color: '#000', fontSize: 15 }}>View</Text>
              </TouchableOpacity>
            </View>
            {showEdit}
            {/* <View style={{ marginTop: 15, borderBottomWidth: 1 }}>
              <TouchableOpacity onPress={this.goToEdit}>
                <Text style={{ color: '#000', fontSize: 15 }}>Edit</Text>
              </TouchableOpacity>
            </View> */}
            {/* <View style={{ marginTop: 15, borderBottomWidth: 1 }}>
            <TouchableOpacity onPress={() => { this.setState({ isModalWantDelete: true, isModalOption: false }) }}>
              <Text style={{ color: '#000', fontSize: 15 }}>Delete</Text>
            </TouchableOpacity>
          </View> */}
            <View style={{ marginTop: 15, borderBottomWidth: 1 }}>
              <TouchableOpacity onPress={this.goToReopen}>
                <Text style={{ color: '#000', fontSize: 15 }}>Re-Open</Text>
              </TouchableOpacity>
            </View>
            {showAddToDppm}
          </View>
        </Modal>
      }
    } else if (this.state.userId != this.state.responderSend && this.state.dppmnumSend == null){
      if (this.state.StatusSend != 3) {
        showSelectOptionModal = <Modal
          isVisible={this.state.isModalOption}
          style={{ margin: 0 }}
          onBackdropPress={() => this.setState({ isModalOption: false })}
        >
          <View style={styles.viewmodalOption}>
            <View style={{ marginTop: 15, borderBottomWidth: 1 }}>
              <TouchableOpacity onPress={() => this.actionView()}>
                <Text style={{ color: '#000', fontSize: 15 }}>View</Text>
              </TouchableOpacity>
            </View>
            {showEdit}
            {showAddToDppm}

          </View>
        </Modal>
      } else {
        showSelectOptionModal = <Modal
          isVisible={this.state.isModalOption}
          style={{ margin: 0 }}
          onBackdropPress={() => this.setState({ isModalOption: false })}
        >
          <View style={styles.viewmodalOption}>
            <View style={{ marginTop: 15, borderBottomWidth: 1 }}>
              <TouchableOpacity onPress={() => this.actionView()}>
                <Text style={{ color: '#000', fontSize: 15 }}>View</Text>
              </TouchableOpacity>
            </View>
            {showEdit}
            {/* <View style={{ marginTop: 15, borderBottomWidth: 1 }}>
              <TouchableOpacity onPress={this.goToEdit}>
                <Text style={{ color: '#000', fontSize: 15 }}>Edit</Text>
              </TouchableOpacity>
            </View> */}
            {/* <View style={{ marginTop: 15, borderBottomWidth: 1 }}>
            <TouchableOpacity onPress={() => { this.setState({ isModalWantDelete: true, isModalOption: false }) }}>
              <Text style={{ color: '#000', fontSize: 15 }}>Delete</Text>
            </TouchableOpacity>
          </View> */}
            <View style={{ marginTop: 15, borderBottomWidth: 1 }}>
              <TouchableOpacity onPress={this.goToReopen}>
                <Text style={{ color: '#000', fontSize: 15 }}>Re-Open</Text>
              </TouchableOpacity>
            </View>
            {showAddToDppm}
          </View>
        </Modal>
      }
    }else{
      if (this.state.StatusSend != 3) {
        showSelectOptionModal = <Modal
          isVisible={this.state.isModalOption}
          style={{ margin: 0 }}
          onBackdropPress={() => this.setState({ isModalOption: false })}
        >
          <View style={styles.viewmodalOption}>
            <View style={{ marginTop: 15, borderBottomWidth: 1 }}>
              <TouchableOpacity onPress={() => this.actionView()}>
                <Text style={{ color: '#000', fontSize: 15 }}>View</Text>
              </TouchableOpacity>
            </View>
            {showEdit}
            {showAddToDppm}
          </View>
        </Modal>
      } else {
        showSelectOptionModal = <Modal
          isVisible={this.state.isModalOption}
          style={{ margin: 0 }}
          onBackdropPress={() => this.setState({ isModalOption: false })}
        >
          <View style={styles.viewmodalOption}>
            <View style={{ marginTop: 15, borderBottomWidth: 1 }}>
              <TouchableOpacity onPress={() => this.actionView()}>
                <Text style={{ color: '#000', fontSize: 15 }}>View</Text>
              </TouchableOpacity>
            </View>
            {/* <View style={{ marginTop: 15, borderBottomWidth: 1 }}>
              <TouchableOpacity onPress={this.goToEdit}>
                <Text style={{ color: '#000', fontSize: 15 }}>Edit</Text>
              </TouchableOpacity>
            </View> */}
            {/* <View style={{ marginTop: 15, borderBottomWidth: 1 }}>
            <TouchableOpacity onPress={() => { this.setState({ isModalWantDelete: true, isModalOption: false }) }}>
              <Text style={{ color: '#000', fontSize: 15 }}>Delete</Text>
            </TouchableOpacity>
          </View> */}
            <View style={{ marginTop: 15, borderBottomWidth: 1 }}>
              <TouchableOpacity onPress={this.goToReopen}>
                <Text style={{ color: '#000', fontSize: 15 }}>Re-Open</Text>
              </TouchableOpacity>
            </View>
            {/* <View style={{ marginTop: 15, borderBottomWidth: 1 }}>
              <TouchableOpacity onPress={this.goToDppm}>
                <Text style={{ color: '#000', fontSize: 15 }}>Add To DPPM</Text>
              </TouchableOpacity>
            </View> */}
            {showAddToDppm}
          </View>
        </Modal>
      }
    }

    
    const source = require('../TREND_User_Guide.pdf');
    
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ flex: 1, width: '100%', flexDirection: 'column'}}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor:'black' }}>
            <TouchableOpacity>
              <View>
                <Image source={Images.ic_logo} style={{ width: 190, height: 70 }} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ alignSelf: 'center', justifyContent: 'center', width: 40 }} onPress={() => this.actionSearch()}>
              <View>
                <Image source={Images.ic_search} style={{ width: 20, height: 20, tintColor:'#fff' }} />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 5 }}>
            <TopBarTechnical
              style={{ flex: 2 }}
              activeTab={1}
              activeTabColor={'#ebebeb'}
              onTab1Press={() => this.actionMyTechnicalScreen()}
              onTab2Press={() => this.actionAllTechnicalScreen()}
            />
          </View>

          <View style={{height : Dimensions.get('window').height * 0.67}}>
            {/* <Pdf
              source={source}
              onLoadComplete={(numberOfPages, filePath) => {
                console.log(`number of pages: ${numberOfPages}`);
              }}
              onPageChanged={(page, numberOfPages) => {
                console.log(`current page: ${page}`);
              }}
              onError={(error) => {
                console.log(error);
              }}
              onPressLink={(uri) => {
                console.log(`Link presse: ${uri}`)
              }}
              style={styles.pdf} /> */}
            
          {loaderData}
          {loadMore}
          </View>
          {showclose}
          {showmenu}
        </View>
        <Modal isVisible={this.state.isModalWantDelete}
          animationIn='bounceIn'
          animationOut='bounceOut'
        >
          <View style={styles.viewmodal}>
            <Text style={styles.textalertmodal}>Do You Want To Delete ?</Text>
            <View style={{ flexDirection: 'row', }}>
              <TouchableOpacity onPress={() => this.deleteItem(this.state.idData)} style={[styles.buttonmodalOK]}>
                <Text style={{ fontWeight: '200', color: '#fff' }}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.setState({ isModalOption: false, isModalWantDelete: false })} style={[styles.buttonmodalCancel]}>
                <Text style={{ fontWeight: '200', color: '#fff' }}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal isVisible={this.state.isModalDelete}
          animationIn='bounceIn'
          animationOut='bounceOut'
        >
          <View style={styles.viewmodal2}>
            <Text style={styles.textalertmodal}>Succes</Text>
            <TouchableOpacity onPress={() => this.toogleDoneDelete()} style={[styles.buttonmodalOK]}>
              <Text style={{ fontWeight: '200', color: '#fff' }}>ok</Text>
            </TouchableOpacity>
          </View>
        </Modal>
       {showSelectOptionModal}
        <Modal
          visible={this.state.pageViewProfile}
          style={{ justifyContent: 'flex-end', margin: 0 }}
          onBackdropPress={() => this.setState({ pageViewProfile: null, pageViewTR: null })}
        >
          <View style={styles.scrollableModal}>
            <View style={styles.scrollableModalContent}>
              <View style={{ padding: 15, flexDirection: 'row', width: '100%', justifyContent: 'space-around' }}>
                <View style={{ width: '33%', alignItems: 'center', alignSelf: 'center', padding: 8 }}>
                  <TouchableOpacity hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} >
                    <Image source={{uri : this.state.userImage}} style={{ borderRadius: 100, width: 40, height: 40, borderWidth: 2, borderColor: 'rgb(170, 207, 202)' }} />
                  </TouchableOpacity>
                </View>
                <View style={{ width: '33%', alignItems: 'center', alignSelf: 'center', marginTop: 5 }}>
                  <TouchableOpacity onPress={() => this.actionMyTiket()} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                    <View style={{ padding: 8, borderRadius: 100 }}>
                      <Image source={Images.ic_technical} style={{ width: 30, height: 30 }} />
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{ width: '33%', alignItems: 'center', alignSelf: 'center' }}>
                  <TouchableOpacity onPress={() => this.setState({ pageViewTR: true })} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                    <View style={{ borderRadius: 100, padding: 8, }}>
                      <Image source={Images.ic_edit} style={{ width: 30, height: 30 }} />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <ScrollView style={{ width: '100%', height: '120%', padding: 20, paddingBottom: 100 }}>
                {this.viewRenderModalProfil()}
                <View><Text></Text></View>
                <View><Text></Text></View>
              </ScrollView>
            </View>
          </View>
        </Modal>
        <Modal
          visible={this.state.pageViewTR}
          style={{ justifyContent: 'flex-end', margin: 0 }}
          onBackdropPress={() => this.setState({ pageViewTR: null, pageViewProfile: null })}
        >
          <View style={styles.scrollableModal}>
            <View style={styles.scrollableModalContent}>
              <View style={{ padding: 15, flexDirection: 'row', width: '100%', justifyContent: 'space-around' }}>
                <View style={{ padding: 10, width: '33%', alignSelf: 'center', alignItems: 'center' }}>
                  <TouchableOpacity onPress={() => this.actionProfile()} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} >
                    <Image source={{uri: this.state.userImage}} style={{ borderRadius: 100, width: 40, height: 40, borderWidth: 2 }} />
                  </TouchableOpacity>
                </View>
                <View style={{ padding: 10, width: '33%', alignSelf: 'center', alignItems: 'center' }}>
                  <TouchableOpacity onPress={() => this.actionMyTiket()} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                    <Image source={Images.ic_technical} style={{ width: 30, height: 30 }} />
                  </TouchableOpacity>
                </View>
                <View style={{ width: '33%', alignSelf: 'center', alignItems: 'center' }}>
                  <TouchableOpacity hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                    <View style={{ borderRadius: 100, backgroundColor: '#fff', padding: 8 }}>
                      <Image source={Images.ic_edit} style={{ width: 30, height: 30 }} />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <ScrollView style={{ width: '100%', height: '120%', padding: 20, paddingBottom: 100 }}>
                {this.viewRenderModalTR()}
              </ScrollView>
            </View>
          </View>
        </Modal>
        <Modal isVisible={this.state.isModalLogout}
          animationIn='bounceIn'
          animationOut='bounceOut'
        >
          <View style={styles.viewmodal}>
            <Text allowFontScaling={false} style={styles.textalertmodal}>Are You Sure ?</Text>
            <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 10 }}>
              <TouchableOpacity onPress={() => this.toogleOkLogout()} style={styles.buttonmodalOK}>
                <Text allowFontScaling={false} style={{ fontWeight: '200', color: '#fff' }}>Ok</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.toogleLogoutCancel()} style={styles.buttonmodalCancel}>
                <Text allowFontScaling={false} style={{ fontWeight: '200', color: '#fff' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal isVisible={this.state.isModalCloseApp}
                    animationIn='bounceIn'
                    animationOut='bounceOut'
                >
                    <View style={styles.viewmodal}>
                        <Text allowFontScaling={false} style={styles.textalertmodal}>Exit From TREND Application?</Text>
                        <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 10 }}>
                            <TouchableOpacity onPress={() => this.setState({isModalCloseApp : false})} style={[styles.buttonmodalOK,{marginHorizontal : 10}]}>
                                <Text allowFontScaling={false} style={{ fontWeight: '200', color: '#fff' }}>No</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() =>  BackHandler.exitApp()} style={styles.buttonmodalOK}>
                                <Text allowFontScaling={false} style={{ fontWeight: '200', color: '#fff' }}>Yes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

        <Modal isVisible={this.state.isModalTokenExpired}
          animationIn='bounceIn'
          animationOut='bounceOut'
        >
          <View style={styles.viewmodal}>
            <Text style={styles.textalertmodal}>Token Expired</Text>
            <TouchableOpacity onPress={() => this.toogleTokenExpired()} style={[styles.buttonmodalOK]}>
              <Text style={{ fontWeight: '200', color: '#fff' }}>Login</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Animated.View style={[styles.animatedView, { transform: [{ translateY: this.springValue }] }]}>
          <Text style={styles.exitTitleText}>press back again to exit the app</Text>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => BackHandler.exitApp()}
          >
            <Text style={styles.exitText}>Exit</Text>
          </TouchableOpacity>

        </Animated.View>
        {/* <ModalMenu {...this.props} /> */}
        
      </SafeAreaView>
    );
  }
}


const styles = StyleSheet.create({
  bottomModal1: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  scrollableModal1: {
    height: '50%',
    backgroundColor: "#FABA00",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  scrollableModalContent1: {
    height: '100%',
    width: '100%',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewmodal: {
    backgroundColor: '#fff',
    height: 110,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 10,
    // position: 'absolute',
    // right: 0
  },
   viewmodal: {
    backgroundColor: '#fff',
    height: 110,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 10,
    // position: 'absolute',
    // right: 0
  },
  viewmodalOption: {
    backgroundColor: '#fff',
    height: 200,
    width: '50%',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 10,
    // position: 'absolute',
    // right: 0
  },
  viewmodal2: {
    backgroundColor: '#fff',
    height: 120,
    width: '50%',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 10,
    // position: 'absolute',
    // right: 0

  },
  viewmodal2Delete: {
    backgroundColor: '#fff',
    height: 130,
    width: '70%',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 10,
    // position: 'absolute',
    // right: 0

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
    marginTop: 15,
    backgroundColor: '#FFCC00',
    shadowRadius: 20,
    color: '#fff'
  },
  buttonmodalCancel: {
    display: 'flex',
    marginLeft: 5,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: 100,
    marginTop: 15,
    padding: 5,
    backgroundColor: '#FFCC00',
    shadowRadius: 20,
    color: '#fff'
  },
  scrollableModal: {
    height: '50%',
    backgroundColor: "#FABA00",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  scrollableModalContent: {
    height: '100%',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomModal: {
    bottom: 0,
    position: 'absolute'
  },
  bpagetechnical: {
    height: 45, alignItems: 'flex-end', paddingRight: 5
  },
  textbpagetechnical: {
    fontSize: 17, color: 'black'
  },
  animatedView: {
    width,
    backgroundColor: "#FABA00",
    elevation: 2,
    position: "absolute",
    bottom: 0,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  exitTitleText: {
    textAlign: "center",
    color: "#ffffff",
    marginRight: 10,
  },
  exitText: {
    color: "#000",
    paddingHorizontal: 10,
    paddingVertical: 3
  },
  textInputStyle: {
    // marginLeft: 5,
    width: 300, 
    borderRadius: 10,
    backgroundColor: '#EBEBEB',
  },
  buttonmodalCancel: {
    display: 'flex',
    marginLeft: 5,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: 100,
    marginTop: 15,
    padding: 5,
    backgroundColor: '#FFCC00',
    shadowRadius: 20,
    color: '#fff'
  },
  textInputStyleWarranty: {
    // width: 200,
    paddingHorizontal: 5,
    // // paddingVertical:10,
    // paddingBottom:5,
    // height: 40,
    // marginTop:5,
    // width: 200,
    borderRadius: 10,
    // backgroundColor: '#EBEBEB',
    // shadowColor: "#808080",
    // shadowOffset: {
    //   width: 2,
    //   height: 2,
    // },
    // shadowOpacity: 2,
    // shadowRadius: 2.46,
    // elevation: 4,
    // marginTop: 50,
    // textAlignVertical: 'top'
  },
  cancelmenu: {
    backgroundColor: 'rgba(243,177,0,0.6)',
    borderRadius: 50,
    width: 25, height: 25,
    position: 'absolute',
    bottom: 60,
    justifyContent: 'center',alignSelf:'center',
    alignItems: 'center', borderWidth: 0.1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,

    elevation: 24,
  },

  RoundedMenu:{
    backgroundColor: 'rgba(243,177,0,0.6)', 
    borderRadius: 50, 
    width: 50, height: 50,
    position: 'absolute',
     bottom: 20, 
     right: 10, 
     justifyContent: 'center', 
     alignItems: 'center', borderWidth:0.1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,

    elevation: 24,
  },
  animatedMenu:{
    justifyContent:'center',
    alignItems:'center',
    // backgroundColor:'red',
    position:'absolute',
    bottom:1,
    // marginTop:-50
  },
  Card:{
    backgroundColor : 'white',
    borderRadius : 7,
    width : '100%',
    padding: 12,
    marginBottom : 10
  },
  CardTitle : {
    textAlign : 'center',
    fontSize : 14,
    marginVertical : 8
  },
  
  CardSeparator : {
    width : '100%',
    borderTopWidth: 0.2,
    borderColor: '#bdc3c7',
    marginVertical : 10,
  },

CardContent:{
  fontSize : 12,
  textAlign: 'center'
}
});