import { NhostClient } from "@nhost/react";
import * as SecureStore from "expo-secure-store";

export const nhost = new NhostClient({
  subdomain: "wepuirejkqdmeaineqto",
  region: "ap-south-1",
  clientStorageType: "expo-secure-storage",
  clientStorage: SecureStore,
  autoSignIn: false,
  autoLogin: true,
  autoRefreshToken: true,
});
