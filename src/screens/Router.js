import { useAuthenticationStatus } from "@nhost/react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { View, Text, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  authScreens,
  homeScreens,
  tournamentSreen,
  userProfileScreens,
} from ".";
import SplashScreen from "./SplashScreen";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "native-base";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import MyTournaments from "./UserProfile/MyTournaments";
import MyTeamsScreen from "./UserProfile/MyTeamsScreen";
const Router = () => {
  const { colors } = useTheme();
  const Stack = createNativeStackNavigator();

  const Tab = createBottomTabNavigator();
  const HomeTabs = () => {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: colors.blue[500],
          tabBarInactiveTintColor: colors.gray[500],
          // tabBarStyle: {
          //   height: 5
          // },
          tabBarLabelStyle: {
            paddingBottom: 5,
          },
          headerShown: false,
          lazy: true,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Tournament") {
              iconName = "flag-checkered";
              return (
                <MaterialCommunityIcons
                  name={iconName}
                  size={size}
                  color={color}
                />
              );
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        initialRouteName="Home"
      >
        <Tab.Screen name="Home" component={HomeStackScreen} />
        <Tab.Screen name="Tournament" component={TournamentStackScreen} />
      </Tab.Navigator>
    );
  };

  function CustomDrawerContent(props) {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Close drawer"
          onPress={() => props.navigation.closeDrawer()}
        />
        <DrawerItem
          label="Toggle drawer"
          onPress={() => props.navigation.toggleDrawer()}
        />
      </DrawerContentScrollView>
    );
  }

  const Drawer = createDrawerNavigator();
  const DrawerNavigator = () => {
    return (
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
          drawerPosition: "right",
        }}
      >
        <Drawer.Screen name="Dashboard" component={HomeTabs} />
        <Drawer.Screen name="Profile" component={UserProfileStackScreen} />
        <Drawer.Screen name="MyTournaments" component={MyTournaments} />
        <Drawer.Screen name="My Team" component={MyTeamsScreen} />
      </Drawer.Navigator>
    );
  };

  const HomeStack = createNativeStackNavigator();
  const HomeStackScreen = () => {
    return (
      <HomeStack.Navigator
        screenOptions={{
          headerShown: false,
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
    );
  };

  const UserProfileStack = createNativeStackNavigator();
  const UserProfileStackScreen = () => {
    return (
      <UserProfileStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="ViewUserProfileScreen"
      >
        {userProfileScreens.map(({ name, component, options }) => (
          <UserProfileStack.Screen
            key={`${component}-${name}`}
            name={name}
            component={component}
            options={options}
          />
        ))}
      </UserProfileStack.Navigator>
    );
  };

  const TournamentStack = createNativeStackNavigator();
  const TournamentStackScreen = () => {
    return (
      <TournamentStack.Navigator
        screenOptions={{
          headerShown: false,
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
    );
  };

  const AuthStack = createNativeStackNavigator();
  const AuthStacks = () => {
    return (
      <AuthStack.Navigator
        screenOptions={{
          headerShown: false,
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
    );
  };

  const { isAuthenticated, isLoading } = useAuthenticationStatus();

  return (
    <>
      {isLoading ? (
        <>
          <SplashScreen />
        </>
      ) : !isAuthenticated ? (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="AuthStack" component={AuthStacks} />
        </Stack.Navigator>
      ) : (
        <DrawerNavigator
          useLegacyImplementation
          drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
          <Drawer.Screen name="Feed" />
          <Drawer.Screen name="Notifications" />
        </DrawerNavigator>
      )}
    </>
  );
};

export default Router;
