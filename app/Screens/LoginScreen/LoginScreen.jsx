import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Waves, Waves2, Waves3 } from "../../../components/Waves";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CheckConnection from "../../../components/checkConnection";
import { BASE_URL, ENDPOINTS } from "../../services/apiConfig";
import AwesomeAlert from 'react-native-awesome-alerts';

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showSavePasswordPopup, setShowSavePasswordPopup] = useState(false);
  const [hasSavedCredentials, setHasSavedCredentials] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../../../assets/font/Poppins-Regular.ttf"),
  });

  // Check if credentials are saved
  useEffect(() => {
    const checkStoredCredentials = async () => {
      const storedUsername = await AsyncStorage.getItem("username");
      const storedPassword = await AsyncStorage.getItem("password");
      const loggedBefore = await AsyncStorage.getItem('loggedBefore');
      if (storedUsername && storedPassword) {
        setUsername(storedUsername);
        setPassword(storedPassword);
        setHasSavedCredentials(true);
      } else {
        setHasSavedCredentials(false);
      }
      if (!loggedBefore) {
        await AsyncStorage.setItem('loggedBefore', 'true');
      }
    };

    checkStoredCredentials();
  }, []);

  // Handle login
  const handleLogin = async () => {
    console.log(username)
    console.log(password)

    try {
      const response = await fetch(BASE_URL+ENDPOINTS.AUTHENTICATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: username,
          password: password,
          isActive: 'Y', 
        }),
      });
  
      const jsonResponse = await response.json();
      
      console.log('Response:', jsonResponse); 
  
      if (response.ok && jsonResponse.status === "Y") { 
        await AsyncStorage.setItem("accessToken", jsonResponse.accsesstoken);
        await AsyncStorage.setItem("categoryType", jsonResponse.cattype);
        await AsyncStorage.setItem("email", jsonResponse.email);

        if (!hasSavedCredentials) {
          setShowSavePasswordPopup(true);
        } else {
          if(jsonResponse.firstAttempt === "Y"){
            router.push("/Screens/LoginScreen/ChangeDefaultPassword")
          }
          else{
            if(jsonResponse.cattype === "Ag"){
              router.push("/Screens/HomePage/Home");
            }
            else{
              router.push("/Screens/LoginScreen/AccountTypeSelection");
            }  
          }
          
        }
      } else {
        setAlertMessage(`${jsonResponse.error || 'Unknown error'}`);
        setShowAlert(true);
      }
    } catch (error) {
      setAlertMessage(`Error: ${error.message}`);
      setShowAlert(true);
    }
  };
  

  // Save password
  const handleSavePassword = async (save) => {
    const loggedBefore = await AsyncStorage.getItem('loggedBefore');

    if (save) {
      await AsyncStorage.setItem("username", username);
      await AsyncStorage.setItem("password", password);
    }
    
    setShowSavePasswordPopup(false);

    if (loggedBefore) {
      router.push("/Screens/HomePage/Home"); // For subsequent logins
    } else {
      await AsyncStorage.setItem('loggedBefore', 'true');
      router.push("/Screens/HomePage/Home"); // For the first login
    }
  };

  return (
    <View style={styles.container}>
      <Waves2 style={styles.wavesTopSub} />
      <Waves style={styles.wavesTop} />
      <Waves3 style={styles.wavesBottom}></Waves3>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setUsername(text)}
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
      <Text style={styles.welcomeText}>WELCOME</Text>
      <CheckConnection />

      <Modal
        visible={showSavePasswordPopup}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSavePasswordPopup(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Do you want to save your password?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => handleSavePassword(true)}
              >
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => handleSavePassword(false)}
              >
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="Login Error"
        message={alertMessage}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor="#FF7758"
        onConfirmPressed={() => setShowAlert(false)}
      />
    </View>
  );
};

const { width, height } = Dimensions.get("window"); // Get screen dimensions

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  welcomeText: {
    left: 50,
    top: 50,
    position: "absolute",
    color: 'white',
    fontSize: 35,
    fontFamily: 'Poppins',
  },
  title: {
    fontSize: 30,
    position: 'static',
    right: 0,
    top: -10,
    color: "black",
    fontFamily: "poppins",
  },
  input: {
    height: hp('5%'),
    borderColor: "#8b8b8b99",
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: wp("80%"),
    borderWidth: 2,
    fontSize: wp("4.5%"),
  },
  wavesTop: {
    position: "absolute",
    left: 0,
    right: 0,
  },
  wavesTopSub: {
    position: "absolute",
    left: 0,
    right: 0,
  },
  wavesBottom: {
    position: "absolute",
    left: 0,
    right: 0,
  },
  loginButton: {
    width: wp('33%'),
    height: hp('6%'),
    top: hp('29%'),
    left: wp('30%'),
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2, // For Android shadow
    zIndex: 1, // Ensure the button text appears above the background
  },
  loginButtonText: {
    color: 'black',
    fontSize: hp('3%'),
    fontFamily: 'Poppins-Regular', // Make sure 'Poppins' is correctly loaded in your project
    fontWeight: '400',
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: wp("80%"),
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: wp('5%'),
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontSize: wp('4%'),
  },
});

export default LoginScreen;
