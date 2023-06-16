import { HStack, Skeleton } from "native-base";

const SportsLoadingSkeleton = () => (
  <HStack
    shadow="4"
    flexDir={"row"}
    justifyContent={"space-between"}
    flex="1"
  >
    <Skeleton h="20" w="20" rounded="md" startColor="coolGray.100" />
    <Skeleton h="20" w="20" rounded="md" startColor="coolGray.100" />
    <Skeleton h="20" w="20" rounded="md" startColor="coolGray.100" />
    <Skeleton h="20" w="20" rounded="md" startColor="coolGray.100" />
  </HStack>
)

export default SportsLoadingSkeleton;