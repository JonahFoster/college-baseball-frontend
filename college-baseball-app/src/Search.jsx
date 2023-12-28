import { Link } from 'react-router-dom';
import { Container, Card, CardContent, Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import teamInfo from './assets/logos.json';
import './assets/search.css'
import defaultLogo from'./assets/cbb-stats-logo.webp'

export default function Search({ players }) {

  const uniquePlayers = [];

  for (const player of players) {
    let isDuplicate = false;

    for (const uniquePlayer of uniquePlayers) {
      if (uniquePlayer.stats_player_seq === player.stats_player_seq) {
        isDuplicate = true;
        break;
      }
    }

    if (!isDuplicate) {
      uniquePlayers.push(player);
    }
  }

  function findTeamData(player) {
    const teamData = teamInfo.find(team => team.ncaa_name === player.school_name) || {};
    return teamData.logos || defaultLogo
  }

  return (
    <Container>
      <h2>Select a Player</h2>
      <div>
        {uniquePlayers.map((player) => (
          <Card key={player.stats_player_seq} variant="outlined" sx={{ mt: '1em' }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <img className="school-logo" src={findTeamData(player)} alt={player.school_name} />
                </Grid>
                <Grid item xs>
                  <Typography variant="h6">
                    <Link to={`/player/${player.stats_player_seq}`}>
                      {player.name}
                    </Link>
                  </Typography>
                  <Typography variant="body1">{player.school_name}</Typography>
                  <Typography variant="body2">Position: {player.pos}</Typography> {/* Assuming you have a position property */}
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
      stats_player_seq: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      school_name: PropTypes.string.isRequired,
      // Add other properties like position and year if they exist
    })
  ).isRequired,
};
