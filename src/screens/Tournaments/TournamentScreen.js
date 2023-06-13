import { Platform } from "react-native"
import { gql, useMutation, useQuery } from "@apollo/client"
import {
  Box,
  Button,
  Image,
  useTheme,
  Text,
  Input,
  ScrollView,
  Radio,
  Pressable,
  HStack,
  Spacer,
} from "native-base"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons"
import { useState } from "react"
import { navigate, navigationRef } from "../../../rootNavigation"
import { useSignUpEmailPassword } from "@nhost/react"
import LoaderModal from "../../components/LoaderModal"

const GET_TOURNAMENT = gql`
  query GetTournaments($sport_id: Int = 1) {
    tournaments(where: { sport_id: { _eq: $sport_id } }) {
      id
      sport_id
      tournament_name
      venue
      created_at
      updated_at
      start_date
      end_date
      time
    }
  }
`

const TournamentScreen = ({ route }) => {
  const {
    signUpEmailPassword,
    isLoading,
    isSuccess,
    needsEmailVerification,
    isError,
    error,
  } = useSignUpEmailPassword()
  const { colors } = useTheme()
  const [radioValue, setRadioValue] = useState(1)
  const planArray = [
    { title: "Register As Team Captain / Manager", description: "Only the Captain / Manger can register their teams for tournaments", role: "manager" },
    { title: "Register As Tournament Organizer", description: "Organizers are Super Users", role: "organizer" },
    { title: "Register As Team Player", description: "Players can view their profiles and tournament updates", role: "user" },
  ]

  const  { loading, data } = useQuery(
    GET_TOURNAMENT,
    {
      notifyOnNetworkStatusChange: true,
      onCompleted: (data) => {
        console.log(data, "data")
      },
      onError: (e) => {
        console.log(e)
      }
    }
  )
  return (
    <ScrollView keyboardDismissMode="interactive">
      <Box bg={"white"} minH="full" flex={1} safeArea p={5} pt={2}>
        <Box w="full" display={"flex"} justifyItems={"center"}>
          <Ionicons
            name="arrow-back"
            size={24}
            color="black"
            onPress={() => navigationRef.goBack()}
          />
        </Box>
        <Box mb={4} mt={0}>
          <Text fontSize={"4xl"} bold>
            Upcoming Tournaments
          </Text>
          <Text>List of Tournaments</Text>
        </Box>
        {data?.tournaments?.map((item, index) => (
          <Pressable onPress={() => setRadioValue(item.id)}>
            {({ isHovered, isFocused, isPressed }) => {
              return (
                <Box
                  style={{
                    transform: [
                      {
                        scale: isPressed ? 0.96 : 1,
                      },
                    ],
                  }}
                  py={3}
                  px={3}
                  rounded="8"
                  borderWidth={"1"}
                  borderColor={radioValue == item.role ? "blue.600" : "coolGray.300"}
                  mb={8}
                >
                  <HStack alignItems="center" justifyContent={"space-between"}>
                    <Box>
                      <Text fontSize={"xl"} bold>
                        {item.tournament_name}
                      </Text>
                      <Text>
                        {item.venue}
                      </Text>
                      <Text>
                        Start Date: {item.start_date}
                      </Text>
                      <Text>
                        End Date: {item.end_date}
                      </Text>
                    </Box>
                    <Spacer />
                    <Box>
                      <Ionicons
                        name={
                          radioValue == item.id
                            ? "radio-button-on-outline"
                            : "radio-button-off-outline"
                        }
                        size={24}
                        color={colors.blue[600]}
                      />
                    </Box>
                  </HStack>
                </Box>
              )
            }}
          </Pressable>
        ))}
        <Button
          size="lg"
          borderRadius="lg"
          // bgColor={"blue.700"}
          colorScheme={"blue"}
          my={4}
        >
          Send Code
        </Button>
      </Box>
      <LoaderModal isLoading={isLoading} />
    </ScrollView>
  )
}

export default TournamentScreen
