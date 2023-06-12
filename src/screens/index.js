import LoginScreen from "./Auth/LoginScreen"
import HomeScreen from "./Home/HomeScreen"
import SignUpScreen from "./Auth/SignUpScreen"
import SelectRoleScreen from "./Auth/SelectRoleScreen"
import { ScreenStackHeaderBackButtonImage } from "react-native-screens";
const navigationOptions = ({ navigation }) => ({
  headerLeft: <ScreenStackHeaderBackButtonImage onPress={() => navigation.goBack(null)} />,
});

const screens = [
  {
    name: "HomeScreen",
    component: HomeScreen,
    options: {
      headerShown: false,
      gestureEnabled: false,
      cardOverlayEnabled: false
    }
  },
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
export default screens
