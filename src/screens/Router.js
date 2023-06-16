import { useAuthenticationStatus } from "@nhost/react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import React, { useState } from "react"
import { authScreens, homeScreens, tournamentSreen } from "."
import SplashScreen from "./SplashScreen"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { Center, Spinner, useTheme } from "native-base"
import { StatusBar } from "expo-status-bar"

const Router = () => {
  const { colors } = useTheme()
  const Stack = createNativeStackNavigator()

  const Tab = createBottomTabNavigator()
  const LazyPlaceholder = () => ( <Center> <Spinner size="lg" /> </Center> );

  const HomeTabs = () => {
    return (
      <Tab.Navigator
      lazyPlaceholder={LazyPlaceholder}
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: colors.blue[500],
          tabBarInactiveTintColor: colors.gray[500],
          // tabBarStyle: {
          //   height: 5
          // },
          tabBarLabelStyle: {
            paddingBottom: 5
          },
          headerShown: false,
          lazy: true,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName
            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline"
            } else if (route.name === "Tournament") {
              iconName = "flag-checkered"
              return (
                <MaterialCommunityIcons
                  name={iconName}
                  size={size}
                  color={color}
                />
              )
            }

            return <Ionicons name={iconName} size={size} color={color} />
          }
        })}
        initialRouteName="Home"
      >
        <Tab.Screen name="Home" component={HomeStackScreen} />
        <Tab.Screen name="Tournament" component={TournamentStackScreen} />
      </Tab.Navigator>
    )
  }

  const HomeStack = createNativeStackNavigator()
  const HomeStackScreen = () => {
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
  const TournamentStackScreen = () => {
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
  const AuthStacks = () => {
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

  const { isAuthenticated, isLoading } = useAuthenticationStatus()

  return (
    <>
      {isLoading ? (
        <>
          <SplashScreen />
        </>
      ) : !isAuthenticated ? (
        <Stack.Navigator
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen name="AuthStack" component={AuthStacks} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen name="HomeStack" component={HomeTabs} />
        </Stack.Navigator>
      )}
    </>
  )
}

export default Router
