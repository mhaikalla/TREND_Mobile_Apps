import React, { Component } from 'react';
import { View, Text, BackHandler, SafeAreaView, Dimensions, FlatList, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert, Animated, TouchableHighlight } from 'react-native';
import { Images, API } from '@res';
import { Icon, } from 'native-base';
import { StackActions, NavigationActions } from 'react-navigation';
import Autocomplete from 'react-native-autocomplete-input';
import { ModalMenu, BottomBar } from '@component';
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-picker'
import ImageResizer from 'react-native-image-resizer'
import ImgToBase64 from 'react-native-image-base64'
import AsyncStorage from '@react-native-community/async-storage';
// import { Item } from 'react-native-paper/lib/typescript/src/components/List/List';

export default class ViewScreen extends React.Component {
    _interval = 0;
    constructor(props) {
        super(props);
        this.state = {
            discuss: [],
            textDiscus: '',
            textdiscussRate: '',
            ticketId: this.props.navigation.state.params.ticketidSend,
            usertoRate: 0,
            employeeName: '',
            employeeN: [],
            temporaryFileAttach: [],
            dataFileAttachement: [],
            textTag: '',
            query: '',
            query1: '',
            query2: '',
            show1: true,
            show2: false,
            show3: false,
            // isModalBerhasil: false,
            // isModalFormKosongDataSMU: false,
            // isModalFormKosongSN: false,
            // isModalFormKosongTitle: false,
            isModalLogout: false,
            responMessage: '',
            isLoadingSubmit: true,
            isLoadingSaveDraft: true,
            pageViewProfile: false,
            pageViewTR: false,
            isModalRating: false,
            isModalResponSubmitter: false,
            rating1: false,
            rating2: false,
            rating3: false,
            rating4: false,
            rating5: false,
            ratingValue: 0,
            data: [],
            childrenDiscuss: [],
            tokenData: '',
            userId: '',
            userName: '',
            locationUser1: '',
            locationUser2:'',
            isLoadingDiscuss: false,

            dataTicketno : '',
            dataTitle : '',
            dataSubmitter : 0,
            dataResponder : 0,
            employeeNameresponder: [],
            employeeNameparticipant: [],
            dataSerial : '',
            dataCustomer : '',
            dataLocation : '',
            dataMake : '',
            dataDelivery : '',
            dataArrangement : '',
            dataFamily : '',
            dataModel : '',
            dataSmu : '',
            dataDescription: '',
            dataPcf : '',
            dataPd : '',
            dataEmail : '',
            dataManufacture : '',
            dataPN : '',
            dataService : '',
            dataEngine : '',
            dataEcm : '',
            dataTotal : '',
            dataReason :  '',
            dataDiagnostic : '',
            dataPassword : '',
            DataSON : '',
            dataClaim : '',
            dataInvoice : '',
            dataWarranty : 0,
            dataTags : [],
            dataParticipants: [],
            dataAttch: [],
            SMUUpDate: '',
            branch: '',
            branchdeskription: '',

            showroundemenu:true,
            closemenu:false,
            roleId : -1,
            roleName : "",
            roleTextColor : "#11100E"  
        }
        BackHandler.addEventListener('hardwareBackPress', this._onBackPress)
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this._onBackPress)
        clearInterval(this._interval)
    }

    componentDidMount() {
        this.getToken();
        //  console.log(this.props.navigation.state.params.ticketCatIdSend)
    }

    getToken = async () => {
        const mToken = await AsyncStorage.getItem('@token');
        const mUserId = await AsyncStorage.getItem('@userid');
        const mUserName = await AsyncStorage.getItem('@userName'); 
        const mLocationUser1 = await AsyncStorage.getItem('@locationUser1'); 
        const mLocationUser2 = await AsyncStorage.getItem('@locationUser2');
        const mUserRoleName =  await AsyncStorage.getItem('@RoleUser');

        const mdelegateId = await AsyncStorage.getItem('@isDelegate');
        const mdelegateTo_Name = await AsyncStorage.getItem('@delegateTo_Name');
        const mdelegateStart = await AsyncStorage.getItem('@delegateStart');
        const mdelegateEnd = await AsyncStorage.getItem('@delegateEnd');
        const mdelegateCreated = await AsyncStorage.getItem('@delegateCreated');
        const mdelegateStatus = await AsyncStorage.getItem('@delegateStatus');
        let roleId = parseInt(await AsyncStorage.getItem("@RoleId"))
        let roleName = await AsyncStorage.getItem("@RoleUser")
        let roleTextColor = (roleId <= 0 ? "#11100E" : (roleId >=2 ? "#A36307": "#006600"))

        this.setState({
            roleId,
            roleName,
            roleTextColor,
            userRole : mUserRoleName ,
		  
            delegateId : mdelegateId,
            delegateTo_Name : mdelegateTo_Name,
            delegateStart: mdelegateStart,
            delegateEnd : mdelegateEnd,
            delegateCreated  : mdelegateCreated ,
            delegateStatus : mdelegateStatus 
        }) 
        // console.log(mUserId)
        if (mToken != null || mToken != '') {
            this.setState({ tokenData: mToken, userId: mUserId, userName: mUserName, locationUser1: mLocationUser1, locationUser2: mLocationUser2 })
            // this.getDataDiscuss();
            this.getTiketDetail()
        }
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
    }

    actionProfile() {
        // alert('ini')
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



  getTiketDetail() {
    console.log(API.getTiketDetail + this.props.navigation.state.params.ticketidSend)
    this.setState({ loadingData: false })
    fetch(API.getTiketDetail + this.props.navigation.state.params.ticketidSend, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
        'AccessToken': this.state.tokenData,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.message.code === 200) {
          // console.log(JSON.stringify(responseJson))
          var Data1 = responseJson.result
          this.setState({
            dataTicketno : Data1.TicketNo,
            dataTitle : Data1.Title,
            dataSubmitter : Data1.Submiter,
            dataResponder : Data1.Responder,
            dataSerial : Data1.SerialNumber,
            dataCustomer : Data1.Customer,
            dataLocation : Data1.Location,
            dataMake : Data1.Make,
            dataDelivery : Data1.DeliveryDate,
            dataArrangement : Data1.ArrangementNo,
            dataFamily : Data1.Family,
            dataModel : Data1.Model,
            dataSmu : Data1.SMU,
            dataDescription: Data1.Description,
            dataPcf : Data1.PartCausingFailure,
            dataPd : Data1.PartsDescription,
            dataEmail : Data1.EmailCC,
            dataManufacture : Data1.Manufacture,
            dataPN : Data1.PartsNumber,
            dataService : Data1.ServiceToolSN,
            dataEngine : Data1.EngineSN,
            dataEcm : Data1.EcmSN,
            dataTotal : Data1.TotalTattletale,
            dataReason :  Data1.ReasonCode,
            dataDiagnostic : Data1.DiagnosticClock,
            dataPassword : Data1.Password,
            DataSON : Data1.ServiceOrderNumber,
            dataClaim : Data1.ClaimNumber,
            datIanvoice : Data1.InvoiceDate,
            dataWarranty : Data1.WarrantyTypeId,
            dataTags : Data1.Tags,
            dataParticipants: Data1.Participants,
            dataAttch: Data1.Attachments,
          });
          console.log('ini responder ' + this.state.dataResponder)
          console.log('ini submiter ' + this.state.dataSubmitter)
          this.getDataMEP(this.state.dataSerial)
          // this.getemployeeName(this.state.dataResponder)
          this.getEmployeeParticipant()
        } else {
          this.setState({ loadingData: true, loadingDataKosong: true })
        }

      })
      .catch((error) => {
        console.log(error)
      });
  }

  getDataMEP(data) {
    fetch(API.getDataEMP + data, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
        'AccessToken': this.state.tokenData,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        var Data1 = responseJson.result
        this.setState({
          // custumer: Data1.CustomerName,
          // location: Data1.ShipToAddress,
          // make: Data1.Make,
          // delivery: Data1.DeliveryDate,
          // arrangement: Data1.ArrNumber,
          // family: Data1.PT,
          // family: Data1.PTDescription,
          // model: Data1.EngineModel,
          // SMU: Data1.SMU,
          SMUUpDate: Data1.SMUUpDate,
          branch: Data1.SalesOffice,
          branchdeskription: Data1.SalesOfficeDescription
        })
      })
      .catch((error) => {
        console.log(error)
      });
  }

  getEmployeeParticipant(data){
    // console.log(data)
    fetch(API.getName, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
        'AccessToken': this.state.tokenData,
      },
      body: JSON.stringify(this.state.dataParticipants),
    })
      .then((response) => response.json())
      .then((responseJson) => {
      var Data1= responseJson.data
      if (responseJson.status.code === 200) {
        this.setState({ employeeNameparticipant : Data1 })
      }
      })
      .catch((error) => {
        console.log(error)
      });
  } 

    actionTR() {
        this.setState({ pageViewTR: true });
    }

    actionShow1() {
        this.setState({ show1: true, show2: false, show3: false })
    }

    actionShow1false() {
        this.setState({ show1: false })
    }

    actionShow2() {
        this.setState({ show2: true, show1: false, show3: false })
    }

    actionShow2false() {
        this.setState({ show2: false })
    }

    actionDiscuss() {
        if (this.state.textDiscus.length >= 1) {
            this.setState({ discuss: [...this.state.discuss, { text: this.state.textDiscus }], textDiscus: '' })
        }
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

    actionProduk() {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'ProductScreen' })
            ]
        });
        this.props.navigation.dispatch(resetAction);
    }

    actionPartstechnical() {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'PartstechnicalScreen' })
            ]
        });
        this.props.navigation.dispatch(resetAction);
    }

    actionDimension() {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'DimensionScreen' })
            ]
        });
        this.props.navigation.dispatch(resetAction);
    }

    actionReferences() {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'ReferencesScreen' })
            ]
        });
        this.props.navigation.dispatch(resetAction);
    }

    actionGoodwill() {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'GoodwillScreen' })
            ]
        });
        this.props.navigation.dispatch(resetAction);
    }

    actionWarranty() {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'WarrantyScreen' })
            ]
        });
        this.props.navigation.dispatch(resetAction);
    }

    actionPassword() {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'PasswordScreen' })
            ]
        });
        this.props.navigation.dispatch(resetAction);
    }

    actionTelematics() {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'TelematicsScreen' })
            ]
        });
        this.props.navigation.dispatch(resetAction);
    }

    actionCondition() {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'ConditionScreen' })
            ]
        });
        this.props.navigation.dispatch(resetAction);
    }

    actionHelp() {
      const resetAction = StackActions.reset({
          index: 0,
          actions: [
              NavigationActions.navigate({ routeName: 'HelpdeskScreen' })
          ]
      });
      this.props.navigation.dispatch(resetAction);
  }

    openMenu(){
      this.setState({
        showroundemenu: false,
        closemenu:true
      })
    }
    goCloseMenu(){
      setTimeout(() => {
        this.setState({
          showroundemenu: true,
          closemenu: false
        })
      }, 100);
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

    render() {
        let viewShow1, viewShow2, ratingPertama, ratingKedua, ratingKetiga, ratingKeempat, ratingKelima, showComment, showResponder, showTags, showImage, showParticipants, showWarranty, showTicketno, showTitle, showSubmitter, showSerial, showCustomer, showLocation, showMake, showDelivery, showArrangement, showFamily, showModel, showSmu, showDescription, showPcf, showPd, showEmail, showManufacture, showPn, showService, showEngine, showEcm, showTotal, showReason, showDiagnostic, showPassword, showSon, showClaim, showInvoice, showClose, showMenu, showBranch, showSmuupdate;

        if (this.state.closemenu){
          showClose = <TouchableHighlight style={styles.cancelmenu} onPress={() => this.goCloseMenu()}>
            <View>
              <Image source={Images.cancel} style={{ width: 15, height: 15 }} />
            </View>
          </TouchableHighlight>
        }else{
          showClose = <View></View>
        }
    
        if (this.state.showroundemenu){
          showMenu = 
            <TouchableHighlight style={styles.RoundedMenu} onPress={() => this.openMenu()}>
              <View>
                <Image source={Images.menubottom} style={{ width: 20, height: 20 }} />
              </View>
          </TouchableHighlight>
        }else{
          showMenu =
            <BottomBar
              activeTab={2}
              activeTabColor={'white'}
              onTab1Press={() => this.actionProfile()}
              onTab2Press={() => this.actionMyTiket()}
              onTab3Press={() => this.actionTR()}
            />
        }

        if(this.state.dataTags != '' && this.state.dataTags != null ){
          showTags = <View style={{ marginRight: 20 }}>
            {this.state.dataTags.map((item, id) => {
              return(
                <View style={{ flexDirection: 'row', backgroundColor: '#959595', padding: 5, borderRadius: 10, alignSelf: 'flex-start', alignItems: 'center', marginTop: 10 }}>
                  <Text style={styles.textTag}>{item.Name}</Text>
                </View>
              )
            })}
          </View>  
        } else {
          showTags = <View style={{ padding: 5, marginLeft: 20, marginTop: 10 }}>
            <Text style={{ color: '#D7D7D7', alignItems: 'center', }}>There's No Tags</Text>
        </View>
        }

        if(this.state.dataParticipants != null ){
          showParticipants = <View style={{ marginRight: 20 }}>
            {this.state.employeeNameparticipant.map((item, id) => {
              return(
                <View style={{ flexDirection: 'row', backgroundColor: '#959595', padding: 5, borderRadius: 10, alignSelf: 'flex-start', alignItems: 'center', marginTop: 10 }}>
                  <Text style={styles.textTag}>{item.Name}</Text>
                </View>
              )
            })}
            </View> 
        } else {
          showParticipants = <View style={{ padding: 5, marginLeft: 10, marginTop: 10 }}>
            <Text style={{ color: '#D7D7D7', alignItems: 'center', alignSelf: 'center' }}>There's No Participants</Text>
        </View>
        }

        if(this.state.dataAttch != '' && this.state.dataAttch != null ){
          showImage = <View style={{ flexDirection: 'row', marginTop: 10 }}>
          {this.state.dataAttch.map((item, id) => {
            return (
                  <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                    <Image source={this.actionFile(item.Name)} style={{ width: 220, height: 220, borderRadius: 5 }} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center', width: 120, marginTop: 10 }}>
                        <Text>Image{id + 1}.jpg</Text>
                    </View>
                  </View>
                  )
          })}
          </View> 
        } else {
          showImage = <View style={{ padding: 5, marginLeft: 10, marginTop: 10 }}>
            <Text style={{ color: '#D7D7D7', alignItems: 'center', alignSelf: 'center' }}>There's No Attachment</Text>
        </View>
        }

        if (this.state.dataResponder.length != 0){
          showResponder = <View>
          {this.state.employeeNameresponder.map((item) => {
            return (
                      <Text style={styles.textBold}>{item.Name}</Text> 
                   )
          })}
          </View>
        } else {
          showResponder = <Text style={{ color: 'black', alignItems: 'center', alignSelf: 'center' }}>-</Text>
        }

        if (this.state.dataWarranty != 0 && this.state.dataWarranty != null ){
          showWarranty = <Text style={styles.textBold}>{this.state.dataWarranty}</Text> 
        } else {
          showWarranty = <Text style={{ color: 'black', alignItems: 'center', alignSelf: 'center' }}>-</Text>
        }

        if (this.state.dataTicketno != '' && this.state.dataTicketno != null ){
          showTicketno = <Text style={styles.textBold}>{this.state.dataTicketno}</Text> 
        } else {
          showTicketno = <Text style={{ color: 'black', alignItems: 'center', alignSelf: 'center' }}>-</Text>
        }

        if (this.state.dataTitle != '' && this.state.dataTitle != null ){
          showTitle = <Text style={styles.textBold}>{this.state.dataTitle}</Text> 
        } else {
          showTitle = <Text style={{ color: 'black', alignItems: 'center', alignSelf: 'center' }}>-</Text>
        }

        if (this.state.dataSubmitter != '' && this.state.dataSubmitter != null ){
          showSubmitter = <Text style={styles.textBold}>{this.state.dataSubmitter}</Text> 
        } else {
          showSubmitter = <Text style={{ color: 'black', alignItems: 'center', alignSelf: 'center' }}>-</Text>
        }

        if (this.state.dataSerial != '' && this.state.dataSerial != null ){
          showSerial = <Text style={styles.textBold}>{this.state.dataSerial}</Text> 
        } else {
          showSerial = <Text style={{ color: 'black', alignItems: 'center', alignSelf: 'center' }}>-</Text>
        }

        if (this.state.dataCustomer != '' && this.state.dataCustomer != null ){
          showCustomer = <Text style={styles.textBold}>{this.state.dataCustomer}</Text> 
        } else {
          showCustomer = <Text style={{ color: 'black', alignItems: 'center', alignSelf: 'center' }}>-</Text>
        }

        if (this.state.dataLocation != '' && this.state.dataLocation != null ){
          showLocation = <Text style={styles.textBold}>{this.state.dataLocation}</Text> 
        } else {
          showLocation = <Text style={{ color: 'black', alignItems: 'center', alignSelf: 'center' }}>-</Text>
        }

        if (this.state.dataMake != '' && this.state.dataMake != null ){
          showMake = <Text style={styles.textBold}>{this.state.dataMake}</Text> 
        } else {
          showMake = <Text style={{ color: 'black', alignItems: 'center', alignSelf: 'center' }}>-</Text>
        }

        if (this.state.dataDelivery != '' && this.state.dataDelivery != null ){
          showDelivery = <Text style={styles.textBold}>{this.state.dataDelivery}</Text> 
        } else {
          showDelivery = <Text style={{ color: 'black', alignItems: 'center', alignSelf: 'center' }}>-</Text>
        }

        if (this.state.dataArrangement != '' && this.state.dataArrangement != null ){
          showArrangement = <Text style={styles.textBold}>{this.state.dataArrangement}</Text> 
        } else {
          showArrangement = <Text style={{ color: 'black', alignItems: 'center', alignSelf: 'center' }}>-</Text>
        }

        if (this.state.dataFamily != '' && this.state.dataFamily != null ){
          showFamily = <Text style={styles.textBold}>{this.state.dataFamily}</Text> 
        } else {
          showFamily = <Text style={{ color: 'black', alignItems: 'center', alignSelf: 'center' }}>-</Text>
        }

        if (this.state.dataModel != '' && this.state.dataModel != null ){
          showModel = <Text style={styles.textBold}>{this.state.dataModel}</Text> 
        } else {
          showModel = <Text style={{ color: 'black', alignItems: 'center', alignSelf: 'center' }}>-</Text>
        }

        if (this.state.dataSmu != '' && this.state.dataSmu != null ){
          showSmu = <Text style={styles.textBold}>{this.state.dataSmu}</Text> 
        } else {
          showSmu = <Text style={{ color: 'black', alignItems: 'center', alignSelf: 'center' }}>-</Text>
        }

        if (this.state.dataDescription != '' && this.state.dataDescription != null ){
          showDescription = <Text style={styles.textBold}>{this.state.dataDescription}</Text> 
        } else {
          showDescription = <Text style={{ color: 'black', alignItems: 'center', alignSelf: 'center' }}>-</Text>
        }

        if (this.state.dataPcf != '' && this.state.datPcf != null ){
          showPcf = <Text style={styles.textBold}>{this.state.dataPcf}</Text> 
        } else {
          showPcf = <Text style={{ color: 'black', alignItems: 'center', alignSelf: 'center' }}>-</Text>
        }

        if (this.state.dataPd != '' && this.state.dataPd != null ){
          showPd = <Text style={styles.textBold}>{this.state.dataPd}</Text> 
        } else {
          showPd = <Text style={{ color: 'black', alignItems: 'center', alignSelf: 'center' }}>-</Text>
        }

        if (this.state.dataEmail != '' && this.state.dataEmail != null ){
          showEmail = <Text style={styles.textBold}>{this.state.dataEmail}</Text> 
        } else {
          showEmail = <Text style={{ color: 'black', alignItems: 'center', alignSelf: 'center' }}>-</Text>
        }

        if (this.state.dataManufacture != '' && this.state.dataManufacture != null ){
          showManufacture = <Text style={styles.textBold}>{this.state.dataManufacture}</Text> 
        } else {
          showManufacture = <Text style={{ color: 'black', alignItems: 'center', alignSelf: 'center' }}>-</Text>
        }

        if (this.state.dataPN != '' && this.state.dataPN != null ){
          showPn = <Text style={styles.textBold}>{this.state.dataPN}</Text> 
        } else {
          showPn = <Text style={{ color: 'black', alignItems: 'center', alignSelf: 'center' }}>-</Text>
        }

        if (this.state.dataService != '' && this.state.dataService != null ){
          showService = <Text style={styles.textBold}>{this.state.dataService}</Text> 
        } else {
          showService = <Text style={{ color: 'black', alignItems: 'center', alignSelf: 'center' }}>-</Text>
        }

        if (this.state.dataService != '' && this.state.dataService != null ){
          showService = <Text style={styles.textBold}>{this.state.dataService}</Text> 
        } else {
          showService = <Text style={{ color: 'black', alignItems: 'center', alignSelf: 'center' }}>-</Text>
        } 
        
        if (this.state.dataEngine != '' && this.state.dataEngine != null ){
          showEngine = <Text style={styles.textBold}>{this.state.dataEngine}</Text> 
        } else {
          showEngine = <Text style={{ color: 'black', alignItems: 'center', alignSelf: 'center' }}>-</Text>
        }
        
        if (this.state.dataEcm != '' && this.state.dataEcm != null ){
          showEcm = <Text style={styles.textBold}>{this.state.dataEcm}</Text> 
        } else {
          showEcm = <Text style={{ color: 'black', alignItems: 'center', alignSelf: 'center' }}>-</Text>
        }   

        if (this.state.dataTotal != '' && this.state.dataTotal != null ){
          showTotal = <Text style={styles.textBold}>{this.state.dataTotal}</Text> 
        } else {
          showTotal = <Text style={{ color: 'black', alignItems: 'center', alignSelf: 'center' }}>-</Text>
        }   

        if (this.state.dataReason != '' && this.state.dataReason != null ){
          showReason = <Text style={styles.textBold}>{this.state.dataReason}</Text> 
        } else {
          showReason = <Text style={{ color: 'black', alignItems: 'center', alignSelf: 'center' }}>-</Text>
        }   

        if (this.state.dataDiagnostic != '' && this.state.dataDiagnostic != null ){
          showDiagnostic = <Text style={styles.textBold}>{this.state.dataDiagnostic}</Text> 
        } else {
          showDiagnostic = <Text style={{ color: 'black', alignItems: 'center', alignSelf: 'center' }}>-</Text>
        }   

        if (this.state.dataPassword != '' && this.state.dataPassword != null ){
          showPassword = <Text style={styles.textBold}>{this.state.dataPassword}</Text> 
        } else {
          showPassword = <Text style={{ color: 'black', alignItems: 'center', alignSelf: 'center' }}>-</Text>
        }   

        if (this.state.dataSON != '' && this.state.dataSON != null ){
          showSon = <Text style={styles.textBold}>{this.state.dataSON}</Text> 
        } else {
          showSon = <Text style={{ color: 'black', alignItems: 'center', alignSelf: 'center' }}>-</Text>
        } 

        if (this.state.dataClaim != '' && this.state.dataClaim != null ){
          showClaim = <Text style={styles.textBold}>{this.state.dataClaim}</Text> 
        } else {
          showClaim = <Text style={{ color: 'black', alignItems: 'center', alignSelf: 'center' }}>-</Text>
        } 

        if (this.state.dataInvoice != '' && this.state.dataInvoice != null ){
          showInvoice = <Text style={styles.textBold}>{this.state.dataInvoice}</Text> 
        } else {
          showInvoice = <Text style={{ color: 'black', alignItems: 'center', alignSelf: 'center' }}>-</Text>
        } 

        if (this.state.branch != '' && this.state.branch != null ){
          showBranch = <Text style={styles.textBold}>{this.state.branch},{this.state.branchdeskription}</Text>
        } else {
          showBranch = <Text style={{ color: 'black', alignItems: 'center', alignSelf: 'center' }}>-</Text>
        } 

        if (this.state.SMUUpDate != '' && this.state.SMUUpDate != null ){
          showBranch = <Text style={styles.textBold}>{this.state.SMUUpdate}</Text>
        } else {
          showBranch = <Text style={{ color: 'black', alignItems: 'center', alignSelf: 'center' }}>-</Text>
        } 


        if (this.state.rating1 === false) {
            ratingPertama = <TouchableOpacity onPress={() => this.setState({ rating1: true, ratingValue: 1 })}>
                <Image source={Images.ratingKosong} style={{ width: 30, height: 30 }} />
            </TouchableOpacity>
        } else if (this.state.rating2 === false) {
            ratingPertama = <TouchableOpacity onPress={() => this.setState({ rating1: false })}>
                <Image source={Images.ratingFull} style={{ width: 30, height: 30 }} />
            </TouchableOpacity>
        } else {
            ratingPertama = <TouchableOpacity onPress={() => this.setState({ rating1: true, rating2: false, rating3: false, rating4: false, rating5: false })}>
                <Image source={Images.ratingFull} style={{ width: 30, height: 30 }} />
            </TouchableOpacity>
        }

        if (this.state.rating2 === false) {
            ratingKedua = <TouchableOpacity onPress={() => this.setState({ rating1: true, rating2: true, ratingValue: 2 })}>
                <Image source={Images.ratingKosong} style={{ width: 30, height: 30, marginLeft: 5 }} />
            </TouchableOpacity>
        } else if (this.state.rating3 === false) {
            ratingKedua = <TouchableOpacity onPress={() => this.setState({ rating2: false })}>
                <Image source={Images.ratingFull} style={{ width: 30, height: 30, marginLeft: 5 }} />
            </TouchableOpacity>
        } else {
            ratingKedua = <TouchableOpacity onPress={() => this.setState({ rating2: true, rating3: false, rating4: false, rating5: false, ratingValue: 2 })}>
                <Image source={Images.ratingFull} style={{ width: 30, height: 30, marginLeft: 5 }} />
            </TouchableOpacity>
        }

        if (this.state.rating3 === false) {
            ratingKetiga = <TouchableOpacity onPress={() => this.setState({ rating1: true, rating2: true, rating3: true, ratingValue: 3 })}>
                <Image source={Images.ratingKosong} style={{ width: 30, height: 30, marginLeft: 5 }} />
            </TouchableOpacity>
        } else if (this.state.rating4 === false) {
            ratingKetiga = <TouchableOpacity onPress={() => this.setState({ rating3: false })}>
                <Image source={Images.ratingFull} style={{ width: 30, height: 30, marginLeft: 5 }} />
            </TouchableOpacity>
        } else {
            ratingKetiga = <TouchableOpacity onPress={() => this.setState({ rating3: true, rating4: false, rating5: false, ratingValue: 3 })}>
                <Image source={Images.ratingFull} style={{ width: 30, height: 30, marginLeft: 5 }} />
            </TouchableOpacity>
        }

        if (this.state.rating4 === false) {
            ratingKeempat = <TouchableOpacity onPress={() => this.setState({ rating4: true, rating1: true, rating2: true, rating3: true, ratingValue: 4 })}>
                <Image source={Images.ratingKosong} style={{ width: 30, height: 30, marginLeft: 5 }} />
            </TouchableOpacity>
        } else if (this.state.rating5 === false) {
            ratingKeempat = <TouchableOpacity onPress={() => this.setState({ rating4: false })}>
                <Image source={Images.ratingFull} style={{ width: 30, height: 30, marginLeft: 5 }} />
            </TouchableOpacity>
        } else {
            ratingKeempat = <TouchableOpacity onPress={() => this.setState({ rating5: false, ratingValue: 4 })}>
                <Image source={Images.ratingFull} style={{ width: 30, height: 30, marginLeft: 5 }} />
            </TouchableOpacity>
        }

        if (this.state.rating5 === false) {
            ratingKelima = <TouchableOpacity onPress={() => this.setState({ rating5: true, rating1: true, rating2: true, rating3: true, rating4: true, ratingValue: 5 })}>
                <Image source={Images.ratingKosong} style={{ width: 30, height: 30, marginLeft: 5 }} />
            </TouchableOpacity>
        } else {
            ratingKelima = <TouchableOpacity onPress={() => this.setState({ rating5: false })}>
                <Image source={Images.ratingFull} style={{ width: 30, height: 30, marginLeft: 5 }} />
            </TouchableOpacity>
        }

        if (this.state.userId == this.state.dataSubmitter && this.state.userId != this.state.dataResponder ) {
          if ( this.state.rating1 === true || this.state.rating2 === true || this.state.rating3 === true ){
            if (this.state.rating4 === false && this.state.rating5 === false) {
              showComment = <View style={{ width: '100%', marginTop: 10, padding: 10 }}>
                  <TextInput
                      style={styles.textInputStyleRating}
                      placeholder="Type a message"
                      defaultValue={this.state.textDiscus}
                      multiline={true}
                      allowFontScaling={false}
                      numberOfLines={5}
                      onChangeText={(text) => this.setState({ textdiscussRate: text })}
                  />
                </View>
            }
          }
        } else if ( this.state.userId == this.state.dataResponder && this.state.userId != this.state.dataSubmitter ) {
            if ( this.state.rating1 === true || this.state.rating2 === true || this.state.rating3 === true ){
              if (this.state.rating4 === false && this.state.rating5 === false) {
                showComment = <View style={{ width: '100%', marginTop: 10, padding: 10 }}>
                    <TextInput
                        style={styles.textInputStyleRating}
                        placeholder="Type a message"
                        defaultValue={this.state.textDiscus}
                        multiline={true}
                        allowFontScaling={false}
                        numberOfLines={5}
                        onChangeText={(text) => this.setState({ textdiscussRate: text })}
                    />
                  </View>
              }
            }
        }

        if (this.state.show1 === false && this.props.navigation.state.params.ticketCatIdSend == 1) { 
            viewShow1 = <TouchableOpacity onPress={() => this.actionShow1()}>
              <View style={styles.collapseheader}>
                <View style={{ flexDirection: 'column' }}>
                  <Text style={styles.textheader}>Technical Request </Text>
                  <Text style={styles.subtextheader}>Product Health</Text>
                </View>
                <Image source={Images.arrowDown} style={styles.imageArrow} tintColor={"white"} />
              </View>
            </TouchableOpacity>
          } else if (this.state.show1 === true && this.props.navigation.state.params.ticketCatIdSend == 1) {
            viewShow1 = <View>
              <TouchableOpacity onPress={() => this.actionShow1false()}>
                <View style={styles.collapseheader}>
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={styles.textheader}>Technical Request </Text>
                    <Text style={styles.subtextheader}>Product Health</Text>
                  </View>
                  <Image source={Images.arrowUp} style={styles.imageArrow} tintColor={"white"} />
                </View>
              </TouchableOpacity>
              <View style={{ backgroundColor: 'white' }}>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Title</Text>
                    {showTitle}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Unit Serial Number</Text>
                    {showSerial}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'row', width: '100%' }}>
                    <View style={{ width: '20%' }}>
                      <Text style={styles.textall}>TR NO</Text>
                    </View>
                    <View style={{ width: '5%' }}>
                      <Text style={styles.textall}>:</Text>
                    </View>
                    <View style={{  marginLeft: 20, marginRight: 20 }}>
                        {showTicketno}
                    </View>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Customer</Text>
                    {showCustomer}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Location</Text>
                    {showLocation}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Make</Text>
                    {showMake}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Delivery Date</Text>
                    {showDelivery}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Arrangement No</Text>
                    {showArrangement}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Family</Text>
                    {showFamily}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Model</Text>
                    {showModel}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>SMU</Text>
                    {showSmu}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Part Causing Failure</Text>
                    {showPcf}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Problem Description</Text>
                    {showDescription}
                  </View>
                </View>  
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>Responder</Text>
                        {/* {this.getemployeeName(this.state.dataResponder)} */}
                        {showResponder} 
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                    <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>Participant</Text>
                        {/* {this.getEmployeeParticipant(this.state.dataParticipants)} */}
                        {showParticipants}
                    </View>
                </View>   
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                   <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Email CC</Text>
                    {showEmail}
                  </View>
                </View>  
                <View>
                    <View>
                        <Text style={[styles.textall, { marginTop: 20, marginLeft: 30, marginRight: 20 }]}>Attachments</Text>
                    </View>
                    <View style={{ padding: 10 }}>
                        <View style={{ borderRadius: 5, borderWidth: 1, padding: 10, borderColor: '#D7E0F1' }}>
                            <ScrollView horizontal={true}>
                                {showImage}
                            </ScrollView>
                        </View>
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                   <View style={{ flexDirection: 'column', width: '100%' }}>
                      <Text style={styles.textall}>Tags</Text>
                      {showTags}
                  </View>
                </View>  
              </View>
            </View>
          }
      
          if (this.state.show1 === false && this.props.navigation.state.params.ticketCatIdSend == 2) {
            viewShow1 = <TouchableOpacity onPress={() => this.actionShow1()}>
              <View style={styles.collapseheader}>
                <View style={{ flexDirection: 'column' }}>
                  <Text style={styles.textheader}>Technical Request </Text>
                  <Text style={styles.subtextheader}>Parts Technical</Text>
                </View>
                <Image source={Images.arrowDown} style={styles.imageArrow} tintColor={"white"} />
              </View>
            </TouchableOpacity>
          } else if (this.state.show1 === true && this.props.navigation.state.params.ticketCatIdSend == 2) {
            viewShow1 = <View>
              <TouchableOpacity onPress={() => this.actionShow1false()}>
                <View style={styles.collapseheader}>
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={styles.textheader}>Technical Request </Text>
                    <Text style={styles.subtextheader}>Parts Technical</Text>
                  </View>
                  <Image source={Images.arrowUp} style={styles.imageArrow} tintColor={"white"} />
                </View>
              </TouchableOpacity>
              <View style={{ backgroundColor: 'white' }}>
              <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Title</Text>
                    {showTitle}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'row', width: '100%' }}>
                    <View style={{ width: '20%' }}>
                      <Text style={styles.textall}>TR Type</Text>
                    </View>
                    <View style={{ width: '5%' }}>
                      <Text style={styles.textall}>:</Text>
                    </View>
                    <View style={{ width: '75%' }}>
                      <Text style={{ color: '#D7D7D7' }}>Parts Technical</Text>
                    </View>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'row', width: '100%' }}>
                    <View style={{ width: '20%' }}>
                      <Text style={styles.textall}>TR NO</Text>
                    </View>
                    <View style={{ width: '5%' }}>
                      <Text style={styles.textall}>:</Text>
                    </View>
                    <View style={{  marginLeft: 20, marginRight: 20 }}>
                        {showTicketno}
                    </View>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Unit Serial Number</Text>
                    {showSerial}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Manufacture</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        {showManufacture}
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Arrangement No</Text>
                    {showArrangement}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Family</Text>
                    {showFamily}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Model</Text>
                    {showModel}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>SMU</Text>
                    {showSmu}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Parts Number</Text>
                    {showPn}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Parts Description</Text>
                    {showPd}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Request Description</Text>
                    {showDescription}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>Responder</Text>
                        {showResponder} 
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                    <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>Participant</Text>
                        {showParticipants}
                    </View>
                </View>   
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                   <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Email CC</Text>
                    {showEmail}
                  </View>
                </View>  
                <View>
                    <View>
                        <Text style={[styles.textall, { marginTop: 20, marginLeft: 30, marginRight: 20 }]}>Attachments</Text>
                    </View>
                    <View style={{ padding: 10 }}>
                        <View style={{ borderRadius: 5, borderWidth: 1, padding: 10, borderColor: '#D7E0F1' }}>
                            <ScrollView horizontal={true}>
                                {showImage}
                            </ScrollView>
                        </View>
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                   <View style={{ flexDirection: 'column', width: '100%' }}>
                      <Text style={styles.textall}>Tags</Text>
                      {showTags}
                  </View>
                </View>
              </View>
            </View>
          }
      
          if (this.state.show1 === false && this.props.navigation.state.params.ticketCatIdSend == 3) {
            viewShow1 = <TouchableOpacity onPress={() => this.actionShow1()}>
              <View style={styles.collapseheader}>
                <View style={{ flexDirection: 'column' }}>
                  <Text style={styles.textheader}>Technical Request </Text>
                  <Text style={styles.subtextheader}>Dimension</Text>
                </View>
                <Image source={Images.arrowDown} style={styles.imageArrow} tintColor={"white"} />
              </View>
            </TouchableOpacity>
          } else if (this.state.show1 === true && this.props.navigation.state.params.ticketCatIdSend == 3) {
            viewShow1 = <View>
              <TouchableOpacity onPress={() => this.actionShow1false()}>
                <View style={styles.collapseheader}>
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={styles.textheader}>Technical Request </Text>
                    <Text style={styles.subtextheader}>Dimension</Text>
                  </View>
                  <Image source={Images.arrowUp} style={styles.imageArrow} tintColor={"white"} />
                </View>
              </TouchableOpacity>
              <View style={{ backgroundColor: 'white' }}>
              <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Title</Text>
                    {showTitle}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'row', width: '100%' }}>
                    <View style={{ width: '20%' }}>
                      <Text style={styles.textall}>TR NO</Text>
                    </View>
                    <View style={{ width: '5%' }}>
                      <Text style={styles.textall}>:</Text>
                    </View>
                    <View style={{ width: '75%' }}>
                      {showTicketno}
                    </View>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                    <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>Manufacture</Text>
                        {showManufacture}
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                    <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>Part Number</Text>
                        {showPn}
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                    <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>Part Description</Text>
                        {showPd}
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                    <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>Request Description</Text>
                        {showDescription}
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>Responder</Text>
                        {showResponder} 
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                    <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>Participant</Text>
                        {showParticipants}
                    </View>
                </View>   
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                   <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Email CC</Text>
                    {showEmail}
                  </View>
                </View>  
                <View>
                    <View>
                        <Text style={[styles.textall, { marginTop: 20, marginLeft: 30, marginRight: 20 }]}>Attachments</Text>
                    </View>
                    <View style={{ padding: 10 }}>
                        <View style={{ borderRadius: 5, borderWidth: 1, padding: 10, borderColor: '#D7E0F1' }}>
                            <ScrollView horizontal={true}>
                                {showImage}
                            </ScrollView>
                        </View>
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                   <View style={{ flexDirection: 'column', width: '100%' }}>
                      <Text style={styles.textall}>Tags</Text>
                      {showTags}
                  </View>
                </View>
              </View>
            </View>
          }
      
          if (this.state.show1 === false && this.props.navigation.state.params.ticketCatIdSend == 4) {
            viewShow1 = <TouchableOpacity onPress={() => this.actionShow1()}>
              <View style={styles.collapseheader}>
                <View style={{ flexDirection: 'column' }}>
                  <Text style={styles.textheader}>Technical Request </Text>
                  <Text style={styles.subtextheader}>References</Text>
                </View>
                <Image source={Images.arrowDown} style={styles.imageArrow} tintColor={"white"} />
              </View>
            </TouchableOpacity>
          } else if (this.state.show1 === true && this.props.navigation.state.params.ticketCatIdSend == 4) {
            viewShow1 = <View>
              <TouchableOpacity onPress={() => this.actionShow1false()}>
                <View style={styles.collapseheader}>
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={styles.textheader}>Technical Request </Text>
                    <Text style={styles.subtextheader}>References</Text>
                  </View>
                  <Image source={Images.arrowUp} style={styles.imageArrow} tintColor={"white"} />
                </View>
              </TouchableOpacity>
              <View style={{ backgroundColor: 'white' }}>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'row', width: '100%' }}>
                    <View style={{ width: '20%' }}>
                      <Text style={styles.textall}>TR NO</Text>
                    </View>
                    <View style={{ width: '5%' }}>
                      <Text style={styles.textall}>:</Text>
                    </View>
                    <View style={{ width: '75%' }}>
                      {showTicketno}
                    </View>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'row', width: '100%' }}>
                    <View style={{ width: '20%' }}>
                      <Text style={styles.textall}>TR Type</Text>
                    </View>
                    <View style={{ width: '5%' }}>
                      <Text style={styles.textall}>:</Text>
                    </View>
                    <View style={{ width: '75%' }}>
                      <Text style={{ color: '#D7D7D7' }}>References</Text>
                    </View>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Title</Text>
                    {showTitle}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Description</Text>
                    {showDescription}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Unit Serial Number</Text>
                    {showSerial}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Customer</Text>
                    {showCustomer}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Location</Text>
                    {showLocation}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Branch</Text>
                    {showBranch}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Make</Text>
                    {showMake}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Delvery Date</Text>
                    {showDelivery}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Location</Text>
                    {showLocation}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Arrangement No</Text>
                    {showArrangement}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Family</Text>
                    {showFamily}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Model</Text>
                    {showModel}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>SMU Update</Text>
                    {showSmuupdate}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>Responder</Text>
                        {showResponder} 
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                    <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>Participant</Text>
                        {showParticipants}
                    </View>
                </View>   
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                   <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Email CC</Text>
                    {showEmail}
                  </View>
                </View>  
                <View>
                    <View>
                        <Text style={[styles.textall, { marginTop: 20, marginLeft: 30, marginRight: 20 }]}>Attachments</Text>
                    </View>
                    <View style={{ padding: 10 }}>
                        <View style={{ borderRadius: 5, borderWidth: 1, padding: 10, borderColor: '#D7E0F1' }}>
                            <ScrollView horizontal={true}>
                                {showImage}
                            </ScrollView>
                        </View>
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                   <View style={{ flexDirection: 'column', width: '100%' }}>
                      <Text style={styles.textall}>Tags</Text>
                      {showTags}
                  </View>
                </View>
              </View>
            </View>
          }
      
          if (this.state.show1 === false && this.props.navigation.state.params.ticketCatIdSend == 5 ) {
            viewShow1 = <TouchableOpacity onPress={() => this.actionShow1()}>
              <View style={styles.collapseheader}>
                <View style={{ flexDirection: 'column' }}>
                  <Text style={styles.textheader}>Technical Request </Text>
                  <Text style={styles.subtextheader}>Warranty References</Text>
                </View>
                <Image source={Images.arrowDown} style={styles.imageArrow} tintColor={"white"} />
              </View>
            </TouchableOpacity>
          } else if (this.state.show1 === true && this.props.navigation.state.params.ticketCatIdSend == 5) {
            viewShow1 = <View>
              <TouchableOpacity onPress={() => this.actionShow1false()}>
                <View style={styles.collapseheader}>
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={styles.textheader}>Technical Request</Text>
                    <Text style={styles.subtextheader}>Warranty References</Text>
                  </View>
                  <Image source={Images.arrowUp} style={styles.imageArrow} tintColor={"white"} />
                </View>
              </TouchableOpacity>
              <View style={{ backgroundColor: 'white' }}>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Title</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        {showTitle}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>TR Type</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        {showWarranty}
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'row', width: '100%' }}>
                    <View style={{ width: '20%' }}>
                      <Text style={styles.textall}>TR NO</Text>
                    </View>
                    <View style={{ width: '5%' }}>
                      <Text style={styles.textall}>:</Text>
                    </View>
                    <View style={{ width: '75%' }}>
                      {showTicketno}
                    </View>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Customer</Text>
                    {showCustomer}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Service Order Number</Text>
                    {showSon}
                  </View>
                </View>
                 <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Claim Number</Text>
                    {showClaim}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Unit Serial Number</Text>
                    {showSerial}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Make</Text>
                    {showMake}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Delivery Date</Text>
                    {showDelivery}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Invoice Date</Text>
                    {showInvoice}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Model</Text>
                    {showModel}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>SMU</Text>
                    {showSmu}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Part Causing Failure</Text>
                    {showPcf}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Parts Description</Text>
                    {showPd}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Problem Description</Text>
                    {showDescription}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>Responder</Text>
                        {showResponder} 
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                    <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>Participant</Text>
                        {showParticipants}
                    </View>
                </View>   
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                   <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Email CC</Text>
                    {showEmail}
                  </View>
                </View>  
                <View>
                    <View>
                        <Text style={[styles.textall, { marginTop: 20, marginLeft: 30, marginRight: 20 }]}>Attachments</Text>
                    </View>
                    <View style={{ padding: 10 }}>
                        <View style={{ borderRadius: 5, borderWidth: 1, padding: 10, borderColor: '#D7E0F1' }}>
                            <ScrollView horizontal={true}>
                                {showImage}
                            </ScrollView>
                        </View>
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                   <View style={{ flexDirection: 'column', width: '100%' }}>
                      <Text style={styles.textall}>Tags</Text>
                      {showTags}
                  </View>
                </View>
              </View>
            </View>
          }
      
          if (this.state.show1 === false && this.props.navigation.state.params.ticketCatIdSend == 6) {
            viewShow1 = <TouchableOpacity onPress={() => this.actionShow1()}>
              <View style={styles.collapseheader}>
                <View style={{ flexDirection: 'column' }}>
                  <Text style={styles.textheader}>Technical Request </Text>
                  <Text style={styles.subtextheader}>Goodwill References</Text>
                </View>
                <Image source={Images.arrowDown} style={styles.imageArrow} tintColor={"white"} />
              </View>
            </TouchableOpacity>
          } else if (this.state.show1 === true && this.props.navigation.state.params.ticketCatIdSend == 6) {
            viewShow1 = <View>
              <TouchableOpacity onPress={() => this.actionShow1false()}>
                <View style={styles.collapseheader}>
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={styles.textheader}>Technical Request </Text>
                    <Text style={styles.subtextheader}>Goodwill References</Text>
                  </View>
                  <Image source={Images.arrowUp} style={styles.imageArrow} tintColor={"white"} />
                </View>
              </TouchableOpacity>
              <View style={{ backgroundColor: 'white' }}>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Title</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        {showTitle}
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'row', width: '100%' }}>
                    <View style={{ width: '20%' }}>
                      <Text style={styles.textall}>TR Type</Text>
                    </View>
                    <View style={{ width: '5%' }}>
                      <Text style={styles.textall}>:</Text>
                    </View>
                    <View style={{ width: '75%' }}>
                      <Text style={{ color: '#D7D7D7' }}>Goodwill References</Text>
                    </View>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'row', width: '100%' }}>
                    <View style={{ width: '20%' }}>
                      <Text style={styles.textall}>TR NO</Text>
                    </View>
                    <View style={{ width: '5%' }}>
                      <Text style={styles.textall}>:</Text>
                    </View>
                    <View style={{ width: '75%' }}>
                      {showTicketno}
                    </View>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Customer</Text>
                    {showCustomer}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Service Order Number</Text>
                    {showSon}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Claim Number</Text>
                    {showClaim}
                  </View>
                </View>
                
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Unit Serial Number</Text>
                    {showSerial}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Make</Text>
                    {showMake}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Delivery Date</Text>
                    {showDelivery}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Invoice Date</Text>
                    {showInvoice}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Model</Text>
                    {showModel}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>SMU</Text>
                    {showSmu}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Part Causing Failure</Text>
                    {showPcf}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Parts Description</Text>
                    {showPd}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>Responder</Text>
                        {showResponder} 
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                    <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>Participant</Text>
                        {showParticipants}
                    </View>
                </View>   
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                   <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Email CC</Text>
                    {showEmail}
                  </View>
                </View>  
                <View>
                    <View>
                        <Text style={[styles.textall, { marginTop: 20, marginLeft: 30, marginRight: 20 }]}>Attachments</Text>
                    </View>
                    <View style={{ padding: 10 }}>
                        <View style={{ borderRadius: 5, borderWidth: 1, padding: 10, borderColor: '#D7E0F1' }}>
                            <ScrollView horizontal={true}>
                                {showImage}
                            </ScrollView>
                        </View>
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                   <View style={{ flexDirection: 'column', width: '100%' }}>
                      <Text style={styles.textall}>Tags</Text>
                      {showTags}
                  </View>
                </View>
              </View>
            </View>
          }
      
          if (this.state.show1 === false && this.props.navigation.state.params.ticketCatIdSend == 8) { 
            viewShow1 = <TouchableOpacity onPress={() => this.actionShow1()}>
              <View style={styles.collapseheader}>
                <View style={{ flexDirection: 'column' }}>
                  <Text style={styles.textheader}>Technical Request </Text>
                  <Text style={styles.subtextheader}>Telematics</Text>
                </View>
                <Image source={Images.arrowDown} style={styles.imageArrow} tintColor={"white"} />
              </View>
            </TouchableOpacity>
          } else if (this.state.show1 === true && this.props.navigation.state.params.ticketCatIdSend == 8) { 
            viewShow1 = <View>
              <TouchableOpacity onPress={() => this.actionShow1false()}>
                <View style={styles.collapseheader}>
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={styles.textheader}>Technical Request </Text>
                    <Text style={styles.subtextheader}>Telematics</Text>
                  </View>
                  <Image source={Images.arrowUp} style={styles.imageArrow} tintColor={"white"} />
                </View>
              </TouchableOpacity>
              <View style={{ backgroundColor: 'white' }}>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'row', width: '100%' }}>
                    <View style={{ width: '20%' }}>
                      <Text style={styles.textall}>TR NO</Text>
                    </View>
                    <View style={{ width: '5%' }}>
                      <Text style={styles.textall}>:</Text>
                    </View>
                    <View style={{ width: '75%' }}>
                      {showTicketno}
                    </View>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'row', width: '100%' }}>
                    <View style={{ width: '20%' }}>
                      <Text style={styles.textall}>TR Type</Text>
                    </View>
                    <View style={{ width: '5%' }}>
                      <Text style={styles.textall}>:</Text>
                    </View>
                    <View style={{ width: '75%' }}>
                      <Text style={{ color: '#D7D7D7' }}>Telematics</Text>
                    </View>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>Password</Text>
                        {showPassword} 
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>Responder</Text>
                        {showResponder} 
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                    <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>Participant</Text>
                        {showParticipants}
                    </View>
                </View>   
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                   <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Email CC</Text>
                    {showEmail}
                  </View>
                </View>  
                <View>
                    <View>
                        <Text style={[styles.textall, { marginTop: 20, marginLeft: 30, marginRight: 20 }]}>Attachments</Text>
                    </View>
                    <View style={{ padding: 10 }}>
                        <View style={{ borderRadius: 5, borderWidth: 1, padding: 10, borderColor: '#D7E0F1' }}>
                            <ScrollView horizontal={true}>
                                {showImage}
                            </ScrollView>
                        </View>
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                   <View style={{ flexDirection: 'column', width: '100%' }}>
                      <Text style={styles.textall}>Tags</Text>
                      {showTags}
                  </View>
                </View>
              </View>
            </View>
          }
      
          if (this.state.show1 === false && this.props.navigation.state.params.ticketCatIdSend == 7) { 
            viewShow1 = <TouchableOpacity onPress={() => this.actionShow1()}>
              <View style={styles.collapseheader}>
                <View style={{ flexDirection: 'column' }}>
                  <Text style={styles.textheader}>Technical Request </Text>
                  <Text style={styles.subtextheader}>Password</Text>
                </View>
                <Image source={Images.arrowDown} style={styles.imageArrow} tintColor={"white"} />
              </View>
            </TouchableOpacity>
          } else if (this.state.show1 === true && this.props.navigation.state.params.ticketCatIdSend == 7) { 
            viewShow1 = <View>
              <TouchableOpacity onPress={() => this.actionShow1false()}>
                <View style={styles.collapseheader}>
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={styles.textheader}>Technical Request </Text>
                    <Text style={styles.subtextheader}>Password</Text>
                  </View>
                  <Image source={Images.arrowUp} style={styles.imageArrow} tintColor={"white"} />
                </View>
              </TouchableOpacity>
              <View style={{ backgroundColor: 'white' }}>
              <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>Title</Text>
                        {showTitle} 
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'row', width: '100%' }}>
                    <View style={{ width: '20%' }}>
                      <Text style={styles.textall}>TR Type</Text>
                    </View>
                    <View style={{ width: '5%' }}>
                      <Text style={styles.textall}>:</Text>
                    </View>
                    <View style={{ width: '75%' }}>
                      <Text style={{ color: '#D7D7D7' }}>Password</Text>
                    </View>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'row', width: '100%' }}>
                    <View style={{ width: '20%' }}>
                      <Text style={styles.textall}>TR NO</Text>
                    </View>
                    <View style={{ width: '5%' }}>
                      <Text style={styles.textall}>:</Text>
                    </View>
                    <View style={{ width: '75%' }}>
                      {showTicketno}
                    </View>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>Manufacture</Text>
                        {showManufacture} 
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>Unit Serial Number</Text>
                        {showSerial} 
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>Service Tool S/N</Text>
                        {showService} 
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>Engine S/N</Text>
                        {showEngine} 
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>ECM S/N</Text>
                        {showEcm} 
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>Total Tattletale</Text>
                        {showTotal} 
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>Reason Code</Text>
                        {showReason} 
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>Diagnostic Clock</Text>
                        {showDiagnostic} 
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>Request Description</Text>
                        {showDescription} 
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>Responder</Text>
                        {showResponder} 
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                    <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>Participant</Text>
                        {showParticipants}
                    </View>
                </View>   
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                   <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Email CC</Text>
                    {showEmail}
                  </View>
                </View>  
                <View>
                    <View>
                        <Text style={[styles.textall, { marginTop: 20, marginLeft: 30, marginRight: 20 }]}>Attachments</Text>
                    </View>
                    <View style={{ padding: 10 }}>
                        <View style={{ borderRadius: 5, borderWidth: 1, padding: 10, borderColor: '#D7E0F1' }}>
                            <ScrollView horizontal={true}>
                                {showImage}
                            </ScrollView>
                        </View>
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                   <View style={{ flexDirection: 'column', width: '100%' }}>
                      <Text style={styles.textall}>Tags</Text>
                      {showTags}
                  </View>
                </View>
              </View>
            </View>
          }

          if (this.state.show1 === false && this.props.navigation.state.params.ticketCatIdSend == 10) {
            viewShow1 = <TouchableOpacity onPress={() => this.actionShow1()}>
              <View style={styles.collapseheader}>
                <View style={{ flexDirection: 'column' }}>
                  <Text style={styles.textheader}>Technical Request </Text>
                  <Text style={styles.subtextheader}>Condiiton Monitoring</Text>
                </View>
                <Image source={Images.arrowDown} style={styles.imageArrow} tintColor={"white"} />
              </View>
            </TouchableOpacity>
          } else if (this.state.show1 === true && this.props.navigation.state.params.ticketCatIdSend == 10) {
            viewShow1 = <View>
              <TouchableOpacity onPress={() => this.actionShow1false()}>
                <View style={styles.collapseheader}>
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={styles.textheader}>Technical Request </Text>
                    <Text style={styles.subtextheader}>Condition Monitoring</Text>
                  </View>
                  <Image source={Images.arrowUp} style={styles.imageArrow} tintColor={"white"} />
                </View>
              </TouchableOpacity>
              <View style={{ backgroundColor: 'white' }}>          
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'row', width: '100%' }}>
                    <View style={{ width: '20%' }}>
                      <Text style={styles.textall}>TR NO</Text>
                    </View>
                    <View style={{ width: '5%' }}>
                      <Text style={styles.textall}>:</Text>
                    </View>
                    <View style={{ width: '75%' }}>
                      <Text style={{ color: '#D7D7D7' }}>{this.state.dataTicketno}</Text>
                    </View>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'row', width: '100%' }}>
                    <View style={{ width: '20%' }}>
                      <Text style={styles.textall}>TR Type</Text>
                    </View>
                    <View style={{ width: '5%' }}>
                      <Text style={styles.textall}>:</Text>
                    </View>
                    <View style={{ width: '75%' }}>
                      <Text style={{ color: '#D7D7D7' }}>Condition Monitoring</Text>
                    </View>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Title</Text>
                  </View>
                  <TextInput
                    style={styles.textInputStyle}
                    placeholder="Enter..."
                    defaultValue={this.state.dataTitle}
                    allowFontScaling={false}
                    onChangeText={(text) => this.setState({ dataTitle: text })}
                  />
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Unit Serial Number</Text>
                  </View>
                  <Autocomplete
                    allowFontScaling={false}
                    autoCapitalize="none"
                    autoCorrect={false}
                    containerStyle={styles.autocompleteContainer}
                    listContainerStyle={{ backgroundColor: 'white' }}
                    style={styles.textInputStyle}
                    inputContainerStyle={{ borderWidth: 0 }}
                    data={dataSerialNumber.length === 1 && comp1(query1, dataSerialNumber[0]) ? [] : dataSerialNumber}
                    defaultValue={query1}
                    onChangeText={text => this.getListSerialNumber(text)}
                    placeholder="Enter..."
                    renderItem={({ item }) => (
                      <TouchableOpacity onPress={() => this.actionSerialNumber(item)}>
                        <Text style={styles.itemText}>
                          {item}
                        </Text>
                      </TouchableOpacity>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
                
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Customer</Text>
                    <Text style={styles.textBold}>{this.state.custumer}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Location</Text>
                    <Text style={styles.textBold}>{this.state.location}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Make</Text>
                    <Text style={styles.textBold}>{this.state.make}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Delivery Date</Text>
                    <Text style={styles.textBold}>{this.state.delivery}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Arrangement No</Text>
                    <Text style={styles.textBold}>{this.state.arrangement}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Family</Text>
                    <Text style={styles.textBold}>{this.state.family}, {this.state.familyPtDescription}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Model</Text>
                    <Text style={styles.textBold}>{this.state.model}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>SMU Date</Text>
                    <Text style={styles.textBold}>{this.state.SMUUpdate}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>SMU</Text>
                  </View>
                  <TextInput
                    style={styles.textInputStyle}
                    // placeholder={this.state.dataSMU}
                    defaultValue={this.state.SMU}
                    allowFontScaling={false}
                    onChangeText={(text) => this.setState({ SMU: text })}
                  />
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Part Causing Failure</Text>
                  </View>
                  <TextInput
                    style={styles.textInputStyle}
                    placeholder="Enter..."
                    defaultValue={this.state.dataPartCausing}
                    allowFontScaling={false}
                    onChangeText={(text) => this.setState({ dataPartCausing: text })}
                  />
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Problem Description</Text>
                  </View>
                  <TextInput
                    style={styles.textInputStyle1}
                    placeholder="Enter..."
                    allowFontScaling={false}
                    defaultValue={this.state.dataDescription}
                    numberOfLines={5}
                    multiline={true}
                    onChangeText={(text) => this.setState({ dataDescription: text })}
                  />
                </View>
              </View>
            </View>
          }

          if (this.state.show1 === false && this.props.navigation.state.params.ticketCatIdSend == 9) {
            viewShow1 = <TouchableOpacity onPress={() => this.actionShow1()}>
              <View style={styles.collapseheader}>
                <View style={{ flexDirection: 'column' }}>
                  <Text style={styles.textheader}>Technical Request </Text>
                  <Text style={styles.subtextheader}>Help Desk</Text>
                </View>
                <Image source={Images.arrowDown} style={styles.imageArrow} tintColor={"white"} />
              </View>
            </TouchableOpacity>
          } else if (this.state.show1 === true && this.props.navigation.state.params.ticketCatIdSend == 9) {
            viewShow1 = <View>
              <TouchableOpacity onPress={() => this.actionShow1false()}>
                <View style={styles.collapseheader}>
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={styles.textheader}>Technical Request </Text>
                    <Text style={styles.subtextheader}>Help Desk</Text>
                  </View>
                  <Image source={Images.arrowUp} style={styles.imageArrow} tintColor={"white"} />
                </View>
              </TouchableOpacity>
              <View style={{ backgroundColor: 'white' }}>
              <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View style={{ flexDirection: 'row', width: '100%' }}>
                    <View style={{ width: '20%' }}>
                      <Text style={styles.textall}>TR NO</Text>
                    </View>
                    <View style={{ width: '5%' }}>
                      <Text style={styles.textall}>:</Text>
                    </View>
                    <View style={{ width: '75%' }}>
                      <Text style={{ color: '#D7D7D7' }}>{this.state.dataTicketNumber}</Text>
                    </View>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View style={{ flexDirection: 'row', width: '100%' }}>
                    <View style={{ width: '20%' }}>
                      <Text style={styles.textall}>TR Type</Text>
                    </View>
                    <View style={{ width: '5%' }}>
                      <Text style={styles.textall}>:</Text>
                    </View>
                    <View style={{ width: '75%' }}>
                      <Text style={{ color: '#D7D7D7' }}>Help Desk</Text>
                    </View>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Title</Text>
                  </View>
                  <TextInput
                    style={styles.textInputStyle}
                    placeholder={this.state.dataTitle}
                    defaultValue={this.state.dataTitle}
                    allowFontScaling={false}
                    onChangeText={(text) => this.setState({ dataTitle: text })}
                  />
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Problem Description</Text>
                  </View>
                  <TextInput
                    style={styles.textInputStyle1}
                    placeholder={this.state.dataDescription}
                    allowFontScaling={false}
                    defaultValue={this.state.dataDescription}
                    numberOfLines={5}
                    multiline={true}
                    onChangeText={(text) => this.setState({ dataDescription: text })}
                  />
                </View>
              </View>
            </View>
          }
      
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#CCCCCC' }}>
                <View style={{ flex: 1, backgroundColor: "white" }}>
                    <View style={{backgroundColor:'black'}}>
                        <View style={{ padding: 15, paddingLeft: 10, flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                            <Image source={Images.ic_logo} style={{ width: 190, height: 70  }} />
                        </View>
                    </View>
                    <ScrollView>
                        <View style={{ flexDirection: 'column', paddingBottom: 60 }}>
                            {/* <View style={{ backgroundColor: '#F6F6F6', flexDirection: 'column' }}> */}
                            {viewShow1}
                            {viewShow2}
                            {/* <View style={{ backgroundColor: 'white' }}>
                                {viewShow2}
                            </View> */}
                            {/* </View> */}
                        </View>
                        
                    </ScrollView>
                    {showClose}
                        {showMenu}
                    <Modal
                        visible={this.state.pageViewProfile}
                        style={{ justifyContent: 'flex-end', margin: 0 }}
                        onBackdropPress={() => this.setState({ pageViewProfile: null })}
                    >
                        <View style={styles.scrollableModal}>
                            <View style={styles.scrollableModalContent}>
                                <View style={{ padding: 15, flexDirection: 'row', width: '100%', justifyContent: 'space-around' }}>
                                    <View style={{ width: '33%', alignItems: 'center', alignSelf: 'center', padding: 8 }}>
                                        <TouchableOpacity onPress={() => this.actionProfile()} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} >
                                            <Image source={Images.imageDefault} style={{ borderRadius: 100, width: 40, height: 40, borderWidth: 2, borderColor: 'rgb(170, 207, 202)' }} />
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
                                        <TouchableOpacity onPress={() => this.actionTR()} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
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
                        onBackdropPress={() => this.setState({ pageViewTR: null })}
                    >
                        <View style={styles.scrollableModal}>
                            <View style={styles.scrollableModalContent}>
                                <View style={{ padding: 15, flexDirection: 'row', width: '100%', justifyContent: 'space-around' }}>
                                    <View style={{ padding: 10, width: '33%', alignSelf: 'center', alignItems: 'center' }}>
                                        <TouchableOpacity onPress={() => this.actionProfile()} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} >
                                            <Image source={Images.ic_profil} style={{ borderRadius: 100, width: 40, height: 40, borderWidth: 2, borderColor: 'rgb(170, 207, 202)' }} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ padding: 10, width: '33%', alignSelf: 'center', alignItems: 'center' }}>
                                        <TouchableOpacity onPress={() => this.actionMyTiket()} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                                            <Image source={Images.ic_technical} style={{ width: 30, height: 30 }} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ width: '33%', alignSelf: 'center', alignItems: 'center' }}>
                                        <TouchableOpacity onPress={() => this.actionTR()} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                                            <View style={{ borderRadius: 100, backgroundColor: '#fff', padding: 8 }}>
                                                <Image source={Images.ic_edit} style={{ width: 30, height: 30 }} />
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <ScrollView style={{ width: '100%', height: '120%', padding: 20, paddingBottom: 100 }}>
                                    {this.viewRenderModalTR()}
                                    <View><Text></Text></View>
                                    <View><Text></Text></View>
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
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    imageArrow: {
        width: 15,
        height: 15
    },
    collapseheader: {
        height: 55,
        // borderTopLeftRadius: 20,
        // borderTopRightRadius: 20,
        backgroundColor: '#555555',
        alignSelf: 'center',
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
        paddingRight: 30
    },
    collapseheader2: {
        height: 55,
        // borderTopLeftRadius: 20,
        // borderTopRightRadius: 20,
        backgroundColor: '#555555',
        resizeMode: 'center',
        width: '100%',
        marginTop: 15,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
        paddingRight: 30
    },
    textheader: {
        fontSize: 17, color: 'white'
    },
    subtextheader: {
        fontSize: 14, color: 'white'
    },
    talkBubble: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        marginTop: 10
    },
    talkBubbleSquare: {
        padding: 10,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: '#DEDDDA',
        borderRadius: 6,
    },
    talkBubbleTriangle: {
        top: 5,
        width: 0,
        height: 0,
        borderTopColor: 'transparent',
        borderRightWidth: 26,
        borderColor: "#DEDDDA",
        borderWidth: 1,
        borderBottomWidth: 13,
        borderBottomColor: 'transparent'
    },
    talkBubbleRight: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        alignSelf: 'flex-end',
        marginTop: 10
    },
    talkBubbleSquareRight: {
        padding: 10,
        backgroundColor: "#E2EDE4",
        borderWidth: 1,
        borderColor: '#DEDDDA',
        borderRadius: 6,
    },
    talkBubbleTriangleRight: {
        top: 5,
        width: 0,
        height: 0,
        borderTopColor: 'transparent',
        // borderTopWidth: 13,
        borderLeftWidth: 26,
        borderLeftColor: "#E2EDE4",
        borderBottomWidth: 13,
        borderBottomColor: 'transparent'
    },
    textInputStyle: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#EBEBEB',
        shadowColor: "#808080",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 2,
        shadowRadius: 2.46,
        elevation: 4,
        textAlignVertical: 'top'
    },
    textInputStyleRating: {
        height: 100,
        borderRadius: 10,
        backgroundColor: '#EBEBEB',
        shadowColor: "#808080",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 2,
        shadowRadius: 2.46,
        elevation: 4,
        textAlignVertical: 'top'
    },
    bnext: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 15,

        backgroundColor: '#8EC63F',
        // marginLeft: 10,
        borderRadius: 5
    },
    bsave: {
        padding: 10,
        backgroundColor: '#cccac4',
        borderRadius: 5
    },
    bcancel: {
        padding: 10,
        backgroundColor: '#fff',
        borderColor: '#FABA00',
        borderWidth: 1,
        borderRadius: 5
    },
    viewmodalsend: {
      backgroundColor: '#fff',
      height: 155,
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
    viewModalRating: {
        width: '90%',
        height: '100%',
        backgroundColor: 'white',
        padding: 10,
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 5,
        flexDirection: 'column'
    },
    viewModalRatingResponSubmitter: {
        width: '90%',
        height: '50%',
        backgroundColor: 'white',
        padding: 10,
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 5,
        flexDirection: 'column'
    },

    imageCheckMark: {
        width: Dimensions.get('window').width * 0.3,
        height: Dimensions.get('window').width * 0.3
    },
    imageProfile: {
        width: Dimensions.get('window').width * 0.3,
        height: Dimensions.get('window').width * 0.3,
        borderRadius: 100,
        borderWidth: 6,
        borderColor: '#FABA00'
    },
    imageDiscussion: {
        width: Dimensions.get('window').width * 0.2,
        height: Dimensions.get('window').width * 0.2,
        borderRadius: 5
    },
    iconNotes: {
        width: Dimensions.get('window').width * 0.13,
        height: Dimensions.get('window').width * 0.13
    },
    textalertmodal: {
        fontSize: 15
    },
    textalertmodalBlack: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    btnSubmitRating: {
        paddingTop: 7,
        paddingBottom: 7,
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: '#FABA00',
        borderRadius: 10
    },
    textBold: {
      fontWeight: "bold",
      marginLeft: 5,
      color: '#999999'
    },
    textall: {
      // color: '#737373',
      marginLeft: 5,
      fontWeight: "400"
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
})