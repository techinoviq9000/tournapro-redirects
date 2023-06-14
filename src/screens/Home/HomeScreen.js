import {
  useAuthenticationStatus,
  useSignOut,
  useUserDisplayName,
  useUserEmail
} from "@nhost/react"
import { gql, useLazyQuery, useQuery } from "@apollo/client"
import { useFocusEffect } from "@react-navigation/native"
import * as Location from "expo-location"
import {
  Box,
  Button,
  Divider,
  FlatList,
  Heading,
  HStack,
  Image,
  Pressable,
  Skeleton,
  Text,
  useTheme,
  VStack
} from "native-base"
import {
  Ionicons,
  AntDesign,
  MaterialIcons,
  MaterialCommunityIcons
} from "@expo/vector-icons"
import { RefreshControl } from "react-native"
import moment from "moment"
import { useCallback, useState } from "react"
import { navigationRef } from "../../../rootNavigation"
import AsyncStorage from "@react-native-async-storage/async-storage"
import LoaderModal from "../../components/LoaderModal"

const GET_TOURNAMENT = gql`
  query GetTournaments($sport_id: Int!) {
    tournaments(where: { sport_id: { _eq: $sport_id } }) {
      id
      sport_id
      tournament_name
      venue
      created_at
      updated_at
      time
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
`

