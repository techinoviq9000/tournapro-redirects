import { StatusBar } from "expo-status-bar"
import { NativeBaseProvider, Text, Box, Center } from "native-base"
import { NhostApolloProvider } from "@nhost/react-apollo"
import { NhostClient, NhostProvider } from "@nhost/react"
import { NavigationContainer, DefaultTheme } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { navigationRef } from "./rootNavigation"
import * as SecureStore from "expo-secure-store"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import {homeScreens, authScreens, tournamentSreen} from "./src/screens"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"

const nhost = new NhostClient({
  subdomain: "wepuirejkqdmeaineqto",
  region: "ap-south-1",
  clientStorageType: "expo-secure-storage",
  clientStorage: SecureStore,
  autoSignIn: false,
  autoLogin: true,
  autoRefreshToken: true
})

const Stack = createNativeStackNavigator()

export default function App() {
  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "white"
    }
  }

  const Tab = createBottomTabNavigator()

  function SettingsScreen() {
    return (
      <Center>
        <Text>Settings!</Text>
      </Center>
    )
  }

  function TestScreen() {
    return (
      <Center>
        <Text>Home!</Text>
      </Center>
    )
  }

  const HomeTabs = () => {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          activeTintColor: "tomato",
          inactiveTintColor: "gray",
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName
            if (route.name === "Home") {
              iconName = focused
                ? "home"
                : "home-outline"
            } else if (route.name === "Tournament") {
              iconName = 'flag-checkered'
              return <MaterialCommunityIcons name={iconName} size={size} color={color} />
            }

            return <Ionicons name={iconName} size={size} color={color} />
          }
        })}
        initialRouteName='Home'
      >
        <Tab.Screen name="Home" component={HomeStackScreen} />
        <Tab.Screen name="Tournament" component={TournamentStackScreen} />
      </Tab.Navigator>
    )
  }

  const HomeStack = createNativeStackNavigator()
  function HomeStackScreen() {
    return (
      <HomeStack.Navigator
        screenOptions={{
          headerShown: false
        }}
        initialRouteName="HomeScreen"
      >
        {homeScreens.map(({ name, component, options }) => (
          <HomeStack.Screen
            key={`${component}-${name}`}
            name={name}
            component={component}
            options={options}
          />
        ))}
      </HomeStack.Navigator>
    )
  }

  const TournamentStack = createNativeStackNavigator()
  function TournamentStackScreen() {
    return (
      <TournamentStack.Navigator
        screenOptions={{
          headerShown: false
        }}
        initialRouteName="SelectOrViewTournamentScreen"
      >
        {tournamentSreen.map(({ name, component, options }) => (
          <TournamentStack.Screen
            key={`${component}-${name}`}
            name={name}
            component={component}
            options={options}
          />
        ))}
      </TournamentStack.Navigator>
    )
  }

  const AuthStack = createNativeStackNavigator()
  function AuthStacks() {
    return (
      <AuthStack.Navigator
        screenOptions={{
          headerShown: false
        }}
        initialRouteName="LoginScreen"
      >
        {authScreens.map(({ name, component, options }) => (
          <AuthStack.Screen
            key={`${component}-${name}`}
            name={name}
            component={component}
            options={options}
          />
        ))}
      </AuthStack.Navigator>
    )
  }

  return (
    <NhostProvider nhost={nhost}>
      <NhostApolloProvider nhost={nhost}>
        <NativeBaseProvider>
          <NavigationContainer ref={navigationRef} theme={MyTheme}>
          <Stack.Navigator
        initialRouteName="AuthStack"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="AuthStack" component={AuthStacks} />
        <Stack.Screen name="HomeStack" component={HomeTabs} />
      </Stack.Navigator>
          </NavigationContainer>

          <StatusBar style="dark" />
        </NativeBaseProvider>
      </NhostApolloProvider>
    </NhostProvider>
  )
}
