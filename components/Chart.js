
import React, { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Svg, Path, G, Text as SvgImage } from 'react-native-svg';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SelectList } from 'react-native-dropdown-select-list';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const Bar1 = ({ style, profilePic }) => {
    return (
      <Svg
        width={wp('95%')} 
        height={hp('20%')}
        viewBox="0 0 342 102"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={style}
      >
      <G transform="scale(2.5)">
          {profilePic ? (
            
            <Image 
            source={require('./../assets/MDRTImages/win2.jpg')} 
            style={{ 
              width: wp('25%'), 
              height: wp('25%'), 
              borderRadius: wp('20%'), 
              marginLeft: wp('4%'), 
              marginTop: -hp('3%'),
              borderWidth: wp('1%'), 
              borderColor: '#a3a39d' 
            }} 
          />
          ) : null}
        </G>
        <G transform="scale(2.5)">
          {profilePic ? (
            
            <Image 
              source={require('./../assets/MDRTImages/win3.jpg')} 
              style={{ 
                width: wp('25%'), 
                height: wp('25%'), 
                borderRadius: wp('20%'), 
                marginLeft: wp('67%'), 
                marginTop: -hp('12%'),
                borderWidth: wp('1%'), 
                borderColor: '#ba6320' 
              }} 
            />
          ) : null}
        </G>
        <Path
          fill="#FEC7B9"
          d="M330 0H12C5.37258 0 0 5.37258 0 12V90C0 96.6274 5.37258 102 12 102H330C336.627 102 342 96.6274 342 90V12C342 5.37258 336.627 0 330 0Z"
          width={wp('130%')}
        ></Path>
      </Svg>
    );
  };
  
  export const Bar2 = ({ style, profilePic }) => {
    return (
      <Svg
      width={wp('40%')} 
      height={hp('20%')} 
      viewBox="0 0 122 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <G transform="scale(2.5)">
          {profilePic ? (
            <Image 
              source={require('./../assets/MDRTImages/winner1.jpg')} 
              style={{ 
                width: wp('25%'), 
                height: wp('25%'), 
                borderRadius: wp('20%'), 
                marginLeft: wp('8%'), 
                marginTop: -hp('5%'),
                borderWidth: wp('1%'), 
                borderColor: '#ffde26'
              }} 
            />
          ) : null}
        </G>
      <Path
        fill="#FFB6A4"
        d="M0 30C0 13.4315 13.4315 0 30 0H92C108.569 0 122 13.4315 122 30V150H0V30Z"
      />
      </Svg>
    );
  };