import {
  Box,
  Button,
  Input,
  Pressable,
  Text,
  VStack,
} from "native-base";
import React, { useState } from "react";
import { Platform, ScrollView } from "react-native";
import { navigate, navigationRef } from "../../../rootNavigation";
import DateTimePicker from "@react-native-community/datetimepicker";
import GoBack from "../../components/GoBack";


const TournamentDates = ({ route }) => {
  let values = route.params.values;
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
      if (Platform.OS === "android") {
        toggleDatepicker();
        setStartDate(selectedDate.toDateString());
      }
    } else {
      toggleDatepicker();
    }
  };

  const onChangeEnd = ({ type }, selectedDate) => {
    if (type == "set") {
      if (Platform.OS === "android") {
        toggleendDatepicker();
        setEndDate(selectedDate.toDateString());
      }
    } else {
      toggleendDatepicker();
    }
  };

  return (
    <ScrollView>
      <Box bg={"white"} minH="full" flex={1} safeArea p={5} pt={2}>
        <GoBack />
        <Box display="flex">
          <VStack space={4} mb={4}>
            <Text fontSize="30px" fontWeight="bold">
              Create New Tournament
            </Text>
            <Text bold>Select Tournament Start Date and End Date</Text>
          </VStack>
        <Box mb={4}>
          <Text  mb={1} fontWeight="bold">Start Date</Text>
          {showPicker && (
            <DateTimePicker
              mode="date"
              display="calendar"
              value={date}
              onChange={onChange}
            />
          )}

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
        </Box>
        <Box  mb={4}
        >
          <Text  mb={1} fontWeight="bold">End Date</Text>
          {endPicker && (
            <DateTimePicker
              mode="date"
              display="default"
              value={date}
              onChange={onChangeEnd}
            />
          )}

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
        </Box>
        <Box marginTop={"20px"}>
          <Button
            size="lg"
            borderRadius="lg"
            // bgColor={"blue.700"}
            colorScheme={"blue"}
            my={4}
            onPress={() => {
              values.start_date = startdate;
              values.end_date = enddate;
              navigationRef.navigate("TournamentRegistrationScreen", {
                values,
              });
            }}
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
      </Box>
    </ScrollView>
  );
};

export default TournamentDates;
