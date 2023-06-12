import { StatusBar } from "expo-status-bar"
import { NativeBaseProvider, Text, Box } from "native-base"
import { NhostApolloProvider } from "@nhost/react-apollo"
import { NhostClient, NhostProvider } from "@nhost/react"
import { NavigationContainer, DefaultTheme } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { navigationRef } from "./rootNavigation"
import screens from "./src/screens"
import * as SecureStore from "expo-secure-store"

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

  return (
    <NhostProvider nhost={nhost}>
      <NhostApolloProvider nhost={nhost}>
        <NativeBaseProvider>
          <NavigationContainer ref={navigationRef} theme={MyTheme}>
            <Stack.Navigator
              screenOptions={{
                headerShown: false
              }}
              initialRouteName="HomeScreen"
            >
                {screens.map(({ name, component, options }) => (
                  <Stack.Screen
                    key={`${component}-${name}`}
                    name={name}
                    component={component}
                    options={options}
                  />
                ))}
            </Stack.Navigator>
          </NavigationContainer>

          <StatusBar style="dark" />
        </NativeBaseProvider>
      </NhostApolloProvider>
    </NhostProvider>
  )
}
