import { gql, useLazyQuery } from "@apollo/client"
import {
  Box,
  Text,
  ScrollView,
  Pressable,
  HStack,
  Spacer,
  Badge,
  VStack,
  Image
} from "native-base"
import { useUserData } from "@nhost/react"
import { Ionicons } from "@expo/vector-icons"
import { navigationRef } from "../../../rootNavigation"
import { useDispatch } from "react-redux"

import { RefreshControl } from "react-native"
import { setTeamDetails } from "../../../store/teamSlice"
import { useCallback, useEffect, useState } from "react"
import GoBack from "../../components/GoBack"
const GET_TEAM = gql`
query MyQuery($where: teams_bool_exp!) {
  teams(order_by: {id: desc}, where: $where) {
    id
    team_image
    team_manager
    team_name
    status
    reason
    created_at
    players {
      id
    }
  }
}


`

const MyTeamsScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const userData = useUserData()
  const dispatch = useDispatch()
  const handlePress = async (item) => {
    console.log(item.players?.length)
    if (item.players?.length > 0) {
      navigation.navigate("Tournament", {
        screen: "PlayerScreen",
        params: {
          team: item
        }
      })
    } else {
      navigation.navigate("Tournament", {
        screen: "TeamRegistrationAddUsersScreen",
        params: {
          team: item
        }
      })
    }
    // await dispatch(setTeamDetails(item))

  }
  const variables = {}
  if (userData.defaultRole != "user") {
    variables.where = {
      team_manager: {
        _eq: userData?.email
      }
    }
  } else {
    variables.where = {
      players: {
        player_email: {
          _eq: userData?.email
        }
      }
    }
  }
  const [getTeams, { loading, data, error }] = useLazyQuery(GET_TEAM, {
    variables,
    notifyOnNetworkStatusChange: true,
    nextFetchPolicy: "network-only",
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      setRefreshing(false)
    },
    onError: (e) => {
      console.log(e)
      setRefreshing(false)
    }
  })

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
  const Teams = ({ item }) => {
    console.log(item)
    return (
      <Box>
        <Pressable onPress={() => handlePress(item)} key={item.id}>
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
                      <MyBadge status={item.status} />
                    </HStack>
                    {item.reason && <Text>Reason: {item.reason}</Text>}
                    <Text>Team Manager: {item.team_manager}</Text>
                    <Text>Created At : {item.created_at}</Text>
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
      </Box>
    )
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getTeams()
  }, []);

  useEffect(() => {
    getTeams()
  }, []);
  return (
    <ScrollView  refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }>
      <Box bg={"white"} minH="full" flex={1} safeArea p={5} pt={2}>
        <GoBack /> 
        <Box mb={4} mt={0}>
          <Text fontSize={"4xl"} bold>
            My Teams
          </Text>
          <Text>List of My Teams</Text>
        </Box>
        {loading ? (
          <Text>Loading</Text>
        ) : data?.teams?.length > 0 ? (
          data?.teams.map((item) => <Teams item={item} key={item.id}/>)
        ) : (
          <Text>No Teams found in which you are part of or manager of.</Text>
        )}
      </Box>
    </ScrollView>
  )
}

export default MyTeamsScreen
