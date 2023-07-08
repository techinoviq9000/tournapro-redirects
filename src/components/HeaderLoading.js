import { Skeleton, VStack } from "native-base";

const HeaderLoading = () => (
  <VStack space={5} alignItems={"flex-start"}>
    <Skeleton.Text lines={1} alignItems="flex-start" w="16" />
    <Skeleton.Text lines={1} alignItems="flex-start" pr="12" />
  </VStack>
)

export default HeaderLoading;