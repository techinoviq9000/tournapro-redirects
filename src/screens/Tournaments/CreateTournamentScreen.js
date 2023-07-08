import { gql, useLazyQuery } from "@apollo/client"
import {
  Box,
  Button,
  CheckIcon,
  Input,
  Select,
  Text,
  VStack,
} from "native-base"
import React, { useEffect, useState } from "react"
import * as Yup from "yup"
import { ScrollView } from "react-native"
import {  navigationRef } from "../../../rootNavigation"
import { Formik } from "formik"
import GoBack from "../../components/GoBack"

const CreateTournamentScreen = () => {
  const GET_VENUES = gql`
    query MyQuery {
      tournament_venues {
        id
        name
      }
    }
  `
  const [getVenues, { loading, data, error }] = useLazyQuery(GET_VENUES)
  const [venueId, setVenueId] = useState("")

  useEffect(() => {
    getVenues()
  }, [])

  const CreateTournamentSchema = Yup.object().shape({
    tournament_name: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Tournament Name is required!"),
    tournamentformat: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Tournament Format is required"),
    tournamentteams: Yup.string().required("Tournament Team is required")    
  })

  let submitForm = false

  const validate = async (values) => {
    const errors = {}
    // if (venueId == "") {
    //   errors.venueId = "Please select venue"
    //   return errors
    // }

    try {
      const res = await CreateTournamentSchema.validate(values, {
        abortEarly: false,
      })
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
    <ScrollView>
      <Box bg={"white"} minH="full" flex={1} safeArea p={5} pt={2}>
        <GoBack />
        <Box display="flex">
          <VStack space={4} mb={4}>
            <Text fontSize="30px" fontWeight="bold">
              Create New Tournament
            </Text>
            <Text bold>Enter Tournament Details</Text>
          </VStack>
          <Formik
            initialValues={{
              tournament_name: "",
              tournamentformat: "",
              tournamentteams: "",
            }}
            validationSchema={CreateTournamentSchema}
            validateOnChange={false}
            validate={(values) => validate(values)}
            onSubmit={(values) => {
              navigationRef.navigate("TournamentDates", {
                values: {...values, venue_id: venueId},
              })
              console.log(values)
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <Box mb={4}>
                <Box mb={4}>
                  <Text mb={1} fontWeight="bold">
                    Tournament Name
                  </Text>
                  <Input
                    type="text"
                    placeholder=" Enter Tournament Name"
                    onChangeText={handleChange("tournament_name")}
                    value={values.tournament_name}
                    borderColor={"gray.400"}
                    borderRadius={"md"}
                    keyboardType="default"
                  />
                  {errors.tournament_name && touched.tournament_name && (
                    <Text color="red.500">{errors.tournament_name}</Text>
                  )}
                </Box>
                <Box mb={4}>
                  <Text mb={1} fontWeight="bold">
                    Select Venue
                  </Text>
                  <Select
                    selectedValue={venueId}
                    minWidth="200"
                    accessibilityLabel="Select Venue"
                    placeholder="Select Venue"
                    _selectedItem={{
                      bg: "blue.200",
                      endIcon: <CheckIcon color="white" size="5" />,
                    }}
                    onValueChange={(id) => setVenueId(id)}
                  >
                    {data?.tournament_venues.map((item) => (
                      <Select.Item
                        key={item.id}
                        label={item.name}
                        value={item.id}
                      />
                    ))}
                  </Select>
                  {errors.venue_id && touched.venue_id && (
                    <Text color="red.500">{errors.venue_id}</Text>
                  )}
                </Box>
                <Box mb={4}>
                  <Text mb={1} fontWeight="bold">
                    Tournament Format
                  </Text>
                  <Input
                    placeholder="Tournament Format"
                    onChangeText={handleChange("tournamentformat")}
                    value={values.tournamentformat}
                    borderColor={"gray.300"}
                    borderRadius={"md"}
                    keyboardType="default"
                  />
                  {errors.tournamentformat && touched.tournamentformat && (
                    <Text color="red.500">{errors.tournamentformat}</Text>
                  )}
                </Box>
                <Box mb={4}>
                  <Text mb={1} fontWeight="bold">
                    Number of Teams
                  </Text>
                  <Input
                    placeholder="Enter number of teams"
                    onChangeText={handleChange("tournamentteams")}
                    value={values.tournamentteams}
                    borderColor={"gray.300"}
                    borderRadius={"md"}
                    keyboardType="default"
                  />
                  {errors.tournamentteams && touched.tournamentteams && (
                    <Text color="red.500">{errors.tournamentteams}</Text>
                  )}
                </Box>
                <Button
                  size="lg"
                  borderRadius="lg"
                  marginTop={"20"}
                  colorScheme={"blue"}
                  onPress={handleSubmit}
                >
                  Next
                </Button>
                <Button
                  size="lg"
                  borderRadius="lg"
                  marginTop={"6"}
                  colorScheme={"red"}
                >
                  Cancel
                </Button>
              </Box>
            )}
          </Formik>
        </Box>
      </Box>
    </ScrollView>
  )
}
export default CreateTournamentScreen
