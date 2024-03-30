import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { CssBaseline, Box } from '@mui/material'
import { collection, query, where, getDocs } from "firebase/firestore"
import { firestore } from '../firebase'
import Header from "./Header.jsx"
import Player from "./Player.jsx"
import Search from "./Search.jsx"

export default function App() {
  const [playerData, setPlayerData] = useState(null)
  const [multipleSearchResults, setMultipleSearchResults] = useState([])

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
  })

  async function handleSearch(name, navigate) {
    try {
      const playersQuery = query(
        collection(firestore, 'collegebaseballplayer'),
        where('name', '>=', name),
        where('name', '<', name + '\uf8ff')
      );
      const querySnapshot = await getDocs(playersQuery);
      const players = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
      if (players.length === 0) {
        console.log('No matching players found');
        navigate('/search');
        return;
      }
  
      if (players.length === 1) {
        setPlayerData(players[0]);
        navigate(`/player/${players[0].id}`);
        return;
      }
      console.log('Multiple players found:', players)
      setMultipleSearchResults(players);
      navigate('/search');
    } catch (error) {
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
          <p style={{
            textAlign: 'center', 
            fontStyle: 'italic', 
            fontSize: '20px',
            color: '#c3c3d4' 
          }}>
            Type a player name into the search bar, and then press search! Be sure to check your spelling.
          </p>
        </Box>
      </Router>
    </ThemeProvider>
  )
}
