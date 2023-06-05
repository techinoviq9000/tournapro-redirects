import Constants from "expo-constants"
import { Text } from "native-base";

// eas update --branch development
// eas build --profile development
export const VERSION = "1.8.3"

const AppVersion  = () => {
  return (
    <Text color="black" textAlign="center" mb={2}>
    <Text color="black" fontWeight="bold">
      Version: {VERSION}
    </Text>
  </Text>
  )
}

export default AppVersion;