import React, { Component } from 'react';
import {
    Dimensions,
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    Text,
    AsyncStorage
} from 'react-native';
import {
    Textarea,
    Item,
    Label,
    Input,
    Button,
    Icon,
    Footer,
    FooterTab,
    Thumbnail,
} from 'native-base';
import {
    Row,
    Grid
} from 'react-native-easy-grid';
import Modal from "react-native-modal";
import { Images } from '@res';
import { StackActions, NavigationActions } from 'react-navigation';

export default class ModalMenu extends React.Component {
    constructor(props) {
        super(props);
        var { height, width } = Dimensions.get('window');
        this.state = {
            screenHeight: height,
            screenWidth: width,
            multipleFile: [],
            dataSource: {
                EdwUnitId: '',
                UnitSN: '',
                Customer: '',
                Location: '',
                Make: '',
                DeliveryDate: '',
                ArrangementNo: '',
                Family: '',
                Model: '',
                SMU: '',
                roleId : -1,
                roleName : "",
                roleTextColor : "#11100E"  
            },
            pageView: false,
            counterView: 0,
        };
    }

    async componentDidMount() {
        this.getData();

        let roleId = parseInt(await AsyncStorage.getItem("@RoleId"))
        let roleName = await AsyncStorage.getItem("@RoleUser")
        let roleTextColor = (roleId <= 0 ? "#11100E" : (roleId >=2 ? "#A36307": "#006600"))

        this.setState({
            roleId,
            roleName,
            roleTextColor
        })
    }

