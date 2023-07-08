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
import { Ionicons } from "@expo/vector-icons";
import { navigate, navigationRef } from "../../../rootNavigation";
import { useDispatch, useSelector } from "react-redux";
import {
  setOnGoingTournamentData,
  setTournamentDetails,
  setUpComingTournamentData,
} from "../../../store/tournamentSlice";

import { RefreshControl } from "react-native";
import { gql, useLazyQuery } from "@apollo/client";
import { useCallback, useState } from "react";
import LoaderModal from "../../components/LoaderModal";
import dayjs from "dayjs";

const GET_TOURNAMENT = gql`
  query GetOngoingTournaments($sport_id: Int!) {
    tournaments(
      where: {
        sport_id: { _eq: $sport_id }
        end_date: { _gte: "now()" }
        status: { _eq: true }
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
    }
  }
`;


const TournamentScreen = ({ route }) => {
  const onGoingTournamentData = useSelector(
    (state) => state.tournament.onGoingTournamentData
  );
  const upComingTournamentData = useSelector(
    (state) => state.tournament.upComingTournamentData
  );
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false)
  const dispatch = useDispatch();
  const handlePress = async (item) => {
    await dispatch(setTournamentDetails(item));
    navigationRef.navigate("TournamentOverviewScreen");
  };

  const [getTournaments, { loading, data, error }] = useLazyQuery(
    GET_TOURNAMENT,
    {
      notifyOnNetworkStatusChange: true,
      nextFetchPolicy: "network-only",
      fetchPolicy: "network-only",
      variables: {
        sport_id: onGoingTournamentData[0].sport_id,
      },
      onCompleted: (data) => {
        console.log(data)
        const now = dayjs().format("YYYY-MM-D");
        const OnGoingTournamentData = data.tournaments.filter(
          (tournament) => dayjs(now).diff(tournament.start_date) >= 0
        );
        const UpComingTournamentData = data.tournaments.filter(
          (tournament) => dayjs(now).diff(tournament.start_date) < 0
        );
        dispatch(setOnGoingTournamentData(OnGoingTournamentData));
        dispatch(setUpComingTournamentData(UpComingTournamentData));
        setRefreshing(false)
      },
      onError: (e) => {
        setRefreshing(false)
        console.log(e);
      },
    }
  );

  const onRefresh = useCallback(() => {
    
    getTournaments()
  }, [])

  return (
    <ScrollView       refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }>
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
            Ongoing Tournaments
          </Text>
          <Text>List of Ongoing Tournaments</Text>
        </Box>

        {onGoingTournamentData?.map((item, index) => (
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
                    </Box>
                    <Spacer />
                    <Box>
                      <Ionicons
                        name={"arrow-forward"}
                        size={24}
                        color={colors.blue[600]}
                      />
                    </Box>
                  </HStack>
                </Box>
              );
            }}
          </Pressable>
        ))}

        <Box mb={4} mt={0}>
          <Text fontSize={"4xl"} bold>
            Upcoming Tournaments
          </Text>
          <Text>List of Upcoming Tournaments</Text>
        </Box>
        {upComingTournamentData?.map((item, index) => (
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
                    </Box>
                    <Spacer />
                    <Box>
                      <Ionicons
                        name={"arrow-forward"}
                        size={24}
                        color={colors.blue[600]}
                      />
                    </Box>
                  </HStack>
                </Box>
              );
            }}
          </Pressable>
        ))}

        <Button
          size="lg"
          borderRadius="lg"
          // bgColor={"blue.700"}
          colorScheme={"amber"}
          my={4}
          onPress={() => navigate("CreateTournamentScreen")}
        >
          Create New Tournamnet
        </Button>
      </Box>
      <LoaderModal isLoading={loading} />
    </ScrollView>
  );
};

export default TournamentScreen;
