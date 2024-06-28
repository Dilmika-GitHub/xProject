// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, Image, BackHandler, ActivityIndicator } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import { useNavigation, useFocusEffect } from '@react-navigation/native';
// import { Bar1, Bar2 } from "../../components/Chart";
// import { BASE_URL } from '../services/apiConfig';

// const ENDPOINTS = {
//   ISLANDRANK: "/Mdrt/GetIslandRankMDRT",
//   BRANCHRANK: "/Mdrt/GetBranchRankMDRT",
//   TEAMRANK: "/Mdrt/GetRegionalRankMDRT",
//   TOTRANK: "/Mdrt/GetTOTRankMDRT",
//   COTRANK: "/Mdrt/GetCOTRankMDRT",
//   AGENT_PROFILE: "/Account/GetAgentProfile",
//   PERSONAL_MDRT: "/Mdrt/GetPersonalMDRT" // Add the endpoint for personal MDRT profile
// };

// const screenWidth = Dimensions.get('window').width;

// const WinnersScreen = () => {
//   const [winnersData, setWinnersData] = useState([]);
//   const [BranchRegionalData, setBranchRegionalData] = useState([]);
//   const [agentProfile, setAgentProfile] = useState(null); // State for agent profile data
//   const [personalMdrt, setPersonalMdrt] = useState(null); // State for personal MDRT data
//   const [selectedValue, setSelectedValue] = useState('Island Ranking');
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [loading, setLoading] = useState(true); // Add loading state
//   const navigation = useNavigation();

//   useEffect(() => {
//     fetchWinnersData('Island Ranking');
//     fetchAgentProfile(); // Fetch agent profile data when component mounts
//   }, []);

//   const fetchAgentProfile = async () => {
//     try {
//       const token = await AsyncStorage.getItem('accessToken');
//       const email = await AsyncStorage.getItem('email');
//       const catType = await AsyncStorage.getItem('categoryType');
//       if (!token || !email || !catType) {
//         throw new Error('No token, email, or category type found');
//       }
  
//       const url = `${BASE_URL}${ENDPOINTS.AGENT_PROFILE}?email=${email}&catType=${catType}`;
//       console.log(`Fetching agent profile data from: ${url}`);
  
//       const response = await fetch(url, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
  
//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
//       }
  
//       const data = await response.json();
//       console.log('Full agent profile data response:', data); // Log the full agent profile data
  
//       // Check if data contains agent_code or orgnizer_code
//       if (!data || (!data.agent_code && !data.orgnizer_code)) {
//         throw new Error("Agent code or Organizer code not found in profile data.");
//       }
  
//       console.log('Agent profile data:', data); // Log the agent profile data
//       setAgentProfile(data);
  
//       // Fetch personal MDRT profile after getting the agent/organizer code
//       const code = data.agent_code || data.orgnizer_code;
//       console.log(`Using code: ${code}`);
//       fetchPersonalMdrt(code, catType);
//     } catch (error) {
//       console.error('Error fetching agent profile:', error.message);
//     }
//   };
  
//   const fetchPersonalMdrt = async (code, catType) => {
//     try {
//       const token = await AsyncStorage.getItem('accessToken');
//       if (!token || !code || !catType) {
//         throw new Error('No token, code, or category type found');
//       }
  
//       const url = `${BASE_URL}${ENDPOINTS.PERSONAL_MDRT}?p_agency_1=${code}&p_agency_2=0&p_cat=${catType}&p_year=${new Date().getFullYear()}`;
//       console.log(`Fetching personal MDRT data from: ${url}`);
  
//       const response = await fetch(url, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
  
//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
//       }
  
//       const data = await response.json();
//       console.log('Personal MDRT data:', data); // Log the personal MDRT data
//       setPersonalMdrt(data);
//     } catch (error) {
//       console.error('Error fetching personal MDRT data:', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   const fetchBranchRegionalRankMdrt = async (rankingType, code, catType) => {
//     try {
//       const token = await AsyncStorage.getItem('accessToken');
//       if (!token || !code || !catType) {
//         throw new Error('No token, code, or category type found');
//       }

