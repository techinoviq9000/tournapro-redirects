import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useUserData } from "@nhost/react";
import { Box, Input, Stack, Text } from "native-base";
import React, { useEffect } from "react";
import { Alert, Button, StyleSheet} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const GET_TEAM_PLAYERS = gql`
  query GetTeamPlayers($team_id: Int!) {
    player_teams(where: { team_id: { _eq: $team_id } }) {
      player {
        player_name
      }
    }
  }
`;

const ADD_STATUS_REASON = gql`
mutation MyMutation($id: Int!, $status: String!, $reason: String) {
  update_teams_by_pk(pk_columns: {id: $id}, _set: {status: $status, reason: $reason}) {
    id
  }
}
`


const PlayerScreen = ({route}) => {
  const team = route?.params?.team
  const team_id = team.id
  const status = team.status
  console.log(status)
  const TeamPlayer = ({ item }) => {
    return (
      <Box>
      <Box marginTop="20px" display="flex" borderRadius="15px" padding="20px" borderWidth="1px" borderStyle="solid" borderColor="black">
        <Text>{item?.player?.player_name}</Text>
      </Box>
      </Box>
    );
  };

  const userData = useUserData();
  const [addStatusnReason] = useMutation(ADD_STATUS_REASON);
  const [getTeamPlayers, {data, loading, error}] = useLazyQuery(GET_TEAM_PLAYERS, {
    variables: {
      team_id
    },
    onCompleted: data => {
      console.log(data)
    },
    onError: e => {
      console.log(e)
    }
  })


  useEffect(() => {
    if (userData) {
      getTeamPlayers();
    }
  }, []);

  const abc = (value) => {
    console.log(value)
  }

  const simpleAlert = () => {
    Alert.alert(
      //Title
      'Select the following reasons for team rejection',
      //Body
      '',
      [
        {
          text: 'Rules not followed',
          onPress: () => addStatusnReason({variables:{
            status: "Rejected",
            id: team_id,
            reason: "Rules not followed"
          }})
        },
          // onPress: () => {
            
          //   console.log("Reason 1 Selected")
          // }
        
        {
          text: 'Inadequate Behaviour',
          onPress: () => addStatusnReason({variables:{
            status: "Rejected",
            id: team_id,
            reason: "Inadequate Behaviour"
          }})
          // onPress: () => {
          //   console.log("Reason 2 Selected")
          // }
        },
        {
          text: 'Less Participants',
          onPress: () => addStatusnReason({variables:{
            status: "Rejected",
            id: team_id,
            reason: "Less Participants"
          }})
          // onPress: () => {
          //   abc("Less Participants | R3")
          // }
        }
      ]
    )
  }

  return (
    <Box padding="20px" marginTop="40px">

      <Text fontSize="30px">Team Players</Text>
      <Text>Players for Tournament</Text>
      {data && data?.player_teams?.length > 0 && data?.player_teams.map(item => <TeamPlayer item={item} />)}
      <Stack marginTop="20px"/>

      <SafeAreaView>
      {data && data?.player_teams?.length  > 0 && 
      <Box style={StyleSheet.container} marginTop="20px" display="flex" flexDirection="row" justifyContent="space-evenly">
        {status != "Approved" && (
      <Button title="Approve" onPress={() => addStatusnReason({variables:{
        status: "Approved",
        id: team_id
      }})}/>)}
      <Button title="Reject" onPress={simpleAlert}/>
      </Box>}
      </SafeAreaView>


      {/* {status == "Approved" && (
            <Button height="50px" colorScheme={"blue"} onPress={() => navigationRef.navigate("TournamentRegistrationScreen")}>Edit Tournament</Button>
          )} */}


      {/* {data && data?.player_teams?.length > 0 && data?.player_teams.map(item => <Button>Hi</Button>)} */}
      {/* <Box marginTop="20px" display="flex" flexDirection="row" justifyContent="space-evenly">
      <Button onPress={() => console.log("hello world")}>Approve</Button>
      <Button onPress={() => console.log("hello world now")}>Reject</Button> */}
    </Box>
      
    
  );
};

export default PlayerScreen;


