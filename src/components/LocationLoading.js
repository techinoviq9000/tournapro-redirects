import { Skeleton, VStack } from "native-base";

const LocationLoading = () => (
  <VStack space={5} alignItems={"flex-start"} mb={1}>
    <Skeleton.Text lines={1} alignItems="flex-start" w="32" />
  </VStack>
)

export default LocationLoading;