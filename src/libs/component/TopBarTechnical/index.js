/**
 * @author gusrarifqi
 * @email gusra.marta@dipstrategy.com
 * @create date 2019-12-02 11:11:23
 * @modify date 2019-12-02 11:11:23
 * @desc [description]
 */

import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Platform, TouchableHighlight, TouchableOpacity, View, Text, Image, Dimensions, StyleSheet} from 'react-native';

import {Colors, Strings, Images} from '@res'

const mWindow = Dimensions.get('window')
const tabHeight = 40
const iconDimen = 25

class TopBarTechnical extends React.Component {

 render = () => {

   const { onTab1Press, onTab2Press, activeTab, activeTabColor} = this.props;

   let tabContent1, tabContent2

   if (activeTab === 1){
     tabContent1 = <TouchableOpacity style={{borderBottomWidth:3, borderColor: '#FABA00', height: tabHeight, flex: 1, flexDirection: 'column', justifyContent: 'center', alignItem: 'center', alignSelf: 'center', paddingHorizontal:5}}>
       <Text style={{fontSize: 12, alignSelf: 'center', opacity: .7, color: '#000000'}}>My Technical Request</Text>
     </TouchableOpacity>
   } else {
     tabContent1 = <TouchableOpacity style={{ borderBottomWidth: 1, borderColor: '#ACACAC', height: tabHeight, flex: 1, flexDirection: 'column', justifyContent: 'center', alignItem: 'center', alignSelf: 'center', paddingHorizontal: 5}} onPress={onTab1Press}>
       <Text style={{fontSize: 12, alignSelf: 'center', opacity: .5, color: '#949494'}}>My Technical Request</Text>
     </TouchableOpacity>
   }

   if (activeTab === 2){
     tabContent2 = <TouchableOpacity style={{ borderBottomWidth: 3, borderColor: '#FABA00', height: tabHeight, flex: 1, flexDirection: 'column', justifyContent: 'center', alignItem: 'center', alignSelf: 'center', paddingHorizontal: 5}}>
       <Text style={{fontSize: 12,alignSelf: 'center', opacity: .7, color: '#000000'}}>All Technical Request</Text>
     </TouchableOpacity>
   } else {
     tabContent2 = <TouchableOpacity style={{ borderBottomWidth: 1, borderColor: '#ACACAC', height: tabHeight, flex: 1, flexDirection: 'column', justifyContent: 'center', alignItem: 'center', alignSelf: 'center', paddingHorizontal: 5}} onPress={onTab2Press}>
       <Text style={{fontSize: 12, alignSelf: 'center', opacity: .5, color: '#949494'}}>All Technical Request</Text>
     </TouchableOpacity>
   }

   

   return (
       <View style={Styles.topBarContainer}>
         {tabContent1}
         {tabContent2}
       </View>
     );
 }
}

TopBarTechnical.propTypes = {
 onTab1Press: PropTypes.func.isRequired,
 onTab2Press: PropTypes.func.isRequired,
 activeTab: PropTypes.number.isRequired,
 activeTabColor: PropTypes.string.isRequired
}

const Styles = StyleSheet.create({
 topBarContainer:{
   backgroundColor: 'white', 
   flexDirection: 'row', 
   height: tabHeight, 
   width: 330,
   alignSelf:'center', 
   alignItems:'center',
   bottom: 0, 
   left: 0, 
   zIndex: 99999, 
 }
})

export default TopBarTechnical
