import { useSignOut, useUserDisplayName, useUserEmail } from "@nhost/react"
import { gql, useQuery } from "@apollo/client"
import {
  Box,
  Button,
  Divider,
  FlatList,
  Heading,
  HStack,
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
import { useState } from "react"
import { navigationRef } from "../../../rootNavigation"
import AsyncStorage from "@react-native-async-storage/async-storage"

const GET_TOURNAMENT = gql`
  query GetTournaments {
    tournaments {
      id
      sport
      image
      location
      name
      end_date
      start_date
      created_at
      updated_at
    }
  }
`

export default HomeScreen = () => {
  const { loading, data, error } = useQuery(GET_TOURNAMENT)
  console.log(data)
  const userName = useUserDisplayName() ?? ""
  const userEmail = useUserEmail() ?? ""
  const { colors } = useTheme()
  const [logOutLoading, setLogOutLoading] = useState(false)
  const {signOut} = useSignOut()
  const logOut = async () => {
    try {
      setLogOutLoading(true)
      // const response = await updateTask()
      // console.log({ response })
      const res = await AsyncStorage.removeItem("user")
      console.log({ res })
      const result = await signOut()
      console.log({ result })
      navigationRef.reset({
        index: 0,
        routes: [{ name: "LoginScreen" }]
      })
      setLogOutLoading(false)
    } catch (error) {
      setLogOutLoading(false)
      console.log("error")
      navigationRef.reset({
        index: 0,
        routes: [{ name: "LoginScreen" }]
      })
    }
  }

  const OnGoingTournament = ({ item }) => {
    return (
      <Box bg={"white"} p={6} borderRadius="lg" shadow="3" w={"64"}>
        <HStack
          alignItems="center"
          justifyContent="space-between"
          mb={3}
          w="full"
        >
          <Heading color="black" size="md" w="5/6">
            {item?.name || "N/A"}
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
      <AntDesign name="aliwangwang-o1" size={64} color={colors.primary[500]} />
      <Text color={colors.primary[500]} fontSize="lg" fontWeight="bold" mt="2">
        Oops. Nothing here
      </Text>
      <Text
        color={colors.primary[600]}
        fontSize="md"
        fontWeight="semibold"
        mb={2}
      >
        Check other tabs
      </Text>
      <Button
        bgColor={colors.primary[900]}
        onPress={() => {
          getTasks()
        }}
      >
        Refresh Now!
      </Button>
    </Box>
  )

  const Header = () => {
    // console.log(setLogOutLoading)
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
    <VStack space={5} alignItems={"flex-start"} mb={8}>
      <Skeleton.Text lines={1} alignItems="flex-start" w="16" />
      <Skeleton.Text lines={1} alignItems="flex-start" pr="12" />
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
        {loading ? <HeaderLoading /> : <Header />}
      </Box>
      <Box px={5}>
        {loading ? (
          <DataLoadingSkeleton />
        ) : data?.tournaments?.length >= 1 ? (
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
              data={data.tournaments}
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
    </Box>
  )
}
