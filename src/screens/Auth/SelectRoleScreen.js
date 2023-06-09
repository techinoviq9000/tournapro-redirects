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
  Spacer
} from "native-base"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons"
import { useState } from "react"
import { navigate } from "../../../rootNavigation"
import { useSignUpEmailPassword } from "@nhost/react"
import LoaderModal from "../../components/LoaderModal"

// export interface ErrorMessage {
//   error: string
//   message: string
// }

const ADD_NEW_WORKER = gql`
  mutation addWorker(
    $worker_name: String!
    $worker_email: String!
    $contact_number: String!
    $worker_id: uuid!
  ) {
    insert_workers_one(
      object: {
        worker_name: $worker_name
        worker_email: $worker_email
        contact_number: $contact_number
        worker_id: $worker_id
      }
    ) {
      id
    }
  }
`

const SelectRoleScreen = () => {
  const {
    signUpEmailPassword,
    isLoading,
    isSuccess,
    needsEmailVerification,
    isError,
    error
  } = useSignUpEmailPassword()
  const { colors } = useTheme()
  const [value, setValue] = useState("one")
  const [radioValue, setRadioValue] = useState(0)

  const [gqlError, setGqlError] = useState(false)

  const [addWorker, { loading: addWorkerLoading }] = useMutation(
    ADD_NEW_WORKER,
    {
      onCompleted: (data) => {
        navigate("HomeScreen")
        console.log(data)
      },
      onError: (error) => {
        setGqlError(true)
        console.log(error)
      }
    }
  )

  const signUp = async () => {
    try {
      const res = await signUpEmailPassword(
        email.toLowerCase().trim(),
        password.trim(),
        {
          displayName: `${userName}`.trim()
        }
      )
      if (res?.isError) {
        console.log(res)
        const error = res?.error?.error
        const message = res?.error?.message
        // setErrorMsg({error, message})
      } else {
        console.log(res)
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <ScrollView keyboardDismissMode="interactive">
      <Box bg={"white"} minH="full" flex={1} safeArea p={5}>
        <Box my={4}>
          <Text fontSize={"4xl"} bold>
            Choose your plan
          </Text>
          <Text>To complete the sign up process, please make the payment.</Text>
        </Box>
        <Pressable onPress={() => setRadioValue(0)}>
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
                borderColor={radioValue == 0 ? "blue.600" : "coolGray.300"}
                mb={8}
              >
                <HStack alignItems="center" justifyContent={"space-between"}>
                  <Box>
                    <Text fontSize={"xl"} bold>
                      Register As Team Captain / Manager
                    </Text>
                    <Text>
                      Only the Captain / Manger can register their teams for
                      tournaments
                    </Text>
                  </Box>
                  <Spacer />
                  <Box>
                  <Ionicons
                    name={
                      radioValue == 0
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
        <Pressable onPress={() => setRadioValue(1)}>
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
                borderColor={radioValue == 1 ? "blue.600" : "coolGray.300"}
                mb={8}
              >
                <HStack alignItems="center" justifyContent={"space-between"}>
                  <Box>
                    <Text fontSize={"xl"} bold>
                      Register As Team Player
                    </Text>
                    <Text>
                      Players can view their profiles and tournament updates
                    </Text>
                  </Box>
                  <Spacer />
                  <Box>
                  <Ionicons
                    name={
                      radioValue == 1
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

        <Pressable onPress={() => setRadioValue(2)}>
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
                borderColor={radioValue == 2 ? "blue.600" : "coolGray.300"}
                mb={8}
              >
                <HStack alignItems="center" justifyContent={"space-between"}>
                  <Box>
                    <Text fontSize={"xl"} bold>
                      Register As Tournament Organizer
                    </Text>
                    <Text>Organizers are Super Users</Text>
                  </Box>
                  <Spacer />
                  <Box>
                  <Ionicons
                    name={
                      radioValue == 2
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
      </Box>
      <LoaderModal isLoading={isLoading} />
    </ScrollView>
  )
}

export default SelectRoleScreen
