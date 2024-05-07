import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

const Lapsed = () => {
  const winnersData = [
    { name: 'Winner 2', achievedTarget: '8,00,000' },
    { name: 'Winner 3', achievedTarget: '7,00,000' },
    { name: 'Winner 4', achievedTarget: '6,00,000' },
    { name: 'Winner 5', achievedTarget: '5,00,000' },
    { name: 'Winner 1', achievedTarget: '10,00,000' },
    { name: 'Winner 6', achievedTarget: '220,00,000' },
    { name: 'Winner 1', achievedTarget: '12,00,000' },
    { name: 'Winner 1', achievedTarget: '157,00,000' },
    { name: 'Winner 2', achievedTarget: '8,00,000' },
  ];

  winnersData.sort((a, b) => parseInt(b.achievedTarget.replace(/,/g, ''))- parseInt(a.achievedTarget.replace(/,/g, '')));

  const limitedWinnersData = winnersData.slice(0, 500);


  const renderItem = ({ item }) => (
    <View style={[styles.itemContainer, { width: itemWidth }, parseInt(item.achievedTarget.replace(/,/g, '')) >= 1000000 && styles.achievedItem]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="user-circle" size={26} color="#FF5733" style={{ marginRight: 10 }} />
          <Text style={[styles.itemName, { color: '#333' }]}>Name: {item.name}</Text>
        </View>
        {parseInt(item.achievedTarget.replace(/,/g, '')) >= 1000000 ? (
          <Text style={[styles.achievedText, styles.achievedTextGreen, {fontSize: 16}]}>Achieved</Text>
        ) : null}
      </View>
      <Text style={[styles.itemTarget, { color: '#666' }]}>Achieved Target: {item.achievedTarget}</Text>
    </View>
  );
  

  const screenWidth = Dimensions.get('window').width;
  const itemWidth = screenWidth * 0.9; 
  const [selectedValue, setSelectedValue] = useState('Island Ranking');
  const [showPicker, setShowPicker] = useState(false);


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
  
  
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>MDRT Competition Winners</Text>
      <View style={styles.dropdownContainer}>
      <SelectList
        data={data}
        save="value"
        setSelected={(val) => {
          setSelectedValue(val);
          setShowPicker(false);
        }}
        visible={showPicker}
        style={styles.dropdown}
      >
        <TouchableOpacity onPress={() => setShowPicker(!showPicker)} style={styles.dropdown}>
          <Text style={styles.selectedValue}>{selectedValue}</Text>
        </TouchableOpacity>
      </SelectList>
    </View>
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
      <Text style={styles.secWinnerNameText}>{secondPlace.name}</Text>
      <Text style={styles.secWinnerValueText}>{secondPlace.achievedTarget}</Text>
      <Text style={styles.thirdWinnerNameText}>{thirdPlace.name}</Text>
      <Text style={styles.WinnerValueText}>{thirdPlace.achievedTarget}</Text>
    </View>
  </View>
      <FlatList
        data={limitedWinnersData} 
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatListContainer}
      />
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    padding: 15,
    backgroundColor: '#fff', 
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginVertical: 5,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemTarget: {
    fontSize: 14,
    textAlign: 'right',
  },
  achievedText: {
    fontSize: 14,
    color: 'green',
    fontWeight: 'bold',
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 5,
  },
  barContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 5,
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
  dropdown: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 1,
    marginBottom: 10,
  },
  dropdownContainer: {
    width: '40%', 
    alignSelf: 'left', 
  },
  selectedValue: {
    fontSize: 16,
    color: '#333',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: -100, 
    textAlign: 'center', 
  },
  valueText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#75500b',
    marginTop: 10, 
    textAlign: 'center', 
    marginBottom: 50,
  },
  secWinnerNameText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: -65, 
    marginLeft: -230,
  },
  secWinnerValueText: {
    fontSize: 18,
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
    fontSize: 18,
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
});



export default Lapsed