/**
 * @author gusrarifqi
 * @email gusra.marta@dipstrategy.com
 * @create date 2019-12-02 11:08:30
 * @modify date 2019-12-02 11:08:30
 * @desc [description]
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Platform, TouchableHighlight, SafeAreaView, TouchableOpacity, View, Text, Image, Dimensions, StyleSheet } from 'react-native';
import { Colors, Strings, Images } from '@res'

const mWindow = Dimensions.get('window')
const tabHeight = 50
const iconDimen = 25

class BottomBar extends React.Component {

  render = () => {

    const { onTab1Press, onTab2Press, onTab3Press, activeTab, activeTabColor, uriImage } = this.props;

    let tabContent1, tabContent2, tabContent3, showimage

    if(uriImage !='null'){
      showimage = <Image source={{ uri: uriImage }} style={{ height: 35, width: 35, alignSelf: 'center', borderRadius: 20 }} />
    }else{
      showimage = <Image source={Images.imageDefault} style={{ height: 35, width: 35, alignSelf: 'center', borderRadius:20 }} />
    }

    if (activeTab === 1) {
      tabContent1 = <TouchableOpacity style={{ height: tabHeight, flex: 1, flexDirection: 'column', justifyContent: 'center', alignItem: 'center' }} onPress={onTab1Press}>
        <View style={{ backgroundColor: activeTabColor, borderRadius: 100, padding: 5, alignSelf: 'center', alignItem: 'center' }}>
          {/* <Image source={{uri: uriImage}} style={{ height: 50, width: 50, alignSelf: 'center' }} /> */}
          {showimage}
        </View>
      </TouchableOpacity>
    } else {
      tabContent1 = <TouchableOpacity style={{ height: tabHeight, flex: 1, flexDirection: 'column', justifyContent: 'center', alignItem: 'center' }} onPress={onTab1Press}>
        {/* <Image source={{ uri: uriImage }} style={{ height: 35, width: 35, alignSelf: 'center', opacity: .5, borderRadius:20 }} />  */}
        {showimage}
      </TouchableOpacity>
    }

    if (activeTab === 2) {
      tabContent2 = <TouchableOpacity style={{ height: tabHeight, flex: 1, flexDirection: 'column', justifyContent: 'center', alignItem: 'center' }} onPress={onTab2Press}>
        <View style={{backgroundColor: activeTabColor, borderRadius: 50, padding: 10, alignSelf: 'center', alignItem: 'center', justifyContent:'center'}}>
        <Image source={Images.ic_technical} style={{ height: 25, width: 25, alignSelf: 'center' }} />
        </View>
      </TouchableOpacity>
    } else {
      tabContent2 = <TouchableOpacity style={{ height: tabHeight, flex: 1, flexDirection: 'column', justifyContent: 'center', alignItem: 'center' }} onPress={onTab2Press}>
        <Image source={Images.ic_technical} style={{ height: 25, width: 25, marginTop: 3, alignSelf: 'center', opacity: .5 }} />
      </TouchableOpacity>
    }

    if (activeTab === 3) {
      tabContent3 = <TouchableOpacity style={{ height: tabHeight, flex: 1, flexDirection: 'column', justifyContent: 'center', alignItem: 'center' }} onPress={onTab3Press}>
      <View style={{backgroundColor: activeTabColor, borderRadius: 100, padding: 8, alignSelf: 'center', alignItem: 'center'}}>
        <Image source={Images.ic_edit} style={{ height: 25, width: 25, alignSelf: 'center' }} />
      </View>
      </TouchableOpacity>
    } else {
      tabContent3 = <TouchableOpacity style={{ height: tabHeight, flex: 1, flexDirection: 'column', justifyContent: 'center', alignItem: 'center' }} onPress={onTab3Press}>
        <Image source={Images.ic_edit} style={{ height: 25, width: 25, alignSelf: 'center', opacity: .5 }} />
      </TouchableOpacity>
    }

    return (
      <SafeAreaView style={Styles.bottomBarContainer}>
        <View style={{ borderRightWidth: 1, width: '33%' }}>
          {tabContent1}
        </View>
        <View style={{ borderRightWidth: 1, width: '33%' }}>
          {tabContent2}
        </View>
        <View style={{ width: '33%' }}>
          {tabContent3}
        </View>
      </SafeAreaView>
    );
  }
}

BottomBar.propTypes = {
  onTab1Press: PropTypes.func.isRequired,
  onTab2Press: PropTypes.func.isRequired,
  onTab3Press: PropTypes.func.isRequired,
  activeTab: PropTypes.number.isRequired,
  activeTabColor: PropTypes.string.isRequired,
  uriImage: PropTypes.string.isRequired
}

const Styles = StyleSheet.create({
  bottomBarContainer: {
    width: '100%',
    flexDirection: 'row',
    // justifyContent: 'space-between',
    backgroundColor: '#FABA00',
    flexDirection: 'row',
    height: tabHeight,
    width: mWindow.width,
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 99999,
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
    shadowOffset: {
      width: 12,
      height: 12
    },
    shadowOpacity: 0.58,
    shadowRadius: 20.00,
    elevation: 24,
    shadowColor: '#000'
  },
})

export default BottomBar
