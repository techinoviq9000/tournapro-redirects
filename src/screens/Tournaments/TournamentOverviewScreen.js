import { useUserDefaultRole } from "@nhost/react"
import dayjs from "dayjs"
import { Box, Button, ScrollView, Text } from "native-base"
import React from "react"
import { useSelector } from "react-redux"
import { navigationRef } from "../../../rootNavigation"

const TournamentOverviewScreen = () => {
  const tournamentDetails = useSelector(
    (state) => state.tournament.tournamentDetails
  )
  const userRole = useUserDefaultRole()
  console.log(userRole)
  console.log(tournamentDetails)
  return (
    <ScrollView flex="1">
      <Box  px={4} flex="1" safeArea mt={2}>
        <Box mb={4} flex="1" >
          <Text textAlign={"center"} fontSize={"3xl"} bold>
            {tournamentDetails.tournament_name}
          </Text>
          <Text textAlign={"center"} fontSize={"2xl"}>
            {tournamentDetails.venue}
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
        </Box>
        <Box flex="1" justifyContent={"flex-end"}>
          {userRole == "manager" && (
            <Button colorScheme={"blue"} onPress={() => navigationRef.navigate("TournamentRegistrationScreen")}>Register your team now</Button>
          )}
        </Box>
      </Box>
    </ScrollView>
  )
}

export default TournamentOverviewScreen
