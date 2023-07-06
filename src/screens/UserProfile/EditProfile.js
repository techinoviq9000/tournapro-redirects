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
import { SafeAreaView, StyleSheet, View, Alert, Platform } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TextInput } from "react-native-gesture-handler";

const EditProfile = () => {
  const userData = useUserData();
  const [dateofbirth, setDateOfBirth] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [country, setCountry] = useState("");
  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  };

  const onChange = ({ type }, selectedDate) => {
    if (type == "set") {
      if (Platform.OS == "android") {
        toggleDatePicker();
        setDateOfBirth(selectedDate.toDateString());
      }
    } else {
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

  const countryRegion = [
    { label: "Dubai East", value: "Dubai East" },
    { label: "Dubai Central", value: "Dubai Central" },
    { label: "Dubai West", value: "Dubai West" },
    { label: "Dubai South", value: "Dubai South" },
    { label: "Dubai North", value: "Dubai North" },
  ];
const handleCountryPressed = (itemId) => {
  setCountry(itemId)
}
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
            <Stack display="flex" alignItems="center" marginTop="20px">
            <Text fontSize="20px" fontWeight="bold">{userData?.displayName}</Text>
            </Stack>
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

          {/* <Text fontSize="20px" fontWeight="bold" marginTop="20px">
            Password
          </Text>
          <Input mx="0" placeholder="" w="100%" type="password" /> */}

          <Text fontSize="20px" fontWeight="bold" marginTop="20px">
            Date of Birth
          </Text>
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

          <Pressable onPress={toggleDatePicker} marginBottom={"20px"}>
            <Input
              placeholder="select date of birth"
              value={dateofbirth}
              editable={false}
              placeholderTextColor="#11182744"
            ></Input>
          </Pressable>

          <Text fontSize="20px" fontWeight="bold">
                Country/Region
              </Text>
            <Select
              minWidth="full"
              accessibilityLabel="Choose Location"
              selectedValue={country}
              onValueChange={(itemId) => handleCountryPressed(itemId)}
              placeholder="Choose Location"
              
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size={5} />,
              }}
              mt="1"
            >
             {countryRegion.map((item, index) => (
              <Select.Item value={item.value} label={item.label} key={index} /> 
             ))}
            </Select>

          <Box alignItems="center" marginTop="20px">
            <Button onPress={() => alert("Changes Saved")}>Save Changes</Button>
          </Box>
        </Box>
      </Stack>
    </ScrollView>
  );
};

export default EditProfile;
