import { Ionicons } from "@expo/vector-icons"
import { Box } from "native-base"
import { navigationRef } from "../../rootNavigation"

const GoBack = ({customOnPress = () => navigationRef.goBack()}) => (
  <Box w="full" display={"flex"} justifyItems={"center"}>
    <Ionicons
      name="arrow-back"
      size={24}
      color="black"
      onPress={customOnPress}
    />
  </Box>
)

export default GoBack
