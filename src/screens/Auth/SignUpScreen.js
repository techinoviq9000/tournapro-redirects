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
} from "native-base"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons"
import { useState } from "react"
import { navigate, navigationRef } from "../../../rootNavigation"
import { useSignUpEmailPassword } from "@nhost/react"
import LoaderModal from "../../components/LoaderModal"

const SignUpScreen = () => {
  const SignupSchema = Yup.object().shape({
    fullName: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),
    password: Yup.string()
      .min(8, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    phoneNumber: Yup.string().required(),
  })

  const { colors } = useTheme()
  const [togglePassword, setTogglePassword] = useState(true)
  const [toggleConfirmPassword, setToggleConfirmPassword] = useState(true)

  let submitForm = false

  const validate = async (values) => {
    const errors = {}
    if (values.password != values.confirmPassword) {
      errors.confirmPassword = "Passwords do not match!"
      return errors
    }

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
            Create Account
          </Text>
          <Formik
            initialValues={{
              email: "salmanhanif133@gmail.com",
              fullName: "Salman Hanif",
              password: "123456789",
              phoneNumber: "03222681575",
              confirmPassword: "123456789",
            }}
            validationSchema={SignupSchema}
            validateOnChange={false}
            validate={(values) => validate(values)}
            onSubmit={(values) =>
              navigationRef.navigate("SelectRoleScreen", {
                values,
              })
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
                    bgColor: "white",
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
                  onChangeText={handleChange("phoneNumber")}
                  onBlur={handleBlur("phoneNumber")}
                  value={values.phoneNumber}
                  variant="outline"
                  placeholder="Phone Number"                  
                  fontSize="sm"
                  color="black"
                  borderColor={"gray.300"}
                  borderRadius={"md"}
                  keyboardType="number-pad"
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
                {errors.phoneNumber && touched.phoneNumber && (
                  <Text color="red.500">{errors.phoneNumber}</Text>
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
                  _focus={{
                    borderColor: "gray.600",
                    bgColor: "white",
                  }}
                  type={toggleConfirmPassword ? "password" : "text"}
                  autoCapitalize="none"
                  py={3}
                  mt={4}
                  mb={1}
                  InputRightElement={
                    <Box pr="3">
                      <Ionicons
                        onPress={() =>
                          setToggleConfirmPassword(!toggleConfirmPassword)
                        }
                        name={
                          toggleConfirmPassword
                            ? "eye-off-outline"
                            : "eye-outline"
                        }
                        size={18}
                        color={colors.black}
                      />
                    </Box>
                  }
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <Text color="red.500">{errors.confirmPassword}</Text>
                )}
                <Button
                  size="lg"
                  borderRadius="lg"
                  onPress={() => handleSubmit()}
                  // bgColor={"blue.700"}
                  colorScheme={"blue"}
                  my={4}
                >
                  Create Account
                </Button>
                <Text textAlign="center" color={colors.primary[900]} mb={2}>
                  Already have an account?{" "}
                  <Text
                    textAlign="center"
                    underline
                    bold
                    color={colors.primary[900]}
                    onPress={() => navigate("LoginScreen")}
                  >
                    Sign in now
                  </Text>
                </Text>
                <Text textAlign="center" color={colors.primary[900]}>
                  By creating an account or signing you agree
                </Text>
                <Text textAlign="center" color={colors.primary[900]}>
                  to our{" "}
                  <Text
                    textAlign="center"
                    underline
                    bold
                    color={colors.primary[900]}
                    onPress={() => navigate("LoginScreen")}
                  >
                    Terms and Conditions
                  </Text>
                </Text>
              </Box>
            )}
          </Formik>
        </Box>
      </Box>
    </ScrollView>
  )
}

export default SignUpScreen
