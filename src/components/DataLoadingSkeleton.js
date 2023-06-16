import { Box, HStack, Skeleton, Text } from "native-base";

const DataLoadingSkeleton = () => (
  <Box shadow="4">
    <Text fontSize={"3xl"} bold mb={4}>
      On going tournaments
    </Text>
    <HStack
      borderWidth="1"
      w="40"
      space={8}
      rounded="md"
      _light={{
        borderColor: "coolGray.200"
      }}
      p="4"
    >
      <Skeleton flex="1" h="150" rounded="md" startColor="coolGray.100" />
    </HStack>
  </Box>
)

export default DataLoadingSkeleton;