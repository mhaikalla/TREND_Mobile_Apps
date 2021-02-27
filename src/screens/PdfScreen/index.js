
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
    Platform
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
            StartDate: '',
            EndDate: '',
            isModaldateSort: false,
            tmpDataMyTr: [],
            dropdownsort: true,
            showdate: false,
            AddDate: '',
            showbottommenu: false,
            showroundemenu: true,
            closemenu: false,
            responderSend: 0,
            submiterSend: 0,
            dppmnumSend: '',
            StatusSend: 0,
            duedatesend: '',
            dropdownvalue: '',
            nextcomentersend: 0,
            listtrfilter: [],
            SubmiterRating: 0,
            ResponderRating: 0,
            userImage: ''
        };
        this.springValue = new Animated.Value(100);
        this.menuAnimation = new Animated.Value(0);
        this.onOpened = this.onOpened.bind(this);
    }


    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this._onBackPress)
        OneSignal.addEventListener('opened', this.onOpened);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this._onBackPress)
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

    componentDidMount() {
        this.getToken();
    }

    getToken = async () => {
        const mToken = await AsyncStorage.getItem('@token');
        const mUserId = await AsyncStorage.getItem('@userid');
        const mUserName = await AsyncStorage.getItem('@userName');
        const mLocationUser1 = await AsyncStorage.getItem('@locationUser1');
        const mLocationUser2 = await AsyncStorage.getItem('@locationUser2');
        const mUserImage = await AsyncStorage.getItem('@uriimage');
        this.setState({
            tokenData: mToken,
            userId: mUserId,
            userName: mUserName,
            locationUser1: mLocationUser1,
            locationUser2: mLocationUser2,
            userImage: mUserImage
        });
        console.log(mToken)
        if (this.state.tokenData != null || this.state.tokenData != '') {
            // this.getMyTR(this.state.listPage);
        }
    }
    render() {
       


        const source = require('../TREND_User_Guide.pdf');

        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={{ flex: 1, width: '100%', flexDirection: 'column' }}>
                    <View style={{ height: Dimensions.get('window').height * 0.67 }}>
                        <Pdf
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
                        style={styles.pdf} />
                    </View>
                </View>
               
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

    RoundedMenu: {
        backgroundColor: 'rgba(243,177,0,0.6)',
        borderRadius: 50,
        width: 50, height: 50,
        position: 'absolute',
        bottom: 20,
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
    animatedMenu: {
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor:'red',
        position: 'absolute',
        bottom: 1,
        // marginTop:-50
    }
});