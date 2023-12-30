import PropTypes from 'prop-types';
import { TableContainer, Typography, Table, TableBody, TableCell, TableHead, TableRow, Container } from '@mui/material';

export default function Pitching({ data }) {
  // Check if there is any pitching data
  const hasPitchingData = data && Object.keys(data).length > 0

  return (
    <Container>
      {hasPitchingData && (
        <TableContainer style={{ margin: 'auto', marginTop: '20px' }}>
          <Typography sx={{ my: '1em' }} variant="h5">
            Pitching
          </Typography>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell>Season</TableCell>
                <TableCell>APP</TableCell>
                <TableCell>W</TableCell>
                <TableCell>L</TableCell>
                <TableCell>R</TableCell>
                <TableCell>H</TableCell>
                <TableCell>BB</TableCell>
                <TableCell>ERA</TableCell>
                <TableCell>IP</TableCell>
                <TableCell>ER</TableCell>
                <TableCell>SO</TableCell>
                <TableCell>BF</TableCell>
                <TableCell>WP</TableCell>
                <TableCell>HB</TableCell>
                <TableCell>Pitches</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(data.stats).map(([year, stats]) => (
                stats.pitching ? (
                <TableRow key={year}>
                  <TableCell>{year}</TableCell>
                  <TableCell>{stats.pitching.App}</TableCell>
                  <TableCell>{stats.pitching.W}</TableCell>
                  <TableCell>{stats.pitching.L}</TableCell>
                  <TableCell>{stats.pitching.R}</TableCell>
                  <TableCell>{stats.pitching.H}</TableCell>
                  <TableCell>{stats.pitching.BB}</TableCell>
                  <TableCell>{stats.pitching.ERA}</TableCell>
                  <TableCell>{stats.pitching.IP}</TableCell>
                  <TableCell>{stats.pitching.ER}</TableCell>
                  <TableCell>{stats.pitching.SO}</TableCell>
                  <TableCell>{stats.pitching.BF}</TableCell>
                  <TableCell>{stats.pitching.WP}</TableCell>
                  <TableCell>{stats.pitching.HB}</TableCell>
                  <TableCell>{stats.pitching.pitches}</TableCell>
                </TableRow>
                ) : null
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}

Pitching.propTypes = {
  data: PropTypes.object.isRequired,
};