//       const currentYear = new Date().getFullYear();
//       const endpoint = getEndpoint(rankingType);
//       const url = `${BASE_URL}${endpoint}?p_agency_1=${code}&p_agency_2=0&p_cat=${catType}&p_year=${currentYear}`;
//       console.log(`Fetching ${rankingType} data from: ${url}`);
      
//       const response = await fetch(url, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
//       }

//       const data = await response.json();
//       const formattedData = data.map(item => ({
//         name: item.agent_name.trim(),
//         achievedTarget: item.fyp.toLocaleString('en-US', { maximumFractionDigits: 2 }),
//         NOP: item.nop.toString(),
//         place: item.national_rank.toString()
//       }));
//       console.log(`${rankingType} data:`, data); // Log the ranking data
//       formattedData.sort((a, b) => parseInt(b.achievedTarget.replace(/,/g, '')) - parseInt(a.achievedTarget.replace(/,/g, ''))); // Sort by achievedTarget in descending order
//       setBranchRegionalData(formattedData);
//     } catch (error) {
//       console.error(`Error fetching ${rankingType} data:`, error.message);
//     }
//   };

//   const fetchWinnersData = async (rankingType) => {
//     try {
//       const token = await AsyncStorage.getItem('accessToken');
//       if (!token) {
//         throw new Error('No token found');
//       }

//       const currentYear = new Date().getFullYear();
//       const endpoint = getEndpoint(rankingType);
//       const url = `${BASE_URL}${endpoint}?p_year=${currentYear}`;
//       const itemWidth = screenWidth * 0.97;

//       console.log(`Fetching data from: ${url}`); // Debug log

//       const response = await fetch(url, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
//       }

//       const data = await response.json();
//       const formattedData = data.map(item => ({
//         name: item.agent_name.trim(),
//         achievedTarget: item.fyp.toLocaleString('en-US', { maximumFractionDigits: 2 }),
//         NOP: item.nop.toString(),
//         place:item.national_rank.toString()
//       }));
//       formattedData.sort((a, b) => parseInt(b.achievedTarget.replace(/,/g, '')) - parseInt(a.achievedTarget.replace(/,/g, ''))); // Sort by achievedTarget in descending order
//       setWinnersData(formattedData);
//     } catch (error) {
//       console.error('Error fetching data:', error.message);
//     }
//   };

//   const getEndpoint = (rankingType) => {
//     switch (rankingType) {
//       case 'Island Ranking':
//         return ENDPOINTS.ISLANDRANK;
//       case 'Branch Ranking':
//         return ENDPOINTS.BRANCHRANK;
//       case 'Team Ranking':
//         return ENDPOINTS.TEAMRANK;
//       case 'TOT Ranking':
//         return ENDPOINTS.TOTRANK;
//       case 'COT Ranking':
//         return ENDPOINTS.COTRANK;
//       default:
//         return ENDPOINTS.ISLANDRANK;
//     }
//   };

//   const handleSelectionChange = (val) => {
//     setSelectedValue(val);
//     setShowDropdown(false);
//     if (val === 'Branch Ranking' || val === 'Team Ranking') {
//       const code = agentProfile?.agent_code || agentProfile?.orgnizer_code;
//       const catType = agentProfile?.stid;
//       fetchBranchRegionalRankMdrt(val, code, catType);
//     } else {
//       fetchWinnersData(val);
//     }
//   };

//   const renderDropdown = () => {
//     return (
//       <View style={styles.dropdownContainer}>
//         <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)} style={styles.dropdownTouchable}>
//           <Text style={styles.dropdownText}>{selectedValue}</Text>
//           <Icon name={showDropdown ? 'angle-up' : 'angle-down'} size={20} color="#000" style={styles.dropdownIcon} />
//         </TouchableOpacity>
//         {showDropdown && (
//           <View style={styles.dropdownOptions}>
//             <TouchableOpacity onPress={() => handleSelectionChange('Island Ranking')}>
//               <Text style={styles.optionText}>Island Ranking</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => handleSelectionChange('Branch Ranking')}>
//               <Text style={styles.optionText}>Branch Ranking</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => handleSelectionChange('Team Ranking')}>
//               <Text style={styles.optionText}>Regional Ranking</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => handleSelectionChange('COT Ranking')}>
//               <Text style={styles.optionText}>COT Ranking</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => handleSelectionChange('TOT Ranking')}>
//               <Text style={styles.optionText}>TOT Ranking</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>
//     );
//   };

