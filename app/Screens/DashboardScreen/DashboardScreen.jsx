import { StyleSheet, Text, View, Animated, ScrollView, Dimensions, BackHandler, Alert } from "react-native";
import React, { useState, useEffect, useRef } from 'react';
import Svg, { G, Circle } from "react-native-svg";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { lockToPortrait, lockToAllOrientations } from "../OrientationLock";
import { useIsFocused } from '@react-navigation/native';
import Income from "./KPIs/Income";
import FPkpi from "./KPIs/FPkpi";
import NOPkpi from "./KPIs/NOPkpi";
import FYPkpi from "./KPIs/FYPkpi";
import GWPkpi from "./KPIs/GWPkpi";
import MCFPkpi from "./KPIs/MCFPkpi";
import CheckConnection from "../../../components/checkConnection";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const { height, width } = Dimensions.get('window');

export default function DashboardScreen({
  percentage = 65,
  color = "grey",
  animatedCircleColor = "#05beda",
  strokeWidth = wp('8%'),
  radius = wp('30%'),
  textColor = "black",
  max = 100,
  totalvalue = "6,60,00,000",
  currencyType = "Rs",
}) {
  const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            lockToPortrait();
        }
    }, [isFocused]);

    useEffect(() => {
      const backAction = () => {
        Alert.alert("Hold on!", "Are you sure you want to exit?", [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel",
          },
          { text: "YES", onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };
  
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
  
      return () => backHandler.remove();
    }, []);

  const CircleRef = useRef();
  const halfCircle = radius + strokeWidth;
  const viewBoxValue = `0 0 ${halfCircle * 2} ${halfCircle * 2}`;
  const circleCircumference = 2 * Math.PI * radius;
  const maxPerc = (100 * percentage) / max;
  const strokeDashoffset =
    circleCircumference - (circleCircumference * maxPerc) / 100;
  const totalvalueText = `${currencyType} ${totalvalue}`;
  React.useEffect(() => {});

  return (
    <ScrollView style={styles.scrollView}>
      <CheckConnection />
      <View style={styles.centeredView}>
        <Text style={styles.titleText(textColor || color)}>
          Income Performance
        </Text>
      </View>
      <View style={styles.iconView}>
        <Income/>
      </View>
      <View style={styles.circleView(radius, halfCircle, strokeWidth)}>
        <Svg width={radius * 2} height={radius * 2} viewBox={viewBoxValue}>
          <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
            <Circle
              cx="50%"
              cy="50%"
              r={radius}
              stroke={color}
              strokeWidth={strokeWidth}
              strokeOpacity={0.5}
              fill="transparent"
            />
            <AnimatedCircle
              ref={CircleRef}
              cx="50%"
              cy="50%"
              r={radius}
              stroke={animatedCircleColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circleCircumference}
              strokeDashoffset={strokeDashoffset}
              strokeOpacity={1.0}
              fill="transparent"
              strokeLinecap="round"
            />
          </G>
        </Svg>
        <View style={styles.absoluteCenter}>
          <Text style={styles.valueText(textColor || color) }>
          Estimated
          </Text>
          <Text style={styles.valueText(textColor || color)}>
            {totalvalueText}
          </Text>
        </View>
      </View>
      <View style={styles.kpiContainer}>
        <FPkpi />
        <NOPkpi />
        <FYPkpi />
        <GWPkpi />
        <MCFPkpi />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    padding: 5,
    backgroundColor: 'white',
  },
  centeredView: {
    alignItems: "center",
  },
  titleText: (color) => ({
    color: color,
    fontSize: wp('5%'),
    textTransform: "uppercase",
  }),
  iconView: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginHorizontal: wp('5%'), // Add horizontal margin
    marginVertical: hp('2%'), // Add vertical margin
  },
  circleView: (radius, halfCircle, strokeWidth) => ({
    alignItems: "center",
    marginTop: -15,
    justifyContent: 'center',
  }),
  absoluteCenter: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    Top: hp("22%"),
    center: wp("50%"),
  },
  valueText: (color) => ({
    color: color,
    fontSize: wp('5%'),
  }),
  kpiContainer: {
    paddingLeft: wp('0.5%'),
    paddingBottom: hp('2%'),
  },
});
