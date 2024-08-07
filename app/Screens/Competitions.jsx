import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { BASE_URL, ENDPOINTS } from "../services/apiConfig";
import { FirstPlaceSvg, SecondPlaceSvg, ThirdPlaceSvg } from "../../components/Top3";

const screenWidth = Dimensions.get('window').width;

const WinnersScreen = () => {
  const [winnersData, setWinnersData] = useState([]);
  const [branchRegionalData, setBranchRegionalData] = useState([]);
  const [isLifeMember, setIsLifeMember] = useState(false);
  const [agentProfile, setAgentProfile] = useState(null);
  const [personalMdrt, setPersonalMdrt] = useState(null);
  const [selectedValue, setSelectedValue] = useState('Island Ranking');
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [branchName, setBranchName] = useState('');
  const [regionName, setRegionName] = useState('');
  const navigation = useNavigation();

  const currentYear = new Date().getFullYear();

  const handleErrorResponse = (error) => {
    if (error.response?.status === 401) {
      console.log(error.response.status);
      setShowAlert(true);
    } else {
      setError(true);
    }
  };

  const handleConfirm = () => {
    setShowAlert(false);
    navigation.navigate('Login');
  };

  const fetchAgentProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const email = await AsyncStorage.getItem('email');
      const catType = await AsyncStorage.getItem('categoryType');
      if (!token || !email || !catType) {
        throw new Error('No token, email, or category type found');
      }

      const response = await axios.get(`${BASE_URL}${ENDPOINTS.PROFILE_DETAILS}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { email, catType }
      });

      setAgentProfile(response.data);
      const agency_code1 = response.data.personal_agency_code;
      const agency_code2 = response.data.newagt || 0;
      fetchPersonalMdrt(agency_code1, agency_code2, catType);
    } catch (error) {
      handleErrorResponse(error);
      console.error('Error fetching agent profile:', error.message);
    }
  };

  const fetchPersonalMdrt = async (agency_code1, agency_code2, catType) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.get(`${BASE_URL}${ENDPOINTS.PERSONAL_MDRT}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { p_agency_1: agency_code1, p_agency_2: agency_code2, p_cat: catType, p_year: currentYear }
      });

      setPersonalMdrt(response.data);
      setBranchName(response.data.branch_name);
      setRegionName(response.data.region);
    } catch (error) {
      handleErrorResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBranchRegionalRankMdrt = async (rankingType, agency_code1, agency_code2, catType) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const endpoint = rankingType === 'Branch Ranking' ? 'GetBranchRankMDRT' : 'GetRegionalRankMDRT';
      const response = await axios.get(`${BASE_URL}/Mdrt/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { p_agency_1: agency_code1, p_agency_2: agency_code2, p_cat: catType, p_year: currentYear }
      });

      const formattedData = response.data.map(item => ({
        name: item.agent_name.trim(),
        achievedTarget: item.fyp.toLocaleString('en-US', { maximumFractionDigits: 2 }),
        NOP: item.nop.toString(),
        rank: rankingType === 'Branch Ranking' ? item.branch_rank : item.region_rank,
        achievement: item.achievment,
        balanceDue: item.balanceDue
      }));

      formattedData.sort((a, b) => parseInt(b.achievedTarget.replace(/,/g, '')) - parseInt(a.achievedTarget.replace(/,/g, '')));
      setBranchRegionalData(formattedData);
    } catch (error) {
      handleErrorResponse(error);
      console.error(`Error fetching ${rankingType} data:`, error.message);
    }
  };

  const fetchWinnersData = async (rankingType) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const endpoint = getEndpoint(rankingType);
      const response = await axios.get(`${BASE_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { p_year: currentYear }
      });

      const formattedData = response.data.map(item => ({
        name: item.agent_name.trim(),
        achievedTarget: item.fyp.toLocaleString('en-US', { maximumFractionDigits: 2 }),
        NOP: item.nop.toString(),
        rank: item.national_rank,
        achievement: item.achievment,
        balanceDue: item.balanceDue
      }));

      formattedData.sort((a, b) => parseInt(b.achievedTarget.replace(/,/g, '')) - parseInt(a.achievedTarget.replace(/,/g, '')));
      setWinnersData(formattedData);
    } catch (error) {
      handleErrorResponse(error);
      console.error('Error fetching data:', error.message);
    }
  };

  const getEndpoint = (rankingType) => {
    switch (rankingType) {
      case 'Island Ranking':
        return ENDPOINTS.ISLANDRANK;
      case 'Branch Ranking':
        return ENDPOINTS.BRANCHRANK;
      case 'Regional Ranking':
        return ENDPOINTS.TEAMRANK;
      case 'TOT Ranking':
        return ENDPOINTS.TOTRANK;
      case 'COT Ranking':
        return ENDPOINTS.COTRANK;
      case 'Life Members':
        return ENDPOINTS.LIFE_MEMBER_MDRT;
      default:
        return ENDPOINTS.ISLANDRANK;
    }
  };

  const handleSelectionChange = (val) => {
    setSelectedValue(val);
    setShowDropdown(false);
    setError(false);
    if (val === 'Branch Ranking' || val === 'Regional Ranking') {
      const agency_code1 = agentProfile?.personal_agency_code;
      const agency_code2 = agentProfile?.newagt || 0;
      const catType = agentProfile?.stid;
      fetchBranchRegionalRankMdrt(val, agency_code1, agency_code2, catType);
    } else if (val === 'Life Members') {
      checkIfUserIsLifeMember();
    } else {
      fetchWinnersData(val);
    }
  };

  const checkIfUserIsLifeMember = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.get(`${BASE_URL}${ENDPOINTS.LIFE_MEMBER_MDRT}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { p_year: currentYear }
      });

      const userOrganizerCode = agentProfile?.personal_agency_code;
      const isLifeMember = response.data.some(member =>
        member.agency_code_1 === userOrganizerCode || member.agency_code_2 === userOrganizerCode
      );

      setIsLifeMember(isLifeMember);

      const formattedData = response.data.map(item => ({
        name: item.agent_name.trim(),
        achievedTarget: item.fyp.toLocaleString('en-US', { maximumFractionDigits: 2 }),
        NOP: item.nop.toString(),
        rank: item.national_rank,
        achievement: item.achievment,
        balanceDue: item.balanceDue
      }));

      formattedData.sort((a, b) => parseInt(b.achievedTarget.replace(/,/g, '')) - parseInt(a.achievedTarget.replace(/,/g, '')));
      setWinnersData(formattedData);
    } catch (error) {
      handleErrorResponse(error);
      console.error('Error fetching life member details:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          await fetchAgentProfile();
          await fetchWinnersData('Island Ranking');
        } catch (error) {
          setError(true);
          setLoading(false);
        }
      };

      fetchData();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const renderDropdown = () => {
    return (
      <View style={styles.dropdownContainer}>
        <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)} style={styles.dropdownTouchable}>
          <Text style={styles.dropdownText}>{selectedValue}</Text>
          <Icon name={showDropdown ? 'angle-up' : 'angle-down'} size={20} color="#000" style={styles.dropdownIcon} />
        </TouchableOpacity>
        {showDropdown && (
          <View style={styles.dropdownOptions}>
            {['Island Ranking', 'Branch Ranking', 'Regional Ranking', 'COT Ranking', 'TOT Ranking', 'Life Members'].map(rank => (
              <TouchableOpacity key={rank} onPress={() => handleSelectionChange(rank)}>
                <Text style={styles.optionText}>{rank}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="Session Expired"
          message="Please Log Again!"
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showConfirmButton={true}
          confirmText="OK"
          confirmButtonColor="#FF7758"
          onConfirmPressed={handleConfirm}
        />
      </View>
    );
  };

  const renderItem = ({ item, index }) => {
    return (
      <View style={[
        styles.itemContainer,
        selectedValue !== 'Life Members' && index < 3 && styles.highlightedItem,
        selectedValue !== 'Life Members' && item.achievement === 'Achieved' && index >= 3 && styles.achievedBeyondTopThree
      ]}>
        <View style={styles.iconContainer}>
          <Icon name="user-circle" size={50} color={index < 3 ? '#A29D9C' : '#C0C0C0'} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.name}</Text>
          {selectedValue !== 'Life Members' && (
            <>
              <Text style={styles.achievedTarget}>Achieved Target: {item.achievedTarget}</Text>
              <Text style={styles.nop}>NOP: {item.NOP}</Text>
              <Text style={styles.place}>
                {selectedValue === 'Branch Ranking' ? `Branch Rank: ${item.rank}` : selectedValue === 'Regional Ranking' ? `Regional Rank: ${item.rank}` : `National Rank: ${item.rank}`}
              </Text>
              {item.achievement === 'Achieved' ? (
                <Text style={[styles.achievedText, styles.achievedTextGreen]}>ACHIEVED</Text>
              ) : (
                <Text style={[styles.achievedText, styles.achievedTextGray]}>
                  Needs: {item.balanceDue.toLocaleString('en-US')}
                </Text>
              )}
            </>
          )}
        </View>
        {selectedValue !== 'Life Members' && index === 0 && (
          <View style={styles.svgContainer}>
            <FirstPlaceSvg />
          </View>
        )}
        {selectedValue !== 'Life Members' && index === 1 && (
          <View style={styles.svgContainer}>
            <SecondPlaceSvg />
          </View>
        )}
        {selectedValue !== 'Life Members' && index === 2 && (
          <View style={styles.svgContainer}>
            <ThirdPlaceSvg />
          </View>
        )}
      </View>
    );
  };

  const renderUser = () => {
    if (!personalMdrt) {
      return null;
    }

    let userRank = '';
    let showUserRank = true;
    switch (selectedValue) {
      case 'Island Ranking':
        userRank = `${personalMdrt.mdrt_rank}`;
        break;
      case 'Branch Ranking':
        userRank = personalMdrt.branch_rank ? `${personalMdrt.branch_rank}` : 'No Branch Rank';
        break;
      case 'Regional Ranking':
        userRank = personalMdrt.region_rank ? `${personalMdrt.region_rank}` : 'No Regional Rank';
        break;
      case 'COT Ranking':
        userRank = personalMdrt.cot_rank ? `${personalMdrt.cot_rank}` : 'No COT Rank';
        break;
      case 'TOT Ranking':
        userRank = personalMdrt.tot_rank ? `${personalMdrt.tot_rank}` : 'No TOT Rank';
        break;
      case 'Life Members':
        showUserRank = false;
        userRank = isLifeMember ? 'You are a Life Member' : 'You are not a Life Member';
        break;
      default:
        userRank = `National Rank: ${personalMdrt.mdrt_rank}`;
        break;
    }

    return (
      <View style={[styles.itemContainer, styles.highlightedItem, { width: screenWidth * 0.97 }]}>
        <View style={styles.iconContainer}>
          <Image 
            source={require('../../components/user.jpg')} 
            style={styles.profilePicLarge}
            resizeMode="cover" 
          />
        </View>
        <View style={styles.textContainer}>
          {showUserRank ? (
            <>
              <Text style={styles.uname}>Your place: {userRank}</Text>
              <Text style={styles.salesAmount}>
                Sales amount: {personalMdrt.fyp ? Number(personalMdrt.fyp).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.uname}>{userRank}</Text>
              <Text style={styles.salesAmount}>
                Sales amount: {personalMdrt.fyp ? Number(personalMdrt.fyp).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
              </Text>
            </>
          )}
        </View>
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="Session Expired"
          message="Please Log Again!"
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showConfirmButton={true}
          confirmText="OK"
          confirmButtonColor="#FF7758"
          onConfirmPressed={handleConfirm}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderDropdown()}
      <Text style={styles.rightAlignedText}>
  {selectedValue === 'Branch Ranking' && branchName}
  {selectedValue === 'Regional Ranking' && regionName}
</Text>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No data available</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={selectedValue === 'Branch Ranking' || selectedValue === 'Regional Ranking' ? branchRegionalData : winnersData}
            renderItem={renderItem}
            keyExtractor={item => item.name}
            contentContainerStyle={styles.flatListContainer}
          />
        </>
      )}
      <View style={{ alignItems: 'center' }}>
        {renderUser()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  flatListContainer: {
    paddingBottom: 100,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 3,
  },
  highlightedItem: {
    backgroundColor: '#FFD70020',
  },
  svgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    position: 'absolute',
    top: '50%', 
    right: -2, 
    transform: [{ translateY: -20.5 }],
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  textContainer: {
    justifyContent: 'center',
  },
  centeredTextContainer: {
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  uname: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
    marginLeft: 30,
  },
  achievedTarget: {
    fontSize: 14,
    color: 'gray',
  },
  salesAmount: {
    fontSize: 14,
    color: 'gray',
    marginLeft: 30,
    marginTop: 10,
  },
  nop: {
    fontSize: 14,
    color: 'gray',
  },
  achievedText: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
  achievedTextGreen: {
    color: 'green',
  },
  achievedTextGray: {
    color: 'gray',
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profilePicLarge: {
    width: 68,
    height: 68,
    borderRadius: 34,
  },
  dropdownContainer: {
    width: 170,
    marginBottom: 20,
    backgroundColor: '#e8e6e3',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  dropdownTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownIcon: {
    marginLeft: 10,
  },
  dropdownOptions: {
    marginTop: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 5,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
    marginBottom: 360,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  achievedBeyondTopThree: {
    backgroundColor: '#d4edda', // A greenish background color, change as per your UI theme
  },
  rightAlignedText: {
    position: 'absolute',
    right: 10,
    top: 10,
    fontSize: 16,
    color: '#333',
  },
  
});

export default WinnersScreen;
