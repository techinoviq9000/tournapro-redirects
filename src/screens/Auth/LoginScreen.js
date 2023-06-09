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

const LoginScreen = () => {
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
  const signIn = async () => {
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
        setTokenLoading(true)
        registerForPushNotificationsAsync() //register for notifcations by getting device token
          .then(async (token) => {
            //before navigating, register user for notificaiton
            setUserToken(token, res.user?.email)
              .then(() => {
                setTokenLoading(false)
                navigationRef.reset({
                  index: 1,
                  routes: [{ name: "HomeScreen" }]
                })
              })
              .catch((e) => { //problem setting user token
                setTokenLoading(false)
                setErrors([...errors, JSON.stringify(e)])
                console.log(e)
              })
          }) //problem registering device for token
          .catch((e) => {
            setTokenLoading(false)
            setErrors([...errors, JSON.stringify(e)])
            console.log(e)
            // setError("No internet")
          })
      }
    } catch (e) { //some error in whole process
      setErrors([...errors, JSON.stringify(e)])
      console.log(e, "error")
    }
  }

  const { colors } = useTheme()
  console.log({isAuthenticated})
  useEffect(() => {
    if (!isLoading) { //if loading is false meaning isAuthenticated function has ran.
      if (isAuthenticated) { //if the user is authenticated
        console.log({isAuthenticated})
        registerForPushNotificationsAsync() //register device for notificaiton
          .then((token) => {
            //before navigating, register user for notificaiton
            setTokenLoading(true)
            setUserToken(token, undefined) //set user token 
              .then(() => {
                navigationRef.reset({
                  index: 1,
                  routes: [{ name: "HomeScreen" }]
                })
              })
              .catch((e) => {
                setErrors([...errors, JSON.stringify(e)])
                console.log(e)
              })
          })
          .catch((e) => {
            setTokenLoading(false)
            setErrors([...errors, JSON.stringify(e)])
            console.log(e)
            // setError("No internet")
          })
      }
    }
  }, [isLoading])

  return (
    <Box bg={"white"} minH="full" flex={1}>
      <Box
        bg={"white"}
        flex={1}
        w="full"
        justifyContent="center"
        alignItems="center"
      >
        <Text fontSize={"5xl"}>Tourna Pro</Text>
        <Image
          alt="QS LOGO"
          size="64"
          resizeMode="center"
          // style={{width: "100%", paddingHorizontal: 10}}
          source={require("../../../assets/Login/TournaProLogo.png")}
        />
      </Box>
      <Box bg="#239681" flex={1} borderTopRadius="2xl">
        <ScrollView scrollEnabled={true}>
          <KeyboardAvoidingView
            h={{
              base: "400px",
              lg: "auto"
            }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <Box p={8}>
              <VStack mb="4" space={4}>
                <Text
                  fontSize="2xl"
                  fontWeight="bold"
                  letterSpacing="sm"
                  color="white"
                >
                  Sign in
                </Text>
                <Input
                  variant="underlined"
                  placeholder="Email"
                  autoComplete="email"
                  importantForAutofill="yes"
                  fontSize="sm"
                  color="white"
                  autoCapitalize="none"
                  selectionColor="white"
                  placeholderTextColor="white"
                  focusOutlineColor="white"
                  onChangeText={(e) => setEmail(e.trim())}
                  value={email}
                  InputLeftElement={
                    <Box pr="3">
                      <Ionicons
                        name="person"
                        size={18}
                        color={"white"}
                      />
                    </Box>
                  }
                />
                <Input
                  variant="underlined"
                  placeholder="Password"
                  fontSize="sm"
                  autoComplete="password"
                  importantForAutofill="yes"
                  type={togglePassword ? "password" : "text"}
                  color="white"
                  autoCapitalize="none"
                  selectionColor={"white"}
                  placeholderTextColor="white"
                  borderColor={"white"}
                  focusOutlineColor="white"
                  onChangeText={(e) => setPassword(e.trim())}
                  value={password}
                  InputLeftElement={
                    <Box pr="3">
                      <Ionicons
                        name="md-lock-closed"
                        size={18}
                        color={"white"}
                      />
                    </Box>
                  }
                  InputRightElement={
                    <Box pr="3">
                      <Ionicons
                        onPress={() => setTogglePassword(!togglePassword)}
                        name={
                          togglePassword ? "eye-off-outline" : "eye-outline"
                        }
                        size={18}
                        color={"white"}
                      />
                    </Box>
                  }
                  mb={isError ? "0" : "5"}
                />
                {isError && (
                  <Text textAlign="center" fontWeight="bold" color="red.600">
                    {error?.message}
                  </Text>
                )}
                <Button size="sm" borderRadius="full" onPress={() => signIn()} backgroundColor="white" _text={{color: "#239681"}}>
                  Sign in
                </Button>
              </VStack>
              <Text textAlign="center" color={"white"}>
                Don't have an account yet?
              </Text>
              <Text
                textAlign="center"
                underline
                bold
                color={"white"}
                onPress={() => navigate("SignUpScreen")}
              >
                Sign Up now
              </Text>
              <Text textAlign="center" my={2} color={"white"}>Or</Text>
              <Text textAlign="center" color={"white"} fontSize="xl">
                Skip Sign in
              </Text>
              {/* block for logs */}
              {/* <ScrollView>
                <Box flex={1}>
                  {errors.map((item, index) => (
                    <VStack space={1}>
                      <Text fontSize={"xs"} color="black">
                        {index}..... {item}
                      </Text>
                    </VStack>
                  ))}
                </Box>
              </ScrollView> */}
            </Box>
          </KeyboardAvoidingView>
        </ScrollView>
        <AppVersion />
      </Box>

      <LoaderModal isLoading={isLoading || tokenLoading || loading} />
      <LoaderModal isLoading={signInLoadng} />
      <StatusBar
        animated
        backgroundColor={colors.coolGray[900]}
        style="light"
      />
    </Box>
  )
}

export default LoginScreen
