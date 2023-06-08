import { Platform } from "react-native"
import { gql, useMutation, useQuery } from "@apollo/client"
import { Box, Button, Image, useTheme, Text, Input } from "native-base"
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

const SignUpScreen = () => {
  const {
    signUpEmailPassword,
    isLoading,
    isSuccess,
    needsEmailVerification,
    isError,
    error
  } = useSignUpEmailPassword()
  const { colors } = useTheme()
  const [email, setEmail] = useState("")
  const [userName, setUserName] = useState("")
  const [contact_number, setContactNumber] = useState("")
  const [password, setPassword] = useState("")
  const [togglePassword, setTogglePassword] = useState(true)

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
        addWorker({
          variables: {
            worker_name: userName,
            worker_email: email,
            contact_number: contact_number,
            worker_id: res?.user?.id
          }
        })
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Box bg={"white"} minH="full" flex={1}>
      <Box
        bg={"white"}
        flex={0.5}
        w="full"
        justifyContent="center"
        alignItems="center"
      >
        <Image
          alt="QS LOGO"
          size="64"
          resizeMode="center"
          // style={{width: "100%", paddingHorizontal: 10}}
          source={require("../../../assets/Login/TournaProIcon.png")}
        />
      </Box>
      {/* <Box bg="#fff" flex={1} borderTopRadius="2xl">
        <ScrollView>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <Box p={8}>
              <VStack mb="4" space={4}>
                <Text
                  fontSize="2xl"
                  fontWeight="bold"
                  letterSpacing="sm"
                  color="black"
                >
                  Sign Up Now
                </Text>
                <FormControl isRequired>
                  <Input
                    variant="underlined"
                    placeholder="Email"
                    autoComplete="email"
                    fontSize="sm"
                    color="black"
                    selectionColor={colors.primary[600]}
                    onChangeText={(e) => setEmail(e.trim())}
                    autoCapitalize="none"
                    value={email}
                    InputLeftElement={
                      <Box pr="3">
                        <FontAwesome
                          name="envelope"
                          size={18}
                          color={colors.primary[700]}
                        />
                      </Box>
                    }
                  />
                </FormControl>
                <Input
                  variant="underlined"
                  placeholder="Username"
                  autoComplete="name"
                  fontSize="sm"
                  color="black"
                  selectionColor={colors.primary[600]}
                  onChangeText={(e) => setUserName(e)}
                  value={userName}
                  InputLeftElement={
                    <Box pr="3">
                      <Ionicons
                        name="person"
                        size={18}
                        color={colors.primary[700]}
                      />
                    </Box>
                  }
                />
                  <Input
                  variant="underlined"
                  placeholder="Contact Number"
                  autoComplete="tel"
                  fontSize="sm"
                  color="black"
                  selectionColor={colors.primary[600]}
                  onChangeText={(e) => setContactNumber(e)}
                  value={contact_number}
                  InputLeftElement={
                    <Box pr="3">
                      <MaterialIcons
                        name="phone"
                        size={18}
                        color={colors.primary[700]}
                      />
                    </Box>
                  }
                />
                <Input
                  variant="underlined"
                  placeholder="Password"
                  autoComplete="password"
                  fontSize="sm"
                  type={togglePassword ? "password" : "text"}
                  color="black"
                  selectionColor={colors.primary[600]}
                  onChangeText={(e) => setPassword(e.trim())}
                  value={password}
                  InputLeftElement={
                    <Box pr="3">
                      <Ionicons
                        name="md-lock-closed"
                        size={18}
                        color={colors.primary[700]}
                      />
                    </Box>
                  }
                  InputRightElement={
                    <Box pr="3">
                      <Ionicons
                      onPress={() => setTogglePassword(!togglePassword)}
                      name={togglePassword ? "eye-off-outline" : "eye-outline"}
                      size={18}
                      color={colors.black}
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
                {gqlError && <Text textAlign="center" fontWeight="bold" color="red.600">Unable to register. Please try later</Text>}
                <Button size="sm" borderRadius="full" onPress={() => signUp()}>
                  Sign Up
                </Button>
              </VStack>
              <Text textAlign="center" color={colors.primary[900]}>
                Already have an account?
              </Text>
              <Text
                textAlign="center"
                underline
                bold
                color={colors.primary[900]}
                onPress={() => navigate("LoginScreen")}
              >
                Sign in now
              </Text>
            </Box>
          </KeyboardAvoidingView>
        </ScrollView>
      </Box> */}
      <Box bg="white" flex={1} p={8}>
        <Text fontSize={"2xl"} bold mb={2}>
          Create Account
        </Text>
        <Formik
          initialValues={{ email: "", firstName: "", lastName: "", password: '', confirmPassword: '' }}
          onSubmit={(values) => console.log(values)}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <Box>
              <Input
                onChangeText={handleChange("firstName")}
                onBlur={handleBlur("firstName")}
                value={values.firstName}
                variant="outline"
                placeholder="First Name"
                fontSize="sm"
                color="black"
                borderColor={"gray.300"}
                borderRadius={"md"}
                selectionColor={colors.primary[600]}
                //  onChangeText={(e) => setEmail(e.trim())}
                autoCapitalize="none"
                mb={4}
              />
              <Input
                onChangeText={handleChange("lastName")}
                onBlur={handleBlur("lastName")}
                value={values.lastName}
                variant="outline"
                placeholder="Last Name"
                fontSize="sm"
                color="black"
                borderColor={"gray.300"}
                borderRadius={"md"}
                selectionColor={colors.primary[600]}
                //  onChangeText={(e) => setEmail(e.trim())}
                autoCapitalize="words"
                mb={4}
              />
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
                selectionColor={colors.primary[600]}
                //  onChangeText={(e) => setEmail(e.trim())}
                autoCapitalize="none"
                mb={4}
              />
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
                //  onChangeText={(e) => setEmail(e.trim())}
                autoCapitalize="none"
                mb={4}
                InputRightElement={
                  <Box pr="3">
                    <Ionicons
                    onPress={() => setTogglePassword(!togglePassword)}
                    name={togglePassword ? "eye-off-outline" : "eye-outline"}
                    size={18}
                    color={colors.black}
                    />
                  </Box>
                }
              />
              <Input
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                value={values.confirmPassword}
                variant="outline"
                placeholder="Confirm Password"
                fontSize="sm"
                color="black"
                borderColor={"gray.300"}
                borderRadius={"md"}
                selectionColor={colors.primary[600]}
                //  onChangeText={(e) => setEmail(e.trim())}
                autoCapitalize="none"
                mb={4}
                InputRightElement={
                  <Box pr="3">
                    <Ionicons
                    onPress={() => setTogglePassword(!togglePassword)}
                    name={togglePassword ? "eye-off-outline" : "eye-outline"}
                    size={18}
                    color={colors.black}
                    />
                  </Box>
                }
              />
              <Button size="sm" borderRadius="full" onPress={handleSubmit} bgColor={"blue.400"}>
               Create Account
              </Button>
            </Box>
          )}
        </Formik>
      </Box>
      <LoaderModal isLoading={isLoading} />
    </Box>
  )
}

export default SignUpScreen
