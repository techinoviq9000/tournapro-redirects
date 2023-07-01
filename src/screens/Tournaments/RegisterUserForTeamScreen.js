import { Platform } from "react-native"
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client"
import {
  Box,
  Button,
  Image,
  useTheme,
  Text,
  Input,
  ScrollView
} from "native-base"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons"
import { useState } from "react"
import { navigate, navigationRef } from "../../../rootNavigation"
import { useSignUpEmailPassword } from "@nhost/react"
import LoaderModal from "../../components/LoaderModal"
import { useSelector } from "react-redux"

const REGISTER_PLAYER = gql`
mutation MyMutation($player_email: citext!, $player_name: String!) {
  insert_players_one(object: {player_email: $player_email, player_name: $player_name}) {
    id
  }
}
`


const RegisterUserForTeamScreen = () => {
  const player = useSelector(
    (state) => state.player.player
  )

  const SignupSchema = Yup.object().shape({
    fullName: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
  })

  const { colors } = useTheme()

  let submitForm = false

  const validate = async (values) => {
    const errors = {}

    try {
      const res = await SignupSchema.validate(values, { abortEarly: false })
    } catch (error) {
      submitForm = false
      error.inner.map((err) => {
        errors[err.path] = err.message
      })
      return errors
    }

    if (submitForm) {
    } else {
      return {}
    }
  }
  const [registerPlayer] = useMutation(REGISTER_PLAYER, {
    notifyOnNetworkStatusChange: true,
    onCompleted: data => {
      console.log(data)
      navigationRef.navigate("TournamentRegistrationScreen")
    }, onError: e => {
    console.log(e)  
    }
  })
const handleRegisterPlayer = async (values) => {
  const res = await registerPlayer({
    variables: {
      player_email: values.email,
      player_name: values.fullName
    }
  })
  // console.log("Reads")
  
}
  return (
    <ScrollView keyboardDismissMode="interactive">
      <Box bg={"white"} minH="full" flex={1} safeArea p={4}>
        <Text fontSize={"4xl"} fontWeight={"800"} mb={4}>
          Register Player
        </Text>
        <Formik
        enableReinitialize
          initialValues={{
            email: player.player_email,
            fullName: ""
          }}
          validationSchema={SignupSchema}
          validateOnChange={false}
          validate={(values) => validate(values)}
          onSubmit={(values) => handleRegisterPlayer(values)}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched
          }) => (
            <Box>
              <Input
                onChangeText={handleChange("fullName")}
                onBlur={handleBlur("fullName")}
                value={values.fullName}
                variant="outline"
                placeholder="Full Name"
                fontSize="sm"
                color="black"
                borderColor={"gray.300"}
                borderRadius={"md"}
                selectionColor={colors.primary[600]}
                _focus={{
                  borderColor: "gray.600",
                  bgColor: "white"
                }}
                py={3}
                //  onChangeText={(e) => setEmail(e.trim())}
                autoCapitalize="none"
                mb={0}
              />
              {errors.fullName && touched.fullName && (
                <Text color="red.500">{errors.fullName}</Text>
              )}
              <Input
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                variant="outline"
                placeholder="Email"
                autoComplete="email"
                fontSize="sm"
                color="black"
                borderColor={"gray.300"}
                borderRadius={"md"}
                keyboardType="email-address"
                selectionColor={colors.primary[600]}
                _focus={{
                  borderColor: "gray.600",
                  bgColor: "white"
                }}
                autoCapitalize="none"
                py={3}
                mt={4}
                mb={1}
              />
              {errors.email && touched.email && (
                <Text color="red.500">{errors.email}</Text>
              )}

              <Button
                size="lg"
                borderRadius="lg"
                onPress={() => handleSubmit()}
                // bgColor={"blue.700"}
                colorScheme={"blue"}
                my={4}
              >
                Register Player
              </Button>
            </Box>
          )}
        </Formik>
      </Box>
    </ScrollView>
  )
}

export default RegisterUserForTeamScreen
