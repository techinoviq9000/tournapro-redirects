import {
  useAuthenticationStatus,
  useSignOut,
  useUserData,
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
  FontAwesome,
  MaterialIcons,
  MaterialCommunityIcons
} from "@expo/vector-icons"
import { RefreshControl, ScrollView } from "react-native"
import moment from "moment"
import { useCallback, useContext, useEffect, useState } from "react"
import { navigationRef } from "../../../rootNavigation"
import AsyncStorage from "@react-native-async-storage/async-storage"
import LoaderModal from "../../components/LoaderModal"
import { useDispatch, useSelector } from "react-redux"
import { setTournament, setongoingTournament, setupcomingTournament } from "../../../store/tournamentSlice"
import { setLocation } from "../../../store/dataSlice"
import { StatusBar } from "expo-status-bar"
import HeaderLoading from "../../components/HeaderLoading"
import LocationLoading from "../../components/LocationLoading"
import DataLoadingSkeleton from "../../components/DataLoadingSkeleton"
import NoData from "../../components/NoData"
import SportsLoadingSkeleton from "../../components/SportsLoadingSkeleton"

const GET_TOURNAMENT = gql`
query GetOngoingTournaments($sport_id: Int!) {
  tournaments (where: {sport_id: {_eq: $sport_id}, start_date: {_lte: "now()"}}){
    id
    sport_id
    tournament_name
    time
    venue
    start_date
    end_date
  }
}

  
`
const GET_UPCOMINGTOURNAMENT = gql`

query GetTournaments ($sport_id: Int!) {
  tournaments(where: {sport_id: {_eq: $sport_id}, start_date: {_gt: "now()"}}) {
    id
    sport_id
    tournament_name
    time
    venue
    start_date
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
  const ongoingtournamentData = useSelector((state) => state.tournament.ongoingdata)
  const upcomingtournamentData = useSelector((state) => state.tournament.upcomingdata)
  const location = useSelector((state) => state.generalData.location)
  const dispatch = useDispatch()
  const userData = useUserData()


  const [selectedSportsId, setSelectedSportsId] = useState(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)

  const [getTournaments,{ loading, data, error }] = useLazyQuery(
    GET_TOURNAMENT,
    {
      notifyOnNetworkStatusChange: true,
      onCompleted: (data) => {
        dispatch(setongoingTournament(data.tournaments))
      },
      onError: (e) => {
        console.log(e)
      }
    },
  )

  const [getUTournaments,{ loading:utloading, data:utdata, error:utError }] = useLazyQuery(
    GET_UPCOMINGTOURNAMENT,
    {
      notifyOnNetworkStatusChange: true,
      onCompleted: (data) => {
        dispatch(setupcomingTournament(data.tournaments))
      },
      onError: (e) => {
        console.log(e)
      }

    }
  )

 const [
    getSports,
    { loading: sportsLoading, data: sportsData, error: sportsError }
  ] = useLazyQuery(GET_SPORTS,{
    // notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-first",
    onCompleted: (data) => {
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
        getUTournaments({
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

  const getLocation = async () => {
    setLocationLoading(true)
    let { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied")
      setLocationLoading(false)
      return
    }

    let location = await Location.getCurrentPositionAsync({})
    let loc = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    })
    dispatch(setLocation(loc[0]))
    setLocationLoading(false)
  }
  // useFocusEffect(
  useEffect(() => {
    getSports()
    if (!location) {
      getLocation()
    }
  }, [])
  // )

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

  const UpcomingTournament = ({ item }) => {
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
            Will start at
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

  


  const Header = () => {
    return (
      <Box flex={1} direction="row" alignContent={"center"} justifyContent={"space-evenly"}>
        
          <HStack mt = "2" direction="row" mb={1}>
          <FontAwesome name="user-circle-o" size={40} color="black" />
          
          <HStack p={2} pb={0} space={1}>
          
          {locationLoading ? (
            <LocationLoading />
          ) : errorMsg ? (
            <Text color="black">{errorMsg}</Text>
          ) : (
            <Text color="black">
              {location?.country}, {location?.subregion}, {location?.region}
              <Ionicons name="location-outline" size={18} color="black"/> 
            </Text>
            
          )}
          
        </HStack>
              
              

              <HStack marginRight="40">
              <Ionicons name="menu-outline" size={40} color="black" />

              </HStack>
              
          </HStack>
          
          
        
        
        
        <Box></Box>
      </Box>
    )
  }
  
  return (
    <ScrollView>
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
              <SportsLoadingSkeleton />
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
          {loading || sportsLoading ? (
            <DataLoadingSkeleton />
          ) : ongoingtournamentData?.length >= 1 ? (
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
                data={ongoingtournamentData}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                renderItem={({ item }) => <OnGoingTournament item={item} />}
              />
            </>
          ) : (
            <NoData getData={getTournaments} id={selectedSportsId} colors={colors} />
          )}
        </Box>

        <Box px={5} flex={"1"}>

          <>

          <Text fontSize={"3xl"} bold mb={4}>
                Upcoming tournaments
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
                data={upcomingtournamentData}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                renderItem={({ item }) => <UpcomingTournament item={item} />}
              />



          </>

        </Box>

        
        <LoaderModal isLoading={logOutLoading || isLoading || loading} />
      </Box>
      <StatusBar style="dark" translucent={false} />
<Button onPress={() => logOut()}>Logout</Button>
    </ScrollView>
  )
}
