import PropTypes from 'prop-types';
import { Typography, TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Container } from '@mui/material';

export default function Batting({ data }) {
  const allBattingStats = data.filter(stat => stat.data_type === 'batting');

  function formatNumber(num) {
    return num < 1 ? num.toString().substring(1) : num.toString();
  }

  return (
    <Container>
      <TableContainer style={{ margin: 'auto' }}>
        <Typography sx={{ my: '1em' }} variant="h5">
          Batting
        </Typography>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell>Season</TableCell>
              <TableCell>BA</TableCell>
              <TableCell>OBP</TableCell>
              <TableCell>SLG</TableCell>
              <TableCell>OPS</TableCell>
              <TableCell>R</TableCell>
              <TableCell>AB</TableCell>
              <TableCell>H</TableCell>
              <TableCell>2B</TableCell>
              <TableCell>3B</TableCell>
              <TableCell>HR</TableCell>
              <TableCell>RBI</TableCell>
              <TableCell>BB</TableCell>
              <TableCell>K</TableCell>
              <TableCell>SB</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allBattingStats.reverse().map(stats => {
              const battingAverage = formatNumber((stats.H / stats.AB).toFixed(3));
              const sluggingPercentage = formatNumber((stats.TB / stats.AB).toFixed(3));
              const onBasePercentage = formatNumber(((stats.H + stats.BB + stats.HBP) / (stats.AB + stats.BB + stats.HBP + stats.SF)).toFixed(3));
              const onBasePlusSlug = formatNumber((parseFloat(sluggingPercentage) + parseFloat(onBasePercentage)).toFixed(3));

              return (
                <TableRow key={stats.season}>
                  <TableCell>{stats.season}</TableCell>
                  <TableCell>{battingAverage}</TableCell>
                  <TableCell>{onBasePercentage}</TableCell>
                  <TableCell>{sluggingPercentage}</TableCell>
                  <TableCell>{onBasePlusSlug}</TableCell>
                  <TableCell>{stats.R}</TableCell>
                  <TableCell>{stats.AB}</TableCell>
                  <TableCell>{stats.H}</TableCell>
                  <TableCell>{stats['2B']}</TableCell>
                  <TableCell>{stats['3B']}</TableCell>
                  <TableCell>{stats.HR}</TableCell>
                  <TableCell>{stats.RBI}</TableCell>
                  <TableCell>{stats.BB}</TableCell>
                  <TableCell>{stats.K}</TableCell>
                  <TableCell>{stats.SB}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

Batting.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};
