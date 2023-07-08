import { Ionicons } from '@expo/vector-icons'
import { Box, HStack, Pressable, Text } from 'native-base'
import React from 'react'

const LogOutButton = ({logout}) => {
  return (
    <Pressable
    mt={2}
    onPress={logout}
  >
    {({ isHovered, isFocused, isPressed }) => {
      return (
        <Box
          style={{
            transform: [
              {
                scale: isPressed ? 0.96 : 1
              }
            ]
          }}
          py={3}
          px={3}
          rounded="8"
          mb={8}
          bgColor="blue.500"
        >
          <HStack space={2}
            alignItems="center"
          >
            <Ionicons
              name="log-out-outline"
              size={24}
              color="white"
            />
            <Text bold color="white">
              Log out
            </Text>
          </HStack>
        </Box>
      )
    }}
  </Pressable>
  )
}

export default LogOutButton