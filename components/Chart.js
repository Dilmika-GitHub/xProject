import React, { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Svg, Path, G, Text as SvgImage } from 'react-native-svg';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SelectList } from 'react-native-dropdown-select-list';

export const Bar1 = ({ style, profilePic }) => {
    return (
      <Svg
        width="342" 
        height="102"
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
                width: 80, 
                height: 80, 
                borderRadius: 50, 
                marginLeft: 15, 
                marginTop: -55,
                borderWidth: 4, 
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
                width: 80, 
                height: 80, 
                borderRadius: 50, 
                marginLeft: 245, 
                marginTop: -85,
                borderWidth: 4, 
                borderColor: '#ba6320' 
              }} 
            />
          ) : null}
        </G>
        <Path
          fill="#FEC7B9"
          d="M330 0H12C5.37258 0 0 5.37258 0 12V90C0 96.6274 5.37258 102 12 102H330C336.627 102 342 96.6274 342 90V12C342 5.37258 336.627 0 330 0Z"
        ></Path>
      </Svg>
    );
  };
  
  export const Bar2 = ({ style, profilePic }) => {
    return (
      <Svg
        width="122" 
        height="150" 
        viewBox="0 0 122 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
      <G transform="scale(2.5)">
          {profilePic ? (
            
            <Image 
              source={require('./../assets/MDRTImages/winner1.jpg')} 
              style={{ 
                width: 80, 
                height: 80, 
                borderRadius: 50, 
                marginLeft: 20, 
                marginTop: -45 ,
                borderWidth: 4, 
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