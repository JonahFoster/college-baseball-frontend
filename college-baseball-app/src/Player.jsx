import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, CardContent, Typography, Box, Chip, CircularProgress } from '@mui/material';
import { firestore } from '../firebase'; // Ensure this path is correct
import { doc, getDoc } from "firebase/firestore"; // Import required Firestore functions
import Batting from './Batting';
import Fielding from './Fielding';
import Pitching from './Pitching';
import teamInfo from './assets/logos.json';
import './assets/player.css';
import defaultLogo from './assets/cbb-stats-logo.webp';

export default function Player() {
  const [playerData, setPlayerData] = useState({});
  const [isLoading, setIsLoading] = useState(true); 
  const { stats_player_seq } = useParams(); 

  useEffect(() => {
    setIsLoading(true);
    const docRef = doc(firestore, 'collegebaseballplayer', stats_player_seq);
    getDoc(docRef)
      .then(docSnap => {
        if (!docSnap.exists()) {
          throw new Error('Player not found');
        }
        setPlayerData(docSnap.data());
        setIsLoading(false);
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false);
      });
  }, [stats_player_seq]);

  const { name, jerseyNumber, position, class: playerClass, school } = playerData;

  const teamData = teamInfo.find(team => team.ncaa_name === school) || {}; 

  let hasPitching = false;
  let hasBatting = false;
  let hasFielding = false;
  
  for (let year in playerData.stats) {
      if (playerData.stats[year].pitching && playerData.stats[year].pitching.pitches > 0) {
          hasPitching = true;
      }
  
      if (playerData.stats[year].batting && playerData.stats[year].batting.AB > 0) {
          hasBatting = true;
      }
  
      if (playerData.stats[year].fielding && playerData.stats[year].fielding.GP > 0) {
          hasFielding = true;
      }
  
      if (hasPitching && hasBatting && hasFielding) {
          break;
      }
  }

  function createFullYear(yearShort) {
    const yearMap = {"Fr": "Freshman", "So": "Sophomore", "Jr": "Junior", "Sr": "Senior"};
    return yearMap[yearShort] || yearShort;
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }
  console.log(playerData)
  return (
    <Container>
      <Card variant="outlined">
        <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4">
              {name}
            </Typography>
            <Box mt={2}>
            <Chip 
              label={school} 
              sx={{ 
                mr: '5px',
                backgroundColor: (theme) => teamData.primary || theme.palette.primary.main,
                color: theme => theme.palette.getContrastText(teamData.primary || theme.palette.primary.main),
              }}
            />
            <Chip 
              label={`#${jerseyNumber}`} 
              sx={{ 
                mr: '5px',
                backgroundColor: (theme) => teamData.primary || theme.palette.primary.main,
                color: theme => theme.palette.getContrastText(teamData.primary || theme.palette.primary.main),
              }}
            />
            <Chip 
              label={position} 
              sx={{ 
                mr: '5px',
                backgroundColor: (theme) => teamData.primary || theme.palette.primary.main,
                color: theme => theme.palette.getContrastText(teamData.primary || theme.palette.primary.main),
              }}
            />
            <Chip 
              label={createFullYear(playerClass)} 
              sx={{ 
                backgroundColor: (theme) => teamData.primary || theme.palette.primary.main,
                color: theme => theme.palette.getContrastText(teamData.primary || theme.palette.primary.main),
              }}
            />
            </Box>
          </Box>
          <img src={teamData.logos || defaultLogo} alt={`${school} logo`} className="school-logo" />
        </CardContent>
      </Card>
      {hasBatting && (
        <Card variant="outlined" sx={{ mt: '10px' }}>
          {console.log("Rendering Batting")}
          <Batting data={playerData} />
        </Card>
      )}
      {hasPitching && (
          <Card variant="outlined" sx={{ mt: '10px' }}>
            {console.log("Rendering Pitching")}
            <Pitching data={playerData} />
          </Card>
      )}
      {hasFielding && (
        <Card variant="outlined" sx={{ mt: '10px' }}>
          {console.log("Rendering Fielding")}
          <Fielding data={playerData} />
        </Card>
      )}
    </Container>
  );
}
