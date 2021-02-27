import React, { Component } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Images } from '@res';
import { StackActions, NavigationActions } from 'react-navigation';

export default class DiscussScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            discuss: [],
            textDiscus: ''
        }
    }

    actionDiscuss() {
        if (this.state.textDiscus.length >= 1) {
            this.setState({ discuss: [...this.state.discuss, { text: this.state.textDiscus }], textDiscus: '' })
        }
    }

    actionBack() {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'MyTechnicalScreen' })
            ]
        });
        this.props.navigation.dispatch(resetAction);
    }

    actionIsiDiscuss(item) {
        return (
            <View style={{ marginTop: 10, width: '50%', alignSelf: 'flex-end' }}>
                <View style={styles.talkBubbleRight}>
                    <View style={styles.talkBubbleSquareRight} >
                        <Text>{item.text}</Text>
                    </View>
                    <View style={styles.talkBubbleTriangleRight} />
                </View>
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#CCCCCC' }}>
                <View style={{ padding: 15, backgroundColor: '#FABA00', flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => this.actionBack()}>
                        <View style={{ marginLeft: 5 }}>
                            <Image source={Images.iconBack} style={{ width: 20, height: 20 }} />
                        </View>
                    </TouchableOpacity>

                    <View style={{ marginLeft: 15 }}>
                        <Text style={{ fontSize: 17 }}>Discussion</Text>
                    </View>
                </View>
                <View style={{ height: '90%' }}>
                    <ScrollView>
                        <View style={{ flex: 1, flexDirection: 'column', width: '100%', marginTop: 10, paddingBottom: 65 }}>
                            {
                                this.state.discuss.map((item) => {
                                    return (
                                        this.actionIsiDiscuss(item)
                                    )
                                })
                            }
                        </View>
                    </ScrollView>
                </View>
                <View style={{ flex: 1, bottom: 0, position: 'absolute', width: '100%', padding: 10, flexDirection: 'row', alignSelf: 'center', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#808080', backgroundColor: '#CCCCCC' }}>
                    <View style={{ width: '80%' }}>
                        <TextInput
                            style={styles.textInputStyle}
                            placeholder="Type a message"
                            defaultValue={this.state.textDiscus}
                            multiline={true}
                            allowFontScaling={false}
                            onChangeText={(text) => this.setState({ textDiscus: text })}
                        />
                    </View>
                    <View style={{ width: '20%' }}>
                        <TouchableOpacity block light style={styles.bnext} onPress={() => this.actionDiscuss()}>
                            <Text style={{ color: 'black' }}>Send</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView >
        )
    }
}

const styles = StyleSheet.create({
    talkBubble: {
        backgroundColor: 'transparent',
        flexDirection: 'row'
    },
    talkBubbleSquare: {
        padding: 10,
        backgroundColor: "#FABA00",
        borderRadius: 6,
    },
    talkBubbleTriangle: {
        top: 5,
        width: 0,
        height: 0,
        borderTopColor: 'transparent',
        borderTopWidth: 13,
        borderRightWidth: 26,
        borderColor: "#FABA00",
        borderBottomWidth: 13,
        borderBottomColor: 'transparent'
    },
    talkBubbleRight: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        alignSelf: 'flex-end'
    },
    talkBubbleSquareRight: {
        padding: 10,
        backgroundColor: "#FABA00",
        borderRadius: 6,
    },
    talkBubbleTriangleRight: {
        top: 5,
        width: 0,
        height: 0,
        borderTopColor: 'transparent',
        borderLeftWidth: 26,
        borderLeftColor: "#FABA00",
        borderBottomWidth: 15,
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
    },
    bnext: {
        padding: 10,
        backgroundColor: '#FABA00',
        marginLeft: 10,
        borderRadius: 5
    },
})