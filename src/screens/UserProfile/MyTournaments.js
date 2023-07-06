import { gql, useLazyQuery, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  useTheme,
  Text,
  ScrollView,
  Pressable,
  HStack,
  Spacer,
} from "native-base";
import { useUserData } from "@nhost/react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { navigate, navigationRef } from "../../../rootNavigation";
import { useDispatch, useSelector } from "react-redux";
import {
  setTournamentDetails,
  setongoingTournamentDetails,
} from "../../../store/tournamentSlice";

import * as React from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NativeScreenNavigationContainer } from "react-native-screens";
import { Image } from "react-native-svg";

const MyTournaments = ({ route }) => {
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
        venue
        start_date
        end_date
        status
        created_by
      }
    }
  `;
  const userData = useUserData();
  const dispatch = useDispatch();
  const handlePress = async (item) => {
    await dispatch(setTournamentDetails(item));
    navigationRef.navigate("TournamentOverviewScreen");
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
    console.log(item);
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
                  <Box>
                    <Text fontSize={"xl"} bold>
                      {item.tournament_name}
                    </Text>
                    <Text>{item.venue}</Text>
                    <Text>Start Date: {item.start_date}</Text>
                    <Text>End Date: {item.end_date}</Text>
                    <Text>Status: {item.status}</Text>
                    <Text>created by : {item.created_by}</Text>
                  </Box>
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
  //   const tournamentData = useSelector((state) => state.tournament.data);
  //   const ongoingtournamentData = useSelector(
  //     (state) => state.tournament.ongoingdata
  //   );
  //   const upcomingtournamentData = useSelector(
  //     (state) => state.tournament.upcomingdata
  //   );
  //   const { colors } = useTheme();
  //   const dispatch = useDispatch();
  //   const handlePress = async (item) => {
  //     await dispatch(setTournamentDetails(item));
  //     navigationRef.navigate("TournamentOverviewScreen");
  //   };

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
