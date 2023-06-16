import { gql, useLazyQuery } from "@apollo/client"
import { Ionicons } from "@expo/vector-icons"
import dayjs from "dayjs"
import {
  Box,
  Button,
  CheckIcon,
  HStack,
  Input,
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
import { useSelector } from "react-redux"

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
        }
      }
    }
  `
  const tournamentDetails = useSelector(
    (state) => state.tournament.tournamentDetails
  )
  const { colors } = useTheme()
  const [service, setService] = useState("")
  const [players, setPlayers] = useState(null)
  const [getTeams, { loading, data, error }] = useLazyQuery(GET_TEAMS)
  const [getTeamPlayers, { loading: playersLoading }] = useLazyQuery(
    GET_PLAYERS,
    {
      onCompleted: (data) => {
        setPlayers(
          data.player_teams.map((item) => {
            return { id: item.player.id, player_name: item.player.player_name }
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
    setPlayers([...players, { id, player_name: "" }])
  }

  const handleFindPlayer = (player) => {
    
  }

  const handlePlayerNameChange = (text, index) => {
    const newPlayer = players[index]
    newPlayer.player_name = text
    setPlayers([...players])
    console.log(players)
  }

  const removePlayer = (id) => {
    const removedPlayers = players.filter(item => item.id !== id)
    setPlayers(removedPlayers)
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
            players?.map((player, index) => (
              <VStack mb={6} flex="1" w="full">
                <Text mb={1}>Player {index + 1}</Text>
                <HStack flex="1" space={2}>
                <Input
                  type="text"
                  flex={"1"}
                  value={player.player_name}
                  placeholder={"Add Player"}
                  onChangeText={(text) => handlePlayerNameChange(text, index)}
                  InputRightElement={
                    <Pressable p={2} onPress={() => removePlayer(player.id)}>
                    <Ionicons name="trash-outline" size={24} />
                    </Pressable>
                  }
                />
                <Button colorScheme={"blue"} onPress={() => handleFindPlayer(player)}>Find</Button>
                </HStack>
              </VStack>
            ))
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
