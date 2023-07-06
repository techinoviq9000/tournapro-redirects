import { gql, useLazyQuery, useMutation } from "@apollo/client"
import { useUserData } from "@nhost/react"
import { Box, Input, ScrollView, Stack, Text } from "native-base"
import React, { useCallback, useEffect, useState } from "react"
import { Alert, Button, RefreshControl, StyleSheet } from "react-native"
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

const PlayerScreen = ({ route }) => {
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
            }
          })
          setTimeout(() => {
            navigationRef.goBack()
          }, 1000);
        } else {
          toast.show({
            render: () => {
              return (
                <Box bg="green.500" px="2" py="1" rounded="sm" mb={5}>
                  <Text color="white">Team has been rejected!</Text>
                </Box>
              )
            }
          })
          setTimeout(() => {
            navigationRef.goBack()
          }, 1000);
        }
        console.log(data)
      },
      onError: (e) => {
        console.log(e)
      }
    }
  )

  const [getTeamPlayers, { data, loading: playersLoading, error }] =
    useLazyQuery(GET_TEAM_PLAYERS, {
      variables: {
        team_id
      },
      onCompleted: (data) => {
        setRefreshing(false)
        console.log(data)
      },
      onError: (e) => {
        console.log(e)
      }
    })

  const handleRejectTeamPressed = (status, reason) => {
    updateStatus({
      variables: {
        status,
        id: team_id,
        reason
      }
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
      <Box>
        <Box
          marginTop="20px"
          display="flex"
          borderRadius="15px"
          padding="20px"
          borderWidth="1px"
          borderStyle="solid"
          borderColor="black"
        >
          <Text>{item?.player?.player_name}</Text>
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
            handleRejectTeamPressed("Rejected", "Rules not followed")
        },
        {
          text: "Inadequate Behaviour",
          onPress: () =>
            handleRejectTeamPressed("Rejected", "Inadequate Behaviour")
        },
        {
          text: "Less Participants",
          onPress: () =>
            handleRejectTeamPressed("Rejected", "Less Participants")
        }
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
        <GoBack />
        <Box mb={4} mt={0}>
          <Text fontSize={"4xl"} bold>
            Team Players
          </Text>
          <Text>Players for Tournament</Text>
          <Text>{team?.team_name}</Text>
        </Box>

        {data && data?.player_teams?.length > 0 ? (
          data?.player_teams.map((item) => <TeamPlayer item={item} />)
        ) : (
          <Text>No players</Text>
        )}
        <Stack marginTop="20px" />

        <SafeAreaView>
          <Box
            style={StyleSheet.container}
            marginTop="20px"
            display="flex"
            flexDirection="row"
            justifyContent="space-evenly"
          >
            {status != "Approved" && (
              <Button
                title="Approve"
                onPress={() => handleRejectTeamPressed("Approved", null)}
              />
            )}
            <Button title="Reject" onPress={simpleAlert} />
          </Box>
        </SafeAreaView>
      </Box>
      <LoaderModal isLoading={playersLoading || updateStatusLoading} />
    </ScrollView>
  )
}

export default PlayerScreen
