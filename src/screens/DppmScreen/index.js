import React, { Component } from 'react';
import {
    Dimensions,
    Alert,
    StyleSheet,
    View,
    Image,
    ScrollView,
    Animated,
    TouchableHighlight,
    TextInput,
    TouchableOpacity,
    BackHandler,
    SafeAreaView,
    ActivityIndicator,
} from 'react-native';
import { CardItem, Text, Textarea, Form, Item, Label, Input, Container, Header, Content, Button, Icon, Separator } from 'native-base';
import { ModalMenu, BottomBar } from '@component';
import { Images, API } from '@res';
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions, NavigationActions } from 'react-navigation';
import Modal from "react-native-modal";

export default class DppmScreen extends React.Component {
    constructor(props) {
        super(props);
        // this.registerCall = this.registerCall.bind(this);
        var { height, width } = Dimensions.get('window');
        this.state = {
            expanded: true,
            animation: new Animated.Value(),
            screenHeight: height,
            screenWidth: width,
            show1: false,
            title: this.props.navigation.state.params.sendTitle,
            trNo: this.props.navigation.state.params.sendTrNo,
            isModalLogout: false,
            isModalBerhasil: false,
            isLoadingSubmit: true,
            responMessage: '',
            dataDppm: '',
            dataDPPMno: '',
            dppmSend: '',
            tokenData: '',
            userName: '',
            locationUser1: '',
            locationUser2: '',
            pageViewProfile: false,
            pageViewTR: false,
            isModalFormKosongDppmno: false,
            showroundemenu:true,
            closemenu:false,
            roleId : -1,
            roleName : "",
            roleTextColor : "#11100E"  
        }
        BackHandler.addEventListener('hardwareBackPress', this._onBackPress)
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this._onBackPress);
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
    }

    componentDidMount() {
        // console.log(this.props.navigation.state.params.ticketCatIdSend)
        // console.log(this.props.navigation.state.params.ticketidSend)
        this.getToken();
    }

    getToken = async () => {
        const mToken = await AsyncStorage.getItem('@token');
        const mUserName = await AsyncStorage.getItem('@userName'); 
        const mLocationUser1 = await AsyncStorage.getItem('@locationUser1'); 
        const mLocationUser2 = await AsyncStorage.getItem('@locationUser2'); 
        const mUserImage = await AsyncStorage.getItem('@uriimage');
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
            roleTextColor
        })

        if (mToken != null && mToken != '') {
          this.setState({
            tokenData: mToken,
            userName: mUserName,
            locationUser1: mLocationUser1,
            locationUser2: mLocationUser2,
            userImage: mUserImage,
            userRole : mUserRoleName,
      
            delegateId : mdelegateId,
            delegateTo_Name : mdelegateTo_Name,
            delegateStart: mdelegateStart,
            delegateEnd : mdelegateEnd,
            delegateCreated  : mdelegateCreated ,
            delegateStatus : mdelegateStatus 
          });
          this.getTiketDetail();
        }
    }

    getTiketDetail() {
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
            // console.log(responseJson)
            if (responseJson.message.code === 200) {
              var Data1 = responseJson.result
              // console.log(JSON.stringify(Data1))
              this.setState({
                dataTicketno : Data1.TicketNo,
                dataTitle : Data1.Title,
                datasubmitter : Data1.Submiter,
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
                dataAttch: Data1.Attachments,
                dataDPPMno : Data1.DPPMno
              });
              // alert(JSON.stringify(this.state.dataTags))
              
            } else {
              this.setState({ loadingData: true, loadingDataKosong: true })
            }
    
          })
          .catch((error) => {
            console.log(error)
          });
      }
    
    registerCall(){
        this.setState({ isLoadingSubmit: false })
        fetch(API.registerDppm,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
              'AccessToken': this.state.tokenData,
            },
            body: JSON.stringify({
                TicketId: this.props.navigation.state.params.ticketidSend,
                DPPMno: this.state.dataDPPMno,
            }),
          }
        )
          .then(function (response) {
            return response.json();
          })
          .then((response) => {
              console.log(response)
            var dataObj = JSON.stringify(response.code)
            // alert(dataObj)
            if (dataObj === 200 || dataObj === '200') {
              this.setState({
                isModalBerhasil: true,
                isLoadingSubmit: true,
                responMessage: response.description,
                dataDPPMno:'',
              })
            } else {
              this.setState({
                isModalBerhasil: true,
                responMessage: 'DPPM Number must be filled before Submit',
              })
            }
          })
          .catch(function (error) {
            console.log("-------- error ------- " + error);
            alert("response:" + error)
          });
      }
    toogleDone() {
        this.setState({ isModalBerhasil: false })
    }

    toogleDoneDppmno(){
        this.setState({ isModalFormKosongDppmno: false, isLoadingSubmit: true })
    }

    validationForm(){
        if (this.state.dataDPPMno === '') {
            return this.setState({ isModalFormKosongDppmno: true, isLoadingSubmit: false });
        } else {
            return this.registerCall();
        }
    }

    actionSubmit() {
        if (this.state.isLoadingSubmit === true) {
          return (
            <TouchableOpacity block light style={styles.bnext} onPress={() => this.validationForm()}>
              <Text style={{ color: 'black' }}>Submit</Text>
            </TouchableOpacity>
          )
        } else {
          return (
            <TouchableOpacity block light style={styles.bnext} onPress={() => this.validationForm()}>
              <ActivityIndicator size="small" color="#fff" />
            </TouchableOpacity>
          )
        }
      }

    actionProfile() {
        // alert('ini')
        this.setState({ pageViewProfile: true });
    }

  actionFile(image) {
    if (image != '' && image != null) {
      return { uri: image, cache: 'reload', }
    } else {
      return Images.imgDefault
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

    actionTR() {
        this.setState({ pageViewTR: true });
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
              } })
          ]
      });
      this.props.navigation.dispatch(resetAction);
  }

    toogleLogoutCancel() {
        this.setState({ isModalLogout: false })
      }

      actionShow1() {
        this.setState({ show1: true, show2: false, show3: false })
    }

    actionShow1false() {
        this.setState({ show1: false })
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
        let viewShow1, viewShow2, ratingPertama, ratingKedua, ratingKetiga, ratingKeempat, ratingKelima, showTags, showImage, showClose, showMenu;

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
              uriImage={this.state.userImage}
              onTab1Press={() => this.actionProfile()}
              onTab2Press={() => this.actionMyTiket()}
              onTab3Press={() => this.actionTR()}
            />
        }
        
        if(this.state.dataTags != '' && this.state.dataTags != null ){
            showTags = <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
              {this.state.dataTags.map((item) => {
                return(
                  <View style={{ flexDirection: 'row', backgroundColor: '#959595', padding: 5, borderRadius: 10, alignSelf: 'center', alignItems: 'center', marginLeft: 10, marginTop: 10 }}>
                    <Text style={styles.textTag}>{item.Username}</Text>
                  </View>
                )
              })}
            </View>  
          } else {
            showTags = <View style={{ padding: 5, marginLeft: 10, marginTop: 10 }}>
          </View>
          }
  
          if(this.state.dataAttch != '' && this.state.dataAttch != null ){
            showImage = <View style={{ flexDirection: 'row', marginTop: 10 }}>
            {this.state.dataAttch.map((item, id) => {
              return (
                    <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                      <Image source={this.actionFile(item)} style={{ width: 120, height: 120, borderRadius: 5 }} />
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center', width: 120, marginTop: 10 }}>
                          <Text>Image{id + 1}.jpg</Text>
                      </View>
                    </View>
                    )
            })}
            </View> 
          } else {
            showImage = <View style={{ padding: 5, marginLeft: 10, marginTop: 10 }}>
          </View>
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
        
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Title</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataTitle}</Text>
                    </View>
                </View>
                
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Unit Serial Number</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataSerialNumber}</Text>
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
                    <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataTicketno}</Text>
                    </View>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Customer</Text>
                    <Text style={styles.textBold}>{this.state.dataCustomer}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Location</Text>
                    <Text style={styles.textBold}>{this.state.dataLocation}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Make</Text>
                    <Text style={styles.textBold}>{this.state.dataMake}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Delivery Date</Text>
                    <Text style={styles.textBold}>{this.state.dataDelivery}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Arrangement No</Text>
                    <Text style={styles.textBold}>{this.state.dataArrangement}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Family</Text>
                    <Text style={styles.textBold}>{this.state.dataFamily}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Model</Text>
                    <Text style={styles.textBold}>{this.state.dataModel}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>SMU</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataSmu}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Part Causing Failure</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataPcf}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Problem Description</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataDescription}</Text>
                    </View>
                </View>  
        
        
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                    <View>
                        <Text style={styles.textall}>Responder</Text>
                    </View>
                    <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataResponder}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                    <View>
                        <Text style={styles.textall}>Participant</Text>
                    </View>
                </View>
                        {showTags}
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Email CC</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataEmail}</Text>
                    </View>
                </View>  
                <View>
                    <View>
                        <Text style={[styles.textall, { marginLeft: 20, marginRight: 20 }]}>Attachments</Text>
                    </View>
                    <View style={{ padding: 10 }}>
                        <View style={{ borderRadius: 5, borderWidth: 1, padding: 10, borderColor: '#D7E0F1' }}>
                            <ScrollView horizontal={true}>
                                {showImage}
                            </ScrollView>
                        </View>
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
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Title</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataTitle}</Text>
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
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>TR No</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataTicketno}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Unit Serial Number</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataSerialNumber}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Manufacture</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataManufacture}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Arrangement No</Text>
                    <Text style={styles.textBold}>{this.state.dataArrangement}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Family</Text>
                    <Text style={styles.textBold}>{this.state.dataFamily}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Model</Text>
                    <Text style={styles.textBold}>{this.state.dataModel}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>SMU</Text>
                    <Text style={styles.textBold}>{this.state.dataSmu}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Parts Number</Text>
                    <Text style={styles.textBold}>{this.state.dataPartsNumber}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Parts Description</Text>
                    <Text style={styles.textBold}>{this.state.dataPd}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Request Description</Text>
                    <Text style={styles.textBold}>{this.state.dataDescription}</Text>
                  </View>
                </View>
        
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                    <View>
                        <Text style={styles.textall}>Responder</Text>
                    </View>
                    <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataResponder}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                    <View>
                        <Text style={styles.textall}>Participant</Text>
                    </View>
                </View>
                        {showTags}
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Email CC</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataEmail}</Text>
                    </View>
                </View>  
                <View>
                    <View>
                        <Text style={[styles.textall, { marginLeft: 20, marginRight: 20 }]}>Attachments</Text>
                    </View>
                    <View style={{ padding: 10 }}>
                        <View style={{ borderRadius: 5, borderWidth: 1, padding: 10, borderColor: '#D7E0F1' }}>
                            <ScrollView horizontal={true}>
                                {showImage}
                            </ScrollView>
                        </View>
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
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Title</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataTitle}</Text>
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
                      <Text style={{ color: '#D7D7D7' }}>{this.state.dataTicketno}</Text>
                    </View>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Manufacture</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataManufacture}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Part Number</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataPN}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Part Description</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataPd}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Request Description</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataDescription}</Text>
                    </View>
                </View>
        
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                    <View>
                        <Text style={styles.textall}>Responder</Text>
                    </View>
                    <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataResponder}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                    <View>
                        <Text style={styles.textall}>Participant</Text>
                    </View>
                </View>
                        {showTags}
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Email CC</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataEmail}</Text>
                    </View>
                </View>  
                <View>
                    <View>
                        <Text style={[styles.textall, { marginLeft: 20, marginRight: 20 }]}>Attachments</Text>
                    </View>
                    <View style={{ padding: 10 }}>
                        <View style={{ borderRadius: 5, borderWidth: 1, padding: 10, borderColor: '#D7E0F1' }}>
                            <ScrollView horizontal={true}>
                                {showImage}
                            </ScrollView>
                        </View>
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
                      <Text style={{ color: '#D7D7D7' }}>References</Text>
                    </View>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Title</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataTitle}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Description</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataDescription}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Unit Serial Number</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataSerialNumber}</Text>
                    </View>
                </View>
        
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                    <View>
                        <Text style={styles.textall}>Responder</Text>
                    </View>
                    <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataResponder}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                    <View>
                        <Text style={styles.textall}>Participant</Text>
                    </View>
                </View>
                        {showTags}
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Email CC</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataEmail}</Text>
                    </View>
                </View>  
                <View>
                    <View>
                        <Text style={[styles.textall, { marginLeft: 20, marginRight: 20 }]}>Attachments</Text>
                    </View>
                    <View style={{ padding: 10 }}>
                        <View style={{ borderRadius: 5, borderWidth: 1, padding: 10, borderColor: '#D7E0F1' }}>
                            <ScrollView horizontal={true}>
                                {showImage}
                            </ScrollView>
                        </View>
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
                  <Text style={styles.subtextheader}>Warranty Assistance</Text>
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
                    <Text style={styles.subtextheader}>Warranty Assistance</Text>
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
                        <Text style={styles.textBold}>{this.state.dataTitle}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>TR Type</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataWarranty}</Text>
                    </View>
                </View>
                {/* <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <View>
                          <Text style={styles.textall}>TR Type</Text>
                        </View>
                        <View>
                          <Dropdown
                              onChangeText = {this.valueDropdown.bind(this)}
                              data = {this.state.dataWarranty}
                              placeholder = 'Select TR Type'
                              labelFontSize={0}
                              containerStyle={styles.textInputStyleWarranty}
                          />
                        </View>
                </View> */}
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
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Customer</Text>
                    <Text style={styles.textBold}>{this.state.dataCustomer}</Text>
                  </View>
                </View>
                
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Service Order Number</Text>
                    <Text style={styles.textBold}>{this.state.dataSON}</Text>
                  </View>
                </View> 
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Claim Number</Text>
                    <Text style={styles.textBold}>{this.state.dataClaim}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Unit Serial Number</Text>
                    <Text style={styles.textBold}>{this.state.dataSerial}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Make</Text>
                    <Text style={styles.textBold}>{this.state.dataMake}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Delivery Date</Text>
                    <Text style={styles.textBold}>{this.state.dataDelivery}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Invoice Date</Text>
                    <Text style={styles.textBold}>{this.state.dataInvoice}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Model</Text>
                    <Text style={styles.textBold}>{this.state.dataModel}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>SMU</Text>
                    <Text style={styles.textBold}>{this.state.dataSmu}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Part Causing Failure</Text>
                    <Text style={styles.textBold}>{this.state.dataPcf}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Parts Description</Text>
                    <Text style={styles.textBold}>{this.state.dataPd}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Problem Description</Text>
                    <Text style={styles.textBold}>{this.state.dataDescription}</Text>
                  </View>
                </View>
        
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                    <View>
                        <Text style={styles.textall}>Responder</Text>
                    </View>
                    <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataResponder}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                    <View>
                        <Text style={styles.textall}>Participant</Text>
                    </View>
                </View>
                        {showTags}
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Email CC</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataEmail}</Text>
                    </View>
                </View>  
                <View>
                    <View>
                        <Text style={[styles.textall, { marginLeft: 20, marginRight: 20 }]}>Attachments</Text>
                    </View>
                    <View style={{ padding: 10 }}>
                        <View style={{ borderRadius: 5, borderWidth: 1, padding: 10, borderColor: '#D7E0F1' }}>
                            <ScrollView horizontal={true}>
                                {showImage}
                            </ScrollView>
                        </View>
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
                        <Text style={styles.textBold}>{this.state.dataTitle}</Text>
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
                      <Text style={{ color: '#D7D7D7' }}>{this.state.dataTicketno}</Text>
                    </View>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Customer</Text>
                    <Text style={styles.textBold}>{this.state.dataCustomer}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Service Order Number</Text>
                    <Text style={styles.textBold}>{this.state.dataSON}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Claim Number</Text>
                    <Text style={styles.textBold}>{this.state.dataClaim}</Text>
                  </View>
                </View>
                
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Unit Serial Number</Text>
                    <Text style={styles.textBold}>{this.state.dataSerial}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Make</Text>
                    <Text style={styles.textBold}>{this.state.dataMake}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Delivery Date</Text>
                    <Text style={styles.textBold}>{this.state.dataDelivery}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Invoice Date</Text>
                    <Text style={styles.textBold}>{this.state.dataInvoice}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Model</Text>
                    <Text style={styles.textBold}>{this.state.dataModel}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>SMU</Text>
                    <Text style={styles.textBold}>{this.state.dataSmu}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Part Causing Failure</Text>
                    <Text style={styles.textBold}>{this.state.dataPcf}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Parts Description</Text>
                    <Text style={styles.textBold}>{this.state.dataPd}</Text>
                  </View>
                </View>
        
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                    <View>
                        <Text style={styles.textall}>Responder</Text>
                    </View>
                    <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataResponder}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                    <View>
                        <Text style={styles.textall}>Participant</Text>
                    </View>
                </View>
                        {showTags}
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Email CC</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataEmail}</Text>
                    </View>
                </View>  
                <View>
                    <View>
                        <Text style={[styles.textall, { marginLeft: 20, marginRight: 20 }]}>Attachments</Text>
                    </View>
                    <View style={{ padding: 10 }}>
                        <View style={{ borderRadius: 5, borderWidth: 1, padding: 10, borderColor: '#D7E0F1' }}>
                            <ScrollView horizontal={true}>
                                {showImage}
                            </ScrollView>
                        </View>
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
                      <Text style={{ color: '#D7D7D7' }}>Telematics</Text>
                    </View>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Password</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataPassword}</Text>
                    </View>
                  
                </View>
        
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                    <View>
                        <Text style={styles.textall}>Responder</Text>
                    </View>
                    <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataResponder}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                    <View>
                        <Text style={styles.textall}>Participant</Text>
                    </View>
                </View>
                        {showTags}
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Email CC</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataEmail}</Text>
                    </View>
                </View>  
                <View>
                    <View>
                        <Text style={[styles.textall, { marginLeft: 20, marginRight: 20 }]}>Attachments</Text>
                    </View>
                    <View style={{ padding: 10 }}>
                        <View style={{ borderRadius: 5, borderWidth: 1, padding: 10, borderColor: '#D7E0F1' }}>
                            <ScrollView horizontal={true}>
                                {showImage}
                            </ScrollView>
                        </View>
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
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Title</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataTitle}</Text>
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
                      <Text style={{ color: '#D7D7D7' }}>{this.state.dataTicketno}</Text>
                    </View>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Manufacture</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataManufacture}</Text>
                    </View>
                </View>
        
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Unit Serial Number</Text>
                  </View>
                   <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataSerial}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Service Tool S/N</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataService}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Engine S/N</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataEngine}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>ECM S/N</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataEcm}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Total Tattletale</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataTotal}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Reason Code</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataReason}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Diagnostic Clock</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataDiagnostic}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Request Description</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataDescription}</Text>
                    </View>
                </View>
        
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                    <View>
                        <Text style={styles.textall}>Responder</Text>
                    </View>
                    <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataResponder}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                    <View>
                        <Text style={styles.textall}>Participant</Text>
                    </View>
                </View>
                        {showTags}
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Email CC</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataEmail}</Text>
                    </View>
                </View>  
                <View>
                    <View>
                        <Text style={[styles.textall, { marginLeft: 20, marginRight: 20 }]}>Attachments</Text>
                    </View>
                    <View style={{ padding: 10 }}>
                        <View style={{ borderRadius: 5, borderWidth: 1, padding: 10, borderColor: '#D7E0F1' }}>
                            <ScrollView horizontal={true}>
                                {showImage}
                            </ScrollView>
                        </View>
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
                  <Text style={styles.subtextheader}>Condition Monitoring</Text>
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
                    <Text style={styles.subtextheader}>Condition Monitioring</Text>
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
                        <Text style={styles.textBold}>{this.state.dataTitle}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Problem Description</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataPd}</Text>
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
                      <Text style={{ color: '#D7D7D7' }}>Condition Monitioring</Text>
                    </View>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                    <View>
                        <Text style={styles.textall}>Responder</Text>
                    </View>
                    <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataResponder}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                    <View>
                        <Text style={styles.textall}>Participant</Text>
                    </View>
                </View>
                        {showTags}
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Email CC</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <Text style={styles.textBold}>{this.state.dataEmail}</Text>
                    </View>
                </View>  
                <View>
                    <View>
                        <Text style={[styles.textall, { marginLeft: 20, marginRight: 20 }]}>Attachments</Text>
                    </View>
                    <View style={{ padding: 10 }}>
                        <View style={{ borderRadius: 5, borderWidth: 1, padding: 10, borderColor: '#D7E0F1' }}>
                            <ScrollView horizontal={true}>
                                {showImage}
                            </ScrollView>
                        </View>
                    </View>
                </View>
        
        
              </View>
            </View>
          }

        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#CCCCCC' }}>
                <View style={{ flex: 1, backgroundColor: "white" }}>
              <View style={{ backgroundColor: 'black' }}>
                        <View style={{ padding: 15, paddingLeft: 10, flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                            <Image source={Images.ic_logo} style={{ width: 190, height: 50 }} />
                        </View>
                    </View>
                    <ScrollView>
                        <View style={{ flexDirection: 'column', paddingBottom: 20 }}>
                            {viewShow1}
                        </View>
                        <View style={{ paddingBottom: 80 ,padding: 15, backgroundColor: 'white', borderRadius: 10, flexDirection: 'column', width: '100%' }}>
                            <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                                {this.state.dataDppmNo != null ? 
                                <Text style={styles.textall}>Edit DPPM Number</Text> : 
                                <Text style={styles.textall}>Add New DPPM Number</Text>
                              }
                            </View>
                            <TextInput
                                style={[styles.textInputStyle, { marginTop: 20, marginLeft: 20, marginRight: 20 }]}
                                placeholder="Enter..."
                                defaultValue={this.state.dataDPPMno}
                                allowFontScaling={false}
                                onChangeText={(text) => this.setState({ dataDPPMno: text })}
                            />
                              <View style={{ alignSelf: 'flex-end', alignItems: 'center', paddingTop: 25, paddingRight: 25}}>
                                {this.actionSubmit()}
                              </View>
                        </View>
                    </ScrollView>
                    
                    
                {showClose}
                {showMenu}

                </View>
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
                                    <Image source={{ uri: this.state.userImage }} style={{ borderRadius: 100, width: 40, height: 40, borderWidth: 2, borderColor: 'rgb(170, 207, 202)' }} />
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
                                    <Image source={{ uri: this.state.userImage }} style={{ borderRadius: 100, width: 40, height: 40, borderWidth: 2, borderColor: 'rgb(170, 207, 202)' }} />
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
                <Modal isVisible={this.state.isModalBerhasil}
                    animationIn='bounceIn'
                    animationOut='bounceOut'
                    >
                    <View style={styles.viewmodal}>
                        <Text style={styles.textalertmodal}>{this.state.responMessage}</Text>
                        <TouchableOpacity onPress={() => this.actionMyTiket()} style={[styles.buttonmodalOK]}>
                        <Text style={{ fontWeight: '200', color: '#fff' }}>ok</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>

                <Modal isVisible={this.state.isModalFormKosongDppmno}
                    animationIn='bounceIn'
                    animationOut='bounceOut'
                    >
                    <View style={styles.viewmodal}>
                        <Text style={styles.textalertmodal}>Please Enter Your DPPM Number</Text>
                        <TouchableOpacity onPress={() => this.toogleDoneDppmno()} style={[styles.buttonmodalOK]}>
                        <Text style={{ fontWeight: '200', color: '#fff' }}>ok</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>

                <Modal 
                    isVisible={this.state.isModalLogout}
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
                <Modal 
                        isVisible={this.state.isModalCloseApp}
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
            </SafeAreaView>

        );
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
    subtextheader: {
        fontSize: 14, color: 'white'
      },
    // collapseheader: {
    //     height: 60,
    //     backgroundColor: '#555555',
    //     alignSelf: 'center',
    //     width: '100%',
    //     alignItems: 'center',
    //     flexDirection: 'row',
    //     justifyContent: 'space-between',
    //     paddingLeft: 15,
    //     paddingRight: 15,
    //     borderTopLeftRadius: 25,
    //     borderTopRightRadius: 25,
    // },
    header: {
        height: 70,
        backgroundColor: "#ebebeb",
        borderColor: '#fff',
        shadowColor: 'transparent',
        elevation: 0,
    },
    textall: {
        color: '#757575',
        marginLeft: 5
    },
    bnext: {
        paddingRight: 20,
        paddingLeft: 20,
        paddingBottom: 15,
        paddingTop: 15,
        backgroundColor: '#FABA00',
        borderRadius: 2
    },
    textheader: {
        fontSize: 18, color: 'white'
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
    },
    textBold: {
        fontWeight: "bold",
        color: '#737373',
        marginLeft: 5
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
});





