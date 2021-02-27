/**
  * @Author: adhinugraha
  * @Last modified by:   adhinugraha
  * @Last modified time: 2019-03-12T17:06:29+07:00
  */

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
import { ModalMenu } from '@component';
import { Images } from '@res';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker'
import ImageResizer from 'react-native-image-resizer'
import ImgToBase64 from 'react-native-image-base64'
import Modal from 'react-native-modal';
import { StackActions, NavigationActions } from 'react-navigation';

export default class MyTechnicalScreenEdit extends React.Component {
    constructor(props) {
        super(props);
        this.registerCall = this.registerCall.bind(this);
        var { height, width } = Dimensions.get('window');
        this.state = {
            title: props.title,
            expanded: true,
            animation: new Animated.Value(),
            screenHeight: height,
            screenWidth: width,
            dataTitle: '',
            dataDescription: '',
            dataPartsDescription: '',
            dataManufacture: '',
            dataPartsNumber: '',
            dataRequest: '',

            tokenData: '',
            dataTicketNumber: '',
            attachmentImage: [],
            attachmentName: '',
            dataResponder: [],
            dataParticipant: [],
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
            isModalFormKosongTitle: false,
            isModalFormKosongDescription: false,
            isModalFormKosongPartDesc: false,
            isModalFormKosongManufacture: false,
            isModalFormKosongDescription: false,
            isModalFormKosongPartsNum: false,

            responMessage: '',
            isLoadingSubmit: true,
            isLoadingSaveDraft: true,
        };
    }

    componentWillMount(){
        this.getToken();
    }

    componentDidMount() {
       setTimeout(() => {
           this.getTicketNumber();
           this.getListResponder();
           this.getListPartipant();
       }, 2000);
    }

