import { StatusBar } from "expo-status-bar";
import { NativeBaseProvider } from "native-base";
import { NhostApolloProvider } from "@nhost/react-apollo";
import { NhostProvider } from "@nhost/react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { navigationRef } from "./rootNavigation";
import Router from "./src/screens/Router";
import { store } from "./store/store";
import { Provider } from "react-redux";
import { nhost } from "./nhostClient";

export default function App() {
  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "white",
    },
  };

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
  );
}
