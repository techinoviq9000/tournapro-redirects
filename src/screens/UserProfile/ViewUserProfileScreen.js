import { Ionicons } from "@expo/vector-icons"
import { useUserData } from "@nhost/react"
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
} from "native-base"
import React, { useEffect } from "react"
import LocationLoading from "../../components/LocationLoading"
import { navigationRef } from "../../../rootNavigation"
import { gql, useLazyQuery } from "@apollo/client"

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
        venue
        end_date
        description
      }
    }
  }
`

const ViewUserProfileScreen = () => {
  const userData = useUserData()
  //
  const Stats = ({ item }) => {
    return (
      <Box>
        <Text marginTop="0px" fontSize={"40"} fontWeight="bold">
          {item?.player_name ?? ""}
        </Text>
        <Stack>
          <HStack display="flex" justifyContent="space-around">
            <Text fontSize="30px">{item?.player_wickets ?? "0"}</Text>
            <Text fontSize="30px">{item?.player_score ?? "0"}</Text>
          </HStack>
          <HStack display="flex" justifyContent="space-evenly">
            <Text fontSize="15px">Wickets</Text>
            <Text fontSize="15px">Score</Text>
          </HStack>
        </Stack>
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
        <Text>Venue: {item?.venue ?? ""}</Text>
        <Text>{item?.description ?? ""}</Text>
        <Text></Text>
      </Box>
    )
  }

  const [
    getTournament,
    {
      loading: tournamentloading,
      data: tournamentdata,
      error: tournamenterror,
    },
  ] = useLazyQuery(GET_TOURNAMENT, {
    variables: {
      player_email: userData?.email,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      console.log(data?.team_tournaments)
    },
    onError: (e) => {
      console.log(e)
    },
  })
  console.log(tournamentloading)
  const [getStats, { loading, data, error }] = useLazyQuery(GET_STATS, {
    variables: {
      player_email: userData?.email,
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {},
    onError: (e) => {
      console.log(e)
    },
  })
  console.log(data)

  useEffect(() => {
    if (userData) {
      getTournament()
      getStats()
    }
  }, [])

  return (
    <ScrollView>
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
            uri: userData?.avatarUrl,
          }}
          alt="Alternate Text"
        />

        {/* <Box space={1} display="flex" alignItems="center">
          <Ionicons name="location-outline" size={24} color="black" />
          {LocationLoading ? (
            <LocationLoading />
            ) : errorMsg ? (
              <Text color="black">{errorMsg}</Text>
            ) : (
              <Text color="black" bold>
              {location?.country}, {location?.subregion}, {location?.region}
              </Text>
              )}
            </Box> */}
        <Stats item={data?.players[0]} />

        <Stack
          display="flex"
          flexDirection="row"
          alignItems="center"
          marginTop="20px"
          justifyContent="space-between"
        ></Stack>
        {/* <Button onPress={() => navigationRef.navigate("EditProfile")}>Edit Profile</Button>
        <Button>View Stats</Button> */}

        <Box style={{ flexDirection: "row" }}>
          <Box style={{ marginRight: 10 }}>
            <Button onPress={() => navigationRef.navigate("EditProfile")}>
              Edit Profile
            </Button>
          </Box>
          <Box>
            <Button
              onPress={() => navigationRef.navigate("ViewRegisteredTeams")}
            >
              View Stats
            </Button>
          </Box>
          <Box></Box>
          <Stack marginTop="20px" />
        </Box>
        <Text
          fontWeight="bold"
          fontSize="20px"
          marginTop="20px"
          marginBottom="5px"
        >
          My Tournaments
        </Text>
        <Divider my="3" />
        {/* <Box marginTop="20px">
        <Tournaments item={tournamentdata?.team_tournaments[0].team_tournaments_tournament}/>
        <Tournaments item={tournamentdata?.team_tournaments[1].team_tournaments_tournament}/>
        </Box>
         */}

        <Pressable>
          <FlatList
            ItemSeparatorComponent={() => (
              <Divider my={2} bgColor="transparent" />
            )}
            _contentContainerStyle={{
              padding: 1,
            }}
            data={tournamentdata?.team_tournaments}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={({ item }) => (
              <Tournaments item={item?.team_tournaments_tournament} />
            )}
          />
        </Pressable>
      </Box>
    </ScrollView>
  )
}
export default ViewUserProfileScreen