//   const renderItem = ({ item, index }) => {
//     const target = parseInt(item.achievedTarget.replace(/,/g, '')) || 0;
//     const achieved = target >= 6000000;

//     return (
//       <View style={[styles.itemContainer, index < 3 && styles.highlightedItem]}>
//         <View style={styles.iconContainer}>
//           <Icon name="user-circle" size={50} color={index < 3 ? '#FFD700' : '#C0C0C0'} />
//         </View>
//         <View style={styles.textContainer}>
//           <Text style={styles.name}>{item.name}</Text>
//           <Text style={styles.achievedTarget}>Achieved Target: {item.achievedTarget}</Text>
//           <Text style={styles.nop}>NOP: {item.NOP}</Text>
//           <Text style={styles.place}>NOP: {item.place}</Text>
//           {achieved ? (
//             <Text style={[styles.achievedText, styles.achievedTextGreen]}>ACHIEVED</Text>
//           ) : (
//             <Text style={[styles.achievedText, styles.achievedTextGray]}>
//               Needs: {(6000000 - target).toLocaleString('en-US')}
//             </Text>
//           )}
//         </View>
//       </View>
//     );
//   };

//   const renderUser = () => {
//     if (!personalMdrt) {
//       return null;
//     }

//     const target = parseInt(personalMdrt.fyp?.toLocaleString('en-US', { maximumFractionDigits: 2 }).replace(/,/g, '') || '0');
//     const achieved = target >= 6000000;

//     return (
//       <View style={[styles.itemContainer, styles.highlightedItem, { width: screenWidth * 0.97 }]}>
//         <View style={styles.iconContainer}>
//           <Image 
//             source={require('../../components/user.jpg')} 
//             style={styles.profilePicLarge}
//             resizeMode="cover" 
//           />
//         </View>
//         <View style={styles.textContainer}>
//           <Text style={styles.uname}>Your place {personalMdrt.mdrt_rank}</Text>
//           <Text style={styles.salesAmount}>
//             Sales amount: {personalMdrt.fyp ? Number(personalMdrt.fyp).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
//         </Text>
//         </View>
//       </View>
//     );
//   };

//   const renderProfilePic = (winner) => {
//     if (winner.profilePic) {
//       return <Image source={winner.profilePic} style={styles.profilePic} />;
//     } else {
//       return <Icon name="user-circle" size={26} color="#FF5733" style={{ marginRight: 10 }} />;
//     }
//   };

//   const topThreeWinners = winnersData.slice(0, 3);

//   useFocusEffect(
//     React.useCallback(() => {
//       const onBackPress = () => {
//         navigation.navigate('MDRT');
//         return true;
//       };

//       BackHandler.addEventListener('hardwareBackPress', onBackPress);

//       return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
//     }, [navigation])
//   );

