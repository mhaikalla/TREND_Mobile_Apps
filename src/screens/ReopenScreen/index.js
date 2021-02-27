

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
  BackHandler
} from 'react-native';
import { CardItem, Textarea, Form, Item, Label, Input, Container, Header, Content, Button, Icon, Separator } from 'native-base';
import Autocomplete from 'react-native-autocomplete-input';
import { ModalMenu, BottomBar } from '@component';
import { Images, API } from '@res';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker'
import ImageResizer from 'react-native-image-resizer'
import ImgToBase64 from 'react-native-image-base64'
import Modal from "react-native-modal";
import { StackActions, NavigationActions } from 'react-navigation';

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
      email: '',
      dataTag: [],
      // dataTitle: this.props.navigation.state.params.titleSend,
      dataTitle: '',
      dataDescription: '',
      // dataDescription: this.props.navigation.state.params.descSend,
      dataPartCausing: '',
      dataSMU: '',
      dataWarranty: [],
      idWarranty: 0,

      tokenData: '',
      userName: '',
      locationUser1:'',
      locationUser2: '',
      dataTicketNumber: '',
      // dataTicketNumber: this.props.navigation.state.params.trNoSend,
      attachmentImage: [],
      attachmentName: '',
      dataResponder: [],
      dataParticipant: [],
      dataSerialNumber: [],
      temporaryParticipant: [],
      temporaryFileAttach: [],
      dataFileAttachement: [],
      foto: '',
      addTag: [],
      temporaryAddTag: [],
      textTag: '',
      query: '',
      query1: '',
      query2: '',
      show1: false,
      show2: false,
      show3: false,
      isModalBerhasil: false,
      isModalFormKosongDataSMU: false,
      isModalFormKosongSN: false,
      isModalFormKosongTitle: false,

      isModalFormKosongDescription: false,
      isModalFormKosongResponder: false,

      responMessage: '',
      isLoadingSubmit: true,
      isLoadingSaveDraft: true,
      pageViewProfile: false,
      pageViewTR: false,
      showroundemenu:true,
      closemenu:false,
      roleId : -1,
      roleName : "",
      roleTextColor : "#11100E" 
    }
    BackHandler.addEventListener('hardwareBackPress', this._onBackPress)
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
    // console.log("hai, ticketcatidsend:  "+ this.props.navigation.state.params.ticketCatIdSend )
    this.getToken();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._onBackPress)
}

  getToken = async () => {
    const mToken = await AsyncStorage.getItem('@token');
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
        roleTextColor
    })
    if (mToken != null && mToken != '') {
      this.setState({
        tokenData: mToken,
        userName: mUserName,
        locationUser1: mLocationUser1,
        locationUser2: mLocationUser2,
        userRole : mUserRoleName ,
      
        delegateId : mdelegateId,
        delegateTo_Name : mdelegateTo_Name,
        delegateStart: mdelegateStart,
        delegateEnd : mdelegateEnd,
        delegateCreated  : mdelegateCreated ,
        delegateStatus : mdelegateStatus 
   
      })
      // console.log(mToken)
      this.getTicketNumber();
      this.getListResponder();
      this.getListPartipant();
    }
    BackHandler.addEventListener('hardwareBackPress', this._onBackPress)
  }

  valueDropdown(item) {
    this.setState({
        idWarranty : item
    })
    // alert(this.state.idWarranty)
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
        // alert(Data1)
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
          dataResponder: Data4,
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
    const { dataResponder } = this.state;
    const regex = new RegExp(`${query.trim()}`, 'i');
    return dataResponder.filter(data => data.search(regex) >= 0);
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
    return dataParticipant.filter(data => data.search(regex) >= 0);
  }


  actionSerialNumber(item) {
    this.setState({ query1: item })
    this.getDataMEP(item)
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
          location: Data1.LocationDetail,
          make: Data1.EngineMake,
          delivery: Data1.DeliveryDate,
          arrangement: Data1.ArrNumber,
          family: Data1.SMUUpDate,
          model: Data1.EngineModel,
          SMU: Data1.SMU,
        })
      })
      .catch((error) => {
        console.log(error)
      });
  }

  getTicketNumber() {
    fetch(API.getTicketNumber + this.props.navigation.state.params.ticketCatIdSend, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
        'AccessToken': this.state.tokenData,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          dataTicketNumber: responseJson,
        });

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

  registerCallProduct() {
    this.setState({ isLoadingSubmit: false })
    fetch(API.registerProduct,
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
          SerialNumber: this.state.query1, //temporary
          SMU: this.state.dataSMU,
          PartCausingFailure: this.state.dataPartCausing,
          EmailCC: this.state.email,
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
            isLoadingSubmit: true,
            responMessage: response.status.description,
            dataTitle: '',
            dataDescription: '',
            query: '',
            query1: '',
            query2: '',
            dataSMU: '',
            dataPartCausing: '',
            email: '',
            temporaryAddTag: [],
            temporaryFileAttach: [],
            temporaryParticipant: [],
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
      })
      .catch(function (error) {
        console.log("-------- error ------- " + error);
        alert("response:" + error)
      });
  }

  registerCallDimension() {
    this.setState({ isLoadingSubmit: false })
    fetch(API.registerDimension,
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
          SerialNumber: this.state.query1, //temporary
          SMU: this.state.dataSMU,
          PartCausingFailure: this.state.dataPartCausing,
          EmailCC: this.state.email,
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
            isLoadingSubmit: true,
            responMessage: response.status.description,
            dataTitle: '',
            dataDescription: '',
            query: '',
            query1: '',
            query2: '',
            dataSMU: '',
            dataPartCausing: '',
            email: '',
            temporaryAddTag: [],
            temporaryFileAttach: [],
            temporaryParticipant: [],
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
      })
      .catch(function (error) {
        console.log("-------- error ------- " + error);
        alert("response:" + error)
      });
  }

  registerCallReference() {
    this.setState({ isLoadingSubmit: false })
    fetch(API.registerReference,
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
          SerialNumber: this.state.query1, //temporary
          SMU: this.state.dataSMU,
          PartCausingFailure: this.state.dataPartCausing,
          EmailCC: this.state.email,
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
            isLoadingSubmit: true,
            responMessage: response.status.description,
            dataTitle: '',
            dataDescription: '',
            query: '',
            query1: '',
            query2: '',
            dataSMU: '',
            dataPartCausing: '',
            email: '',
            temporaryAddTag: [],
            temporaryFileAttach: [],
            temporaryParticipant: [],
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
      })
      .catch(function (error) {
        console.log("-------- error ------- " + error);
        alert("response:" + error)
      });
  }

  registerCallWarranty() {
    this.setState({ isLoadingSubmit: false })
    fetch(API.registerWarranty,
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
          SerialNumber: this.state.query1, //temporary
          SMU: this.state.dataSMU,
          PartCausingFailure: this.state.dataPartCausing,
          EmailCC: this.state.email,
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
            isLoadingSubmit: true,
            responMessage: response.status.description,
            dataTitle: '',
            dataDescription: '',
            query: '',
            query1: '',
            query2: '',
            dataSMU: '',
            dataPartCausing: '',
            email: '',
            temporaryAddTag: [],
            temporaryFileAttach: [],
            temporaryParticipant: [],
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
      })
      .catch(function (error) {
        console.log("-------- error ------- " + error);
        alert("response:" + error)
      });
  }
  
  registerCallGoodwill() {
    this.setState({ isLoadingSubmit: false })
    fetch(API.registerGoodwill,
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
          SerialNumber: this.state.query1, //temporary
          SMU: this.state.dataSMU,
          PartCausingFailure: this.state.dataPartCausing,
          EmailCC: this.state.email,
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
            isLoadingSubmit: true,
            responMessage: response.status.description,
            dataTitle: '',
            dataDescription: '',
            query: '',
            query1: '',
            query2: '',
            dataSMU: '',
            dataPartCausing: '',
            email: '',
            temporaryAddTag: [],
            temporaryFileAttach: [],
            temporaryParticipant: [],
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
      })
      .catch(function (error) {
        console.log("-------- error ------- " + error);
        alert("response:" + error)
      });
  }

  registerCallTelematics() {
    this.setState({ isLoadingSubmit: false })
    fetch(API.registerTelematics,
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
          SerialNumber: this.state.query1, //temporary
          SMU: this.state.dataSMU,
          PartCausingFailure: this.state.dataPartCausing,
          EmailCC: this.state.email,
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
            isLoadingSubmit: true,
            responMessage: response.status.description,
            dataTitle: '',
            dataDescription: '',
            query: '',
            query1: '',
            query2: '',
            dataSMU: '',
            dataPartCausing: '',
            email: '',
            temporaryAddTag: [],
            temporaryFileAttach: [],
            temporaryParticipant: [],
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
      })
      .catch(function (error) {
        console.log("-------- error ------- " + error);
        alert("response:" + error)
      });
  }

  registerCallPassword() {
    this.setState({ isLoadingSubmit: false })
    fetch(API.registerPassword,
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
          SerialNumber: this.state.query1, //temporary
          SMU: this.state.dataSMU,
          PartCausingFailure: this.state.dataPartCausing,
          EmailCC: this.state.email,
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
            isLoadingSubmit: true,
            responMessage: response.status.description,
            dataTitle: '',
            dataDescription: '',
            query: '',
            query1: '',
            query2: '',
            dataSMU: '',
            dataPartCausing: '',
            email: '',
            temporaryAddTag: [],
            temporaryFileAttach: [],
            temporaryParticipant: [],
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
      })
      .catch(function (error) {
        console.log("-------- error ------- " + error);
        alert("response:" + error)
      });
  }

  saveDraftProduct() {
    this.setState({ isLoadingSaveDraft: false })
    fetch(API.registerProduct,
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
          PartCausingFailure: this.state.dataPartCausing,
          EmailCC: this.state.email,
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
            responMessage: response.status.description,
            dataTitle: '',
            dataDescription: '',
            query: '',
            query1: '',
            query2: '',
            dataSMU: '',
            dataPartCausing: '',
            email: '',
            temporaryAddTag: [],
            temporaryFileAttach: [],
            temporaryParticipant: [],
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
      })
      .catch(function (error) {
        console.log("-------- error ------- " + error);
      });
  }


  saveDraftDimension() {
    this.setState({ isLoadingSaveDraft: false })
    fetch(API.registerDimension,
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
          PartCausingFailure: this.state.dataPartCausing,
          EmailCC: this.state.email,
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
            responMessage: response.status.description,
            dataTitle: '',
            dataDescription: '',
            query: '',
            query1: '',
            query2: '',
            dataSMU: '',
            dataPartCausing: '',
            email: '',
            temporaryAddTag: [],
            temporaryFileAttach: [],
            temporaryParticipant: [],
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
      })
      .catch(function (error) {
        console.log("-------- error ------- " + error);
      });
  }

  saveDraftReference() {
    this.setState({ isLoadingSaveDraft: false })
    fetch(API.registerReference,
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
          PartCausingFailure: this.state.dataPartCausing,
          EmailCC: this.state.email,
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
            responMessage: response.status.description,
            dataTitle: '',
            dataDescription: '',
            query: '',
            query1: '',
            query2: '',
            dataSMU: '',
            dataPartCausing: '',
            email: '',
            temporaryAddTag: [],
            temporaryFileAttach: [],
            temporaryParticipant: [],
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
      })
      .catch(function (error) {
        console.log("-------- error ------- " + error);
      });
  }

  saveDraftWarranty() {
    this.setState({ isLoadingSaveDraft: false })
    fetch(API.registerWarranty,
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
          PartCausingFailure: this.state.dataPartCausing,
          EmailCC: this.state.email,
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
            responMessage: response.status.description,
            dataTitle: '',
            dataDescription: '',
            query: '',
            query1: '',
            query2: '',
            dataSMU: '',
            dataPartCausing: '',
            email: '',
            temporaryAddTag: [],
            temporaryFileAttach: [],
            temporaryParticipant: [],
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
      })
      .catch(function (error) {
        console.log("-------- error ------- " + error);
      });
  }

  saveDraftGoodwill() {
    this.setState({ isLoadingSaveDraft: false })
    fetch(API.registerGoodwill,
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
          PartCausingFailure: this.state.dataPartCausing,
          EmailCC: this.state.email,
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
            responMessage: response.status.description,
            dataTitle: '',
            dataDescription: '',
            query: '',
            query1: '',
            query2: '',
            dataSMU: '',
            dataPartCausing: '',
            email: '',
            temporaryAddTag: [],
            temporaryFileAttach: [],
            temporaryParticipant: [],
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
      })
      .catch(function (error) {
        console.log("-------- error ------- " + error);
      });
  }

  saveDraftTelematics() {
    this.setState({ isLoadingSaveDraft: false })
    fetch(API.registerTelematics,
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
          PartCausingFailure: this.state.dataPartCausing,
          EmailCC: this.state.email,
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
            responMessage: response.status.description,
            dataTitle: '',
            dataDescription: '',
            query: '',
            query1: '',
            query2: '',
            dataSMU: '',
            dataPartCausing: '',
            email: '',
            temporaryAddTag: [],
            temporaryFileAttach: [],
            temporaryParticipant: [],
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
      })
      .catch(function (error) {
        console.log("-------- error ------- " + error);
      });
  }

  saveDraftPassword() {
    this.setState({ isLoadingSaveDraft: false })
    fetch(API.registerPassword,
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
          PartCausingFailure: this.state.dataPartCausing,
          EmailCC: this.state.email,
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
            responMessage: response.status.description,
            dataTitle: '',
            dataDescription: '',
            query: '',
            query1: '',
            query2: '',
            dataSMU: '',
            dataPartCausing: '',
            email: '',
            temporaryAddTag: [],
            temporaryFileAttach: [],
            temporaryParticipant: [],
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
      })
      .catch(function (error) {
        console.log("-------- error ------- " + error);
      });
  }

  validationForm() {
    if (this.state.dataTitle === '') {
      return this.setState({ isModalFormKosongTitle: true, isLoadingSubmit: false });
    } else if (this.state.query1 === '' && this.props.navigation.state.params.ticketCatIdSend != 9) {
      return this.setState({ isModalFormKosongSN: true, isLoadingSubmit: false });
    } else if (this.state.dataSMU === '') {
      return this.setState({ isModalFormKosongDataSMU: true, isLoadingSubmit: false });
    } else if (this.state.dataDescription === '') {
      return this.setState({ isModalFormKosongDescription: true, isLoadingSubmit: false });
    } else if (this.state.query === '') {
      return this.setState({ isModalFormKosongResponder: true, isLoadingSubmit: false });
    } else if (this.props.navigation.state.params.ticketCatIdSend == 1){
      return this.registerCallProduct();
    } if (this.props.navigation.state.params.ticketCatIdSend == 3){
      return this.registerCallDimension();
    } if (this.props.navigation.state.params.ticketCatIdSend == 4){
      return this.registerCallReference();
    } if (this.props.navigation.state.params.ticketCatIdSend == 5){
      return this.registerCallWarranty();
    } if (this.props.navigation.state.params.ticketCatIdSend == 6){
      return this.registerCallGoodwill();
    } if (this.props.navigation.state.params.ticketCatIdSend == 7){
      return this.registerCallTPassword();
    } else if (this.props.navigation.state.params.ticketCatIdSend == 8){
      return this.registerCallTelematics();
    } else if (this.props.navigation.state.params.ticketCatIdSend == 9) {
      return this.registerCallTelematics();
    }
  }


  validationFormSaveDraft() {
    if (this.state.dataTitle === '' || this.state.dataTitle === null) {
      this.setState({ isModalFormKosongTitle: true, isLoadingSaveDraft: false });
    } else if (this.state.query1 === '' || this.state.query1 === null) {
      this.setState({ isModalFormKosongSN: true, isLoadingSaveDraft: false });
    } else if (this.state.dataSMU === '' || this.state.dataSMU === null) {
      this.setState({ isModalFormKosongDataSMU: true, isLoadingSaveDraft: false });
    } else if (this.state.dataDescription === '' || this.state.dataDescription === null) {
      this.setState({ isModalFormKosongDescription: true, isLoadingSaveDraft: false });
    } else if (this.state.query === '' || this.state.query === null) {
      this.setState({ isModalFormKosongResponder: true, isLoadingSaveDraft: false });
    } else if (this.props.navigation.state.params.ticketCatIdSend == 1){
      return this.saveDraftProduct();
    } if (this.props.navigation.state.params.ticketCatIdSend == 3){
      return this.saveDraftDimension();
    } if (this.props.navigation.state.params.ticketCatIdSend == 4){
      return this.saveDraftReference();
    } if (this.props.navigation.state.params.ticketCatIdSend == 5){
      return this.saveDraftWarranty();
    } if (this.props.navigation.state.params.ticketCatIdSend == 6){
      return this.saveDraftGoodwill();
    } if (this.props.navigation.state.params.ticketCatIdSend == 7){
      return this.saveDraftPassword();
    } else if (this.props.navigation.state.params.ticketCatIdSend == 8){
      return this.saveDraftTelematics();
    }
    //partstechnical
    //helpdesk
  }

  selectImage() {
    const options = {
      title: 'Pilih Gambar',
      storageOptions: {
        skipBackup: true,
        path: 'image',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      this.compressImage("data:" + response.type + ";base64," + response.data, response.originalRotation)
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
  }

  actionFile(image) {
    if (image != '' && image != null) {
      return { uri: image, cache: 'reload', }
    } else {
      return Images.imgDefault
    }
  }

  actionDeleteTag = (items) => {
    var index = this.state.dataTag.findIndex(item => item.Username === items)
    this.state.dataTag.splice(index, 1)
    setTimeout(() => {
      this.setState({ temporaryParticipant: this.state.dataTag })
    }, 100)
  }

  actionDeleteFile = (items) => {
    var index = this.state.dataFileAttachement.findIndex(item => item.Name === items)
    this.state.dataFileAttachement.splice(index, 1)
    setTimeout(() => {
      this.setState({ temporaryFileAttach: this.state.dataFileAttachement })
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
        <TouchableOpacity block light style={styles.bnext} >
          <ActivityIndicator size="small" color="#fff" />
        </TouchableOpacity>
      )
    }
  }
  actionSaveDraft() {
    if (this.state.isLoadingSaveDraft === true) {
      return (
        <TouchableOpacity block style={styles.bsave} onPress={() => this.validationFormSaveDraft()}>
          <Text style={{ color: 'black', alignContent: 'center' }}>Save As Draft</Text>
        </TouchableOpacity>
      )
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
        NavigationActions.navigate({ routeName: 'ProductScreen' })
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }

  actionPartstecnical() {
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
    let viewShow1, viewShow2, viewShow3, showClose, showMenu;

    const { query2 } = this.state;
    const dataParticipant = this.findDataParticipant(query2);
    const comp2 = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

    const { query } = this.state;
    const dataResponder = this.findDataResponder(query);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

    const { query1 } = this.state;
    const dataSerialNumber = this.findDataSerial(query1);
    const comp1 = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

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

    //product healt
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
              <Text style={styles.textBold}>{this.state.family}</Text>
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
              placeholder={this.state.SMU}
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
    //technical part
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
              <View style={{ width: '75%' }}>
                <Text style={{ color: '#D7D7D7' }}>{this.state.dataTicketNumber}</Text>
              </View>
            </View>
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
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
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
              <Text style={styles.textBold}>{this.state.family}</Text>
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
              placeholder={this.state.SMU}
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
              placeholder="Enter..."
              defaultValue={this.state.dataPartsNumber}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataPartsNumber: text })}
            />
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
              <Text style={styles.textall}>Parts Description</Text>
            </View>
            <TextInput
              style={styles.textInputStyle}
              placeholder="Enter..."
              defaultValue={this.state.dataPartsDescription}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataPartsDescription: text })}
            />
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
              <Text style={styles.textall}>Request Description</Text>
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
          <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
            <View style={{ flexDirection: 'row', width: '100%' }}>
              <View style={{ width: '20%' }}>
                <Text style={styles.textall}>TR Type</Text>
              </View>
              <View style={{ width: '5%' }}>
                <Text style={styles.textall}>:</Text>
              </View>
              <View style={{ width: '75%' }}>
                <Text style={{ color: '#D7D7D7' }}>Dimension</Text>
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
                <Text style={{ color: '#D7D7D7' }}>{this.state.dataTicketNumber}</Text>
              </View>
            </View>
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
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
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
              <Text style={styles.textall}>Part Number</Text>
            </View>
            <TextInput
              style={styles.textInputStyle}
              placeholder="Enter..."
              defaultValue={this.state.dataPartsNumber}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataPartsNumber: text })}
            />
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
              <Text style={styles.textall}>Parts Description</Text>
            </View>
            <TextInput
              style={styles.textInputStyle}
              placeholder="Enter..."
              defaultValue={this.state.dataPartsDescription}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataPartsDescription: text })}
            />
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
              <Text style={styles.textall}>Request Description</Text>
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

    //reference
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
                <Text style={{ color: '#D7D7D7' }}>{this.state.dataTicketNumber}</Text>
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
              <Text style={styles.textall}>Description</Text>
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
                <Text style={{ color: '#D7D7D7' }}>{this.state.dataTicketNumber}</Text>
              </View>
            </View>
          </View>
          <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
            <View style={{ flexDirection: 'column', width: '100%' }}>
              <Text style={styles.textall}>Customer</Text>
              <Text style={styles.textBold}>{this.state.custumer}</Text>
            </View>
          </View>
          
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
              <Text style={styles.textall}>Service Order Number</Text>
            </View>
            <TextInput
              style={styles.textInputStyle}
              placeholder="Enter..."
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
              placeholder="Enter..."
              defaultValue={this.state.dataClaimNumber}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataClaimNumber: text })}
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
              placeholder={this.state.SMU}
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
              <Text style={styles.textall}>Parts Description</Text>
            </View>
            <TextInput
              style={styles.textInputStyle1}
              placeholder="Enter..."
              allowFontScaling={false}
              defaultValue={this.state.dataPartDescription}
              numberOfLines={5}
              multiline={true}
              onChangeText={(text) => this.setState({ dataPartDescription: text })}
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
// goowill reference
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
                <Text style={{ color: '#D7D7D7' }}>{this.state.dataTicketNumber}</Text>
              </View>
            </View>
          </View>
          <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
            <View style={{ flexDirection: 'column', width: '100%' }}>
              <Text style={styles.textall}>Customer</Text>
              <Text style={styles.textBold}>{this.state.custumer}</Text>
            </View>
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
              <Text style={styles.textall}>Service Order Number</Text>
            </View>
            <TextInput
              style={styles.textInputStyle}
              placeholder="Enter..."
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
              placeholder="Enter..."
              defaultValue={this.state.dataClaimNumber}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataClaimNumber: text })}
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
              placeholder={this.state.SMU}
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
              <Text style={styles.textall}>Parts Description</Text>
            </View>
            <TextInput
              style={styles.textInputStyle1}
              placeholder="Enter..."
              allowFontScaling={false}
              defaultValue={this.state.dataPartDesc}
              numberOfLines={5}
              multiline={true}
              onChangeText={(text) => this.setState({ dataPartDesc: text })}
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
          <View style={{ marginTop: 20, marginLeft: 30, marginRight: 20 }}>
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
            <TextInput
              style={styles.textInputStyle}
              placeholder="Enter..."
              defaultValue={this.state.dataPassword}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataPassword: text })}
            />
          </View>
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
                <Text style={{ color: '#D7D7D7' }}>{this.state.dataTicketNumber}</Text>
              </View>
            </View>
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
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
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
              <Text style={styles.textall}>Service Tool S/N</Text>
            </View>
            <TextInput
              style={styles.textInputStyle}
              placeholder="Enter..."
              defaultValue={this.state.dataServiceTool}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataServiceTool: text })}
            />
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
              <Text style={styles.textall}>Engine S/N</Text>
            </View>
            <TextInput
              style={styles.textInputStyle}
              placeholder="Enter..."
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
              placeholder="Enter..."
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
              placeholder="Enter..."
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
              placeholder="Enter..."
              defaultValue={this.state.dataReason}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataReason: text })}
            />
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
              <Text style={styles.textall}>Diagnostic Clock</Text>
            </View>
            <TextInput
              style={styles.textInputStyle}
              placeholder="Enter..."
              defaultValue={this.state.dataDiagnostic}
              allowFontScaling={false}
              onChangeText={(text) => this.setState({ dataDiagnostic: text })}
            />
          </View>
          <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
            <View>
              <Text style={styles.textall}>Request Description</Text>
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
    // condition
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
            <Text style={styles.textall}>Add Responder</Text>
          </View>
          <Autocomplete
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.textInputStyle}
            inputContainerStyle={{ borderColor: 'rgba(255,255,255,0.1)' }}
            data={dataResponder.length === 1 && comp(query, dataResponder[0]) ? [] : dataResponder}
            defaultValue={query}
            onChangeText={text => this.setState({ query: text })}
            placeholder="Enter..."
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => this.setState({ query: item })}>
                <Text style={styles.itemText}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />

        </View>
        <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
          <View>
            <Text style={styles.textall}>Add Participant</Text>
          </View>
          <Autocomplete
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.textInputStyle}
            inputContainerStyle={{ borderColor: 'rgba(255,255,255,0.1)' }}
            data={dataParticipant.length === 1 && comp2(query2, dataParticipant[0]) ? [] : dataParticipant}
            defaultValue={query2}
            onChangeText={text => this.setState({ query2: text })}
            placeholder="Enter..."
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => this.setState({ query2: item, dataTag: [...this.state.dataTag, { Username: item }], temporaryParticipant: [...this.state.temporaryParticipant, { Username: item }] })}>
                <Text style={styles.itemText}>
                  {item}
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
                  <Text style={styles.textTag}>{item.Username}</Text>
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
            defaultValue={this.state.email}
            allowFontScaling={false}
            onChangeText={(text) => this.setState({ email: text })}
          />
        </View>
      </View>
    }

    if (this.state.show3 === false) {
      viewShow3 = <TouchableOpacity onPress={() => this.actionShow3()}>
        <View style={styles.collapseheader2}>
          <Text style={styles.textheader}>Attachment</Text>
          <Image source={Images.arrowDown} style={styles.imageArrow} tintColor={"white"} />
          {/* <Text style={styles.subtextheader}>Contributor</Text> */}
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
            <TouchableOpacity onPress={() => this.selectImage()}>
              <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#CCCCCC', padding: 10, borderRadius: 10 }}>
                <Text>Browse</Text>
                <Icon type="FontAwesome" name="plus-circle" style={{ color: 'black' }} />
              </View>
            </TouchableOpacity>
            <ScrollView horizontal={true}>
              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                {this.state.temporaryFileAttach.map((item, id) => {
                  return (
                    <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                      <Image source={this.actionFile(item.Name)} style={{ width: 120, height: 120, borderRadius: 5 }} />
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center', width: 120, marginTop: 10 }}>
                        <Text>Image{id + 1}.jpg</Text>
                        <TouchableOpacity onPress={() => this.actionDeleteFile(item.Name)}>
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
              <Image source={Images.ic_logo} style={{ width: 190, height: 50 }} />
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