export default HomeScreen = ({ navigation }) => {
  const [selectedSportsId, setSelectedSportsId] = useState(null)
  const [tournamentData, setTournamentData] = useState([])
  const [locationLoading, setLocationLoading] = useState(true)
  const [location, setLocation] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [getTournaments, { loading, data, error }] = useLazyQuery(
    GET_TOURNAMENT,
    {
      notifyOnNetworkStatusChange: true,
      onCompleted: (data) => {
        setTournamentData(data.tournaments)
        console.log(data, "data")
      },
      onError: (e) => {
        console.log(e)
      }
    }
  )

  const [
    getSports,
    { loading: sportsLoading, data: sportsData, error: sportsError }
  ] = useLazyQuery(GET_SPORTS, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      console.log(data, "sportsdata")
      if (!selectedSportsId) {
        const id = data?.sports.filter(
          (item) => item.sport_name == "Cricket"
        )[0].id
        setSelectedSportsId(id)
        getTournaments({
          variables: {
            sport_id: id
          }
        })
      }
    },
    onError: (e) => {
      console.log(e, "error")
    }
  })
  const { isAuthenticated, isLoading } = useAuthenticationStatus()
  const userName = useUserDisplayName() ?? ""
  const userEmail = useUserEmail() ?? ""
  const { colors } = useTheme()
  const [logOutLoading, setLogOutLoading] = useState(false)
  const { signOut } = useSignOut()
  const logOut = async () => {
    try {
      setLogOutLoading(true)
      signOut()
      setLogOutLoading(false)
    } catch (error) {
      setLogOutLoading(false)
      console.log(error)
    }
  }
  useFocusEffect(
    useCallback(() => {
          getSports()
          // (async () => {
          //   setLocationLoading(true)
          //   let { status } = await Location.requestForegroundPermissionsAsync();
          //   if (status !== 'granted') {
          //     setErrorMsg('Permission to access location was denied');
          //     setLocationLoading(false)
          //     return;
          //   }

          //   let location = await Location.getCurrentPositionAsync({});
          //   let loc = await Location.reverseGeocodeAsync({latitude: location.coords.latitude, longitude: location.coords.longitude})
          //   setLocation(loc[0]);
          //   setLocationLoading(false)
          // })();
      
    }, [])
  )

  const OnGoingTournament = ({ item }) => {
    return (
      <Box bg={"white"} p={6} borderRadius="lg" shadow="3" width="90%">
        <HStack
          alignItems="center"
          justifyContent="space-between"
          mb={3}
          w="full"
        >
          <Heading color="black" size="md" w="5/6">
            {item?.tournament_name || "N/A"}
          </Heading>
          <Text color="gray.400">ID: {item?.id}</Text>
        </HStack>
        {/* <Text fontSize={"lg"} fontWeight="bold" color="black">Clean the windows</Text> */}
        {/* <AssignedTo item={item} /> */}
        <Divider bg="gray.200" my={4} />
        <VStack space={2}>
          <Text color="black" fontSize="sm" mb={1}>
            Started at
          </Text>
          <HStack space={2} alignItems="center">
            <AntDesign name="calendar" size={18} />
            <Text color="black" fontSize="sm">
              {moment(item?.start_date).format("DD MMM yyyy") || "N/A"}
            </Text>
          </HStack>
          <HStack space={2} alignItems="center">
            <AntDesign name="clockcircleo" size={18} />
            <Text color="black" fontSize="sm">
              {moment(item?.start_date).format("HH:MM:SS") || "N/A"}
            </Text>
          </HStack>
        </VStack>
        <Divider bg="gray.200" my={4} />
      </Box>
    )
  }

  const NoData = () => (
    <Box flex={1} alignItems="center" justifyContent="center" mb="20" w="full">
      <AntDesign name="warning" size={64} color={colors.primary[500]} />
      <Text color={colors.primary[500]} fontSize="lg" fontWeight="bold" my="2">
        No Tournaments for this sports.
      </Text>
      <Button
        bgColor={colors.primary[900]}
        onPress={() => {
          getTournaments({
            variables: {
              sport_id: selectedSportsId
            }
          })
        }}
      >
        Check Again!
      </Button>
    </Box>
  )

  const Header = () => {
    return (
      <HStack direction="row" alignItems={"center"} mb={1}>
        <Box flex={1}>
          <HStack direction="column" mb={1}>
            <Text color="black" fontSize={"2xl"}>
              {`Hello, ${userName}`}
            </Text>
            <Text color="gray.400" fontSize="xs">
              {userEmail}
            </Text>
          </HStack>
        </Box>
        <Button onPress={() => logOut()}>Logout</Button>
        <Box></Box>
      </HStack>
    )
  }

  const HeaderLoading = () => (
    <VStack space={5} alignItems={"flex-start"} mb={4}>
      <Skeleton.Text lines={1} alignItems="flex-start" w="16" />
      <Skeleton.Text lines={1} alignItems="flex-start" pr="12" />
    </VStack>
  )

  const LocationLoading = () => (
    <VStack space={5} alignItems={"flex-start"} mb={1}>
      <Skeleton.Text lines={1} alignItems="flex-start" w="32" />
    </VStack>
  )

  const DataLoadingSkeleton = () => (
    <Box shadow="4">
      <Text fontSize={"3xl"} bold mb={4}>
        On going tournaments
      </Text>
      <HStack
        borderWidth="1"
        w="40"
        space={8}
        rounded="md"
        _light={{
          borderColor: "coolGray.200"
        }}
        p="4"
      >
        <Skeleton flex="1" h="150" rounded="md" startColor="coolGray.100" />
      </HStack>
    </Box>
  )
  return (
    <Box flex={1} safeArea>
      <Box p={5} pb={0}>
        {isLoading ? <HeaderLoading /> : <Header />}
      </Box>
      <HStack p={5} pb={0} alignItems={"flex-end"} space={1}>
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
      <Box px={5} my={4}>
        <Text fontSize={"3xl"} bold mb={4}>
          Sports
        </Text>
        <HStack justifyContent={"space-between"}>
          {sportsLoading ? (
            <Text>Loading</Text>
          ) : (
            sportsData?.sports.map((item, index) => {
              let selected = selectedSportsId == item.id ? true : false
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
                            sport_id: item.id
                          }
                        })
                    }}
                  >
                    <Image
                      source={{
                        uri: item.image
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
              )
            })
          )}
        </HStack>
      </Box>

      <Box px={5} flex={"1"}>
        {loading && sportsLoading ? (
          <DataLoadingSkeleton />
        ) : tournamentData?.length >= 1 ? (
          <>
            <Text fontSize={"3xl"} bold mb={4}>
              On going tournaments
            </Text>

            <FlatList
              // refreshControl={
              //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              // }
              ItemSeparatorComponent={() => (
                <Divider my={4} bgColor="transparent" />
              )}
              _contentContainerStyle={{
                padding: 1
              }}
              data={tournamentData}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              renderItem={({ item }) => <OnGoingTournament item={item} />}
            />
          </>
        ) : (
          <NoData />
        )}
      </Box>
      {/* <Box mb={4} p={4}>
        <Text fontSize={"3xl"} bold mb={4}>
          On going tournaments
        </Text>
        {data &&
          data?.tournaments.map((item) => (
            <Box
              borderWidth={"1"}
              borderRadius={5}
              borderColor={"gray.200"}
              p={2}
              width={200}
              height={300}
              shadow={"4"}
              bg={"gray.50"}
            >
              <Text>Name: {item.name}</Text>
              <Text>Location: {item.location}</Text>
              <Text>Day: {new Date(item.start_date).getDay()}</Text>
            </Box>
          ))}
      </Box> */}
      <LoaderModal isLoading={logOutLoading || isLoading || loading} />
    </Box>
  )
}
