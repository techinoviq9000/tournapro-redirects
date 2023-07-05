import { useUserDefaultRole, useUserEmail } from "@nhost/react";
import dayjs from "dayjs";
import { Box, Button, ScrollView, Stack, Text } from "native-base";
import React from "react";
import { useSelector } from "react-redux";
import { navigationRef } from "../../../rootNavigation";

const TournamentOverviewScreen = () => {
  const tournamentDetails = useSelector(
    (state) => state.tournament.tournamentDetails
  );
  const userRole = useUserDefaultRole();
  const userEmail = useUserEmail();
  console.log(userRole);
  console.log(tournamentDetails);
  return (
    <ScrollView flex="1">
      <Box px={4} flex="1" safeArea mt={2}>
        <Box mb={4} flex="1">
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
          <Text textAlign={"center"} fontSize={"2xl"}>
            {tournamentDetails.status}
          </Text>
        </Box>

        <Box flex="1" justifyContent={"flex-end"} marginTop="5">
          {userRole == "manager" && (
            <Button
              height="50px"
              colorScheme={"blue"}
              onPress={() =>
                navigationRef.navigate("ViewRegisteredTeamsScreen")
              }
            >
              View Registered Teams
            </Button>
          )}
        </Box>

        <Box flex="1" justifyContent={"flex-end"} marginTop="7">
          {userRole == "manager" && (
            <Button
              height="50px"
              colorScheme={"blue"}
              onPress={() =>
                navigationRef.navigate("TournamentRegistrationScreen")
              }
            >
              Tournament Rules
            </Button>
          )}
        </Box>

        <Box flex="1" justifyContent={"flex-end"} marginTop="7">
          {userRole == "manager" && (
            <Button
              height="50px"
              colorScheme={"blue"}
              onPress={() =>
                navigationRef.navigate("TournamentRegistrationScreen")
              }
            >
              Fixture
            </Button>
          )}
        </Box>

        <Box flex="1" justifyContent={"flex-end"} marginTop="7">
          {userRole == "manager" && (
            <Button
              height="50px"
              colorScheme={"blue"}
              onPress={() =>
                navigationRef.navigate("TournamentRegistrationScreen")
              }
            >
              Register my Team
            </Button>
          )}
        </Box>

        <Box flex="1" justifyContent={"flex-end"} marginTop="7">
          {userRole == "user" && (
            <Button
              height="50px"
              colorScheme={"blue"}
              onPress={() =>
                navigationRef.navigate("TournamentRegistrationScreen")
              }
            >
              Tournament Rules
            </Button>
          )}
        </Box>

        <Box flex="1" justifyContent={"flex-end"} marginTop="7">
          {userRole == "user" && (
            <Button
              height="50px"
              colorScheme={"blue"}
              onPress={() =>
                navigationRef.navigate("TournamentRegistrationScreen")
              }
            >
              Fixtures
            </Button>
          )}
        </Box>

        <Box flex="1" justifyContent={"flex-end"} marginTop="7">
          {userRole == "user" && (
            <Button
              height="50px"
              colorScheme={"blue"}
              onPress={() =>
                navigationRef.navigate("TournamentRegistrationScreen")
              }
            >
              View Registered Teams
            </Button>
          )}
        </Box>

        <Box flex="1" justifyContent={"flex-end"} marginTop="7">
          {userRole == "organizer" && (
            <Button
              height="50px"
              colorScheme={"blue"}
              onPress={() =>
                navigationRef.navigate("TournamentRegistrationScreen")
              }
            >
              Tournament Rules
            </Button>
          )}
        </Box>

        <Box flex="1" justifyContent={"flex-end"} marginTop="7">
          {userRole == "organizer" && (
            <Button
              height="50px"
              colorScheme={"blue"}
              onPress={() =>
                navigationRef.navigate("TournamentRegistrationScreen")
              }
            >
              Tournament Rules
            </Button>
          )}
        </Box>

        <Box flex="1" justifyContent={"flex-end"} marginTop="7">
          {userRole == "organizer" && (
            <Button
              height="50px"
              colorScheme={"blue"}
              onPress={() =>
                navigationRef.navigate("TournamentRegistrationScreen")
              }
            >
              Fixtures
            </Button>
          )}
        </Box>

        <Box flex="1" justifyContent={"flex-end"} marginTop="7">
          {userRole == "organizer" && (
            <Button
              height="50px"
              colorScheme={"blue"}
              onPress={() =>
                navigationRef.navigate("ViewRegisteredTeamsScreen")
              }
            >
              View Registered Team
            </Button>
          )}
        </Box>

        <Box flex="1" justifyContent={"flex-end"} marginTop="7">
          {userRole == "organizer" && (
            <Button
              height="50px"
              colorScheme={"blue"}
              onPress={() =>
                navigationRef.navigate("TournamentRegistrationScreen")
              }
            >
              Registered my Team
            </Button>
          )}
        </Box>

        <Box flex="1" justifyContent={"flex-end"} marginTop="7">
          {userRole == "organizer" && (
            <Button
              height="50px"
              colorScheme={"blue"}
              onPress={() =>
                navigationRef.navigate("TournamentRegistrationScreen")
              }
            >
              Edit Tournament
            </Button>
          )}
        </Box>

        <Box flex="1" justifyContent={"flex-end"} marginTop="7">
          {tournamentDetails?.created_by == userEmail &&
            userRole == "organizer" && (
              <Button
                height="50px"
                colorScheme={"blue"}
                onPress={
                  () => alert("Tournament Published")
                  //navigationRef.navigate("ViewRegisteredTeamsScreen")
                }
              >
                Publish Tournament
              </Button>
            )}
        </Box>

        <Box flex="1" justifyContent={"flex-end"} marginTop="7">
          {userRole == "organizer" && (
            <Button
              height="50px"
              colorScheme={"blue"}
              onPress={() =>
                navigationRef.navigate("TournamentRegistrationScreen")
              }
            >
              Pending Tournaments
            </Button>
          )}
        </Box>
      </Box>
    </ScrollView>
  );
};

export default TournamentOverviewScreen;
