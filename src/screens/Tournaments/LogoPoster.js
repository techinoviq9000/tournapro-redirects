import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";

import {
  Box,
  Button,
  Checkbox,
  CheckIcon,
  Container,
  FormControl,
  HStack,
  Input,
  Pressable,
  Select,
  Skeleton,
  Spacer,
  Stack,
  Text,
  useTheme,
  VStack,
  Image,
} from "native-base";
import React, { useEffect, useState } from "react";
import { CommonActions } from '@react-navigation/native';
import { Platform, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { navigate, navigationRef } from "../../../rootNavigation";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useFileUpload, useUserEmail } from "@nhost/react";
import { nhost } from "../../../nhostClient";
import { useToast } from "native-base"
import LoaderModal from "../../components/LoaderModal";

const ADD_TOURNAMENT = gql`
  mutation MyMutation(
    $tournament_name: String!
    $venue: String!
    $start_date: date!
    $end_date: date!
    $tournament_img: String!
    $banner_img: String!
    $created_by: citext!
  ) {
    insert_tournaments(
      objects: {
        tournament_name: $tournament_name
        venue: $venue
        start_date: $start_date
        end_date: $end_date
        sport_id: 1
        tournament_img: $tournament_img
        banner_img: $banner_img
        created_by: $created_by
      }
    ) {
      affected_rows
    }
  }
`;

const LogoPoster = ({ route, navigation }) => {
  const {
    start_date,
    end_date,
    tournament_name,
    venue,
    tournamentformat,
    tournamentteams,
  } = route.params.values;
  const userEmail = useUserEmail();
  const toast = useToast()
  const [image, setImage] = useState(null);
  const [poster, setPoster] = useState(null);
  const [addTournament, {loading}] = useMutation(ADD_TOURNAMENT, {
    onCompleted: data => {
      toast.show({
        render: () => {
          return (
            <Box bg="green.500" px="2" py="1" rounded="sm" mb={5}>
              <Text color="white">Tournament has been created!</Text>
            </Box>
          )
        }
      })
      setTimeout(() => {
        // navigation.dispatch(
        //   CommonActions.reset({
        //     index: 1,
        //     routes: [
        //       { name: 'HomeScreen' },
        //     ],
        //   })
        // );
        navigationRef.navigate("HomeScreen")
      }, 1000);
    }
  });
  const {
    add,
    upload,
    cancel,
    isUploaded,
    isUploading,
    isError,
    progress,
    id,
    bucketId,
    name,
  } = useFileUpload();
  const pickLogo = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 2],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const pickposter = async () => {
    let resultposter = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 2],
      quality: 1,
    });

    console.log(resultposter);

    if (!resultposter.canceled) {
      setPoster(resultposter.assets[0].uri);
    }
  };
  const expoFileToFormFile = (url) => {
    const localUri = url;
    const filename = localUri.split("/").pop();

    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;
    return { uri: localUri, name: filename, type };
  };
  const handleSubmit = async () => {
    const banner_image_file = expoFileToFormFile(poster);
    const tournament_image_file = expoFileToFormFile(image);
    console.log(banner_image_file)
    const res = await upload({
      file: banner_image_file,
      bucketId: "tournament",
    });
    console.log(res)
    const res2 = await upload({
      file: tournament_image_file,
      bucketId: "tournament",
    });

    const banner_img = nhost.storage.getPublicUrl({
      fileId: res.id,
    });
    const tournament_img = nhost.storage.getPublicUrl({
      fileId: res2.id,
    });

    await addTournament({
      variables: {
        tournament_name,
        venue,
        start_date,
        end_date,
        tournament_img,
        banner_img,
        created_by: userEmail
      },
    });
  };

  return (
    <ScrollView>
      <Box p={6} safeArea mt={2} px={4}>
        <Box mb={4}>
          <Text fontSize={"3xl"} bold>
            Create New Tournament
          </Text>
          <Text textAling={"center"}>Upload Tournament Graphics</Text>
        </Box>

        <Box
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text marginBottom="12" textAling={"center"} bold>
            Upload Tournament Logo
          </Text>
          <Button
            mt={"24"}
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
        </Box>
        <Box
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text marginBottom="12" textAling={"center"} bold>
            Upload Tournament Poster
          </Text>
          <Button
            size="md"
            mt={"24"}
            width={"24"}
            borderRadius="lg"
            // bgColor={"blue.700"}
            colorScheme={"blue"}
            my={4}
            onPress={pickposter}
          >
            Browse
          </Button>

          {poster && (
            <Image
              source={{ uri: poster }}
              style={{ width: 200, height: 200 }}
              alt="123"
            />
          )}
        </Box>

        <Button
          size="lg"
          borderRadius="lg"
          // bgColor={"blue.700"}
          colorScheme={"amber"}
          my={2}
          mt={"2"}
          onPress={() => handleSubmit()}
        >
          Create Tournament
        </Button>

        <Button
          size="lg"
          borderRadius="lg"
          // bgColor={"blue.700"}
          colorScheme={"red"}
          my={2}
          onPress={() => navigate("CreateTournamentScreen")}
        >
          Cancel
        </Button>
      </Box>
      <LoaderModal isLoading={loading} />
    </ScrollView>
  );
};
export default LogoPoster;
