import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { CssBaseline, Box } from '@mui/material'
import { collection, query, where, getDocs } from "firebase/firestore"; 
import { firestore } from '../firebase'; // Ensure this path is correct
import Header from "./Header.jsx"
import Player from "./Player.jsx"
import Search from "./Search.jsx"

export default function App() {
  const [playerData, setPlayerData] = useState(null)
  const [multipleSearchResults, setMultipleSearchResults] = useState([]);

  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#0055CC',
      },
      secondary: {
        main: '#444444',
      },
      error: {
        main: '#ff4d4d',
      },
      background: {
        default: '#2b2b30',
        paper: '#383842',
      },
      text: {
        primary: '#ffffff',
        secondary: '#bbbbbb',
        tertiary: '#0055CC',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: '1px solid #5a5a6b',
          },
          head: {
            fontWeight: 'bold',
          },
          body: {
            '&:not(:last-child)': {
              borderRight: '1px solid #5a5a6b',
            },
          },
        },
      },
    },
  });

  async function handleSearch(name, navigate) {
    try {
      // Query the Firestore database for players with the matching name
      const playersQuery = query(collection(firestore, 'collegebaseballplayer'), where('name', '==', name));
      const querySnapshot = await getDocs(playersQuery);
      const players = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
      // Handle no matching players found
      if (players.length === 0) {
        console.log('No matching players found');
        navigate('/search');
        return;
      }
  
      // If only one player is found, set player data and navigate to player page
      if (players.length === 1) {
        setPlayerData(players[0]);
        navigate(`/player/${players[0].id}`);
        return;
      } 
  
      // If multiple players are found, set multiple search results and navigate to search page
      setMultipleSearchResults(players);
      navigate('/search');
    } catch (error) {
      // Handle errors in fetching players
      console.error('Error fetching players:', error);
      navigate('/search');
    }
  }
  
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <CssBaseline />
        <Box style={{ paddingBottom: '50px' }}>
          <Header
            onSearch={handleSearch}
          />
          <Routes>
            <Route path="/player/:stats_player_seq" element={<Player data={playerData} />} />
            <Route path="/search" element={<Search players={multipleSearchResults} />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  )
}
