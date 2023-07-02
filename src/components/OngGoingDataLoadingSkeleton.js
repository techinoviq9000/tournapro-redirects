import { Box, HStack, Skeleton, Text } from "native-base";

const OngGoingDataLoadingSkeleton = () => (
  <Box shadow="4" px={5}>
    <Text fontSize={"2xl"} bold mb={4}>
      On going tournaments
    </Text>
    <HStack space={5}>
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
    </HStack>
  </Box>
)

export default OngGoingDataLoadingSkeleton;