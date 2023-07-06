import { Ionicons } from "@expo/vector-icons"
import { Box } from "native-base"
import { navigationRef } from "../../rootNavigation"

const GoBack = () => (
  <Box w="full" display={"flex"} justifyItems={"center"}>
    <Ionicons
      name="arrow-back"
      size={24}
      color="black"
      onPress={() => navigationRef.goBack()}
    />
  </Box>
)

export default GoBack
