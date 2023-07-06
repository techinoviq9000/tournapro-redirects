import { useUserData, useUserDefaultRole, useUserEmail } from "@nhost/react"
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
import GoBack from "../../components/GoBack"

const GET_REGTEAMS = gql`
query MyQuery($team_manager: citext!) {
  teams(order_by: {id: desc}, where: {team_manager: {_eq: $team_manager}}) {
    id
    team_image
    team_manager
    team_name
    status
    reason
    created_at
  }
}

`

const ViewMyTeamsToRegisterScreen = () => {
  const tournamentDetails = useSelector(
    (state) => state.tournament.tournamentDetails
  )
  const tournament_id = tournamentDetails.id
  const [refreshing, setRefreshing] = useState(false)
  const userRole = useUserDefaultRole()
  const userEmail = useUserEmail()
  const [getTeams, { loading, data, error }] = useLazyQuery(GET_REGTEAMS, {
    variables: {
      team_manager: userEmail
    },
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
      if(userEmail) {
        getTeams()
      }
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
    console.log(item)
    return (
      <Pressable
        onPress={() =>
          navigationRef.navigate("TeamRegistrationAddUsersScreen", {
            team: item
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
                        uri: item?.team_image
                      }}
                      alt="Alternate Text"
                      size="xs"
                    />
                    <Text fontSize={"xl"} bold>
                      {item?.team_name}
                    </Text>
                  </HStack>
                  <HStack my={2} alignItems="center" space={2}>
                    <Text>Status: </Text>
                    <MyBadge status={item?.status} />
                  </HStack>
                  {item.reason ?? <Text>Reason: {item?.reason}</Text>}
                  <Text>
                    Team Manger: {item?.team_manager}
                  </Text>
                  <Text>
                    Created at: {item?.created_at}
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
      <GoBack /> 
        <Box display="flex">
          <VStack space={4} mb={4}>
            <Text fontSize="30px" fontWeight="bold">
              Tournament: {tournamentDetails?.tournament_name}
            </Text>
            <Text bold>List of my teams for this tournament</Text>
          </VStack>
          {loading ? (
            <Text>Loading</Text>
          ) : data?.teams.length > 0 ? (
            data?.teams.map((item) => <Regteams item={item} key={item?.teams?.id} />)
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

export default ViewMyTeamsToRegisterScreen
