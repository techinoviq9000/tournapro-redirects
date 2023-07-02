import { gql, useLazyQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import {
  Box,
  Button,
  CheckIcon,
  FormControl,
  HStack,
  Input,
  Modal,
  Pressable,
  Select,
  Skeleton,
  Spacer,
  Text,
  useTheme,
  VStack,
} from "native-base"
import React, { useEffect, useState } from "react"
import { ScrollView } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { navigationRef } from "../../../rootNavigation"
import { setPlayerDetails } from "../../../store/registerPlayerSlice"
import LoaderModal from "../../components/LoaderModal"


const TournamentRegistrationScreen = () => {
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
          player_email
        }
      }
    }
  `
  const FIND_USER = gql`
    query findUser($player_email: citext!) {
      players(where: { player_email: { _eq: $player_email } }) {
        id
        player_email
        user {
          email
          emailVerified
        }
      }
    }
  `

  const dispatch = useDispatch()
  const { colors } = useTheme()
  const [service, setService] = useState("")
  const [players, setPlayers] = useState(null)
  const [findUserLoading, setFindUserLoading] = useState(false)
  const [errors, setErrors] = useState([])
  const [getTeams, { loading, data, error }] = useLazyQuery(GET_TEAMS)
  const [findUser] = useLazyQuery(FIND_USER, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    nextFetchPolicy: "network-only",
    onCompleted: (data) => {
      console.log(data, "data")
    },
    onError: (e) => {
      console.log(e)
    },
  })
  const [getTeamPlayers, { loading: playersLoading }] = useLazyQuery(
    GET_PLAYERS,
    {
      onCompleted: (data) => {
        setPlayers(
          data.player_teams.map((item) => {
            return {
              id: item.player.id,
              player_email: item.player.player_email,
              found: null,
              userVerified: null,
            }
          })
        );
      },
      onError: (e) => {
        console.log({ e })
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
    })
  }

  console.log(players)
  const handleAddPlayerInputField = () => {
    const id = `player_${currenPlayerCount - 1}`
    setPlayers([...players, { id, player_email: "" }])
  }

  const handleFindPlayer = async (player, index) => {
    setFindUserLoading(true)
    console.log(player?.player_email, "player_email")
    //search for player in players table
    const res = await findUser({
      variables: {
        player_email: player.player_email, //find by player email
      },
    })
    const data = res?.data?.players?.[0]
    const returnedUserVerified = data?.user?.emailVerified //return user of the current player
    const returnedPlayer = data?.player_email //return player

    if (returnedPlayer) {
      //if player exists
      console.log({ returnedPlayer })
      console.log({ returnedUserVerified })
      const newPlayer = players[index]
      newPlayer.found = true //set variable found = true for the player inside the input field for which we just clicked "find"
      setPlayers([...players])
      if (returnedUserVerified) {
        //if user exists
        const newPlayer = players[index]
        newPlayer.userVerified = true //set verified user true
        setPlayers([...players])
      } else {
        const newPlayer = players[index]
        newPlayer.userVerified = false //set veririfed user false
        setPlayers([...players])
      }
    } else {
      const newPlayer = players[index]
      newPlayer.found = false //set variable found = false for the player inside the input field for which we just clicked "find"
      setPlayers([...players])
    }
    setFindUserLoading(false)
  }

  const handlePlayerNameChange = (text, index) => {
    const newPlayer = players[index]
    newPlayer.player_email = text
    setPlayers([...players])
    console.log(players)
  }

  const removePlayer = (id) => {
    const removedPlayers = players.filter((item) => item.id !== id)
    setPlayers(removedPlayers)
  }

  const handleInvitePlayer = (player, index) => {
    dispatch(setPlayerDetails(player))
    const newPlayer = players[index]
    newPlayer.found = undefined
    setPlayers([...players])
    navigationRef.navigate("RegisterUserForTeamScreen")
  }

  const handleSubmit = async () => {
    for (let index = 0; index < players.length; index++) {
      const player = players[index];
      if (player.player_email == "") {
        setErrors([...errors, {id: player.id, error: "Invalid Email"}])
      }
      if (player?.player_email != "" && player?.found == undefined) {
        await handleFindPlayer(player, index)
      }
      
    }
  }
  useEffect(() => {
    getTeams();
  }, []);

  const PlayerInputBox = ({ player, index, founded, userVerified }) => {
    const [currentValue, setCurrentValue] = useState(player.player_email);
    let borderColor = "gray.300";
    if (!userVerified) { //user is not verifed
      if (founded) {
        borderColor = "orange.400";
      } else if(founded == false) {
        borderColor = "red.400"
      } else {
        borderColor = "gray.300";
      }
    } else { //user is verifed
        borderColor = "green.400"
    }
    return (
      <VStack mb={4} flex="1" w="full">
        <Text mb={1} fontWeight="bold">
          Player {index + 1}
        </Text>
        <HStack flex="1" space={2}>
          <Input
            type="text"
            flex={"1"}
            value={currentValue}
            autoCapitalize="none"
            placeholder={"Player email"}
            borderColor={
              borderColor
            }
            onChangeText={(text) => setCurrentValue(text.trim())}
            onEndEditing={() => handlePlayerNameChange(currentValue, index)}
            // onChangeText={(text) => handlePlayerNameChange(text, index)}
            InputRightElement={
              <Pressable p={2} onPress={() => removePlayer(player.id)}>
                <Ionicons name="trash-outline" size={24} />
              </Pressable>
            }
          />
          <Button
            colorScheme={"blue"}
            isDisabled={player?.player_email?.length < 1}
            _disabled={{
              bgColor: "blue.500",
            }}
            onPress={() => handleFindPlayer(player, index)}
          >
            Find
          </Button>
        </HStack>
        <PlayerExistence
          player={player}
          index={index}
          founded={founded}
          userVerified={userVerified}
        />
      </VStack>
    )
  }

  const PlayerExistence = ({ player, index, founded, userVerified }) => {
    if (founded) {
      if (userVerified) {
        return (
          <Box mt={"1.5"}>
            <Text color="green.400" fontWeight={"bold"}>
              Player found
            </Text>
          </Box>
        )
      } else {
        return (
          <Box mt={"1.5"}>
            <Text color="orange.400" fontWeight={"bold"}>
              Player not verified
            </Text>
          </Box>
        )
      }
    } else if (founded == false) {
      return (
        <Box mt={"1.5"}>
          <Text color="red.400" fontWeight={"bold"} mb={1}>
            Player not found
          </Text>
          <Button
            colorScheme={"blue"}
            size="sm"
            w="24"
            onPress={() => handleInvitePlayer(player, index)}
          >
            Invite player
          </Button>
        </Box>
      )
    }
  }
  const PlayerLoadngSkeleton = () => (
    <Skeleton my="4" rounded="md" startColor="coolGray.100" />
  );
  return (
    <ScrollView>
      <Box safeArea mt={2} px={4}>
        <Box mb={4}>
          <Text fontSize={"3xl"} bold>
            Register Your Team
          </Text>
          <Text textAling={"center"}>
            Upto 15 players and minium 12 players can be selected
          </Text>
        </Box>
        <Box mb={4}>
          <Text>Select team</Text>
          <Select
            selectedValue={service}
            minWidth="200"
            accessibilityLabel="Select Team"
            placeholder="Select Team"
            _selectedItem={{
              bg: "blue.200",
              endIcon: <CheckIcon color="white" size="5" />,
            }}
            mt={1}
            onValueChange={(itemId) => handleTeamPressed(itemId)}
          >
            {data?.teams.map((item) => (
              <Select.Item
                key={item.id}
                label={item.team_name}
                value={item.id}
              />
            ))}
          </Select>
        </Box>
        <>
          {playersLoading ? (
            <PlayerLoadngSkeleton />
          ) : (
            players?.map((player, index) => {
              let founded = undefined
              let userVerified = undefined
              if (player.found == true) {
                founded = true
              } else if (player.found == false) {
                founded = false
              }
              if (player.userVerified == true) {
                userVerified = true
              } else if (player.userVerified == false) {
                userVerified = false
              }
              return (
                <PlayerInputBox
                  player={player}
                  index={index}
                  founded={founded}
                  userVerified={userVerified}
                />
              )
            })
          )}
          {allowedPlayerToRegisterCount > 0 && (
            <Pressable
              w="1/3"
              alignSelf={"center"}
              onPress={() => handleAddPlayerInputField()}
            >
              {({ isHovered, isFocused, isPressed }) => {
                return (
                  <Box
                    style={{
                      transform: [
                        {
                          scale: isPressed ? 0.96 : 1,
                        },
                      ],
                    }}
                    py={3}
                    px={3}
                    rounded="8"
                    mb={8}
                    bgColor="blue.500"
                  >
                    <HStack
                      alignItems="center"
                      justifyContent={"space-between"}
                    >
                      <Ionicons name="add-circle" size={24} color="white" />
                      {/* <Spacer /> */}
                      <Text bold color="white">
                        Add Player
                      </Text>
                    </HStack>
                  </Box>
                );
              }}
            </Pressable>
          )}
            {currenPlayerCount >= 2 && (
            <Pressable
              w="1/3"
              alignSelf={"center"}
              onPress={() => handleSubmit()}
            >
              {({ isHovered, isFocused, isPressed }) => {
                return (
                  <Box
                    style={{
                      transform: [
                        {
                          scale: isPressed ? 0.96 : 1,
                        },
                      ],
                    }}
                    py={3}
                    px={3}
                    rounded="8"
                    mb={8}
                    bgColor="blue.500"
                  >
                    <HStack
                      alignItems="center"
                      justifyContent={"space-between"}
                    >
                      <Ionicons name="tennisball-outline" size={24} color="white" />
                      {/* <Spacer /> */}
                      <Text bold color="white">
                        Submit Team
                      </Text>
                    </HStack>
                  </Box>
                )
              }}
            </Pressable>
          )}
        </>
      </Box>
      <LoaderModal isLoading={findUserLoading || loading} />
    </ScrollView>
  );
};

export default TournamentRegistrationScreen;
