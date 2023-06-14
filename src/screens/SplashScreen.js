import { Box, Center, Image, Spinner, Text } from 'native-base'
import React from 'react'

const SplashScreen = () => {
  return (
    <Box safeArea mt={2} flex={"1"} justifyContent={"center"} alignItems={"center"} pb={20}>
      <Center>
        <Image
          alt="Logo"
          size="56"
          resizeMode="center"
          mb={10}
          // style={{width: "100%", paddingHorizontal: 10}}
          source={require("../../assets/Login/TournaProLogo.png")}
        />
        <Spinner size="lg" />
      </Center>      
    </Box>
  )
}

export default SplashScreen