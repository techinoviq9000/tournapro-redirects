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
import { navigate } from "../../../rootNavigation";

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
        <Box mb={4}>
          <Text>Tournament Name</Text>
          <Box>
            <Input
              variant="outline"
              placeholder="Email"
              fontSize="sm"
              color="black"
              borderColor={"gray.300"}
              borderRadius={"md"}
              keyboardType="default"
              selectionColor={colors.primary[600]}
              _focus={{
                borderColor: "gray.600",
                bgColor: "white",
              }}
            />
          </Box>
          <Box>
            <Container>
              <FormControl isValid>
                <FormControl.Label _text={{}}>
                  Tournament Venue(s)
                </FormControl.Label>

                <Checkbox.Group
                  mt="2"
                  colorScheme="green"
                  defaultValue={groupValue}
                  accessibilityLabel="Checkbox"
                  onChange={(values) => {
                    setGroupValue(values || []);
                  }}
                  alignItems="flex-start"
                >
                  <Checkbox value="Insportz" my="1">
                    Insportz
                  </Checkbox>
                  <Checkbox value="Danube" my="2">
                    Danube
                  </Checkbox>
                  <Checkbox value="" my="3">
                    U Pro
                  </Checkbox>
                </Checkbox.Group>
              </FormControl>
            </Container>
          </Box>
          <Text>Tournament Format</Text>
          <Select
            selectedValue={service}
            minWidth="200"
            accessibilityLabel="Choose Service"
            placeholder="Format"
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />,
            }}
            mt={1}
            onValueChange={(itemValue) => setService(itemValue)}
          >
            <Select.Item label="Round Robin" value="rr" />
            <Select.Item label="Double Round Robin" value="drr" />
            <Select.Item label="Group Format" value="gf" />
          </Select>
          <VStack>
            <Text>Number of Teams</Text>
            <Select
              selectedValue={service}
              minWidth="200"
              accessibilityLabel="Choose Service"
              placeholder="Teams"
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size="5" />,
              }}
              mt={1}
              onValueChange={(itemValue) => setService(itemValue)}
            >
              <Select.Item label="4" value="four" />
              <Select.Item label="6" value="six" />
              <Select.Item label="8" value="eight" />
              <Select.Item label="10" value="ten" />
              <Select.Item label="12" value="twelve" />
              <Select.Item label="16" value="sixteen" />
            </Select>
          </VStack>
        </Box>
        <Box>
          <Button
            size="lg"
            borderRadius="lg"
            // bgColor={"blue.700"}
            colorScheme={"blue"}
            my={4}
            onPress={() => navigate("TournamentDates")}
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

export default CreateTournamentScreen;
