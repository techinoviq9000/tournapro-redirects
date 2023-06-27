import { Ionicons } from "@expo/vector-icons";
import { useUserData } from "@nhost/react";
import {
  Box,
  Text,
  Image,
  Stack,
  HStack,
  Button,
  Input,
  ScrollView,
  FormControl,
  Select,
  CheckIcon,
  WarningOutlineIcon,
  Pressable,
  Avatar,
} from "native-base";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View, Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TextInput } from "react-native-gesture-handler";

const EditProfile = () => {

  const userData = useUserData();
  const[dateofbirth, setDateOfBirth]=useState("")
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState
  (false);

    const toggleDatePicker = () => {
      setShowPicker(!showPicker);
    };

    const onChange = ({type}, selectedDate) => {

      if(type == "set")
      {
        const currentDate = selectedDate;
        setDate(currentDate);
      }

      else
      {
        toggleDatePicker();
      }
    };



  // const [mode, setMode] = useState("date");
  // const [show, setShow] = useState(false);

  // const onChange = (event, selectedDate) => {
  //   const currentDate = selectedDate;
  //   setShow(false);
  //   setDate(currentDate);
  // };

  // const showMode = (currentMode) => {
  //   if (Platform.OS === "android") {
  //     setShow(false);
  //     // for iOS, add a button that closes the picker
  //   }
  //   setMode(currentMode);
  // };

  const openAlert = () => {
    Alert.alert(
      "Profile Picture",
      "View or edit profile picture",
      [
        { text: "View", onPress: () => console.log("Yes button clicked") },
        {
          text: "Edit",
          onPress: () => console.log("No button clicked"),
          style: "cancel",
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  return (
    <ScrollView>
      <Stack display="flex" alignItems="center" marginTop="50px">
        <Text fontSize="25px" fontWeight="bold">
          Edit Profile
        </Text>
        <Pressable onPress={() => openAlert()}>
          <Box>
            {/* <Image  marginTop="20px" size={150} borderRadius={100} source={{
            uri: "https://variety.com/wp-content/uploads/2023/02/GettyImages-1466470818.jpg"
        }} alt="Alternate Text" /> */}
            <Avatar
              bg="lightBlue.400"
              source={{
                uri: userData?.avatarUrl,
              }}
              size="2xl"
            >
              <Avatar.Badge
                bg="blue.500"
                borderWidth={"0"}
                size={"10"}
                flex={1}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Icon display="flex" name="camera" size={15} color="white" />
              </Avatar.Badge>
            </Avatar>
          </Box>
        </Pressable>
        <Box padding="30px">
          <Text fontSize="20px" fontWeight="bold">
            Name
          </Text>
          <Input mx="0" placeholder="" w="100%" />

          <Text fontSize="20px" fontWeight="bold" marginTop="20px">
            Email
          </Text>
          <Input mx="0" placeholder="" w="100%" />

          <Text fontSize="20px" fontWeight="bold" marginTop="20px">
            Password
          </Text>
          <Input mx="0" placeholder="" w="100%" type="password" />
          
          <Text fontSize="20px" fontWeight="bold" marginTop="20px">Date of Birth</Text>
            {/* {!showPicker && (<DateTimePicker mode="date" display="spinner" value={date}/>)}
            <Input mx="0" placeholder="Aug 21 2004" w="100%" /> */}
            
            {showPicker && (
            <DateTimePicker
             mode="date"
             display="spinner"
             value={date}
             onChange={onChange}
            />
         )}
         {!showPicker && (
            <Pressable onPress={toggleDatePicker}>
              <Input placeholder="select date of birth"
              value={dateofbirth}
              
              placeholderTextColor="#11182744">
                
              </Input>
            </Pressable>)}

          <FormControl marginTop="20px" w="3/4" maxW="300" isRequired isInvalid>
            <FormControl.Label>
              <Text fontSize="20px" fontWeight="bold">
                Country/Region
              </Text>
            </FormControl.Label>
            <Select
              minWidth="323"
              accessibilityLabel="Choose Location"
              placeholder="Choose Location"
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size={5} />,
              }}
              mt="1"
            >
              <Select.Item label="Dubai East" value="Dubai East" />
              <Select.Item label="Dubai Central" value="Dubai Central" />
              <Select.Item label="Dubai West" value="Dubai West" />
              <Select.Item label="Dubai South" value="Dubai South" />
              <Select.Item label="Dubai North" value="Dubai North" />
            </Select>
            {/* <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
          Please make a selection!
        </FormControl.ErrorMessage> */}
          </FormControl>
          <Box alignItems="center" marginTop="20px">
            <Button onPress={() => alert("Changes Saved")}>Save Changes</Button>
          </Box>
        </Box>
      </Stack>
    </ScrollView>
  );
};

export default EditProfile;
