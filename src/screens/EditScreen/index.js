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
  SafeAreaView,
  Text,
  ActivityIndicator,
  BackHandler,
  Linking
} from 'react-native';
import { CardItem, Textarea, Form, Item, Label, Input, Container, Header, Content, Button, Icon, Separator, Picker } from 'native-base';
import Autocomplete from 'react-native-autocomplete-input';
import { ModalMenu, BottomBar } from '@component';
import { Images, API } from '@res';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker'
import ImageResizer from 'react-native-image-resizer'
import ImgToBase64 from 'react-native-image-base64'
import Modal from "react-native-modal";
import { StackActions, NavigationActions } from 'react-navigation';
import DocumentPicker from 'react-native-document-picker';
import { Dropdown } from 'react-native-material-dropdown';

console.disableYellowBox = true;
var idFile = 1;

export default class ReopenScreen extends React.Component {
  constructor(props) {
    super(props);
    var { height, width } = Dimensions.get('window');
    this.state = {
      custumer: '',
      location: '',
      make: '',
      delivery: '',
      arrangement: '',
      family: '',
      model: '',
      dataStatus : '',
      dataTicketno : '',
      dataTitle: this.props.navigation.state.params.titleSend,
      dataDescription: this.props.navigation.state.params.descSend,
      dataResponder : '',
      dataSerialNumber: [],
      dataserialnumberstr: this.props.navigation.state.params.serialNumberSend,
      dataCustomer : '',
      dataLocation : '',
      dataMake : '',
      dataDelivery : '',
      dataArrangement : '',
      dataFamily : '',
      dataModel : '',
      dataSMU: this.props.navigation.state.params.SmuSend,
      dataSMUCek:'',
      dataPcf : this.props.navigation.state.params.partFailureSend,
      dataPD : '',
      dataEmail : this.props.navigation.state.params.emailSend,
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
      dataWarrantystr : 0,
      dataTag: [],
      dataTags : [],
      dataAttch: [],
      // dataAttchment: this.props.navigation.state.params.AttchSend,
      
      tokenData: '',
      userName: '',
      locationUser1:'',
      locationUser2:'',
      attachmentImage: [],
      attachmentName: '',
      dataResponderArr: [],
      dataParticipant: [],
      
      temporaryParticipant: [],
      temporaryFileAttach: [],
      dataFileAttachement: [],
      temporaryAttachmentLevel: [],
      foto: '',
      addTag: [],
      temporaryAddTag: [],
      textTag: '',
      query: '',
      queryRes:'',
      query1: '',
      query2: '',
      show1: false,
      show2: false,
      show3: false,
      
      isModalBerhasil: false,
      responMessage: '',
      isLoadingSubmit: true,
      isLoadingSaveDraft: true,
      pageViewProfile: false,
      pageViewTR: false,
      dataAttch:[],
      modalResponse: false,
      messageResponse: '',

      showroundemenu:true,
      closemenu:false,
      queryResponder:'',
      attachmentLevel: [],
      SMUUpdate:'',
      isModalFailfetch: false,
      mandatoryMsg:'',
      modalMandatory: false,
      roleId : -1,
      roleName : "",
      roleTextColor : "#11100E"  
       // isModalFormKosongDataSMU: false,
      // isModalFormKosongSN: false,
      // isModalFormKosongTitle: false,
      // isModalFormKosongDescription: false,
      // isModalFormKosongResponder: false,
    }
    BackHandler.addEventListener('hardwareBackPress', this._onBackPress)
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
    this.getToken();
    console.log("participant did Mount")
    console.log(this.state.temporaryParticipant)
  }

  getToken = async () => {
    const mToken = await AsyncStorage.getItem('@token');
    const mUserName = await AsyncStorage.getItem('@userName'); 
    const mLocationUser1 = await AsyncStorage.getItem('@locationUser1'); 
    const mLocationUser2 = await AsyncStorage.getItem('@locationUser2');
    const mUserImage = await AsyncStorage.getItem('@uriimage');
    const mUserId = await AsyncStorage.getItem('@userid');
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
        userRole : mUserRoleName ,
      
        delegateId : mdelegateId,
        delegateTo_Name : mdelegateTo_Name,
        delegateStart: mdelegateStart,
        delegateEnd : mdelegateEnd,
        delegateCreated  : mdelegateCreated ,
        delegateStatus : mdelegateStatus ,
        userId : mUserId
      })
      // console.log(mToken)
      this.getListResponder();
      this.getListPartipant();
      this.getTiketDetail();
      this.getWarrantytype();
    }
    BackHandler.addEventListener('hardwareBackPress', this._onBackPress)
  }

  valueDropdown(item) {
    this.setState({
        idWarranty : item
    })
    // alert(this.state.idWarranty)
}

