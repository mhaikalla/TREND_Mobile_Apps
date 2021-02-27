import React, { PureComponent } from "react";
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Dimensions,
    Image,
    ImageBackground,
    ActivityIndicator,
    FlatList, 
    TouchableNativeFeedback,
    Keyboard,
    BackHandler,
} from "react-native";
import { Images, API } from "@res";
import { StackActions, NavigationActions } from "react-navigation";
import AsyncStorage from "@react-native-community/async-storage";
import Modal from "react-native-modal";


export default class MenuSearchScreen extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            textSearch: '',
            tokenData: '',
            listTR: [],
            loadingGetData: false,
            loadingGetDataKosong: false,
            trNoSend: '',
            titleSend: '',
            descSend: '',
            idData: '',
            ticketCatIdSend: '',
            serialNumberSend: '',
            partFailureSend: '',
            emailSend: '',
            SmuSend: '',
            responseMessages: '',
            userId: 0,
            responderSend: 0,
            submiterSend: 0,
            dppmnumSend: '',
            StatusSend: 0,
            duedatesend: '',
            nextcomentersend: 0
        }
        // BackHandler.addEventListener('hardwareBackPress', this.actionBackApp)
    }

    DismisKeyboard = (children) => {
        <TouchableNativeFeedback onPress={() => Keyboard.dismiss}>
            {children}
        </TouchableNativeFeedback>
    }

    componentDidMount() {
        this.getToken();
    }

    getToken = async () => {
        const mToken = await AsyncStorage.getItem('@token');
        const mUserId = await AsyncStorage.getItem('@userid');
        
        this.setState({ 
            tokenData: mToken,
            userId: mUserId,
         })
    }

    actionBackApp = () =>  {
        
        // const resetAction = StackActions.reset({
        //     index: 0,
        //     actions: [
        //         NavigationActions.navigate({ routeName: 'MyTechnicalScreen' })
        //     ]
        // });
        // this.props.navigation.dispatch(resetAction);
        this.props.navigation.navigate('MyTechnicalScreen')
        // return true
    }

    getSearchData() {
        Keyboard.dismiss();
        // if (this.state.textSearch.length < 4) {
        //         alert('minimal 4 karakter')
        // } else {
            this.setState({ loadingGetData: true, loadingGetDataKosong: false, listTR: [] })
            fetch(API.searchDataMy + this.state.textSearch, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'r74Dkl9KUp7dsERGFmmA0uOoD1udYE',
                    'AccessToken': this.state.tokenData,
                }
            })
                .then((respon) => respon.json())
                .catch((error) => {
                    console.log(error);
                })
                .then((response) => {
                    console.log("Search Result")
                    console.log(JSON.stringify(response))
                    if (response.message.code === 200) {
                        var Data1 = response.result
                        this.setState({
                            listTR: Data1.sort((a, b) => parseInt(b.TicketId) - parseInt(a.TicketId)),
                            // listTR: response.result,
                            loadingGetData: false
                        }, () => {
                            // console.log("DATA")
                            // console.log(this.state.listTR)
                        })
                    } else {
                        this.setState({ responseMessages: response.message.description, loadingGetData: false, loadingGetDataKosong: true })
                    }
                })
        // }
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

    actionAddDPPM() {
        this.setState({ isModalOption: false })
        // alert(this.state.trNoSend)
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'DppmScreen', params: { sendTitle: this.state.titleSend, sendTrNo: this.state.trNoSend } })
            ]
        });
        this.props.navigation.dispatch(resetAction);
    }

    goToReopen = () => {
        // console.log(this.state.ticketCatIdSend)
        // this.setState({ isModalOption: false });
        // const resetAction = StackActions.reset({
        //     index: 0,
        //     actions: [
        //         NavigationActions.navigate({
        //             routeName: 'ReopenScreen', params: {
        //                 idData: this.state.idData,
        //                 ticketCatIdSend: this.state.ticketCatIdSend,
        //                 trNoSend: this.state.trNoSend,
        //                 titleSend: this.state.titleSend,
        //                 descSend: this.state.descSend,
        //             }
        //         })
        //     ]
        // });
        // this.props.navigation.dispatch(resetAction);
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
    }

    actionView() {
        this.setState({ isModalOption: false });
        // const resetAction = StackActions.reset({
        //     index: 0,
        //     actions: [
        //         NavigationActions.navigate({
        //             routeName: 'ViewScreen', params: {
        //                 trNoSend: this.state.trNoSend,
        //                 titleSend: this.state.titleSend,
        //                 descSend: this.state.descSend,
        //                 ticketidSend: this.state.idData,
        //                 ticketCatIdSend: this.state.ticketCatIdSend,
        //                 duedateSend: this.state.duedatesend,
        //                 nxtxomenter: this.state.nextcomentersend,
        //                 escalatesend: this.state.escalatesend,
        //                 submiternamesend: this.state.submiternamesend,
        //                 submiterratesend: this.state.submiterratesend,
        //                 responderratesend: this.state.responderratesend,
        //                 frompage:3
        //             }
        //         })
        //     ]
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
                        escalatesend: this.state.escalatesend,
                        submiternamesend: this.state.submiternamesend,
                        submiterratesend: this.state.submiterratesend,
                        responderratesend: this.state.responderratesend,
                        frompage:3
        })
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

    render() {
        let loaderGetData, showSelectOptionModal, showRating, rating;

        if (this.state.loadingGetData === true) {
            loaderGetData = <View style={{ resizeMode: 'center', flex: 1, flexDirection: 'column', alignContent: 'center', alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} >
                <ActivityIndicator size="large" color={'#FABA00'} />
                <Text>Please Wait...</Text>
            </View>
        } else {
            if (this.state.loadingGetDataKosong === false) {
                loaderGetData = <FlatList
                    data={this.state.listTR}
                    renderItem={({ item, id }) => {
                        let showStatus, statusbar;
                        
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
                        if (item.DueDateAnswer > today) {
                            statusbar = <View style={{ height: 5, width: 120, backgroundColor: 'green', borderRadius: 5, marginTop:5, alignSelf:'center' }}>
                            </View>
                        } else if (item.DueDateAnswer < today) {
                            statusbar = <View style={{ height: 5, width: 120, backgroundColor: 'red', borderRadius: 5, marginTop: 5, alignSelf: 'center' }}>
                            </View>
                        } else if (item.DueDateAnswer == today) {
                            statusbar = <View style={{ height: 5, width: 120, backgroundColor: '#FAFA04', borderRadius: 5, marginTop: 5, alignSelf: 'center' }}>
                            </View>
                        }

                        

                        if (item.Status == 1) {
                            //draft
                            showStatus = <Text style={{ fontSize: 15, color: '#5B5B5B' }}>Draft</Text>
                        } else if (item.Status == 2) {
                            if (item.IsEscalated) {
                                if (item.NextCommenter == 0) {
                                    if (item.Responder == this.state.userId && item.Submiter == this.state.userId) {
                                        // escalate waiting your feed back
                                        showStatus = <Text style={{ fontSize: 10, color: '#5B5B5B' }}>Escalate - waiting your feedback</Text>
                                    } else {
                                        // escalate pra
                                        showStatus = <Text style={{ fontSize: 10, color: '#5B5B5B' }}>Escalate - PRA</Text>
                                    }
                                } else {
                                    if (this.state.userId == item.NextCommenter) {
                                        // escalate waiting your feed back
                                        showStatus = <Text style={{ fontSize: 10, color: '#5B5B5B' }}>Escalate - waiting your feedback</Text>
                                    } else {
                                        if (item.NextCommenter == item.Responder) {
                                            // escalate pra
                                            showStatus = <Text style={{ fontSize: 10, color: '#5B5B5B' }}>Escalate - PRA</Text>
                                        } else if (item.NextCommenter == item.Submiter) {
                                            // escalate psa 
                                            showStatus = <Text style={{ fontSize: 10, color: '#5B5B5B' }}>Escalate - PSA</Text>
                                        }
                                    }
                                }
                            } else {
                                if (item.NextCommenter == 0) {
                                    if (item.Responder == this.state.userId && item.Submiter == this.state.userId) {
                                        // waiting your feedback
                                        showStatus = <Text style={{ fontSize: 15, color: '#5B5B5B' }}>waiting your feedback</Text>
                                    } else {
                                        // PRA
                                        showStatus = <Text style={{ fontSize: 15, color: '#5B5B5B' }}>PRA</Text>
                                    }
                                } else {
                                    if (this.state.userId == item.NextCommenter) {
                                        // waiting your feed back
                                        showStatus = <Text style={{ fontSize: 15, color: '#5B5B5B' }}>waiting your feedback</Text>
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
                            showStatus = <Text style={{ fontSize: 15, color: '#5B5B5B' }}>closed</Text>
                        } else if (item.Status == 6) {
                            // solved
                            showStatus = <Text style={{ fontSize: 15, color: '#5B5B5B' }}>Solved</Text>
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
                                    <Text style={{ fontSize: 10, color: '#959595' }}>{kind === RENDER_RESPONDER_RATING  ? "Responder Rating" : "Submitter Rating"}</Text>
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
                        }

                        return (
                            <View style={{ paddingLeft: 10, paddingRight: 10, paddingBottom: 10 }}>
                                <View style={ styles.backgroundList}>
                                    <Text style={{ fontSize: 12, color: '#959595' }}>{item.RecentDate.substring(0, 10)}</Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                                        <View style={{ width: '95%' }}>
                                            <View style={{ flexDirection: 'row', width: '100%' }}>
                                                <View style={{ width: '25%' }}>
                                                    <Text style={{ fontSize: 15, color: '#959595' }}>Title</Text>
                                                </View>
                                                <View style={{ width: '5%' }}>
                                                    <Text style={{ fontSize: 15, color: '#5B5B5B' }}>:</Text>
                                                </View>
                                                <View style={{ width: '70%' }}>
                                                    <Text style={{ fontSize: 15, color: '#5B5B5B' }}>{item.Title}</Text>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', width: '100%' }}>
                                                <View style={{ width: '25%' }}>
                                                    <Text style={{ fontSize: 15, color: '#959595' }}>TR No</Text>
                                                </View>
                                                <View style={{ width: '5%' }}>
                                                    <Text style={{ fontSize: 15, color: '#5B5B5B' }}>:</Text>
                                                </View>
                                                <View style={{ width: '70%' }}>
                                                    <Text style={{ fontSize: 15, color: '#5B5B5B' }}>{item.TicketNo}</Text>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', width: '100%' }}>
                                                <View style={{ width: '25%' }}>
                                                    <Text style={{ fontSize: 15, color: '#959595' }}>Status</Text>
                                                </View>
                                                <View style={{ width: '5%' }}>
                                                    <Text style={{ fontSize: 15, color: '#5B5B5B' }}>:</Text>
                                                </View>
                                                <View style={{ width: '70%' }}>
                                                    {showStatus}
                                                </View>
                                            </View>

                                            {statusbar}
                                            {showRating()}
                                        </View>
                                        <View style={{ width: '5%' }}>
                                            <TouchableOpacity onPress={() => {
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
                                                    StatusSend: item.Status,
                                                    duedatesend: item.DueDateAnswer,
                                                    nextcomentersend: item.NextCommenter,
                                                    escalatesend: item.IsEscalated,
                                                    submiternamesend: item.SubmiterName,
                                                    submiterratesend: item.SubmiterRating,
                                                    responderratesend: item.ResponderRating,
                                                });
                                            }}>
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
                    }}
                    keyExtractor={(item, index) => index.toString()}
                />
            } else {
                loaderGetData = <View style={{ resizeMode: 'center', flex: 1, flexDirection: 'column', alignContent: 'center', alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} >
                    <Text>{this.state.responseMessages}</Text>
                </View>
            }
        }

        if (this.state.userId == this.state.responderSend && this.state.dppmnumSend == null) {

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
                        <View style={{ marginTop: 15, borderBottomWidth: 1 }}>
                            <TouchableOpacity onPress={this.goToEdit}>
                                <Text style={{ color: '#000', fontSize: 15 }}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginTop: 15, borderBottomWidth: 1 }}>
                            <TouchableOpacity onPress={this.goToDppm}>
                                <Text style={{ color: '#000', fontSize: 15 }}>Add To DPPM</Text>
                            </TouchableOpacity>
                        </View>
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
                        <View style={{ marginTop: 15, borderBottomWidth: 1 }}>
                            <TouchableOpacity onPress={this.goToEdit}>
                                <Text style={{ color: '#000', fontSize: 15 }}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginTop: 15, borderBottomWidth: 1 }}>
                            <TouchableOpacity onPress={this.goToReopen}>
                                <Text style={{ color: '#000', fontSize: 15 }}>Re-Open</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginTop: 15, borderBottomWidth: 1 }}>
                            <TouchableOpacity onPress={this.goToDppm}>
                                <Text style={{ color: '#000', fontSize: 15 }}>Add To DPPM</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            }
        } else if (this.state.userId != this.state.responderSend && this.state.dppmnumSend != null) {
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
                        <View style={{ marginTop: 15, borderBottomWidth: 1 }}>
                            <TouchableOpacity onPress={this.goToEdit}>
                                <Text style={{ color: '#000', fontSize: 15 }}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginTop: 15, borderBottomWidth: 1 }}>
                            <TouchableOpacity onPress={this.goToDppm}>
                                <Text style={{ color: '#000', fontSize: 15 }}>Edit DPPM</Text>
                            </TouchableOpacity>
                        </View>
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
                        <View style={{ marginTop: 15, borderBottomWidth: 1 }}>
                            <TouchableOpacity onPress={this.goToEdit}>
                                <Text style={{ color: '#000', fontSize: 15 }}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginTop: 15, borderBottomWidth: 1 }}>
                            <TouchableOpacity onPress={this.goToReopen}>
                                <Text style={{ color: '#000', fontSize: 15 }}>Re-Open</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginTop: 15, borderBottomWidth: 1 }}>
                            <TouchableOpacity onPress={this.goToDppm}>
                                <Text style={{ color: '#000', fontSize: 15 }}>Edit DPPM</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            }
        } else if (this.state.userId != this.state.responderSend && this.state.dppmnumSend == null) {
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
                        <View style={{ marginTop: 15, borderBottomWidth: 1 }}>
                            <TouchableOpacity onPress={this.goToDppm}>
                                <Text style={{ color: '#000', fontSize: 15 }}>Add To DPPM</Text>
                            </TouchableOpacity>
                        </View>
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
                        <View style={{ marginTop: 15, borderBottomWidth: 1 }}>
                            <TouchableOpacity onPress={this.goToReopen}>
                                <Text style={{ color: '#000', fontSize: 15 }}>Re-Open</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginTop: 15, borderBottomWidth: 1 }}>
                            <TouchableOpacity onPress={this.goToDppm}>
                                <Text style={{ color: '#000', fontSize: 15 }}>Add To DPPM</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            }
        } else {
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
                        <View style={{ marginTop: 15, borderBottomWidth: 1 }}>
                            <TouchableOpacity onPress={this.goToReopen}>
                                <Text style={{ color: '#000', fontSize: 15 }}>Re-Open</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            }
        }
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#CCCCCC' }}>
                {this.DismisKeyboard()}
                <View style={{ flex: 1 }}>
                    <ImageBackground source={Images.bg_splash} style={styles.backgroundImage} >
                        <View style={{ padding: 10, width: '100%', flexDirection: 'row' }}>
                            <View style={{ width: "7%", marginTop: 7 }}>
                                <TouchableOpacity onPress={() => this.actionBackApp()}>
                                    <Image source={Images.iconBack} style={styles.imageBack} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: '68%', marginLeft: 5 }}>
                                <TextInput
                                    style={styles.textInputStyle}
                                    placeholder="Enter Your Keyword"
                                    allowFontScaling={false}
                                    onChangeText={(text) => this.setState({ textSearch: text })}
                                />
                            </View>
                            <View style={{ width: '25%', marginLeft: 10 }}>
                                <TouchableOpacity onPress={() => this.getSearchData()}>
                                    <View style={{ backgroundColor: '#F90', padding: 7, width: Dimensions.get('window').width * 0.2, marginTop: 5, borderRadius: 5 }}>
                                        <Text style={{ alignSelf: 'center' }}>Search</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {loaderGetData}
                    </ImageBackground>
                </View>
                {showSelectOptionModal}
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
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
    },
    imageBack: {
        width: Dimensions.get('window').width * 0.06,
        height: Dimensions.get('window').width * 0.06,
        alignItems: 'center'
    },
    backgroundImage: {
        resizeMode: "cover",
        width: '100%',
        height: '100%',
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
    backgroundList: {
        backgroundColor: "#fff", 
        padding: 20, 
        borderRadius: 20, 
        borderColor: '#d9d2d2', 
        borderWidth: 1, 
        flexDirection: 'column', 
        shadowColor: "#808080",
        shadowOffset: {
        width: 2,
        height: 2,
        },
        shadowOpacity: 2,
        shadowRadius: 5,
        elevation: 4
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