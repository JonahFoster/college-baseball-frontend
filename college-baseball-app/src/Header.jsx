import { TextField, Button, Grid } from '@mui/material' 
import { useNavigate } from 'react-router-dom' 
import PropTypes from 'prop-types' 
import { useRef } from 'react' 

export default function Header({ onSearch }) {
 
  const inputRef = useRef()

  const navigate = useNavigate() 

  function handleSearch() {
    const name = inputRef.current.value 
    onSearch(name, navigate)  
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
        <Button 
          variant="contained" 
          onClick={handleSearch} 
          sx={{ 
            marginLeft: 2, 
            '@media (max-width:600px)': {
              marginTop: '1em',
            }
          }}
        >
          Search
      </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}

Header.propTypes = {
  onSearch: PropTypes.func.isRequired,
} 

