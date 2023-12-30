import PropTypes from 'prop-types';
import { Typography, TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Container } from '@mui/material';

export default function Fielding({ data }) {
  const hasFieldingData = data && Object.keys(data).length > 0

  return (
    <Container>
      {hasFieldingData && (
        <TableContainer style={{ margin: 'auto' }}>
          <Typography sx={{ my: '1em' }} variant="h5">
            Fielding
          </Typography>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell>Season</TableCell>
                <TableCell>GP</TableCell>
                <TableCell>GS</TableCell>
                <TableCell>PO</TableCell>
                <TableCell>A</TableCell>
                <TableCell>TC</TableCell>
                <TableCell>E</TableCell>
                <TableCell>FldPct</TableCell>
                <TableCell>IDP</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(data.stats).map(([year, stats]) => (
                <TableRow key={year}>
                  <TableCell>{year}</TableCell>
                  <TableCell>{stats.fielding.GP}</TableCell>
                  <TableCell>{stats.fielding.GS}</TableCell>
                  <TableCell>{stats.fielding.PO}</TableCell>
                  <TableCell>{stats.fielding.A}</TableCell>
                  <TableCell>{stats.fielding.TC}</TableCell>
                  <TableCell>{stats.fielding.E}</TableCell>
                  <TableCell>{stats.fielding.FldPct}</TableCell>
                  <TableCell>{stats.fielding.IDP}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}

Fielding.propTypes = {
  data: PropTypes.object.isRequired,
};