    getToken = async () => {
        const mToken = await AsyncStorage.getItem('@token');
        if (mToken != null && mToken != '') {
            this.setState({
                tokenData: mToken
            })
            
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

    actionMyTechnicalScreen() {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'MyTechnicalScreen' })
            ]
        });
        this.props.navigation.dispatch(resetAction);
    }

    getListResponder() {
        fetch('https://apps.dipstrategy.com/trakindotsics/api/mobile/respondersuggestion?xupj=xupj21', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
                'AccessToken': 'GOn9T65KVky5I6UJvkYkoA==1',
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                let Data4 = responseJson.data
                // alert(JSON.stringifyng(Data4))
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

    findDataParticipant(query2) {
        if (query2 === '') {
            return [];
        }
        const { dataParticipant } = this.state;
        const regex = new RegExp(`${query2.trim()}`, 'i');
        return dataParticipant.filter(data => data.search(regex) >= 0);
    }

    getTicketNumber() {
        fetch('https://apps.dipstrategy.com/trakindotsics/api/mobile/ticketnumber?categoryId=1', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
                'AccessToken': 'GOn9T65KVky5I6UJvkYkoA==1',
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
        fetch('https://apps.dipstrategy.com/trakindotsics/api/mobile/participantssuggestion?xupj=xupj21', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
                'AccessToken': 'GOn9T65KVky5I6UJvkYkoA==1',
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

    registerCall() {
        this.setState({ isLoadingSubmit: false })
        fetch('http://devapps.trakindo.co.id/TSICS/api/mobile/dimension',
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
                    Manufacture: this.state.dataManufacture,
                    PartsDescription: this.state.dataPartsDescription,
                    Description: this.state.dataDescription,
                    PartsNumber: this.state.dataPartsNumber,
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
                        responMessage: JSON.stringify(response.status.description),
                        dataTitle: '',
                        dataDescription: '',
                        query: '',
                        dataManufacture: '',
                        dataPartsDescription: '',
                        dataDescription: '',
                        dataPartsNumber: '',
                        email: '',
                        temporaryAddTag: [],
                        temporaryFileAttach: [],
                        temporaryParticipant: [],
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

    saveDraft() {
        this.setState({ isLoadingSaveDraft: false })
        fetch('http://devapps.trakindo.co.id/TSICS/api/mobile/dimension',
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
                    Manufacture: this.state.dataManufacture,
                    PartsDescription: this.state.dataPartsDescription,
                    Description: this.state.dataDescription,
                    PartsNumber: this.state.dataPartsNumber,
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
                        responMessage: JSON.stringify(response.status.description),
                        dataTitle: '',
                        dataDescription: '',
                        query: '',
                        dataManufacture: '',
                        dataPartsDescription: '',
                        dataDescription: '',
                        dataPartsNumber: '',
                        email: '',
                        temporaryAddTag: [],
                        temporaryFileAttach: [],
                        temporaryParticipant: [],
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
        // if (this.state.dataTitle === '') {
        //     return this.setState({ isModalFormKosongTitle: true, isLoadingSubmit: false });
        // } else if (this.state.dataDescription === '') {
        //     return this.setState({ isModalFormKosongDescription: true, isLoadingSubmit: false });
        // } else if (this.state.dataPartsDescription === '') {
        //     return this.setState({ isModalFormKosongPartDesc: true, isLoadingSubmit: false });
        // } else if (this.state.dataManufacture === '') {
        //     return this.setState({ isModalFormKosongManufacture: true, isLoadingSubmit: false });
        // } else if (this.state.dataPartsNumber === '') {
        //     return this.setState({ isModalFormKosongPartsNum: true, isLoadingSubmit: false });
        // } else {
        //     return this.registerCall();
        // }
        this.setState({isLoadingSubmit:false})
        setTimeout(() => {
            this.updateTr()
        }, 1000);
    }

    validationFormSaveDraft() {
        if (this.state.dataTitle === '' || this.state.dataTitle === null) {
            this.setState({ isModalFormKosongTitle: true, isLoadingSaveDraft: false });
        } else if (this.state.dataDescription === '' || this.state.dataDescription === null) {
            this.setState({ isModalFormKosongDescription: true, isLoadingSaveDraft: false });
        } else if (this.state.dataPartsDescription === '' || this.state.dataPartsDescription === null) {
            this.setState({ isModalFormKosongPartDesc: true, isLoadingSaveDraft: false });
        } else if (this.state.dataManufacture === '' || this.state.dataManufacture === null) {
            this.setState({ isModalFormKosongManufacture: true, isLoadingSaveDraft: false });
        } else if (this.state.dataPartsNumber === '' || this.state.dataPartsNumber === null) {
            this.setState({ isModalFormKosongPartsNum: true, isLoadingSaveDraft: false });
        } else {
            this.saveDraft();
        }
    }

    selectImage() {
        const options = {
            title: 'Choose Images',
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
    toogleDoneDesc() {
        this.setState({ isModalFormKosongDescription: false, isLoadingSubmit: true, isLoadingSaveDraft: true })
    }
    toogleDonePartDesc() {
        this.setState({ isModalFormKosongPartDesc: false, isLoadingSubmit: true, isLoadingSaveDraft: true })
    }
    toogleDoneManufacture() {
        this.setState({ isModalFormKosongManufacture: false, isLoadingSubmit: true, isLoadingSaveDraft: true })
    }
    toogleDonePartNum() {
        this.setState({ isModalFormKosongPartsNum: false, isLoadingSubmit: true, isLoadingSaveDraft: true })
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
                <TouchableOpacity block light style={styles.bnext} onPress={() => this.validationForm()}>
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
    updateTr() {
        fetch('http://devapps.trakindo.co.id/tsics/api/mobile/producthealth',
            {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
                    AccessToken:'AX5nFoW37kCSHwjG/f4SoA==1'
                },
                body: JSON.stringify({
                    Title: this.state.title,
                    Description: this.state.description,
                    SerialNumber:'',
                    SMU:'',
                    PartCausingFailure: this.props.navigation.state.params.PartFailerSend,
                    EmailCC: this.state.email,
                    TicketId: this.props.navigation.state.params.idData
                }),
            }
        )
            .then((response) => { return response.json() })
            .catch((error) => {
                this.setState({ showLoader: false, showError: true })
                clearTimeout(this.updateHandle)
            })
            .then((response) => {
               alert('failed updated')
                this.setState({ isLoadingSubmit: true })
               setTimeout(() => {
                   this.props.navigation.navigate('MyTechnicalScreen')
               }, 1000);
            })
    }


    render() {
        let viewShow1, viewShow2, viewShow3;

        const { query2 } = this.state;
        const dataParticipant = this.findDataParticipant(query2);
        const comp2 = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

        const { query } = this.state;
        const dataResponder = this.findDataResponder(query);
        const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

        if (this.state.show1 === false) {
            viewShow1 = <TouchableOpacity onPress={() => this.actionShow1()}>
                <View style={styles.collapseheader}>
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={styles.textheader}>Technical Request </Text>
                        {/* <Text style={styles.subtextheader}>{this.props.navigation.state.params.idData}</Text> */}
                    </View>
                    <Image source={Images.arrowDown} style={styles.imageArrow} tintColor={"white"} />
                </View>
            </TouchableOpacity>
        } else {
            viewShow1 = <View>
                <TouchableOpacity onPress={() => this.actionShow1false()}>
                    <View style={styles.collapseheader}>
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={styles.textheader}>Technical Request </Text>
                            {/* <Text style={styles.subtextheader}>Dimension</Text> */}
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
                            defaultValue={this.props.navigation.state.params.titleSend}
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
                                {/* <Text style={{ color: '#D7D7D7' }}>Dimension</Text> */}
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
                                <Text style={{ color: '#D7D7D7' }}>{this.props.navigation.state.params.trNoSend}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <View>
                            <Text style={styles.textall}>SMU</Text>
                        </View>
                        <TextInput
                            style={styles.textInputStyle}
                            placeholder="Enter..."
                            defaultValue={this.props.navigation.state.params.SmuSend}
                            allowFontScaling={false}
                            onChangeText={(text) => this.setState({ dataPartsDescription: text })}
                        />
                    </View>
                    
                    <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <View>
                            <Text style={styles.textall}>Parts Description</Text>
                        </View>
                        <TextInput
                            style={styles.textInputStyle}
                            placeholder="Enter..."
                            defaultValue={this.props.navigation.state.params.PartDescSend}
                            allowFontScaling={false}
                            onChangeText={(text) => this.setState({ dataPartsDescription: text })}
                        />
                    </View>
                    <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                        <View>
                            <Text style={styles.textall}>Parts Failure</Text>
                        </View>
                        <TextInput
                            style={styles.textInputStyle}
                            placeholder="Enter..."
                            defaultValue={this.props.navigation.state.params.PartFailerSend}
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
                            defaultValue={this.props.navigation.state.params.descSend}
                            numberOfLines={5}
                            multiline={true}
                            onChangeText={(text) => this.setState({ dataDescription: text })}
                        />
                    </View>
                </View>
            </View>
        }

        if (this.state.show2 === false) {
            viewShow2 = <TouchableOpacity onPress={() => this.actionShow2()}>
                <View style={styles.collapseheader2}>
                    <Text style={styles.textheader}>Contributor</Text>
                    <Image source={Images.arrowDown} style={styles.imageArrow} tintColor={"white"} />
                </View>
            </TouchableOpacity>
        } else {
            viewShow2 = <View>
                <TouchableOpacity onPress={() => this.actionShow2false()}>
                    <View style={styles.collapseheader2}>
                        <Text style={styles.textheader}>Contributor</Text>
                        <Image source={Images.arrowUp} style={styles.imageArrow} tintColor={"white"} />
                    </View>
                </TouchableOpacity>
                {/* <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
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

                </View> */}
                {/* <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
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
                </View> */}
                {/* <View style={{ marginLeft: 20, marginRight: 20, flexDirection: 'row', padding: 10 }}>
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

                </View> */}
                {/* <View style={{ marginTop: 10, marginLeft: 20, marginRight: 20 }}>
                    <View>
                        <Text style={styles.textall}>SMU</Text>
                    </View>
                    <TextInput
                        style={styles.textInputStyle}
                        placeholder="Enter..."
                        defaultValue={this.state.email}
                        allowFontScaling={false}
                        onChangeText={(text) => this.setState({ email: text })}
                    />
                </View> */}
                <View style={{ marginTop: 10, marginLeft: 20, marginRight: 20 }}>
                    <View>
                        <Text style={styles.textall}>Email CC</Text>
                    </View>
                    <TextInput
                        style={styles.textInputStyle}
                        placeholder="Enter..."
                        defaultValue={this.props.navigation.state.params.emailSend}
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
                    <View style={styles.header}>
                        <View style={{ padding: 15, paddingLeft: 10, flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                            <Image source={Images.ic_logo} style={{ width: 120, height: 40 }} />
                        </View>
                    </View>
                    <ScrollView>
                        <View style={{ flexDirection: 'column' }}>
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
                                            {/* {this.actionSaveDraft()} */}
                                            {this.actionSubmit()}
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                    <ModalMenu {...this.props} />
                </View >
                <Modal isVisible={this.state.isModalBerhasil}
                    animationIn='bounceIn'
                    animationOut='bounceOut'
                >
                    <View style={styles.viewmodal}>
                        <Text style={styles.textalertmodal}>{this.state.responMessage}</Text>
                        <TouchableOpacity onPress={() => this.toogleDone()} style={[styles.buttonmodalOK]}>
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

                <Modal isVisible={this.state.isModalFormKosongDescription}
                    animationIn='bounceIn'
                    animationOut='bounceOut'
                >
                    <View style={styles.viewmodal}>
                        <Text style={styles.textalertmodal}>Please Enter Your Parts Description</Text>
                        <TouchableOpacity onPress={() => this.toogleDonePartDesc()} style={[styles.buttonmodalOK]}>
                            <Text style={{ fontWeight: '200', color: '#fff' }}>ok</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <Modal isVisible={this.state.isModalFormKosongPartsNum}
                    animationIn='bounceIn'
                    animationOut='bounceOut'
                >
                    <View style={styles.viewmodal}>
                        <Text style={styles.textalertmodal}>Please Enter Your Parts Number</Text>
                        <TouchableOpacity onPress={() => this.toogleDonePartNum()} style={[styles.buttonmodalOK]}>
                            <Text style={{ fontWeight: '200', color: '#fff' }}>ok</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>


                <Modal isVisible={this.state.isModalFormKosongManufacture}
                    animationIn='bounceIn'
                    animationOut='bounceOut'
                >
                    <View style={styles.viewmodal}>
                        <Text style={styles.textalertmodal}>Please Enter Your Manufacture</Text>
                        <TouchableOpacity onPress={() => this.toogleDoneManufacture()} style={[styles.buttonmodalOK]}>
                            <Text style={{ fontWeight: '200', color: '#fff' }}>ok</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>

                <Modal isVisible={this.state.isModalFormKosongDescription}
                    animationIn='bounceIn'
                    animationOut='bounceOut'
                >
                    <View style={styles.viewmodal}>
                        <Text style={styles.textalertmodal}>Please Enter Your Request Description</Text>
                        <TouchableOpacity onPress={() => this.toogleDoneDesc()} style={[styles.buttonmodalOK]}>
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
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
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
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
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
    }
});