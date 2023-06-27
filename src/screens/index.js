import LoginScreen from "./Auth/LoginScreen"
import HomeScreen from "./Home/HomeScreen"
import SignUpScreen from "./Auth/SignUpScreen"
import SelectRoleScreen from "./Auth/SelectRoleScreen"
import TournamentScreen from "./Tournaments/TournamentScreen"
import SplashScreen from "./SplashScreen"
import TournamentOverviewScreen from "./Tournaments/TournamentOverviewScreen"
import TournamentRegistrationScreen from "./Tournaments/TournamentRegistrationScreen"
import ViewUserProfileScreen from "./UserProfile/ViewUserProfileScreen"
import EditProfile from "./UserProfile/EditProfile"
import ViewRegisteredTeamsScreen from "./UserProfile/ViewRegisteredTeamsScreen"

export const homeScreens = [
  {
    name: "HomeScreen",
    component: HomeScreen,
    options: {
      headerShown: false,
      gestureEnabled: false,
      cardOverlayEnabled: false
    }
  }
]
export const userProfileScreens = [
  {
    name: "ViewUserProfileSCreen",
    component: ViewUserProfileScreen,
    options: {
      headerShown: false,
      gestureEnabled: false,
      cardOverlayEnabled: false
    }
  },
  {
    name: "EditProfile",
    component: EditProfile,
    options: {
      headerShown: false,
      gestureEnabled: false,
      cardOverlayEnabled: false
    }
  }
]
export const tournamentSreen = [
  {
    name: "SelectOrViewTournamentScreen",
    component: TournamentScreen,
    options: {
      headerShown: false,
      gestureEnabled: false,
      cardOverlayEnabled: false
    }
  },
  {
    name: "TournamentOverviewScreen",
    component: TournamentOverviewScreen,
    options: {
      headerShown: false,
      gestureEnabled: false,
      cardOverlayEnabled: false
    }
  },
  {
    name: "TournamentRegistrationScreen",
    component: TournamentRegistrationScreen,
    options: {
      headerShown: false,
      gestureEnabled: false,
      cardOverlayEnabled: false
    }
  },
  {
    name: "ViewRegisteredTeamsScreen",
    component: ViewRegisteredTeamsScreen,
    options: {
      headerShown: false,
      gestureEnabled: false,
      cardOverlayEnabled: false
    }
  },
 
]
export const authScreens = [
  {
    name: "LoginScreen",
    component: LoginScreen,
    options: {
      headerShown: false,
      gestureEnabled: false,
      cardOverlayEnabled: false
    }
  },
  {
    name: "SignUpScreen",
    component: SignUpScreen,
    options: {
      gestureEnabled: false,
      cardOverlayEnabled: false
    }
  },

  
  {
    name: "SelectRoleScreen",
    component: SelectRoleScreen,
    options: {
      gestureEnabled: false,
      cardOverlayEnabled: false
    }
  }
]

export const splashScreen =  {
  name: "SplashScreen",
  component: SplashScreen,
  options: {
    headerShown: false,
    gestureEnabled: false,
    cardOverlayEnabled: false
  }
}