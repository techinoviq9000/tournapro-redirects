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
import { ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { navigate, navigationRef } from "../../../rootNavigation";
import { Formik } from "formik";

const CreateTournamentScreen = () => {
  const GET_TEAMS = gql`
    query getTeams {
      teams {
        id
        team_name
      }
    }
  `;

  const GET_PLAYERS = gql`
    query getPlayers($id: Int!) {
      player_teams(where: { team_id: { _eq: $id } }) {
        player {
          id
          player_name
        }
      }
    }
  `;
  const tournamentDetails = useSelector(
    (state) => state.tournament.tournamentDetails
  );

  const [groupValue, setGroupValue] = React.useState(["Phone", "Email"]);
  const { colors } = useTheme();
  const [service, setService] = useState("");
  const [players, setPlayers] = useState(null);
  const [name, setName] = useState("");
  const [venue, setVenue] = useState("");
  const [format, setFormat] = useState("");
  const [teams, setTeams] = useState("");

  const [getTeams, { loading, data, error }] = useLazyQuery(GET_TEAMS);
  const [getTeamPlayers, { loading: playersLoading }] = useLazyQuery(
    GET_PLAYERS,
    {
      onCompleted: (data) => {
        setPlayers(
          data.player_teams.map((item) => {
            return { id: item.player.id, player_name: item.player.player_name };
          })
        );
      },
      onError: (e) => {
        console.log({ e });
      },
    }
  );

  let allowedPlayerToRegisterCount = 15;
  let currenPlayerCount = players?.length;
  allowedPlayerToRegisterCount = 15 - currenPlayerCount;

  const handleTeamPressed = async (id) => {
    setService(id);
    getTeamPlayers({
      variables: {
        id,
      },
    });
  };

  const handleAddPlayerInputField = () => {
    const id = `player_${currenPlayerCount - 1}`;
    setPlayers([...players, { id, player_name: "" }]);
  };

  const handleFindPlayer = (player) => {};

  const handlePlayerNameChange = (text, index) => {
    const newPlayer = players[index];
    newPlayer.player_name = text;
    setPlayers([...players]);
    console.log(players);
  };

  const removePlayer = (id) => {
    const removedPlayers = players.filter((item) => item.id !== id);
    setPlayers(removedPlayers);
  };
  useEffect(() => {
    getTeams();
  }, []);

  const PlayerLoadngSkeleton = () => (
    <Skeleton my="4" rounded="md" startColor="coolGray.100" />
  );
  return (
    <ScrollView>
      <Box p={6} safeArea mt={2} px={4}>
        <Box mb={4}>
          <Text fontSize={"3xl"} bold>
            Create New Tournament
          </Text>
          <Text textAling={"center"}>Enter Tournament Details</Text>
        </Box>
        <Formik
          initialValues={{
            tournament_name: "",
            venue: "",
            tournamentformat: "",
            tournamentteams: "",
          }}
          onSubmit={(values) => {
            navigationRef.navigate("TournamentDates", {
              values,
            });
            console.log(values);
          }}
        >
          {(props) => (
            <Box mb={4}>
              <Text>Tournament Name</Text>
              <Input
                variant="outline"
                placeholder=" Enter Tournament Name"
                onChangeText={props.handleChange("tournament_name")}
                value={props.values.tournament_name}
                borderColor={"gray.300"}
                borderRadius={"md"}
                keyboardType="default"
              />
              <Text marginTop={"8"}>Tournament Venues</Text>

              <Input
                placeholder="Enter Tournament Venue"
                onChangeText={props.handleChange("venue")}
                value={props.values.venue}
                borderColor={"gray.300"}
                borderRadius={"md"}
                keyboardType="default"
              />
              <Text marginTop={"8"}>Tournament Format</Text>
              <Input
                placeholder="Tournament Format"
                onChangeText={props.handleChange("tournamentformat")}
                value={props.values.tournamentformat}
                borderColor={"gray.300"}
                borderRadius={"md"}
                keyboardType="default"
              />

              <Text marginTop={"8"}>Number of Teams</Text>

              <Input
                placeholder="Enter number of teams"
                onChangeText={props.handleChange("tournamentteams")}
                value={props.values.tournamentteams}
                borderColor={"gray.300"}
                borderRadius={"md"}
                keyboardType="default"
              />
              <Button
                size="lg"
                borderRadius="lg"
                marginTop={"20"}
                colorScheme={"blue"}
                onPress={props.handleSubmit}
              >
                Next
              </Button>
              <Button
                size="lg"
                borderRadius="lg"
                marginTop={"6"}
                colorScheme={"red"}
              >
                Cancel
              </Button>
            </Box>
          )}
        </Formik>
      </Box>
    </ScrollView>
  );
};
export default CreateTournamentScreen;
