import { gql, useLazyQuery } from "@apollo/client"
import { Ionicons } from "@expo/vector-icons"
import dayjs from "dayjs"
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
  VStack
} from "native-base"
import React, { useEffect, useState } from "react"
import { ScrollView } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { navigationRef } from "../../../rootNavigation"
import { setPlayerDetails } from "../../../store/registerPlayerSlice"

const TournamentRegistrationScreen = () => {
  const GET_TEAMS = gql`
    query getTeams {
      teams {
        id
        team_name
      }
    }
  `

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
  query findUser($player_email: String) {
    player(where: {player_email: {_eq: $player_email}}) {
      id
      player_email
      user {
        email
      }
    }
  }
  
  `

  const dispatch = useDispatch()
  const { colors } = useTheme()
  const [service, setService] = useState("")
  const [players, setPlayers] = useState(null)
  const [modalVisible, setModalVisible] = useState(true);
  const [getTeams, { loading, data, error }] = useLazyQuery(GET_TEAMS)
  const [findUser, { loading: userLoading, data: findUserData }] = useLazyQuery(
    FIND_USER,
    {
      notifyOnNetworkStatusChange: true,
      onError: (e) => {
        console.log(e)
      }
    }
  )
  const [getTeamPlayers, { loading: playersLoading }] = useLazyQuery(
    GET_PLAYERS,
    {
      onCompleted: (data) => {
        setPlayers(
          data.player_teams.map((item) => {
            return {
              id: item.player.id,
              player_email: item.player.player_email,
              found: null
            }
          })
        )
      },
      onError: (e) => {
        console.log({ e })
      }
    }
  )

  let allowedPlayerToRegisterCount = 15
  let currenPlayerCount = players?.length
  allowedPlayerToRegisterCount = 15 - currenPlayerCount

  const handleTeamPressed = async (id) => {
    setService(id)
    getTeamPlayers({
      variables: {
        id
      }
    })
  }

  const handleAddPlayerInputField = () => {
    const id = `player_${currenPlayerCount - 1}`
    setPlayers([...players, { id, player_email: "" }])
  }

  const handleFindPlayer = async (player, index) => {
    const res = await findUser({
      variables: {
        player_email: player.player_email
      }
    })
    const returnedUser = res?.player?.users
    const returnedPlayer = res?.player?.player_email
    if (returnedPlayer && returnedUser) {
      const newPlayer = players[index]
      newPlayer.found = true
      setPlayers([...players])
    } else {
      const newPlayer = players[index]
      newPlayer.found = false
      setPlayers([...players])
    }
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
  useEffect(() => {
    getTeams()
  }, [])

  const PlayerLoadngSkeleton = () => (
    <Skeleton my="4" rounded="md" startColor="coolGray.100" />
  )
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
              endIcon: <CheckIcon color="white" size="5" />
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
              if (player.found == true) {
                founded = true
              } else if (player.found == false) {
                founded = false
              }
              console.log(founded)
              return (
                <VStack mb={6} flex="1" w="full">
                  <Text mb={1} fontWeight="bold">Player {index + 1}</Text>
                  <HStack flex="1" space={2}>
                    <Input
                      type="text"
                      flex={"1"}
                      value={player.player_email}
                      placeholder={"Add Player"}
                      borderColor={
                        founded != undefined
                          ? founded
                            ? "green.400"
                            : "red.500"
                          : "gray.300"
                      }
                      onChangeText={(text) =>
                        handlePlayerNameChange(text, index)
                      }
                      InputRightElement={
                        <Pressable
                          p={2}
                          onPress={() => removePlayer(player.id)}
                        >
                          <Ionicons name="trash-outline" size={24} />
                        </Pressable>
                      }
                    />
                    <Button
                      colorScheme={"blue"}
                      isDisabled={player?.player_email?.length < 1}
                      _disabled={{
                        bgColor: "blue.500"
                      }}
                      onPress={() => handleFindPlayer(player, index)}
                    >
                      Find
                    </Button>
                  </HStack>
                  <Box mt={1}>
                    {founded == false ? (
                      <Box>
                        <Text color="red.500" fontWeight={"bold"} mb={1}>Player not found</Text>
                        <Button colorScheme={"blue"} size="sm" w="24" onPress={() =>  handleInvitePlayer(player, index)}>Invite player</Button>
                      </Box>
                    ) : founded == true ? (
                      <Box>
                        <Text>Player found</Text>
                        
                      </Box>
                    ) : <></>}
                  </Box>
                </VStack>
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
                          scale: isPressed ? 0.96 : 1
                        }
                      ]
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
                )
              }}
            </Pressable>
          )}
        </>
      </Box>
    </ScrollView>
  )
}

export default TournamentRegistrationScreen
