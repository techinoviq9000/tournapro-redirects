import { Platform } from "react-native"
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client"
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
  Center,
  Spinner,
} from "native-base"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons"
import { useEffect, useState } from "react"
import { navigate, navigationRef } from "../../../rootNavigation"
import { useSignUpEmailPassword } from "@nhost/react"
import LoaderModal from "../../components/LoaderModal"

// export interface ErrorMessage {
//   error: string
//   message: string
// }

const ADD_PLAYER = gql`
  mutation insertPlayer($player_email: citext!, $player_name: String!) {
    insert_players_one(
      object: { player_email: $player_email, player_name: $player_name }
      on_conflict: {
        constraint: players_player_email_key
        update_columns: player_name
      }
    ) {
      id
    }
  }
`

const GET_PLAYER = gql`
  query getPlayer($player_email: citext!) {
    players(where: { player_email: { _eq: $player_email } }) {
      id
    }
  }
`

const SelectRoleScreen = ({ route }) => {
  const { signUpEmailPassword, isLoading, isError, error:signUpError } = useSignUpEmailPassword()
  const { colors } = useTheme()
  const [radioValue, setRadioValue] = useState("user")
  const [planArray, setPlanArray] = useState([
    {
      title: "Register As Team Captain / Manager",
      description:
        "Only the Captain / Manger can register their teams for tournaments",
      role: "manager",
    },
    {
      title: "Register As Tournament Organizer",
      description: "Organizers are Super Users",
      role: "organizer",
    },
    {
      title: "Register As Team Player",
      description: "Players can view their profiles and tournament updates",
      role: "user",
    },
  ])
  const { email, fullName, password } = route.params.values
  console.log(email)
  const [addPlayer] = useMutation(ADD_PLAYER)
  const [getPlayer, { loading, data, error }] = useLazyQuery(GET_PLAYER, {
    nextFetchPolicy: "network-only",
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
    variables: {
      player_email: email,
    },
    onCompleted: (data) => {
      console.log(data)
      if (data.players.length > 0) {
        setPlanArray(planArray.splice(-1))
      }
    },
    onError: (e) => {
      console.log(e)
    },
  })

  const signUp = async () => {
    try {
      const res = await signUpEmailPassword(
        email.toLowerCase().trim(),
        password.trim(),
        {
          displayName: `${fullName}`.trim(),
          defaultRole: radioValue,
        }
      )
      if (res?.isError) {
        console.log(res)
      } else if (res.needsEmailVerification) {
        console.log(email, "emad")
        console.log(`${fullName}`.trim(), "fullanme")
        addPlayer({
          variables: {
            player_name: `${fullName}`.trim(),
            player_email: email,
          },
        })
        console.log(res)
        navigationRef.navigate("LoginScreen", {
          needsEmailVerification: true,
        })
      }
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getPlayer()
    console.log("GER PALTYEd")
  }, [])

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
            Choose your plan
          </Text>
          <Text>To complete the sign up process, please make the payment.</Text>
        </Box>
        {loading ? (
          <Center>
            {" "}
            <Spinner size="lg" />{" "}
          </Center>
        ) : (
          planArray.map((item, index) => (
            <Pressable onPress={() => setRadioValue(item.role)}>
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
                    borderColor={
                      radioValue == item.role ? "blue.600" : "coolGray.300"
                    }
                    mb={8}
                  >
                    <HStack
                      alignItems="center"
                      justifyContent={"space-between"}
                    >
                      <Box>
                        <Text fontSize={"xl"} bold>
                          {item.title}
                        </Text>
                        <Text>{item.description}</Text>
                      </Box>
                      <Spacer />
                      <Box>
                        <Ionicons
                          name={
                            radioValue == item.role
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
          ))
        )}
        <Button
          size="lg"
          borderRadius="lg"
          onPress={() => signUp()}
          // bgColor={"blue.700"}
          colorScheme={"blue"}
          my={0}
        >
          Send Code
        </Button>
        {isError && (
          <Box my={4}>
            <Text color="red.600" bold textAlign={"center"}>
              {signUpError?.message}
            </Text>
          </Box>
        )}
      </Box>
      <LoaderModal isLoading={isLoading} />
    </ScrollView>
  )
}

export default SelectRoleScreen
