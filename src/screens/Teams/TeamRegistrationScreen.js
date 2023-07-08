import { gql, useLazyQuery, useMutation } from "@apollo/client"
import { Ionicons } from "@expo/vector-icons"
import { useFileUpload, useUserEmail } from "@nhost/react"
import dayjs from "dayjs"
import {
  Box,
  Button,
  CheckIcon,
  FormControl,
  HStack,
  Image,
  Input,
  Modal,
  Pressable,
  Select,
  Skeleton,
  Spacer,
  Text,
  useTheme,
  VStack
} from "native-base"
import React, { useEffect, useState } from "react"
import { ScrollView } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { navigationRef } from "../../../rootNavigation"
import * as ImagePicker from "expo-image-picker";
import LoaderModal from "../../components/LoaderModal"
import { nhost } from "../../../nhostClient"

const GET_TEAMS = gql`
query getTeams($team_manager: citext!) {
  teams(where: {team_manager: {_eq: $team_manager}}) {
    id
    team_name
  }
}`

const GET_REGISTERED_TEAM = gql`
query getAlreadyRegistedTeam($team_id: Int!) {
  team_tournaments(where: {team_tournaments_team: {id: {_eq: $team_id}}}) {
    id
  }
}

`

const CREATE_TEAM = gql`
mutation createTeam($team_name: String!, $team_manager: citext!, $team_image: String!) {
insert_teams_one(object: {team_name: $team_name, team_manager: $team_manager, team_image: $team_image}) {
  id
}
}  
`

const INSERT_TO_TOURNAMENT = gql`
mutation insertIntoTournament($team_id: Int!, $tournament_id: Int!) {
insert_team_tournaments_one(object: {team_id: $team_id, tournament_id: $tournament_id}) {
  id
}
}
`