//   if (loading) {
//     return (
//       <View style={styles.loader}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {renderDropdown()}
//       <View style={[styles.barContainer, { marginTop: 60 }]}>
//         {topThreeWinners.length > 0 && (
//           <Bar1
//             profilePic={renderProfilePic(topThreeWinners[0])}
//             name={topThreeWinners[0].name}
//             achievedTarget={topThreeWinners[0].achievedTarget}
//           />
//         )}
//         <View style={{ marginTop: -150, alignItems: 'center' }}>
//           {topThreeWinners.length > 1 && (
//             <Bar2
//               profilePic={renderProfilePic(topThreeWinners[1])}
//               name={topThreeWinners[1].name}
//               achievedTarget={topThreeWinners[1].achievedTarget}
//             />
//           )}
//         </View>
//       </View>
//       <FlatList
//         data={selectedValue === 'Branch Ranking' || selectedValue === 'Team Ranking' ? BranchRegionalData : winnersData.slice(3)}
//         renderItem={renderItem}
//         keyExtractor={item => item.name}
//         contentContainerStyle={styles.flatListContainer}
//       />
//       <View style={{ alignItems: 'center' }}>
//         {renderUser()}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//     backgroundColor: '#f5f5f5', 
//   },
//   flatListContainer: {
//     paddingBottom: 100,
//   },
//   itemContainer: {
//     flexDirection: 'row',
//     padding: 10,
//     marginVertical: 5,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 10,
//     elevation: 3,
//   },
//   highlightedItem: {
//     backgroundColor: '#FFD70020',
//   },
//   iconContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 10,
//   },
//   textContainer: {
//     justifyContent: 'center',
//   },
//   centeredTextContainer: {
//     alignItems: 'center', // Center align items horizontally
//   },
//   name: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     textAlign: 'center', // Center align text horizontally
//   },
//   uname: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     textAlign: 'center', // Center align text horizontally
//   },
//   achievedTarget: {
//     fontSize: 14,
//     color: 'gray',
//   },
//   salesAmount: {
//     fontSize: 14,
//     color: 'gray',
//     marginLeft: 50,
//     marginTop: 10,
//   },
//   nop: {
//     fontSize: 14,
//     color: 'gray',
//   },
//   achievedText: {
//     marginTop: 5,
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   achievedTextGreen: {
//     color: 'green',
//   },
//   achievedTextGray: {
//     color: 'gray',
//   },
//   profilePic: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//   },
//   profilePicLarge: {
//     width: 68,
//     height: 68,
//     borderRadius: 34,
//   },
//   dropdownContainer: {
//     width: 200,
//     marginBottom: 20,
//     backgroundColor: '#e8e6e3',
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 5,
//     paddingHorizontal: 8,
//     paddingVertical: 10,
//     alignSelf: 'center',
//   },
//   dropdownTouchable: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   dropdownText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   dropdownIcon: {
//     marginLeft: 10,
//   },
//   dropdownOptions: {
//     marginTop: 10,
//   },
//   optionText: {
//     fontSize: 16,
//     color: '#333',
//     paddingVertical: 5,
//   },
//   barContainer: {
//     flexDirection: 'column',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   bar: {
//     height: 20, 
//     backgroundColor: 'blue', 
//     borderRadius: 5, 
//   },
//   placeText: {
//     marginBottom: 5,
//   },
//   targetText: {
//     marginTop: 5,
//   },
//   loader: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default WinnersScreen;




import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, Image, BackHandler, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Bar1, Bar2 } from "../../components/Chart";
import { BASE_URL } from '../services/apiConfig';

const ENDPOINTS = {
  ISLANDRANK: "/Mdrt/GetIslandRankMDRT",
  BRANCHRANK: "/Mdrt/GetBranchRankMDRT",
  TEAMRANK: "/Mdrt/GetRegionalRankMDRT",
  TOTRANK: "/Mdrt/GetTOTRankMDRT",
  COTRANK: "/Mdrt/GetCOTRankMDRT",
  AGENT_PROFILE: "/Account/GetAgentProfile",
  PERSONAL_MDRT: "/Mdrt/GetPersonalMDRT" // Add the endpoint for personal MDRT profile
};

const screenWidth = Dimensions.get('window').width;

