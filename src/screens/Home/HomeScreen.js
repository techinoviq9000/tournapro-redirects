import {
  useAuthenticationStatus,
  useSignOut,
  useUserAvatarUrl,
  useUserData,
  useUserDisplayName,
  useUserEmail,
} from "@nhost/react"
import { gql, useLazyQuery, useQuery } from "@apollo/client"
import { useFocusEffect } from "@react-navigation/native"
import * as Location from "expo-location"
import {
  Avatar,
  Box,
  Button,
  Divider,
  FlatList,
  Heading,
  HStack,
  Image,
  Pressable,
  Skeleton,
  Spacer,
  Text,
  useTheme,
  VStack,
  ListItem,
  Separator,
  Icon,
} from "native-base"
import {
  Ionicons,
  AntDesign,
  FontAwesome,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons"
import { ImageBackground, RefreshControl, ScrollView, View } from "react-native"
import moment from "moment"
import { useCallback, useContext, useEffect, useState } from "react"
import { navigate, navigationRef } from "../../../rootNavigation"
import AsyncStorage from "@react-native-async-storage/async-storage"
import LoaderModal from "../../components/LoaderModal"
import { useDispatch, useSelector } from "react-redux"
import {
  setTournament,
  setongoingTournament,
  setupcomingTournament,
} from "../../../store/tournamentSlice"
import { setLocation } from "../../../store/dataSlice"
import { StatusBar } from "expo-status-bar"
import HeaderLoading from "../../components/HeaderLoading"
import LocationLoading from "../../components/LocationLoading"
import NoData from "../../components/NoData"
import SportsLoadingSkeleton from "../../components/SportsLoadingSkeleton"
import dayjs from "dayjs"
import MatchesDataLoadingSkeleton from "../../components/MatchesDataLoadingSkeleton"
import OngGoingDataLoadingSkeleton from "../../components/OngGoingDataLoadingSkeleton"
import UpComingDataLoadingSkeleton from "../../components/UpComingDataLoadingSkeleton"

const GET_TOURNAMENT = gql`
  query GetOngoingTournaments($sport_id: Int!) {
    tournaments(
      where: { sport_id: { _eq: $sport_id }, end_date: { _gte: "now()" } }
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
    }
  }
`

const GET_MATCHES = gql`
query GetMatches($player_email: citext!) {
  matches(where: {_or: [{team1: {players: {player: {player_email: {_eq: $player_email}}}}}, {team2: {players: {player: {player_email: {_eq: $player_email}}}}}]}, order_by: {match_date: asc, match_time: asc}) {
    id
    match_date
    match_time
    match_venue
    team1_id
    team2_id
    tournament {
      tournament_name
    }
    team1 {
      team_name
      team_image
      players {
        player {
          player_email
        }
      }
    }
    team2 {
      team_name
      team_image
      players {
        player {
          player_email
        }
      }
    }
  }
}

`
const GET_SPORTS = gql`
  query GetSports {
    sports {
      id
      image
      sport_name
      created_at
      updated_at
    }
  }
`;

export default HomeScreen = ({ navigation }) => {
  const ongoingtournamentData = useSelector(
    (state) => state.tournament.ongoingdata
  )
  const upcomingtournamentData = useSelector(
    (state) => state.tournament.upcomingdata
  )
  const location = useSelector((state) => state.generalData.location)
  const dispatch = useDispatch()
  const userData = useUserData()

  const [selectedSportsId, setSelectedSportsId] = useState(null)

  const [locationLoading, setLocationLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)

  const [getTournaments, { loading, data, error }] = useLazyQuery(
    GET_TOURNAMENT,
    {
      notifyOnNetworkStatusChange: true,
      onCompleted: (data) => {
        const now = dayjs().format("YYYY-MM-D")        
        const OnGoingTournament = data.tournaments.filter(
          (tournament) => dayjs(now).diff(tournament.start_date) >= 0
        )
        const UpComingTournament = data.tournaments.filter(
          (tournament) => dayjs(now).diff(tournament.start_date) < 0
        )
        dispatch(setongoingTournament(OnGoingTournament))
        dispatch(setupcomingTournament(UpComingTournament))
      },
      onError: (e) => {
        console.log(e)
      },
    }
  );

  const [
    getMatches,
    { loading: matchesloading, data: matchdata, error: matcherror },
  ] = useLazyQuery(GET_MATCHES, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
    },
    onError: (e) => {
      console.log(e)
    },
  })

  const [
    getSports,
    { loading: sportsLoading, data: sportsData, error: sportsError },
  ] = useLazyQuery(GET_SPORTS, {
    onCompleted: (data) => {
      if (!selectedSportsId) {
        const id = data?.sports.filter(
          (item) => item.sport_name == "Cricket"
        )[0].id;
        setSelectedSportsId(id);
        getTournaments({
          variables: {
            sport_id: id,
          },
        })
      }
    },
    onError: (e) => {
      console.log(e, "error")
    },
  })

  const { isAuthenticated, isLoading } = useAuthenticationStatus()
  const userName = useUserDisplayName() ?? ""
  const userEmail = useUserEmail()
  const { colors } = useTheme()
  const [logOutLoading, setLogOutLoading] = useState(false)
  const { signOut } = useSignOut()
  const logOut = async () => {
    try {
      setLogOutLoading(true);
      signOut();
      setLogOutLoading(false);
    } catch (error) {
      setLogOutLoading(false);
      console.log(error);
    }
  };

  const getLocation = async () => {
    setLocationLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      setLocationLoading(false);
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    let loc = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    })
    dispatch(setLocation(loc[0]))
    setLocationLoading(false)
  }
  // useFocusEffect(
  useEffect(() => {
    if (userEmail) {
      getSports()
      getMatches({
        variables: {
          player_email: "abdullah.s@techinoviq.com",
        },
      })
      if (!location) {
        getLocation()
      }
    }
  }, []);
  // )

  const OnGoingTournament = ({ item }) => {
    return (
      <HStack alignItems="center">
        <ImageBackground
          source={
            item.banner_img
              ? { uri: item.banner_img }
              : require("../../../assets/tournament_image_placeholder.jpg")
          }
          borderRadius={10}
          resizeMode="cover"
          style={{ flex: 1 }}
        >
          <Box
            bg={{
              linearGradient: {
                colors: ["blue.300", "transparent"],
                start: [0.5, 0],
                end: [1, 0],
              },
            }}
            w={"xs"}
            flex={1}
            p={5}
            borderRadius="lg"
          >
            <Text fontSize={"xl"} bold>
              {item.tournament_name}
            </Text>
            <Text>{item.venue}</Text>
            <Text>
              Start Date: {dayjs(item.start_date).format("ddd, D MMM")}
            </Text>
            <Text>End Date: {dayjs(item.end_date).format("ddd, D MMM")}</Text>
          </Box>
        </ImageBackground>
      </HStack>
    );
  };

  const Header = () => {
    const userData = useUserData();
    return (
      <>
      <HStack alignItems="center" justifyContent={"space-between"} mb={2}>
        {/* <Box flex={1}>
          <HStack direction="column" mb={1}>
          <Text color="black" fontSize={"2xl"}>
          {`Hello, ${userName}`}
          </Text>
          <Text color="gray.400" fontSize="xs">
          {userEmail}
          </Text>
          </HStack>
          </Box> 
        <Button onPress={() => logOut()}>Logout</Button> */}
        <Image
          size={30}
          borderRadius={100}
          source={{
            uri: userData?.avatarUrl,
          }}
          alt="Alternate Text"/>
        <HStack alignItems={"flex-end"} space={1}>
          <Ionicons name="location-outline" size={24} color="black" />
          {locationLoading ? (
            <LocationLoading />
          ) : errorMsg ? (
            <Text color="black">{errorMsg}</Text>
            ) : (
              <Text color="black" bold>
              {location?.country}, {location?.subregion}, {location?.region}
            </Text>
          )}
        </HStack>
        <Ionicons
          name="menu"
          p={6}
          size={24}
          color="black"
          onPress={() => navigation.openDrawer()}
          />
      </HStack>
      <Divider my="2" />
        </>
    );
  };

  const UpComingTournament = ({ item }) => {
    return (
      <HStack alignItems="center">
        <ImageBackground
          source={
            item.banner_img
              ? { uri: item.banner_img }
              : require("../../../assets/tournament_image_placeholder.jpg")
          }
          borderRadius={10}
          resizeMode="cover"
          style={{ flex: 1 }}
        >
          <Box
            bg={{
              linearGradient: {
                colors: ["orange.300", "transparent"],
                start: [0.5, 0],
                end: [1, 0],
              },
            }}
            w={"xs"}
            flex={1}
            p={5}
            borderRadius="lg"
          >
            <Text fontSize={"xl"} bold>
              {item.tournament_name}
            </Text>
            <Text>{item.venue}</Text>
            <Text>
              Start Date: {dayjs(item.start_date).format("ddd, D MMM")}
            </Text>
            <Text>End Date: {dayjs(item.end_date).format("ddd, D MMM")}</Text>
          </Box>
        </ImageBackground>
      </HStack>
    )
  }

  const Matches = ({ item }) => {
    return (
        <Box bg={"gray.50"} p={4} borderRadius="lg" w={360} flex={"1"} borderWidth={"1"}  borderLeftWidth={"3"} borderLeftColor={"blue.500"} borderRightWidth={"3"} borderRightColor={"orange.500"} borderBottomColor={"gray.300"} borderTopColor={"gray.300"}>
          <HStack mb={2} alignItems={"center"} flex={"1"}>
            <HStack alignItems={"center"} justifyContent={"flex-start"} flex={"1"}>
            <Image source={{uri: item?.team1?.team_image}} alt="team1" size="sm" borderRadius={100} />
            <Text fontSize={"lg"} fontWeight={"black"} ml={2} color="blue.500">
              {item?.team1.team_name}
            </Text>
            </HStack>
            <Text fontSize={"xl"} bold mx={2}>
              V/S
            </Text>
            <HStack alignItems={"center"} justifyContent={"flex-end"} flex={"1"}>
            <Text fontSize={"lg"} fontWeight={"black"} mr={2} color={"orange.500"}>
            {item?.team2.team_name}
            </Text>
            <Image source={{uri: item?.team2?.team_image}} alt="team2" size="sm" borderRadius={100} />
            </HStack>
          </HStack>
          <Text textAlign={"center"} my={2} bold fontSize={"lg"}>{item?.tournament?.tournament_name}</Text>
          <VStack flex={"1"} alignItems={"center"} space={1}>
          <HStack space={2} alignItems="center" mb={2}>
            
            <AntDesign name="calendar" size={18} />
            <Text>
              {dayjs(item?.match_date).format("DD MMM YYYY") || "N/A"}
            </Text>
          </HStack>
          <HStack space={2} alignItems="center">
            <Ionicons name="location-outline" size={18} color="black" />
            <Text>{item?.match_venue || "N/A"}</Text>
          </HStack>
          </VStack>
        </Box>
    )
  }

  return (
    <ScrollView>
      <Box flex={1} safeArea>
        <Box p={5} pb={0}>
          {isLoading ? <HeaderLoading /> : <Header />}
        </Box>
        {/* <HStack p={5} pb={0} alignItems={"flex-end"} space={1}>
          <Ionicons name="location-outline" size={24} color="black" />
          {locationLoading ? (
            <LocationLoading />
          ) : errorMsg ? (
            <Text color="black">{errorMsg}</Text>
          ) : (
            <Text color="black" bold>
              {location?.country}, {location?.subregion}, {location?.region}
            </Text>
          )}
        </HStack> */}
        <Box px={5} my={4} marginTop="15px">
          <Text fontSize={"3xl"} bold mb={4}>
            Sports
          </Text>
          <HStack justifyContent={"space-between"}>
            {sportsLoading ? (
              <SportsLoadingSkeleton />
            ) : (
              sportsData?.sports.map((item, index) => {
                let selected = selectedSportsId == item.id ? true : false;
                return (
                  <Box key={index}>
                    <Pressable
                      bg="gray.100"
                      w={20}
                      h={20}
                      shadow={"2"}
                      borderRadius={"md"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      mb={2}
                      onPress={() => {
                        setSelectedSportsId(item.id),
                          getTournaments({
                            variables: {
                              sport_id: item.id,
                            },
                          })
                      }}
                    >
                      <Image
                        source={{
                          uri: item.image,
                        }}
                        alt="Alternate Text"
                        size="xl"
                        w={20}
                        h={20}
                        rounded={"md"}
                        borderWidth={selected ? "4" : 0}
                        borderColor={"lightBlue.500"}
                      />
                    </Pressable>
                    <Text
                      textAlign={"center"}
                      fontWeight={selected ? "bold" : "normal"}
                    >
                      {item.sport_name}
                    </Text>
                  </Box>
                );
              })
            )}
          </HStack>
        </Box>
        <Divider my={4} />
        <Box>
          {matchesloading ? (
            <MatchesDataLoadingSkeleton />
          ) : matchdata?.matches?.length >= 1 ? (
            <>
              <VStack>
                <HStack
                  px={5}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  mb={2}
                >
                  <Text fontSize={"2xl"} bold>
                    My Matches
                  </Text>
                  <Pressable onPress={() => navigate("OngoingTournamentsScreen")}>
                    <HStack>
                      <Text color="blue.500" bold>
                        See All
                      </Text>

                      <Ionicons
                        name="arrow-forward-outline"
                        size={18}
                        color={colors.blue[500]}
                      />
                    </HStack>
                  </Pressable>
                </HStack>

                <FlatList
                  ItemSeparatorComponent={() => <Box w="4" />}
                  _contentContainerStyle={{
                    padding: "2",
                    paddingX: "5",
                  }}
                  data={matchdata?.matches}
                  horizontal
                  keyExtractor={(item, index) => `${item.id}-${index}`}
                  renderItem={({ item }) => <Matches item={item} />}
                  showsHorizontalScrollIndicator={false}
                />
              </VStack>
            </>
          ) : (
            <NoData
              getData={getTournaments}
              id={selectedSportsId}
              colors={colors}
            />
          )}
        </Box>
        <Divider my={4} />
        <Box>
          {loading || sportsLoading ? (
            <OngGoingDataLoadingSkeleton />
          ) : ongoingtournamentData?.length >= 1 ? (
            <>
              <VStack>
                <HStack
                  px={5}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  mb={2}
                >
                  <Text fontSize={"2xl"} bold>
                    Ongoing tournaments
                  </Text>
                  <Pressable onPress={() => navigate("OngoingTournamentsScreen")}>
                    <HStack>
                      <Text color="blue.500" bold>
                        See All
                      </Text>

                      <Ionicons
                        name="arrow-forward-outline"
                        size={18}
                        color={colors.blue[500]}
                      />
                    </HStack>
                  </Pressable>
                </HStack>

                <FlatList
                  ItemSeparatorComponent={() => <Box w="4" />}
                  _contentContainerStyle={{
                    padding: "2",
                    paddingX: "5",
                  }}
                  data={ongoingtournamentData}
                  horizontal
                  keyExtractor={(item, index) => `${item.id}-${index}`}
                  renderItem={({ item }) => <OnGoingTournament item={item} />}
                  showsHorizontalScrollIndicator={false}
                />
              </VStack>
            </>
          ) : (
            <NoData
              getData={getTournaments}
              id={selectedSportsId}
              colors={colors}
            />
          )}
        </Box>
        <Divider my={4} />
        <Box mb={10}>
          {loading || sportsLoading ? (
            <UpComingDataLoadingSkeleton />
          ) : upcomingtournamentData?.length >= 1 ? (
            <>
              <VStack>
                <HStack
                  px={5}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  mb={2}
                >
                  <Text fontSize={"2xl"} bold>
                    Upcoming tournaments
                  </Text>
                  <Pressable onPress={() => navigate("OngoingTournamentsScreen")}>
                    <HStack>
                      <Text color="blue.500" bold>
                        See All
                      </Text>

                      <Ionicons
                        name="arrow-forward-outline"
                        size={18}
                        color={colors.blue[500]}
                      />
                    </HStack>
                  </Pressable>
                </HStack>

                <FlatList
                  ItemSeparatorComponent={() => <Box w="4" />}
                  _contentContainerStyle={{
                    padding: "2",
                    paddingX: "5",
                  }}
                  data={upcomingtournamentData}
                  horizontal
                  keyExtractor={(item, index) => `${item.id}-${index}`}
                  renderItem={({ item }) => <UpComingTournament item={item} />}
                  showsHorizontalScrollIndicator={false}
                />
              </VStack>
            </>
          ) : (
            <NoData
              getData={getTournaments}
              id={selectedSportsId}
              colors={colors}
            />
          )}
        </Box>

        <LoaderModal isLoading={logOutLoading || isLoading || loading} />
      </Box>
      <StatusBar style="dark" translucent={false} />
      {/*       
      <Button onPress={() => logOut()}>Logout</Button>
     */}
    </ScrollView>
  );
};
