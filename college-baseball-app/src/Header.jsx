import { TextField, Button, Grid } from '@mui/material' 
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types' 
import { useRef } from 'react' 

export default function Header({ onSearch }) {
  // Ref to hold the input element for player name search
  const inputRef = useRef()

  const navigate = useNavigate();
  // Handler for search button click, triggers the onSearch callback with the input value
  function handleSearch() {
    const name = inputRef.current.value;
    onSearch(name, navigate);  // Pass navigate to the onSearch callback
  }
  return (
    <Grid 
      container 
      direction="row" 
      alignItems="center"
      justifyContent="center" 
      style={{ minHeight: '20vh' }}
    >
      <Grid 
        container 
        item 
        xs={6}
        alignItems="center" 
        justifyContent="center"
      >
        <Grid item>
          <TextField 
            id="outlined-basic" 
            placeholder="Search" 
            variant="outlined" 
            inputRef={inputRef}
          />
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={handleSearch} sx={{ marginLeft: 2 }}>
            Search
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}

Header.propTypes = {
  onSearch: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired,
  onToggleDarkMode: PropTypes.func.isRequired,
} 

