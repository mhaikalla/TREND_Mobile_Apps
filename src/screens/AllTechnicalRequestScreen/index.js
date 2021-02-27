

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
    TouchableHighlight,
    RefreshControl,
    Linking
} from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Images, API } from '@res';
import { ModalMenu, BottomBar } from '@component';
import AsyncStorage from '@react-native-community/async-storage';
import Modal from 'react-native-modal';
import { StackActions, NavigationActions } from 'react-navigation';
import { TopBarTechnical } from '@component';
import { Dropdown } from 'react-native-material-dropdown';
import DatePicker from 'react-native-datepicker';

let { width, height } = Dimensions.get('window');

export default class MyTechnicalScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            mtCategory: [],
            tokenData: '',
            userName: '',
            locationUser1: '',
            locationUser2: '',

            allTrList: [],
            allTrListData: [],

            myTrList: [],
            myTrListData: [],
            dataDetail: [],

            searchIcon: false,
            counterOption: 0,
            modalVisible: false,
            loadingData: false,
            loadingDataKosong: false,
            pageViewProfile: false,
            pageViewTR: false,
            isModalLogout: false,
            listPage: 1,
            listLimit: 15,
            showLoadMore: false,
            allowScroll: true,

            responderMytr: [],
            submiterMytr:[],

            responderAlltr: [],
            submiterAlltr: [],
            TmpDataAllTr:[],
            StartDate:'',
            EndDate:'',
            dropdownsort: true,
            showdate: false,
            showbottommenu: false,
            showroundemenu: true,
            closemenu: false,
            dropdownvalue: '',
            userId:0,
            roleId : -1,
            roleName : "",
            roleTextColor : "#11100E"        
        };
        BackHandler.addEventListener('hardwareBackPress', this._onBackPress)
    }

    componentWillMount() {
        // BackHandler.addEventListener('hardwareBackPress', this._onBackPress)
        // OneSignal.addEventListener('opened', this.onOpened);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this._onBackPress)
    }

    _onBackPress = () => {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'MyTechnicalScreen' })
            ]
        });
        this.props.navigation.dispatch(resetAction);
        return true;
        // this.props.navigation.navigate('MyTechnicalScreen')
    }

    _onLoadMore() {
        if (!this.onEndReachedCalledDuringMomentum) {
            var newPage = this.state.listPage + 1
            this.setState({ listPage: newPage })
            this.timeOut = setTimeout(() => {
                this.getAllTR(newPage)
            }, 1000)
            this.onEndReachedCalledDuringMomentum = true;
        }
    }

    async componentDidMount() {
        this.getToken();
        let roleId = parseInt(await AsyncStorage.getItem("@RoleId"))
        let roleName = await AsyncStorage.getItem("@RoleUser")
        let roleTextColor = (roleId <= 0 ? "#11100E" : (roleId >=2 ? "#A36307": "#006600"))
    
        this.setState({
          roleId,
          roleName,
          roleTextColor
        })
    
    }

    getToken = async () => {
        const mToken = await AsyncStorage.getItem('@token');
        const mUserName = await AsyncStorage.getItem('@userName');
        const mLocationUser1 = await AsyncStorage.getItem('@locationUser1');
        const mLocationUser2 = await AsyncStorage.getItem('@locationUser2');
        const mUserId = await AsyncStorage.getItem('@userid');
        const mUserImage = await AsyncStorage.getItem('@uriimage');
        const mUserRoleName =  await AsyncStorage.getItem('@RoleUser');

        const mdelegateId = await AsyncStorage.getItem('@isDelegate');
        const mdelegateTo_Name = await AsyncStorage.getItem('@delegateTo_Name');
        const mdelegateStart = await AsyncStorage.getItem('@delegateStart');
        const mdelegateEnd = await AsyncStorage.getItem('@delegateEnd');
        const mdelegateCreated = await AsyncStorage.getItem('@delegateCreated');
        const mdelegateStatus = await AsyncStorage.getItem('@delegateStatus');
        this.setState({
            tokenData: mToken,
            userName: mUserName,
            userId: mUserId,
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
        })
        this.getMyTR(this.state.listPage);
        if (this.state.tokenData != null || this.state.tokenData != '') {
            this.getAllTR(this.state.listPage);
        }
    }

    actionAllTechnicalScreen() {
        // const resetAction = StackActions.reset({
        //     index: 0,
        //     actions: [
        //         NavigationActions.navigate({ routeName: 'AllTechnicalScreen' })
        //     ]
        // });
        // this.props.navigation.dispatch(resetAction);
        this.props.navigation.navigate('AllTechnicalScreen')
    }

    actionMyTechnicalScreen() {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'MyTechnicalScreen' })
            ]
        });
        this.props.navigation.dispatch(resetAction);
        this.props.navigation.navigate('MyTechnicalScreen')
    }

    actionProfile() {
        this.setState({ pageViewProfile: true });
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

    actionTR() {
        this.setState({ pageViewTR: true });
    }

    getAllTR(page) {
        // console.log('limit', this.state.listLimit)
        // if (page > 1) {
        //     this.setState({ showLoadMore: true, allowScroll: false })
        // }
        fetch(API.getAllTR, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
                'AccessToken': this.state.tokenData,
            },
            body: JSON.stringify({
                PerPage: 2000,
                PageNum: page
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                // console.log(JSON.stringify(responseJson))
                if (responseJson.message.code === 200) {
                    let Data2 = responseJson.result
                    // for(var i = 0; i < Data2.length; i++){
                    //     // let Data3 =  responseJson.result[i].Responder;
                    //     // this.setState({ responderAlltr: Data3})
                    //     this.setState({
                    //         allTrListData : [
                    //             ...this.state.allTrListData, {
                    //                 CreatedAt : Data2[i].CreatedAt,
                    //                 TicketNo: Data2[i].TicketNo,
                    //                 Description: Data2[i].Description,
                    //                 TicketId: Data2[i].TicketId,
                    //                 TicketCategoryId: Data2[i].TicketCategoryId,
                    //                 Title: Data2[i].Title,
                    //                 SerialNumber: Data2[i].SerialNumber,
                    //                 PartCausingFailure: Data2[i].PartCausingFailure,
                    //                 EmailCC: Data2[i].EmailCC,
                    //                 SMU: Data2[i].SMU,
                    //                 Attachments: Data2[i].Attachments,
                    //                 Responder: Data2[i].Responder,
                    //                 Submiter : Data2[i].Submiter
                    //             }
                    //         ]
                    //     })
                    // }
                    const datafilter = Data2.filter(s => s.Status != 1 && s.ResponderName != null)
                    this.setState({
                        refreshing: false,
                        allTrListData: datafilter.sort((a, b) => b.RecentDate >= a.RecentDate),
                        // myTrListData: Data1.sort((a, b) => parseInt(b.TicketId) - parseInt(a.TicketId)),
                        TmpDataAllTr: datafilter,
                        loadingData: true,
                        showLoadMore: false,
                        allowScroll: true,
                       
                    });
                } else {
                    this.setState({ loadingDataKosong: true, loadingData: true, showLoadMore: false, allowScroll: true })
                }
                // this.allTrList()
            })
            .catch((error) => {
                console.log(error)
            });
    }

    getMyTR(page) {
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
            PerPage: 30,
            PageNum: page
          }),
        })
          .then((response) => response.json())
          .then((responseJson) => {
            if (responseJson.message.code === 200) {
              var Data1 = responseJson.result
              for(var i= 0; i < Data1.length; i++){
                let Data3 =  responseJson.result[i].Responder;
                let Data4 =  responseJson.result[i].Submiter;
                this.setState({ responderMytr: Data3, submiterMytr: Data4})
              }
            } else {
                console.log('failed to loading My TR')
            }
          })
          .catch((error) => {
            console.log(error)
          });
      }

    deleteItem(data) {
        // console.log(data)
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
            alert(JSON.stringify(responseJson))
            if (responseJson.message.code === 200) {
              this.setState({ isModalOption: false, isModalWantDelete: false, isModalDelete: true, myTrListData: [] })
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
            this.getAllTR();
        }, 100)
    }

    // getDetail() {
    //     fetch('https://apps.dipstrategy.com/trakindotsics/api/mobile/ticketdetail?ticketId=38', {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/x-www-form-urlencoded',
    //             'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
    //             'AccessToken': this.state.tokenData,
    //         },
    //     })
    //         .then((response) => response.json())
    //         .then((responseJson) => {
    //             let Data3 = responseJson.result
    //             this.setState({
    //                 dataDetail: Data3
    //             });
    //         })
    //         .catch((error) => {
    //             console.log(error)
    //         });
    // }

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

    actionPartstechnical() {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({
                    routeName: 'PartstechnicalScren', params: {
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
                NavigationActions.navigate({
                    routeName: 'WarrantyScreen', params: {
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

    actionHelp() {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({
                    routeName: 'HelpdeskScreen', params: {
                        ticketCatIdSend: 0,
                        trNoSend: ''
                    }})
            ]
        });
        this.props.navigation.dispatch(resetAction);
    }

    actionSearch(){
        // const resetAction = StackActions.reset({
        //     index: 0,
        //     actions: [
        //         NavigationActions.navigate({ routeName: 'SearchAllTR' })
        //     ]
        // });
        // this.props.navigation.dispatch(resetAction);
        this.props.navigation.navigate('SearchAllTR')
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

    goToOption(item) {
        // alert(JSON.stringify(item))
        this.setState({
            isModalOption: true,
            idData: item.TicketId,
            categoryidSend: item.TicketCategoryId,
            trNoSend: item.TicketNo,
            titleSend: item.Title,
            descSend: item.Description,
            submiterSend: item.Submiter,
            responderSend: item.Responder,
            snSend: item.SerialNumber,
            customerSend: item.Customer,
            locationSend: item.Location,
            makeSend: item.Make,
            deliverySend: item.DeliveDate,
            arrangementSend: item.ArrangementNo,
            familySend: item.Family,
            modelSend: item.Model,
            pcfSend: item.PartCausingFailure,
            pdSend: item.PartsDescription,
            emailSend: item.EmailCC,
            manuactureSend: item.Manufacture,
            pnSend: item.PartsNumber,
            ServiceSend: item.ServiceToolSN,
            engineSend: item.EngineSN,
            ecmSend: item.EcmSN,
            totalSend: item.TotalTattletale,
            reasonSend: item.ReasonCode,
            dignosticSend: item.DiagnosticClock,
            passwordSend: item.Password,
            sonSend: item.ServiceOrderNumber,
            claimSend: item.ClaimNumber,
            invoiceSend: item.InvoiceDate,
        });
    }

    goToEdit = () => {
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
    }

    goToReopen = () => {
        if (this.state.ticketCatIdSend == 9) {
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
        } else if (this.state.ticketCatIdSend == 8) {
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
        } else {
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

      
    
    actionView() {
        this.setState({ isModalOption: false });
        const resetAction = StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: 'ViewScreen', params: {
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

    actionPress(item){
        // console.log(item.SubmiterName)
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
        //         duedateSend:item.DueDateAnswer,
        //         nxtxomenter: item.NextCommenter,
        //         responderSend: item.Responder,
        //         escalatesend:item.IsEscalated,
        //         submiternamesend: item.SubmiterName,
        //         submiterratesend: item.SubmiterRating,
        //         responderratesend: item.ResponderRating,
        //         frompage: 2
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
                duedateSend:item.DueDateAnswer,
                nxtxomenter: item.NextCommenter,
                responderSend: item.Responder,
                escalatesend:item.IsEscalated,
                submiternamesend: item.SubmiterName,
                submiterratesend: item.SubmiterRating,
                responderratesend: item.ResponderRating,
                frompage: 2
        })
    }

    actionPress1(item){
        console.log("actionPress1")
        const resetAction = StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
                routeName: 'ViewScreen', params: {
                trNoSend: item.TicketNo,
                titleSend: item.Title,
                descSend: item.Description,
                ticketidSend: item.TicketId,
                ticketCatIdSend: item.TicketCategoryId,
                nxtxomenter: item.NextCommenter,
                duedateSend: item.DueDateAnswer,
                    escalatesend: item.IsEscalated,
                    submiternamesend: item.SubmiterName,
                    reopensend: 1

              }
              
            })
          ]
        });
        this.props.navigation.dispatch(resetAction);
    }

    goToPdfScreen() {
        Linking.canOpenURL('http://devapps.trakindo.co.id/Trend/Upload/TREND-User-Guide.pdf').then(supported => {
            if (supported) {
                Linking.openURL('http://devapps.trakindo.co.id/Trend/Upload/TREND-User-Guide.pdf');
            } else {
                console.log("Don't know how to open URI: " + this.props.url);
            }
        });
    }

    renderItem= (item) => {
        // console.log(item.Title + " " + item.SubmiterRating + " " + item.ResponderRating)
        let showStatus, statusbar, showRating;
        
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

        if(item.Status == 2)
        {
            if (item.DueDateAnswer > today){
                statusbar = <View style={{ height: 5, width: 100, backgroundColor: 'green', borderRadius: 5, alignSelf: 'center', marginTop: 5}}>
                </View>
            }else if (item.DueDateAnswer < today){
                statusbar = <View style={{ height: 5, width: 100, backgroundColor: 'red', borderRadius: 5, alignSelf: 'center', marginTop: 5}}>
                </View>
            } else if (item.DueDateAnswer == today){
                statusbar = <View style={{ height: 5, width: 100, backgroundColor: '#FAFA04', borderRadius: 5, alignSelf: 'center', marginTop: 5 }}>
                </View>
            }
        }
        // //var Difference_In_Time = duedate.getTime() - today.getTime();
        // var msDiff = new Date(duedate).getTime() - new Date().getTime(today);
        // var Difference_In_Days = Math.floor(msDiff / (1000 * 60 * 60 * 24)) + 1;
        // console.log(Difference_In_Days);

        if (item.Status == 1){
            //draft
            showStatus = <Text style={{ fontSize: 15, color: '#5B5B5B' }}>DRAFT</Text>
        } else if (item.Status == 2){
            if (item.IsEscalated) {
                if (item.NextCommenter == 0){
                    if (item.Responder == this.state.userId && item.Submiter == this.state.userId){
                        // escalate waiting your feed back
                        showStatus = <Text style={{ fontSize: 10, color: 'red' }}>Escalate - Waiting Your Feedback</Text>
                    }else{
                        // escalate pra
                        showStatus = <Text style={{ fontSize: 10, color: 'red' }}>Escalate - <Text style={{ fontSize: 10, color: '#5B5B5B' }}>PRA</Text></Text>
                    }
                }else{
                    if (this.state.userId == item.NextCommenter){
                        // escalate waiting your feed back
                        showStatus = <Text style={{ fontSize: 10, color: 'red' }}>Escalate - Waiting Your Feedback</Text>
                    }else{
                        if (item.NextCommenter == item.Responder){
                            // escalate pra
                            showStatus = <Text style={{ fontSize: 10, color: 'red' }}>Escalate - <Text style={{ fontSize: 10, color: '#5B5B5B' }}>PRA</Text></Text>
                        }else if (item.NextCommenter == item.Submiter){
                            // escalate psa 
                            showStatus = <Text style={{ fontSize: 10, color: 'red' }}>Escalate - <Text style={{ fontSize: 10, color: '#5B5B5B' }}>PSA</Text></Text>
                        }
                    }
                }
            }else{
                if (item.NextCommenter == 0){
                    if(item.Responder == this.state.userId && item.Submiter == this.state.userId){
                        // waiting your feedback
                        showStatus = <Text style={{ fontSize: 15, color: 'red' }}>Waiting Your Feedback</Text>
                    }else{
                       // PRA
                        showStatus = <Text style={{ fontSize: 15, color: '#5B5B5B' }}>PRA</Text>
                    }
                }else{
                    if(this.state.userId == item.NextCommenter){
                        // waiting your feed back
                        showStatus = <Text style={{ fontSize: 15, color: 'red' }}>Waiting Your Feedback</Text>
                    }else{
                        if (item.NextCommenter == item.Responder){
                            // pra
                            showStatus = <Text style={{ fontSize: 15, color: '#5B5B5B' }}>PRA</Text>
                        }else if (item.NextCommenter == item.Submiter){
                            //psa
                            showStatus = <Text style={{ fontSize: 15, color: '#5B5B5B' }}>PSA</Text>
                        }
                    }
                }
            }
        }else if (item.Status == 3){
            //closed
            showStatus = <Text style={{ fontSize: 15, color: 'red' }}>CLOSED</Text>
        }else if (item.Status == 6){
            // solved
            showStatus = <Text style={{ fontSize: 15, color: 'red' }}>SOLVED</Text>
        }
        
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
                <Text style={{ fontSize: 10, color: '#959595' }}>{kind === RENDER_RESPONDER_RATING  ? "Rate by Responder" : "Rate by Submitter"}</Text>
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
        }

        if(item.Submiter === this.state.submiterMytr  && item.Submiter === this.state.responderMytr){
            return(
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
            )
        } else {
            return(
                <View style={{ margin: 7 }}>
                    <View style={{ backgroundColor: "#fff", paddingHorizontal: 20, paddingVertical: 7, borderRadius: 20, borderColor: '#d9d2d2', borderWidth: 1, flexDirection: 'column' }}>
                    <Text style={{ fontSize: 10, color: '#959595' }}>{item.RecentDate.substring(0, 10)}  {item.RecentDate.substring(11, 19)}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                           
                            <TouchableOpacity style={{width: '85%'}} onPress={() => { this.actionPress1(item);  }}>
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
                                        <View style={{ width: '80%' }}>
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
            )
        }
    }

    DropdownSort = (value) => {
        if (value == 'Draft') {
            this.setState({
                // isModaldateSort:true,
                allTrListData: this.state.TmpDataAllTr.filter(s => s.Status == 1)
            })
        } else if (value == 'Submited') {
            this.setState({
                // isModaldateSort:true,
                allTrListData: this.state.TmpDataAllTr.filter(s => s.Status == 2)
            })
        } else if (value == 'Closed') {
            this.setState({
                // isModaldateSort:true,
                allTrListData: this.state.TmpDataAllTr.filter(s => s.Status == 3)
            })
        } else if (value == 'Reopen') {
            this.setState({
                // isModaldateSort:true,
                allTrListData: this.state.TmpDataAllTr.filter(s => s.Status == 4)
            })
        } else if (value == 'Deleted') {
            this.setState({
                // isModaldateSort:true,
                allTrListData: this.state.TmpDataAllTr.filter(s => s.Status == 5)
            })
        } else if (value == 'Date'){
            this.setState({
                // isModaldateSort:true,
                showdate:true,
                allTrListData: this.state.TmpDataAllTr
            })
        } else if (value == 'All') {
            this.setState({
                allTrListData: this.state.TmpDataAllTr
            })
        } else if (value == 'PSA') {
            this.setState({
                allTrListData: this.state.TmpDataAllTr.filter(s => s.NextCommenter == s.Submiter && this.state.userId != s.NextCommenter && s.Status == 2)
            })
        } else if (value == 'PRA') {
            this.setState({
                allTrListData: this.state.TmpDataAllTr.filter(s => s.NextCommenter != s.Submiter && s.NextCommenter != this.state.userId && s.Status == 2)
            })
        } else if (value == 'Waiting your feedback') {
            this.setState({
                allTrListData: this.state.TmpDataAllTr.filter(s => this.state.userId == s.NextCommenter && s.Status == 2)
            })
        } else if (value == 'Escalate') {
            this.setState({
                allTrListData: this.state.TmpDataAllTr.filter(s => s.IsEscalated == true && s.Status == 2)
            })
        } else if (value == 'Solved') {
            this.setState({
                allTrListData: this.state.TmpDataAllTr.filter(s => s.Status == 6)
            })
        }
    }

    DropdownSubmit() {

        if (this.state.dropdownvalue == '') {
            setTimeout(() => {
                this.componentDidMount();
            }, 200);
        } else {
            if (this.state.dropdownvalue == 'Draft') {
                this.setState({
                    // isModaldateSort:true,
                    allTrListData: this.state.TmpDataAllTr.filter(s => s.Status == 1)
                })
            } else if (this.state.dropdownvalue == 'Submited') {
                this.setState({
                    // isModaldateSort:true,
                    allTrListData: this.state.TmpDataAllTr.filter(s => s.Status == 2)
                })
            } else if (this.state.dropdownvalue == 'Closed') {
                this.setState({
                    // isModaldateSort:true,
                    allTrListData: this.state.TmpDataAllTr.filter(s => s.Status == 3)
                })
            } else if (this.state.dropdownvalue == 'Reopen') {
                this.setState({
                    // isModaldateSort:true,
                    allTrListData: this.state.TmpDataAllTr.filter(s => s.Status == 4)
                })
            } else if (this.state.dropdownvalue == 'Deleted') {
                this.setState({
                    // isModaldateSort:true,
                    allTrListData: this.state.TmpDataAllTr.filter(s => s.Status == 5)
                })
            } else if (this.state.dropdownvalue == 'Date') {
                this.setState({
                    showdate: true,
                    allTrListData: this.state.TmpDataAllTr
                })
            } else if (this.state.dropdownvalue == 'All') {
                setTimeout(() => {
                    this.componentDidMount();
                }, 200);
            } else {
                this.setState({
                    // isModaldateSort:true,
                    allTrListData: this.state.TmpDataAllTr.filter(s => s.Status == 6)
                })
            }
        }
    }
    selectedDate() {
        // console.log(this.state.EndDate)
        if (this.state.StartDate > this.state.EndDate) {
            alert('start date greater than')
        } else {
            if (this.state.StartDate != '' && this.state.EndDate != '') {
                var enddate = new Date(this.state.EndDate).getFullYear() + "-" + new Date(this.state.EndDate).getMonth() + 1 + "-" + new Date(this.state.EndDate).getDate();
                var startdate = new Date(this.state.StartDate).getFullYear() + "-" + new Date(this.state.StartDate).getMonth() + 1 + "-" + new Date(this.state.StartDate).getDate();
                var end = new Date(this.state.EndDate);
                var AddDate = new Date(end.setDate(end.getDate() + 1))
                var AddDate2 = new Date(AddDate).getFullYear() + "-" + new Date(AddDate).getMonth() + 1 + "-" + new Date(AddDate).getDate()


                setTimeout(() => {
                    this.setState({
                        allTrListData: this.state.TmpDataAllTr.filter(d => d.CreatedAt.substring(0, 10) >= this.state.StartDate && d.CreatedAt.substring(0, 10) <= this.state.EndDate)
                    })

                }, 100);
            } else {
                var enddate = new Date(this.state.EndDate).getFullYear() + "-" + new Date(this.state.EndDate).getMonth() + 1 + "-" + new Date(this.state.EndDate).getDate();
                var startdate = new Date(this.state.StartDate).getFullYear() + "-" + new Date(this.state.StartDate).getMonth() + 1 + "-" + new Date(this.state.StartDate).getDate();
                var end = new Date(this.state.EndDate);
                var AddDate = new Date(end.setDate(end.getDate() + 1))
                var AddDate2 = new Date(AddDate).getFullYear() + "-" + new Date(AddDate).getMonth() + 1 + "-" + new Date(AddDate).getDate()


                setTimeout(() => {
                    this.setState({
                        allTrListData: this.state.TmpDataAllTr.filter(d => d.CreatedAt.substring(0, 10) <= this.state.EndDate)
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
                    allTrListData: this.state.TmpDataAllTr.filter(d => d.CreatedAt.substring(0, 10) >= this.state.StartDate && d.CreatedAt.substring(0, 10) <= this.state.EndDate)
                })

            }, 100);
        } else {
            var enddate = new Date(this.state.EndDate).getFullYear() + "-" + new Date(this.state.EndDate).getMonth() + 1 + "-" + new Date(this.state.EndDate).getDate();
            var startdate = new Date(this.state.StartDate).getFullYear() + "-" + new Date(this.state.StartDate).getMonth() + 1 + "-" + new Date(this.state.StartDate).getDate();
            var end = new Date(this.state.EndDate);
            var AddDate = new Date(end.setDate(end.getDate() + 1))
            var AddDate2 = new Date(AddDate).getFullYear() + "-" + new Date(AddDate).getMonth() + 1 + "-" + new Date(AddDate).getDate()


            setTimeout(() => {
                this.setState({
                    allTrListData: this.state.TmpDataAllTr.filter(d => d.CreatedAt.substring(0, 10) == this.state.StartDate)
                })

            }, 100);
        }
    }

    goResetsort() {
        this.setState({
            StartDate: '',
            EndDate: '',
            allTrListData: this.state.TmpDataAllTr
        })
    }
    cancelSortDate() {

        this.setState({
            StartDate: '',
            EndDate: '',
            showdate: false,
            allTrListData: this.state.TmpDataAllTr
        })
    }
    openMenu() {
        this.setState({
            showroundemenu: false,
            closemenu: true
        })
    }
    goCloseMenu() {
        this.setState({
            showroundemenu: true,
            closemenu: false
        })
    }
    _onRefresh(){
        this.setState({
            refreshing: true,
            StartDate: '',
            EndDate: '',
        })
        this.getAllTR(1);
    }

    render() {
        let loaderData, loadMore, showsortdate, showmenu, showclose, showReOpen, showDelete, showEdit,showAddToDppm
            data = [
                {
                    value: 'All',
                }, {
                    value: 'Date',
                }, {
                    value: 'Closed'
                }, {
                    value: 'Reopen'
                }, {
                    value: 'PSA'
                }, {
                    value: 'PRA'
                }, {
                    value: 'Waiting your feedback'
                },{
                    value:'Escalate'
                },{
                    value:'Solved'
                }];

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

                if(this.state.StatusSend == 3)
                {
                showReOpen = <View style={{ marginTop: 15, borderBottomWidth: 1 }}>
                    {/* <TouchableOpacity onPress={() => { this.setState({ isModalOption: false }); this.props.navigation.navigate('ReopenScreen', { trNoSend: this.state.trNoSend, titleSend: this.state.titleSend, descSend: this.state.descSend }) }}> */}
                    <TouchableOpacity onPress={this.goToReopen}>
                        <Text style={{ color: '#000', fontSize: 15 }}>Re-Open</Text>
                    </TouchableOpacity>
                    </View>
                }
                else{
                showReOpen = <View></View>
                }

                if(this.state.StatusSend == 1)
                {
                    showDelete = <View style={{ marginTop: 15, borderBottomWidth: 1 }}>
                    {/* <TouchableOpacity onPress={() => { alert(this.state.idData); this.setState({ isModalWantDelete: true, isModalOption: false }) }}> */}
                    <TouchableOpacity onPress={() => { this.setState({ isModalWantDelete: true, isModalOption: false }) }}>
                        <Text style={{ color: '#000', fontSize: 15 }}>Delete</Text>
                    </TouchableOpacity>
                    </View>
                }
                else{
                    showDelete = <View></View>
                }

                if(this.state.responderSend == this.state.userId)
                {
                    showEdit=   <View style={{ marginTop: 15, borderBottomWidth: 1 }}>
                    {/* <TouchableOpacity onPress={() => this.setState({ isModalOption: false })}> */}
                    {/* <TouchableOpacity onPress={() => this.goToEdit()}> */}
                    <TouchableOpacity onPress={this.goToEdit}>
                        <Text style={{ color: '#000', fontSize: 15 }}>Edit</Text>
                    </TouchableOpacity>
                    </View>
                }
                else{
                    showEdit = <View></View>
                }
        if (this.state.showdate) {
            showsortdate = <View style={{ flexDirection: 'column' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 5, paddingHorizontal: 10 }}>
                    <DatePicker
                        // style={{ width: 200 }}
                        date={this.state.StartDate}
                        mode="date"
                        placeholder="Start Date"
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
                        onDateChange={(date) => { this.setState({ StartDate: date }), this.selectedDateStart() }}
                    />
                    <DatePicker
                        // style={{ width: 200 }}
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
                <View style={{ flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 50 }}>
                    <TouchableOpacity onPress={() => this.goResetsort()} style={{ marginLeft: 20 }}>
                        <Text style={{ color: '#000', fontSize: 15 }}>Reset</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.cancelSortDate()} style={{ marginLeft: 20 }}>
                        <Text style={{ color: '#000', fontSize: 15 }}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
            } else {
                showsortdate = <View style={{ marginBottom:5, marginHorizontal: 20 }}>
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
            loadMore = <View style={{ backgroundColor: "#FFF", justifyContent: "center", alignItems: "center", height: Dimensions.get('window').width / 5, width: Dimensions.get('window').width }}>
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
            loaderData = 
                <View style={{ flexDirection: 'column', paddingBottom: 20, flex: 1 }}>
                {showsortdate}
                <View style={{paddingBottom:20}}>
                    <FlatList
                        data={this.state.allTrListData}
                        numColumns={1}
                        removeClippedSubviews
                        scrollEnabled={this.state.allowScroll}
                        onEndReachedThreshold={0.5}
                        // onEndReached={() => this._onLoadMore()}
                        onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
                        renderItem={({ item }) =>
                            this.renderItem(item)
                        }
                        keyExtractor={(item, index) => index.toString()}
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

        if (this.state.closemenu) {
            showclose = <TouchableHighlight style={styles.cancelmenu} onPress={() => this.goCloseMenu()}>
                <View>
                    <Image source={Images.cancel} style={{ width: 15, height: 15 }} />
                </View>
            </TouchableHighlight>
        } else {
            showclose = <View></View>
        }

        if (this.state.showroundemenu) {
            showmenu =
                // <View style={{position:'absolute', bottom:10, right:10}}>
                <TouchableHighlight style={styles.RoundedMenu} onPress={() => this.openMenu()}>
                    <View>
                        <Image source={Images.menubottom} style={{ width: 20, height: 20 }} />
                    </View>
                </TouchableHighlight>
        } else {
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
                                <Image source={Images.ic_search} style={{ width: 20, height: 20, tintColor: '#fff' }} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 5 }}>
                        <TopBarTechnical
                            style={{ flex: 2 }}
                            activeTab={2}
                            activeTabColor={'#ebebeb'}
                            onTab1Press={() => this.actionMyTechnicalScreen()}
                            onTab2Press={() => this.actionAllTechnicalScreen()}
                        />
                    </View>
                    <View style={{height: Dimensions.get('window').height * 0.67}}>
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
                        <Text style={styles.textalertmodal}>Do You Want To Delete This TR?</Text>
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
                        <Text style={styles.textalertmodal}>Success</Text>
                        <TouchableOpacity onPress={() => this.toogleDoneDelete()} style={[styles.buttonmodalOK]}>
                        <Text style={{ fontWeight: '200', color: '#fff' }}>ok</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <Modal
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
                        {showDelete}
                        {showReOpen}
                        {showAddToDppm}
                    </View>
                </Modal>
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
                <Text allowFontScaling={false} style={styles.textalertmodal}>Are You Sure Logout Account? </Text>
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
                        <Text allowFontScaling={false} style={styles.textalertmodal}>Are You Sure Close Apps ?</Text>
                        <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 10 }}>
                            <TouchableOpacity onPress={() => this.toogleDoneClose()} style={styles.buttonmodalOK}>
                                <Text allowFontScaling={false} style={{ fontWeight: '200', color: '#fff' }}>Ok</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.toogleCloseCancel()} style={styles.buttonmodalCancel}>
                                <Text allowFontScaling={false} style={{ fontWeight: '200', color: '#fff' }}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* <Animated.View style={[styles.animatedView, { transform: [{ translateY: this.springValue }] }]}>
                    <Text style={styles.exitTitleText}>press back again to exit the app</Text>

                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => BackHandler.exitApp()}
                    >
                        <Text style={styles.exitText}>Exit</Text>
                    </TouchableOpacity>

                </Animated.View> */}
            </SafeAreaView>
        );
    }
}

const stylesTR = StyleSheet.create({
    tabTrActive: {
        borderColor: 'transparent',
        borderBottomColor: '#FABA00',
        borderWidth: 2,
        paddingVertical: 20,
        alignSelf: 'center',
        width: '50%',
        alignItems: 'center',
    },
    tabTr: {
        borderWidth: 2,
        borderRightColor: 'transparent',
        borderLeftColor: 'transparent',
        borderTopColor: 'transparent',
        borderBottomColor: '#959595',
        paddingVertical: 20,
        width: '50%',
        alignItems: 'center',
    }
});

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
    scrollableModalContent1: {
        height: '100%',
        width: '100%',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewmodal: {
        backgroundColor: '#fff',
        height: 120,
        width: '100%',
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
    RoundedMenu:{
        backgroundColor: 'rgba(243,177,0,0.6)',
        borderRadius: 50,
        width: 50, height: 50,
        position: 'absolute',
        bottom: 10,
        right: 10,
        justifyContent: 'center',
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
    cancelmenu: {
        backgroundColor: 'rgba(243,177,0,0.6)',
        borderRadius: 50,
        width: 25, height: 25,
        position: 'absolute',
        bottom: 60,
        justifyContent: 'center', alignSelf: 'center',
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

//