import { Link } from 'react-router-dom';
import { Container, Card, CardContent, Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import teamInfo from './assets/logos.json';
import './assets/search.css'
import defaultLogo from'./assets/cbb-stats-logo.webp'

export default function Search({ players }) {
  console.log(players, "players");

  // Flatten the array of arrays into a single array
  const allPlayers = players.flat();
  
  const uniquePlayers = [];

  for (const player of allPlayers) {
    if (!uniquePlayers.some(uniquePlayer => uniquePlayer.id === player.id)) {
      uniquePlayers.push(player);
    }
  }

  function findTeamData(player) {
    const teamData = teamInfo.find(team => team.ncaa_name === player.school) || {};
    return teamData.logos || defaultLogo;
  }

  console.log("uniquePlayers", uniquePlayers);
  return (
    <Container>
      <h2>Select a Player</h2>
      <div>
        {uniquePlayers.map((player) => (
          <Card key={player.id} variant="outlined" sx={{ mt: '1em' }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <img className="school-logo" src={findTeamData(player)} alt={player.school} />
                </Grid>
                <Grid item xs>
                  <Typography variant="h6">
                    <Link to={`/player/${player.id}`}>
                      {player.name}
                    </Link>
                  </Typography>
                  <Typography variant="body1">{player.school}</Typography>
                  <Typography variant="body2">Position: {player.position}</Typography> 
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
}

Search.propTypes = {
  players: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      school_name: PropTypes.string.isRequired,
    })
  ).isRequired,
};
