import { gql, useMutation } from "@apollo/client";

import {
  Box,
  Button,
  VStack,
  Image,
} from "native-base";
import React, { useState } from "react";
import { ScrollView } from "react-native";
import { navigate, navigationRef } from "../../../rootNavigation";
import * as ImagePicker from "expo-image-picker";
import { useFileUpload, useUserEmail } from "@nhost/react";
import { nhost } from "../../../nhostClient";
import { useToast } from "native-base"
import LoaderModal from "../../components/LoaderModal";
import GoBack from "../../components/GoBack";

const ADD_TOURNAMENT = gql`
mutation MyMutation($tournament_name: String!, $start_date: date!, $end_date: date!, $tournament_img: String!, $banner_img: String!, $created_by: citext!, $venue_id: Int!) {
  insert_tournaments(objects: {tournament_name: $tournament_name, start_date: $start_date, end_date: $end_date, sport_id: 1, tournament_img: $tournament_img, banner_img: $banner_img, created_by: $created_by, venue_id: $venue_id}) {
    affected_rows
  }
}

`;

const TournamentRegistrationScreen = ({ route, navigation }) => {
  const {
    start_date,
    end_date,
    tournament_name,
    venue_id,
  } = route.params.values;
  const userEmail = useUserEmail();
  const toast = useToast()
  const [image, setImage] = useState(null);
  const [poster, setPoster] = useState(null);
  const [imageLoading, setImageLoading] = useState(false)
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
        navigationRef.navigate("SelectOrViewTournamentScreen")
        navigationRef.navigate("HomeScreen")
      }, 1000);
    },
    onError: e => {
      console.log(e)
      setImageLoading(false)
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
    setImageLoading(true)
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
try {
  await addTournament({
    variables: {
      tournament_name,
      start_date,
      end_date,
      tournament_img,
      banner_img,
      venue_id,
      created_by: userEmail
    },
  });
  setImageLoading(false)
} catch (e) {
  setImageLoading(false)
}
   
  };

  return (
    <ScrollView>
      <Box bg={"white"} minH="full" flex={1} safeArea p={5} pt={2}>
        <GoBack />
        <Box display="flex">
          <VStack space={4} mb={4}>
            <Text fontSize="30px" fontWeight="bold">
              Create New Tournament
            </Text>
            <Text bold>Upload Tournament Graphics</Text>
          </VStack>

        <Box alignItems={"center"}>
          <Text textAlign={"center"} bold fontSize={"xl"}>
            Upload Tournament Logo
          </Text>
          <Button
            size="md"            
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
            size={150}
              source={{ uri: image }}
              // size={"xl"}
              alt="asd"
            />
          )}
        </Box>
        <Box alignItems={"center"}>
          <Text textAlign={"center"} bold fontSize={"xl"}>
            Upload Tournament Poster
          </Text>
          <Button
            size="md"
            borderRadius="lg"
            colorScheme={"blue"}
            my={4}
            onPress={pickposter}
          >
            Browse
          </Button>

          {poster && (
            <Image
              source={{ uri: poster }}
              // style={{ width: 200, height: 200 }}
              size={150}
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
      </Box>
      <LoaderModal isLoading={loading || imageLoading} />
    </ScrollView>
  );
};
export default TournamentRegistrationScreen;
