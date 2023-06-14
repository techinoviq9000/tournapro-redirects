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

  return (
    <NhostProvider nhost={nhost}>
      <NhostApolloProvider nhost={nhost}>
        <NativeBaseProvider>
          <NavigationContainer ref={navigationRef} theme={MyTheme}>
           <Router />
          </NavigationContainer>

          <StatusBar style="dark" />
        </NativeBaseProvider>
      </NhostApolloProvider>
    </NhostProvider>
  )
}
