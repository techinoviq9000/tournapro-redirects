import { gql, useQuery } from "@apollo/client";
import {
  Box,
  Text,
  Pressable,
  HStack,
  Spacer,
  VStack,
  Badge,
} from "native-base";
import { useUserData } from "@nhost/react";
import { Ionicons } from "@expo/vector-icons";
import { navigationRef } from "../../../rootNavigation";
import { useDispatch } from "react-redux";
import {
  setTournamentDetails,
} from "../../../store/tournamentSlice";

import * as React from "react";
import { Image } from "react-native-svg";

const GET_TOURNAMENT = gql`
query GetTournaments($sport_id: Int!, $created_by: citext!) {
  tournaments(
    where: {
      sport_id: { _eq: $sport_id }
      created_by: { _eq: $created_by }
      end_date: { _gte: "now()" }
    }
    order_by: { start_date: desc }
  ) {
    id
    sport_id
    tournament_name
    tournament_img
    banner_img
    time
    venue {
      name
    }
    start_date
    end_date
    status
    created_by
    created_at
  }
}
`;

const MyTournaments = ({ navigation }) => {

  const MyBadge = ({ status }) => {
    let colorScheme = ""
    switch (status) {
      case true:
        colorScheme = "success"
        break
      case false:
        colorScheme = "error"
        break
      default:
        break
    }
    return (
      <Badge colorScheme={colorScheme} alignSelf="center" variant={"outline"}>
        {status ? "Published" : "Unpublished"}
      </Badge>
    )
  }
  const userData = useUserData();
  const dispatch = useDispatch();
  const handlePress = async (item) => {
    await dispatch(setTournamentDetails(item));
    navigation.navigate("Tournament", {screen: "TournamentOverviewScreen"})
  };
  const { loading, data, error } = useQuery(GET_TOURNAMENT, {
    variables: {
      sport_id: "1",
      created_by: userData?.email,
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {},
    onError: (e) => {
      console.log(e);
    },
  });
  const GetTournaments = ({ item }) => {
    console.log(item.tournament_img);
    return (
      <Box>
        <Pressable onPress={() => handlePress(item)} key={item.id}>
          {({ isHovered, isFocused, isPressed }) => {
            return (
              <Box
                style={{
                  transform: [
                    {
                      scale: isPressed ? 0.96 : 1,
                    },
                  ],
                }}
                py={3}
                px={3}
                rounded="8"
                borderWidth={"1"}
                borderColor={"coolGray.300"}
                mb={8}
              >
                <HStack alignItems="center" justifyContent={"space-between"}>
                <VStack>
                  <HStack space={4} alignItems="center">
                    <Image
                      display="flex"
                      flexDirection="row"
                      borderRadius="10px"
                      source={{
                        uri: item?.tournament_img
                      }}
                      alt="Alternate Text"
                      size="xs"
                    />
                    <Text fontSize={"xl"} bold>
                      {item?.tournament_name}
                    </Text>
                  </HStack>
                    <HStack my={2} alignItems="center" space={2}>
                      <Text>Status: </Text>
                      <MyBadge status={item.status} />
                    </HStack>
                    <Text>Created By: {item.created_by}</Text>
                    <Text>Created At : {item.created_at}</Text>
                    <Text>Start Date: {item.start_date}</Text>
                    <Text>End Date : {item.end_date}</Text>
                  </VStack>
                  <Spacer />
                  <Box>
                    <Ionicons name={"arrow-forward"} size={24} />
                  </Box>
                </HStack>
              </Box>
            );
          }}
        </Pressable>
      </Box>
    );
  };
  return (
    <Box bg={"white"} minH="full" flex={1} safeArea p={5} pt={2}>
      <Box w="full" display={"flex"} justifyItems={"center"}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="black"
          onPress={() => navigationRef.goBack()}
        />
      </Box>
      <Box mb={4} mt={0}>
        <Text fontSize={"4xl"} bold>
          My Tournaments
        </Text>
        <Text>List of My Tournaments</Text>
      </Box>
      {loading ? (
        <Text>Loading</Text>
      ) : data?.tournaments.length > 0 ? (
        data?.tournaments.map((item) => <GetTournaments item={item} />)
      ) : (
        <Text>NoData</Text>
      )}
    </Box>
  );
};

export default MyTournaments;
