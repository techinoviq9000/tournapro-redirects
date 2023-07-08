import { useUserDefaultRole, useUserEmail } from "@nhost/react"
import dayjs from "dayjs"
import { Box, Button, ScrollView, Stack, Text } from "native-base"
import React from "react"
import { useSelector } from "react-redux"
import { navigationRef } from "../../../rootNavigation"
import GoBack from "../../components/GoBack"

const TournamentOverviewScreen = ({navigation}) => {
  const tournamentDetails = useSelector(
    (state) => state.tournament.tournamentDetails
  )
  const userRole = useUserDefaultRole()
  const user_manager = [
    {
      onPress: () => {
        navigationRef.navigate("ViewRegisteredTeamsScreen")
      },
      text: "View Teams"
    },
    {
      onPress: () => {
        // navigationRef.navigate("TournamentRegistrationScreen")
      },
      text: "Tournament Rules"
    },
    {
      onPress: () => {
        navigationRef.navigate("TeamRegistrationScreen")
      },
      text: "Register my Team"
    },
    {
      onPress: () => {
        // navigationRef.navigate("TournamentRegistrationScreen")
      },
      text: "Fixture"
    }
  ]

  const user_user = [
    {
      onPress: () => {
        // navigationRef.navigate("TournamentRegistrationScreen")
      },
      text: "Tournament Rules"
    },
    {
      onPress: () => {
        // navigationRef.navigate("TournamentRegistrationScreen")
      },
      text: "Fixtures"
    },
    {
      onPress: () => {
        navigationRef.navigate("ViewRegisteredTeamsScreen")
      },
      text: "View Teams"
    }
  ]

  const user_organizer = [
    {
      onPress: () => {
        navigationRef.navigate("PublishTournamentScreen", {
          tournament: tournamentDetails
        })
      },
      text: "Publish Tournament"
    },
    {
      onPress: () => {
        // navigationRef.navigate("TournamentRegistrationScreen")
      },
      text: "Tournament Rules"
    },
    {
      onPress: () => {
        // navigationRef.navigate("TournamentRegistrationScreen")
      },
      text: "Fixtures"
    },
    {
      onPress: () => {
        navigationRef.navigate("ViewRegisteredTeamsScreen")
      },
      text: "View Teams"
    },
    {
      onPress: () => {
        navigationRef.navigate("TeamRegistrationScreen")
      },
      text: "Register my Team"
    },
    {
      onPress: () => {
        // navigationRef.navigate("TournamentRegistrationScreen")
      },
      text: "Edit Tournament"
    }
  ]
  return (
    <ScrollView flex="1">
      <Box px={4} flex="1" safeArea mt={2}>
        <GoBack customOnPress={() => navigation.reset({
              index: 0,
              routes: [{name: 'SelectOrViewTournamentScreen'}],
            })} />
        <Box mb={4} flex="1">
          <Text textAlign={"center"} fontSize={"3xl"} bold>
            {tournamentDetails.tournament_name}
          </Text>
          <Text textAlign={"center"} fontSize={"2xl"}>
            {tournamentDetails.venue?.name}
          </Text>
          <Text textAlign={"center"} fontSize={"lg"}>
            {dayjs(tournamentDetails.start_date).format("dddd DD MMMM")}
          </Text>
          <Text textAlign={"center"} fontSize={"lg"}>
            to
          </Text>
          <Text textAlign={"center"} fontSize={"lg"}>
            {dayjs(tournamentDetails.end_date).format("dddd DD MMMM")}
          </Text>
          <Text textAlign={"center"} fontSize={"2xl"}>
            {tournamentDetails.status}
          </Text>
        </Box>
        {userRole == "user" &&
          user_user.map((item, index) => (
            <Button mb={5} py={3} colorScheme={"blue"} onPress={item.onPress} key={index}>
              {item.text}
            </Button>
          ))}
           {userRole == "manager" &&
          user_manager.map((item, index) => (
            <Button mb={5} py={3} colorScheme={"blue"} onPress={item.onPress} key={index}>
              {item.text}
            </Button>
          ))}
           {userRole == "organizer" &&
          user_organizer.map((item, index) => (
            <Button mb={5} py={3} colorScheme={"blue"} onPress={item.onPress} key={index}>
              {item.text}
            </Button>
          ))}
      </Box>
    </ScrollView>
  )
}

export default TournamentOverviewScreen
