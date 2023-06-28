import { gql, useLazyQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";

import {
  Box,
  Button,
  Checkbox,
  CheckIcon,
  Container,
  FormControl,
  HStack,
  Input,
  Pressable,
  Select,
  Skeleton,
  Spacer,
  Text,
  useTheme,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { Platform, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { navigate } from "../../../rootNavigation";
import DateTimePicker from "@react-native-community/datetimepicker";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

// const DatePickerApp = () => {
//   const [date, setDate] = useState("09-10-2021");
//   return (
//     <Box>
//       <Text style={styles.text}>Birth Date :</Text>
//       <DatePickerApp
//         date={date}
//         mode="date"
//         placeholder="select date"
//         format="DD/MM/YYYY"
//         minDate="28-06-2023"
//         maxDate="27-06-2024"
//         confirmBtnText="Confirm"
//         cancelBtnText="Cancel"
//         customStyles={{
//           dateIcon: {
//             position: "absolute",
//             right: -5,
//             top: 4,
//             marginLeft: 0,
//           },
//           dateInput: {
//             borderColor: "gray",
//             alignItems: "flex-start",
//             borderWidth: 0,
//             borderBottomWidth: 1,
//           },
//           placeholderText: {
//             fontSize: 17,
//             color: "gray",
//           },
//           dateText: {
//             fontSize: 17,
//           },
//         }}
//         onDateChange={(date) => {
//           setDate(date);
//         }}
//       />
//     </Box>
//   );
// };

const TournamentDates = () => {
  const [startdate, setStartDate] = useState("");
  const [enddate, setEndDate] = useState("");

  const [date, setDate] = useState(new Date());
  const [dates, setDates] = useState(new Date());

  const [showPicker, setShowPicker] = useState(false);
  const [endPicker, setEndPicker] = useState(false);

  const toggleDatepicker = () => {
    setShowPicker(!showPicker);
  };
  const toggleendDatepicker = () => {
    setEndPicker(!endPicker);
  };
  const onChange = ({ type }, selectedDate) => {
    if (type == "set") {
      const currentDate = selectedDate;
      setDate(currentDate);
      if (Platform.OS === "android") {
        toggleDatepicker();
        setStartDate(currentDate.toDateString());
      }
    } else {
      toggleDatepicker();
    }
  };
  const onChangeEnd = ({ type }, selectedDate) => {
    if (type == "set") {
      const currentDate = selectedDate;
      setDates(currentDate);
      if (Platform.OS === "android") {
        toggleendDatepicker();
        setEndDate(currentDate.toDateString());
      }
    } else {
      toggleendDatepicker();
    }
  };

  return (
    <ScrollView>
      <Box p={6} safeArea mt={2} px={4}>
        <Box mb={4}>
          <Text fontSize={"3xl"} bold>
            Create New Tournament
          </Text>
          <Text textAling={"center"}>
            Select Tournament Start Date and End Date
          </Text>
        </Box>
        <Box>
          <Text>Start Date</Text>
          {showPicker && (
            <DateTimePicker
              mode="date"
              display="spinner"
              value={date}
              onChange={onChange}
            />
          )}

          {!showPicker && (
            <Pressable onPress={toggleDatepicker}>
              <Input
                variant="outline"
                placeholder="Select Date"
                value={startdate}
                fontSize="sm"
                color="black"
                borderColor={"gray.300"}
                borderRadius={"md"}
                keyboardType="default"
                editable={false}
                _focus={{
                  borderColor: "gray.600",
                  bgColor: "white",
                }}
              />
            </Pressable>
          )}
        </Box>

        <Box>
          <Text>End Date</Text>
          {endPicker && (
            <DateTimePicker
              mode="date"
              display="spinner"
              value={date}
              onChange={onChangeEnd}
            />
          )}

          {!endPicker && (
            <Pressable onPress={toggleendDatepicker}>
              <Input
                variant="outline"
                placeholder="Select End Date"
                value={enddate}
                fontSize="sm"
                color="black"
                borderColor={"gray.300"}
                borderRadius={"md"}
                keyboardType="default"
                editable={false}
                _focus={{
                  borderColor: "gray.600",
                  bgColor: "white",
                }}
              />
            </Pressable>
          )}
        </Box>

        <Box marginTop={"20px"}>
          <Button
            size="lg"
            borderRadius="lg"
            // bgColor={"blue.700"}
            colorScheme={"blue"}
            my={4}
            onPress={() => navigate("LogoPoster")}
          >
            Next
          </Button>
          <Button
            size="lg"
            borderRadius="lg"
            // bgColor={"blue.700"}
            colorScheme={"red"}
            my={4}
            onPress={() => navigate("CreateTournamentScreen")}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </ScrollView>
  );
};

export default TournamentDates;
