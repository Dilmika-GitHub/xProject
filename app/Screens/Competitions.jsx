import React, { useState, useEffect } from 'react';
import { lockToPortrait, lockToAllOrientations } from "./OrientationLock";
import { useIsFocused, useFocusEffect, useNavigation } from '@react-navigation/native';
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity, Image, BackHandler } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SelectList } from 'react-native-dropdown-select-list';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Bar1, Bar2 } from "../../components/Chart";

const Competitions = () => {
  const navigation = useNavigation();
  const winnersData = [
    { name: 'Clifford', achievedTarget: '15,652,125.00', NOP: '7', profilePic: require('../../assets/MDRTImages/winner1.jpg') },
    { name: 'Tara', achievedTarget: '14,252,241.00', NOP: '8', profilePic: require('../../assets/MDRTImages/win2.jpg') },
    { name: 'Pascal', achievedTarget: '13,562,324.00', NOP: '5', profilePic: require('../../assets/MDRTImages/win3.jpg') },
    { name: 'Pascal', achievedTarget: '9,412,324.00', NOP: '5', profilePic: require('../../assets/MDRTImages/img1.jpg') },
    { name: 'Michel', achievedTarget: '8,000,000.00', NOP: '3', profilePic: require('../../components/user.jpg') },
    { name: 'Devin', achievedTarget: '200,000.00', NOP: '2', profilePic: require('../../assets/MDRTImages/img2.jpg') },
    { name: 'Edward', achievedTarget: '6,200,000.00', NOP: '2', profilePic: require('../../assets/MDRTImages/img3.jpg') },
    { name: 'Shen', achievedTarget: '100,000.00', NOP: '1', profilePic: require('../../assets/MDRTImages/img4.jpg') },
    { name: 'Wilson', achievedTarget: '800,000.00', NOP: '1', profilePic: require('../../assets/MDRTImages/win3.jpg') },
    { name: 'Jenny', achievedTarget: '37,000.00', NOP: '2', profilePic: require('../../assets/MDRTImages/img5.jpg') },
    { name: 'Dias', achievedTarget: '25,000.00', NOP: '2', profilePic: require('../../assets/MDRTImages/img3.jpg') },
    { name: 'Lionel', achievedTarget: '17,000.00', NOP: '2', profilePic: require('../../assets/MDRTImages/img2.jpg') },
  ];

  winnersData.sort((a, b) => parseInt(b.achievedTarget.replace(/,/g, ''))- parseInt(a.achievedTarget.replace(/,/g, '')));

  const limitedWinnersData = winnersData.slice(0, 500);
  
  const firstPlace = limitedWinnersData[0];
  const secondPlace = limitedWinnersData[1];
  const thirdPlace = limitedWinnersData[2];

  const user = { name: 'Michel', achievedTarget: '8,000,000.00' };
  const userPlace = limitedWinnersData.findIndex(item => item.name === user.name) + 1;
  const userItem = { ...user, place: userPlace };
  limitedWinnersData.push(userItem);
  const [selectedValue, setSelectedValue] = useState('Island Ranking');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Initialize the selected data based on the default selected value
    handleSelectionChange(selectedValue);
  }, []);

  const handleSelectionChange = (val) => {
    setSelectedValue(val);
    setShowDropdown(false);
    // Update the selected data based on the selected option
    switch (val) {
      case 'Island Ranking':
        setSelectedData(winnersData);
        break;
      case 'Regional Ranking':
        // Replace with your hard-coded regional ranking data
        setSelectedData([
          { name: 'Clifford', achievedTarget: '15,652,125.00', NOP: '7', profilePic: require('../../assets/MDRTImages/winner1.jpg') },
          { name: 'Tara', achievedTarget: '14,252,241.00', NOP: '8', profilePic: require('../../assets/MDRTImages/win2.jpg') },
          { name: 'Pascal', achievedTarget: '13,562,324.00', NOP: '5', profilePic: require('../../assets/MDRTImages/win3.jpg') },
          { name: 'Pascal', achievedTarget: '9,412,324.00', NOP: '5', profilePic: require('../../assets/MDRTImages/img1.jpg') },
          { name: 'Michel', achievedTarget: '8,000,000.00', NOP: '3', profilePic: require('../../components/user.jpg') },
          { name: 'Devin', achievedTarget: '200,000.00', NOP: '2', profilePic: require('../../assets/MDRTImages/img2.jpg') },
          { name: 'Jenny', achievedTarget: '37,000.00', NOP: '2', profilePic: require('../../assets/MDRTImages/img5.jpg') },
          { name: 'Dias', achievedTarget: '25,000.00', NOP: '2', profilePic: require('../../assets/MDRTImages/img3.jpg') },
          { name: 'Lionel', achievedTarget: '17,000.00', NOP: '2', profilePic: require('../../assets/MDRTImages/img2.jpg') },
        ]);
        break;
      case 'Branch Ranking':
        // Replace with your hard-coded branch ranking data
        setSelectedData([
          { name: 'Clifford', achievedTarget: '15,652,125.00', NOP: '7', profilePic: require('../../assets/MDRTImages/winner1.jpg') },
          { name: 'Tara', achievedTarget: '14,252,241.00', NOP: '8', profilePic: require('../../assets/MDRTImages/win2.jpg') },
          { name: 'Pascal', achievedTarget: '13,562,324.00', NOP: '5', profilePic: require('../../assets/MDRTImages/win3.jpg') },
          { name: 'Michel', achievedTarget: '8,000,000.00', NOP: '3', profilePic: require('../../components/user.jpg') },
          { name: 'Edward', achievedTarget: '6,200,000.00', NOP: '2', profilePic: require('../../assets/MDRTImages/img3.jpg') },
          { name: 'Devin', achievedTarget: '200,000.00', NOP: '2', profilePic: require('../../assets/MDRTImages/img2.jpg') },
          { name: 'Jenny', achievedTarget: '37,000.00', NOP: '2', profilePic: require('../../assets/MDRTImages/img5.jpg') },
          { name: 'Dias', achievedTarget: '25,000.00', NOP: '2', profilePic: require('../../assets/MDRTImages/img3.jpg') },
          { name: 'Lionel', achievedTarget: '17,000.00', NOP: '2', profilePic: require('../../assets/MDRTImages/img2.jpg') },
        ]);
        break;
      case 'Team Ranking':
        // Replace with your hard-coded team ranking data
        setSelectedData([
          { name: 'Clifford', achievedTarget: '15,652,125.00', NOP: '7', profilePic: require('../../assets/MDRTImages/winner1.jpg') },
          { name: 'Tara', achievedTarget: '14,252,241.00', NOP: '8', profilePic: require('../../assets/MDRTImages/win2.jpg') },
          { name: 'Pascal', achievedTarget: '13,562,324.00', NOP: '5', profilePic: require('../../assets/MDRTImages/win3.jpg') },
          { name: 'Michel', achievedTarget: '8,000,000.00', NOP: '3', profilePic: require('../../components/user.jpg') },
          { name: 'Devin', achievedTarget: '200,000.00', NOP: '2', profilePic: require('../../assets/MDRTImages/img2.jpg') },
          { name: 'Dias', achievedTarget: '25,000.00', NOP: '2', profilePic: require('../../assets/MDRTImages/img3.jpg') },
          { name: 'Lionel', achievedTarget: '17,000.00', NOP: '2', profilePic: require('../../assets/MDRTImages/img2.jpg') },
        ]);
        break;
      case 'TOT Ranking':
          // Replace with your hard-coded team ranking data
        setSelectedData([
          { name: 'Clifford', achievedTarget: '15,652,125.00', NOP: '7', profilePic: require('../../assets/MDRTImages/winner1.jpg') },
          { name: 'Tara', achievedTarget: '14,252,241.00', NOP: '8', profilePic: require('../../assets/MDRTImages/win2.jpg') },
          { name: 'Pascal', achievedTarget: '13,562,324.00', NOP: '5', profilePic: require('../../assets/MDRTImages/win3.jpg') },
          { name: 'Pascal', achievedTarget: '9,412,324.00', NOP: '5', profilePic: require('../../assets/MDRTImages/img1.jpg') },
          { name: 'Edward', achievedTarget: '6,200,000.00', NOP: '2', profilePic: require('../../assets/MDRTImages/img3.jpg') },
        ]);
          break; 
        case 'COT Ranking':
            // Replace with your hard-coded team ranking data
          setSelectedData([
            { name: 'Clifford', achievedTarget: '15,652,125.00', NOP: '7', profilePic: require('../../assets/MDRTImages/winner1.jpg') },
            { name: 'Tara', achievedTarget: '14,252,241.00', NOP: '8', profilePic: require('../../assets/MDRTImages/win2.jpg') },
            { name: 'Pascal', achievedTarget: '13,562,324.00', NOP: '5', profilePic: require('../../assets/MDRTImages/win3.jpg') },
            { name: 'Pascal', achievedTarget: '9,412,324.00', NOP: '5', profilePic: require('../../assets/MDRTImages/img1.jpg') },
            { name: 'Edward', achievedTarget: '6,200,000.00', NOP: '2', profilePic: require('../../assets/MDRTImages/img3.jpg') },
          ]);
            break;  
      default:
        setSelectedData(limitedWinnersData);
        break;
    }
  };

  const renderDropdown = () => {
    return (
      <View style={styles.dropdownContainer}>
        <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)} style={styles.dropdownTouchable}>
          <Text style={styles.dropdownText}>{selectedValue}</Text>
          <Icon name={showDropdown ? 'angle-up' : 'angle-down'} size={20} color="#000" style={styles.dropdownIcon} />
        </TouchableOpacity>
        {showDropdown && (
          <View style={styles.dropdownOptions}>
            <TouchableOpacity onPress={() => handleSelectionChange('Island Ranking')}>
              <Text style={styles.optionText}>Island Ranking</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSelectionChange('Regional Ranking')}>
              <Text style={styles.optionText}>Regional Ranking</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSelectionChange('Branch Ranking')}>
              <Text style={styles.optionText}>Branch Ranking</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSelectionChange('COT Ranking')}>
              <Text style={styles.optionText}>COT Ranking</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSelectionChange('TOT Ranking')}>
              <Text style={styles.optionText}>TOT Ranking</Text>
            </TouchableOpacity>
            {/* Add more options as needed */}
          </View>
        )}
      </View>
    );
  };

  useEffect
  

  const renderProfilePic = (winner) => {
    if (winner.profilePic) {
      // Return the profile picture fetched from the URL
      return <Image source={{ uri: winner.profilePic }} style={styles.profilePic} />;
    } else {
      // Return the default profile picture icon
      return <Icon name="user-circle" size={26} color="#FF5733" style={{ marginRight: 10 }} />;
    }
  };

  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  const renderItem = ({ item }) => (
    <View>
      <View style={[styles.itemContainer, { width: 370 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image 
              source={item.profilePic} 
              style={[styles.roundImageforList, { width: 58, height: 58, marginRight:10 }]} 
              resizeMode="cover" 
            />
            <View>
              <Text style={[styles.itemName, { color: '#333' }]}>{item.name}</Text>
              <Text style={[styles.itemNOP, { color: '#5e5b5b' }]}>NOP: {item.NOP}</Text>
            </View>
          </View>
          <Text style={[styles.itemTarget, { color: 'black', fontWeight: 'bold', marginTop: -15 }]}>{item.achievedTarget}</Text>
        </View>
        {parseInt(item.achievedTarget.replace(/,/g, '')) >= 6000000  ? (
          <Text style={[styles.achievedText, styles.achievedTextGreen, {fontSize: 14}]}>Achieved</Text>
        ) : (
          <Text style={[styles.itemTarget, { color: 'black', marginTop: -20, fontSize:14, }]}>
            Need: {formatNumber(6000000 - parseInt(item.achievedTarget.replace(/,/g, '')))}
          </Text>
        )}
      </View>
      {/* Horizontal line */}
      {/* <View style={styles.horizontalLine} /> */}
    </View>
  );

  const renderUser = () => (
    <View style={[styles.itemContainer, styles.userContainer, { width: itemWidth }]}>
      <View style={{ alignItems: 'center' }}>
        <View style={[styles.imageContainer, { left: '30%', marginTop: 93 }]}> 
          <Image 
            source={require('../../components/user.jpg')} 
            style={[styles.roundImage, { width: 68, height: 68 }]} 
            resizeMode="cover" 
          />
        </View>
      </View>
      <Text style={[styles.itemTarget, styles.userAchievedTarget, { color: 'black' }]}>Sales amount</Text>
      <Text style={[styles.itemTarget, styles.userAchievedTarget, { color: 'black' }]}>
        {userItem.achievedTarget}
      </Text>
      <View style={{ alignItems: 'center', marginTop: -38 }}>
        <Text style={[styles.userPlace, { fontSize: 16 }]}>Your Place</Text>
        <Text style={[styles.userPlace, { fontSize: 16, marginTop: 5 }]}>{userItem.place}</Text>
      </View>
    </View>
  );

  //hardware back button function
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('MDRT');
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  const screenWidth = Dimensions.get('window').width;
  const itemWidth = screenWidth * 0.97; 
  const [showPicker, setShowPicker] = useState(false);
  const [selectedData, setSelectedData] = useState(limitedWinnersData); 
  const filteredSelectedData = selectedData.slice(3);

  const data = [
    { key: '1', value: 'Island Ranking' },
    { key: '2', value: 'Regional Ranking' },
    { key: '3', value: 'Branch Ranking' },
    { key: '4', value: 'Team Ranking' },
    { key: '5', value: 'COT Ranking' },
    { key: '6', value: 'TOT Ranking' },
  ];
  
  const Bardata = {
    labels: [
      `${firstPlace.name}`,
      `${secondPlace.name}`,
      `${thirdPlace.name}`
    ],
    datasets: [
      {
        data: [30, 40, 20]
      }
    ]
  };

  const graphStyle = StyleSheet.create({
    container: {
      marginVertical: 8,
      borderRadius: 16,
    },
    barStyle: {
      marginVertical: 8,
      borderRadius: 16,
    },
  });

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0, 
    color: (opacity = 1) => `rgba(247, 70, 57, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    barPercentage: 1.5, 
    yAxisMinimumValue: 0, 
    groupWidth: 0,
    verticalLabelRotation: 0,
    formatYLabel: (label) => {
      if (label) {
        const parts = label.split('\n');
        return parts[0]; 
      }
      return '';
    },
    
  };
  const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            lockToPortrait();
        }
    }, [isFocused]);
  
  return (
    <View style={styles.container}>
    {renderDropdown()}
    <View style={[styles.barContainer, { marginTop: 60 }, ]}>
    <Bar1
          profilePic={renderProfilePic(firstPlace)}
          name={firstPlace.name}
          achievedTarget={firstPlace.achievedTarget}
    />
    <View style={{ marginTop: -150, alignItems: 'center' }}>
    <Bar2
          profilePic={renderProfilePic(secondPlace)}
          name={secondPlace.name}
          achievedTarget={secondPlace.achievedTarget}
    />
      <Text style={styles.nameText}>{firstPlace.name}</Text>
      <Text style={styles.valueText}>{firstPlace.achievedTarget}</Text>
      <Text style={{ marginLeft: 10, marginTop: -40, fontSize:12, marginBottom: 10 }}>NOP:{firstPlace.NOP}</Text>
      <Text style={styles.secWinnerNameText}>{secondPlace.name}</Text>
      <Text style={styles.secWinnerValueText}>{secondPlace.achievedTarget}</Text>
      <Text style={{ marginLeft: -230, marginTop: -15, fontSize:12, marginBottom: 10 }}>NOP:{secondPlace.NOP}</Text>
      <Text style={styles.thirdWinnerNameText}>{thirdPlace.name}</Text>
      <Text style={styles.WinnerValueText}>{thirdPlace.achievedTarget}</Text>
      <Text style={{ marginLeft: 230, marginTop: -18, fontSize:12, marginBottom: 10 }}>NOP:{thirdPlace.NOP}</Text>
    </View>
  </View>
      <FlatList
      data={filteredSelectedData}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.flatListContainer}
      ItemSeparatorComponent={() => <View style={{ height: 3 }} />} // Add space between items
    />
      <View style={{ alignItems: 'center' }}>
        {renderUser()}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5', 
  },
  achievedItem: {
    backgroundColor: '#DCD7D6', 
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  flatListContainer: {
    flexGrow: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  itemContainer: {
    padding: 10,
    backgroundColor: '#e8e6e3', 
    borderRadius: 15,
    borderWidth: 0,
    borderColor: '#ddd',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemTarget: {
    fontSize: 16,
    textAlign: 'right',
  },
  achievedText: {
    fontSize: 14,
    color: 'green',
    fontWeight: 'bold',
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 10,
    marginRight: 15,
  },
  barContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 15,
  },
  bar: {
    height: 20, 
    backgroundColor: 'blue', 
    borderRadius: 5, 
  },
  placeText: {
    marginBottom: 5,
  },
  targetText: {
    marginTop: 5,
  },
  dropdownContainer: {
    width: 130,
    alignSelf: 'left',
    marginBottom: 20,
    marginLeft: 0,
    backgroundColor: '#e8e6e3',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  dropdownText: {
    fontSize: 12,
    color: '#333',
  },
  optionText: {
    fontSize: 12,
    color: '#333',
    paddingVertical: 5,
  },
  selectedValue: {
    fontSize: 12, 
    color: '#333',
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: -100, 
    textAlign: 'center', 
  },
  valueText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#75500b',
    marginTop: 10, 
    textAlign: 'center', 
    marginBottom: 50,
  },
  secWinnerNameText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: -58, 
    marginLeft: -230,
  },
  secWinnerValueText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#75500b',
    marginTop: 0, 
    marginBottom: 20, 
    marginLeft: -230,
  },
  thirdWinnerNameText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: -65, 
    marginLeft: 230, 
  },
  WinnerValueText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#75500b',
    marginTop: 0, 
    marginLeft: 230, 
    marginBottom: 20, 
  },
  profilePic: {
    width: 26,
    height: 26,
    marginRight: 10,
  },
  userContainer: {
    backgroundColor: '#d4d1cf', 
    borderColor: '#a8adba', 
    marginTop: 8,
    height:85,
  },
  userName: {
    fontWeight: 'bold',
    color: '#333', 
  },
  userAchievedTarget: {
    color: 'black',
  },
  userPlace: {
    color: 'black', 
  },
  imageContainer: {
    position: 'absolute',
    left: '50%',
    top: '16%', 
    transform: [{ translateX: -100 }, { translateY: -100 }]
  },
  roundImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3, 
    borderColor: '#7facf5'
  },
  roundImageforList: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  horizontalLine: {
    borderBottomColor: '#877c7b',
    borderBottomWidth: 1,
    marginVertical: 0,
  },
  dropdownTouchable: {
    flexDirection: 'row',
  },
  dropdownIcon: {
    marginTop: -2,
  },
  dropdownText: {
    fontSize: 12,
    color: '#333',
    marginRight: 5, 
  },
});

export default Competitions