    getData() {
        fetch('http://devapps.trakindo.co.id/TSICS/api/EdwUnits/1')
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    dataSource: responseJson
                });
            })
            .catch((error) => {
                console.log(error)
            });
    }

    _deleteStoreuser = async () => {
        try {
            await AsyncStorage.removeItem('@token');
            this.modalClose()
            // this.props.navigation.navigate('LoginScreen')
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

    async selectMultipleFile() {
        try {
            const results = await DocumentPicker.pickMultiple({
                type: [DocumentPicker.types.images],
            });
            for (const res of results) {
                console.log('res : ' + JSON.stringify(res));
                console.log('URI : ' + res.uri);
                console.log('Type : ' + res.type);
                console.log('File Name : ' + res.name);
                console.log('File Size : ' + res.size);
            }
            this.setState({ multipleFile: results });
        }
        catch (err) {
            if (DocumentPicker.isCancel(err)) {
                alert('Canceled from multiple doc picker');
            } else {
                throw err;
            }
        }
    }

    modalClose() {
        this.setState({
            pageView: false,
        });
    }

    goToView(counter) {
        this.setState({
            counterView: counter,
            pageView: true,
        });
    }

    actionProduk() {
        this.modalClose()
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'ProductScreen' })
            ]
        });
        this.props.navigation.dispatch(resetAction);
    }

    // actionDiscuss(){
    //     this.modalClose()
    //     const resetAction = StackActions.reset({
    //         index: 0,
    //         actions: [
    //             NavigationActions.navigate({ routeName: 'DiscussScreen' })
    //         ]
    //     });
    //     this.props.navigation.dispatch(resetAction);
    // }

    viewRenderModal() {
        if (this.state.counterView == 2) {
            return (
                <View style={{ width: "100%", }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 14, paddingBottom: 5 }}>Technical Request.</Text>
                        <Text style={{ fontSize: 14, paddingBottom: 5, fontStyle: 'italic', fontWeight: 'bold', marginTop: -1 }}> Choose Category (TR Type):</Text>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <TouchableOpacity style={styles.bpagetechnical} onPress={() => this.actionProduk()}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.textbpagetechnical}>Product Health</Text>
                                <View style={{ backgroundColor: '#BC8C01', width: 8, height: 8, alignSelf: 'center', marginLeft: 20 }}></View>
                            </View>
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={styles.bpagetechnical} onPress={() => this.actionDiscuss()}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.textbpagetechnical}>Disucuss</Text>
                                <View style={{ backgroundColor: '#BC8C01', width: 8, height: 8, alignSelf: 'center', marginLeft: 20 }}></View>
                            </View>
                        </TouchableOpacity> */}
                        <TouchableOpacity style={styles.bpagetechnical} onPress={() => { this.modalClose(); this.props.navigation.navigate('DimensionScreen') }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.textbpagetechnical}>Dimension</Text>
                                <View style={{ backgroundColor: '#BC8C01', width: 8, height: 8, alignSelf: 'center', marginLeft: 20 }}></View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.bpagetechnical} onPress={() => { this.modalClose(); this.props.navigation.navigate('ReferencesScreen') }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.textbpagetechnical}>References</Text>
                                <View style={{ backgroundColor: '#BC8C01', width: 8, height: 8, alignSelf: 'center', marginLeft: 20 }}></View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.bpagetechnical} onPress={() => { this.modalClose(); this.props.navigation.navigate('WarrantyScreen') }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.textbpagetechnical}>Warranty References</Text>
                                <View style={{ backgroundColor: '#BC8C01', width: 8, height: 8, alignSelf: 'center', marginLeft: 20 }}></View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.bpagetechnical} onPress={() => { this.modalClose(); this.props.navigation.navigate('GoodwillScreen') }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.textbpagetechnical}>Goodwill References</Text>
                                <View style={{ backgroundColor: '#BC8C01', width: 8, height: 8, alignSelf: 'center', marginLeft: 20 }}></View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.bpagetechnical} onPress={() => { this.modalClose(); this.props.navigation.navigate('PasswordScreen') }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.textbpagetechnical}>Password</Text>
                                <View style={{ backgroundColor: '#BC8C01', width: 8, height: 8, alignSelf: 'center', marginLeft: 20 }}></View>
                            </View>
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={styles.bpagetechnical} onPress={() => { this.modalClose(); this.props.navigation.navigate('TelematicsScreen') }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.textbpagetechnical}>Telematics</Text>
                                <View style={{ backgroundColor: '#BC8C01', width: 8, height: 8, alignSelf: 'center', marginLeft: 20 }}></View>
                            </View>
                        </TouchableOpacity> */}
                    </View>
                </View>
            );
        }
        else if (this.state.counterView == 1) {
            return (
                <View style={{ width: '100%' }}>
                    <Label style={{ fontSize: 20 }}>Help Desk</Label>
                    <Item inlineLabel style={{ borderColor: 'transparent', height: 15 }}>
                        <Label style={{ fontSize: 15 }}>Report Num:{'\t\t\t'}</Label>
                        <Input
                            editable={false}
                            value={this.state.dataSource.EdwUnitId}
                        />
                    </Item>

                    <Item rounded style={styles.fieldhelpdesk1}>
                        <Input placeholder="Title" onChangeText={(partcf) => this.setState({ partcf })} />
                    </Item>
                    <Textarea rounded style={styles.fieldhelpdesk2}
                        rowSpan={6} placeholder="Write message to admin"
                        onChangeText={(problemd) => this.setState({ problemd })}
                    />
                    <Grid style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Button style={{ elevation: 0, backgroundColor: 'transparent', marginTop: 10, height: 60, width: 95, paddingLeft: 20 }} onPress={this.selectMultipleFile.bind(this)}>
                            <Icon type="MaterialCommunityIcons" name="image-plus" style={{ fontSize: 60, color: 'black', marginLeft: -10 }} />
                        </Button>
                        <Button block style={styles.bpagehelpdesk} onPress={() => { this.props.navigation.goBack() }}>
                            <Text style={{ fontSize: 15, color: 'white' }}>SUBMIT</Text>
                        </Button>
                    </Grid>
                </View>
            );
        }
        else {
            return (
                <View style={{ width: '100%', flexDirection: 'column' }}>
                    <View style={{ paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#E4A900' }}>
                        <Text style={{ color: '#644A00', fontSize: 15 }}>My Account</Text>
                    </View>
                    <View style={{ padding: 15 }}>
                        <View style={{ paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#E4A900', flexDirection: 'column' }}>
                            <Text style={{ color: '#A36307', fontSize: 15 }}>Name</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: '#11100E', fontSize: 15 }}>Name Is</Text>
                                <View style={{ marginLeft: 20 }}>
                                    <Image source={Images.editName} style={{ width: 15, height: 15 }} />
                                </View>
                            </View>
                        </View>
                        <View style={{ paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#E4A900', flexDirection: 'column', marginTop: 15 }}>
                            <Text style={{ color: '#A36307', fontSize: 15 }}>Location</Text>
                            <Text style={{ color: '#11100E', fontSize: 15 }}>Trakindo Head Office</Text>
                            <Text style={{ color: '#11100E', fontSize: 15 }}>Cilandak Jakarta</Text>
                        </View>
                        <View style={{ paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#E4A900', flexDirection: 'column', marginTop: 15 }}>
                            <Text style={{ color: '#A36307', fontSize: 15 }}>User Type</Text>
                            <Text style={{ color: this.state.roleTextColor, fontSize: 15 }}>{this.state.roleName}</Text>
                        </View>
                        <TouchableOpacity onPress={() => { this.goToView(1) }}>
                            <View style={{ paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#E4A900', flexDirection: 'row', marginTop: 20, }}>
                                <Text style={{ color: '#10110E', fontSize: 17 }}>CONTACT HELP DESK</Text>
                                <View style={{ alignItems: 'center', marginLeft: 15 }}>
                                    <Image source={Images.helpDesk} style={{ width: 25, height: 25 }} />
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.bmodalprofile} onPress={() => this.setState({ isModalLogout: true })}>
                            <View style={{ paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#E4A900', flexDirection: 'row', marginTop: 20, }}>
                                <Text style={{ color: '#10110E', fontSize: 17 }}>LOG OUT</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* <Item stackedLabel style={styles.fieldMyProfile}>
                        <Label style={{ fontSize: 15 }}>My Account</Label>
                    </Item>
                    <Item stackedLabel style={styles.fieldMyProfile}>
                        <Label>Name</Label>
                    </Item>
                    <Item stackedLabel style={styles.fieldMyProfile}>
                        <Label>Location</Label>

                    </Item>
                    <Item stackedLabel style={styles.fieldMyProfile}>
                        <Label>User Type</Label>

                    </Item>
                    <Button transparent style={[styles.bmodalprofile, { alignSelf: 'flex-start' }]} onPress={() => { this.goToView(1) }}>
                        <Text style={styles.textbmodalprofile}>CONTACT HELP DESK</Text>
                        <Icon type="FontAwesome5" name="headset" style={{ color: 'black' }} />

                    </Button>
                    <TouchableOpacity style={styles.bmodalprofile} onPress={() => this.setState({ isModalLogout: true })}>
                        <Text style={styles.textbmodalprofile}>Log Out</Text>
                    </TouchableOpacity> */}
                </View>
            );
        }
    }

    render() {
        return (
            <View>
                <Footer style={styles.foot}>
                    <FooterTab style={styles.footer}>
                        <View style={{ padding: 15, flexDirection: 'row', width: '100%', justifyContent: 'space-around' }}>
                            <TouchableOpacity onPress={() => this.goToView(0)} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} style={{ alignSelf: 'center' }}><Thumbnail source={Images.ic_profil} style={{ width: 40, height: 40, borderWidth: 2, borderColor: 'rgb(170, 207, 202)' }} /></TouchableOpacity>
                            <TouchableOpacity onPress={() => { this.props.navigation.navigate('MyTechnicalScreen'); this.modalClose() }} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} style={{ paddingHorizontal: 40, padding: 9, borderWidth: 1, borderBottomColor: 'transparent', borderTopColor: 'transparent', alignSelf: 'center' }}><View style={{ alignItems: 'center', backgroundColor: '#fff', paddingTop: 9, borderRadius: 100, width: 40, height: 40 }}><Image source={Images.ic_technical} style={{ width: 25, height: 25 }} /></View></TouchableOpacity>
                            <TouchableOpacity onPress={() => this.goToView(2)} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} ><View style={{ borderRadius: 100, width: 50, height: 50, alignItems: 'center' }}><Image source={Images.ic_edit} style={{ justifyContent: 'center', width: 30, height: 30 }} /></View></TouchableOpacity>
                        </View>
                    </FooterTab>
                </Footer>
                <Modal
                    visible={this.state.pageView}
                    style={styles.bottomModal}
                    onBackdropPress={() => this.setState({ pageView: null })}
                >
                    <View style={styles.scrollableModal}>
                        <View style={styles.scrollableModalContent}>
                            <View style={{ padding: 15, flexDirection: 'row', width: '100%', justifyContent: 'space-around' }}>
                                <TouchableOpacity onPress={() => this.goToView(0)} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} >
                                    <Thumbnail source={Images.ic_profil} style={{ width: 50, height: 50, borderWidth: 2, borderColor: 'rgb(170, 207, 202)' }} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { this.props.navigation.navigate('MyTechnicalScreen'); this.modalClose() }} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                                    <View style={{ backgroundColor: '#fff', padding: 10, borderRadius: 100, width: 50, height: 50 }}>
                                        <Image source={Images.ic_technical} style={{ width: 30, height: 30 }} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.goToView(2)} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                                    <View style={{ borderRadius: 100, width: 50, height: 50, backgroundColor: '#fff', padding: 10, }}>
                                    <Image source={Images.ic_edit} style={{ width: 30, height: 30 }} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <ScrollView style={{ width: '100%', height: '120%', padding: 20, paddingBottom: 100 }}>
                                {this.viewRenderModal()}
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
                        <Text style={styles.textalertmodal}>Are You Sure?</Text>
                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                            <View style={{ marginRight: 5 }}>
                                <TouchableOpacity onPress={() => this._deleteStoreuser()} style={[styles.buttonmodalOK]}>
                                    <Text style={{ fontWeight: '200', color: '#fff' }}>Ok</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginLeft: 5 }}>
                                <TouchableOpacity onPress={() => this.setState({ isModalLogout: false })} style={[styles.buttonmodalOK]}>
                                    <Text style={{ fontWeight: '200', color: '#fff' }}>Back</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    inputmodalprofile: {
        fontSize: 17, fontWeight: "bold"
    },
    bmodalprofile: {
        marginTop: 10, height: 40
    },
    textbmodalprofile: {
        fontSize: 15, color: 'black', fontWeight: 'bold'
    },
    bpagehelpdesk: {
        backgroundColor: 'grey', marginTop: 20, width: 170, height: 50, borderRadius: 10, elevation: 0
    },
    bpagetechnical: {
        height: 45, alignItems: 'flex-end', paddingRight: 5
    },
    textbpagetechnical: {
        fontSize: 17, color: 'black'
    },
    bfootermodal: {
        // borderTopRightRadius: 20, borderTopLeftRadius: 20, justifyContent: 'space-around', marginTop: 13,
        alignItems: "flex-start",
    },
    fieldMyProfile: {
        width: 300,
        // height: 30,
        borderWidth: 2,
        borderColor: '#E4A900',
        alignItems: 'flex-start'
    },
    footer: {
        // borderTopRightRadius: 20,
        // borderTopLeftRadius: 20,
        backgroundColor: "rgba(255,255,255,0)",
    },
    foot: {
        backgroundColor: '#FABA00',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        height: 60,
    },
    fieldhelpdesk1: {
        borderColor: '#cccac4',
        borderRadius: 10,
        backgroundColor: "#ebebeb",
        marginTop: 10,
    },
    fieldhelpdesk2: {
        borderColor: '#cccac4',
        borderRadius: 10,
        backgroundColor: "#ebebeb",
        marginTop: 20,
    },
    bottomModal: {
        margin: 0,
        justifyContent: 'flex-end',
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
    },
    // viewFooter: {
    //     position: 'absolute',
    //     top: 0,
    //     zIndex: 999,
    // },
});
