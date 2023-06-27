import { gql, useLazyQuery } from "@apollo/client";
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
import { Platform, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { navigate } from "../../../rootNavigation";
import { AntDesign } from "@expo/vector-icons";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import * as ImagePicker from "expo-image-picker";

const LogoPoster = () => {
  const [image, setImage] = useState(null);
  const pickImage = async () => {
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

  return (
    <ScrollView>
      <Box p={6} safeArea mt={2} px={4}>
        <Box mb={4}>
          <Text fontSize={"3xl"} bold>
            Create New Tournament
          </Text>
          <Text textAling={"center"}>Upload Tournament Graphics</Text>
        </Box>

        <VStack>
          <Text marginBottom="12" textAling={"center"} bold>
            Upload Tournament Logo
          </Text>
          <Stack></Stack>
          <Pressable onPress={pickImage}>
            <Box>
              <VStack alignItems={"center"}>
                <AntDesign name="upload" size={60} color="blue" />
                {image && <Image source={{ uri: image }} />}
                <Button
                  size="md"
                  width={"24"}
                  borderRadius="lg"
                  // bgColor={"blue.700"}
                  colorScheme={"blue"}
                  my={4}
                  onPress={pickImage}
                >
                  Browse
                </Button>
              </VStack>
            </Box>
          </Pressable>
        </VStack>

        <VStack>
          <Text marginBottom="12" textAling={"center"} bold>
            Upload Tournament Poster
          </Text>
          <Stack></Stack>
          <Pressable onPress={pickImage}>
            <Box>
              <VStack alignItems={"center"}>
                <AntDesign name="upload" size={60} color="blue" />
                {image && <Image source={{ uri: image }} />}
                <Button
                  size="md"
                  width={"24"}
                  borderRadius="lg"
                  // bgColor={"blue.700"}
                  colorScheme={"blue"}
                  my={4}
                  onPress={pickImage}
                >
                  Browse
                </Button>
              </VStack>
            </Box>
          </Pressable>
        </VStack>
        <Button
          size="lg"
          borderRadius="lg"
          // bgColor={"blue.700"}
          colorScheme={"amber"}
          my={2}
          onPress={() => navigate("LogoPoster")}
        >
          Create Tournament
        </Button>
        <Button
          size="lg"
          borderRadius="lg"
          // bgColor={"blue.700"}
          colorScheme={"red"}
          my={2}
          onPress={() => navigate("TournamentDates")}
        >
          Cancel
        </Button>
      </Box>
    </ScrollView>
  );
};
export default LogoPoster;
