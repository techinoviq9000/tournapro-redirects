import { useUserData, useUserDefaultRole } from "@nhost/react"
import { Ionicons } from "@expo/vector-icons"
import {
  Box,
  Button,
  HStack,
  ScrollView,
  Stack,
  Text,
  Image,
  Pressable,
  Spacer,
  VStack,
  Badge
} from "native-base"
import React, { useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { navigationRef } from "../../../rootNavigation"
import { gql, useLazyQuery, useQuery } from "@apollo/client"
import { MaterialIcons } from "@expo/vector-icons"
import { LogBox, RefreshControl } from "react-native"
import { useFocusEffect } from "@react-navigation/native"

const GET_REGTEAMS = gql`
  query RegTeams($where: team_tournaments_bool_exp!) {
    team_tournaments(where: $where) {
      team_tournaments_team {
        id
        team_name
        team_image
        status
        reason
        team_manager
        created_at
      }
    }
  }
`

const ViewRegisteredTeamsScreen = () => {
  const tournamentDetails = useSelector(
    (state) => state.tournament.tournamentDetails
  )
  console.log(tournamentDetails)
  const tournament_id = tournamentDetails.id
  const [refreshing, setRefreshing] = useState(false)
  const userRole = useUserDefaultRole()
  let variables = {}
  if (userRole == "manager") {
    variables.where = {
      tournament_id: { _eq: tournament_id },
      team_tournaments_team: { status: { _eq: "Approved" } }
    }
  }
  if (userRole == "organizer") {
    variables.where = { tournament_id: { _eq: tournament_id } }
  }
  const [getTeams, { loading, data, error }] = useLazyQuery(GET_REGTEAMS, {
    variables,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      setRefreshing(false)
    },
    onError: (e) => {
      console.log(e)
    }
  })

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    getTeams()
  }, [])

  useFocusEffect(
    useCallback(() => {
      getTeams()
    }, [])
  )

  // console.log(data);
  const MyBadge = ({ status }) => {
    let colorScheme = ""
    switch (status) {
      case "Pending":
        colorScheme = "warning"
        break
      case "Approved":
        colorScheme = "success"
        break
      case "Rejected":
        colorScheme = "error"
        break
      default:
        break
    }
    return (
      <Badge colorScheme={colorScheme} alignSelf="center" variant={"outline"}>
        {status}
      </Badge>
    )
  }

  const Regteams = ({ item }) => {
    return (
      <Pressable
        onPress={() =>
          navigationRef.navigate("PlayerScreen", {
            team: item?.team_tournaments_team
          })
        }
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
              borderWidth={"1"}
              borderColor={"coolGray.300"}
              mb={8}
            >
              <HStack alignItems="center" justifyContent={"space-between"}>
                <VStack>
                  <HStack space={4} alignItems="center">
                    <Image
                      display="flex"
                      flexDirection="row"
                      borderRadius="10px"
                      source={{
                        uri: item?.team_tournaments_team?.team_image
                      }}
                      alt="Alternate Text"
                      size="xs"
                    />
                    <Text fontSize={"xl"} bold>
                      {item?.team_tournaments_team?.team_name}
                    </Text>
                  </HStack>
                  <HStack my={2} alignItems="center" space={2}>
                    <Text>Status: </Text>
                    <MyBadge status={item?.team_tournaments_team?.status} />
                  </HStack>
                  {item.reason ?? <Text>Reason: {item?.team_tournaments_team?.reason}</Text>}
                  <Text>
                    Team Manger: {item?.team_tournaments_team?.team_manager}
                  </Text>
                  <Text>
                    Created at: {item?.team_tournaments_team?.created_at}
                  </Text>
                </VStack>
                <Spacer />
                <Box>
                  <Ionicons name={"arrow-forward"} size={24} />
                </Box>
              </HStack>
            </Box>
          )
        }}
      </Pressable>
    )
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Box bg={"white"} minH="full" flex={1} safeArea p={5} pt={2}>
        <Box>
          <Ionicons
            name="arrow-back"
            size={24}
            color="black"
            onPress={() => navigationRef.goBack()}
          />
        </Box>
        <Box display="flex">
          <VStack space={4} mb={4}>
            <Text fontSize="30px" fontWeight="bold">
              Tournament: {tournamentDetails?.tournament_name}
            </Text>
            <Text bold>List of Registered Teams</Text>
          </VStack>
          {loading ? (
            <Text>Loading</Text>
          ) : data?.team_tournaments.length > 0 ? (
            data?.team_tournaments.map((item) => <Regteams item={item} key={item.team_tournaments_team.id} />)
          ) : (
            <Box>
              <Text bold>No Teams are registered yet!</Text>

              {userRole == "manager" && (
                <Box flex="1" justifyContent={"flex-end"} marginTop="7">
                  <Button
                    height="50px"
                    colorScheme={"blue"}
                    onPress={() =>
                      navigationRef.navigate("TournamentRegistrationScreen")
                    }
                  >
                    Register my Team
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </ScrollView>
  )
}

export default ViewRegisteredTeamsScreen
