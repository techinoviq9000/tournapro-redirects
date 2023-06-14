// eas update --branch development
// eas build --profile development
import { Platform } from "react-native"
import {
  Box,
  Button,
  Image,
  Input,
  KeyboardAvoidingView,
  Text,
  VStack,
  useTheme,
  ScrollView
} from "native-base"
import * as Device from "expo-device"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import * as Notifications from "expo-notifications"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Ionicons } from "@expo/vector-icons"
import { useState, useEffect } from "react"
import { navigate, navigationRef } from "../../../rootNavigation"
import {
  useAuthenticationStatus,
  useSignInEmailPassword,
  useUserData
} from "@nhost/react"
import { StatusBar } from "expo-status-bar"
import AppVersion from "../../../AppVersion"
import { gql, useMutation } from "@apollo/client"
import LoaderModal from "../../components/LoaderModal"

const UPDATE_TOKEN = gql`
  mutation MyMutation($token: String!, $email: String!) {
    insert_expo_tokens(
      objects: { email: $email, token: $token }
      on_conflict: {
        constraint: expo_tokens_email_key
        update_columns: token
        where: { email: { _eq: $email } }
      }
    ) {
      affected_rows
    }
  }
`

const LoginScreen = ({route}) => {
  const { isAuthenticated, isLoading } = useAuthenticationStatus()
  const [tokenLoading, setTokenLoading] = useState(false)
  const [errors, setErrors] = useState([])
  const userData = useUserData()
  const [updateToken, { loading, error: gqlError, data }] = useMutation(
    UPDATE_TOKEN,
    {
      onCompleted: (data) => {
        console.log({ data })
      }
    }
  )
  const registerForPushNotificationsAsync = async () => {
    //register notifcation function
    let token
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C"
      })
    }
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!")
        return
      }
      token = (await Notifications.getExpoPushTokenAsync()).data
    } else {
      alert("Must use physical device for Push Notifications")
    }

    return token
  }

  const setUserToken = async (
    token,
    email
  ) => {
    setTokenLoading(true)
    console.log(token, "token")
    AsyncStorage.getItem("user").then(async (userItem) => {
      //get token from local storage
      console.log(userItem, "userItem")
      let user = userItem ?? null //if there is token then parse else null
      if (token) {
        //if device token exists
        if (user != token) {
          //if there is not token found in storage or token is not latest
          console.log("no existing token")
          AsyncStorage.setItem("user", token)
          updateToken({
            //insert row in db or udpate existing row
            variables: {
              token: token,
              email: email ?? userData?.email ?? "N/A"
            }
          })
          return await Promise.resolve(true)
        } else {
          console.log("token founded")
          setErrors([...errors, "token not found"])
          return await Promise.resolve(true)
        }
      } else {
        console.log("No token found and no token set") //some error when getting token
        setErrors([...errors, "token not found and no token set"])
        return await Promise.reject(false)
      }
    })
  }

  const {
    signInEmailPassword,
    isLoading: signInLoadng,
    isSuccess,
    needsEmailVerification,
    isError,
    error
  } = useSignInEmailPassword()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [togglePassword, setTogglePassword] = useState(true)
  const signIn = async ({email, password}) => {
    try {
      const res = await signInEmailPassword( //use nhost function to sign in
        email.toLowerCase().trim(),
        password.trim()
      )

      if (res?.isError) { //if there is error during sign in
        console.log(res)
        setErrors([...errors, "error in login"])
        console.log("error in login")
      } else {
        navigationRef.reset({
          index: 1,
          routes: [{ name: "HomeStack" }]
        })
      }
    } catch (e) { //some error in whole process
      setErrors([...errors, JSON.stringify(e)])
      console.log(e, "error")
    }
  }

  const { colors } = useTheme()
  // console.log({isAuthenticated})
  // useEffect(() => {
  //   if (!isLoading) { //if loading is false meaning isAuthenticated function has ran.
  //     if (isAuthenticated) { //if the user is authenticated
  //       navigationRef.reset({
  //         index: 1,
  //         routes: [{ name: "HomeStack" }]
  //       })
  //     }
  //   }
  // }, [isLoading])

  return (
    <ScrollView keyboardDismissMode="interactive">
    <Box bg={"white"} minH="full" flex={1} safeArea>
      <Box
        bg={"white"}
        w="full"
        justifyContent="center"
        alignItems="center"
        pt={2}
      >
        <Image
          alt="QS LOGO"
          size="64"
          resizeMode="center"
          // style={{width: "100%", paddingHorizontal: 10}}
          source={require("../../../assets/Login/TournaProLogo.png")}
        />
      </Box>
      <Box bg="white" flex={1} p={8} pt={1}>
        <Text fontSize={"4xl"} fontWeight={"800"} mb={4}>
          Login Details
        </Text>
        <Formik
          initialValues={{
            email: "salmanhanif133@gmail.com",
            password: "123456789",
          }}
          // validationSchema={SignupSchema}
          // validateOnChange={false}
          // validate={(values) => validate(values)}
          onSubmit={(values) =>
            signIn(values)
          }
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <Box>
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
                  bgColor: "white",
                }}
                autoCapitalize="none"
                py={3}
                mt={4}
                mb={1}
              />
              {errors.email && touched.email && (
                <Text color="red.500">{errors.email}</Text>
              )}
              <Input
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                variant="outline"
                placeholder="Password"
                autoComplete="password"
                fontSize="sm"
                color="black"
                borderColor={"gray.300"}
                borderRadius={"md"}
                selectionColor={colors.primary[600]}
                type={togglePassword ? "password" : "text"}
                _focus={{
                  borderColor: "gray.600",
                  bgColor: "white",
                }}
                autoCapitalize="none"
                py={3}
                mt={4}
                mb={1}
                InputRightElement={
                  <Box pr="3">
                    <Ionicons
                      onPress={() => setTogglePassword(!togglePassword)}
                      name={
                        togglePassword ? "eye-off-outline" : "eye-outline"
                      }
                      size={18}
                      color={colors.black}
                    />
                  </Box>
                }
              />
              {errors.password && touched.password && (
                <Text color="red.500">{errors.password}</Text>
              )}
              <Button
                size="lg"
                borderRadius="lg"
                onPress={() => handleSubmit()}
                // bgColor={"blue.700"}
                colorScheme={"blue"}
                my={4}
              >
                Login
              </Button>
              <Text textAlign="center" color={colors.primary[900]} mb={2}>
                or{" "}
                <Text
                  textAlign="center"
                  underline
                  bold
                  color={colors.primary[900]}
                  onPress={() => navigate("SignUpScreen")}
                >
                  Sign up
                </Text>
              </Text>
                <Text
                  textAlign="center"
                  underline
                  bold
                  color={colors.primary[900]}
                  onPress={() => navigate("LoginScreen")}
                >
                  Forgot Password?
                </Text>
            </Box>
          )}
        </Formik>
      </Box>
      <LoaderModal isLoading={isLoading} />
    </Box>
  </ScrollView>
  )
}

export default LoginScreen
