import { Ionicons } from "@expo/vector-icons"
import { useSignOut, useUserData, useUserDisplayName } from "@nhost/react"
import {
  Box,
  Divider,
  Text,
  Image,
  Stack,
  HStack,
  Button,
  View,
  FlatList,
  ScrollView,
  Pressable,
  VStack
} from "native-base"
import React, { useEffect, useState } from "react"
import LocationLoading from "../../components/LocationLoading"
import { navigationRef } from "../../../rootNavigation"
import { gql, useLazyQuery } from "@apollo/client"
import LoaderModal from "../../components/LoaderModal"
import GoBack from "../../components/GoBack"

const GET_STATS = gql`
  query GetStats($player_email: citext!) {
    players(where: { player_email: { _eq: $player_email } }) {
      player_score
      player_wickets
      player_name
    }
  }
`

const GET_TOURNAMENT = gql`
  query MyQuery($player_email: citext!) {
    team_tournaments(
      where: {
        team_tournaments_team: {
          players: { player: { player_email: { _eq: $player_email } } }
        }
      }
    ) {
      team_tournaments_tournament {
        tournament_name
        time
        start_date
        updated_at
        venue {
          name
        }
        end_date
        description
      }
    }
  }
`

const ViewUserProfileScreen = ({navigation}) => {
  const userData = useUserData()
  const [logOutLoading, setLogOutLoading] = useState(false)
  const { signOut } = useSignOut()
  //
  const Stats = ({ item }) => {
    const role = userData?.defaultRole ?? ""
    const userName = useUserDisplayName();
    return (
      <Box mb={4}>
        <Text fontSize={"4xl"} textAlign={"center"} fontWeight="bold">
          {userName ?? ""}
        </Text>
        <Text fontSize={"4xl"} textAlign={"center"} fontWeight="bold">
          ({role.charAt(0).toUpperCase() + role.slice(1) ?? ""})
        </Text>
        <HStack justifyContent={"space-around"}>
          <VStack display="flex" justifyContent="space-around">
            <Text fontSize="30px" textAlign={"center"}>
              {item?.player_wickets ?? "0"}
            </Text>
            <Text fontSize="15px" textAlign={"center"}>
              Wickets
            </Text>
          </VStack>
          <VStack display="flex" justifyContent="space-evenly">
            <Text fontSize="30px" textAlign={"center"}>
              {item?.player_score ?? "0"}
            </Text>
            <Text fontSize="15px" textAlign={"center"}>
              Score
            </Text>
          </VStack>
        </HStack>
      </Box>
    )
  }

  const Tournaments = ({ item }) => {
    return (
      <Box padding="20px" borderRadius="lg" shadow="0">
        <Text fontSize="xl">{item?.tournament_name ?? ""}</Text>
        <Text>Time: {item?.time ?? ""}</Text>
        <Text>Start Date: {item?.start_date ?? ""}</Text>
        <Text>End Date: {item?.end_date ?? ""}</Text>
        <Text>Venue: {item?.venue?.name ?? ""}</Text>
        <Text>{item?.description ?? ""}</Text>
        <Text></Text>
      </Box>
    )
  }

  const [
    getTournament,
    { loading: tournamentloading, data: tournamentdata, error: tournamenterror }
  ] = useLazyQuery(GET_TOURNAMENT, {
    variables: {
      player_email: userData?.email
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      console.log(data?.team_tournaments)
    },
    onError: (e) => {
      console.log(e)
    }
  })
  console.log(tournamentloading)
  const [getStats, { loading, data, error }] = useLazyQuery(GET_STATS, {
    variables: {
      player_email: userData?.email
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {},
    onError: (e) => {
      console.log(e)
    }
  })
  console.log(data)

  const logOut = async () => {
    try {
      setLogOutLoading(true)
      signOut()
      navigation.reset({
        index: 0,
        routes: [{name: 'Feed'}],
      })
      setLogOutLoading(false)
    } catch (error) {
      setLogOutLoading(false)
      console.log(error)
    }
  }

  useEffect(() => {
    if (userData) {
      getTournament()
      getStats()
    }
  }, [])

  return (
    <ScrollView>
      <Box bg={"white"} minH="full" flex={1} safeArea p={5} pt={2}>
        <GoBack />
        <Box
          marginBottom="80px"
          padding="auto"
          marginTop="40px"
          display="flex"
          alignItems="center"
        >
          <Image
            size={150}
            borderRadius={100}
            source={{
              uri: userData?.avatarUrl
            }}
            alt="Alternate Text"
          />
          <Stats item={data?.players[0]} />

          <HStack space={2}>
            <Button onPress={() => navigationRef.navigate("EditProfile")}>
              Edit Profile
            </Button>
            <Button
              onPress={() => navigationRef.navigate("ViewRegisteredTeams")}
            >
              View Stats
            </Button>
            <Button onPress={() => logOut()}>Logout</Button>
          </HStack>
          <Text
            fontWeight="bold"
            fontSize="20px"
            marginTop="20px"
            marginBottom="5px"
          >
            My Tournaments
          </Text>
          <Divider my="3" />

          <Pressable>
            <FlatList
              ItemSeparatorComponent={() => (
                <Divider my={2} bgColor="transparent" />
              )}
              _contentContainerStyle={{
                padding: 1
              }}
              data={tournamentdata?.team_tournaments}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              renderItem={({ item }) => (
                <Tournaments item={item?.team_tournaments_tournament} />
              )}
            />
          </Pressable>
        </Box>
      </Box>
      <LoaderModal isLoading={logOutLoading} />
    </ScrollView>
  )
}
export default ViewUserProfileScreen
