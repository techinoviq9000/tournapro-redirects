import { useUserData } from '@nhost/react'
import { Box, Text, Image } from 'native-base'

import React from 'react'

const ViewUserProfileScreen = () => {
  const userData = useUserData()
  return (
    <Box padding="auto" marginTop="40px" display="flex" alignItems="center">
        <Text>User Screen meri hai. </Text>
        <Image size={30} borderRadius={100} source={{
      uri: "https://s.gravatar.com/avatar"
    }} alt="Alternate Text" />
    </Box>
  )

  }

  export default ViewUserProfileScreen
