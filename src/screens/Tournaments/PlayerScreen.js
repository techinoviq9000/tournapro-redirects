import { gql, useLazyQuery, useMutation } from "@apollo/client"
import { useUserData } from "@nhost/react"
import { Box, Button, ScrollView, Stack, Text, VStack } from "native-base"
import React, { useCallback, useEffect, useState } from "react"
import { Alert, RefreshControl, StyleSheet } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { navigationRef } from "../../../rootNavigation"
import GoBack from "../../components/GoBack"
import { useToast } from "native-base"
import LoaderModal from "../../components/LoaderModal"

const GET_TEAM_PLAYERS = gql`
  query GetTeamPlayers($team_id: Int!) {
    player_teams(where: { team_id: { _eq: $team_id } }) {
      player {
        player_name
        player_email
      }
    }
  }
`

const ADD_STATUS_REASON = gql`
  mutation MyMutation($id: Int!, $status: String!, $reason: String) {
    update_teams_by_pk(
      pk_columns: { id: $id }
      _set: { status: $status, reason: $reason }
    ) {
      id
      status
    }
  }
`

const PlayerScreen = ({ route,navigation }) => {
  const team = route?.params?.team
  const team_id = team.id
  const status = team.status
  const [refreshing, setRefreshing] = useState(false)
  const userData = useUserData()
  const toast = useToast()
  const [updateStatus, { loading: updateStatusLoading }] = useMutation(
    ADD_STATUS_REASON,
    {
      onCompleted: (data) => {
        if (data?.update_teams_by_pk.status == "Approved") {
          toast.show({
            render: () => {
              return (
                <Box bg="green.500" px="2" py="1" rounded="sm" mb={5}>
                  <Text color="white">Team has been approved!</Text>
                </Box>
              )
            },
          })
          setTimeout(() => {
            navigationRef.goBack()
          }, 1000)
        } else {
          toast.show({
            render: () => {
              return (
                <Box bg="green.500" px="2" py="1" rounded="sm" mb={5}>
                  <Text color="white">Team has been rejected!</Text>
                </Box>
              )
            },
          })
          setTimeout(() => {
            navigationRef.goBack()
          }, 1000)
        }
        console.log(data)
      },
      onError: (e) => {
        console.log(e)
      },
    }
  )

  const [getTeamPlayers, { data, loading: playersLoading, error }] =
    useLazyQuery(GET_TEAM_PLAYERS, {
      notifyOnNetworkStatusChange: true,
      nextFetchPolicy: "network-only",
      fetchPolicy: "network-only",
      variables: {
        team_id,
      },
      onCompleted: (data) => {
        setRefreshing(false)
        console.log(data)
      },
      onError: (e) => {
        console.log(e)
      },
    })

  const handleRejectTeamPressed = (status, reason) => {
    updateStatus({
      variables: {
        status,
        id: team_id,
        reason,
      },
    })
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    getTeamPlayers()
  }, [])

  useEffect(() => {
    if (userData) {
      getTeamPlayers()
    }
  }, [])

  const TeamPlayer = ({ item }) => {
    return (
      <Box mb={4}>
        <Box
          borderRadius={"md"}
          borderWidth={"1"}
          borderColor={"gray.400"}
          p={4}
        >
          <Text>Player Name: {item?.player?.player_name}</Text>
          <Text>Player Email: {item?.player?.player_email}</Text>
        </Box>
      </Box>
    )
  }

  const simpleAlert = () => {
    Alert.alert(
      "Select the following reasons for team rejection",

      "",
      [
        {
          text: "Rules not followed",
          onPress: () =>
            handleRejectTeamPressed("Rejected", "Rules not followed"),
        },
        {
          text: "Inadequate Behaviour",
          onPress: () =>
            handleRejectTeamPressed("Rejected", "Inadequate Behaviour"),
        },
        {
          text: "Less Participants",
          onPress: () =>
            handleRejectTeamPressed("Rejected", "Less Participants"),
        },
      ]
    )
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Box bg={"white"} minH="full" flex={1} safeArea p={5} pt={2}>
      <GoBack customOnPress={() => navigation.reset({
              index: 0,
              routes: [{name: 'SelectOrViewTournamentScreen'}],
            })} />
        <Box mb={4} mt={0}>
          <Text fontSize={"4xl"} bold>
            Team Players
          </Text>
          <Text>Players for Tournament</Text>
          <Text fontSize={"4xl"} bold>
            {team?.team_name} ({team?.status})
          </Text>
        </Box>

        {data && data?.player_teams?.length > 0 ? (
          data?.player_teams.map((item) => <TeamPlayer item={item} />)
        ) : (
          <Box mb={4}><Text bold fontSize={"lg"}>No players</Text></Box>
        )}
        {userData?.defaultRole == "organizer" && (
          <VStack space={4}>
            {status != "Approved" && (
              <Button
                colorScheme={"blue"} borderRadius={"lg"} size="lg"
                onPress={() => handleRejectTeamPressed("Approved", null)}
              >Approve</Button>
            )}
            {status != "Rejected" && <Button colorScheme={"blue"} borderRadius={"lg"} size="lg" onPress={simpleAlert}>Reject</Button>}
          </VStack>
        )}
      </Box>
      <LoaderModal isLoading={playersLoading || updateStatusLoading} />
    </ScrollView>
  )
}

export default PlayerScreen
