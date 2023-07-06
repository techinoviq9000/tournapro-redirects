import { gql, useLazyQuery, useMutation } from "@apollo/client"
import { useUserData } from "@nhost/react"
import { Box, Input, ScrollView, Stack, Text } from "native-base"
import React, { useCallback, useEffect, useState } from "react"
import { Alert, Button, StyleSheet } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { navigationRef } from "../../../rootNavigation"
import GoBack from "../../components/GoBack"
import { useToast } from "native-base"
import LoaderModal from "../../components/LoaderModal"

const PUBLISH_TOURNAMENT = gql`
mutation publishTournmanet($id: Int!, $status: Boolean!) {
  update_tournaments_by_pk(pk_columns: {id: $id}, _set: {status: $status}) {
    id
    status
  }
}

`

const PublishTournamentScreen = ({ route }) => {
  const tournament = route?.params?.tournament
  const tournament_id = tournament.id
  const status = tournament.status
  const toast = useToast()
  const [publishTournament, { loading: publishTournamentLoading }] = useMutation(
    PUBLISH_TOURNAMENT,
    {
      onCompleted: (data) => {
        if (data?.update_tournaments_by_pk.status) {
          toast.show({
            render: () => {
              return (
                <Box bg="green.500" px="2" py="1" rounded="sm" mb={5}>
                  <Text color="white">Tournament has been published!</Text>
                </Box>
              )
            }
          })
          setTimeout(() => {
            navigationRef.navigate("HomeScreen")
          }, 1000);
        } else {
          toast.show({
            render: () => {
              return (
                <Box bg="green.500" px="2" py="1" rounded="sm" mb={5}>
                  <Text color="white">Team has been unpublished!</Text>
                </Box>
              )
            }
          })
          setTimeout(() => {
            navigationRef.navigate("HomeScreen")
          }, 1000);
        }
        console.log(data)
      },
      onError: (e) => {
        console.log(e)
      }
    }
  )

  const handleUpdateTournament = (status) => {
    publishTournament({
      variables: {
        status,
        id: tournament_id
      }
    })
  }

  const alertPublishPopup = () => {
    Alert.alert(
      "Do you want to publish this tournament?",

      "",
      [
        {
          text: "Cancel"
        },
        {
          text: "Yes",
          onPress: () =>
            handleUpdateTournament(true)
        }
      ]
    )
  }
  const alertUnPublishPopup = () => {
    Alert.alert(
      "Do you want to Unpublish this tournament?",

      "",
      [
        {
          text: "Cancel"
        },
        {
          text: "Yes",
          onPress: () =>
            handleUpdateTournament(false)
        },
      ]
    )
  }

  return (
    <ScrollView>
      <Box bg={"white"} minH="full" flex={1} safeArea p={5} pt={2}>
        <GoBack />
        <Box mb={4} mt={0}>
          <Text fontSize={"4xl"} bold>
            {tournament?.tournament_name}
          </Text>
          <Text>Publish or Unpublish the tournament</Text>
          </Box>

        <Stack marginTop="20px" />

        <SafeAreaView>
          <Box
            style={StyleSheet.container}
            marginTop="20px"
            display="flex"
            flexDirection="row"
            justifyContent="space-evenly"
          >
            {status ? (
              <Button
                title="Unpublish"
                onPress={() => alertUnPublishPopup()}
              />
            ) : <Button title="Publish" onPress={alertPublishPopup} />}
            
          </Box>
        </SafeAreaView>
      </Box>
      <LoaderModal isLoading={publishTournamentLoading} />
    </ScrollView>
  )
}

export default PublishTournamentScreen
