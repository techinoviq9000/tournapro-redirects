import { StatusBar } from "expo-status-bar"
import { NativeBaseProvider } from "native-base"
import { NhostApolloProvider } from "@nhost/react-apollo"
import {
  NhostClient,
  NhostProvider,
} from "@nhost/react"
import { NavigationContainer, DefaultTheme } from "@react-navigation/native"
import { navigationRef } from "./rootNavigation"
import * as SecureStore from "expo-secure-store"
import Router from "./src/screens/Router"
import { store } from "./store/store";
import { Provider } from "react-redux";

const nhost = new NhostClient({
  subdomain: "wepuirejkqdmeaineqto",
  region: "ap-south-1",
  clientStorageType: "expo-secure-storage",
  clientStorage: SecureStore,
  autoSignIn: false,
  autoLogin: true,
  autoRefreshToken: true
})


export default function App() {
  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "white"
    }
  }

  const config = {
    dependencies: {
      // For Expo projects (Bare or managed workflow)
      "linear-gradient": require("expo-linear-gradient").LinearGradient,
      // For non expo projects
      // 'linear-gradient': require('react-native-linear-gradient').default,
    },
  };
  

  return (
    <NhostProvider nhost={nhost}>
      <NhostApolloProvider nhost={nhost}>
      <NativeBaseProvider config={config}>
        <Provider store={store}>
          <NavigationContainer ref={navigationRef} theme={MyTheme}>
           <Router />
          </NavigationContainer>
          </Provider>
          <StatusBar style="dark" />
        </NativeBaseProvider>
      </NhostApolloProvider>
    </NhostProvider>
  )
}
