import React, { Component } from 'react';
import {View, Text, BackHandler, SafeAreaView, Dimensions, FlatList, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert, Animated, TouchableHighlight, Linking, Button, PermissionsAndroid } from 'react-native';
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
import RNFetchBlob from 'rn-fetch-blob';
import DocumentPicker from 'react-native-document-picker';
import HTMLView from 'react-native-htmlview';
import stringStripHtml from 'string-strip-html';
import OneSignal from 'react-native-onesignal';
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
            delegateId : '',
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
            DataSon:'',
            dataClaim : '',
            dataInvoice : '',
            dataWarranty : 0,
            dataTags : [],
            dataParticipants: [],
            dataAttch: [],
            SMUUpDate: '',
            branch: '',
            branchdeskription: '',
           dueDate: this.props.navigation.state.params.duedateSend,
           
            showroundemenu:true,
            closemenu:false,
            createAt:'',
            dppmnum:'',
            dataactive:false,
            datacommenter:0,
            visiblemodalimage:false,
            filemodalimage:'',
            paramreopen:this.props.navigation.state.params.reopensend,
          statusticket: this.props.navigation.state.params.statussend,
          respondersend: this.props.navigation.state.params.responderSend,
          // escalatesend: this.props.navigation.state.params.escalatesend,
          escalatesend : false,
          IsAdmin:0,
          isparticipant:false,
          Status:this.props.navigation.state.params.statussend,
          dataResponderForEscalate:[],
          queryResponder:'',
          showescalate:false,
          loaderEscalateSubmit: false,
          msgEscalate:'',
          query:'',
          visibleModalSucsecEscalate:false,
          responderName:'',
          submiterName :'',
          employeeNamesubmiter:this.props.navigation.state.params.submiternamesend,
          isModalRatingResponder:false,
          isModalResponSubmitterResponder: false,
          Resolution:{},
          loaderAsNote: false,
          reftiket:'',
          desModalmandatory: false,
          modalSuccses:false,
          uriFiles:'',
          bannerFile:[],
          activeBanner:0,
          roleId : -1,
          roleName : "",
          roleTextColor : "#11100E",
          dataRatingNoteResponder : null,
          dataRatingNoteSubmiter : null,
          dataRatingSubmiter : 0,
          dataRatingResponder :0,
          userRole: ''
        }
        
    }
   
    componentWillmount() {
        OneSignal.addEventListener('opened', this.onOpened);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this._onBackPress)
        OneSignal.removeEventListener('opened', this.onOpened);
       // clearInterval(this._interval)
    }

    componentDidMount() {
      BackHandler.addEventListener('hardwareBackPress', this._onBackPress)
        this.getToken();
        //  console.log(this.props.navigation.state.params.ticketCatIdSend)
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
  
    getToken = async () => {
        const mToken = await AsyncStorage.getItem('@token');
        const mUserId = await AsyncStorage.getItem('@userid');
        const mUserName = await AsyncStorage.getItem('@userName'); 
        const mLocationUser1 = await AsyncStorage.getItem('@locationUser1'); 
        const mLocationUser2 = await AsyncStorage.getItem('@locationUser2'); 
        const mIsAdmin = await AsyncStorage.getItem('@isadmin');
        const mUserImage = await AsyncStorage.getItem('@uriimage');
        const mUserRoleName =  await AsyncStorage.getItem('@RoleUser');

        const mdelegateId = await AsyncStorage.getItem('@isDelegate');
        const mdelegateTo_Name = await AsyncStorage.getItem('@delegateTo_Name');
        const mdelegateStart = await AsyncStorage.getItem('@delegateStart');
        const mdelegateEnd = await AsyncStorage.getItem('@delegateEnd');
        const mdelegateCreated = await AsyncStorage.getItem('@delegateCreated');
        const mdelegateStatus = await AsyncStorage.getItem('@delegateStatus'); 

        let roleId = parseInt(await AsyncStorage.getItem("@RoleId"))
        let roleTextColor = (roleId <= 0 ? "#11100E" : (roleId >=2 ? "#A36307": "#006600"))

        this.setState({
            roleId,
            roleTextColor
        })
        // console.log(mUserId)
        if (mToken != null || mToken != '') {
            this.setState({ 
              tokenData: mToken, 
              userId: mUserId, 
              userName: mUserName, 
              locationUser1: mLocationUser1, 
              locationUser2: mLocationUser2, 
              IsAdmin: mIsAdmin,
              userImage: mUserImage,
              userRole : mUserRoleName,

              delegateId : mdelegateId,
              delegateTo_Name : mdelegateTo_Name,
              delegateStart: mdelegateStart,
              delegateEnd : mdelegateEnd,
              delegateCreated  : mdelegateCreated ,
              delegateStatus : mdelegateStatus 
             })
            this.getDataDiscuss();
            this.getTiketDetail();
            this.getListResponder();
        }
    }

    _onBackPress = () => {
      if (this.props.navigation.state.params.frompage == 1){
        const resetAction = StackActions.reset({
            index: 0,
           actions: [
             NavigationActions.navigate({ routeName: 'MyTechnicalScreen' })
           ]
         });
         this.props.navigation.dispatch(resetAction);
         
        this.props.navigation.navigate('MyTechnicalScreen')
        return true;
      } else if (this.props.navigation.state.params.frompage == 3) {
        // const resetAction = StackActions.reset({
        //   index: 0,
        //   actions: [
        //     NavigationActions.navigate({ routeName: 'MenuSearch' })
        //   ]
        // });
        // this.props.navigation.dispatch(resetAction);
        // return true;
        this.props.navigation.navigate('MenuSearch')
        return true;
      } else if (this.props.navigation.state.params.frompage == 4){
        // const resetAction = StackActions.reset({
        //   index: 0,
        //   actions: [
        //     NavigationActions.navigate({ routeName: 'SearchAllTR' })
        //   ]
        // });
        // this.props.navigation.dispatch(resetAction);
        // return true;
        this.props.navigation.navigate('SearchAllTR')
        return true;
      }else{
        // const resetAction = StackActions.reset({
        //   index: 0,
        //   actions: [
        //     NavigationActions.navigate({ routeName: 'AllTechnicalScreen' })
        //   ]
        // });
        // this.props.navigation.dispatch(resetAction);
        // return true;
        this.props.navigation.navigate('AllTechnicalScreen')
        return true;
      }
       
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
        console.log("ERROR GETDETAIL",responseJson)
        if (responseJson.message.code === 200) {
          // console.log(JSON.stringify(responseJson))
          var Data1 = responseJson.result
          // console.log(Data1)
          let participants = Data1.Participants || []
          let filteredParticipants = []
          filteredParticipants = participants.filter((participant, index, self) => {
            console.log(participant)
            return index === self.findIndex((item) => {
              return participant.UserName == item.UserName
            })
          })

          this.setState({
            dataTicketno: Data1.TicketNo,
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
            dataPcf: Data1.PartCausingFailure,
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
            DataSON: Data1.ServiceOrderNumber,
            // DataSon:Data1.ServiceOrderNumber,
            dataClaim : Data1.ClaimNumber,
            datIanvoice : Data1.InvoiceDate,
            dataWarranty : Data1.WarrantyTypeId,
            warrantyName: Data1.WarrantyCategoryName,
            dataTags : Data1.Tags,
            // dataParticipants: Data1.Participants,
            dataParticipants : filteredParticipants,
            dataAttch: Data1.Attachments,
            createAt: Data1.CreatedAt,
             dppmnum: Data1.DPPMno,
           
            dataactive:true,
            Status: Data1.Status,
         
            Resolution: Data1.Resolution,
            datacommenter: Data1.NextCommenter,
            dataFinterlock: Data1.FromInterlock,
            dataTinterlock: Data1.ToInterlock,
            dataSoftware: Data1.SoftwarePartNumber,
            dataTS: Data1.TestSpec,
            dataTSWB: Data1.TestSpecBrakeSaver,
            problemDesk: Data1.Description,
            reftiket: Data1.ReferenceTicketNo,
            dataRatingSubmiter :Data1.SubmiterRating,
            dataRatingResponder : Data1.ResponderRating,
            dataRatingNoteResponder: Data1.RatingDescResponder,
            dataRatingNoteSubmiter: Data1.RatingDescSubmiter,
            responderName : Data1.ResponderName,
            submiterName : Data1.SubmiterName,
            escalatesend : Data1.IsEscalated,
            dueDate : Data1.DueDateAnswer
          });
         
          console.log("\n===================\n Status : "+ this.state.Status+ "\n Status : " + Data1.Status+ "\nStatusticket :"+this.state.statusticket + "\nStatusSend : " + this.props.navigation.state.params.statussend);
          // if(this.state.Status == 0){ 
          //   this.setState({
          //     Status: this.props.navigation.state.params.statussend
          //   })
          // }
          if (Data1.DPPMno == null){
            this.setState({
              dppmnum : '-'
            })
          }else {
            this.setState({
              dppmnum: Data1.DPPMno
            })
          }

          if (!this.state.dataParticipants) {
            for (var i = 0; i < Data1.Participants.length; i++) {
              // var dataItem = this.state.dataParticipants[i]
              if (Data1.Participants[i].UserId == this.state.userId) {
                this.setState({
                  isparticipant: true
                })
              }
            }
          } else {
            this.setState({
              isparticipant: false
            })
          }
          
          if (Data1.Attachments != null){
            for (var i = 0; i < Data1.Attachments.length; i++){
            if (Data1.Attachments[i].Type == '.jpg' || Data1.Attachments[i].Type == '.png' || Data1.Attachments[i].Type == '.jpeg'){
              this.setState({bannerFile: [
              ...this.state.bannerFile, {
                img : Data1.Attachments[i].Uri,
                typ: Data1.Attachments[i].Type,
                nameimg: Data1.Attachments[i].Name
              }
            ]})
            }
          }
          }

          console.log('ini userId ' + this.state.userId)
          console.log('ini responder ' + this.state.dataResponder)
          console.log('ini submiter ' + this.state.dataSubmitter)
          console.log('ini participant ' + this.state.dataParticipants)
          console.log('respondersend ' + this.props.navigation.state.params.responderSend)
          console.log('is participant ' + this.state.isparticipant)
          console.log('tiket id ' + this.state.ticketId)
          // console.log('resolution ' + this.state.Resolution.Day)
          console.log('Status ' + this.state.Status)
          console.log(JSON.stringify(this.state.bannerFile))
          
          this.getDataMEP(this.state.dataSerial)
          this.getemployeeName(this.state.dataResponder)
          // this.getemployeeNameSubmiter(this.state.dataSubmitter)
          this.getEmployeeParticipant()
        } else {
          this.setState({ loadingData: true, loadingDataKosong: true })
        }

      })
      .catch((error) => {
        this.setState({
          loadingData: true
        })
        console.log("ini error", error)
      });
  }

  goToReopen = () => {
    this.setState({ isModalOption: false });

    if (this.props.navigation.state.params.ticketCatIdSend == 9) {
      this.setState({ isModalOption: false });
      const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'HelpdeskScreen', params: {
            idData: this.state.ticketId,
            ticketCatIdSend: this.props.navigation.state.params.ticketCatIdSend,
            trNoSend: this.props.navigation.state.params.trNoSend,
            titleSend: this.props.navigation.state.params.titleSend,
            descSend: this.props.navigation.state.params.descSend,
            trnosend: this.props.navigation.state.params.trNoSend
            }
          })
        ]
      });
      this.props.navigation.dispatch(resetAction);
    } else if (this.props.navigation.state.params.ticketCatIdSend == 8) {
      this.setState({ isModalOption: false });
      const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'TelematicsScreen', params: {
              idData: this.state.ticketId,
              ticketCatIdSend: this.props.navigation.state.params.ticketCatIdSend,
              trNoSend: this.props.navigation.state.params.trNoSend,
              titleSend: this.props.navigation.state.params.titleSend,
              descSend: this.props.navigation.state.params.descSend,
              trnosend: this.props.navigation.state.params.trNoSend
            }
          })
        ]
      });
      this.props.navigation.dispatch(resetAction);
    } else if (this.props.navigation.state.params.ticketCatIdSend == 7) {
      this.setState({ isModalOption: false });
      const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'PasswordScreen', params: {
              idData: this.state.ticketId,
              ticketCatIdSend: this.props.navigation.state.params.ticketCatIdSend,
              trNoSend: this.props.navigation.state.params.trNoSend,
              titleSend: this.props.navigation.state.params.titleSend,
              descSend: this.props.navigation.state.params.descSend,
              trnosend: this.props.navigation.state.params.trNoSend
            }
          })
        ]
      });
      this.props.navigation.dispatch(resetAction);
    } else if (this.props.navigation.state.params.ticketCatIdSend == 6) {
      this.setState({ isModalOption: false });
      const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'GoodwillScreen', params: {
              idData: this.state.ticketId,
              ticketCatIdSend: this.props.navigation.state.params.ticketCatIdSend,
              trNoSend: this.props.navigation.state.params.trNoSend,
              titleSend: this.props.navigation.state.params.titleSend,
              descSend: this.props.navigation.state.params.descSend,
              trnosend: this.props.navigation.state.params.trNoSend
            }
          })
        ]
      });
      this.props.navigation.dispatch(resetAction);
    } else if (this.props.navigation.state.params.ticketCatIdSend == 5) {
      this.setState({ isModalOption: false });
      const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'WarrantyScreen', params: {
              idData: this.state.ticketId,
              ticketCatIdSend: this.props.navigation.state.params.ticketCatIdSend,
              trNoSend: this.props.navigation.state.params.trNoSend,
              titleSend: this.props.navigation.state.params.titleSend,
              descSend: this.props.navigation.state.params.descSend,
              trnosend: this.props.navigation.state.params.trNoSend
            }
          })
        ]
      });
      this.props.navigation.dispatch(resetAction);
    } else if (this.props.navigation.state.params.ticketCatIdSend == 4) {
      this.setState({ isModalOption: false });
      const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'ReferencesScreen', params: {
              idData: this.state.ticketId,
              ticketCatIdSend: this.props.navigation.state.params.ticketCatIdSend,
              trNoSend: this.props.navigation.state.params.trNoSend,
              titleSend: this.props.navigation.state.params.titleSend,
              descSend: this.props.navigation.state.params.descSend,
              trnosend: this.props.navigation.state.params.trNoSend
            }
          })
        ]
      });
      this.props.navigation.dispatch(resetAction);
    } else if (this.props.navigation.state.params.ticketCatIdSend == 3) {
      this.setState({ isModalOption: false });
      const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'DimensionScreen', params: {
              idData: this.state.ticketId,
            ticketCatIdSend: this.props.navigation.state.params.ticketCatIdSend,
            trNoSend: this.props.navigation.state.params.trNoSend,
            titleSend: this.props.navigation.state.params.titleSend,
            descSend: this.props.navigation.state.params.descSend,
            trnosend: this.props.navigation.state.params.trNoSend
            }
          })
        ]
      });
      this.props.navigation.dispatch(resetAction);
    } else if (this.props.navigation.state.params.ticketCatIdSend == 2) {
      this.setState({ isModalOption: false });
      const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'PartstechnicalScreen', params: {
              idData: this.state.ticketId,
              ticketCatIdSend: this.props.navigation.state.params.ticketCatIdSend,
              trNoSend: this.props.navigation.state.params.trNoSend,
              titleSend: this.props.navigation.state.params.titleSend,
              descSend: this.props.navigation.state.params.descSend,
              trnosend: this.props.navigation.state.params.trNoSend
            }
          })
        ]
      });
      this.props.navigation.dispatch(resetAction);
    } else if (this.props.navigation.state.params.ticketCatIdSend == 1) {
      this.setState({ isModalOption: false });
      const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'ProductScreen', params: {
              idData: this.state.ticketId,
              ticketCatIdSend: this.props.navigation.state.params.ticketCatIdSend,
              trNoSend: this.props.navigation.state.params.trNoSend,
              titleSend: this.props.navigation.state.params.titleSend,
              descSend: this.props.navigation.state.params.descSend,
              trnosend: this.props.navigation.state.params.trNoSend
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
              idData: this.state.ticketId,
              ticketCatIdSend: this.props.navigation.state.params.ticketCatIdSend,
              trNoSend: this.props.navigation.state.params.trNoSend,
              titleSend: this.props.navigation.state.params.titleSend,
              descSend: this.props.navigation.state.params.descSend,
              trnosend: this.props.navigation.state.params.trNoSend
            }
          })
        ]
      });
      this.props.navigation.dispatch(resetAction);
    }


    // const resetAction = StackActions.reset({
    //   index: 0,
    //   actions: [
    //     NavigationActions.navigate({
    //       routeName: 'ReopenScreen', params: {
    //         idData: this.state.ticketId,
    //         ticketCatIdSend: this.props.navigation.state.params.ticketCatIdSend,
    //         trNoSend: this.props.navigation.state.params.trNoSend,
    //         titleSend: this.props.navigation.state.params.titleSend,
    //         descSend: this.props.navigation.state.params.descSend,
    //         trnosend: this.props.navigation.state.params.trNoSend
    //       }
    //     })
    //   ]
    // });
    // this.props.navigation.dispatch(resetAction);
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
        var Data2 = responseJson.result
        var co = responseJson.message.code
        
        if(co == 200){
          this.setState({
            // custumer: Data1.CustomerName,
            location: Data2.ShipToAddress,
            // make: Data1.Make,
            // delivery: Data1.DeliveryDate,
            // arrangement: Data1.ArrNumber,
            // family: Data1.PT,
            // family: Data1.PTDescription,
            // model: Data1.EngineModel,
            // SMU: Data1.SMU,
            // dueDate: Data1.DueDateAnswer,
            // SMUUpDate: Data1.SMUUpDate,
            branch: Data2.SalesOffice,
            branchdeskription: Data2.SalesOfficeDescription,
            SalesOffice: Data2.SalesOffice,
            SalesOfficeDescription: Data2.SalesOfficeDescription
          })

          if (Data2.SMUUpDate != null){
            this.setState({
              SMUUpDate: Data2.SMUUpDate
            })
          }else{
            this.setState({
              SMUUpDate: null
            })
          }
        }else{
          this.setState({
          SMUUpDate: null,
        })
        }
        console.log("Branch : " +this.state.branch);
        console.log("branchdeskription : " +this.state.branchdeskription);
        console.log("SalesOffice : " +this.state.SalesOffice);
        console.log("SalesOfficeDescription : " +this.state.SalesOfficeDescription);
        console.log("SMU Date : " +Data2.SMUUpDate);
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
      body: JSON.stringify(this.state.dataParticipants.UserId),
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

  getemployeeName(data) {
    fetch(API.getName, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
        'AccessToken': this.state.tokenData,
      },
      body: JSON.stringify({ data }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        var Data1= responseJson.data
        console.log('user name responder', Data1)
        if (responseJson.status.code === 200) {
          this.setState({ employeeNameresponder: Data1 })
        }
      })
      .catch((error) => {
        console.log(error)
      });
  }

  
  postResolution(){
    this.setState({
      isModalRating :false,
      isModalSend: false,
    })
    // console.log(JSON.stringify({
    //       TicketId: this.state.ticketId,
    //       UserId: parseInt(this.state.userId),
    //       Description: this.state.textDiscus,
    //       Attachments: this.state.temporaryFileAttach,
    //       UserToRate: this.state.dataSubmitter,
    //       Rate: this.state.ratingValue,
    //       RateDescription: this.state.textdiscussRate,
    // }))
    // if( this.state.userId === this.state.dataSubmitter && this.state.userId != this.state.dataResponder ){
    //   this.setState({ usertoRate : this.state.dataResponder })
    // } else if(this.state.userId === this.state.dataResponder  && this.state.userId != this.state.dataSubmitter) {
    //   this.setState({ usertoRate : this.state.dataSubmitter })
    // }

    if(this.state.textDiscus == ''){
      this.setState({desModalmandatory: true})
    }else{
      fetch(API.postResolution, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
          'AccessToken': this.state.tokenData,
        },
        body: JSON.stringify({
          TicketId: this.state.ticketId,
          UserId: parseInt(this.state.userId),
          Description: this.state.textDiscus,
          Attachments: this.state.temporaryFileAttach,
          UserToRate: this.state.dataSubmitter,
          Rate: this.state.ratingValue,
          RateDescription: this.state.textdiscussRate,
        })
      })
        .then((response) => response.json())
        .catch((error) => {
          console.log(error)
        })
        .then((response) => {
          console.log(response)
          console.log(response.status.code)
          if (response.status.code === 200) {
            this.setState({ isModalRating: false, isModalResponSubmitter: true })
            setTimeout(() => {
              this.props.navigation.navigate('MyTechnicalScreen')
            }, 500);

          } else {
            alert('Failed')
          }
        })
        .catch((error) => {
          console.log(error)
        });
    }
  }

  rateToresponder(){
    this.setState({
      isModalSend: false,
      isModalRatingResponder: false
    })

    console.log(this.state.ratingValue, this.state.textdiscussRate);
      fetch(API.postRateResponder, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
          'AccessToken': this.state.tokenData,
        },
        body: JSON.stringify({
          TicketId: this.state.ticketId,
          UserId: parseInt(this.state.userId),
          UserToRate: this.state.dataSubmitter,
          Rate: this.state.ratingValue,
          RateDescription: this.state.textdiscussRate,
        })
      })
        .then((response) => response.json())
        .catch((error) => {
          console.log(error)
        })
        .then((response) => {
          console.log(response)
          console.log(response.status.code)
          if (response.status.code === 200) {
            this.setState({ isModalRatingResponder: false, isModalResponSubmitterResponder: true })
            setTimeout(() => {
              this.props.navigation.navigate('MyTechnicalScreen')
            }, 500);

          } else {
            alert('Failed')
          }
        })
        .catch((error) => {
          console.log(error)
        });
    // }
  }

    // postDiscuss() {
    //   if (this.state.textDiscus == '') {
    //     this.setState({ desModalmandatory: true, isModalSend: false })
    //   }else{
    //     this.setState({
    //       isModalSend: false,
    //       loaderAsNote: true
    //     })
    //     fetch(API.postDiscuss, {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
    //         'AccessToken': this.state.tokenData,
    //       },
    //       body: JSON.stringify({
    //         Type: 1,
    //         TicketId: this.state.ticketId,
    //         UserId: parseInt(this.state.userId),
    //         Description: this.state.textDiscus,
    //         Attachments: this.state.temporaryFileAttach
    //       })
    //     })
    //       .then((respon) => respon.json())
    //       .catch((error) => {
    //         console.log(error)
    //       })
    //       .then((response) => {
    //         // console.log(response)
    //         if (response.status.code === 200) {
    //           this.setState({ textDiscus: '', isModalSend: false, temporaryFileAttach: [] })
    //           this.getDataDiscuss();
    //         } else {
    //           this.setState({ textDiscus: '', isModalSend: false, temporaryFileAttach: [], loaderAsNote: false })
    //         }
    //       })
    //   }
    // }

  postDiscuss() {
    if (this.state.textDiscus == '') {
      this.setState({ desModalmandatory: true, isModalSend: false })
    } else {
      this.setState({
        isModalSend: false,
        loaderAsNote: true
      })
    var formData = new FormData();
    formData.append('Type', ""+ parseInt('1'));
    formData.append('TicketId', "" + parseInt(this.state.ticketId));
    formData.append('UserId', "" + parseInt(this.state.userId));
    formData.append('Description', "" + this.state.textDiscus);
    this.state.temporaryFileAttach.forEach((attachmentsItem) => {
      formData.append('Attachments[]', {
        uri: ""+attachmentsItem.uri,
        type: ""+attachmentsItem.type,
        name: ""+attachmentsItem.name
      });
    });
      console.log('ini akan di send ke API: ' + JSON.stringify(formData))
      fetch(API.discusFormBody, {
        'body': formData,
        headers: {
          'Accept': 'application/json',
          'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
          'AccessToken': this.state.tokenData,
          'Content-Type': 'multipart/FORM-data'
        },
        method: 'POST'
      })
        .then((respon) => respon.json())
        .catch((error) => {
          console.log(error)
        })
        .then((response) => {
          console.log(response)
          if (response.status.code === 200) {
            this.setState({ textDiscus: '', isModalSend: false, temporaryFileAttach: [] })
            this.getDataDiscuss();
          } else {
            this.setState({ textDiscus: '', isModalSend: false, temporaryFileAttach: [], loaderAsNote: false })
          }
        })
    }
  }

   postDiscussnotes() {
    if (this.state.textDiscus == '') {
      this.setState({ desModalmandatory: true, isModalSend: false })
    } else {
      this.setState({
        isModalSend: false,
        loaderAsNote: true
      })
    var formData = new FormData();
    formData.append('Type', ""+ parseInt('2'));
    formData.append('TicketId', "" + parseInt(this.state.ticketId));
    formData.append('UserId', "" + parseInt(this.state.userId));
    formData.append('Description', "" + this.state.textDiscus);
    this.state.temporaryFileAttach.forEach((attachmentsItem) => {
      formData.append('Attachments[]', {
        uri: ""+attachmentsItem.uri,
        type: ""+attachmentsItem.type,
        name: ""+attachmentsItem.name
      });
    });
      console.log('ini akan di send ke API: ' + JSON.stringify(formData))
      fetch(API.discusFormBody, {
        'body': formData,
        headers: {
          'Accept': 'application/json',
          'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
          'AccessToken': this.state.tokenData,
          'Content-Type': 'multipart/FORM-data'
        },
        method: 'POST'
      })
        .then((respon) => respon.json())
        .catch((error) => {
          console.log(error)
        })
        .then((response) => {
          console.log(response)
          if (response.status.code === 200) {
            this.setState({ textDiscus: '', isModalSend: false, temporaryFileAttach: [] })
            this.getDataDiscuss();
          } else {
            this.setState({ textDiscus: '', isModalSend: false, temporaryFileAttach: [], loaderAsNote: false })
          }
        })
    }
  }

  //   postDiscussnotes() {
  //     if (this.state.textDiscus == '') {
  //       this.setState({ desModalmandatory: true, isModalSend: false })
  //     }else{
  //       this.setState({
  //         isModalSend: false,
  //         loaderAsNote: true
  //       })
  //       fetch(API.postDiscuss, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
  //           'AccessToken': this.state.tokenData,
  //         },
  //         body: JSON.stringify({
  //           Type: 2,
  //           TicketId: this.state.ticketId,
  //           UserId: parseInt(this.state.userId),
  //           Description: this.state.textDiscus,
  //           Attachments: this.state.temporaryFileAttach
  //         })
  //       })
  //         .then((respon) => respon.json())
  //         .catch((error) => {
  //           console.log(error)
  //         })
  //         .then((response) => {
  //           // console.log(response)
  //           if (response.status.code === 200) {
  //             this.setState({ textDiscus: '', isModalSend: false, temporaryFileAttach: [] })
  //             this.getDataDiscuss();
  //           } else {
  //             this.setState({ textDiscus: '', isModalSend: false, temporaryFileAttach: [], loaderAsNote: false })
  //           }
  //         })
  //     }
  // }

    getDataDiscuss() {
      // console.log("get discus ", this.state.ticketId)
        fetch(API.getDiscuss + this.state.ticketId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
                'AccessToken': this.state.tokenData,
            },
        })
            .then((respon) => respon.json())
            .catch((error) => {
                console.log(error)
            })
            .then((response) => {
              // console.log(JSON.stringify(response))
                if (response.status.code === 200) {
                    this.setState({
                        data: response.data,
                        isLoadingDiscuss: true,
                        loaderAsNote: false
                    })
                } else {
                  this.setState({
                        isLoadingDiscuss: true,
                        loaderAsNote: false
                    })
                  console.log(response)
                }
            })
    }

    compressImage(imageUri, rotation) {
        if (rotation === -90 || rotation === 270) {
          ImageResizer.createResizedImage(imageUri, 1000, 1000, 'JPEG', 75, 90)
            .then(({ uri }) => {
              this.imgToBase64(uri)
            })
            .catch(err => {
              return
            });
        } else if (rotation === 90) {
          ImageResizer.createResizedImage(imageUri, 1000, 1000, 'JPEG', 75, 90)
            .then(({ uri }) => {
              this.imgToBase64(uri)
            })
            .catch(err => {
              return
            });
        }
        else {
          ImageResizer.createResizedImage(imageUri, 1000, 1000, 'JPEG', 75)
            .then(({ uri }) => {
              this.imgToBase64(uri)
            })
            .catch(err => {
              return
            });
        }
      }
    
      imgToBase64(file) {
        ImgToBase64.getBase64String(file)
          .then(base64String => {
            this.setState({
              // foto: 'data:image/jpeg;base64,' + base64String
              dataFileAttachement: [...this.state.dataFileAttachement, { Name: 'data:image/jpeg;base64,' + base64String }],
              temporaryFileAttach: [...this.state.temporaryFileAttach, { Name: 'data:image/jpeg;base64,' + base64String }],
            });
          })
          .catch(err => {
            return
          })
        // setTimeout(() => {
        //     alert(JSON.stringify(this.state.dataFileAttachement))
        // }, 1000)
      }

    actionFile(image) {
        if (image != '' && image != null) {
            return { uri: image, cache: 'reload', }
        } else {
            return Images.imgDefault
        }
    }

    actionImage(image) {
        if (image != '' && image != null) {
            return { uri: image, cache: 'reload', }
        } else {
            return Images.imgDefault
        }
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

    actionIsiDiscuss(item) {
      let viewImg, showNameAttachment
        if (item.type === 'notes') {
            if (item.children.length) {
                return (
                  // reply masuk note 
                    <View style={{ marginTop: 10, width: '90%', alignSelf: 'center', borderRadius: 10, borderWidth: 1, borderColor: '#FABA00', padding: 10 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ marginTop: -15 }}>
                                <Image source={Images.iconBookmark} style={styles.iconNotes} />
                            </View>
                            <View style={{ marginTop: 5 }}>
                                <Text style={{ color: '#F8B800', fontSize: 15 }}>NOTES</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <Text style={{ color: '#A4640C', fontSize: 15 }}>{item.sender.name}</Text>
                            <Text style={{ color: '#000', marginLeft: 7, fontSize: 15 }}>{item.sender.type}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 7 }}>
                            <Text style={{ color: '#9A9A9A', fontSize: 15 }}>{item.date.day}</Text>
                            <Text style={{ color: '#000', marginLeft: 7, fontSize: 15 }}>{item.date.time}</Text>
                        </View>
                        <View style={{ marginTop: 10 }}>
                            <Text style={{ fontSize: 15 }}>{item.text}</Text>
                        </View>
                              <FlatList
                                data={item.image}
                                numColumns={2}
                                renderItem={({ item }) => {
                                  
                                  if (item.Type == '.jpg' || item.Type == '.jpeg') {
                                    viewImg = <TouchableOpacity onPress={() => this.modalviewimage(item.src, item.nama)}>
                                      <Image source={{ uri: item.src }} style={styles.imageDiscussion} />
                                    </TouchableOpacity>

                                  } else if (item.Type == '.zip' || item.Type == '.rar') {
                                    viewImg = <TouchableOpacity onPress={() => this.toogleOkSuccses(item.src, item.nama)}>
                                      <Image source={Images.foldeFile} style={styles.imageDiscussion} />
                                    </TouchableOpacity>

                                  } else {
                                    viewImg = <TouchableOpacity onPress={() => this.toogleOkSuccses(item.src, item.nama)}>
                                      <Image source={Images.documentAttch} style={styles.imageDiscussion} />
                                    </TouchableOpacity>

                                  }
                                  if(item.nama){
                                    showNameAttachment =  <Text style={{fontSize : 10, marginTop: 8}}>{item.nama}</Text>
                                  }
                                  else{
                                    showNameAttachment = <View></View>
                                  }
                                  return (
                                    <View style={{ marginTop: 20, marginLeft: 10, alignContent:'center' }}>
                                      {viewImg}
                                      {showNameAttachment}
                                    </View>
                                  );
                                }}
                                keyExtractor={(item, index) => index.toString()}
                              />
                        {item.children.map((data) => {
                                if (data.type === 'received') {
                                    return (
                                        <View style={styles.talkBubbleRight}>
                                            <View style={styles.talkBubbleSquareRight}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={{ color: '#A4640C', fontSize: 15 }}>{data.sender.name}</Text>
                                                    <Text style={{ color: '#000', marginLeft: 7, fontSize: 15 }}>{data.sender.type}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={{ color: '#9A9A9A', fontSize: 15 }}>{data.date.day}</Text>
                                                    <Text style={{ color: '#000', marginLeft: 7, fontSize: 15 }}>{data.date.time}</Text>
                                                </View>
                                                <View style={{ marginTop: 10 }}>
                                                    <Text style={{ fontSize: 15 }}>{data.text}</Text>
                                                </View>
                                          <FlatList
                                            data={data.image}
                                            numColumns={2}
                                            renderItem={({ item }) => {
                                              
                                              if (item.Type == '.jpg' || item.Type == '.jpeg') {
                                                viewImg = <TouchableOpacity onPress={() => this.modalviewimage(item.src)}>
                                                  <Image source={{ uri: item.src }} style={styles.imageDiscussion} />
                                                </TouchableOpacity>
                                              } else if (item.Type == '.zip' || item.Type == '.rar') {
                                                viewImg = <TouchableOpacity onPress={() => this.toogleOkSuccses(item.src)}>
                                                  <Image source={Images.foldeFile} style={styles.imageDiscussion} />
                                                </TouchableOpacity>

                                              } else {
                                                viewImg = <TouchableOpacity onPress={() => this.toogleOkSuccses(item.src)}>
                                                  <Image source={Images.documentAttch} style={styles.imageDiscussion} />
                                                </TouchableOpacity>
                                              }
                                              return (
                                                <View style={{ marginTop: 10, marginLeft: 10 }}>
                                                  {viewImg}
                                                  <Text>{item.nama}</Text>
                                                </View>
                                              );
                                            }}
                                            keyExtractor={(item, index) => index.toString()}
                                          />
                                            </View>
                                            <View style={styles.talkBubbleTriangleRight} />
                                        </View>
                                    )
                                } else {
                                    return (
                                        <View style={styles.talkBubble}>
                                            <View style={styles.talkBubbleTriangle} />
                                            <View style={styles.talkBubbleSquare} >
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={{ color: '#A4640C', fontSize: 15 }}>{data.sender.name}</Text>
                                                    <Text style={{ color: '#000', marginLeft: 7, fontSize: 15 }}>{data.sender.type}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={{ color: '#9A9A9A', fontSize: 15 }}>{data.date.day}</Text>
                                                    <Text style={{ color: '#000', marginLeft: 7, fontSize: 15 }}>{data.date.time}</Text>
                                                </View>
                                                <View style={{ marginTop: 10 }}>
                                                    <Text style={{ fontSize: 15 }}>{data.text}</Text>
                                                </View>
                                                  <FlatList
                                                    data={data.image}
                                                    numColumns={2}
                                                    renderItem={({ item }) => {
                                                      
                                                      if (item.Type == '.jpg' || item.Type == '.jpeg') {
                                                        viewImg = <TouchableOpacity onPress={() => this.modalviewimage(item.src)}>
                                                          <Image source={{ uri: item.src }} style={styles.imageDiscussion} />
                                                        </TouchableOpacity>

                                                      } else if (item.Type == '.zip' || item.Type == '.rar') {
                                                        viewImg = <TouchableOpacity onPress={() => this.toogleOkSuccses(item.src)}>
                                                          <Image source={Images.foldeFile} style={styles.imageDiscussion} />
                                                        </TouchableOpacity>

                                                      } else {
                                                        viewImg = <TouchableOpacity onPress={() => this.toogleOkSuccses(item.src)}>
                                                          <Image source={Images.documentAttch} style={styles.imageDiscussion} />
                                                        </TouchableOpacity>

                                                      }

                                                      if(item.nama){
                                                        showNameAttachment =  <Text style={{fontSize : 10, marginTop: 8}}>{item.nama}</Text>
                                                      }
                                                      return (
                                                        <View style={{ marginTop: 20, marginLeft: 10, alignContent:'center' }}>
                                                          {viewImg}
                                                          {showNameAttachment}
                                                        </View>
                                                      );
                                                    }}
                                                    keyExtractor={(item, index) => index.toString()}
                                                  />
                                            </View>
                                        </View>
                                    )
                                }
                            })
                        }
                    </View>
                )
            }else{
              return (
                <View style={{ marginTop: 10, width: '90%', alignSelf: 'center', borderRadius: 10, borderWidth: 1, borderColor: '#FABA00', padding: 10 }}>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ marginTop: -15 }}>
                      <Image source={Images.iconBookmark} style={styles.iconNotes} />
                    </View>
                    <View style={{ marginTop: 5 }}>
                      <Text style={{ color: '#F8B800', fontSize: 15 }}>NOTES</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <Text style={{ color: '#A4640C', fontSize: 15 }}>{item.sender.name}</Text>
                    <Text style={{ color: '#000', marginLeft: 7, fontSize: 15 }}>{item.sender.type}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', marginTop: 7 }}>
                    <Text style={{ color: '#9A9A9A', fontSize: 15 }}>{item.date.day}</Text>
                    <Text style={{ color: '#000', marginLeft: 7, fontSize: 15 }}>{item.date.time}</Text>
                  </View>
                  <View style={{ marginTop: 10 }}>
                    <Text style={{ fontSize: 15 }}>{item.text}</Text>
                  </View>
                  <FlatList
                    data={item.image}
                    numColumns={2}
                    renderItem={({ item }) => {
                      
                      if (item.Type == '.jpg' || item.Type == '.jpeg' || item.Type == '.png') {
                        viewImg = <TouchableOpacity onPress={() => this.modalviewimage(item.src, item.nama)}>
                          <Image source={{ uri: item.src }} style={styles.imageDiscussion} />
                        </TouchableOpacity>

                      } else if (item.Type == '.zip' || item.Type == '.rar') {
                        viewImg = <TouchableOpacity onPress={() => this.toogleOkSuccses(item.src, item.nama)}>
                          <Image source={Images.foldeFile} style={styles.imageDiscussion} />
                        </TouchableOpacity>

                      } else {
                        viewImg = <TouchableOpacity onPress={() => this.toogleOkSuccses(item.src, item.nama)}>
                          <Image source={Images.documentAttch} style={styles.imageDiscussion} />
                        </TouchableOpacity>

                      }
                      if(item.nama){
                        showNameAttachment =  <Text style={{fontSize : 10, marginTop: 8}}>{item.nama}</Text>
                      }
                      else{
                        showNameAttachment = <View></View>
                      }
                      return (
                        <View style={{ marginTop: 20, marginLeft: 10, alignContent:'center' }}>
                          {viewImg}
                          {showNameAttachment}
                        </View>
                      );
                    }}
                    keyExtractor={(item, index) => index.toString()}
                  />
                  {item.children.map((data) => {
                    if (data.type === 'received') {
                      return (
                        <View style={styles.talkBubbleRight}>
                          <View style={styles.talkBubbleSquareRight}>
                            <View style={{ flexDirection: 'row' }}>
                              <Text style={{ color: '#A4640C', fontSize: 15 }}>{data.sender.name}</Text>
                              <Text style={{ color: '#000', marginLeft: 7, fontSize: 15 }}>{data.sender.type}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                              <Text style={{ color: '#9A9A9A', fontSize: 15 }}>{data.date.day}</Text>
                              <Text style={{ color: '#000', marginLeft: 7, fontSize: 15 }}>{data.date.time}</Text>
                            </View>
                            <View style={{ marginTop: 10 }}>
                              <Text style={{ fontSize: 15 }}>{data.text}</Text>
                            </View>
                            <FlatList
                              data={item.image}
                              numColumns={2}
                              renderItem={({ item }) => {
                                
                                if (item.Type == '.jpg' || item.Type == '.jpeg' || item.Type == '.png') {
                                  viewImg = <TouchableOpacity onPress={() => this.modalviewimage(item.src, item.nama)}>
                                    <Image source={{ uri: item.src }} style={styles.imageDiscussion} />
                                  </TouchableOpacity>

                                } else if (item.Type == '.zip' || item.Type == '.rar') {
                                  viewImg = <TouchableOpacity onPress={() => this.toogleOkSuccses(item.src, item.nama)}>
                                    <Image source={Images.foldeFile} style={styles.imageDiscussion} />
                                  </TouchableOpacity>

                                } else {
                                  viewImg = <TouchableOpacity onPress={() => this.toogleOkSuccses(item.src)}>
                                    <Image source={Images.documentAttch} style={styles.imageDiscussion, item.nama} />
                                  </TouchableOpacity>

                                }
                                if(item.nama){
                                 showNameAttachment =  <Text style={{fontSize : 10}}>{item.nama}</Text>
                                }
                                return (
                                  <View style={{ marginTop: 10, marginLeft: 10 }}>
                                    {viewImg}
                                    {showNameAttachment}
                                  </View>
                                );
                              }}
                              keyExtractor={(item, index) => index.toString()}
                            />
                          </View>
                          <View style={styles.talkBubbleTriangleRight} />
                        </View>
                      )
                    } else {
                      return (
                        <View style={styles.talkBubble}>
                          <View style={styles.talkBubbleTriangle} />
                          <View style={styles.talkBubbleSquare} >
                            <View style={{ flexDirection: 'row' }}>
                              <Text style={{ color: '#A4640C', fontSize: 15 }}>{data.sender.name}</Text>
                              <Text style={{ color: '#000', marginLeft: 7, fontSize: 15 }}>{data.sender.type}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                              <Text style={{ color: '#9A9A9A', fontSize: 15 }}>{data.date.day}</Text>
                              <Text style={{ color: '#000', marginLeft: 7, fontSize: 15 }}>{data.date.time}</Text>
                            </View>
                            <View style={{ marginTop: 10 }}>
                              <Text style={{ fontSize: 15 }}>{data.text}</Text>
                            </View>
                            <FlatList
                              data={item.image}
                              numColumns={2}
                              renderItem={({ item }) => {
                                
                                if (item.Type == '.jpg' || item.Type == '.jpeg' || item.Type == '.png') {
                                  viewImg = <TouchableOpacity onPress={() => this.modalviewimage(item.src, item.nama)}>
                                    <Image source={{ uri: item.src }} style={styles.imageDiscussion} />
                                  </TouchableOpacity>

                                } else if (item.Type == '.zip' || item.Type == '.rar') {
                                  viewImg = <TouchableOpacity onPress={() => this.toogleOkSuccses(item.src, item.nama)}>
                                    <Image source={Images.foldeFile} style={styles.imageDiscussion} />
                                  </TouchableOpacity>

                                } else {
                                  viewImg = <TouchableOpacity onPress={() => this.toogleOkSuccses(item.src, item.nama)}>
                                    <Image source={Images.documentAttch} style={styles.imageDiscussion} />
                                  </TouchableOpacity>

                                }
                                if(item.nama){
                                 showNameAttachment =  <Text style={{fontSize : 10}}>{item.nama}</Text>
                                }
                                return (
                                  <View style={{ marginTop: 10, marginLeft: 10 }}>
                                    {viewImg}
                                    {showNameAttachment}
                                  </View>
                                );
                              }}
                              keyExtractor={(item, index) => index.toString()}
                            />
                          </View>
                        </View>
                      )
                    }
                  })
                  }
                </View>
              )
            }
        } else if (item.type === 'received') {
            return (
                <View style={{ marginTop: 10, width: '50%', }}>
                    <View style={styles.talkBubble}>
                        <View style={styles.talkBubbleTriangle} />
                        <View style={styles.talkBubbleSquare} >
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: '#A4640C', fontSize: 15 }}>{item.sender.name}</Text>
                                <Text style={{ color: '#000', marginLeft: 7, fontSize: 15 }}>{item.sender.type}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: '#9A9A9A', fontSize: 15 }}>{item.date.day}</Text>
                                <Text style={{ color: '#000', marginLeft: 7, fontSize: 15 }}>{item.date.time}</Text>
                            </View>
                            <View style={{ marginTop: 10 }}>
                                <Text style={{ fontSize: 15 }}>{item.text}</Text>
                            </View>
                              <FlatList
                                data={item.image}
                                numColumns={2}
                                renderItem={({ item }) => {
                                  
                                  if (item.Type == '.jpg' || item.Type == '.jpeg' || item.Type == '.png') {
                                    viewImg = <TouchableOpacity onPress={() => this.modalviewimage(item.src)}>
                                      <Image source={{ uri: item.src }} style={styles.imageDiscussion} />
                                    </TouchableOpacity>

                                  } else if (item.Type == '.zip' || item.Type == '.rar') {
                                    viewImg = <TouchableOpacity onPress={() => this.toogleOkSuccses(item.src)}>
                                      <Image source={Images.foldeFile} style={styles.imageDiscussion} />
                                    </TouchableOpacity>

                                  } else {
                                    viewImg = <TouchableOpacity onPress={() => this.toogleOkSuccses(item.src)}>
                                      <Image source={Images.documentAttch} style={styles.imageDiscussion} />
                                    </TouchableOpacity>

                                  }
                                  if(item.nama){
                                    showNameAttachment =  <Text style={{fontSize : 10, marginTop: 8}}>{item.nama}</Text>
                                  }
                                  else
                                  {
                                    showNameAttachment = <View></View>
                                  }
                                  return (
                                    <View style={{ marginTop: 20, marginLeft: 10, alignContent:'center' }}>
                                      {viewImg}
                                      {showNameAttachment}
                                    </View>
                                  );
                                }}
                                keyExtractor={(item, index) => index.toString()}
                              />
                        </View>
                    </View>
                </View>
            )
        } else {
          // reply di api muncul cuman satu
            return (
                <View style={{ marginTop: 10, width: '50%', alignSelf: 'flex-end' }}>
                    <View style={styles.talkBubbleRight}>
                        <View style={styles.talkBubbleSquareRight}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: '#A4640C', fontSize: 15 }}>{item.sender.name}</Text>
                                <Text style={{ color: '#000', marginLeft: 7, fontSize: 15 }}>{item.sender.type}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: '#9A9A9A', fontSize: 15 }}>{item.date.day}</Text>
                                <Text style={{ color: '#000', marginLeft: 7, fontSize: 15 }}>{item.date.time}</Text>
                            </View>
                            <View style={{ marginTop: 10 }}>
                                <Text style={{ fontSize: 15 }}>{item.text}</Text>
                            </View>
                            <FlatList
                                data={item.image}
                                numColumns={2}
                                renderItem={({ item }) => {
                                  
                                  if (item.Type == '.jpg' ||item.Type == '.jpeg' || item.Type == '.png'){
                                    viewImg = <View><TouchableOpacity onPress={() => this.modalviewimage(item.src, item.nama)}>
                                    <Image source={{ uri: item.src }} style={styles.imageDiscussion} />
                                    </TouchableOpacity>
                                     
                                     </View>
                                  }else if(item.Type == '.zip' ||item.Type == '.rar'){
                                    viewImg = <TouchableOpacity onPress={() => this.toogleOkSuccses(item.src, item.nama)}>
                                      <Image source={Images.foldeFile} style={styles.imageDiscussion} />
                                    </TouchableOpacity>
                                     
                                  }else{
                                    viewImg = <TouchableOpacity onPress={() => this.toogleOkSuccses(item.src, item.nama)}>
                                    <Image source={Images.documentAttch} style={styles.imageDiscussion} />
                                    </TouchableOpacity>
                                     
                                  }
                                  if(item.nama){
                                    showNameAttachment =  <Text style={{fontSize : 10, marginTop: 8}}>{item.nama}</Text>
                                  }
                                  else{
                                    showNameAttachment = <View></View>
                                  }
                                  return (
                                    <View style={{ marginTop: 20, marginLeft: 10, alignContent:'center' }}>
                                      {viewImg}
                                      {showNameAttachment}
                                    </View>
                                  );
                                }}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                        <View style={styles.talkBubbleTriangleRight} />
                    </View>
                </View>
            )
        }
    }

  selectImage() {
    // const options = {
    //   title: 'Pilih Gambar',
    //   storageOptions: {
    //     skipBackup: true,
    //     path: 'image',
    //   },
    // };
    // ImagePicker.showImagePicker(options, (response) => {
    //   this.compressImage("data:" + response.type + ";base64," + response.data, response.originalRotation)
    // });
    const options = {
      noData: true
    };
    ImagePicker.showImagePicker(options, (response) => {
      console.log("RESPONSE :", response)
      if (response.uri) {
        this.setState({
          temporaryFileAttach: [...this.state.temporaryFileAttach, {
            size: response.fileSize,
            name: response.fileName,
            type: response.type,
            uri: response.uri,
          }],
          dataFileAttachement: [...this.state.dataFileAttachement, {
            size: response.fileSize,
            name: response.fileName,
            type: response.type,
            uri: response.uri,
          }],
        })
      }
      console.log('isi Attachments adalah2: ' + JSON.stringify(this.state.temporaryFileAttach));
    });
  }


  async selectMultipleFile() {
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
      });
      for (const res of results) {
        console.log('INI RES:',res)
        this.setState({ 
          temporaryFileAttach: [...this.state.temporaryFileAttach, res], 
          dataFileAttachement: [...this.state.dataFileAttachement, res]
        });    
      }
      console.log('isi Attachments adalah: ' +JSON.stringify(this.state.temporaryFileAttach));
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Canceled from multiple doc picker')
      } else {
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  }

    compressImage(imageUri, rotation) {
        if (rotation === -90 || rotation === 270) {
            ImageResizer.createResizedImage(imageUri, 1000, 1000, 'JPEG', 75, 90)
                .then(({ uri }) => {
                    this.imgToBase64(uri)
                })
                .catch(err => {
                    return
                });
        } else if (rotation === 90) {
            ImageResizer.createResizedImage(imageUri, 1000, 1000, 'JPEG', 75, 90)
                .then(({ uri }) => {
                    this.imgToBase64(uri)
                })
                .catch(err => {
                    return
                });
        }
        else {
            ImageResizer.createResizedImage(imageUri, 1000, 1000, 'JPEG', 75)
                .then(({ uri }) => {
                    this.imgToBase64(uri)
                })
                .catch(err => {
                    return
                });
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

    toogleOkSuccses (item, name) {
      this.setState({ modalSuccses: true, uriFiles: item, uriFileName: name});
    };
    DownloadHandler(item, name){
        this.DownloadFile(item, name);
      }
  toogleDownloadCancel() {
    this.setState({ modalSuccses: false })

  };
  
    toogleLogoutCancel() {
      this.setState({ isModalLogout: false })
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

    actionEndTR() {
        this.setState({ isModalRating: true })
    }

    actionDeleteFile = (items) => {
        var index = this.state.dataFileAttachement.findIndex(item => item.name === items)
        this.state.dataFileAttachement.splice(index, 1)
        setTimeout(() => {
            this.setState({ temporaryFileAttach: this.state.dataFileAttachement })
        }, 100)
    }

    actionLoadingDiscuss() {
        if (this.state.isLoadingDiscuss === true) {
            return (
                <View style={{ flex: 1, flexDirection:'column', width: '100%', marginTop: 10, paddingBottom: 65}}>
                    {
                        this.state.data.map((item) => {
                            return (
                                this.actionIsiDiscuss(item)
                            )
                        })
                    }
                </View>
            )
        } else {
            return (
                <View style={{ resizeMode: 'center', flex: 1, flexDirection: 'column', alignContent: 'center', alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} >
                    <ActivityIndicator size="large" color={'#FABA00'} />
                    <Text>Please Wait...</Text>
                </View>
            )
        }
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

  goToPdfScreen() {
    Linking.canOpenURL('http://devapps.trakindo.co.id/Trend/Upload/TREND-User-Guide.pdf').then(supported => {
      if (supported) {
        Linking.openURL('http://devapps.trakindo.co.id/Trend/Upload/TREND-User-Guide.pdf');
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
            <Text style={{ color: this.state.roleTextColor, fontSize: 15 }}>{this.state.userRole}</Text>
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
    modalviewimage(item, name){
      this.setState({
        visiblemodalimage: true,
        filemodalimage: item,
        filename: name
      })
    }

    tooglemodalimage(){
      this.setState({
        visiblemodalimage: false,
        // filemodalimage:''
      })
    }

    toogleModalRate(){
      this.setState({
        isModalRating: true
      })
    }
    toogleModalRateToResponder(){
      this.setState({
        isModalRatingResponder: true
      })
    }

    toogleescalate(){
      this.setState({
        showescalate: true,
        isModalSend: false
      })
    }

    toogleEscaleteCancel(){
      this.setState({
        showescalate: false,
      })
    }
    postEscalate(){
      this.setState({
        loaderEscalateSubmit:true
      })
      console.log(JSON.stringify({
        TicketId: this.state.ticketId,
        Responder: this.state.queryResponder
      }))
      fetch(API.postEscalate, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
                'AccessToken': this.state.tokenData,
            },
            body: JSON.stringify({
                TicketId: this.state.ticketId,
                Responder: this.state.queryResponder
            })
        })
            .then((respon) => respon.json())
            .catch((error) => {
                console.log(error)
            })
            .then((response) => {
                if (response.status.code === 200 || response.status.code == 201) {
                  this.setState({ loaderEscalateSubmit: false, msgEscalate: response.status.description, visibleModalSucsecEscalate: true})
                } else {
                  this.setState({ loaderEscalateSubmit: false, msgEscalate: response.status.description, visibleModalSucsecEscalate: true})
                }
            })
    }

    getListResponder() {
    fetch(API.getListResponder, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
        'AccessToken': this.state.tokenData,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log('ini responder '+ JSON.stringify(responseJson))
        let Data4 = responseJson.data
        this.setState({
          dataResponderForEscalate: Data4,
        });
      })
      .catch((error) => {
        console.log(error)
      });
  }
  findDataResponder(query) {
    if (query === '') {
      return [];
    }
    const { dataResponderForEscalate } = this.state;
    const regex = new RegExp(`${query.trim()}`, 'i');
    return dataResponderForEscalate.filter(data => data.Name.search(regex) >= 0);
  }

  toogleSuccsesEscalate(){
    this.setState({
        showescalate: false,
        visibleModalSucsecEscalate: false
      })
      setTimeout(() => {
        this.props.navigation.navigate('MyTechnicalScreen')
      }, 1000);
  }
  toogleMessageRequired() {
    this.setState({desModalmandatory:false})
  }

  DownloadFile = async (filesItem, name) =>{
    
    Linking.openURL(filesItem);
    
  }
extention(filename){
    return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;

    // const granted = await PermissionsAndroid.request(
    //   PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    // )
    // if (granted === PermissionsAndroid.RESULTS.GRANTED){

    // }

  // if (Platform.OS === 'android') {
  //           try {
  //               const granted = await PermissionsAndroid.request(
  //                   PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //                   {
  //                       title: 'Permissions for write access',
  //                       message: 'Give permission to your storage to write a file',
  //                       buttonPositive: 'ok',
  //                   },
  //               );
  //               if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //                   console.log('You can use the storage');
  //               } else {
  //                   console.log('permission write denied' + granted);
  //                   return;
  //               }
  //           } catch (err) {
  //               console.warn(err);
  //               return;
  //           }
  //    }
  //   const extension = '.xlsx'
  //   RNFetchBlob.config({
  //     fileCache: true,
  //     appendExt: extension,
  //     addAndroidDownloads: {
  //       useDownloadManager: true,
  //       notification: true,
  //       path: DownloadDir + "/me_" + Math.random().toString().slice(2, 6) + '.' + extension,
  //       mime: '.xlsx',
  //       mediaScannable: true,
  //     }
  //   })
  //     .fetch('GET', 'http://devapps.trakindo.co.id/TREND/Upload/TechnicalRequestAttachments/PH20200627007-20200627131058-1.xlsx'
  //       , { 'Cache-Control': 'no-store' })
  //     .then((res) => {
  //       alert('The file has saved!')
  //       console.log('The file saved to ', res)
  //     })

    // RNFetchBlob.config({
    //   fileCache: true,
    //   // android only options, these options be a no-op on IOS
    //   addAndroidDownloads: {
    //     // Show notification when response data transmitted
    //     notification: true,
    //     // Title of download notification
    //     title: 'Great ! Download Success ! :O ',
    //     // File description (not notification description)
    //     description: 'An image file.',
    //     mime: '.xlsx',
    //     // Make the file scannable  by media scanner
    //     mediaScannable: true,
    //   }
    // })
    //   .fetch('GET', 'http://devapps.trakindo.co.id/TREND/Upload/TechnicalRequestAttachments/PH20200627007-20200627131058-1.xlsx')
    //   .then((resp) => {
    //     // the path of downloaded file
    //     // console.log(resp.path())
    //     resp.path()
    //   })
  }

  handlePassword = ()=>{
    console.log(API.generatePassword + this.state.ticketId)
    Linking.canOpenURL(API.generatePassword+this.state.ticketId).then(supported => {
      if (supported) {
        Linking.openURL(API.generatePassword+this.state.ticketId);
      } else {
        console.log("Don't know how to open URI: " + this.props.url);
      }
    });
  }

  change =({nativeEvent})=>{
    const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width) ;
    if(slide != this.state.activeBanner){
      this.setState({activeBanner: slide})
    }
  }
  

    render() {
      let viewShow1, viewShow2, ratingPertama, ratingKedua, ratingKetiga, ratingKeempat, ratingKelima, 
      showComment, showResponder, showTags, showImage, showParticipants, showTicketno, 
      showTitle, showSerial, showCustomer, showLocation, showMake, showDelivery, 
      showArrangement, showFamily, showModel, showSmu, showDescription, showPcf, showPd, showEmail, 
      showManufacture, showPn, showService, showEngine, showEcm, showTotal, showReason, showDiagnostic, 
      showPassword, showSon, showClaim, showInvoice, showClose, showMenu, showBranch, 
      statusbar, showStatus, showreopen,showWarranty, showbtnresolusion, showinputdisscus, showpapersend, showmenurplyasnote, btnescalate,
      visbleresponder, btnSubmitEscalate,  showResolusion, showSmuDate, showReftiket, showbtnGeneratePass,
      showFile, showRating, showratingtoresponder, showSubmitter, showCreatedAt;
      let imageExt = ['.img','.jpg','.jpeg','.png','.bmp','gif','.ico' ];
      const { query } = this.state;
      // const { queryResponder } = this.state;
      const dataResponderForEscalate = this.findDataResponder(query);
      const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
        

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

      console.log(this.state.Resolution)
      if (this.state.Resolution != null && this.state.dataactive == true){
        showResolusion = <View style={{ flexDirection: 'column', padding:10, alignContent:'center'}}>
        {/* <View style={{ marginTop: 10, marginRight: 20, marginLeft : 20 }}>
          <View style={{ flexDirection: 'row', width: '100%' }}>
            <View style={{ width: '40%' }}>
                <Text style={styles.textall}>Resolution Date</Text>
            </View>
            <View style={{ width: '5%' }}>
              <Text style={styles.textall}>:</Text>
            </View>
            <View style={{ width: '55%' }}>
                <Text style={styles.textall}>{this.state.Resolution.Day}</Text>
            </View>
          </View>
        </View>
        <View style={{ marginTop: 20, marginRight: 20, marginLeft : 20 }}>
          <View style={{ flexDirection: 'row', width: '100%' }}>
            <View style={{ width: '40%' }}>
                <Text style={styles.textall}>Resolution Time</Text>
            </View>
            <View style={{ width: '5%' }}>
              <Text style={styles.textall}>:</Text>
            </View>
            <View style={{ width: '55%' }}>
                <Text style={styles.textall}>{this.state.Resolution.Time}</Text>
            </View>
          </View>
        </View> */}
        {/* <View style={{ marginTop: 20, marginRight: 20 }}>
          <View style={{ flexDirection: 'row', width: '100%' }}>
            <View style={{ width: '40%' }}>
                <Text style={styles.textall}>Commenter Name</Text>
            </View>
            <View style={{ width: '5%' }}>
              <Text style={styles.textall}>:</Text>
            </View>
            <View style={{ width: '75%' }}>
                <Text style={styles.textall}>{this.state.Resolution.CommenterName}</Text>
            </View>
          </View>
        </View> */}
          {/* <View style={{ marginTop: 20,  marginRight: 20 }}>
            <View style={{ flexDirection: 'row', width: '100%' }}>
              <View style={{ width: '40%' }}>
                <Text style={styles.textall}>Commenter As</Text>
              </View>
              <View style={{ width: '5%' }}>
                <Text style={styles.textall}>:</Text>
              </View>
              <View style={{ width: '75%' }}>
                <Text style={styles.textall}>{this.state.Resolution.CommenterAs}</Text>
              </View>
            </View>
          </View> */}
          <View style={{ marginTop: 20,marginRight: 20, marginLeft : 20}}>
            <View style={{ flexDirection: 'column', width: '100%' }}>
              <View style={{ width: '100%' }}>
                <Text style={styles.textall}>Resolution</Text>
              </View>
              <View style={{ width: '100%' }}>
                <Text style={{...styles.textall, color : "gray", fontSize : 10, marginTop : 5}}>{`${this.state.Resolution.Day}, ${this.state.Resolution.Time} `}</Text>
                <Text style={{marginLeft : 6, color: "gray"}}>{`${stringStripHtml(this.state.Resolution.Description).result}`}</Text>
                {/* <HTMLView value={this.state.Resolution.Description} stylesheet={{p : {marginVertical : 0}}}/> */}
              </View>
            </View>
          </View>
        </View>
      }else{
        showResolusion = <View></View>
      }

      if (this.state.reftiket)
      {
        showReftiket = <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
          <View style={{ flexDirection: 'row', width: '100%' }}>
            <View style={{ width: '20%' }}>
              <Text style={styles.textall}>TR REF</Text>
            </View>
            <View style={{ width: '5%' }}>
              <Text style={styles.textall}>:</Text>
            </View>
            <View style={{ marginLeft: 20, marginRight: 20 }}>
              <Text style={styles.textall}>{this.state.reftiket}</Text>
            </View>
          </View>
        </View>
      }
      else{
        showReftiket = <View></View>
      }

      if(this.state.Status == 2){
        console.log("DUedate" +this.state.dueDate);
        if (this.state.dueDate > today) {
          statusbar = <View style={{ height: 5, width: 150, backgroundColor: 'green', borderRadius: 5 }}>
            <Text></Text> 
          </View>
        } else if (this.state.dueDate < today) {
          statusbar = <View style={{ height: 5, width: 150, backgroundColor: 'red', borderRadius: 5}}>
            <Text></Text> 
          </View>
        } else if (this.state.dueDate == today) {
          statusbar = <View style={{ height: 5, width: 150, backgroundColor: '#FAFA04', borderRadius: 5 }}>
            <Text> </Text> 
          </View>
        }
      }
      else{
        <View></View>
      }
      if (this.state.loaderEscalateSubmit){
        btnSubmitEscalate =<View style={{ flexDirection: 'row' }}>
          <ActivityIndicator size='small' color={'#FABA00'} />
          </View>
       
      }else{
        btnSubmitEscalate = <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity block style={styles.bsave2} onPress={() => this.toogleEscaleteCancel()}>
            <Text >
              Cancel
              </Text>
          </TouchableOpacity>
          <TouchableOpacity block light style={styles.bnext2} onPress={() => this.postEscalate()}>
            <Text >
              Submit
              </Text>
          </TouchableOpacity>
        </View>
      }

      if (this.state.showescalate){
        visbleresponder = <View style={{ alignItems: 'center' }}>
          <Text>Responder</Text>
          <Autocomplete
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.textInputStyle2}
            inputContainerStyle={{ borderColor: 'rgba(255,255,255,0.1)' }}
            data={dataResponderForEscalate.length === 1 && comp(query, dataResponderForEscalate[0].Name) ? [] : dataResponderForEscalate}
            defaultValue={query}
            onChangeText={text => this.setState({ query: text })}
            placeholder="Enter..."
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => this.setState({ query: item.Name, queryResponder: item.UserName })}>
                <Text style={styles.itemText}>
                  {item.Name}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          {btnSubmitEscalate}
          
        </View>
      }

      if (this.state.userId == this.state.dataResponder  && this.state.Status != 6){
        showbtnresolusion = <View style={{ marginTop: 15, borderBottomWidth: 1, flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => this.toogleModalRate()}>
            <Text style={{ color: '#000', fontSize: 15 }}>Write as resolution</Text>
          </TouchableOpacity>
        </View>
        btnescalate = <View style={{ marginTop: 15, borderBottomWidth: 1, flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => this.toogleescalate()}>
            <Text style={{ color: '#000', fontSize: 15 }}>Escalate</Text>
          </TouchableOpacity>
        </View>
      }else if (this.state.userId == this.state.dataSubmitter && this.state.Status == 6){
        // showbtnresolusion = <View style={{ marginTop: 15, borderBottomWidth: 1, flexDirection: 'row' }}>
        //   <TouchableOpacity onPress={() => this.toogleModalRateToResponder()}>
        //     <Text style={{ color: '#000', fontSize: 15 }}>Rate Your Responder</Text>
        //   </TouchableOpacity>
        // </View>
        showbtnresolusion = <View></View>
      }
    //Reply As Note
    if(this.props.navigation.state.params.ticketCatIdSend != 9){
      if(this.state.userId == this.state.dataSubmitter || this.state.userId == this.state.dataResponder )
      {
            showmenurplyasnote = <View>
            <View style={{ marginTop: 15, flexDirection: 'row',justifyContent: 'center' }}>
              <TouchableOpacity onPress={() => this.postDiscuss()}>
                <Text style={{ color: '#000', fontSize: 15 }}>Reply</Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'center'}}>
              <TouchableOpacity onPress={() => this.postDiscussnotes()}>
                <Text style={{ color: '#000', fontSize: 15 }}>Reply As Notes</Text>
              </TouchableOpacity>
            </View>
          </View>
      }
      else if(this.state.dataParticipants.some(p => p.UserId == this.state.userId))
      {
        showmenurplyasnote = <View>
          <View style={{ marginTop: 15, borderBottomWidth: 1, flexDirection: 'row' }}>
            {/* <Image source={Images.returnLeft} style={[styles.imageArrow, { marginRight: 10 }]} tintColor={"black"} /> */}
            <TouchableOpacity onPress={() => this.postDiscuss()}>
              <Text style={{ color: '#000', fontSize: 15 }}>Reply</Text>
            </TouchableOpacity>
          </View> 
        </View> 
      }
    }
    else{
      showmenurplyasnote = <View>
            <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'center'}}>
              <TouchableOpacity onPress={() => this.postDiscussnotes()}>
                <Text style={{ color: '#000', fontSize: 15 }}>Reply As Notes</Text>
              </TouchableOpacity>
            </View>
          </View> 
    }

      //Reply TextBox
    if(this.state.delegateId== 0){
      if(this.state.Status == 3){
        showinputdisscus = <View style={{justifyContent:'center',alignItems:'center', marginTop:5}}>
        <Text style={{alignSelf : 'center', justifyContent : 'center',alignContent:'center',textAlign : 'center'}}>Insert Comment is not available because this technical request has been Closed </Text>
        <TouchableOpacity style={[styles.buttonmodalOK,{marginBottom : 20}]} onPress={() => this.goToReopen()}>
          <Text>Re-open</Text>
        </TouchableOpacity>
      </View>
      }
      else if(this.state.Status == 6){
        if(this.state.dataSubmitter == this.state.userId)
        {
              showinputdisscus = <View>
              <View style={{ width: '80%', alignSelf: 'center', marginVertical: 10 }}>
                <Text style={{textAlign : 'center'}}>Insert Comment is not available because the problem in this technical request has been Solved</Text>
              </View>
              <TouchableOpacity style={[styles.buttonmodalOK,{marginBottom : 20, padding: 10}]} onPress={() => this.toogleModalRateToResponder()}>
                <Text style={{textAlign: 'center'}}>Rate Your Responder</Text>
              </TouchableOpacity>
              </View>
        }
        else{
              showinputdisscus = <View style={{ width: '80%', alignSelf: 'center', marginVertical: 10 }}>
                  <Text style={{textAlign : 'center'}}>Insert Comment is not available because the problem in this technical request has been Solved</Text>
              </View>
        }
      }
      else if(this.state.Status == 1){
        showinputdisscus = <View></View>
      }
      else if(this.state.Status == 2){
        
        if(this.state.dataSubmitter == this.state.userId || this.state.dataResponder == this.state.userId)
        {
            showinputdisscus = <View style={{ width: '80%', alignSelf: 'center', marginVertical: 10 }}>
          <TextInput
            style={styles.textInputStyle}
            placeholder="Type a message"
            defaultValue={this.state.textDiscus}
            multiline={true}
            allowFontScaling={false}
            numberOfLines={5}
            onChangeText={(text) => this.setState({ textDiscus: text })}
          />
        </View>
            showpapersend = <View style={{ flexDirection: 'row', width: '100%', alignItems: 'flex-end', paddingBottom: 10, marginTop: 15 }}>
  
          <View style={{ width: '50%', left: 40, flexDirection:'row' }}>
            <TouchableOpacity block light style={{ padding: 5, backgroundColor: '#C6C2BF', width: 50, alignItems: 'center', borderRadius: 5, marginRight:5 }} onPress={() => this.selectImage()}>
              <Icon type="FontAwesome5" name="camera" style={{ color: 'white' }} />
            </TouchableOpacity>
            <TouchableOpacity block light style={{ padding: 5, backgroundColor: '#C6C2BF', width: 50, alignItems: 'center', borderRadius: 5, }} onPress={() => this.selectMultipleFile()}>
              <Icon type="FontAwesome5" name="paperclip" style={{ color: 'white' }} />
            </TouchableOpacity>
          </View>
          <View style={{ width: '50%', right: 20 }}>
            <TouchableOpacity block light style={{ alignItems: 'flex-end', marginHorizontal: 30, justifyContent: 'center', marginTop: -10 }} onPress={() => this.setState({ isModalSend: true, })}>
              <Icon type="FontAwesome5" name="paper-plane" style={{ color: 'black' }} />
            </TouchableOpacity>
          </View>
        </View>
        }
        else if(this.state.dataParticipants.some(p => p.UserId == this.state.userId)){
            showinputdisscus = <View style={{ width: '80%', alignSelf: 'center', marginVertical: 10 }}>
          <TextInput
            style={styles.textInputStyle}
            placeholder="Type a message"
            defaultValue={this.state.textDiscus}
            multiline={true}
            allowFontScaling={false}
            numberOfLines={5}
            onChangeText={(text) => this.setState({ textDiscus: text })}
          />
        </View>
            showpapersend = <View style={{ flexDirection: 'row', width: '100%', alignItems: 'flex-end', paddingBottom: 10, marginTop: 15 }}>
  
          <View style={{ width: '50%', left: 40, flexDirection:'row' }}>
            <TouchableOpacity block light style={{ padding: 5, backgroundColor: '#C6C2BF', width: 50, alignItems: 'center', borderRadius: 5, marginRight:5 }} onPress={() => this.selectImage()}>
              <Icon type="FontAwesome5" name="camera" style={{ color: 'white' }} />
            </TouchableOpacity>
            <TouchableOpacity block light style={{ padding: 5, backgroundColor: '#C6C2BF', width: 50, alignItems: 'center', borderRadius: 5, }} onPress={() => this.selectMultipleFile()}>
              <Icon type="FontAwesome5" name="paperclip" style={{ color: 'white' }} />
            </TouchableOpacity>
          </View>
          <View style={{ width: '50%', right: 20 }}>
            <TouchableOpacity block light style={{ alignItems: 'flex-end', marginHorizontal: 30, justifyContent: 'center', marginTop: -10 }} onPress={() => this.setState({ isModalSend: true, })}>
              <Icon type="FontAwesome5" name="paper-plane" style={{ color: 'black' }} />
            </TouchableOpacity>
          </View>
        </View> 
        }
        else{
            showinputdisscus = <View style={{justifyContent:'center',alignItems:'center', marginTop:5}}>
              <Text style={{alignSelf : 'center', justifyContent : 'center',alignContent:'center',textAlign : 'center'}}>The Comment Sessions are only open to people included with this Technical Request</Text>
            </View>
        }
      }
    }
    else{
      showinputdisscus = <View style={{justifyContent:'center',alignItems:'center', marginTop:5}}>
      <Text style={{alignSelf : 'center', justifyContent : 'center',alignContent:'center',textAlign : 'center'}}>Insert Comment is not available during Delegation Period</Text>
     
    </View>
    }

      if(this.state.userId == this.state.dataResponder){
        showbtnGeneratePass = <View style={{ flexDirection: 'column', width: '100%' }}>
          <TouchableOpacity onPress={() => this.handlePassword()} style={{ backgroundColor: 'rgba(243,177,0,0.6)', height: 40, width: 150, padding: 10, marginTop: 10, borderRadius: 10 }}>
            <Text>Generate Password</Text>
          </TouchableOpacity>
        </View>
      }

      if (this.state.Status == 1) {
        //draft
        showStatus = <Text style={{ fontSize: 15, color: '#5B5B5B' }}>DRAFT</Text>
      } else if (this.state.Status == 2) {
        console.log("Status nya Submit : " + this.state.Status + "next commenter :"+this.state.datacommenter);
        if (this.state.escalatesend) {
          console.log("escalated : " + this.state.escalatesend);
          if (this.state.datacommenter == 0) {
            console.log("next commenter : " + this.state.datacommenter);
            if (this.state.dataResponder == this.state.userId && this.state.dataSubmitter == this.state.userId) {
              // escalate waiting your feed back
              showStatus = <Text style={{ fontSize: 15, color: 'red' }}>Escalate - Waiting Your Feedback</Text>
            } else {
              // escalate pra
              showStatus = <Text style={{ fontSize: 15, color: '#5B5B5B' }}>Escalate - <Text style={{ fontSize: 15, color: '#5B5B5B' }}>PRA</Text></Text>
            }
          } else {
            if (this.state.userId == this.state.datacommenter) {
              // escalate waiting your feed back
              showStatus = <Text style={{ fontSize: 15, color: 'red' }}>Escalated - Waiting Your Feedback</Text>
            } else {
              if (this.state.datacommenter == this.state.dataResponder) {
                // escalate pra
                showStatus = <Text style={{ fontSize: 15, color: 'red' }}>Escalated - <Text style={{ fontSize: 15, color: '#5B5B5B' }}>PSA</Text></Text>
              } else if (this.state.datacommenter == this.state.dataSubmitter) {
                // escalate psa 
                showStatus = <Text style={{ fontSize: 15, color: 'red' }}>Escalated - <Text style={{ fontSize: 15, color: '#5B5B5B' }}>PRA</Text></Text>
              }
            }
          }
        } else {
          if (this.state.datacommenter == 0) {
            console.log("next commenter : " + this.state.datacommenter);
            if (this.state.dataResponder == this.state.userId && this.state.dataSubmitter == this.state.userId) {
              // waiting your feedback
              console.log("waiting you feedback");
              showStatus = <Text style={{ fontSize: 15, color: 'red' }}>Waiting Your Feedback</Text>
            } else {
              console.log("PRA");
              // PRA
              showStatus = <Text style={{ fontSize: 15, color: '#5B5B5B' }}>PRA</Text>
            }
          } else {
            if (this.state.userId == this.state.datacommenter) {
              // waiting your feed back
              console.log("waiting you feedback2");
              showStatus = <Text style={{ fontSize: 15, color: 'red' }}>Waiting Your Feedback</Text>
            } else {
              if (this.state.datacommenter == this.state.dataResponder) {
                console.log("pra2");
                // pra
                showStatus = <Text style={{ fontSize: 15, color: '#5B5B5B' }}>PRA</Text>
              } else if (this.state.datacommenter == this.state.dataSubmitter) {
                console.log("psa2");
                //psa
                showStatus = <Text style={{ fontSize: 15, color: '#5B5B5B' }}>PSA</Text>
              }
            }
          }
        }
      } else if (this.state.Status == 3) {
        //closed
        showStatus = <Text style={{ fontSize: 15, color: 'red' }}>CLOSED</Text>
      } else if (this.state.Status == 6) {
        // solved
        showStatus = <Text style={{ fontSize: 15, color: 'red' }}>SOLVED</Text>
      }
      else{
        console.log("Status nya adalah : " + this.state.Status );
      
      }

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
          showTags = <View style={{marginLeft: 5, marginTop: 10 }}>
            <Text style={{ color: '#D7D7D7', alignItems: 'center', }}>There's No Tags</Text>
        </View>
        }

        if(this.state.dataParticipants){
          showParticipants = <View style={{ marginRight: 20 }}>
            {this.state.dataParticipants.map((item, id) => {
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

        if(this.state.dataAttch != '' && this.state.dataAttch != null )
        {
          
          const {width} = Dimensions.get("window")
          const height = width * 100 / 60;
          if (this.state.bannerFile.length > 0){
            showImage = 
            <View style={{ width, height: 200 }}>
              <ScrollView
                pagingEnabled
                onScroll={this.change}
                showsHorizontalScrollIndicator={false}
                horizontal
                style={{ width, height: 200 }} >
                {this.state.bannerFile.map((item, id) => (
                  <TouchableHighlight onPress={()=> this.modalviewimage(item.img, item.nameimg)}>
                    <Image
                      key={item}
                      source={this.actionFile(item.img)}
                      style={{ width, height: 200, resizeMode: 'cover' }} />
                  </TouchableHighlight>
                )
                )}
              </ScrollView>
              <View style={{ flexDirection: 'row', position: 'absolute', bottom: 0, alignSelf: 'center', margin: 3 }}>
                {this.state.bannerFile.map((i, k) => (
                  <Text key={k} style={k == this.state.activeBanner ? styles.bannerText2 : styles.bannerText1}>⬤</Text>
                ))}
              </View>
            </View>
          }
          showFile =  <View style={{ width , height: 150 }}>
            <ScrollView horizontal>
            {this.state.dataAttch.map((item, id) => (
              <TouchableOpacity onPress={() => this.toogleOkSuccses(item.Uri, item.Name)} style={{marginRight : 15}}>
                <Image source={Images.foldeFile} style={{ width: 50, height: 50, borderRadius: 5, marginLeft: 5, alignSelf: 'center', tintColor: '#555555' }} />
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', width: 100, marginTop: 5 }}>
                  <Text style={{ fontSize: 8, alignSelf: 'center' }}>{item.Name}</Text>
                </View>
              </TouchableOpacity>
            ))}
            </ScrollView>
            </View>
        } else {
          showImage = <View style={{ padding: 5, marginLeft: 10, marginTop: 10 }}>
            <Text style={{ color: '#D7D7D7', alignItems: 'center', alignSelf: 'center' }}>There's No Attachment</Text>
        </View>
        }

        if (this.state.dataResponder){
          showResponder = <View>
                            <Text style={styles.textBold}>{ this.state.responderName}</Text>
                          </View>
        } else {
          showResponder = <Text style={{ color: 'black', marginLeft:7 }}>-</Text>
        }
     
        if (this.state.dataWarranty != 0 && this.state.dataWarranty != null ){
          showWarranty = <Text style={styles.textBold}>{this.state.dataWarranty}</Text> 
        } else {
          showWarranty = <Text style={{ color: 'black', marginLeft:7 }}>-</Text>
        }

        if (this.state.dataTicketno != '' && this.state.dataTicketno != null ){
          showTicketno = <Text style={styles.textall}>{this.state.dataTicketno}</Text> 
        } else {
          showTicketno = <Text style={{ color: 'black', marginLeft:7 }}>-</Text>
        }

        if (this.state.dataTitle != '' && this.state.dataTitle != null ){
          showTitle = <Text style={styles.textBold}>{this.state.dataTitle}</Text> 
        } else {
          showTitle = <Text style={{ color: 'black', marginLeft:7 }}>-</Text>
        }

        // if (this.state.dataSubmitter != '' && this.state.dataSubmitter != null ){
        //   showSubmitter = <Text style={styles.textBold}>{this.state.dataSubmitter}</Text> 
        // } else {
        //   showSubmitter = <Text style={{ color: 'black', marginLeft:7 }}>-</Text>
        // }
        if (this.state.dataSubmitter){
          showSubmitter = <View>
                            <Text style={styles.textBold}>{this.state.dataSubmitter}</Text>
                          </View>
        } else {
          showSubmitter = <Text style={{ color: 'black', marginLeft:7 }}>-</Text>
        }
     
        if (this.state.dataSerial != '' && this.state.dataSerial != null ){
          showSerial = <Text style={styles.textBold}>{this.state.dataSerial}</Text> 
        } else {
          showSerial = <Text style={{ color: 'black', marginLeft:7 }}>-</Text>
        }

        if (this.state.dataCustomer != '' && this.state.dataCustomer != null ){
          showCustomer = <Text style={styles.textBold}>{this.state.dataCustomer}</Text> 
        } else {
          showCustomer = <Text style={{ color: 'black', marginLeft:7 }}>-</Text>
        }

        if (this.state.location != '' && this.state.location != null ){
          showLocation = <Text style={styles.textBold}>{this.state.location}</Text> 
        } else {
          showLocation = <Text style={{ color: 'black', marginLeft:7 }}>-</Text>
        }

        if (this.state.dataMake != '' && this.state.dataMake != null ){
          showMake = <Text style={styles.textBold}>{this.state.dataMake}</Text> 
        } else {
          showMake = <Text style={{ color: 'black', marginLeft:7 }}>-</Text>
        }

        if (this.state.dataDelivery != '' && this.state.dataDelivery != null ){
          showDelivery = <Text style={styles.textBold}>{this.state.dataDelivery.substring(0, 10)}</Text> 
        } else {
          showDelivery = <Text style={{ color: 'black', marginLeft:7 }}>-</Text>
        }

        if (this.state.dataArrangement != '' && this.state.dataArrangement != null ){
          showArrangement = <Text style={styles.textBold}>{this.state.dataArrangement}</Text> 
        } else {
          showArrangement = <Text style={{ color: 'black', marginLeft:7 }}>-</Text>
        }

        if (this.state.dataFamily != '' && this.state.dataFamily != null ){
          showFamily = <Text style={styles.textBold}>{this.state.dataFamily}</Text> 
        } else {
          showFamily = <Text style={{ color: 'black', marginLeft:7 }}>-</Text>
        }

        if (this.state.CreatedAt != null || this.state.CreatedAt != ''){
          showCreatedAt = <Text style={styles.textBold}>{this.state.createAt.substring(0, 10)} </Text>
        }else{
          showCreatedAt = <Text style={styles.textBold}>{this.state.createAt} </Text>
        }

      if (this.state.SMUUpDate != null){
          showSmuDate = <Text style={styles.textBold}>{this.state.SMUUpDate.substring(0, 10)}</Text>
        }else{
          showSmuDate =<Text style={styles.textBold}>-</Text>
        }

      // 

        if (this.state.dataModel != '' && this.state.dataModel != null ){
          showModel = <Text style={styles.textBold}>{this.state.dataModel}</Text> 
        } else {
          showModel = <Text style={{ color: 'black', marginLeft:7 }}>-</Text>
        }

        if (this.state.dataSmu){
          console.log("SMU : " + this.state.dataSmu)
          showSmu = <Text style={styles.textBold}>{this.state.dataSmu}</Text> 
        } else {
          console.log( "SMU : " +this.state.dataSmu)
          showSmu = <Text style={{ color: 'black', marginLeft:7 }}>-</Text>
        }

        if (this.state.dataDescription != '' && this.state.dataDescription != null ){
          showDescription = <Text style={styles.textBold}>{this.state.dataDescription}</Text> 
        } else {
          showDescription = <Text style={{ color: 'black', marginLeft:7 }}>-</Text>
        }

        if (this.state.dataPcf != '' || this.state.dataPcf != null ){
          showPcf = <Text style={styles.textBold}>{this.state.dataPcf}</Text> 
        } else {
          showPcf = <Text style={{ color: 'black', marginLeft:7 }}>-</Text>
        }

        if (this.state.dataPd != '' && this.state.dataPd != null ){
          showPd = <Text style={styles.textBold}>{this.state.dataPd}</Text> 
        } else {
          showPd = <Text style={{ color: 'black', marginLeft:7 }}>-</Text>
        }

        if (this.state.dataEmail != '' && this.state.dataEmail != null && this.state.dataEmail != 'null' && this.state.dataEmail != 'undefined'){
          showEmail = <Text style={styles.textBold}>{this.state.dataEmail}</Text> 
        } else {
          showEmail = <Text style={{ color: 'black', marginLeft : 6 }}>-</Text>
        }

        if (this.state.dataManufacture != '' && this.state.dataManufacture != null ){
          showManufacture = <Text style={styles.textBold}>{this.state.dataManufacture}</Text> 
        } else {
          showManufacture = <Text style={{ color: 'black', marginLeft:7 }}>-</Text>
        }

        if (this.state.dataPN != '' && this.state.dataPN != null ){
          showPn = <Text style={styles.textBold}>{this.state.dataPN}</Text> 
        } else {
          showPn = <Text style={{ color: 'black', marginLeft:7 }}>-</Text>
        }

        if (this.state.dataService != '' && this.state.dataService != null ){
          showService = <Text style={styles.textBold}>{this.state.dataService}</Text> 
        } else {
          showService = <Text style={{ color: 'black', marginLeft:7 }}>-</Text>
        }

        if (this.state.dataService != '' && this.state.dataService != null ){
          showService = <Text style={styles.textBold}>{this.state.dataService}</Text> 
        } else {
          showService = <Text style={{ color: 'black', marginLeft:7 }}>-</Text>
        } 
        
        if (this.state.dataEngine != '' && this.state.dataEngine != null ){
          showEngine = <Text style={styles.textBold}>{this.state.dataEngine}</Text> 
        } else {
          showEngine = <Text style={{ color: 'black', marginLeft:7 }}>-</Text>
        }
        
        if (this.state.dataEcm != '' && this.state.dataEcm != null ){
          showEcm = <Text style={styles.textBold}>{this.state.dataEcm}</Text> 
        } else {
          showEcm = <Text style={{ color: 'black', marginLeft:7 }}>-</Text>
        }   

        if (this.state.dataTotal != '' && this.state.dataTotal != null ){
          showTotal = <Text style={styles.textBold}>{this.state.dataTotal}</Text> 
        } else {
          showTotal = <Text style={{ color: 'black', marginLeft:7 }}>-</Text>
        }   

        if (this.state.dataReason != '' && this.state.dataReason != null ){
          showReason = <Text style={styles.textBold}>{this.state.dataReason}</Text> 
        } else {
          showReason = <Text style={{ color: 'black', marginLeft:7 }}>-</Text>
        }   

        if (this.state.dataDiagnostic != '' && this.state.dataDiagnostic != null ){
          showDiagnostic = <Text style={styles.textBold}>{this.state.dataDiagnostic}</Text> 
        } else {
          showDiagnostic = <Text style={{ color: 'black', marginLeft:7 }}>-</Text>
        }   

        if (this.state.dataPassword != '' && this.state.dataPassword != null ){
          showPassword = <Text style={styles.textBold}>{this.state.dataPassword}</Text> 
        } else {
          showPassword = <Text style={{ color: 'black', marginLeft:7 }}>-</Text>
        }   

        if (this.state.DataSON != '' && this.state.DataSON != null ){
          showSon = <Text style={styles.textBold}>{this.state.DataSON}</Text> 
        } else {
          showSon = <Text style={{ color: 'black', marginLeft:7 }}>-</Text>
        } 

        if (this.state.dataClaim != '' && this.state.dataClaim != null ){
          showClaim = <Text style={styles.textBold}>{this.state.dataClaim}</Text> 
        } else {
          showClaim = <Text style={{ color: 'black', marginLeft:7 }}>-</Text>
        } 

        if (this.state.dataInvoice != '' && this.state.dataInvoice != null ){
          showInvoice = <Text style={styles.textBold}>{this.state.dataInvoice}</Text> 
        } else {
          showInvoice = <Text style={{ color: 'black', marginLeft:7 }}>-</Text>
        } 

        if (this.state.branch != '' && this.state.branch != null ){
          showBranch = <Text style={styles.textBold}>{this.state.branch},{this.state.branchdeskription}</Text>
        } else {
          showBranch = <Text style={{ color: 'black', marginLeft:7 }}>-</Text>
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
                      defaultValue=""
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
                        defaultValue=""
                        multiline={true}
                        allowFontScaling={false}
                        numberOfLines={5}
                        onChangeText={(text) => this.setState({ textdiscussRate: text })}
                    />
                  </View>
              }
            }
        }

        //rating
          if(this.state.dataRatingSubmiter != 0)
          {
            console.log(this.state.dataRatingSubmiter,this.state.dataRatingResponder)
            if(this.state.dataRatingSubmiter == 1 ){
                if(this.state.dataRatingNoteSubmiter){
                  showRating = <View style={{ flexDirection: 'column', width: '100%' , marginBottom:10}}>
                  <Text style={styles.textall}>Rating by Responder</Text>
                  <View style={{ width: '70%' }}>
                    <View style={{ flexDirection: 'row', marginLeft : 5 }}>
                      <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                    </View>
                  </View>
                  <Text style={{color:'grey', marginLeft : 6 }}>{this.state.dataRatingNoteSubmiter}</Text>
                </View>  
                }
                else{
                  showRating = <View style={{ flexDirection: 'column', width: '100%' , marginBottom:10}}>
                  <Text style={styles.textall}>Rating by Responder</Text>
                  <View style={{ width: '70%' }}>
                    <View style={{ flexDirection: 'row', marginLeft : 5 }}>
                      <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                    </View>
                  </View>
                  
                </View>  
                }
            }
            else if (this.state.dataRatingSubmiter == 2){
              if(this.state.dataRatingNoteSubmiter){
                showRating = <View style={{ flexDirection: 'column', width: '100%' , marginBottom:10}}>
                <Text style={styles.textall}>Rating by Responder</Text>
                <View style={{ width: '70%' }}>
                  <View style={{ flexDirection: 'row', marginLeft : 5 }}>
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                  </View>
                </View>
                <Text style={{color:'grey', marginLeft : 6 }}>{this.state.dataRatingNoteSubmiter}</Text>
              </View>  
              }
              else{
                showRating = <View style={{ flexDirection: 'column', width: '100%' , marginBottom:10}}>
                <Text style={styles.textall}>Rating by Responder</Text>
                <View style={{ width: '70%' }}>
                  <View style={{ flexDirection: 'row', marginLeft : 5 }}>
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                  </View>
                </View>
                
              </View>  
              }
            }
            else if (this.state.dataRatingSubmiter == 3){
              if(this.state.dataRatingNoteSubmiter){
                showRating = <View style={{ flexDirection: 'column', width: '100%' , marginBottom:10}}>
                <Text style={styles.textall}>Rating by Responder</Text>
                <View style={{ width: '70%' }}>
                  <View style={{ flexDirection: 'row', marginLeft : 5 }}>
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                  </View>
                </View>
                <Text style={{color:'grey', marginLeft : 6 }}>{this.state.dataRatingNoteSubmiter}</Text>
              </View>  
              }
              else{
                showRating = <View style={{ flexDirection: 'column', width: '100%' , marginBottom:10}}>
                <Text style={styles.textall}>Rating by Responder</Text>
                <View style={{ width: '70%' }}>
                  <View style={{ flexDirection: 'row', marginLeft : 5 }}>
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                  </View>
                </View>
                
              </View>  
              }
            }
            else if (this.state.dataRatingSubmiter == 4){
              if(this.state.dataRatingNoteSubmiter){
                showRating = <View style={{ flexDirection: 'column', width: '100%' , marginBottom:10}}>
                <Text style={styles.textall}>Rating by Responder</Text>
                <View style={{ width: '70%' }}>
                  <View style={{ flexDirection: 'row', marginLeft : 5 }}>
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                  </View>
                </View>
                <Text style={{color:'grey', marginLeft : 6 }}>{this.state.dataRatingNoteSubmiter}</Text>
              </View>  
              }
              else{
                showRating = <View style={{ flexDirection: 'column', width: '100%' , marginBottom:10}}>
                <Text style={styles.textall}>Rating by Responder</Text>
                <View style={{ width: '70%' }}>
                  <View style={{ flexDirection: 'row', marginLeft : 5 }}>
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                  </View>
                </View>
                
              </View>  
              }
            }
            else if (this.state.dataRatingSubmiter == 5){
              if(this.state.dataRatingNoteSubmiter){
                showRating = <View style={{ flexDirection: 'column', width: '100%' , marginBottom:10}}>
                <Text style={styles.textall}>Rating by Responder</Text>
                <View style={{ width: '70%' }}>
                  <View style={{ flexDirection: 'row', marginLeft : 5 }}>
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                  </View>
                </View>
                <Text style={{color:'grey', marginLeft : 6 }}>{this.state.dataRatingNoteSubmiter}</Text>
              </View>  
              }
              else{
                showRating = <View style={{ flexDirection: 'column', width: '100%' , marginBottom:10}}>
                <Text style={styles.textall}>Rating by Responder</Text>
                <View style={{ width: '70%' }}>
                  <View style={{ flexDirection: 'row', marginLeft : 5 }}>
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                  </View>
                </View>
                
              </View>  
              }
            }
          }
          if(this.state.dataRatingResponder != 0)
          {
            console.log(this.state.dataRatingSubmiter,this.state.dataRatingResponder)
            if(this.state.dataRatingResponder == 1){
                if(this.state.dataRatingNoteResponder){
                  showratingtoresponder = <View style={{ flexDirection: 'column', width: '100%' }}>
                  <Text style={styles.textall}>Rating by Submitter</Text>
                  <View style={{ width: '70%' }}>
                    <View style={{ flexDirection: 'row', marginLeft : 5 }}>
                      <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                    </View>
                  </View>
                  <Text style={{color:'grey', marginLeft : 6 }}>{this.state.dataRatingNoteResponder}</Text>
                </View>  
                }
                else{
                  showratingtoresponder = <View style={{ flexDirection: 'column', width: '100%' }}>
                  <Text style={styles.textall}>Rating by Submitter</Text>
                  <View style={{ width: '70%' }}>
                    <View style={{ flexDirection: 'row', marginLeft : 5 }}>
                      <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                    </View>
                  </View>
                </View>  
                }
            }
            else if(this.state.dataRatingResponder == 2 ){
              if(this.state.dataRatingNoteResponder){
                showratingtoresponder = <View style={{ flexDirection: 'column', width: '100%' }}>
                <Text style={styles.textall}>Rating by Submitter</Text>
                <View style={{ width: '70%' }}>
                  <View style={{ flexDirection: 'row', marginLeft : 5 }}>
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                  </View>
                </View>
                <Text style={{color:'grey', marginLeft : 6 }}>{this.state.dataRatingNoteResponder}</Text>
              </View>  
              }
              else{
                showratingtoresponder = <View style={{ flexDirection: 'column', width: '100%' }}>
                <Text style={styles.textall}>Rating by Submitter</Text>
                <View style={{ width: '70%' }}>
                  <View style={{ flexDirection: 'row', marginLeft : 5 }}>
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                  </View>
                </View>
              </View>  
              }
          }
            else if(this.state.dataRatingResponder == 3){
              if(this.state.dataRatingNoteResponder){
                showratingtoresponder = <View style={{ flexDirection: 'column', width: '100%' }}>
                <Text style={styles.textall}>Rating by Submitter</Text>
                <View style={{ width: '70%' }}>
                  <View style={{ flexDirection: 'row', marginLeft : 5 }}>
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                  </View>
                </View>
                <Text style={{color:'grey', marginLeft : 6 }}>{this.state.dataRatingNoteResponder}</Text>
              </View>  
              }
              else{
                showratingtoresponder = <View style={{ flexDirection: 'column', width: '100%' }}>
                <Text style={styles.textall}>Rating by Submitter</Text>
                <View style={{ width: '70%' }}>
                  <View style={{ flexDirection: 'row', marginLeft : 5 }}>
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                  </View>
                </View>
              </View>  
              }
          }
            else if(this.state.dataRatingResponder == 4){
              if(this.state.dataRatingNoteResponder){
                showratingtoresponder = <View style={{ flexDirection: 'column', width: '100%' }}>
                <Text style={styles.textall}>Rating by Submitter</Text>
                <View style={{ width: '70%' }}>
                  <View style={{ flexDirection: 'row', marginLeft : 5 }}>
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                  </View>
                </View>
                <Text style={{color:'grey', marginLeft : 6 }}>{this.state.dataRatingNoteResponder}</Text>
              </View>  
              }
              else{
                showratingtoresponder = <View style={{ flexDirection: 'column', width: '100%' }}>
                <Text style={styles.textall}>Rating by Submitter</Text>
                <View style={{ width: '70%' }}>
                  <View style={{ flexDirection: 'row', marginLeft : 5 }}>
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                  </View>
                </View>
              </View>  
              }
          }
            else if(this.state.dataRatingResponder == 5){
              if(this.state.dataRatingNoteResponder){
                showratingtoresponder = <View style={{ flexDirection: 'column', width: '100%' }}>
                <Text style={styles.textall}>Rating by Submitter</Text>
                <View style={{ width: '70%' }}>
                  <View style={{ flexDirection: 'row', marginLeft : 5 }}>
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                  </View>
                </View>
                <Text style={{color:'grey', marginLeft : 6 }}>{this.state.dataRatingNoteResponder}</Text>
              </View>  
              }
              else{
                showratingtoresponder = <View style={{ flexDirection: 'column', width: '100%' }}>
                <Text style={styles.textall}>Rating by Submitter</Text>
                <View style={{ width: '70%' }}>
                  <View style={{ flexDirection: 'row', marginLeft : 5 }}>
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                    <Image source={Images.ratingFull} style={{ width: 10, height: 10, marginTop: 5 }} />
                  </View>
                </View>
              </View>  
              }
          }
          }
     
        //Product Healt
        if (this.state.show1 === false && this.props.navigation.state.params.ticketCatIdSend == 1) { 
            viewShow1 = <TouchableHighlight onPress={() => this.actionShow1()}>
              <View style={styles.collapseheader}>
                <View style={{ flexDirection: 'column' }}>
                  <Text style={styles.textheader}>Technical Request </Text>
                  <Text style={styles.subtextheader}>Product Health</Text>
                </View>
                <Image source={Images.arrowDown} style={styles.imageArrow} tintColor={"white"} />
              </View>
            </TouchableHighlight>
          } else if (this.state.show1 === true && this.props.navigation.state.params.ticketCatIdSend == 1 && this.state.dataactive == true) {
            
            viewShow1 = <View>
              <TouchableHighlight onPress={() => this.actionShow1false()}>
                <View style={styles.collapseheader}>
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={styles.textheader}>Technical Request </Text>
                    <Text style={styles.subtextheader}>Product Health</Text>
                  </View>
                  <Image source={Images.arrowUp} style={styles.imageArrow} tintColor={"white"} />
                </View>
              </TouchableHighlight>
              
              {showImage}
              <View style={{flexDirection:'row', marginTop: 5, padding:10}}>
              <ScrollView horizontal ={true}>
                  {showFile}
              </ScrollView>
              </View>

              <View style={{ backgroundColor: 'white' }}>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'row', width: '100%' }}>
                    <View style={{ width: '20%' }}>
                      <Text style={styles.textall}>TR NO</Text>
                    </View>
                    <View style={{ width: '5%' }}>
                      <Text style={styles.textall}>:</Text>
                    </View>
                    <View style={{ marginLeft: 20, marginRight: 20 }}>
                      {showTicketno}
                    </View>
                  </View>
                </View>
                {showReftiket}
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
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>DPPM Number</Text>
                    <Text style={styles.textBold}>{this.state.dppmnum} </Text>
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
                    <Text style={styles.textall}>Branch</Text>
                    <Text style={styles.textBold}>{this.state.SalesOffice},{this.state.SalesOfficeDescription}</Text>
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
                    <Text style={styles.textall}>SMU Date</Text>
                    {/* <Text style={styles.textBold}>{this.state.smuDate}</Text>  */}
                    {showSmuDate}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Part Causing Failure</Text>
                    <Text style={styles.textBold}>{this.state.dataPcf}</Text> 
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Parts Description</Text>
                    {showPd}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Problem Description</Text>
                    {showDescription}
                  </View>
                </View>  
                {showResolusion}
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>Responder</Text>
                        {/* {this.getemployeeName(this.state.dataResponder)} */}
                        {showResponder} 
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Submitter</Text>
                    <Text style={styles.textBold}>{this.state.submiterName}</Text>
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
                
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                   <View style={{ flexDirection: 'column', width: '100%' }}>
                      <Text style={styles.textall}>Tags</Text>
                      {showTags}
                  </View>
                </View>  
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  {showRating}
                  {showratingtoresponder}
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={[styles.textall,{marginBottom : 10}]}>TR Status</Text>
                    <Text style={styles.textall}>{showStatus}</Text>
                    {/* <Text style={styles.textall}>Status</Text> */}
                    {statusbar}
                  </View>
                </View>
                
              </View>
              </View>
          }else{
          viewShow1 = <View style={{ resizeMode: 'center', flex: 1, flexDirection: 'column', alignContent: 'center', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginTop:10 }} >
            <ActivityIndicator size="large" color={'#FABA00'} />
            <Text>Please Wait...</Text>
          </View>
          }
      
          // parts technical
          if (this.state.show1 === false && this.props.navigation.state.params.ticketCatIdSend == 2) {
            viewShow1 = <TouchableHighlight onPress={() => this.actionShow1()}>
              <View style={styles.collapseheader}>
                <View style={{ flexDirection: 'column' }}>
                  <Text style={styles.textheader}>Technical Request </Text>
                  <Text style={styles.subtextheader}>Parts Technical</Text>
                </View>
                <Image source={Images.arrowDown} style={styles.imageArrow} tintColor={"white"} />
              </View>
            </TouchableHighlight>
          } else if (this.state.show1 === true && this.props.navigation.state.params.ticketCatIdSend == 2) {
            viewShow1 = <View>
              <TouchableHighlight onPress={() => this.actionShow1false()}>
                <View style={styles.collapseheader}>
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={styles.textheader}>Technical Request </Text>
                    <Text style={styles.subtextheader}>Parts Technical</Text>
                  </View>
                  <Image source={Images.arrowUp} style={styles.imageArrow} tintColor={"white"} />
                </View>
              </TouchableHighlight>

              <View style={{ backgroundColor: 'white' }}>
                {showImage}
                <View style={{ flexDirection: 'row', marginTop: 5, padding: 10 }}>
                  <ScrollView horizontal={true}>
                    {showFile}
                  </ScrollView>
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
                      <Text style={styles.textall}>Parts Technical</Text>
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
                    <View style={{ marginLeft: 20, marginRight: 20 }}>
                      {showTicketno}
                    </View>
                  </View>
                </View>
                {showReftiket}
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
                    <Text style={styles.textall}>Branch</Text>
                    <Text style={styles.textBold}>{this.state.SalesOffice},{this.state.SalesOfficeDescription}</Text>
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
                    <Text style={styles.textall}>SMU Date</Text>
                    {/* <Text style={styles.textBold}>{this.state.smuDate}</Text>  */}
                    {showSmuDate}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>DPPM Number</Text>
                    <Text style={styles.textBold}>{this.state.dppmnum} </Text>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Parts Number</Text>
                    <Text style={styles.textBold}>{this.state.dataPN} </Text>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Parts Description</Text>
                    {showPd}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Request Description</Text>
                    {showDescription}
                  </View>
                </View>
                {showResolusion}
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>Responder</Text>
                        {showResponder} 
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Submitter</Text>
                    <Text style={styles.textBold}>{this.state.submiterName}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                    <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>Participant</Text>
                        {showParticipants}
                    </View>
                </View>   
                {/* <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                   <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Email CC</Text>
                    {showEmail}
                  </View>
                </View>   */}
                {/* <View>
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
                </View> */}
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                   <View style={{ flexDirection: 'column', width: '100%' }}>
                      <Text style={styles.textall}>Tags</Text>
                      {showTags}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  {showRating}
                  {showratingtoresponder}
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={[styles.textall,{marginBottom : 10}]}>TR Status</Text>
                    <Text style={styles.textall}>{showStatus}</Text>
                    {/* <Text style={styles.textall}>Status</Text> */}
                    {statusbar}
                  </View>
                </View>
              </View>
            </View>
          }
      // Dimensions
          if (this.state.show1 === false && this.props.navigation.state.params.ticketCatIdSend == 3) {
            viewShow1 = <TouchableHighlight onPress={() => this.actionShow1()}>
              <View style={styles.collapseheader}>
                <View style={{ flexDirection: 'column' }}>
                  <Text style={styles.textheader}>Technical Request </Text>
                  <Text style={styles.subtextheader}>Dimension</Text>
                </View>
                <Image source={Images.arrowDown} style={styles.imageArrow} tintColor={"white"} />
              </View>
            </TouchableHighlight>
          } else if (this.state.show1 === true && this.props.navigation.state.params.ticketCatIdSend == 3) {
            viewShow1 = <View>
              <TouchableHighlight onPress={() => this.actionShow1false()}>
                <View style={styles.collapseheader}>
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={styles.textheader}>Technical Request </Text>
                    <Text style={styles.subtextheader}>Dimension</Text>
                  </View>
                  <Image source={Images.arrowUp} style={styles.imageArrow} tintColor={"white"} />
                </View>
              </TouchableHighlight>

              <View style={{ backgroundColor: 'white' }}>
                {showImage}
                <View style={{ flexDirection: 'row', marginTop: 5, padding: 10 }}>
                  <ScrollView horizontal={true}>
                    {showFile}
                  </ScrollView>
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
                {showReftiket}
              <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Title</Text>
                    {showTitle}
                  </View>
                </View>
                
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>DPPM Number</Text>
                    <Text style={styles.textBold}>{this.state.dppmnum} </Text>
                  </View>
                </View>
                {/* <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                    <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>Manufacture</Text>
                        {showManufacture}
                    </View>
                </View> */}
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
                {showResolusion}
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>Responder</Text>
                        {showResponder} 
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Submitter</Text>
                    <Text style={styles.textBold}>{this.state.submiterName}</Text>
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
                
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                   <View style={{ flexDirection: 'column', width: '100%' }}>
                      <Text style={styles.textall}>Tags</Text>
                      {showTags}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  {showRating}
                  {showratingtoresponder}
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                  <Text style={[styles.textall,{marginBottom : 10}]}>TR Status</Text>
                    <Text style={styles.textall}>{showStatus}</Text>
                    {/* <Text style={styles.textall}>Status</Text> */}
                    {statusbar}
                  </View>
                </View>
                
              </View>
            </View>
          }
      //reference
          if (this.state.show1 === false && this.props.navigation.state.params.ticketCatIdSend == 4) {
            viewShow1 = <TouchableHighlight onPress={() => this.actionShow1()}>
              <View style={styles.collapseheader}>
                <View style={{ flexDirection: 'column' }}>
                  <Text style={styles.textheader}>Technical Request </Text>
                  <Text style={styles.subtextheader}>References</Text>
                </View>
                <Image source={Images.arrowDown} style={styles.imageArrow} tintColor={"white"} />
              </View>
            </TouchableHighlight>
          } else if (this.state.show1 === true && this.props.navigation.state.params.ticketCatIdSend == 4) {
            viewShow1 = <View>
              <TouchableHighlight onPress={() => this.actionShow1false()}>
                <View style={styles.collapseheader}>
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={styles.textheader}>Technical Request </Text>
                    <Text style={styles.subtextheader}>References</Text>
                  </View>
                  <Image source={Images.arrowUp} style={styles.imageArrow} tintColor={"white"} />
                </View>
              </TouchableHighlight>
              <View style={{ backgroundColor: 'white' }}>
                
                {showImage}
                <View style={{ flexDirection: 'row', marginTop: 5, padding: 10 }}>
                  <ScrollView horizontal={true}>
                    {showFile}
                  </ScrollView>
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
                {showReftiket}
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'row', width: '100%' }}>
                    <View style={{ width: '20%' }}>
                      <Text style={styles.textall}>TR Type</Text>
                    </View>
                    <View style={{ width: '5%' }}>
                      <Text style={styles.textall}>:</Text>
                    </View>
                    <View style={{ width: '75%' }}>
                      <Text style={styles.textall}>References</Text>
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
                {showResolusion}
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Unit Serial Number</Text>
                    {showSerial}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>DPPM Number</Text>
                    <Text style={styles.textBold}>{this.state.dppmnum}</Text>
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
                    <Text style={styles.textBold}>{this.state.SalesOffice},{this.state.SalesOfficeDescription}</Text>
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
                {/* <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Location</Text>
                    {showLocation}
                  </View>
                </View> */}
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
                    <Text style={styles.textall}>SMU Date</Text>
                    <Text style={styles.textBold}>{this.state.SMUUpDate.substring(0, 10)}</Text>
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
                        <Text style={styles.textall}>Responder</Text>
                        {showResponder} 
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Submitter</Text>
                    <Text style={styles.textBold}>{this.state.submiterName}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                    <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>Participant</Text>
                        {showParticipants}
                    </View>
                </View>   
                {/* <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                   <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Email CC</Text>
                    {showEmail}
                  </View>
                </View>   */}
                
                {/* <View>
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
                </View> */}

                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                   <View style={{ flexDirection: 'column', width: '100%' }}>
                      <Text style={styles.textall}>Tags</Text>
                      {showTags}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  {showRating}
                  {showratingtoresponder}
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                  <Text style={[styles.textall,{marginBottom : 10}]}>TR Status</Text>
                    <Text style={styles.textall}>{showStatus}</Text>
                    {/* <Text style={styles.textall}>Status</Text> */}
                    {statusbar}
                  </View>
                </View>
              </View>
            </View>
          }
      //waranty
          if (this.state.show1 === false && this.props.navigation.state.params.ticketCatIdSend == 5 ) {
            viewShow1 = <TouchableHighlight onPress={() => this.actionShow1()}>
              <View style={styles.collapseheader}>
                <View style={{ flexDirection: 'column' }}>
                  <Text style={styles.textheader}>Technical Request </Text>
                  <Text style={styles.subtextheader}>Warranty References</Text>
                </View>
                <Image source={Images.arrowDown} style={styles.imageArrow} tintColor={"white"} />
              </View>
            </TouchableHighlight>
          } else if (this.state.show1 === true && this.props.navigation.state.params.ticketCatIdSend == 5) {
            viewShow1 = <View>
              <TouchableHighlight onPress={() => this.actionShow1false()}>
                <View style={styles.collapseheader}>
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={styles.textheader}>Technical Request</Text>
                    <Text style={styles.subtextheader}>Warranty References</Text>
                  </View>
                  <Image source={Images.arrowUp} style={styles.imageArrow} tintColor={"white"} />
                </View>
              </TouchableHighlight>
              <View style={{ backgroundColor: 'white' }}>

                {showImage}
                <View style={{ flexDirection: 'row', marginTop: 5, padding: 10 }}>
                  <ScrollView horizontal={true}>
                    {showFile}
                  </ScrollView>
                </View>

                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>TR Type</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                    <Text style={styles.textBold}>{this.state.warrantyName}</Text>
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
                {showReftiket}
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Title</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                        {showTitle}
                  </View>
                </View>
                
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>DPPM Number</Text>
                    <Text style={styles.textBold}>{this.state.dppmnum} </Text>
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
                    <Text style={styles.textall}>Branch</Text>
                    <Text style={styles.textBold}>{this.state.SalesOffice},{this.state.SalesOfficeDescription}</Text>
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
                    <Text style={styles.textall}>SMU Date</Text>
                    {/* <Text style={styles.textBold}>{this.state.smuDate}</Text>  */}
                    {showSmuDate}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Part Causing Failure</Text>
                    <Text style={styles.textBold}>{this.state.dataPcf}</Text> 
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Parts Description</Text>
                    {showPd}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Problem Description</Text>
                    {showDescription}
                  </View>
                </View>
                {showResolusion}
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>Responder</Text>
                        {showResponder} 
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Submitter</Text>
                    <Text style={styles.textBold}>{this.state.submiterName}</Text>
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
                
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                   <View style={{ flexDirection: 'column', width: '100%' }}>
                      <Text style={styles.textall}>Tags</Text>
                      {showTags}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  {showRating}
                  {showratingtoresponder}
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                  <Text style={[styles.textall,{marginBottom : 10}]}>TR Status</Text>
                    <Text style={styles.textall}>{showStatus}</Text>
                    {/* <Text style={styles.textall}>Status</Text> */}
                    {statusbar}
                  </View>
                </View>
              </View>
            </View>
          }
      //goodwill referace
          if (this.state.show1 === false && this.props.navigation.state.params.ticketCatIdSend == 6) {
            viewShow1 = <TouchableHighlight onPress={() => this.actionShow1()}>
              <View style={styles.collapseheader}>
                <View style={{ flexDirection: 'column' }}>
                  <Text style={styles.textheader}>Technical Request </Text>
                  <Text style={styles.subtextheader}>Goodwill Assistance</Text>
                </View>
                <Image source={Images.arrowDown} style={styles.imageArrow} tintColor={"white"} />
              </View>
            </TouchableHighlight>
          } else if (this.state.show1 === true && this.props.navigation.state.params.ticketCatIdSend == 6) {
            viewShow1 = <View>
              <TouchableHighlight onPress={() => this.actionShow1false()}>
                <View style={styles.collapseheader}>
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={styles.textheader}>Technical Request </Text>
                    <Text style={styles.subtextheader}>Goodwill Assistance</Text>
                  </View>
                  <Image source={Images.arrowUp} style={styles.imageArrow} tintColor={"white"} />
                </View>
              </TouchableHighlight>
              <View style={{ backgroundColor: 'white' }}>
                
                {showImage}
                <View style={{ flexDirection: 'row', marginTop: 5, padding: 10 }}>
                  <ScrollView horizontal={true}>
                    {showFile}
                  </ScrollView>
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
                      <Text style={styles.textall}>Goodwill References</Text>
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
                {showReftiket}
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Title</Text>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                        {showTitle}
                    </View>
                </View>
                
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>DPPM Number</Text>
                    <Text style={styles.textBold}>{this.state.dppmnum} </Text>
                  </View>
                </View>
                
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Service Order Number</Text>
                    {showSon}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View>
                    <Text style={styles.textall}>Claim Number</Text>
                    {showClaim}
                  </View>
                </View>
                
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View>
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
                    <Text style={styles.textall}>Make</Text>
                    {showMake}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Branch</Text>
                    <Text style={styles.textBold}>{this.state.SalesOffice},{this.state.SalesOfficeDescription}</Text>
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
                    <Text style={styles.textall}>SMU Date</Text>
                    {/* <Text style={styles.textBold}>{this.state.smuDate}</Text>  */}
                    {showSmuDate}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Part Causing Failure</Text>
                    <Text style={styles.textBold}>{this.state.dataPcf}</Text> 
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Parts Description</Text>
                    {showPd}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Problem Description</Text>
                    <Text style={styles.textBold}>{this.state.problemDesk}</Text> 
                  </View>
                </View>
                {showResolusion}
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>Responder</Text>
                        {showResponder} 
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Submitter</Text>
                    <Text style={styles.textBold}>{this.state.submiterName}</Text>
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
                
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                   <View style={{ flexDirection: 'column', width: '100%' }}>
                      <Text style={styles.textall}>Tags</Text>
                      {showTags}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  {showRating}
                  {showratingtoresponder}
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                  <Text style={[styles.textall,{marginBottom : 10}]}>TR Status</Text>
                    <Text style={styles.textall}>{showStatus}</Text>
                    {/* <Text style={styles.textall}>Status</Text> */}
                    {statusbar}
                  </View>
                </View>
              </View>
            </View>
          }
      //telematics
          if (this.state.show1 === false && this.props.navigation.state.params.ticketCatIdSend == 8) { 
            viewShow1 = <TouchableHighlight onPress={() => this.actionShow1()}>
              <View style={styles.collapseheader}>
                <View style={{ flexDirection: 'column' }}>
                  <Text style={styles.textheader}>Technical Request </Text>
                  <Text style={styles.subtextheader}>Telematics</Text>
                </View>
                <Image source={Images.arrowDown} style={styles.imageArrow} tintColor={"white"} />
              </View>
            </TouchableHighlight>
          } else if (this.state.show1 === true && this.props.navigation.state.params.ticketCatIdSend == 8 ) { 
            viewShow1 = <View>
              <TouchableHighlight onPress={() => this.actionShow1false()}>
                <View style={styles.collapseheader}>
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={styles.textheader}>Technical Request </Text>
                    <Text style={styles.subtextheader}>Telematics</Text>
                  </View>
                  <Image source={Images.arrowUp} style={styles.imageArrow} tintColor={"white"} />
                </View>
              </TouchableHighlight>
              <View style={{ backgroundColor: 'white' }}>

                {showImage}
                <View style={{ flexDirection: 'row', marginTop: 5, padding: 10 }}>
                  <ScrollView horizontal={true}>
                    {showFile}
                  </ScrollView>
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
                {showReftiket}
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'row', width: '100%' }}>
                    <View style={{ width: '20%' }}>
                      <Text style={styles.textall}>TR Type</Text>
                    </View>
                    <View style={{ width: '5%' }}>
                      <Text style={styles.textall}>:</Text>
                    </View>
                    <View style={{ width: '75%' }}>
                      <Text style={styles.textall}>Telematics</Text>
                    </View>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>DPPM Number</Text>
                    <Text style={styles.textBold}>{this.state.dppmnum} </Text>
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
                    <Text style={styles.textall}>Make</Text>
                    {showMake}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Branch</Text>
                    <Text style={styles.textBold}>{this.state.SalesOffice},{this.state.SalesOfficeDescription}</Text>
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
                    <Text style={styles.textall}>SMU Date</Text>
                    {/* <Text style={styles.textBold}>{this.state.smuDate}</Text>  */}
                    {showSmuDate}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Part Causing Failure</Text>
                    <Text style={styles.textBold}>{this.state.dataPcf}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Part Description</Text>
                    {showPd}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Problem Description</Text>
                    {showDescription}
                  </View>
                </View>
                {showResolusion}
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>Responder</Text>
                        {showResponder} 
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Submitter</Text>
                    <Text style={styles.textBold}>{this.state.submiterName}</Text>
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
                
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                   <View style={{ flexDirection: 'column', width: '100%' }}>
                      <Text style={styles.textall}>Tags</Text>
                      {showTags}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  {showRating}
                  {showratingtoresponder}
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                  <Text style={[styles.textall,{marginBottom : 10}]}>TR Status</Text>
                    <Text style={styles.textall}>{showStatus}</Text>
                    {/* <Text style={styles.textall}>Status</Text> */}
                    {statusbar}
                  </View>
                </View>
              </View>
            </View>
          }
      //password
          if (this.state.show1 === false && this.props.navigation.state.params.ticketCatIdSend == 7) { 
            viewShow1 = <TouchableHighlight onPress={() => this.actionShow1()}>
              <View style={styles.collapseheader}>
                <View style={{ flexDirection: 'column' }}>
                  <Text style={styles.textheader}>Technical Request </Text>
                  <Text style={styles.subtextheader}>Password</Text>
                </View>
                <Image source={Images.arrowDown} style={styles.imageArrow} tintColor={"white"} />
              </View>
            </TouchableHighlight>
          } else if (this.state.show1 === true && this.props.navigation.state.params.ticketCatIdSend == 7) { 
            viewShow1 = <View>
              <TouchableHighlight onPress={() => this.actionShow1false()}>
                <View style={styles.collapseheader}>
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={styles.textheader}>Technical Request </Text>
                    <Text style={styles.subtextheader}>Password</Text>
                  </View>
                  <Image source={Images.arrowUp} style={styles.imageArrow} tintColor={"white"} />
                </View>
              </TouchableHighlight>
              <View style={{ backgroundColor: 'white' }}>
                
                {showImage}
                <View style={{ flexDirection: 'row', marginTop: 5, padding: 10 }}>
                  <ScrollView horizontal={true}>
                    {showFile}
                  </ScrollView>
                </View>

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
                      <Text style={styles.textall}>Password</Text>
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
                {showReftiket}
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Unit Serial Number</Text>
                    {showSerial}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>DPPM Number</Text>
                    <Text style={styles.textBold}>{this.state.dppmnum} </Text>
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
                    <Text style={styles.textall}>Branch</Text>
                    <Text style={styles.textBold}>{this.state.SalesOffice},{this.state.SalesOfficeDescription}</Text>
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
                    <Text style={styles.textall}>SMU Date</Text>
                    {/* <Text style={styles.textBold}>{this.state.smuDate}</Text>  */}
                    {showSmuDate}
                  </View>
                </View>
                {/* <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>Manufacture</Text>
                        {showManufacture} 
                    </View>
                </View> */}
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>SMU</Text>
                    {showSmu}
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
                        <Text style={styles.textall}>From Interlock</Text>
                        <Text style={styles.textBold}>{this.state.dataFinterlock}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>To Interlock</Text>
                        <Text style={styles.textBold}>{this.state.dataTinterlock}</Text>
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
                        <Text style={styles.textall}>Software Part Number</Text>
                    <Text style={styles.textBold}>{this.state.dataSoftware}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>Test Spesification</Text>
                        <Text style={styles.textBold}>{this.state.dataTS}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>Test Spesifikasi With Brake</Text>
                        <Text style={styles.textBold}>{this.state.dataTSWB}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>Request Description</Text>
                        {showDescription} 
                    </View>
                </View>
                {showResolusion}
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                        <Text style={styles.textall}>Responder</Text>
                        {showResponder} 
                    </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Submitter</Text>
                    <Text style={styles.textBold}>{this.state.submiterName}</Text>
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
                
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                   <View style={{ flexDirection: 'column', width: '100%' }}>
                      <Text style={styles.textall}>Tags</Text>
                      {showTags}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  {showRating}
                  {showratingtoresponder}
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                  <Text style={[styles.textall,{marginBottom : 10}]}>TR Status</Text>
                    <Text style={styles.textall}>{showStatus}</Text>
                    {/* <Text style={styles.textall}>Status</Text> */}
                    {statusbar}
                  </View>
                  {showbtnGeneratePass}
                </View>
                
              </View>
            </View>
            
          }
          //condition monitoring
          if (this.state.show1 === false && this.props.navigation.state.params.ticketCatIdSend == 10) {
            viewShow1 = <TouchableHighlight onPress={() => this.actionShow1()}>
              <View style={styles.collapseheader}>
                <View style={{ flexDirection: 'column' }}>
                  <Text style={styles.textheader}>Technical Request </Text>
                  <Text style={styles.subtextheader}>Condiiton Monitoring</Text>
                </View>
                <Image source={Images.arrowDown} style={styles.imageArrow} tintColor={"white"} />
              </View>
            </TouchableHighlight>
          } else if (this.state.show1 === true && this.props.navigation.state.params.ticketCatIdSend == 10 ) {
            viewShow1 = <View>
              <TouchableHighlight onPress={() => this.actionShow1false()}>
                <View style={styles.collapseheader}>
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={styles.textheader}>Technical Request </Text>
                    <Text style={styles.subtextheader}>Condition Monitoring</Text>
                  </View>
                  <Image source={Images.arrowUp} style={styles.imageArrow} tintColor={"white"} />
                </View>
              </TouchableHighlight>
              <View style={{ backgroundColor: 'white' }}>

                {showImage}
                <View style={{ flexDirection: 'row', marginTop: 5, padding: 10 }}>
                  <ScrollView horizontal={true}>
                    {showFile}
                  </ScrollView>
                </View>

                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'row', width: '100%' }}>
                    <View style={{ width: '20%' }}>
                      <Text style={styles.textall}>TR NO</Text>
                    </View>
                    <View style={{ width: '5%' }}>
                      <Text style={styles.textall}>:</Text>
                    </View>
                    <View style={{ marginLeft: 20, marginRight: 20 }}>
                      {showTicketno}
                    </View>
                  </View>
                </View>
                {showReftiket}
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
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>DPPM Number</Text>
                    <Text style={styles.textBold}>{this.state.dppmnum} </Text>
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
                    <Text style={styles.textall}>Branch</Text>
                    <Text style={styles.textBold}>{this.state.SalesOffice},{this.state.SalesOfficeDescription}</Text>
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
                    <Text style={styles.textall}>SMU Date</Text>
                    {/* <Text style={styles.textBold}>{this.state.smuDate}</Text>  */}
                    {showSmuDate}
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
                {showResolusion}
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Responder</Text>
                    {/* {this.getemployeeName(this.state.dataResponder)} */}
                    {showResponder}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Submitter</Text>
                    <Text style={styles.textBold}>{this.state.submiterName}</Text> 
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
                
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                    <Text style={styles.textall}>Tags</Text>
                    {showTags}
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  {showRating}
                  {showratingtoresponder}
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                  <Text style={[styles.textall,{marginBottom : 10}]}>TR Status</Text>
                    <Text style={styles.textall}>{showStatus}</Text>
                    {/* <Text style={styles.textall}>Status</Text> */}
                    {statusbar}
                  </View>
                </View>
              </View>
            </View>
          }
          //help desk
          if (this.state.show1 === false && this.props.navigation.state.params.ticketCatIdSend == 9) {
            viewShow1 = <TouchableHighlight onPress={() => this.actionShow1()}>
              <View style={styles.collapseheader}>
                <View style={{ flexDirection: 'column' }}>
                  <Text style={styles.textheader}>Technical Request</Text>
                  <Text style={styles.subtextheader}>Help Desk</Text>
                </View>
                <Image source={Images.arrowDown} style={styles.imageArrow} tintColor={"white"} />
              </View>
            </TouchableHighlight>
          } else if (this.state.show1 === true && this.props.navigation.state.params.ticketCatIdSend == 9) {
            viewShow1 = <View>
              <TouchableHighlight onPress={() => this.actionShow1false()}>
                <View style={styles.collapseheader}>
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={styles.textheader}>Technical Request </Text>
                    <Text style={styles.subtextheader}>Help Desk</Text>
                  </View>
                  <Image source={Images.arrowUp} style={styles.imageArrow} tintColor={"white"} />
                </View>
              </TouchableHighlight>
              <View style={{ backgroundColor: 'white' }}>

                {showImage}
                <View style={{ flexDirection: 'row', marginTop: 5, padding: 10 }}>
                  <ScrollView horizontal={true}>
                    {showFile}
                  </ScrollView>
                </View>

              <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View style={{ flexDirection: 'row', width: '100%' }}>
                    <View style={{ width: '25%' }}>
                      <Text style={styles.textall}>TR NO</Text>
                    </View>
                    <View style={{ width: '5%' }}>
                      <Text style={styles.textall}>:</Text>
                    </View>
                    <View style={{ width: '75%' }}>
                      <Text style={styles.textall}>{this.state.dataTicketno}</Text>
                    </View>
                  </View>
                </View>
                {showReftiket}
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View style={{ flexDirection: 'row', width: '100%' }}>
                    <View style={{ width: '25%' }}>
                      <Text style={styles.textall}>TR Type</Text>
                    </View>
                    <View style={{ width: '5%' }}>
                      <Text style={styles.textall}>:</Text>
                    </View>
                    <View style={{ width: '75%' }}>
                      <Text style={styles.textall}>Help Desk</Text>
                    </View>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View style={{ flexDirection: 'row', width: '100%' }}>
                    <View style={{ width: '25%' }}>
                      <Text style={styles.textall}>Title</Text>
                    </View>
                    <View style={{ width: '5%' }}>
                      <Text style={styles.textall}>:</Text>
                    </View>
                    <View style={{ width: '75%' }}>
                      <Text style={styles.textall}>{this.state.dataTitle}</Text>
                    </View>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View style={{ flexDirection: 'row', width: '100%' }}>
                    <View style={{ width: '25%' }}>
                      <Text style={styles.textall}>DPPM Number</Text>
                    </View>
                    <View style={{ width: '5%' }}>
                      <Text style={styles.textall}>:</Text>
                    </View>
                    <View style={{ width: '75%' }}>
                      <Text style={styles.textall}>{this.state.dppmnum}</Text>
                    </View>
                  </View>
                </View>
                <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View style={{ flexDirection: 'row', width: '100%' }}>
                    <View style={{ width: '25%' }}>
                      <Text style={styles.textall}>Submitter</Text>
                    </View>
                    <View style={{ width: '5%' }}>
                      <Text style={styles.textall}>:</Text>
                    </View>
                    <View style={{ width: '75%' }}>
                      <Text style={styles.textall}>{this.state.employeeNamesubmiter}</Text>
                    </View>
                  </View>
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
                    // onChangeText={(text) => this.setState({ dataDescription: text })}
                    editable={false}
                  />
                </View>
                {showResolusion}
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  {showRating}
                  {showratingtoresponder}
                </View>
                <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
                  <View style={{ flexDirection: 'column', width: '100%' }}>
                  <Text style={[styles.textall,{marginBottom : 10}]}>TR Status</Text>
                    <Text style={styles.textall}>{showStatus}</Text>
                    {/* <Text style={styles.textall}>Status</Text> */}
                    {statusbar}
                  </View>
                </View>
                
              </View>
            </View>
          }
      
          //disscusions
      if (this.state.show2 === false && this.state.Status != 1) {
            if (this.state.dataactive == true){
              viewShow2 = <TouchableHighlight onPress={() => this.actionShow2()}>
                <View style={styles.collapseheader2}>
                  <Text style={styles.textheader}>Discussion</Text>
                  <Image source={Images.arrowDown} style={styles.imageArrow} tintColor={"white"} />
                </View>
                
              </TouchableHighlight>
            }else{
              viewShow2 = <View></View>
            }

            
        } else if (this.state.show2 === true ){
          if (this.state.Status == 3 && this.state.Resolution != null){
            viewShow2 = <View>
              <TouchableHighlight onPress={() => this.actionShow2false()}>
                <View style={styles.collapseheader2}>
                  <Text style={styles.textheader}>Discussion</Text>
                  <Image source={Images.arrowUp} style={styles.imageArrow} tintColor={"white"} />
                </View>
              </TouchableHighlight>
              <View style={{ flexDirection: 'column' }}>
                {this.actionLoadingDiscuss()}
                {showinputdisscus}
              </View>
            </View>
          } else if (this.state.Status != 3 && this.state.Resolution != null){
            viewShow2 = <View>
              <TouchableHighlight onPress={() => this.actionShow2false()}>
                <View style={styles.collapseheader2}>
                  <Text style={styles.textheader}>Discussion</Text>
                  <Image source={Images.arrowUp} style={styles.imageArrow} tintColor={"white"} />
                </View>
              </TouchableHighlight>
              <View style={{ flexDirection: 'column' }}>
                {this.actionLoadingDiscuss()}

                {showinputdisscus}

                <View style={{ marginTop: 10, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>
                  <ScrollView horizontal={true}>
                    {
                      this.state.temporaryFileAttach.map((items, id) => {
                        {/* console.log(items) */}
                        let showImg
                        if (items.type == 'application/zip' || items.type == 'application/rar'){
                          showImg = <Image source={Images.foldeFile} style={{ width: 120, height: 120, borderRadius: 5 }} />
                        } else if (items.type == 'image/jpeg' || items.type == 'image/jpg'){
                          showImg = <Image source={{ uri: items.uri }} style={{ width: 120, height: 120, borderRadius: 5 }} />
                        }else {
                          showImg = <Image source={Images.documentAttch} style={{ width: 120, height: 120, borderRadius: 5 }} />
                        }

                        return (
                          <View style={{ flexDirection: 'column', marginLeft: 5, marginRight: 5 }}>
                            {showImg}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center', width: 120, marginTop: 10 }}>
                              <Text>{items.name}</Text>
                              <TouchableOpacity onPress={() => this.actionDeleteFile(items.name)}>
                                <View style={{ backgroundColor: '#CCCCCC', padding: 8, borderRadius: 100 }}>
                                  <Image source={Images.delete} style={{ width: 13, height: 13 }} tintColor={"black"} />
                                </View>
                              </TouchableOpacity>
                            </View>
                          </View>
                        )
                      })
                    }
                  </ScrollView>
                  
                </View>
                {showpapersend}
                {visbleresponder}

              </View>
            </View>
          }else{
            viewShow2 = <View>
                <TouchableHighlight onPress={() => this.actionShow2false()}>
                    <View style={styles.collapseheader2}>
                        <Text style={styles.textheader}>Discussion</Text>
                        <Image source={Images.arrowUp} style={styles.imageArrow} tintColor={"white"} />
                    </View>
              </TouchableHighlight>
                <View style={{ flexDirection: 'column' }}>
                    {this.actionLoadingDiscuss()}
                    
                    {showinputdisscus}
                
                    <View style={{ marginTop: 10, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>
                        <ScrollView horizontal={true}>
                            {
                                this.state.temporaryFileAttach.map((items, id) => {
                                  {/* console.log('temp img:',items) */}
                                  let showImg
                                  if (items.type == 'application/zip' || items.type == 'application/rar') {
                                    showImg = <Image source={Images.foldeFile} style={{ width: 100, height: 100, borderRadius: 5 }} />
                                  } else if (items.type == 'image/jpeg' || items.type == 'image/jpg') {
                                    showImg = <Image source={{ uri: items.uri }} style={{ width: 100, height: 100, borderRadius: 5 }} />
                                  } else {
                                    showImg = <Image source={Images.documentAttch} style={{ width: 100, height: 100, borderRadius: 5 }} />
                                  }

                                  return (
                                    <View style={{ flexDirection: 'column', marginLeft: 5, marginRight: 5, width:200 }}>
                                      {showImg}
                                      <View style={{ flexDirection: 'row', width: 100, marginTop: 10 }}>
                                        <Text style={{fontSize:10}}>{items.name}</Text>
                                        <TouchableOpacity onPress={() => this.actionDeleteFile(items.name)}>
                                          <View style={{ backgroundColor: '#CCCCCC', padding: 8, borderRadius: 100 }}>
                                            <Image source={Images.delete} style={{ width: 13, height: 13 }} tintColor={"black"} />
                                          </View>
                                        </TouchableOpacity>
                                      </View>
                                    </View>
                                  )
                                })
                            }
                        </ScrollView>
                    </View>
                    {showpapersend}
                    {visbleresponder}
                </View>
            </View>
          }

            
        }

        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#CCCCCC' }}>
                <View style={{ flex: 1, backgroundColor: "white" }}>
              <View style={{ backgroundColor: "black"}}>
                        <View style={{ padding: 15, paddingLeft: 10, flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                            <Image source={Images.ic_logo} style={{ width: 190, height: 35  }} />
                        </View>
                        
                    </View>
                    <ScrollView>
                        <View style={{ flexDirection: 'column', paddingBottom: 60 }}>
                            {/* <View style={{ backgroundColor: '#F6F6F6', flexDirection: 'column' }}> */}
                            {viewShow1}
                            {viewShow2}
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
                                            <Image source={{uri: this.state.userImage}} style={{ borderRadius: 100, width: 40, height: 40, borderWidth: 2, borderColor: 'rgb(170, 207, 202)' }} />
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
                                            <Image source={{uri: this.state.userImage}} style={{ borderRadius: 100, width: 40, height: 40, borderWidth: 2, borderColor: 'rgb(170, 207, 202)' }} />
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
                    <Modal isVisible={this.state.isModalRating}
                        animationIn='bounceIn'
                        animationOut='bounceOut'
                    >
                        <ScrollView>
                            <View style={styles.viewModalRating}>
                                <View style={{ top: 0, right: 0, position: 'absolute', backgroundColor: 'black', padding: 5 }}>
                                    <TouchableOpacity onPress={() => this.setState({ isModalRating: false })}>
                                        <Image source={Images.delete} style={{ width: 20, height: 20 }} />
                                    </TouchableOpacity>
                                </View>
                                <Text allowFontScaling={false} style={styles.textalertmodal}>Thank You</Text>
                                <Text allowFontScaling={false} style={styles.textalertmodal}>Please Rate Your Submitter</Text>
                                <View style={{ marginTop: 20 }}>
                                    <Image source={Images.imageDefault} style={styles.imageProfile} />
                                </View>
                                <View style={{ marginTop: 10 }}>
                                    <Text allowFontScaling={false} style={styles.textalertmodal}>Submitter</Text>
                                </View>
                                <View style={{ marginTop: 5 }}>
                                    {/* {this.state.employeeNameresponder.map((item) => {
                                      return ( */}
                                        <Text style={styles.textall}>{this.state.employeeNamesubmiter}</Text>
                                      {/* )
                                    })} */}
                                </View>
                                <View style={{ marginTop: 10, flexDirection: 'row' }}>
                                    {ratingPertama}
                                    {ratingKedua}
                                    {ratingKetiga}
                                    {ratingKeempat}
                                    {ratingKelima}
                                </View>
                                {showComment}
                                {/* <View style={{ width: '100%', marginTop: 10, padding: 10 }}>
                                    <TextInput
                                        style={styles.textInputStyleRating}
                                        placeholder="Type a message"
                                        defaultValue={this.state.textDiscus}
                                        multiline={true}
                                        allowFontScaling={false}
                                        numberOfLines={5}
                                        onChangeText={(text) => this.setState({ textdiscussRate: text })}
                                    />
                                </View> */}
                                <View style={{ marginTop: 10 }}>
                                    <TouchableOpacity onPress={() => this.postResolution()} style={styles.btnSubmitRating}>
                                        <Text allowFontScaling={false} style={{ fontWeight: '200', color: '#fff', fontSize: 15 }}>Submit</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    </Modal>
                    <Modal isVisible={this.state.isModalRatingResponder}
                        animationIn='bounceIn'
                        animationOut='bounceOut'
                      >
                <ScrollView>
                  <View style={styles.viewModalRating}>
                    <View style={{ top: 0, right: 0, position: 'absolute', backgroundColor: 'black', padding: 5 }}>
                      <TouchableOpacity onPress={() => this.setState({ isModalRatingResponder: false })}>
                        <Image source={Images.delete} style={{ width: 20, height: 20 }} />
                      </TouchableOpacity>
                    </View>
                    <Text allowFontScaling={false} style={styles.textalertmodal}>Thank You</Text>
                    <Text allowFontScaling={false} style={styles.textalertmodal}>Please Rate Responder</Text>
                    <View style={{ marginTop: 20 }}>
                      <Image source={Images.imageDefault} style={styles.imageProfile} />
                    </View>
                    <View style={{ marginTop: 10 }}>
                      <Text allowFontScaling={false} style={styles.textalertmodal}>Responder</Text>
                    </View>
                    <View style={{ marginTop: 5 }}>
                      
                          <Text style={styles.textall}>{ this.state.responderName}</Text>
                      
                    </View>
                    <View style={{ marginTop: 10, flexDirection: 'row' }}>
                      {ratingPertama}
                      {ratingKedua}
                      {ratingKetiga}
                      {ratingKeempat}
                      {ratingKelima}
                    </View>
                    {showComment}
                    <View style={{ marginTop: 10 }}>
                      <TouchableOpacity onPress={() => this.rateToresponder()} style={styles.btnSubmitRating}>
                        <Text allowFontScaling={false} style={{ fontWeight: '200', color: '#fff', fontSize: 15 }}>Submit</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ScrollView>
              </Modal>
                    <Modal isVisible={this.state.isModalResponSubmitter}
                        animationIn='bounceIn'
                        animationOut='bounceOut'
                    >
                        <View style={styles.viewModalRatingResponSubmitter}>
                            <View style={{ top: 0, right: 0, position: 'absolute', backgroundColor: 'black', padding: 5 }}>
                                <TouchableOpacity onPress={() => this.setState({ isModalResponSubmitter: false })}>
                                    <Image source={Images.delete} style={{ width: 20, height: 20 }} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginTop: 20 }}>
                                <Text allowFontScaling={false} style={styles.textalertmodal}>Thank you for your participation</Text>
                            </View>
                            <View style={{ marginTop: 20 }}>
                                <Image source={Images.imagCheckMark} style={styles.imageCheckMark} resizeMode='cover' />
                            </View>
                            <View style={{ marginTop: 20 }}>
                                <TouchableOpacity onPress={() => this.setState({ isModalResponSubmitter: false })} style={styles.btnSubmitRating}>
                                    <Text allowFontScaling={false} style={{ fontWeight: '200', color: '#fff', fontSize: 15 }}>Close</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </Modal>
                    <Modal isVisible={this.state.isModalResponSubmitterResponder}
                animationIn='bounceIn'
                animationOut='bounceOut'
              >
                <View style={styles.viewModalRatingResponSubmitter}>
                  <View style={{ top: 0, right: 0, position: 'absolute', backgroundColor: 'black', padding: 5 }}>
                    <TouchableOpacity onPress={() => this.setState({ isModalResponSubmitterResponder: false })}>
                      <Image source={Images.delete} style={{ width: 20, height: 20 }} />
                    </TouchableOpacity>
                  </View>
                  <View style={{ marginTop: 20 }}>
                    <Text allowFontScaling={false} style={styles.textalertmodal}>Thank you for your participation</Text>
                  </View>
                  <View style={{ marginTop: 20 }}>
                    <Image source={Images.imagCheckMark} style={styles.imageCheckMark} resizeMode='cover' />
                  </View>
                  <View style={{ marginTop: 20 }}>
                    <TouchableOpacity onPress={() => this.setState({ isModalResponSubmitterResponder: false })} style={styles.btnSubmitRating}>
                      <Text allowFontScaling={false} style={{ fontWeight: '200', color: '#fff', fontSize: 15 }}>Close</Text>
                    </TouchableOpacity>
                  </View>

                </View>
              </Modal>
                    <Modal
                        isVisible={this.state.isModalSend}
                        style={{ margin: 0 }}
                        onBackdropPress={() => this.setState({ isModalSend: false, showescalate: false })}
                    >
                        <View style={styles.viewmodalsend}>
                            {showmenurplyasnote}
                            {showbtnresolusion}
                            {btnescalate}
                            {/* <View style={{ marginTop: 15, borderBottomWidth: 1, flexDirection: 'row' }}>
                                <Image source={Images.lightLamp} style={[styles.imageArrow, { marginRight: 10 }]} tintColor={"black"} />
                                <TouchableOpacity onPress={() => this.actionEndTR()}>
                                    <Text style={{ color: '#000', fontSize: 15 }}>Write Solution</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginTop: 15, borderBottomWidth: 1, flexDirection: 'row' }}>
                                <Image source={Images.arrowRight} style={[styles.imageArrow, { marginRight: 10 }]} tintColor={"black"} />
                                <TouchableOpacity onPress={() => this.setState({ isModalSend: false })}>
                                    <Text style={{ color: '#000', fontSize: 15 }}>Escalate</Text>
                                </TouchableOpacity>
                            </View> */}
                        </View>
                    </Modal>
                    <Modal
                        isVisible={this.state.loaderAsNote}
                        style={{ margin: 0 }}
                        onBackdropPress={() => this.setState({ isModalSend: false, showescalate: false })}
                    >
                        <View style={{alignItems:'center'}}>
                            <ActivityIndicator size="large" color={'#FABA00'} />
                            <Text style={{marginTop:5}}>Please Wait</Text>
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
              <Modal isVisible={this.state.modalSuccses}
                animationIn='bounceIn'
                animationOut='bounceOut'
              >
                <View style={styles.viewmodal}>
                  <Text allowFontScaling={false} style={styles.textalertmodalDw}>Are you sure download files ?</Text>
                  <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 10 }}>
                    <TouchableOpacity onPress={() => this.toogleDownloadCancel()} style={styles.buttonmodalOK}>
                      <Text allowFontScaling={false} style={{ fontWeight: '200', color: '#fff' }}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.DownloadHandler(this.state.uriFiles, this.state.uriFileName)} style={styles.buttonmodalCancel}>
                      <Text allowFontScaling={false} style={{ fontWeight: '200', color: '#fff' }}>Ok</Text>
                    </TouchableOpacity>
                    
                  </View>
                </View>
              </Modal>

              <Modal isVisible={this.state.visiblemodalimage}
                animationIn='zoomIn'
                animationOut='zoomOut'
              >
                <View style={{alignItems:'center'}}>
                  <Image source={{uri: this.state.filemodalimage}} style={{ width: 250, height: 250, borderRadius: 5}} />
                  <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 10 }}>
                    <TouchableOpacity onPress={() => this.DownloadFile(this.state.filemodalimage, this.state.filename)} style={styles.buttonmodalOK5}>
                      <Text allowFontScaling={false} style={{ fontWeight: '200', color: '#fff' }}>Download</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.tooglemodalimage()} style={styles.buttonmodalOK6}>
                      <Text allowFontScaling={false} style={{ fontWeight: '200', color: '#fff' }}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
              <Modal isVisible={this.state.visibleModalSucsecEscalate}
                animationIn='bounceIn'
                animationOut='bounceOut'
              >
                <View style={{alignItems:'center', backgroundColor:'#fff', borderRadius:10, width:300, padding:10}}>
                  <Text allowFontScaling={false} style={{ fontWeight: '200' }}>{this.state.msgEscalate}</Text>
                  <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 5 }}>
                    <TouchableOpacity onPress={() => this.toogleSuccsesEscalate()} style={styles.buttonmodalOK}>
                      <Text allowFontScaling={false} style={{ fontWeight: '200', color: '#fff' }}>ok</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
              <Modal isVisible={this.state.desModalmandatory}
                animationIn='bounceIn'
                animationOut='bounceOut'
              >
                <View style={{ alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, width: 300, padding: 10 }}>
                  <Text allowFontScaling={false} style={{ fontWeight: '200' }}>Message is required</Text>
                  <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 5 }}>
                    <TouchableOpacity onPress={() => this.toogleMessageRequired()} style={styles.buttonmodalOK}>
                      <Text allowFontScaling={false} style={{ fontWeight: '200', color: '#fff' }}>ok</Text>
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
  itemText: {
    fontSize: 17,
    paddingTop: 7,
    paddingBottom: 7,
    margin: 5,
  },
  textheader: {
        fontSize: 17, color: 'white'
    },
    subtextheader: {
        fontSize: 14, color: 'white'
    },
  textInputStyle2: {
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
    marginTop: 10,
    width:300,
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
    bsave2: {
    padding: 5,
    backgroundColor: '#cccac4',
    borderRadius: 5,
    marginTop:10,
    height: 30
  },
  bnext2: {
    padding: 5,
    backgroundColor: '#FABA00',
    marginLeft: 10,
    borderRadius: 5,
    marginTop: 10,
    height: 30
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
      textalertmodalDw: {
        marginTop: 25,
        alignSelf: 'center',
        paddingBottom:5
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
      buttonmodalOK5: {
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
        color: '#fff',
        marginRight:5
      },
      buttonmodalOK6: {
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
        color: '#fff',
        marginLeft:5
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
        // width: Dimensions.get('window').width * 0.2,
        // height: Dimensions.get('window').width * 0.2,
        width: 30,
        height: 30,
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
    bannerText1:{
      color:'#888',
      fontSize:10,
      marginLeft:2
    },
    bannerText2:{
      color:'#fff',
      fontSize:10,
      marginLeft: 2
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