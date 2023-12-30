import PropTypes from 'prop-types';
import { Typography, TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Container } from '@mui/material';

export default function Batting({ data }) {
  const hasBattingData = data && Object.keys(data).length > 0

  function formatNumber(num) {
    return num < 1 ? num.toString().substring(1) : num.toString();
  }

  return (
    <Container>
      {hasBattingData && (
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
            {Object.entries(data.stats).map(([year, stats]) => {
                const battingAverage = formatNumber((stats.batting.H / stats.batting.AB).toFixed(3));
                const sluggingPercentage = formatNumber((stats.batting.TB / stats.batting.AB).toFixed(3));
                const onBasePercentage = formatNumber(((stats.batting.H + stats.batting.BB + stats.batting.HBP) / (stats.batting.AB + stats.batting.BB + stats.batting.HBP + stats.batting.SF)).toFixed(3));
                const onBasePlusSlug = formatNumber((parseFloat(sluggingPercentage) + parseFloat(onBasePercentage)).toFixed(3));

                return (
                  <TableRow key={year}>
                    <TableCell>{year}</TableCell>
                    <TableCell>{battingAverage}</TableCell>
                    <TableCell>{onBasePercentage}</TableCell>
                    <TableCell>{sluggingPercentage}</TableCell>
                    <TableCell>{onBasePlusSlug}</TableCell>
                    <TableCell>{stats.batting.R}</TableCell>
                    <TableCell>{stats.batting.AB}</TableCell>
                    <TableCell>{stats.batting.H}</TableCell>
                    <TableCell>{stats.batting['2B']}</TableCell>
                    <TableCell>{stats.batting['3B']}</TableCell>
                    <TableCell>{stats.batting.HR}</TableCell>
                    <TableCell>{stats.batting.RBI}</TableCell>
                    <TableCell>{stats.batting.BB}</TableCell>
                    <TableCell>{stats.batting.K}</TableCell>
                    <TableCell>{stats.batting.SB}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}

Batting.propTypes = {
  data: PropTypes.object.isRequired,
};
