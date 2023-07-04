import { useUserData, useUserDefaultRole } from "@nhost/react";
import { Ionicons } from "@expo/vector-icons";
import { Box, Button, HStack, ScrollView, Stack, Text, Image, Pressable} from "native-base";
import React from "react";
import { useSelector } from "react-redux";
import { navigationRef } from "../../../rootNavigation";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { MaterialIcons } from '@expo/vector-icons';

const GET_REGTEAMS = gql`
query RegTeams($where: team_tournaments_bool_exp!) {
  team_tournaments(where: $where) {
    team_tournaments_team {
      id
      team_name
      team_image
      status
    }
    player_captain {
      player_name
    }
  }
}

`;

const ViewRegisteredTeamsScreen = () => {
  const tournamentDetails = useSelector(
    (state) => state.tournament.tournamentDetails
  )
  console.log(tournamentDetails)
  const tournament_id = tournamentDetails.id;
  console.log({tournament_id})
  const userRole = useUserDefaultRole();
  let variables = {};
  if (userRole == "manager") {
    variables.where = {
      tournament_id: { _eq: tournament_id },
      team_tournaments_team: { status: { _eq: "Approved" } },
    };
  }
  if (userRole == "organizer") {
    variables.where = { tournament_id: { _eq: tournament_id } };
  }
  const { loading, data, error } = useQuery(GET_REGTEAMS, {
    variables,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {},
    onError: (e) => {
      console.log(e);
    },
  });
  // console.log(data);

  const Regteams = ({ item }) => {
    console.log(item);
    return (
      <Pressable onPress={() => navigationRef.navigate("PlayerScreen", {
        team_id: item?.team_tournaments_team?.id
      })}>

      <HStack marginTop="30px">
        <Box>
      <Box display="flex" 
      flexDirection="row"
      alignItems="center" 
      padding="20px" 
      borderRadius="md" 
      marginTop="20px" 
      borderWidth="2"  
      justifyContent="space-between"
      borderLeftColor="red" 
      width="300px" 
      height="90px">
        <Image display="flex" flexDirection="row" borderRadius="10px" source={{
          uri: item?.team_tournaments_team?.team_image
    }} alt="Alternate Text" size="xs"/>
        <Box marginRight="50px">
        <Text fontSize="lg" display="flex" flexDirection="row" fontWeight="bold">{item?.team_tournaments_team?.team_name}</Text>
        </Box>
        <MaterialIcons display="flex" flexDirection="row" name="navigate-next" size={24} color="black"/>
      <Text display="flex" flexDirection="column">{item?.player_captain?.player_name}</Text>
      </Box>
      </Box>
      </HStack>
          </Pressable>
    );
  };

  return (
    <Box>
      <Box padding="20px">
        <Ionicons
          name="arrow-back"
          size={24}
          color="black"
          onPress={() => navigationRef.goBack()}
        />
      </Box>
      <Box padding="20px" display="flex" alignItems="center">
        <Text fontSize="30px" fontWeight="bold">
          Tournament
        </Text>
        <Text marginTop="10px">List of Registered Teams</Text>
        {loading ? (
          <Text>Loading</Text>
        ) : data?.team_tournaments.length > 0 ? (
          data?.team_tournaments.map((item) => <Regteams item={item} />)
        ) : (
          <Text>NoData</Text>
        )}
      </Box>
      
    </Box>
  );
};

export default ViewRegisteredTeamsScreen;
