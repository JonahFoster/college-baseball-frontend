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
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
  const { stats_player_seq } = useParams(); 
  
  useEffect(() => {
    setIsLoading(true);
    const docRef = doc(firestore, 'collegebaseballplayer_unified', stats_player_seq); // Create a reference to the document
    getDoc(docRef)
      .then(docSnap => {
        if (!docSnap.exists()) {
          throw new Error('Player not found');
        }
        setData([docSnap.data()]);
        setIsLoading(false);
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false);
      });
  }, [stats_player_seq]);
  

  const playerInfo = data[data.length - 1] || {};  
  const { name, Jersey, pos, Yr, school_name } = playerInfo;

  const teamData = teamInfo.find(team => team.ncaa_name === school_name) || {}; 

  const hasBatting = !!data.find(stat => stat.data_type === 'batting' && stat.AB !== 0);
  const hasFielding = !!data.find(stat => stat.data_type === 'fielding');
  const hasPitching = !!data.find(stat => stat.data_type === 'pitching' && stat.pitches !== 0);

  function createFullYear(year) {
    if (year === "Fr") return "Freshman";
    if (year === "So") return "Sophomore";
    if (year === "Jr") return "Junior";
    if (year === "Sr") return "Senior";
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

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
              label={school_name} 
              sx={{ 
                mr: '5px',
                backgroundColor: (theme) => teamData.primary || theme.palette.primary.main,
                color: theme => theme.palette.getContrastText(teamData.primary || theme.palette.primary.main),
              }}
            />
            <Chip 
              label={`#${Jersey}`} 
              sx={{ 
                mr: '5px',
                backgroundColor: (theme) => teamData.primary || theme.palette.primary.main,
                color: theme => theme.palette.getContrastText(teamData.primary || theme.palette.primary.main),
              }}
            />
            <Chip 
              label={pos} 
              sx={{ 
                mr: '5px',
                backgroundColor: (theme) => teamData.primary || theme.palette.primary.main,
                color: theme => theme.palette.getContrastText(teamData.primary || theme.palette.primary.main),
              }}
            />
            <Chip 
              label={createFullYear(Yr)} 
              sx={{ 
                backgroundColor: (theme) => teamData.primary || theme.palette.primary.main,
                color: theme => theme.palette.getContrastText(teamData.primary || theme.palette.primary.main),
              }}
            />
            </Box>
          </Box>
          <img src={teamData.logos || defaultLogo} alt={`${school_name} logo`} className="school-logo" />
        </CardContent>
      </Card>
      {hasBatting && (
        <Card variant="outlined" sx={{ mt: '10px' }}>
          <Batting data={data} />
        </Card>
      )}
      {hasPitching && (
        <Card variant="outlined" sx={{ mt: '10px' }}>
          <Pitching data={data} />
        </Card>
      )}
      {hasFielding && (
        <Card variant="outlined" sx={{ mt: '10px' }}>
          <Fielding data={data} />
        </Card>
      )}
    </Container>
  );
}