const WinnersScreen = () => {
  const [winnersData, setWinnersData] = useState([]);
  const [BranchRegionalData, setBranchRegionalData] = useState([]);
  const [agentProfile, setAgentProfile] = useState(null); // State for agent profile data
  const [personalMdrt, setPersonalMdrt] = useState(null); // State for personal MDRT data
  const [selectedValue, setSelectedValue] = useState('Island Ranking');
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigation = useNavigation();

  useEffect(() => {
    fetchWinnersData('Island Ranking');
    fetchAgentProfile(); // Fetch agent profile data when component mounts
  }, []);

  const fetchAgentProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const email = await AsyncStorage.getItem('email');
      const catType = await AsyncStorage.getItem('categoryType');
      if (!token || !email || !catType) {
        throw new Error('No token, email, or category type found');
      }
  
      const url = `${BASE_URL}${ENDPOINTS.AGENT_PROFILE}?email=${email}&catType=${catType}`;
      console.log(`Fetching agent profile data from: ${url}`);
  
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
  
      const data = await response.json();
      console.log('Full agent profile data response:', data); // Log the full agent profile data
  
      // Check if data contains agent_code or orgnizer_code
      if (!data || (!data.agent_code && !data.orgnizer_code)) {
        throw new Error("Agent code or Organizer code not found in profile data.");
      }
  
      console.log('Agent profile data:', data); // Log the agent profile data
      setAgentProfile(data);
  
      // Fetch personal MDRT profile after getting the agent/organizer code
      const code = data.agent_code || data.orgnizer_code;
      console.log(`Using code: ${code}`);
      fetchPersonalMdrt(code, catType);
    } catch (error) {
      console.error('Error fetching agent profile:', error.message);
    }
  };
  
  const fetchPersonalMdrt = async (code, catType) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token || !code || !catType) {
        throw new Error('No token, code, or category type found');
      }
  
      const url = `${BASE_URL}${ENDPOINTS.PERSONAL_MDRT}?p_agency_1=${code}&p_agency_2=0&p_cat=${catType}&p_year=${new Date().getFullYear()}`;
      console.log(`Fetching personal MDRT data from: ${url}`);
  
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
  
      const data = await response.json();
      console.log('Personal MDRT data:', data); // Log the personal MDRT data
      setPersonalMdrt(data);
    } catch (error) {
      console.error('Error fetching personal MDRT data:', error.message);
    } finally {
      setLoading(false);
    }
  };
  

  const fetchBranchRegionalRankMdrt = async (rankingType, code, catType) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token || !code || !catType) {
        throw new Error('No token, code, or category type found');
      }

      const currentYear = new Date().getFullYear();
      const endpoint = getEndpoint(rankingType);
      const url = `${BASE_URL}${endpoint}?p_agency_1=${code}&p_agency_2=0&p_cat=${catType}&p_year=${currentYear}`;
      console.log(`Fetching ${rankingType} data from: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      const formattedData = data.map(item => ({
        name: item.agent_name.trim(),
        achievedTarget: item.fyp.toLocaleString('en-US', { maximumFractionDigits: 2 }),
        NOP: item.nop.toString(),
        place: item.national_rank.toString()
      }));
      console.log(`${rankingType} data:`, data); // Log the ranking data
      formattedData.sort((a, b) => parseInt(b.achievedTarget.replace(/,/g, '')) - parseInt(a.achievedTarget.replace(/,/g, ''))); // Sort by achievedTarget in descending order
      setBranchRegionalData(formattedData);
    } catch (error) {
      console.error(`Error fetching ${rankingType} data:`, error.message);
    }
  };

  const fetchWinnersData = async (rankingType) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No token found');
      }

      const currentYear = new Date().getFullYear();
      const endpoint = getEndpoint(rankingType);
      const url = `${BASE_URL}${endpoint}?p_year=${currentYear}`;
      const itemWidth = screenWidth * 0.97;

      console.log(`Fetching data from: ${url}`); // Debug log

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      const formattedData = data.map(item => ({
        name: item.agent_name.trim(),
        achievedTarget: item.fyp.toLocaleString('en-US', { maximumFractionDigits: 2 }),
        NOP: item.nop.toString(),
        place:item.national_rank.toString()
      }));
      formattedData.sort((a, b) => parseInt(b.achievedTarget.replace(/,/g, '')) - parseInt(a.achievedTarget.replace(/,/g, ''))); // Sort by achievedTarget in descending order
      setWinnersData(formattedData);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  const getEndpoint = (rankingType) => {
    switch (rankingType) {
      case 'Island Ranking':
        return ENDPOINTS.ISLANDRANK;
      case 'Branch Ranking':
        return ENDPOINTS.BRANCHRANK;
      case 'Team Ranking':
        return ENDPOINTS.TEAMRANK;
      case 'TOT Ranking':
        return ENDPOINTS.TOTRANK;
      case 'COT Ranking':
        return ENDPOINTS.COTRANK;
      default:
        return ENDPOINTS.ISLANDRANK;
    }
  };

  const handleSelectionChange = (val) => {
    setSelectedValue(val);
    setShowDropdown(false);
    if (val === 'Branch Ranking' || val === 'Team Ranking') {
      const code = agentProfile?.agent_code || agentProfile?.orgnizer_code;
      const catType = agentProfile?.stid;
      fetchBranchRegionalRankMdrt(val, code, catType);
    } else {
      fetchWinnersData(val);
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
            <TouchableOpacity onPress={() => handleSelectionChange('Branch Ranking')}>
              <Text style={styles.optionText}>Branch Ranking</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSelectionChange('Team Ranking')}>
              <Text style={styles.optionText}>Regional Ranking</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSelectionChange('COT Ranking')}>
              <Text style={styles.optionText}>COT Ranking</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSelectionChange('TOT Ranking')}>
              <Text style={styles.optionText}>TOT Ranking</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderItem = ({ item, index }) => {
    const target = parseInt(item.achievedTarget.replace(/,/g, '')) || 0;
    const achieved = target >= 6000000;

    return (
      <View style={[styles.itemContainer, index < 3 && styles.highlightedItem]}>
        <View style={styles.iconContainer}>
          <Icon name="user-circle" size={50} color={index < 3 ? '#FFD700' : '#C0C0C0'} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.achievedTarget}>Achieved Target: {item.achievedTarget}</Text>
          <Text style={styles.nop}>NOP: {item.NOP}</Text>
          <Text style={styles.place}>National Rank: {item.place}</Text>
          {achieved ? (
            <Text style={[styles.achievedText, styles.achievedTextGreen]}>ACHIEVED</Text>
          ) : (
            <Text style={[styles.achievedText, styles.achievedTextGray]}>
              Needs: {(6000000 - target).toLocaleString('en-US')}
            </Text>
          )}
        </View>
      </View>
    );
  };

  const renderUser = () => {
    if (!personalMdrt) {
      return null;
    }

    const target = parseInt(personalMdrt.fyp?.toLocaleString('en-US', { maximumFractionDigits: 2 }).replace(/,/g, '') || '0');
    const achieved = target >= 6000000;

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
          <Text style={styles.uname}>Your place {personalMdrt.mdrt_rank}</Text>
          <Text style={styles.salesAmount}>
            Sales amount: {personalMdrt.fyp ? Number(personalMdrt.fyp).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
          </Text>
        </View>
      </View>
    );
  };

  const renderProfilePic = (winner) => {
    if (winner.profilePic) {
      return <Image source={winner.profilePic} style={styles.profilePic} />;
    } else {
      return <Icon name="user-circle" size={26} color="#FF5733" style={{ marginRight: 10 }} />;
    }
  };

  const topThreeWinners = winnersData.slice(0, 3);

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

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderDropdown()}
      <View style={[styles.barContainer, { marginTop: 60 }]}>
        {topThreeWinners.length > 0 && (
          <Bar1
            profilePic={renderProfilePic(topThreeWinners[0])}
            name={topThreeWinners[0].name}
            achievedTarget={topThreeWinners[0].achievedTarget}
          />
        )}
        <View style={{ marginTop: -150, alignItems: 'center' }}>
          {topThreeWinners.length > 1 && (
            <Bar2
              profilePic={renderProfilePic(topThreeWinners[1])}
              name={topThreeWinners[1].name}
              achievedTarget={topThreeWinners[1].achievedTarget}
            />
          )}
        </View>
      </View>
      <FlatList
        data={selectedValue === 'Branch Ranking' || selectedValue === 'Team Ranking' ? BranchRegionalData : winnersData}
        renderItem={renderItem}
        keyExtractor={item => item.name}
        contentContainerStyle={styles.flatListContainer}
      />
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
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  textContainer: {
    justifyContent: 'center',
  },
  centeredTextContainer: {
    alignItems: 'center', // Center align items horizontally
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center', // Center align text horizontally
  },
  uname: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left', // Align text to the left
    marginLeft: 30, // Center align text horizontally
  },
  achievedTarget: {
    fontSize: 14,
    color: 'gray',
  },
  salesAmount: {
    fontSize: 14,
    color: 'gray',
    marginLeft: 30, // Match the left margin with 'uname'
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
    width: 200,
    marginBottom: 20,
    backgroundColor: '#e8e6e3',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 10,
    alignSelf: 'center',
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
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WinnersScreen;