const TeamRegistrationScreen = () => {
  const {
    upload,
  } = useFileUpload();
  const tournamentDetails = useSelector(
    (state) => state.tournament.tournamentDetails
  );
  const userEmail = useUserEmail();
  const [image, setImage] = useState(null);
  const [service, setService] = useState("")
  const [loading, setLoading] = useState(false);
  const [errors, setError] = useState("")
  const [errorImage, setImageError] = useState("")
  const [teamName, setTeamName] = useState("")
  const [getTeams, { loading: teamLoading, data, error }] = useLazyQuery(GET_TEAMS)
  const [getRegisteredTeam, { loading: registeredTeamLoading }] = useLazyQuery(GET_REGISTERED_TEAM)
  const [insertIntoTournament, { loading: insertIntoTournamentLoading }] = useMutation(INSERT_TO_TOURNAMENT, {
    onCompleted: data => {
      console.log(data)
      alert("Team Registered Successfuly")
      setTimeout(() => {
        navigationRef.goBack()
      }, 2000);
    }, 
    onError: e => {
      console.log(e.message)
      if (e.message == 'Uniqueness violation. duplicate key value violates unique constraint "team_tournaments_captain_id_key"') {
        alert("You already have a team registered for this tournament.")
      }
    }
  })
  const [createTeam, { loading: createTeamLoading }] = useMutation(CREATE_TEAM, {
    onCompleted: data => {
      console.log(data)
      insertIntoTournament({
        variables: {
          team_id: data?.insert_teams_one?.id,
          tournament_id: tournamentDetails.id
        }
      })
    },
    onError: e => {
      console.log(e)
    }
  })

  const expoFileToFormFile = (url) => {
    const localUri = url;
    const filename = localUri.split("/").pop();

    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;
    return { uri: localUri, name: filename, type };
  };

  const handleTeamPressed = async (id) => {
    setTeamName("");
    const res = await getRegisteredTeam({
      variables: {
        team_id: id
      }
    })
    console.log(res.data.team_tournaments.length)
    if (res.data.team_tournaments.length > 0) {
      setError("Team Already Registered")
    } else {
      setService(id)
    }
  }
  const handleTeamNameChange = (text) => {
    setTeamName(text)
    setService("")
  }

  const handleSubmit = async () => {
    if (image) {
      setLoading(true)
      try {
        const team_logo_file = expoFileToFormFile(image);
        const res = await upload({
          file: team_logo_file,
          bucketId: "team",
        });
        const team_image = nhost.storage.getPublicUrl({
          fileId: res.id,
        });
        if (teamName != "") {
          createTeam({
            variables: {
              team_name: teamName.trim(),
              team_manager: userEmail,
              team_image: team_image
            }
          })
        } else {
          registerExistingTeam({
            variables: {
              team_id: service
            }
          })
        }
      } catch (error) {
        alert(JSON.stringify(error))
      }
      setLoading(false)
    } else {
      setImageError("Please upload Image")
    }
   
  }

  const pickLogo = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 2],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageError("")
    }
  };


  useEffect(() => {
    if(userEmail) {
      getTeams({
        variables: {
          team_manager: userEmail
        }
      })
    }
    
  }, [])

  const PlayerInputBox = ({ player, index, founded, userVerified }) => {
    const [currentValue, setCurrentValue] = useState(player.player_email)
    let borderColor = "gray.300"
    if (!userVerified) {
      //user is not verifed
      if (founded) {
        borderColor = "orange.400"
      } else if (founded == false) {
        borderColor = "red.400"
      } else {
        borderColor = "gray.300"
      }
    } else {
      //user is verifed
      borderColor = "green.400"
    }
    return (
      <VStack mb={4} flex="1" w="full">
        <Text mb={1} fontWeight="bold">
          Player {index + 1}
        </Text>
        <HStack flex="1" space={2}>
          <Input
            type="text"
            flex={"1"}
            value={currentValue}
            autoCapitalize="none"
            placeholder={"Player email"}
            borderColor={borderColor}
            onChangeText={(text) => setCurrentValue(text.trim())}
            onEndEditing={() => handlePlayerNameChange(currentValue, index)}
            // onChangeText={(text) => handlePlayerNameChange(text, index)}
            InputRightElement={
              <Pressable p={2} onPress={() => removePlayer(player.id)}>
                <Ionicons name="trash-outline" size={24} />
              </Pressable>
            }
          />
          <Button
            colorScheme={"blue"}
            isDisabled={player?.player_email?.length < 1}
            _disabled={{
              bgColor: "blue.500"
            }}
            onPress={() => handleFindPlayer(player, index)}
          >
            Find
          </Button>
        </HStack>
        <PlayerExistence
          player={player}
          index={index}
          founded={founded}
          userVerified={userVerified}
        />
      </VStack>
    )
  }

  const PlayerExistence = ({ player, index, founded, userVerified }) => {
    if (founded) {
      if (userVerified) {
        return (
          <Box mt={"1.5"}>
            <Text color="green.400" fontWeight={"bold"}>
              Player found
            </Text>
          </Box>
        )
      } else {
        return (
          <Box mt={"1.5"}>
            <Text color="orange.400" fontWeight={"bold"}>
              Player not verified
            </Text>
          </Box>
        )
      }
    } else if (founded == false) {
      return (
        <Box mt={"1.5"}>
          <Text color="red.400" fontWeight={"bold"} mb={1}>
            Player not found
          </Text>
          <Button
            colorScheme={"blue"}
            size="sm"
            w="24"
            onPress={() => handleInvitePlayer(player, index)}
          >
            Invite player
          </Button>
        </Box>
      )
    }
  }
  const PlayerLoadngSkeleton = () => (
    <Skeleton my="4" rounded="md" startColor="coolGray.100" />
  )
  return (
    <ScrollView>
      <Box safeArea mt={2} px={4}>
        <Box mb={4}>
          <Text fontSize={"3xl"} bold>
            Register Your Team
          </Text>
          {/* <Text textAling={"center"}>
            Upto 15 players and minium 12 players can be selected
          </Text> */}
          <Text textAling={"center"}>
            Select your team from dropdown or register new team!
          </Text>
        </Box>
        <Box mb={4}>
          <Text mb={1} fontWeight="bold">
            Team Name
          </Text>
          <Input
            type="text"
            flex={"1"}
            value={teamName}
            autoCapitalize="none"
            placeholder={"Team Name"}
            borderColor={"gray.400"}
            onChangeText={(text) => handleTeamNameChange(text)}
          />
        </Box>
        <Text textAlign={"center"} bold my={"4"}>Or</Text>
        <Box mb={4}>
        <Text mb={1} fontWeight="bold">Select team</Text>
          <Select
            selectedValue={service}
            minWidth="200"
            accessibilityLabel="Select Team"
            placeholder="Select Team"
            _selectedItem={{
              bg: "blue.200",
              endIcon: <CheckIcon color="white" size="5" />
            }}
            mt={1}
            onValueChange={(itemId) => handleTeamPressed(itemId)}
          >
            {data?.teams.map((item) => (
              <Select.Item
                key={item.id}
                label={item.team_name}
                value={item.id}
              />
            ))}
          </Select>
          {errors && <Text bold color="red.500">{errors}</Text>}
        </Box>
        <VStack alignItems={"center"}
        >
          <Text textAling={"center"} bold>
            Upload Tournament Logo
          </Text>
          {errorImage && <Text color="red.500" bold>Please select image</Text>}
          <Button
            size="md"
            width={"24"}
            borderRadius="lg"
            // bgColor={"blue.700"}
            colorScheme={"blue"}
            my={4}
            onPress={pickLogo}
          >
            Browse
          </Button>

          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: 200, height: 200 }}
              alt="asd"
            />
          )}
        </VStack>
        {(teamName != "" || service != "") && (
            <Pressable
              w="1/3"
              mt={2}
              alignSelf={"center"}
              onPress={() => handleSubmit()}
            >
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
                    mb={8}
                    bgColor="blue.500"
                  >
                    <HStack
                      alignItems="center"
                      justifyContent={"space-between"}
                    >
                      <Ionicons
                        name="tennisball-outline"
                        size={24}
                        color="white"
                      />
                      <Text bold color="white">
                        Submit Team
                      </Text>
                    </HStack>
                  </Box>
                )
              }}
            </Pressable>
          )}
      </Box>
      <LoaderModal isLoading={ loading || teamLoading || createTeamLoading || insertIntoTournamentLoading} />
    </ScrollView>
  )
}

export default TeamRegistrationScreen