getWarrantytype(){
  var temp=[]
  fetch(API.getWarrantytype, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
      'AccessToken': this.state.tokenData,
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      var len = responseJson.length;
            if (len > 0)
            {
                for (let i = 0; i < len; i++){
                var dataObj = responseJson[i];
                var joined = {value: dataObj.WarrantyTypeId,
                label: dataObj.WarrantyTypeName}
                temp.push(joined)
                }
            }
            this.setState({
              dataWarranty: temp
          })
        //  console.log(JSON.stringify(this.state.dataWarranty))
    })
    .catch((error) => {
      console.log(error)
    });
}

  actionMyTechnicalScreen() {
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
    fetch(API.getTiketDetail + this.props.navigation.state.params.idData, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
        'AccessToken': this.state.tokenData,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        if (responseJson.message.code === 200) {
          var Data1 = responseJson.result
          let participants = Data1.Participants || []
          let filteredParticipants = []
          filteredParticipants = participants.filter((participant, index, self) => {
            console.log(participant)
            return index === self.findIndex((item) => {
              return participant.UserName == item.UserName
            })
          })
          // console.log(Data1)
          this.setState({
            dataTicketno : Data1.TicketNo,
            dataResponder : Data1.Responder,
            dataSubmiter : Data1.Submiter,
            dataCustomer : Data1.Customer,
            dataLocation : Data1.Location,
            dataMake : Data1.Make,
            dataDelivery : Data1.DeliveryDate,
            dataArrangement : Data1.ArrangementNo,
            dataFamily : Data1.Family,
            dataModel : Data1.Model,
            dataPD : Data1.PartsDescription,
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
            idWarranty : Data1.WarrantyTypeId,
            dataTags : Data1.Tags,
            dataAttch: Data1.Attachments,
            dataStatus : Data1.Status, 
            // query: Data1.ResponderDetails.Name,
            queryResponder: Data1.ResponderDetails.UserName,
            dataPartCausing: Data1.PartCausingFailure,
            dataFinterlock: Data1.FromInterlock,
            dataTinterlock: Data1.ToInterlock,
            dataSoftware: Data1.SoftwarePartNumber,
            dataTS: Data1.TestSpec,
            dataTSWB: Data1.TestSpecBrakeSaver,
            warrantyName: Data1.WarrantyCategoryName,
            dataSMU: Data1.SMU
          });

          if (Data1.ResponderDetails.Name != null){
            this.setState({
              query: Data1.ResponderDetails.Name,
            })
          }
          
          if (Data1.ServiceOrderNumber != null){
            this.setState({
              dataSON: Data1.ServiceOrderNumber
            })
          }

          if (this.state.dataserialnumberstr != null){
            this.setState({
              query1: this.state.dataserialnumberstr,
            })
          }

          if (Data1.Participants != null){
            this.setState({
              temporaryParticipant: filteredParticipants
            })
          }


          if (Data1.Attachments != null){
            for (var i = 0; i < Data1.Attachments.length; i++){
            this.setState({temporaryFileAttach: [
              ...this.state.temporaryFileAttach, {
                uri: Data1.Attachments[i].Uri,
                type: 'image/jpeg',
                name: Data1.Attachments[i].Name
              }
            ]})
          }
            for (var i = 0; i < Data1.Attachments.length; i++) {
              this.setState({
                temporaryAttachmentLevel: [
                  ...this.state.temporaryAttachmentLevel, 
                  Data1.Attachments[i].Level
                ]
              })
            }
          }

          if (Data1.Tags != null){
            for (var i = 0; i < Data1.Tags.length; i++) {
              this.setState({
                temporaryAddTag: [
                  ...this.state.temporaryAddTag,{
                    Name: Data1.Tags[i].Name
                  }
                ]
              })
              this.setState({
                addTag: [
                  ...this.state.addTag, {
                    Name: Data1.Tags[i].Name
                  }
                ]
              })
            }
          }
          // console.log(this.props.navigation.state.params.idData)
          this.getemployeeName(this.dataParticipant)
          this.getDataMEP(this.state.dataserialnumberstr)
        } else {
          this.setState({ loadingData: true, loadingDataKosong: true })
        }

      })
      .catch((error) => {
        console.log(error)
      });
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

  actionTR() {
    this.setState({ pageViewTR: true });
  }

  getemployeeName(data) {
    fetch(API.getName, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
        'AccessToken': this.state.tokenData,
      },
      body: JSON.stringify( [this.state.dataResponder] ),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        var Data1 = responseJson.data
        // console.log(Data1)
        if (responseJson.status.code === 200) {
          this.setState({ employeeNameresponder: Data1 })
        }
      })
      .catch((error) => {
        console.log(error)
      });
  }

  getListSerialNumber(data) {
    this.setState({ query1: data })
    if (data.length >= 4) {
      return this.getDataSerial(data);
    }
  }

  getDataSerial(data) {
    fetch(API.getDataSerial + data, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
        'AccessToken': this.state.tokenData,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        let Data1 = responseJson.result
        this.setState({
          dataSerialNumber: Data1,
        });
      })
      .catch((error) => {
        console.log(error)
      });
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
        let Data4 = responseJson.data
        this.setState({
          dataResponderArr: Data4,
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
    const { dataResponderArr } = this.state;
    const regex = new RegExp(`${query.trim()}`, 'i');
    return dataResponderArr.filter(data => data.Name.search(regex) >= 0);
  }

  findDataSerial(query1) {
    if (query1 === '') {
      return [];
    }
    const { dataSerialNumber } = this.state;
    const regex = new RegExp(`${query1.trim()}`, 'i');
    return dataSerialNumber.filter(data => data.search(regex) >= 0);
  }

  findDataParticipant(query2) {
    if (query2 === '') {
      return [];
    }
    const { dataParticipant } = this.state;
    const regex = new RegExp(`${query2.trim()}`, 'i');
    return dataParticipant.filter(data => data.Name.search(regex) >= 0);
  }


  actionSerialNumber(item) {
    this.setState({ query1: item })
    this.getDataMEP2(item)
  }

  getDataMEP2(data) {
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
          custumer: Data1.CustomerName,
          location: Data1.ShipToAddress,
          make: Data1.Make,
          // delivery: Data1.DeliveryDate,
          arrangement: Data1.ArrNumber,
          family: Data1.PT,
          familyPtDescription: Data1.PTDescription,
          model: Data1.Model,
          dataSMU: Data1.SMU,
          // SMUUpdate: Data1.SMUUpDate,
          SalesOffice: Data1.SalesOffice,
          SalesOfficeDescription: Data1.SalesOfficeDescription
        })
        if (Data1.SMUUpDate != null){
          this.setState({
            SMUUpdate: Data1.SMUUpDate.substring(0, 10)
          })
        }else{
          this.setState({
            SMUUpDate : ''
          })
        }
        if (Data1.DeliveryDate == null){
          this.setState({
            delivery : ''
          })
        }else{
          this.setState({
            delivery: Data1.DeliveryDate.substring(0, 10)
          })
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
          custumer: Data1.CustomerName,
          location: Data1.ShipToAddress,
          make: Data1.Make,
          // delivery: Data1.DeliveryDate,
          arrangement: Data1.ArrNumber,
          family: Data1.PT,
          familyPtDescription: Data1.PTDescription,
          model: Data1.Model,
          // dataSMU: Data1.SMU,
          // SMUUpdate: Data1.SMUUpDate,
          SalesOffice: Data1.SalesOffice,
          SalesOfficeDescription: Data1.SalesOfficeDescription
        })
        if (Data1.SMUUpDate != null){
          this.setState({
            SMUUpdate: Data1.SMUUpDate.substring(0, 10)
          })
        }else{
          this.setState({
            SMUUpDate : ''
          })
        }
        if (Data1.DeliveryDate == null){
          this.setState({
            delivery : ''
          })
        }else{
          this.setState({
            delivery: Data1.DeliveryDate.substring(0, 10)
          })
        }
      })
      .catch((error) => {
        console.log(error)
      });
  }

  getListPartipant() {
    fetch(API.getListParticipant, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
        'AccessToken': this.state.tokenData,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        let Data3 = responseJson.data
        this.setState({
          dataParticipant: Data3,
        });
      })
      .catch((error) => {
        console.log(error)
      });
  }

  putEditTrproduct() {
    this.setState({ isLoadingSubmit: false })
    const Data1 = this.state.temporaryParticipant
    var dataArray = []
    for (var i = 0; i < this.state.temporaryParticipant.length; i++) {
      var dataItem =
        Data1[i].UserName

      dataArray = [...dataArray, dataItem]
    }
    this.setState({ queryParticipant: dataArray });

    var formData = new FormData();
    formData.append('Title', "" + this.state.dataTitle);
    formData.append('Description', "" + this.state.dataDescription);
    formData.append('Responder', "" + this.state.queryResponder);
    formData.append('SerialNumber', "" + this.state.query1);
    formData.append('SMU', "" + this.state.dataSMU);
    formData.append('PartCausingFailure', "" + this.state.dataPartCausing);
    formData.append('PartsDescription', "" + this.state.dataPD);
    formData.append('EmailCC', "" + this.state.dataEmail);
    formData.append('TicketId', this.props.navigation.state.params.idData);
    formData.append('IsDraft', 'false');

    this.state.temporaryAddTag.forEach((tags) => {
      formData.append('Tags', tags.Name);
    });

    this.state.temporaryParticipant.forEach((item) => {
      formData.append('Participants', item.UserName)
    })

    this.state.temporaryAttachmentLevel.forEach((attachmentsLevelItem) => {
      formData.append('AttachmentsLevel', "" + attachmentsLevelItem);
    });

    // if(this.state.temporaryFileAttach.length === 0) {
    //   formData.append('Attachments[]', "{'uri' : '', 'type' : '', 'image': ''}")
    // }

    this.state.temporaryFileAttach.forEach((attachmentsItem) => {
      formData.append('Attachments[]', {
        uri: "" + attachmentsItem.uri,
        type: "" + attachmentsItem.type,
        name: "" + attachmentsItem.name
      });
    });
    // console.log('ini akan di send ke API: ' +JSON.stringify(formData))
    
    // Alert.alert("Save product", JSON.stringify(formData))
    fetch(API.registerProduct,
      {
        'body': formData,
        headers: {
          'Accept': 'application/json',
          'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
          'AccessToken': this.state.tokenData,
          'Content-Type': 'multipart/FORM-data'
        },
        method: 'PUT'
      }
    ).then((response) => {
      // console.log("response = " + JSON.stringify(response));
      return response.json();
    }).catch((eror) => {
      this.setState({
        isModalFailfetch: true,
      })
    })
      .then((response) => {
        var dataObj = JSON.stringify(response.status.code)
        if (dataObj === 201 || dataObj === '201') {
          this.setState({
            isModalBerhasil: true,
            isLoadingSubmit: true,
            responMessage: response.status.description,
          })
        } else {
          this.setState({
            isModalBerhasil: true,
            responMessage: JSON.stringify(response.status.description),
          })
        }
      }).catch((eror) => {
        // console.log("Error Property Json = " + eror);
      });
  }

  putEditTrParttechnical() {
    this.setState({ isLoadingSubmit: false })
    const Data1 = this.state.temporaryParticipant
    var dataArray = []
    for (var i = 0; i < this.state.temporaryParticipant.length; i++) {
      var dataItem = {
        Username: Data1[i].UserName
      }
      dataArray = [...dataArray, dataItem]
    }
    this.setState({ queryParticipant: dataArray });

    var formData = new FormData();
    formData.append('Title', "" + this.state.dataTitle);
    formData.append('Description', "" + this.state.dataDescription);
    formData.append('SerialNumber', "" + this.state.query1);
    formData.append('SMU', "" + this.state.dataSMU);
    formData.append('PartsDescription', "" + this.state.dataPD);
    formData.append('Manufacture', "" + this.state.dataManufacture);
    formData.append('PartsNumber', "" + this.state.dataPN);
    formData.append('Responder', "" + this.state.queryResponder);
    formData.append('EmailCC', "" + this.state.dataEmail);
    formData.append('TicketId', this.props.navigation.state.params.idData);
    formData.append('IsDraft', 'false');

    this.state.temporaryAddTag.forEach((tags) => {
      formData.append('Tags', tags.Name);
    });

    this.state.temporaryParticipant.forEach((item) => {
      formData.append('Participants', item.UserName)
    })


    this.state.temporaryAttachmentLevel.forEach((attachmentsLevelItem) => {
      formData.append('AttachmentsLevel', "" + attachmentsLevelItem);
    });
    this.state.temporaryFileAttach.forEach((attachmentsItem) => {
      formData.append('Attachments[]', {
        uri: "" + attachmentsItem.uri,
        type: "" + attachmentsItem.type,
        name: "" + attachmentsItem.name
      });
    });

    fetch(API.registerPartsTechnical,
      {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
          'AccessToken': this.state.tokenData,
          'Content-Type': 'multipart/FORM-data'
        },
        'body': formData
      }
    )
      .then(function (response) {
        return response.json();
      }).then((response) => {
        var dataObj = JSON.stringify(response.status.code)
        // alert(dataObj)
        if (dataObj === 201 || dataObj === '201') {
          this.setState({
            isModalBerhasil: true,
            isLoadingSubmit: true,
            responMessage: response.status.description
          })
        } else {
          this.setState({
            isModalBerhasil: true,
            responMessage: JSON.stringify(response.status.description),
          })
        }
      })
      .catch(function (error) {
        // console.log("-------- error ------- " + error);
        // alert("response:" + error)
      });
  }

  putEditTrDimension() {
    this.setState({ isLoadingSubmit: false })
    const Data1 = this.state.temporaryParticipant
    var dataArray = []
    for (var i = 0; i < this.state.temporaryParticipant.length; i++) {
      var dataItem = {
        Username: Data1[i].UserName
      }
      dataArray = [...dataArray, dataItem]
    }
    this.setState({ queryParticipant: dataArray });
    var formData = new FormData();
    formData.append('Title', "" + this.state.dataTitle);
    formData.append('Description', "" + this.state.dataDescription);
    formData.append('PartsDescription', "" + this.state.dataPD);
    formData.append('Manufacture', "" + this.state.dataManufacture);
    formData.append('PartsNumber', "" + this.state.dataPN);
    formData.append('Responder', "" + this.state.queryResponder);
    formData.append('EmailCC', "" + this.state.dataEmail);
    formData.append('TicketId', this.props.navigation.state.params.idData);
    formData.append('IsDraft', 'false');

    this.state.temporaryAddTag.forEach((tags) => {
      formData.append('Tags', tags.Name);
    });

    this.state.temporaryParticipant.forEach((item) => {
      formData.append('Participants', item.UserName)
    })

    this.state.temporaryAttachmentLevel.forEach((attachmentsLevelItem) => {
      formData.append('AttachmentsLevel', "" + attachmentsLevelItem);
    });
    this.state.temporaryFileAttach.forEach((attachmentsItem) => {
      formData.append('Attachments[]', {
        uri: "" + attachmentsItem.uri,
        type: "" + attachmentsItem.type,
        name: "" + attachmentsItem.name
      });
    });

    fetch(API.registerDimension,
      {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
          'AccessToken': this.state.tokenData,
          'Content-Type': 'multipart/FORM-data'
        },
        'body': formData
      }
    ).then(function (response) {
        return response.json();
      }).then((response) => {
        var dataObj = JSON.stringify(response.message.code)
        console.log(response.message.code);
        // alert(dataObj)
        if (dataObj === 201 || dataObj === '201') {
          this.setState({
            isModalBerhasil: true,
            isLoadingSubmit: true,
            responMessage: JSON.stringify(response.status.description),
            dataTitle: '',
            dataDescription: '',
            dataManufacture: '',
            dataPartsDescription: '',
            dataPartsNumber: '',
            textTag: '',
            query: '',
            query1: '',
            query2: '',
            queryResponder: '',
            email: '',
            temporaryAddTag: [],
            temporaryFileAttach: [],
            temporaryParticipant: [],
            queryResponder: '',
            queryParticipant: [],
          })
        } else {
          this.setState({
            isModalBerhasil: true,
            responMessage: JSON.stringify(response.status.description),
          })
        }
      })
      .catch(function (error) {
         console.log("-------- error ------- " + error);
         alert("response:" + error)
      });
  }

  putEditTrreference() {
    this.setState({ isLoadingSubmit: false })
    const Data1 = this.state.temporaryParticipant
    var dataArray = []
    for (var i = 0; i < this.state.temporaryParticipant.length; i++) {
      var dataItem = {
        Username: Data1[i].UserName
      }
      dataArray = [...dataArray, dataItem]
    }
    this.setState({ queryParticipant: dataArray });

    var formData = new FormData();
    formData.append('Title', "" + this.state.dataTitle);
    formData.append('Description', "" + this.state.dataDescription);
    formData.append('Responder', "" + this.state.queryResponder);
    formData.append('SerialNumber', "" + this.state.query1);
    formData.append('SMU', "" + this.state.dataSMU);
    formData.append('PartCausingFailure', "" + this.state.dataPartCausing);
    formData.append('EmailCC', "" + this.state.dataEmail);
    formData.append('TicketId', this.props.navigation.state.params.idData);
    formData.append('IsDraft', 'false');

    this.state.temporaryAddTag.forEach((tags) => {
      formData.append('Tags', tags.Name);
    });

    this.state.temporaryParticipant.forEach((item) => {
      formData.append('Participants', item.UserName)
    })

    this.state.temporaryAttachmentLevel.forEach((attachmentsLevelItem) => {
      formData.append('AttachmentsLevel', "" + attachmentsLevelItem);
    });
    this.state.temporaryFileAttach.forEach((attachmentsItem) => {
      formData.append('Attachments[]', {
        uri: "" + attachmentsItem.uri,
        type: "" + attachmentsItem.type,
        name: "" + attachmentsItem.name
      });
    });
    // console.log('ini akan di send ke API: ' +JSON.stringify(formData))
    fetch(API.registerReference,
      {
        'body': formData,
        headers: {
          'Accept': 'application/json',
          'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
          'AccessToken': this.state.tokenData,
          'Content-Type': 'multipart/FORM-data'
        },
        method: 'PUT'
      }
    ).then((response) => {
      // console.log("response = " + JSON.stringify(response));
      return response.json();
    }).then((response) => {
        var dataObj = JSON.stringify(response.status.code)
        if (dataObj === 201 || dataObj === '201') {
          this.setState({
            isModalBerhasil: true,
            isLoadingSubmit: true,
            responMessage: response.status.description,
            dataTitle: '',
            dataDescription: '',
            query: '',
            query1: '',
            query2: '',
            dataSMU: '',
            SMU: '',
            dataPartCausing: '',
            email: '',
            temporaryAddTag: [],
            temporaryFileAttach: [],
            temporaryParticipant: [],
            temporaryAttachmentLevel: [],
            attachmentLevel: [],
            queryResponder: '',
            queryParticipant: [],
            textTag: '',
            custumer: '',
            location: '',
            make: '',
            delivery: '',
            arrangement: '',
            family: '',
            model: ''
          })
        } else {
          this.setState({
            isModalBerhasil: true,
            responMessage: JSON.stringify(response.status.description),
          })
        }
      }).catch((eror) => {
        console.log("Error Property Json = " + eror);
      });

  }

  putEditTrWaranty() {
    this.setState({ isLoadingSubmit: false })
    const Data1 = this.state.temporaryParticipant
    var dataArray = []
    for (var i = 0; i < this.state.temporaryParticipant.length; i++) {
      var dataItem = {
        Username: Data1[i].UserName
      }
      dataArray = [...dataArray, dataItem]
    }
    this.setState({ queryParticipant: dataArray });
    var formData = new FormData();
    formData.append('Title', "" + this.state.dataTitle);
    formData.append('Description', "" + this.state.dataDescription);
    formData.append('SerialNumber', "" + this.state.query1);
    formData.append('SMU', "" + this.state.dataSMU);
    formData.append('PartCausingFailure', "" + this.state.dataPcf);
    formData.append('PartsDescription', "" + this.state.dataPD);
    formData.append('ServiceOrderNumber', "" + this.state.dataSON);
    formData.append('ClaimNumber', "" + this.state.dataClaim);
    formData.append('WarrantyTypeId', "" + this.state.idWarranty);
    formData.append('Responder', "" + this.state.queryResponder);

    formData.append('EmailCC', "" + this.state.dataEmail);
    formData.append('TicketId', this.props.navigation.state.params.idData);
    formData.append('IsDraft', 'false');
    this.state.temporaryAddTag.forEach((tags) => {
      formData.append('Tags', tags.Name);
    });

    this.state.temporaryParticipant.forEach((item) => {
      formData.append('Participants', item.UserName)
    })
    this.state.temporaryAttachmentLevel.forEach((attachmentsLevelItem) => {
      formData.append('AttachmentsLevel', "" + attachmentsLevelItem);
    });
    this.state.temporaryFileAttach.forEach((attachmentsItem) => {
      formData.append('Attachments[]', {
        uri: "" + attachmentsItem.uri,
        type: "" + attachmentsItem.type,
        name: "" + attachmentsItem.name
      });
    });
// console.log('ini akan di send ke API: ' + JSON.stringify(formData))
    fetch(API.registerWarranty,
      {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
          'AccessToken': this.state.tokenData,
          'Content-Type': 'multipart/FORM-data'
        },
        'body': formData
      }
    ).then(function (response) {
        return response.json();
      }).then((response) => {
        var dataObj = JSON.stringify(response.status.code)
        if (dataObj === 201 || dataObj === '201') {
          this.setState({
            isModalBerhasil: true,
            isLoadingSubmit: true,
            responMessage: JSON.stringify(response.status.description)
          })
        } else {
          this.setState({
            isModalBerhasil: true,
            responMessage: JSON.stringify(response.status.description),
          })
        }
      })
      .catch(function (error) {
        console.log("-------- error ------- " + error);
      });
  }

  putEditTrGoodwill() {
    this.setState({ isLoadingSubmit: false })
    const Data1 = this.state.temporaryParticipant
    var dataArray = []
    for (var i = 0; i < this.state.temporaryParticipant.length; i++) {
      var dataItem = {
        Username: Data1[i].UserName
      }
      dataArray = [...dataArray, dataItem]
    }
    this.setState({ queryParticipant: dataArray });
    var formData = new FormData();
    formData.append('Title', "" + this.state.dataTitle);
    formData.append('Description', "" + this.state.dataDescription);
    formData.append('SerialNumber', "" + this.state.query1);
    formData.append('SMU', "" + this.state.dataSMU);
    formData.append('PartCausingFailure', "" + this.state.dataPartCausing);
    formData.append('PartsDescription', "" + this.state.dataPD);
    formData.append('ServiceOrderNumber', "" + this.state.dataSON);
    formData.append('ClaimNumber', "" + this.state.dataClaim);
    formData.append('Responder', "" + this.state.queryResponder);
    formData.append('TicketId', this.props.navigation.state.params.idData);
    formData.append('EmailCC', "" + this.state.dataEmail);
    formData.append('IsDraft', 'false');
    this.state.temporaryAddTag.forEach((tags) => {
      formData.append('Tags', tags.Name);
    });

    this.state.temporaryParticipant.forEach((item) => {
      formData.append('Participants', item.UserName)
    })
    this.state.temporaryAttachmentLevel.forEach((attachmentsLevelItem) => {
      formData.append('AttachmentsLevel', "" + attachmentsLevelItem);
    });
    this.state.temporaryFileAttach.forEach((attachmentsItem) => {
      formData.append('Attachments[]', {
        uri: "" + attachmentsItem.uri,
        type: "" + attachmentsItem.type,
        name: "" + attachmentsItem.name
      });
    });

    fetch(API.registerGoodwill,
      {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
          'AccessToken': this.state.tokenData,
          'Content-Type': 'multipart/FORM-data'
        },
        'body': formData
      }
    )
      .then(function (response) {
        return response.json();
      })
      .then((response) => {
        // alert(JSON.stringify(response))
        var dataObj = JSON.stringify(response.status.code)
        // alert(dataObj)
        if (dataObj === 201 || dataObj === '201') {
          this.setState({
            isModalBerhasil: true,
            isLoadingSubmit: true,
            responMessage: response.status.description
          })
        } else {
          this.setState({
            isModalBerhasil: true,
            responMessage: JSON.stringify(response.status.description),
          })
        }
      })
      .catch(function (error) {
        // console.log("-------- error ------- " + error);
        // alert("response:" + error)
      });
  }

  putEditTrPassword() {
    this.setState({ isLoadingSubmit: false })
    const Data1 = this.state.temporaryParticipant
    var dataArray = []
    for (var i = 0; i < this.state.temporaryParticipant.length; i++) {
      var dataItem = {
        Username: Data1[i].UserName
      }
      dataArray = [...dataArray, dataItem]
    }
    this.setState({ queryParticipant: dataArray });
    var formData = new FormData();
    formData.append('Title', "" + this.state.dataTitle);
    formData.append('Description', "" + this.state.dataDescription);
    formData.append('SerialNumber', "" + this.state.query1);
    formData.append('ServiceToolSN', "" + this.state.dataService);
    formData.append('EngineSN', "" + this.state.dataEngine);
    formData.append('EcmSN', "" + this.state.dataEcm);
    formData.append('TotalTattletale', "" + this.state.dataTotal);
    formData.append('ReasonCode', "" + this.state.dataReason);
    formData.append('FromInterlock', "" + this.state.dataFinterlock);
    formData.append('ToInterlock', "" + this.state.dataTinterlock);
    formData.append('SoftwarePartNumber', "" + this.state.dataSoftware);
    formData.append('TestSpec', "" + this.state.dataTS);
    formData.append('TestSpecBrakeSaver', "" + this.state.dataTSWB);
    formData.append('SerialNuDiagnosticClockmber', "" + this.state.dataDiagnostic);
    formData.append('Responder', "" + this.state.queryResponder);
    formData.append('EmailCC', "" + this.state.dataEmail);
    formData.append('SMU', "" + this.state.dataSMU);
    formData.append('TicketId', this.props.navigation.state.params.idData);
    formData.append('IsDraft', 'false');
    this.state.temporaryAddTag.forEach((tags) => {
      formData.append('Tags', tags.Name);
    });

    this.state.temporaryParticipant.forEach((item) => {
      formData.append('Participants', item.UserName)
    })
    this.state.temporaryAttachmentLevel.forEach((attachmentsLevelItem) => {
      formData.append('AttachmentsLevel', "" + attachmentsLevelItem);
    });
    this.state.temporaryFileAttach.forEach((attachmentsItem) => {
      formData.append('Attachments[]', {
        uri: "" + attachmentsItem.uri,
        type: "" + attachmentsItem.type,
        name: "" + attachmentsItem.name
      });
    });
    // console.log('ini akan di send ke API: ' +JSON.stringify(formData))
    fetch(API.registerPassword,
      {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
          'AccessToken': this.state.tokenData,
          'Content-Type': 'multipart/FORM-data'
        },
        'body': formData
      }
    )
      .then(function (response) {
        return response.json();
      })
      .then((response) => {
        var dataObj = JSON.stringify(response.status.code)
        if (dataObj === 201 || dataObj === '201') {
          this.setState({
            isModalBerhasil: true,
            isLoadingSubmit: true,
            responMessage: JSON.stringify(response.status.description),
            dataTitle: '',
            dataDescription: '',
            query1: '',
            dataServiceTool: '',
            dataEngine: '',
            dataEcm: '',
            dataTotal: '',
            dataReason: '',
            curTime: '',
            dataManufacture: '',
            dataSMU: '',
            dataPartCausing: '',
            query: '',
            query2: '',
            email: '',
            textTag: '',
            temporaryAddTag: [],
            temporaryFileAttach: [],
            temporaryParticipant: [],
            queryResponder: '',
            queryParticipant: []
          })
        } else {
          this.setState({
            isModalBerhasil: true,
            responMessage: JSON.stringify(response.status.description),
          })
        }
      })
      .catch(function (error) {
        // console.log("-------- error ------- " + error);
        // alert("response:" + error)
      });
  }

  putEditTrTelematic() {
    this.setState({ isLoadingSubmit: false })
    const Data1 = this.state.temporaryParticipant
    var dataArray = []
    for (var i = 0; i < this.state.temporaryParticipant.length; i++) {
      var dataItem = {
        Username: Data1[i].UserName
      }
      dataArray = [...dataArray, dataItem]
    }
    this.setState({ queryParticipant: dataArray });

    var formData = new FormData();
    formData.append('Title', "" + this.state.dataTitle);
    formData.append('Description', "" + this.state.dataDescription);
    formData.append('Responder', "" + this.state.queryResponder);
    formData.append('SerialNumber', "" + this.state.query1);
    formData.append('SMU', "" + this.state.dataSMU);
    formData.append('PartCausingFailure', "" + this.state.dataPartCausing);
    formData.append('PartsDescription', "" + this.state.dataPD);
    formData.append('EmailCC', "" + this.state.dataEmail);
    formData.append('TicketId', this.props.navigation.state.params.idData);
    // formData.append('', this.state.temporaryFileAttach);
    formData.append('IsDraft', false);

    this.state.temporaryAddTag.forEach((tags) => {
      formData.append('Tags', tags.Name);
    });

    this.state.temporaryParticipant.forEach((item) => {
      formData.append('Participants', item.UserName)
    })

    this.state.temporaryAttachmentLevel.forEach((attachmentsLevelItem) => {
      formData.append('AttachmentsLevel', "" + attachmentsLevelItem);
    });
    this.state.temporaryFileAttach.forEach((attachmentsItem) => {
      formData.append('Attachments[]', {
        uri: "" + attachmentsItem.uri,
        type: "" + attachmentsItem.type,
        name: "" + attachmentsItem.name
      });
    });
    // console.log('ini akan di send ke API: ' +JSON.stringify(formData))
    fetch(API.registerTelematics,
      {
        'body': formData,
        headers: {
          'Accept': 'application/json',
          'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
          'AccessToken': this.state.tokenData,
          'Content-Type': 'multipart/FORM-data'
        },
        method: 'PUT'
      }
    ).then((response) => {
      // console.log("response = " + JSON.stringify(response));
      return response.json();
    }).then((response) => {
        var dataObj = JSON.stringify(response.status.code)
        if (dataObj === 201 || dataObj === '201') {
          this.setState({
            isModalBerhasil: true,
            isLoadingSubmit: true,
            responMessage: response.status.description
          })
        } else {
          this.setState({
            isModalBerhasil: true,
            responMessage: JSON.stringify(response.status.description),
          })
        }
      }).catch((eror) => {
        console.log("Error Property Json = " + eror);
      });

  }

  putEditTrHelpDesk() {
    this.setState({ isLoadingSubmit: false })
    const Data1 = this.state.temporaryParticipant
    var dataArray = []
    for (var i = 0; i < this.state.temporaryParticipant.length; i++) {
      var dataItem = {
        Username: Data1[i].UserName
      }
      dataArray = [...dataArray, dataItem]
    }
    this.setState({ queryParticipant: dataArray });
    var formData = new FormData();
    formData.append('Title', "" + this.state.dataTitle);
    formData.append('Description', "" + this.state.dataDescription);
    formData.append('Responder', "" + this.state.queryResponder);
    formData.append('EmailCC', "" + this.state.dataEmail);
    formData.append('TicketId', this.props.navigation.state.params.idData);
    formData.append('IsDraft', 'false');

    this.state.temporaryAddTag.forEach((tags) => {
      formData.append('Tags', tags.Name);
    });

    this.state.temporaryParticipant.forEach((item) => {
      formData.append('Participants', item.UserName)
    })
    this.state.temporaryAttachmentLevel.forEach((attachmentsLevelItem) => {
      formData.append('AttachmentsLevel', "" + attachmentsLevelItem);
    });
    this.state.temporaryFileAttach.forEach((attachmentsItem) => {
      formData.append('Attachments[]', {
        uri: "" + attachmentsItem.uri,
        type: "" + attachmentsItem.type,
        name: "" + attachmentsItem.name
      });
    });

    fetch(API.registerHelpDesk,
      {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
          'AccessToken': this.state.tokenData,
          'Content-Type': 'multipart/FORM-data'
        },
        'body': formData
      }
    )
      .then(function (response) {
        return response.json();
      }).then((response) => {
        console.log(JSON.stringify(response))
        var dataObj = response.status.code
        if (dataObj === 200 || dataObj === '200') {
          this.setState({
            isModalBerhasil: true,
            isLoadingSubmit: true,
            responMessage: response.status.description,
            dataTitle: '',
            dataDescription: '',
            query: '',
            query2: '',
            email: '',
            textTag: '',
            temporaryAddTag: [],
            temporaryFileAttach: [],
            temporaryParticipant: [],
            queryResponder: '',
            queryParticipant: []
          })
        } else {
          this.setState({
            isModalBerhasil: true,
            responMessage: JSON.stringify(response.status.description),
          })
        }
      })
      .catch(function (error) {
        console.log("-------- error ------- " + error);
        // alert("response:" + error)
      });
  }

  putEditTrCondition() {
    this.setState({ isLoadingSaveDraft: false })
    this.setState({ isLoadingSubmit: false })
    const Data1 = this.state.temporaryParticipant
    var dataArray = []
    for (var i = 0; i < this.state.temporaryParticipant.length; i++) {
      var dataItem = {
        Username: Data1[i].UserName
      }
      dataArray = [...dataArray, dataItem]
    }
    this.setState({ queryParticipant: dataArray });

    var formData = new FormData();
    formData.append('Title', "" + this.state.dataTitle);
    formData.append('Description', "" + this.state.dataDescription);
    formData.append('Responder', "" + this.state.queryResponder);
    formData.append('SerialNumber', "" + this.state.query1);
    formData.append('SMU', "" + this.state.dataSMU);
    formData.append('PartCausingFailure', "" + this.state.dataPartCausing);
    formData.append('TicketId', this.props.navigation.state.params.idData);
    formData.append('EmailCC', "" + this.state.dataEmail);
    formData.append('IsDraft', 'false');

    this.state.temporaryAddTag.forEach((tags) => {
      formData.append('Tags', tags.Name);
    });

    this.state.temporaryParticipant.forEach((item) => {
      formData.append('Participants', item.UserName)
    })

    this.state.temporaryAttachmentLevel.forEach((attachmentsLevelItem) => {
      formData.append('AttachmentsLevel', "" + attachmentsLevelItem);
    });
    this.state.temporaryFileAttach.forEach((attachmentsItem) => {
      formData.append('Attachments[]', {
        uri: "" + attachmentsItem.uri,
        type: "" + attachmentsItem.type,
        name: "" + attachmentsItem.name
      });
    });

    fetch(API.registerCondition,
      {
        'body': formData,
        headers: {
          'Accept': 'application/json',
          'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
          'AccessToken': this.state.tokenData,
          'Content-Type': 'multipart/FORM-data'
        },
        method: 'PUT'
      }
    )
      .then(function (response) {
        return response.json();
      })
      .then((response) => {
        // console.log(response)
        var dataObj = JSON.stringify(response.status.code)
        if (dataObj === 201 || dataObj === '201') {
          this.setState({
            isModalBerhasil: true,
            isLoadingSaveDraft: true,
            responMessage: response.status.description
          })
        } else {
          this.setState({
            isModalBerhasil: true,
            responMessage: JSON.stringify(response.status.description),
          })
        }
      })
      .catch(function (error) {
        console.log("-------- error ------- " + error);
      });
  }

  

  saveDraft() {
    this.setState({ isLoadingSaveDraft: false })
    let body = JSON.stringify({
      Title: this.state.dataTitle,
      Description: this.state.dataDescription,
      Responder: this.state.query,
      SerialNumber: this.state.query1,
      SMU: this.state.dataSMU,
      PartCausingFailure: this.state.dataPcf,
      EmailCC: this.state.dataEmail,
      Tags: this.state.temporaryAddTag,
      Attachments: this.state.temporaryFileAttach,
      Participants: this.state.temporaryParticipant,
      IsDraft: true
    })
    // Alert.alert("saveDraft", body)

    fetch(API.register,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
          'AccessToken': this.state.tokenData,
        },
        body: JSON.stringify({
          Title: this.state.dataTitle,
          Description: this.state.dataDescription,
          Responder: this.state.query,
          SerialNumber: this.state.query1,
          SMU: this.state.dataSMU,
          PartCausingFailure: this.state.dataPcf,
          EmailCC: this.state.dataEmail,
          Tags: this.state.temporaryAddTag,
          Attachments: this.state.temporaryFileAttach,
          Participants: this.state.temporaryParticipant,
          IsDraft: true
        }),
      }
    )
      .then(function (response) {
        return response.json();
      })
      .then((response) => {
        var dataObj = JSON.stringify(response.status.code)
        // alert(dataObj)
        if (dataObj === 201 || dataObj === '201') {
          this.setState({
            isModalBerhasil: true,
            isLoadingSaveDraft: true,
            responMessage: response.status.description
          })
        } else {
          this.setState({
            isModalBerhasil: true,
            responMessage: JSON.stringify(response.status.description),
          })
        }
      })
      .catch(function (error) {
        console.log("-------- error ------- " + error);
      });
  }

  saveDraftPutProduct() {
    this.setState({ isLoadingSaveDraft: false })
    const Data1 = this.state.temporaryParticipant
    var dataArray = []
    for (var i = 0; i < this.state.temporaryParticipant.length; i++) {
      var dataItem = {
        Username: Data1[i].UserName
      }
      // if(dataArray.indexOf(dataItem) < 0) dataArray = [...dataArray, dataItem]
      dataArray = [...dataArray, dataItem]
    }
    console.log(dataArray)
    this.setState({ queryParticipant: dataArray });

    var formData = new FormData();
    formData.append('Title', "" + this.state.dataTitle);
    formData.append('Description', "" + this.state.dataDescription);
    formData.append('Responder', "" + this.state.queryResponder);
    formData.append('SerialNumber', "" + this.state.query1);
    formData.append('SMU', "" + this.state.dataSMU);
    formData.append('PartCausingFailure', "" + this.state.dataPartCausing);
    formData.append('PartsDescription', "" + this.state.dataPD);
    formData.append('EmailCC', "" + this.state.dataEmail);
    formData.append('TicketId', this.props.navigation.state.params.idData);
    formData.append('IsDraft', 'true');

    this.state.temporaryAddTag.forEach((tags) => {
      formData.append('Tags', tags.Name);
    });

    this.state.temporaryParticipant.forEach((item) => {
      formData.append('Participants', item.UserName)
    })

    this.state.temporaryAttachmentLevel.forEach((attachmentsLevelItem) => {
      formData.append('AttachmentsLevel', "" + attachmentsLevelItem);
    });
    this.state.temporaryFileAttach.forEach((attachmentsItem) => {
      formData.append('Attachments[]', {
        uri: "" + attachmentsItem.uri,
        type: "" + attachmentsItem.type,
        name: "" + attachmentsItem.name
      });
    });
    // console.log('ini akan di send ke API: ' + JSON.stringify(formData))

    // Alert.alert("saveDraftPutProduct", JSON.stringify(formData))
    // console.log("BODY")
    // console.log(JSON.stringify(formData))
    fetch(API.registerProduct,
      {
        'body': formData,
        headers: {
          'Accept': 'application/json',
          'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
          'AccessToken': this.state.tokenData,
          'Content-Type': 'multipart/FORM-data'
        },
        method: 'PUT'
      }
    ).then((response) => {
      console.log("response = " + JSON.stringify(response));
      return response.json();
    }).then((response) => {

        var dataObj = JSON.stringify(response.status.code)
        if (dataObj === 201 || dataObj === '201') {
          this.setState({
            isModalBerhasil: true,
            isLoadingSaveDraft: true,
            responMessage: response.status.description,
          })
        } else {
          this.setState({
            isModalBerhasil: true,
            responMessage: JSON.stringify(response.status.description),
          })
        }
      }).catch((eror) => {
        console.log("Error Property Json = " + eror);
      });
  }

  saveDraftPutPartTechnical() {
    this.setState({ isLoadingSaveDraft: false })
    const Data1 = this.state.temporaryParticipant
    var dataArray = []
    for (var i = 0; i < this.state.temporaryParticipant.length; i++) {
      var dataItem = {
        Username: Data1[i].UserName
      }
      dataArray = [...dataArray, dataItem]
    }
    this.setState({ queryParticipant: dataArray });

    var formData = new FormData();
    formData.append('Title', "" + this.state.dataTitle);
    formData.append('Description', "" + this.state.dataDescription);
    formData.append('SerialNumber', "" + this.state.query1);
    formData.append('SMU', "" + this.state.dataSMU);
    formData.append('PartsDescription', "" + this.state.dataPD);
    formData.append('Manufacture', "" + this.state.dataManufacture);
    formData.append('PartsNumber', "" + this.state.dataPN);
    formData.append('Responder', "" + this.state.queryResponder);
    formData.append('EmailCC', "" + this.state.dataEmail);
    formData.append('TicketId', this.props.navigation.state.params.idData);
    formData.append('IsDraft', 'true');

    
    this.state.temporaryAddTag.forEach((tags) => {
      formData.append('Tags', tags.Name);
    });

    this.state.temporaryParticipant.forEach((item) => {
      formData.append('Participants', item.UserName)
    })


    this.state.temporaryAttachmentLevel.forEach((attachmentsLevelItem) => {
      formData.append('AttachmentsLevel', "" + attachmentsLevelItem);
    });
    this.state.temporaryFileAttach.forEach((attachmentsItem) => {
      formData.append('Attachments[]', {
        uri: "" + attachmentsItem.uri,
        type: "" + attachmentsItem.type,
        name: "" + attachmentsItem.name
      });
    });

    fetch(API.registerPartsTechnical,
      {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
          'AccessToken': this.state.tokenData,
          'Content-Type': 'multipart/FORM-data'
        },
        'body': formData
      }
    )
      .then(function (response) {
        return response.json();
      })
      .then((response) => {
        var dataObj = JSON.stringify(response.status.code)
        // alert(dataObj)
        if (dataObj === 201 || dataObj === '201') {
          this.setState({
            isModalBerhasil: true,
            isLoadingSaveDraft: true,
            responMessage: response.status.description
          })
        } else {
          this.setState({
            isModalBerhasil: true,
            responMessage: JSON.stringify(response.status.description),
          })
        }
      })
      .catch(function (error) {
        // console.log("-------- error ------- " + error);
        // alert("response:" + error)
      });
  }

  saveDraftPutDimension() {
    this.setState({ isLoadingSaveDraft: false })
    const Data1 = this.state.temporaryParticipant
    var dataArray = []
    for (var i = 0; i < this.state.temporaryParticipant.length; i++) {
      var dataItem = {
        Username: Data1[i].UserName
      }
      dataArray = [...dataArray, dataItem]
    }
    this.setState({ queryParticipant: dataArray });
    var formData = new FormData();
    formData.append('Title', "" + this.state.dataTitle);
    formData.append('Description', "" + this.state.dataDescription);
    formData.append('PartsDescription', "" + this.state.dataPD);
    formData.append('Manufacture', "" + this.state.dataManufacture);
    formData.append('PartsNumber', "" + this.state.dataPN);
    formData.append('Responder', "" + this.state.queryResponder);
    formData.append('EmailCC', "" + this.state.dataEmail);
    formData.append('TicketId', this.props.navigation.state.params.idData);
    formData.append('IsDraft', 'true');

    this.state.temporaryAddTag.forEach((tags) => {
      formData.append('Tags', tags.Name);
    });

    this.state.temporaryParticipant.forEach((item) => {
      formData.append('Participants', item.UserName)
    })

    this.state.temporaryAttachmentLevel.forEach((attachmentsLevelItem) => {
      formData.append('AttachmentsLevel', "" + attachmentsLevelItem);
    });
    this.state.temporaryFileAttach.forEach((attachmentsItem) => {
      formData.append('Attachments[]', {
        uri: "" + attachmentsItem.uri,
        type: "" + attachmentsItem.type,
        name: "" + attachmentsItem.name
      });
    });
    // console.log('ini akan di send ke API: ' + JSON.stringify(formData))
    fetch(API.registerDimension,
      {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
          'AccessToken': this.state.tokenData,
          'Content-Type': 'multipart/FORM-data'
        },
        'body': formData
      }
    )
      .then(function (response) {
        return response.json();
      })
      .then((response) => {
        var dataObj = JSON.stringify(response.status.code)
        // alert(dataObj)
        console.log(dataObj);
        if (dataObj === 201 || dataObj === '201') {
          this.setState({
            isModalBerhasil: true,
            isLoadingSaveDraft: true,
            responMessage: JSON.stringify(response.status.description)
          })
        } else {
          this.setState({
            isModalBerhasil: true,
            responMessage: JSON.stringify(response.status.description),
          })
        }
      })
      .catch(function (error) {
        console.log("-------- error ------- " + error);
      });
  }

  saveDraftPutRefence() {
    this.setState({ isLoadingSaveDraft: false })
    const Data1 = this.state.temporaryParticipant
    var dataArray = []
    for (var i = 0; i < this.state.temporaryParticipant.length; i++) {
      var dataItem = {
        Username: Data1[i].UserName
      }
      dataArray = [...dataArray, dataItem]
    }
    this.setState({ queryParticipant: dataArray });

    var formData = new FormData();
    formData.append('Title', "" + this.state.dataTitle);
    formData.append('Description', "" + this.state.dataDescription);
    formData.append('Responder', "" + this.state.queryResponder);
    formData.append('SerialNumber', "" + this.state.query1);
    formData.append('SMU', "" + this.state.dataSMU);
    formData.append('PartCausingFailure', "" + this.state.dataPartCausing);
    formData.append('EmailCC', "" + this.state.dataEmail);
    formData.append('TicketId', this.props.navigation.state.params.idData);
    formData.append('IsDraft', 'true');

    this.state.temporaryAddTag.forEach((tags) => {
      formData.append('Tags', tags.Name);
    });

    this.state.temporaryParticipant.forEach((item) => {
      formData.append('Participants', item.UserName)
    })

    this.state.temporaryAttachmentLevel.forEach((attachmentsLevelItem) => {
      formData.append('AttachmentsLevel', "" + attachmentsLevelItem);
    });
    this.state.temporaryFileAttach.forEach((attachmentsItem) => {
      formData.append('Attachments[]', {
        uri: "" + attachmentsItem.uri,
        type: "" + attachmentsItem.type,
        name: "" + attachmentsItem.name
      });
    });
    // console.log('ini akan di send ke API: ' +JSON.stringify(formData))
    fetch(API.registerReference,
      {
        'body': formData,
        headers: {
          'Accept': 'application/json',
          'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
          'AccessToken': this.state.tokenData,
          'Content-Type': 'multipart/FORM-data'
        },
        method: 'PUT'
      }
    ).then((response) => {
      console.log("response = " + JSON.stringify(response));
      return response.json();
    })
      .then((response) => {
        var dataObj = JSON.stringify(response.status.code)
        if (dataObj === 201 || dataObj === '201') {
          this.setState({
            isModalBerhasil: true,
            isLoadingSaveDraft: true,
            responMessage: response.status.description
          })
        } else {
          this.setState({
            isModalBerhasil: true,
            responMessage: JSON.stringify(response.status.description),
          })
        }
      }).catch((eror) => {
        console.log("Error Property Json = " + eror);
      });

  }

  saveDraftPutWaranty() {
    this.setState({ isLoadingSaveDraft: false })
    const Data1 = this.state.temporaryParticipant
    var dataArray = []
    for (var i = 0; i < this.state.temporaryParticipant.length; i++) {
      var dataItem = {
        Username: Data1[i].UserName
      }
      dataArray = [...dataArray, dataItem]
    }
    this.setState({ queryParticipant: dataArray });
    var formData = new FormData();
    formData.append('Title', "" + this.state.dataTitle);


    formData.append('Description', "" + this.state.dataDescription);
    formData.append('SerialNumber', "" + this.state.query1);
    formData.append('SMU', "" + this.state.dataSMU);
    formData.append('PartCausingFailure', "" + this.state.dataPcf);
    formData.append('PartsDescription', "" + this.state.dataPD);
    formData.append('ServiceOrderNumber', "" + this.state.dataSON);
    formData.append('ClaimNumber', "" + this.state.dataClaim);
    formData.append('WarrantyTypeId', "" + this.state.idWarranty);
    formData.append('Responder', "" + this.state.queryResponder);
    formData.append('EmailCC', "" + this.state.dataEmail);
    formData.append('TicketId', this.props.navigation.state.params.idData);
    formData.append('IsDraft', 'true');
    this.state.temporaryAddTag.forEach((tags) => {
      formData.append('Tags', tags.Name);
    });

    this.state.temporaryParticipant.forEach((item) => {
      formData.append('Participants', item.UserName)
    })
    this.state.temporaryAttachmentLevel.forEach((attachmentsLevelItem) => {
      formData.append('AttachmentsLevel', "" + attachmentsLevelItem);
    });
    this.state.temporaryFileAttach.forEach((attachmentsItem) => {
      formData.append('Attachments[]', {
        uri: "" + attachmentsItem.uri,
        type: "" + attachmentsItem.type,
        name: "" + attachmentsItem.name
      });
    });

    fetch(API.registerWarranty,
      {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
          'AccessToken': this.state.tokenData,
          'Content-Type': 'multipart/FORM-data'
        },
        'body': formData
      }
    )
      .then(function (response) {
        return response.json();
      })
      .then((response) => {
        console.log(response)
        var dataObj = JSON.stringify(response.status.code)
        if (dataObj === 201 || dataObj === '201') {
          this.setState({
            isModalBerhasil: true,
            isLoadingSaveDraft: true,
            responMessage: JSON.stringify(response.status.description)
          })
        } else {
          this.setState({
            isModalBerhasil: true,
            responMessage: JSON.stringify(response.status.description),
          })
        }
      })
      .catch(function (error) {
        console.log("-------- error ------- " + error);
        // alert("response:" + error)
      });
  }

  saveDraftPutGoodwill() {
    this.setState({ isLoadingSaveDraft: false })
    const Data1 = this.state.temporaryParticipant
    var dataArray = []
    for (var i = 0; i < this.state.temporaryParticipant.length; i++) {
      var dataItem = {
        Username: Data1[i].UserName
      }
      dataArray = [...dataArray, dataItem]
    }
    this.setState({ queryParticipant: dataArray });
    var formData = new FormData();
    formData.append('Title', "" + this.state.dataTitle);
    formData.append('Description', "" + this.state.dataDescription);
    formData.append('SerialNumber', "" + this.state.query1);
    formData.append('SMU', "" + this.state.dataSMU);
    formData.append('PartCausingFailure', "" + this.state.dataPartCausing);
    formData.append('PartsDescription', "" + this.state.dataPD);
    formData.append('ServiceOrderNumber', "" + this.state.dataSON);
    formData.append('ClaimNumber', "" + this.state.dataClaimNumber);
    formData.append('Responder', "" + this.state.queryResponder);
    formData.append('TicketId', this.props.navigation.state.params.idData);
    formData.append('EmailCC', "" + this.state.dataEmail);
    formData.append('IsDraft', 'true');
    this.state.temporaryAddTag.forEach((tags) => {
      formData.append('Tags', tags.Name);
    });

    this.state.temporaryParticipant.forEach((item) => {
      formData.append('Participants', item.UserName)
    })
    this.state.temporaryAttachmentLevel.forEach((attachmentsLevelItem) => {
      formData.append('AttachmentsLevel', "" + attachmentsLevelItem);
    });
    this.state.temporaryFileAttach.forEach((attachmentsItem) => {
      formData.append('Attachments[]', {
        uri: "" + attachmentsItem.uri,
        type: "" + attachmentsItem.type,
        name: "" + attachmentsItem.name
      });
    });

    fetch(API.registerGoodwill,
      {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
          'AccessToken': this.state.tokenData,
          'Content-Type': 'multipart/FORM-data'
        },
        'body': formData
      }
    )
      .then(function (response) {
        return response.json();
      })
      .then((response) => {
        var dataObj = JSON.stringify(response.status.code)
        if (dataObj === 201 || dataObj === '201') {
          this.setState({
            isModalBerhasil: true,
            isLoadingSaveDraft: true,
            responMessage: response.status.description
          })
        } else {
          this.setState({
            isModalBerhasil: true,
            responMessage: JSON.stringify(response.status.description),
          })
        }
      })
      .catch(function (error) {
        // console.log("-------- error ------- " + error);
        // alert("response:" + error)
      });
  }
  
  saveDraftPutPassword() {
    this.setState({ isLoadingSaveDraft: false })
    const Data1 = this.state.temporaryParticipant
    var dataArray = []
    for (var i = 0; i < this.state.temporaryParticipant.length; i++) {
      var dataItem = {
        Username: Data1[i].UserName
      }
      dataArray = [...dataArray, dataItem]
    }
    this.setState({ queryParticipant: dataArray });
    var formData = new FormData();
    formData.append('Title', "" + this.state.dataTitle);
    formData.append('Description', "" + this.state.dataDescription);
    formData.append('SerialNumber', "" + this.state.query1);
    formData.append('ServiceToolSN', "" + this.state.dataService);
    formData.append('EngineSN', "" + this.state.dataEngine);
    formData.append('EcmSN', "" + this.state.dataEcm);
    formData.append('TotalTattletale', "" + this.state.dataTotal);
    formData.append('ReasonCode', "" + this.state.dataReason);
    formData.append('FromInterlock', "" + this.state.dataFinterlock);
    formData.append('ToInterlock', "" + this.state.dataTinterlock);
    formData.append('SoftwarePartNumber', "" + this.state.dataSoftware);
    formData.append('TestSpec', "" + this.state.dataTS);
    formData.append('TestSpecBrakeSaver', "" + this.state.dataTSWB);
    formData.append('SerialNuDiagnosticClockmber', "" + this.state.dataDiagnostic);
    formData.append('Responder', "" + this.state.queryResponder);
    formData.append('EmailCC', "" + this.state.dataEmail);
    formData.append('TicketId', this.props.navigation.state.params.idData);
    formData.append('IsDraft', 'true');
    this.state.temporaryAddTag.forEach((tags) => {
      formData.append('Tags', tags.Name);
    });

    this.state.temporaryParticipant.forEach((item) => {
      formData.append('Participants', item.UserName)
    })
    this.state.temporaryAttachmentLevel.forEach((attachmentsLevelItem) => {
      formData.append('AttachmentsLevel', "" + attachmentsLevelItem);
    });
    this.state.temporaryFileAttach.forEach((attachmentsItem) => {
      formData.append('Attachments[]', {
        uri: "" + attachmentsItem.uri,
        type: "" + attachmentsItem.type,
        name: "" + attachmentsItem.name
      });
    });

    fetch(API.registerPassword,
      {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
          'AccessToken': this.state.tokenData,
          'Content-Type': 'multipart/FORM-data'
        },
        'body': formData
      }
    )
      .then(function (response) {
        return response.json();
      })
      .then((response) => {
        var dataObj = JSON.stringify(response.status.code)
        if (dataObj === 201 || dataObj === '201') {
          this.setState({
            isModalBerhasil: true,
            isLoadingSubmit: true,
            responMessage: JSON.stringify(response.status.description)
          })
        } else {
          this.setState({
            isModalBerhasil: true,
            responMessage: JSON.stringify(response.status.description),
          })
        }
      })
      .catch(function (error) {
        // console.log("-------- error ------- " + error);
        // alert("response:" + error)
      });
  }

  saveDraftPutTelematic() {
    this.setState({ isLoadingSaveDraft: false })
    const Data1 = this.state.temporaryParticipant
    var dataArray = []
    for (var i = 0; i < this.state.temporaryParticipant.length; i++) {
      var dataItem = {
        Username: Data1[i].UserName
      }
      dataArray = [...dataArray, dataItem]
    }
    this.setState({ queryParticipant: dataArray });

    var formData = new FormData();
    formData.append('Title', "" + this.state.dataTitle);
    formData.append('Description', "" + this.state.dataDescription);
    formData.append('Responder', "" + this.state.queryResponder);
    formData.append('SerialNumber', "" + this.state.query1);
    formData.append('SMU', "" + this.state.dataSMU);
    formData.append('PartCausingFailure', "" + this.state.dataPartCausing);
    formData.append('PartsDescription', "" + this.state.dataPD);
    formData.append('EmailCC', "" + this.state.dataEmail);
    formData.append('TicketId', this.props.navigation.state.params.idData);
    // formData.append('', this.state.temporaryFileAttach);
    formData.append('IsDraft', 'true');

    this.state.temporaryAddTag.forEach((tags) => {
      formData.append('Tags', tags.Name);
    });

    this.state.temporaryParticipant.forEach((item) => {
      formData.append('Participants', item.UserName)
    })

    this.state.temporaryAttachmentLevel.forEach((attachmentsLevelItem) => {
      formData.append('AttachmentsLevel', "" + attachmentsLevelItem);
    });
    this.state.temporaryFileAttach.forEach((attachmentsItem) => {
      formData.append('Attachments[]', {
        uri: "" + attachmentsItem.uri,
        type: "" + attachmentsItem.type,
        name: "" + attachmentsItem.name
      });
    });
    // console.log('ini akan di send ke API: ' +JSON.stringify(formData))
    fetch(API.registerTelematics,
      {
        'body': formData,
        headers: {
          'Accept': 'application/json',
          'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
          'AccessToken': this.state.tokenData,
          'Content-Type': 'multipart/FORM-data'
        },
        method: 'PUT'
      }
    ).then((response) => {
      console.log("response = " + JSON.stringify(response));
      return response.json();
    }).then((response) => {
        var dataObj = JSON.stringify(response.status.code)
        if (dataObj === 201 || dataObj === '201') {
          this.setState({
            isModalBerhasil: true,
            isLoadingSaveDraft: true,
            responMessage: response.status.description
          })
        } else {
          this.setState({
            isModalBerhasil: true,
            responMessage: JSON.stringify(response.status.description),
          })
        }
      }).catch((eror) => {
        console.log("Error Property Json = " + eror);
      });

  }

  saveDraftPuthelpDesk() {
    this.setState({ isLoadingSaveDraft: false })
    const Data1 = this.state.temporaryParticipant
    var dataArray = []
    for (var i = 0; i < this.state.temporaryParticipant.length; i++) {
      var dataItem = {
        Username: Data1[i].UserName
      }
      dataArray = [...dataArray, dataItem]
    }
    this.setState({ queryParticipant: dataArray });
    var formData = new FormData();
    formData.append('Title', "" + this.state.dataTitle);
    formData.append('Description', "" + this.state.dataDescription);
    formData.append('Responder', "" + this.state.queryResponder);
    formData.append('EmailCC', "" + this.state.dataEmail);
    formData.append('TicketId', this.props.navigation.state.params.idData);
    formData.append('IsDraft', 'true');

    this.state.temporaryAddTag.forEach((tags) => {
      formData.append('Tags', tags.Name);
    });

    this.state.temporaryParticipant.forEach((item) => {
      formData.append('Participants', item.UserName)
    })
    this.state.temporaryAttachmentLevel.forEach((attachmentsLevelItem) => {
      formData.append('AttachmentsLevel', "" + attachmentsLevelItem);
    });
    this.state.temporaryFileAttach.forEach((attachmentsItem) => {
      formData.append('Attachments[]', {
        uri: "" + attachmentsItem.uri,
        type: "" + attachmentsItem.type,
        name: "" + attachmentsItem.name
      });
    });

    fetch(API.registerHelpDesk,
      {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
          'AccessToken': this.state.tokenData,
          'Content-Type': 'multipart/FORM-data'
        },
        'body': formData
      }
    )
      .then(function (response) {
        return response.json();
      })
      .then((response) => {
        console.log(JSON.stringify(response))
        var dataObj = response.status.code
        if (dataObj === 200 || dataObj === '200') {
          this.setState({
            isModalBerhasil: true,
            isLoadingSaveDraft: true,
            responMessage: response.status.description
          })
        } else {
          this.setState({
            isModalBerhasil: true,
            responMessage: JSON.stringify(response.status.description),
          })
        }
      })
      .catch(function (error) {
        console.log("-------- error ------- " + error);
        // alert("response:" + error)
      });
  }

  saveDraftPutCondition() {
    this.setState({ isLoadingSaveDraft: false })
    const Data1 = this.state.temporaryParticipant
    var dataArray = []
    for (var i = 0; i < this.state.temporaryParticipant.length; i++) {
      var dataItem = {
        Username: Data1[i].UserName
      }
      dataArray = [...dataArray, dataItem]
    }
    this.setState({ queryParticipant: dataArray });

    var formData = new FormData();
    formData.append('Title', "" + this.state.dataTitle);
    formData.append('Description', "" + this.state.dataDescription);
    formData.append('Responder', "" + this.state.queryResponder);
    formData.append('SerialNumber', "" + this.state.query1);
    formData.append('SMU', "" + this.state.dataSMU);
    formData.append('PartCausingFailure', "" + this.state.dataPartCausing);
    formData.append('TicketId', this.props.navigation.state.params.idData);
    formData.append('EmailCC', "" + this.state.dataEmail);
    formData.append('IsDraft', 'true');

    this.state.temporaryAddTag.forEach((tags) => {
      formData.append('Tags', tags.Name);
    });

    this.state.temporaryParticipant.forEach((item) => {
      formData.append('Participants', item.UserName)
    })

    this.state.temporaryAttachmentLevel.forEach((attachmentsLevelItem) => {
      formData.append('AttachmentsLevel', "" + attachmentsLevelItem);
    });
    this.state.temporaryFileAttach.forEach((attachmentsItem) => {
      formData.append('Attachments[]', {
        uri: "" + attachmentsItem.uri,
        type: "" + attachmentsItem.type,
        name: "" + attachmentsItem.name
      });
    });

    fetch(API.registerCondition,
      {
        'body': formData,
        headers: {
          'Accept': 'application/json',
          'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
          'AccessToken': this.state.tokenData,
          'Content-Type': 'multipart/FORM-data'
        },
        method: 'PUT'
      }
    )
      .then(function (response) {
        return response.json();
      })
      .then((response) => {
        var dataObj = JSON.stringify(response.status.code)
        // alert(dataObj)
        if (dataObj === 201 || dataObj === '201') {
          this.setState({
            isModalBerhasil: true,
            isLoadingSaveDraft: true,
            responMessage: response.status.description
          })
        } else {
          this.setState({
            isModalBerhasil: true,
            responMessage: JSON.stringify(response.status.description),
          })
        }
      })
      .catch(function (error) {
        console.log("-------- error ------- " + error);
      });
  }

  validationForm() {
    // alert(this.props.navigation.state.params.ticketCatIdSend)
      if (this.props.navigation.state.params.ticketCatIdSend == 1){
        if(this.state.dataTitle == '' || this.state.dataTitle == null){
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Title is required'
          })
        }else if (this.state.dataDescription == ''){
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Description is required'
          })
        }else if (this.state.queryResponder == '' || this.state.queryResponder == null || this.state.query == ''){
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Responder is required'
          })
        }else if(this.state.query1 == ''){
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Serial number is required'
          })
        } else if (this.state.dataPartCausing == ''){
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Parts causing failure is required'
          })
        }else if (this.state.dataPD == ''){
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Parts description is required'
          })
        }else if (this.state.temporaryParticipant == '' || this.state.temporaryParticipant == []){
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Participant is required'
          })
        }else if (this.state.dataSMU == ''){
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'SMU is required'
          })
        }else{
          // alert('produk')
          this.putEditTrproduct();
        }
      }else if (this.props.navigation.state.params.ticketCatIdSend == 2){
        if (this.state.dataTitle == '' || this.state.dataTitle == null) {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Title is required'
          })
        } else if (this.state.dataDescription == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Description is required'
          })
        } else if (this.state.queryResponder == '' || this.state.queryResponder == null || this.state.query == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Responder is required'
          })
        } else if (this.state.query1 == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Serial number is required'
          })
        } else if (this.state.dataPD == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Parts description is required'
          })
        } else if (this.state.temporaryParticipant == '' || this.state.temporaryParticipant == []) {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Participant is required'
          })
        } else if (this.state.dataSMU == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'SMU is required'
          })
        } else if (this.state.dataPN == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Part number is required'
          })
        } else {
          // alert('part tecnical')
          this.putEditTrParttechnical();
        }
      } else if (this.props.navigation.state.params.ticketCatIdSend == 3){
        // return this.putEditTrDimension();
        if (this.state.dataTitle == '' || this.state.dataTitle == null) {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Title is required'
          })
        } else if (this.state.dataDescription == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Description is required'
          })
        } else if (this.state.queryResponder == '' || this.state.queryResponder == null || this.state.query == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Responder is required'
          })
        } else if (this.state.dataManufacture == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Parts causing failure is required'
          })
        } else if (this.state.dataPD == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Parts description is required'
          })
        } else if (this.state.temporaryParticipant == '' || this.state.temporaryParticipant == []) {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Participant is required'
          })
        } else if (this.state.dataPN == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Part number is required'
          })
        } else {
          // alert('dimension')
          this.putEditTrDimension();
        }
      } if (this.props.navigation.state.params.ticketCatIdSend == 4){
        // return this.putEditTrreference();
        if (this.state.dataTitle == '' || this.state.dataTitle == null) {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Title is required'
          })
        } else if (this.state.dataDescription == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Description is required'
          })
        } else if (this.state.queryResponder == '' || this.state.queryResponder == null || this.state.query == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Responder is required'
          })
        } else if (this.state.query1 == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Serial number is required'
          })
        } else if (this.state.dataPartCausing == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Parts causing failure is required'
          })
        } else if (this.state.temporaryParticipant == '' || this.state.temporaryParticipant == []) {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Participant is required'
          })
        } else if (this.state.dataSMU == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'SMU is required'
          })
        } else {
          // alert('referance')
          this.putEditTrreference();
        }
      } else if (this.props.navigation.state.params.ticketCatIdSend == 5){
        // return this.putEditTrWaranty();
        if (this.state.dataTitle == '' || this.state.dataTitle == null) {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Title is required'
          })
        } else if (this.state.dataDescription == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Description is required'
          })
        } else if (this.state.queryResponder == '' || this.state.queryResponder == null || this.state.query == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Responder is required'
          })
        } else if (this.state.query1 == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Serial number is required'
          })
        } else if (this.state.dataPcf == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Parts causing failure is required'
          })
        } else if (this.state.temporaryParticipant == '' || this.state.temporaryParticipant == []) {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Participant is required'
          })
        } else if (this.state.dataSMU == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'SMU is required'
          })
        } else if (this.state.dataPD == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Parts description is required'
          })
        } else if (this.state.dataSON == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Service order number is required'
          })
        } else if (this.state.idWarranty == 0) {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Waranty type is required'
          })
        }else if (this.state.dataClaim == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Claim number is required'
          })
        }else {
          // alert('warranty')
          this.putEditTrWaranty();
        }
      } else if (this.props.navigation.state.params.ticketCatIdSend == 6){
        // return this.putEditTrGoodwill();
        if (this.state.dataTitle == '' || this.state.dataTitle == null) {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Title is required'
          })
        } else if (this.state.dataDescription == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Description is required'
          })
        } else if (this.state.queryResponder == '' || this.state.queryResponder == null || this.state.query == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Responder is required'
          })
        } else if (this.state.query1 == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Serial number is required'
          })
        } else if (this.state.dataPcf == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Parts causing failure is required'
          })
        } else if (this.state.temporaryParticipant == '' || this.state.temporaryParticipant == []) {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Participant is required'
          })
        } else if (this.state.dataSMU == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'SMU is required'
          })
        } else if (this.state.dataPD == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Parts description is required'
          })
        } else if (this.state.dataSON == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Service order number is required'
          })
        } else if (this.state.dataPartCausing == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Parts causing failure is required'
          })
        } else if (this.state.dataClaim == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Claim number is required'
          })
        } else {
          // alert('goodwil')
          this.putEditTrGoodwill();
        }
      } else if (this.props.navigation.state.params.ticketCatIdSend == 7){
        // return this.putEditTrPassword();
        if(this.state.dataTitle == '' || this.state.dataTitle == null){
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Title is required'
          })
        }else if (this.state.dataDescription == ''){
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Request description is required'
          })
        }else if (this.state.queryResponder == '' || this.state.queryResponder == null || this.state.query == ''){
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Responder is required'
          })
        }else if(this.state.query1 == ''){
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Serial number is required'
          })
        } else if (this.state.dataService == ''){
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Service tool s/n is required'
          })
        } else if (this.state.dataEngine == ''){
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Engine s/n is required'
          })
        } else if (this.state.dataEcm == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'ECM s/n is required'
          })
        } else if (this.state.dataTotal == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Total tattletale is required'
          })
        } else if (this.state.dataReason == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Reason code is required'
          })
        } else if (this.state.dataFinterlock == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'From interlock is required'
          })
        } else if (this.state.dataTinterlock == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'To interlock is required'
          })
        } else if (this.state.dataSoftware == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Software part number is required'
          })
        } else if (this.state.dataTS == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Test Spesification is required'
          })
        } else if (this.state.dataTSWB == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Test Spesification with brakesaver is required'
          })
        } else if (this.state.dataDiagnostic == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Diagnostic clock is required'
          })
        }else if (this.state.temporaryParticipant == '' || this.state.temporaryParticipant == []) {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Participant is required'
          })
        }else{
          // alert('password')
          this.putEditTrPassword();
        }
      } else if (this.props.navigation.state.params.ticketCatIdSend == 8){
      //   return this.putEditTrTelematic();
        if (this.state.dataTitle == '' || this.state.dataTitle == null) {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Title is required'
          })
        } else if (this.state.dataDescription == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Description is required'
          })
        } else if (this.state.queryResponder == '' || this.state.queryResponder == null || this.state.query == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Responder is required'
          })
        } else if (this.state.query1 == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Serial number is required'
          })
        } else if (this.state.dataPartCausing == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Parts causing failure is required'
          })
        } else if (this.state.dataPD == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Parts description is required'
          })
        } else if (this.state.temporaryParticipant == '' || this.state.temporaryParticipant == []) {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Participant is required'
          })
        } else if (this.state.dataSMU == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'SMU is required'
          })
        } else {
          // alert('telematic')
          this.putEditTrTelematic();
        }
      } else if (this.props.navigation.state.params.ticketCatIdSend == 9){
        // return this.putEditTrHelpDesk();
        if (this.state.dataTitle == '' || this.state.dataTitle == null) {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Title is required'
          })
        } else if (this.state.dataDescription == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Description is required'
          })
        } else if (this.state.queryResponder == '' || this.state.queryResponder == null || this.state.query == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Responder is required'
          })
        }else {
          // alert('help desk')
          this.putEditTrHelpDesk();
        }
      }else if(this.props.navigation.state.params.ticketCatIdSend == 10) {
      //   return this.putEditTrCondition();
        if (this.state.dataTitle == '' || this.state.dataTitle == null) {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Title is required'
          })
        } else if (this.state.dataDescription == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Description is required'
          })
        } else if (this.state.queryResponder == '' || this.state.queryResponder == null || this.state.query == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Responder is required'
          })
        } else if (this.state.query1 == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Serial number is required'
          })
        } else if (this.state.dataPartCausing == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Parts causing failure is required'
          })
        } else if (this.state.temporaryParticipant == '' || this.state.temporaryParticipant == []) {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'Participant is required'
          })
        } else if (this.state.dataSMU == '') {
          this.setState({
            modalMandatory: true,
            mandatoryMsg: 'SMU is required'
          })
        } else {
          // alert('condition')
          this.putEditTrCondition();
        }
      }
  }

  validationFormSaveDraft() {
    if (this.props.navigation.state.params.ticketCatIdSend == 1) {
      this.saveDraftPutProduct();
    } if (this.props.navigation.state.params.ticketCatIdSend == 2) {
      return this.saveDraftPutPartTechnical();
    } if (this.props.navigation.state.params.ticketCatIdSend == 3) {
      return this.saveDraftPutDimension();
    } if (this.props.navigation.state.params.ticketCatIdSend == 4) {
      return this.saveDraftPutRefence();
    } if (this.props.navigation.state.params.ticketCatIdSend == 5) {
      return this.saveDraftPutWaranty();
    } if (this.props.navigation.state.params.ticketCatIdSend == 6) {
      return this.saveDraftPutGoodwill();
    } if (this.props.navigation.state.params.ticketCatIdSend == 7) {
      return this.saveDraftPutPassword();
    } if (this.props.navigation.state.params.ticketCatIdSend == 8) {
      return this.saveDraftPutTelematic();
    } else if (this.props.navigation.state.params.ticketCatIdSend == 9) {
      return this.saveDraftPuthelpDesk();
    }else{
      return this.saveDraftPuthelpDesk();
    }
  }

  selectImage() {
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
          attachmentLevel: [...this.state.attachmentLevel, "guest"],
          temporaryAttachmentLevel: [...this.state.temporaryAttachmentLevel, "guest"]

        })
      }
      console.log('isi Attachments adalah2: ' + JSON.stringify(this.state.temporaryFileAttach));
    });
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

  actionDeleteTag = (items) => {
    // alert(items)
    var index = this.state.temporaryParticipant.findIndex(item => item.Name === items)
    this.state.temporaryParticipant.splice(index, 1)
    setTimeout(() => {
      this.setState({ temporaryParticipant: this.state.temporaryParticipant })
    }, 100)
  }

  actionDeleteFile = (items) => {
    // alert(items)
    // var index = this.state.temporaryFileAttach.findIndex(item => item.name === items)
    var index = items
    this.state.temporaryFileAttach.splice(index, 1)
    this.state.temporaryAttachmentLevel.splice(index, 1)
    setTimeout(() => {
      this.setState({ temporaryFileAttach: this.state.temporaryFileAttach, temporaryAttachmentLevel: this.state.temporaryAttachmentLevel }, () => {
        console.log(this.state.temporaryFileAttach)
      })
    }, 100)
  }

  actionAddTag() {
    this.setState({
      addTag: [...this.state.addTag, { Name: this.state.textTag }],
      temporaryAddTag: [...this.state.temporaryAddTag, { Name: this.state.textTag }]
    })
  }

  actionDeleteAddTag(items) {
    var index = this.state.addTag.findIndex(item => item.Name === items)
    this.state.addTag.splice(index, 1)
    setTimeout(() => {
      this.setState({ temporaryAddTag: this.state.addTag })
    }, 500)
  }

  toogleDone() {
    this.setState({ isModalBerhasil: false })
  }
  toogleDoneTitle() {
    this.setState({ isModalFormKosongTitle: false, isLoadingSubmit: true, isLoadingSaveDraft: true })
  }
  toogleDoneSN() {
    this.setState({ isModalFormKosongSN: false, isLoadingSubmit: true, isLoadingSaveDraft: true })
  }
  toogleDoneSMU() {
    this.setState({ isModalFormKosongDataSMU: false, isLoadingSubmit: true, isLoadingSaveDraft: true })
  }
  toogleDoneDesc() {
    this.setState({ isModalFormKosongDescription: false, isLoadingSubmit: true, isLoadingSaveDraft: true })
  }
  toogleDoneResponder() {
    this.setState({ isModalFormKosongResponder: false, isLoadingSubmit: true, isLoadingSaveDraft: true })
  }
  
