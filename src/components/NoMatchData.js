import { AntDesign } from "@expo/vector-icons"
import { Box, Button, Text } from "native-base"

const NoMatchData = ({getData, colors}) => (
  <Box flex={1} alignItems="center" justifyContent="center" my="20" w="full">
    <AntDesign name="warning" size={64} color={colors.primary[500]} />
    <Text color={colors.primary[500]} fontSize="lg" fontWeight="bold" my="2">
      No Matches found.
    </Text>
    <Button
      bgColor={colors.primary[900]}
      onPress={() => {
        getData()
      }}
    >
      Check Again!
    </Button>
  </Box>
)

export default NoMatchData;
