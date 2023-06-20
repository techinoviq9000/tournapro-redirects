import {
  Box,
  Button,
  useTheme,
  Text,
  ScrollView,
  Pressable,
  HStack,
  Spacer
} from "native-base"
import { Ionicons } from "@expo/vector-icons"
import { navigationRef } from "../../../rootNavigation"
import { useDispatch, useSelector } from "react-redux"
import { setongoingTournamentDetails } from "../../../store/tournamentSlice"


import * as React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NativeScreenNavigationContainer } from "react-native-screens"


const TournamentScreen = ({ route }) => {
  const tournamentData = useSelector((state) => state.tournament.data)
  const ongoingtournamentData = useSelector((state) => state.tournament.ongoingdata)
  const upcomingtournamentData = useSelector((state) => state.tournament.upcomingdata)
  const { colors } = useTheme()
  const dispatch = useDispatch()
  const handlePress = async (item) => {
    await dispatch(setTournamentDetails(item))
    navigationRef.navigate("TournamentOverviewScreen")
  }

  return (
    <ScrollView keyboardDismissMode="interactive">
      <Box bg={"white"} minH="full" flex={1} safeArea p={5} pt={2}>
        <Box w="full" display={"flex"} justifyItems={"center"}>
          <Ionicons
            name="arrow-back"
            size={24}
            color="black"
            onPress={() => navigationRef.goBack()}
          />
        </Box>
        <Box mb={4} mt={0}>
          <Text fontSize={"4xl"} bold>
            Ongoing Tournaments
          </Text>
          <Text>List of Ongoing Tournaments</Text>
        </Box>
        {ongoingtournamentData?.map((item, index) => (
          <Pressable onPress={() => handlePress(item)} key={item.id}>
            {({ isHovered, isFocused, isPressed }) => {
              return (
                <Box
                  style={{
                    transform: [
                      {
                        scale: isPressed ? 0.96 : 1
                      }
                    ]
                  }}
                  py={3}
                  px={3}
                  rounded="8"
                  borderWidth={"1"}
                  borderColor={"coolGray.300"}
                  mb={8}
                >
                  <HStack alignItems="center" justifyContent={"space-between"}>
                    <Box>
                      <Text fontSize={"xl"} bold>
                        {item.tournament_name}
                      </Text>
                      <Text>{item.venue}</Text>
                      <Text>Start Date: {item.start_date}</Text>
                      <Text>End Date: {item.end_date}</Text>
                    </Box>
                    <Spacer />
                    <Box>
                      <Ionicons
                        name={"arrow-forward"}
                        size={24}
                        color={colors.blue[600]}
                      />
                    </Box>
                  </HStack>
                </Box>
              )
            }}
          </Pressable>
        ))}

<Box mb={4} mt={0}>
          <Text fontSize={"4xl"} bold>
            Upcoming Tournaments
          </Text>
          <Text>List of Upcoming Tournaments</Text>
        </Box>
        {upcomingtournamentData?.map((item, index) => (
          <Pressable onPress={() => handlePress(item)} key={item.id}>
            {({ isHovered, isFocused, isPressed }) => {
              return (
                <Box
                  style={{
                    transform: [
                      {
                        scale: isPressed ? 0.96 : 1
                      }
                    ]
                  }}
                  py={3}
                  px={3}
                  rounded="8"
                  borderWidth={"1"}
                  borderColor={"coolGray.300"}
                  mb={8}
                >
                  <HStack alignItems="center" justifyContent={"space-between"}>
                    <Box>
                      <Text fontSize={"xl"} bold>
                        {item.tournament_name}
                      </Text>
                      <Text>{item.venue}</Text>
                      <Text>Start Date: {item.start_date}</Text>
                      <Text>End Date: {item.end_date}</Text>
                    </Box>
                    <Spacer />
                    <Box>
                      <Ionicons
                        name={"arrow-forward"}
                        size={24}
                        color={colors.blue[600]}
                      />
                    </Box>
                  </HStack>
                </Box>
              )
            }}
          </Pressable>
        ))}
        <Button
          size="lg"
          borderRadius="lg"
          // bgColor={"blue.700"}
          colorScheme={"blue"}
          my={4}
        >
          Send Code
        </Button>
      </Box>
    </ScrollView>
  )
}

export default TournamentScreen