toogleDoneMandatory() {
    this.setState({  isLoadingSubmit: true, isLoadingSaveDraft: true, modalMandatory: false })
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
  actionShow3() {
    this.setState({ show3: true, show1: false, show2: false })
  }
  actionShow3false() {
    this.setState({ show3: false })
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
        <TouchableOpacity block light style={styles.bnext}>
          <ActivityIndicator size="small" color="#fff" />
        </TouchableOpacity>
      )
    }
  }
  actionSaveDraft() {
    if (this.state.isLoadingSaveDraft === true) {
      if(this.state.userId == this.state.dataResponder){
        return (
          // <TouchableOpacity block style={styles.bsave} onPress={() => this.validationFormSaveDraft()}>
          //   <Text style={{ color: 'black', alignContent: 'center' }}>Save As Draft</Text>
          // </TouchableOpacity>
          <View></View>
        )
      }else{
        return (
          <TouchableOpacity block style={styles.bsave} onPress={() => this.validationFormSaveDraft()}>
            <Text style={{ color: 'black', alignContent: 'center' }}>Save As Draft</Text>
          </TouchableOpacity>
        )
      }
      
    } else {
      return (
        <TouchableOpacity block style={styles.bsave} onPress={() => this.validationFormSaveDraft()}>
          <ActivityIndicator size="small" color="#fff" />
        </TouchableOpacity>
      )
    }
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

  actionPartstecnical() {
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
          }})
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
          }})
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
          }})
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

  onSuccess(){
    this.setState({
      modalResponse : false
    })
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'MyTechnicalScreen'})
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }

  async selectMultipleFile() {
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
      });
      for (const res of results) {
        
        this.setState({
          temporaryFileAttach: [...this.state.temporaryFileAttach, res],
          dataFileAttachement: [...this.state.dataFileAttachement, res],
          attachmentLevel: [...this.state.attachmentLevel, "guest"],
          temporaryAttachmentLevel: [...this.state.temporaryAttachmentLevel, "guest"]
        });
        console.log( 'file attach : ' + res.name +'\n')
      }
      console.log('isi Attachments adalah: ' + JSON.stringify(this.state.temporaryFileAttach));
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Canceled from multiple doc picker')
      } else {
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  }

  attachmentLevelOnSelect(selected, index) {
    console.log(selected);
    let temporaryAttachmentLevel = [...this.state.temporaryAttachmentLevel];
    temporaryAttachmentLevel[index] = selected;
    this.setState({ temporaryAttachmentLevel, attachmentLevel: temporaryAttachmentLevel });

    setTimeout(() => {
      console.log(this.state.temporaryAttachmentLevel);
    }, 100);

  }

  render() {
    let viewShow1, viewShow2, viewShow3, showClose, showMenu;

    const { query2 } = this.state;
    const dataParticipant = this.findDataParticipant(query2);
    const comp2 = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

    const { query } = this.state;
    const dataResponderArr = this.findDataResponder(query);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

    const { query1 } = this.state;
    const dataSerialNumber = this.findDataSerial(query1);
    const comp1 = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

    // console.log("render")
    // console.log(this.state.temporaryParticipant)

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
          uriImage ={this.state.userImage}
          onTab1Press={() => this.actionProfile()}
          onTab2Press={() => this.actionMyTiket()}
          onTab3Press={() => this.actionTR()}
        />
    }

    // product healt
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
             <Text style={styles.textall}>Title <Text style={{color: '#EA2027', }}>*</Text></Text>
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
              <Text style={styles.textall}>Unit Serial Number <Text style={{color: '#EA2027', }}>*</Text></Text>
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
              placeholder={this.state.dataserialnumberstr}
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
              <Text style={styles.textall}>Branch</Text>
              <Text style={styles.textBold}>{this.state.SalesOffice},{this.state.SalesOfficeDescription}</Text>
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
              <Text style={styles.textall}>Smu Date</Text>
              <Text style={styles.textBold}>{this.state.SMUUpdate}</Text>
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
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
              <Text style={styles.textall}>SMU</Text>
            </View>
            <TextInput
            // editable={false}
              style={styles.textInputStyle}
              placeholder={this.state.dataSMU}
              defaultValue={this.state.dataSMU}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataSMU: text })}
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
             <Text style={styles.textall}>Parts Description <Text style={{color: '#EA2027', }}>*</Text></Text>
            </View>
            <TextInput
              style={styles.textInputStyle}
              placeholder={this.state.dataPD}
              defaultValue={this.state.dataPD}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataPD: text })}
            />
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
             <Text style={styles.textall}>Problem Description <Text style={{color: '#EA2027', }}>*</Text></Text>
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
    // Part technical
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
        <View style={{ backgroundColor: 'white'}}>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
             <Text style={styles.textall}>Title <Text style={{color: '#EA2027', }}>*</Text></Text>
            </View>
            <TextInput
              style={styles.textInputStyle}
              placeholder="Enter..."
              defaultValue={this.state.dataTitle}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataTitle: text })}
            />
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
              <View style={{ width: '75%' }}>
                <Text style={styles.textall}>{this.state.dataTicketno}</Text>
              </View>
            </View>
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
              <Text style={styles.textall}>Unit Serial Number <Text style={{color: '#EA2027', }}>*</Text></Text>
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
              // placeholder={this.state.dataserialnumberstr}
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
          {/* <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
              <Text style={styles.textall}>Manufacture</Text>
            </View>
            <TextInput
              style={styles.textInputStyle}
              placeholder="Enter..."
              defaultValue={this.state.dataManufacture}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataManufacture: text })}
            />
          </View> */}
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
              <Text style={styles.textall}>Branch</Text>
              <Text style={styles.textBold}>{this.state.SalesOffice},{this.state.SalesOfficeDescription}</Text>
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
              <Text style={styles.textall}>Smu Date</Text>
              <Text style={styles.textBold}>{this.state.SMUUpdate}</Text>
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
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
              <Text style={styles.textall}>SMU <Text style={{color: '#EA2027', }}>*</Text></Text>
            </View>
            <TextInput
              style={styles.textInputStyle}
              placeholder={this.state.dataSMU}
              defaultValue={this.state.dataSMU}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataSMU: text })}
            />
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
              <Text style={styles.textall}>Parts Number</Text>
            </View>
            <TextInput
              style={styles.textInputStyle}
              placeholder={this.state.dataPN}
              defaultValue={this.state.dataPN}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataPN: text })}
            />
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
             <Text style={styles.textall}>Parts Description <Text style={{color: '#EA2027', }}>*</Text></Text>
            </View>
            <TextInput
              style={styles.textInputStyle}
              placeholder={this.state.dataPD}
              defaultValue={this.state.dataPD}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataPD: text })}
            />
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
             <Text style={styles.textall}>Request Description <Text style={{color: '#EA2027', }}>*</Text></Text>
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
    //dimension
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
             <Text style={styles.textall}>Title <Text style={{color: '#EA2027', }}>*</Text></Text>
            </View>
            <TextInput
              style={styles.textInputStyle}
              placeholder="Enter..."
              defaultValue={this.state.dataTitle}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataTitle: text })}
            />
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
                <Text style={styles.textall}>Dimension</Text>
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
                <Text style={styles.textall}>{this.state.dataTicketno}</Text>
              </View>
            </View>
          </View>
          {/* <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
              <Text style={styles.textall}>Manufacture</Text>
            </View>
            <TextInput
              style={styles.textInputStyle}
              placeholder="Enter..."
              defaultValue={this.state.dataManufacture}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataManufacture: text })}
            />
          </View> */}
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
              <Text style={styles.textall}>Part Number <Text style={{color: '#EA2027', }}>*</Text></Text>
            </View>
            <TextInput
              style={styles.textInputStyle}
              placeholder={this.state.dataPN}
              defaultValue={this.state.dataPN}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataPN: text })}
            />
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
             <Text style={styles.textall}>Parts Description <Text style={{color: '#EA2027', }}>*</Text></Text>
            </View>
            <TextInput
              style={styles.textInputStyle}
              placeholder={this.state.dataPD}
              defaultValue={this.state.dataPD}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataPD: text })}
            />
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
             <Text style={styles.textall}>Request Description <Text style={{color: '#EA2027', }}>*</Text></Text>
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
    // reference
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
                <Text style={styles.textall}>{this.state.dataTicketno}</Text>
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
                <Text style={styles.textall}>References</Text>
              </View>
            </View>
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
             <Text style={styles.textall}>Title <Text style={{color: '#EA2027', }}>*</Text></Text>
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
              <Text style={styles.textall}>Unit Serial Number <Text style={{color: '#EA2027', }}>*</Text></Text>
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
              placeholder={this.state.dataserialnumberstr}
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
              <Text style={styles.textBold}>{this.state.delivery.substring(0, 10)}</Text>
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
              <Text style={styles.textBold}>{this.state.SMUUpdate.substring(0, 10)}</Text>
            </View>
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
              <Text style={styles.textall}>SMU</Text>
            </View>
            <TextInput
              style={styles.textInputStyle}
              // editable={false}
              // placeholder={this.state.dataSMU}
              defaultValue={this.state.dataSMU}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataSMU: text })}
            />
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
             <Text style={styles.textall}>Description <Text style={{color: '#EA2027'}}>*</Text></Text>
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

    // waranty reference
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
            <View style={{ flexDirection: 'row', width: '100%' }}>
              <View style={{ width: '20%' }}>
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
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
             <Text style={styles.textall}>Title <Text style={{color: '#EA2027', }}>*</Text></Text>
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
              <Text style={styles.textall}>TR Type</Text>
            </View>
            <View>
              <Dropdown
                  onChangeText = {this.valueDropdown.bind(this)}
                  data = {this.state.dataWarranty}
                  // placeholder = {this.state.dataWarrantystr}
                  labelFontSize={0}
                value={this.state.warrantyName}
                  containerStyle={styles.textInputStyleWarranty}
              />
            </View>
          </View>
          
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
              <Text style={styles.textall}>Unit Serial Number <Text style={{color: '#EA2027', }}>*</Text></Text>
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
              placeholder={this.state.dataserialnumberstr}
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
              <Text style={styles.textall}>Invoice Date</Text>
              <Text style={styles.textBold}>{this.state.delivery}</Text>
            </View>
          </View>
          <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
            <View style={{ flexDirection: 'column', width: '100%' }}>
              <Text style={styles.textall}>Model</Text>
              <Text style={styles.textBold}>{this.state.model}</Text>
            </View>
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
              <Text style={styles.textall}>SMU</Text>
            </View>
            <TextInput
              style={styles.textInputStyle}
              placeholder={this.state.dataSMU}
              defaultValue={this.state.dataSMU}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataSMU: text })}
            />
          </View>
          
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
             <Text style={styles.textall}>Service Order Number <Text style={{color: '#EA2027', }}>*</Text></Text>
            </View>
            <TextInput
              style={styles.textInputStyle}
              placeholder={this.state.dataSON}
              defaultValue={this.state.dataSON}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataSON: text })}
            />
          </View> 
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
              <Text style={styles.textall}>Claim Number</Text>
            </View>
            <TextInput
              style={styles.textInputStyle}
              placeholder={this.state.dataClaim}
              defaultValue={this.state.dataClaim}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataClaim: text })}
            />
          </View>
          
          
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
              <Text style={styles.textall}>Part Causing Failure <Text style={{color: '#EA2027', }}>*</Text></Text>
            </View>
            <TextInput
              style={styles.textInputStyle}
              placeholder={this.state.dataPcf}
              defaultValue={this.state.dataPcf}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataPcf: text })}
            />
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
             <Text style={styles.textall}>Parts Description <Text style={{color: '#EA2027', }}>*</Text></Text>
            </View>
            <TextInput
              style={styles.textInputStyle1}
              placeholder={this.state.dataPD}
              allowFontScaling={false}
              defaultValue={this.state.dataPD}
              numberOfLines={5}
              multiline={true}
              onChangeText={(text) => this.setState({ dataPD: text })}
            />
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
             <Text style={styles.textall}>Problem Description <Text style={{color: '#EA2027', }}>*</Text></Text>
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
    // goodwill
    if (this.state.show1 === false && this.props.navigation.state.params.ticketCatIdSend == 6) {
      viewShow1 = <TouchableOpacity onPress={() => this.actionShow1()}>
        <View style={styles.collapseheader}>
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.textheader}>Technical Request </Text>
            <Text style={styles.subtextheader}>Goodwill Assistance</Text>
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
              <Text style={styles.subtextheader}>Goodwill Assistance</Text>
            </View>
            <Image source={Images.arrowUp} style={styles.imageArrow} tintColor={"white"} />
          </View>
        </TouchableOpacity>
        <View style={{ backgroundColor: 'white' }}>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View style={{ flexDirection: 'row', width: '100%' }}>
              <View style={{ width: '20%' }}>
                <Text style={styles.textall}>TR Type</Text>
              </View>
              <View style={{ width: '5%' }}>
                <Text style={styles.textall}>:</Text>
              </View>
              <View style={{ width: '75%' }}>
                <Text style={styles.textall}>Goodwill Assistance</Text>
              </View>
            </View>
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View style={{ flexDirection: 'row', width: '100%' }}>
              <View style={{ width: '20%' }}>
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
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
             <Text style={styles.textall}>Title <Text style={{color: '#EA2027', }}>*</Text></Text>
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
             <Text style={styles.textall}>Service Order Number <Text style={{color: '#EA2027', }}>*</Text></Text>
            </View>
            <TextInput
              style={styles.textInputStyle}
              placeholder={this.state.dataSON}
              defaultValue={this.state.dataSON}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataSON: text })}
            />
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
              <Text style={styles.textall}>Claim Number <Text style={{color: '#EA2027', }}>*</Text></Text>
            </View>
            <TextInput
              style={styles.textInputStyle}
              placeholder={this.state.dataClaim}
              defaultValue={this.state.dataClaim}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataClaim: text })}
            />
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
              <Text style={styles.textall}>Unit Serial Number <Text style={{color: '#EA2027', }}>*</Text></Text>
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
              defaultValue={this.state.dataserialnumberstr}
              onChangeText={text => this.getListSerialNumber(text)}
              placeholder={this.state.dataserialnumberstr}
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
              <Text style={styles.textall}>Branch</Text>
              <Text style={styles.textBold}>{this.state.SalesOffice},{this.state.SalesOfficeDescription}</Text>
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
              <Text style={styles.textBold}>{this.state.delivery.substring(0, 10)}</Text>
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
              <Text style={styles.textBold}>{this.state.SMUUpdate.substring(0, 10)}</Text>
            </View>
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
              <Text style={styles.textall}>SMU <Text style={{color: '#EA2027', }}>*</Text></Text>
            </View>
            <TextInput
              // editable={false}
              style={styles.textInputStyle}
              placeholder={this.state.dataSMU}
              defaultValue={this.state.dataSMU}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataSMU: text })}
            />
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
              <Text style={styles.textall}>Part Causing Failure <Text style={{color: '#EA2027', }}>*</Text></Text>
            </View>
            <TextInput
              style={styles.textInputStyle}
              placeholder={this.state.dataPartCausing}
              defaultValue={this.state.dataPartCausing}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataPartCausing: text })}
            />
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
             <Text style={styles.textall}>Parts Description <Text style={{color: '#EA2027', }}>*</Text></Text>
            </View>
            <TextInput
              style={styles.textInputStyle1}
              placeholder={this.state.dataPD}
              allowFontScaling={false}
              defaultValue={this.state.dataPD}
              numberOfLines={5}
              multiline={true}
              onChangeText={(text) => this.setState({ dataPD: text })}
            />
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
             <Text style={styles.textall}>Problem Description <Text style={{color: '#EA2027', }}>*</Text></Text>
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
    // telematic
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
        <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
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
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View style={{ flexDirection: 'row', width: '100%' }}>
              <View style={{ width: '20%' }}>
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
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
             <Text style={styles.textall}>Title <Text style={{color: '#EA2027', }}>*</Text></Text>
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
             <Text style={styles.textall}>Unit Serial Number <Text style={{color: '#EA2027', }}>*</Text></Text>
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
              <Text style={styles.textall}>Branch</Text>
              <Text style={styles.textBold}>{this.state.SalesOffice},{this.state.SalesOfficeDescription}</Text>
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
              // editable={false}
              // placeholder={this.state.dataSMU}
              defaultValue={this.state.dataSMU}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataSMU: text })}
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
             <Text style={styles.textall}>Part Description <Text style={{color: '#EA2027', }}>*</Text></Text>
            </View>
            <TextInput
              style={styles.textInputStyle}
              placeholder="Enter..."
              defaultValue={this.state.dataPD}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataPD: text })}
            />
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
             <Text style={styles.textall}>Problem Description <Text style={{color: '#EA2027', }}>*</Text></Text>
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
          
          {/* <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
              <Text style={styles.textall}>Password</Text>
            </View>
            <TextInput
              style={styles.textInputStyle}
              placeholder={this.state.dataPassword}
              defaultValue={this.state.dataPassword}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataPassword: text })}
            />
          </View> */}
        </View>
      </View>
    }
    // password
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
             <Text style={styles.textall}>Title <Text style={{color: '#EA2027', }}>*</Text></Text>
            </View>
            <TextInput
              style={styles.textInputStyle}
              placeholder={this.state.dataTitle}
              defaultValue={this.state.dataTitle}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataTitle: text })}
            />
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
                <Text style={styles.textall}>{this.state.dataTicketno}</Text>
              </View>
            </View>
          </View>
          
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
              <Text style={styles.textall}>Unit Serial Number <Text style={{color: '#EA2027', }}>*</Text></Text>
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
              // placeholder={this.state.dataserialnumberstr}
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
              <Text style={styles.textall}>Branch</Text>
              <Text style={styles.textBold}>{this.state.SalesOffice},{this.state.SalesOfficeDescription}</Text>
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
              {/* {showdelivdate} */}
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
              {/* {showsmudate} */}
            </View>
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
              <Text style={styles.textall}>SMU</Text>
            </View>
            <TextInput
              style={styles.textInputStyle}
              // editable={false}
              // placeholder={this.state.dataSMU}
              defaultValue={this.state.dataSMU}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataSMU: text })}
            />
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
              <Text style={styles.textall}>Service Tool S/N</Text>
            </View>
            <TextInput
              style={styles.textInputStyle}
              placeholder={this.state.dataService}
              defaultValue={this.state.dataService}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataService: text })}
            />
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
              <Text style={styles.textall}>Engine S/N</Text>
            </View>
            <TextInput
              style={styles.textInputStyle}
              placeholder={this.state.dataEngine}
              defaultValue={this.state.dataEngine}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataEngine: text })}
            />
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
              <Text style={styles.textall}>ECM S/N</Text>
            </View>
            <TextInput
              style={styles.textInputStyle}
              placeholder={this.state.dataEcm}
              defaultValue={this.state.dataEcm}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataEcm: text })}
            />
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
              <Text style={styles.textall}>Total Tattletale</Text>
            </View>
            <TextInput
              style={styles.textInputStyle}
              placeholder={this.state.dataTotal}
              defaultValue={this.state.dataTotal}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataTotal: text })}
            />
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
              <Text style={styles.textall}>Reason Code</Text>
            </View>
            <TextInput
              style={styles.textInputStyle}
              placeholder={this.state.dataReason}
              defaultValue={this.state.dataReason}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataReason: text })}
            />
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
              <Text style={styles.textall}>From Interlock</Text>
            </View>
            <TextInput
              style={styles.textInputStyle}
              placeholder="Enter..."
              defaultValue={this.state.dataFinterlock}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataFinterlock: text })}
            />
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
              <Text style={styles.textall}>To Interlock</Text>
            </View>
            <TextInput
              style={styles.textInputStyle}
              placeholder="Enter..."
              defaultValue={this.state.dataTinterlock}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataTinterlock: text })}
            />
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
              <Text style={styles.textall}>Diagnostic Clock</Text>
            </View>
            <TextInput
              style={styles.textInputStyle}
              placeholder={this.state.dataDiagnostic}
              defaultValue={this.state.dataDiagnostic}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataDiagnostic: text })}
            />
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
              <Text style={styles.textall}>Software Part Number</Text>
            </View>
            <TextInput
              style={styles.textInputStyle}
              placeholder="Enter..."
              defaultValue={this.state.dataSoftware}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataSoftware: text })}
            />
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
              <Text style={styles.textall}>Test Spesification</Text>
            </View>
            <TextInput
              style={styles.textInputStyle}
              placeholder="Enter..."
              defaultValue={this.state.dataTS}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataTS: text })}
            />
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
              <Text style={styles.textall}>Test Spesification With BrakeSaver</Text>
            </View>
            <TextInput
              style={styles.textInputStyle}
              placeholder="Enter..."
              defaultValue={this.state.dataTSWB}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataTSWB: text })}
            />
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
             <Text style={styles.textall}>Request Description <Text style={{color: '#EA2027', }}>*</Text></Text>
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
    // condition monitoring
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
                <Text style={styles.textall}>{this.state.dataTicketno}</Text>
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
             <Text style={styles.textall}>Title <Text style={{color: '#EA2027', }}>*</Text></Text>
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
              <Text style={styles.textall}>Unit Serial Number <Text style={{color: '#EA2027', }}>*</Text></Text>
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
              <Text style={styles.textall}>Branch</Text>
              <Text style={styles.textBold}>{this.state.SalesOffice},{this.state.SalesOfficeDescription}</Text>
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
              defaultValue={this.state.dataSMU}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataSMU: text })}
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
             <Text style={styles.textall}>Problem Description <Text style={{color: '#EA2027', }}>*</Text></Text>
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
    // help desk
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
                <Text style={styles.textall}>{this.state.dataTicketno}</Text>
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
                <Text style={styles.textall}>Help Desk</Text>
              </View>
            </View>
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
             <Text style={styles.textall}>Title <Text style={{color: '#EA2027', }}>*</Text></Text>
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
             <Text style={styles.textall}>Problem Description <Text style={{color: '#EA2027', }}>*</Text></Text>
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

    if (this.state.show2 === false && this.props.navigation.state.params.ticketCatIdSend != 9) {
      viewShow2 = <TouchableOpacity onPress={() => this.actionShow2()}>
        <View style={styles.collapseheader2}>
          <Text style={styles.textheader}>Contributor</Text>
          <Image source={Images.arrowDown} style={styles.imageArrow} tintColor={"white"} />
        </View>
      </TouchableOpacity>
    } else if(this.state.show2 === true && this.props.navigation.state.params.ticketCatIdSend != 9) {
      viewShow2 = <View>
        <TouchableOpacity onPress={() => this.actionShow2false()}>
          <View style={styles.collapseheader2}>
            <Text style={styles.textheader}>Contributor</Text>
            <Image source={Images.arrowUp} style={styles.imageArrow} tintColor={"white"} />
          </View>
        </TouchableOpacity>
        <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
          <View>
            <Text style={styles.textall}>Add Responder <Text style={{color: '#EA2027', }}>*</Text></Text>
          </View>
     { this.state.dataStatus == 1 && this.state.dataSubmiter == this.state.userId ?
      <Autocomplete
            // editable={false}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.textInputStyle}
            inputContainerStyle={{ borderColor: 'rgba(255,255,255,0.1)' }}
            data={dataResponderArr.length === 1 && comp(query, dataResponderArr[0].Name) ? [] : dataResponderArr}
            defaultValue={query}
            onChangeText={text => this.setState({ query: text, queryRes: text })}
            placeholder="Enter..."
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => this.setState({ query: item.Name, queryResponder: item.UserName, queryRes: item.Name })}>
                <Text style={styles.itemText}>
                  {item.Name}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          /> 
          :
          <Autocomplete
          editable={false}
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.textInputStyle}
          inputContainerStyle={{ borderColor: 'rgba(255,255,255,0.1)' }}
          data={dataResponderArr.length === 1 && comp(query, dataResponderArr[0].Name) ? [] : dataResponderArr}
          defaultValue={query}
          onChangeText={text => this.setState({ query: text, queryRes: text })}
          placeholder="Enter..."
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => this.setState({ query: item.Name, queryResponder: item.UserName, queryRes: item.Name })}>
              <Text style={styles.itemText}>
                {item.Name}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
    }
        </View>
        
        <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
          <View>
            <Text style={styles.textall}>Add Participant</Text>
          </View>
          <Autocomplete
            // editable={false}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.textInputStyle}
            inputContainerStyle={{ borderColor: 'rgba(255,255,255,0.1)' }}
            data={dataParticipant.length === 1 && comp2(query2, dataParticipant[0].Name) ? [] : dataParticipant}
            defaultValue={query2}
            onChangeText={text => this.setState({ query2: text })}
            placeholder="Enter..."
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => this.setState({ query2: item.Name, dataTag: [...this.state.dataTag, { Username: item.UserName }], temporaryParticipant: [...this.state.temporaryParticipant, item] })}>
                <Text style={styles.itemText}>
                  {item.Name}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <View style={{ marginLeft: 20, marginRight: 20, flexDirection: 'row', padding: 10 }}>
          <ScrollView horizontal={true}>
            {this.state.temporaryParticipant.map((item) => {
            
              return (
                <View style={{ flexDirection: 'row', backgroundColor: '#959595', padding: 5, borderRadius: 10, alignSelf: 'center', alignItems: 'center', marginLeft: 10, marginTop: 10 }}>
                  <TouchableOpacity onPress={() => this.actionDeleteTag(item.Name)}>
                    <View style={{ borderRadius: 100, backgroundColor: '#CCCCCC', padding: 3 }}>
                      <Image source={Images.delete} style={{ width: 12, height: 12 }} tintColor={"black"} />
                    </View>
                  </TouchableOpacity>
                  <Text style={styles.textTag}>{item.Name}</Text>
                </View>
              )
            })}
          </ScrollView>
  
        </View>
        <View style={{ marginTop: 10, marginLeft: 20, marginRight: 20 }}>
          <View>
            <Text style={styles.textall}>Email CC</Text>
          </View>
          <TextInput
            style={styles.textInputStyle}
            placeholder="Enter..."
            defaultValue={this.state.dataEmail}
            allowFontScaling={false}
            onChangeText={(text) => this.setState({ dataEmail: text })}
          />
        </View>
  
  
      </View>
   
    }
  
    if (this.state.show3 === false) {
      viewShow3 = <TouchableOpacity onPress={() => this.actionShow3()}>
        <View style={styles.collapseheader2}>
          <Text style={styles.textheader}>Attachment</Text>
          <Image source={Images.arrowDown} style={styles.imageArrow} tintColor={"white"} />
          {/* <Text style={styles.subtextheader}>Contributoror</Text> */}
        </View>
      </TouchableOpacity>
    } else {
      viewShow3 = <View>
        <TouchableOpacity onPress={() => this.actionShow3false()}>
          <View style={styles.collapseheader2}>
            <Text style={styles.textheader}>Attachment</Text>
            <Image source={Images.arrowUp} style={styles.imageArrow} tintColor={"white"} />
          </View>
        </TouchableOpacity>
        <View style={{ padding: 10 }}>
          <View style={{ borderRadius: 5, borderWidth: 1, padding: 10, borderColor: '#D7E0F1' }}>
            <TouchableOpacity onPress={() => this.selectImage()} style={{ marginBottom: 5 }}>
              <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#CCCCCC', padding: 10, borderRadius: 10 }}>
                <Text style={{ marginTop: 5 }}>Take Photo</Text>
                <Image source={Images.camera} style={{ height: 25, width: 25, marginTop: 3, alignSelf: 'center' }} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.selectMultipleFile()}>
              <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#CCCCCC', padding: 10, borderRadius: 10 }}>
                <Text>Browse</Text>
                <Icon type="FontAwesome" name="plus-circle" style={{ color: 'black' }} />
              </View>
            </TouchableOpacity>
            <ScrollView horizontal={true}>
              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                {this.state.temporaryFileAttach.map((item, id) => {
                  console.log(item)
                  return (
                    <View style={{ flexDirection: 'column', marginLeft: 10, marginRight: 15, padding: 15, }}>
                      <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" />}
                        style={{ width: undefined }}
                        placeholder="Select your SIM"
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        selectedValue={this.state.temporaryAttachmentLevel[id]}
                        onValueChange={(value) => this.attachmentLevelOnSelect(value, id)}
                      >
                        <Picker.Item label="Guest" value="guest" />
                        <Picker.Item label="Green" value="green" />
                        <Picker.Item label="Yellow" value="yellow" />
                      </Picker>



                      <Image source={this.actionFile(item.uri)} style={{ width: 150, height: 150, borderRadius: 5 }} />
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center', width: 150, marginTop: 10 }}>
                        {/* <Text>{item.name}</Text> */}
                        <Text>{item.name}</Text>
                        <TouchableOpacity onPress={() => this.actionDeleteFile(id)}>
                          <View style={{ backgroundColor: '#CCCCCC', padding: 8, borderRadius: 100 }}>
                            <Image source={Images.delete} style={{ width: 13, height: 13 }} tintColor={"black"} />
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )
                })}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    }
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#CCCCCC' }}>
        <View style={{ flex: 1, backgroundColor: "white" }}>
          <View style={{backgroundColor:'black'}}>
            <View style={{ padding: 15, paddingLeft: 10, flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
              <Image source={Images.ic_logo} style={{ width: 190, height: 35 }} />
            </View>
          </View>
          <ScrollView>
            <View style={{ flexDirection: 'column', paddingBottom: 60 }}>
              <View style={{ backgroundColor: '#F6F6F6', flexDirection: 'column' }}>
                {viewShow1}
                <View style={{ backgroundColor: 'white' }}>
                  {viewShow2}
                  {viewShow3}
                  <View style={{ padding: 25 }}>
                    <View style={{ padding: 15, backgroundColor: '#EBEBEB', borderRadius: 10, flexDirection: 'column', width: '100%' }}>
                      <View style={{ flexDirection: 'row', width: '100%' }}>
                        <View style={{ width: '72%' }}>
                          <TextInput
                            style={styles.textInputTag}
                            placeholder="Enter..."
                            defaultValue={this.state.textTag}
                            allowFontScaling={false}
                            onChangeText={(text) => this.setState({ textTag: text })}
                          />
                        </View>
                        <View style={{ width: '28%' }}>
                          <TouchableOpacity block light style={styles.btnAddTag} onPress={() => this.actionAddTag()}>
                            <Text style={{ color: 'black' }}>Add Tag</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <ScrollView horizontal={true}>
                        <View style={{ flexDirection: 'row' }}>
                          {this.state.temporaryAddTag.map((item) => {
                            return (
                              <View style={{ padding: 5, backgroundColor: '#959595', marginLeft: 5, marginTop: 10, borderRadius: 7, flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => this.actionDeleteAddTag(item.Name)}>
                                  <View style={{ borderRadius: 100, backgroundColor: '#959595', padding: 5 }}>
                                    <Image source={Images.delete} style={{ width: 12, height: 12 }} tintColor={"#CBCBCB"} />
                                  </View>
                                </TouchableOpacity>
                                <View style={{ marginLeft: 5 }}>
                                  <Text style={{ color: 'white' }}>{item.Name}</Text>
                                </View>

                              </View>
                            )
                          })}
                        </View>
                      </ScrollView>

                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15 }}>
                    <View>
                      <TouchableOpacity bordered style={styles.bcancel} onPress={() => this.actionMyTechnicalScreen()}>
                        <Text style={{ color: '#9C9C9C' }}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      {this.actionSaveDraft()}
                      {this.actionSubmit()}
                      
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
          {showClose}
          {showMenu}
        </View >
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

        <Modal isVisible={this.state.modalResponse}
          animationIn='bounceIn'
          animationOut='bounceOut'
        >
          <View style={styles.viewmodal}>
            <Text style={styles.textalertmodal}>{this.state.messageResponse}</Text>
            <TouchableOpacity onPress={() => this.onSuccess()} style={[styles.buttonmodalOK]}>
              <Text style={{ fontWeight: '200', color: '#fff' }}>ok</Text>
            </TouchableOpacity>
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
        <Modal isVisible={this.state.isModalFailfetch}
          animationIn='bounceIn'
          animationOut='bounceOut'
        >
          <View style={styles.viewmodal}>
            <Text style={styles.textalertmodal}>Request To Server Failed</Text>
            <TouchableOpacity onPress={() => this.actionMyTiket()} style={[styles.buttonmodalOK]}>
              <Text style={{ fontWeight: '200', color: '#fff' }}>ok</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal isVisible={this.state.isModalFormKosongTitle}
          animationIn='bounceIn'
          animationOut='bounceOut'
        >
          <View style={styles.viewmodal}>
            <Text style={styles.textalertmodal}>Please Enter Your Title</Text>
            <TouchableOpacity onPress={() => this.toogleDoneTitle()} style={[styles.buttonmodalOK]}>
              <Text style={{ fontWeight: '200', color: '#fff' }}>ok</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal isVisible={this.state.isModalFormKosongSN}
          animationIn='bounceIn'
          animationOut='bounceOut'
        >
          <View style={styles.viewmodal}>
            <Text style={styles.textalertmodal}>Please Enter Your Serial Number</Text>
            <TouchableOpacity onPress={() => this.toogleDoneSN()} style={[styles.buttonmodalOK]}>
              <Text style={{ fontWeight: '200', color: '#fff' }}>ok</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal isVisible={this.state.isModalFormKosongDataSMU}
          animationIn='bounceIn'
          animationOut='bounceOut'
        >
          <View style={styles.viewmodal}>
            <Text style={styles.textalertmodal}>Please Enter Your Data SMU</Text>
            <TouchableOpacity onPress={() => this.toogleDoneSMU()} style={[styles.buttonmodalOK]}>
              <Text style={{ fontWeight: '200', color: '#fff' }}>ok</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Modal isVisible={this.state.isModalFormKosongDescription}
          animationIn='bounceIn'
          animationOut='bounceOut'
        >
          <View style={styles.viewmodal}>
            <Text style={styles.textalertmodal}>Please Enter Your Description</Text>
            <TouchableOpacity onPress={() => this.toogleDoneDesc()} style={[styles.buttonmodalOK]}>
              <Text style={{ fontWeight: '200', color: '#fff' }}>ok</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Modal isVisible={this.state.isModalFormKosongResponder}
          animationIn='bounceIn'
          animationOut='bounceOut'
        >
          <View style={styles.viewmodal}>
            <Text style={styles.textalertmodal}>Please Enter Your Responder</Text>
            <TouchableOpacity onPress={() => this.toogleDoneResponder()} style={[styles.buttonmodalOK]}>
              <Text style={{ fontWeight: '200', color: '#fff' }}>ok</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Modal isVisible={this.state.modalMandatory}
          animationIn='bounceIn'
          animationOut='bounceOut'
        >
          <View style={styles.viewmodal}>
            <Text style={styles.textalertmodal}>{this.state.mandatoryMsg}</Text>
            <TouchableOpacity onPress={() => this.toogleDoneMandatory()} style={[styles.buttonmodalOK]}>
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




      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({

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
  buttonattachment: {
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 0,
    width: 130,
    height: 40,
    backgroundColor: '#CCCCCC',
  },
  textbattachment: {
    color: 'black',
  },
  buttonaddtag: {
    backgroundColor: '#CCCCCC'
  },
  textheader: {
    fontSize: 17, color: 'white'
  },
  subtextheader: {
    fontSize: 14, color: 'white'
  },
  textall: {
    color: '#737373',
    marginLeft: 5,
    fontWeight: "400"
  },
  form: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: '#fff',
    // paddingHorizontal: 20,
    // paddingVertical: 29,
  },
  field1style: {
    borderColor: '#fff'
  },
  header: {
    height: 70,
    backgroundColor: "#F6F6F6",
    borderColor: '#fff',
    shadowColor: 'transparent',
    elevation: 0,
  },
  addtag: {
    borderRadius: 10,
    backgroundColor: '#ebebeb',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  bcancel: {
    padding: 10,
    backgroundColor: '#fff',
    borderColor: '#FABA00',
    borderWidth: 1,
    borderRadius: 5
  },
  bsave: {
    padding: 10,
    backgroundColor: '#cccac4',
    borderRadius: 5
  },
  bnext: {
    padding: 10,
    backgroundColor: '#FABA00',
    marginLeft: 10,
    borderRadius: 5
  },
  btnAddTag: {
    padding: 11,
    backgroundColor: '#CCCCCC',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    alignSelf: 'center'
  },
  field: {
    borderColor: '#DEDEDE',
    borderRadius: 10,
    marginTop: 5,
    backgroundColor: "#EBEBEB"
  },
  tag: {
    backgroundColor: '#959595',
    alignSelf: 'flex-end'
  },
  tagText: {
    color: 'white'
  },
  textInput: {
    borderColor: '#EBEBEB',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: 'white'
  },
  autocompleteContainer: {
    width: 318,
    height: 55,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    backgroundColor: "#EBEBEB",
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    color: 'black',
    paddingRight: 30,
  },
  itemText: {
    fontSize: 17,
    paddingTop: 7,
    paddingBottom: 7,
    margin: 5,
  },
  avatar: {
    borderRadius: 75,
    width: 150,
    height: 150,
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
    marginTop: 10,
  },
  textInputStyle1: {
    height: 100,
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
    textAlignVertical: 'top'
  },
  textInputTag: {
    padding: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: 'white'
  },
  textBold: {
    fontWeight: "bold",
    marginLeft: 5
  },
  autocompleteContainer: {
    backgroundColor: '#ffffff',
  },
  textTag: {
    color: 'white',
    marginLeft: 7
  },
  imageArrow: {
    width: 15,
    height: 15
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
