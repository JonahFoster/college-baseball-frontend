import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Grid, CssBaseline, Box, Container } from '@mui/material'
import { collection, query, where, getDocs } from "firebase/firestore"; 
import { firestore } from '../firebase'; // Ensure this path is correct
import Header from "./Header.jsx"
import Player from "./Player.jsx"
import TopList from "./TopList.jsx"
import Search from "./Search.jsx"

export default function App() {
  const [playerData, setPlayerData] = useState(null)
  const [multipleSearchResults, setMultipleSearchResults] = useState([]);
  const [topListData, setTopListData] = useState({
    hr: [],
    ba: [],
    ops: [],
    bb: [],
    era: [],
    k: [],
    kp: [],
    baa: []
  });


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
  
  

  function handleTopLists() {
    const routes = [
      "top-hr",
      "top-ba",
      "top-ops",
      "top-bb",
      "top-era",
      "top-k",
      "top-kp",
      "top-baa"
    ];
  
    const fetchPromises = routes.map(route => fetch(`http://localhost:3000/${route}`).then(res => res.json()));
  
    Promise.all(fetchPromises)
      .then(dataArray => {
        setTopListData({
          hr: dataArray[0],
          ba: dataArray[1],
          ops: dataArray[2],
          bb: dataArray[3],
          era: dataArray[4],
          k: dataArray[5],
          kp: dataArray[6],
          baa: dataArray[7]
        });
      })
      .catch(error => console.error(error));
  }

  useEffect(() => {
    handleTopLists();
  }, []);
  
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
            <Route path="/" element={
              <Container>
                <Grid container justifyContent="space-between" mt={2}>
                  <Grid item xs={2.5}>
                    <TopList data={topListData.hr} title="Top HR" statKey="HR"/>
                  </Grid>
                  <Grid item xs={2.5}>
                    <TopList data={topListData.ba} title="Top BA" statKey="batting_average"/>
                  </Grid>
                  <Grid item xs={2.5}>
                    <TopList data={topListData.ops} title="Top OPS" statKey="OPS"/>
                  </Grid>
                  <Grid item xs={2.5}>
                    <TopList data={topListData.bb} title="Top BB" statKey="walks"/>
                  </Grid>  
                </Grid>
                <Grid container justifyContent="space-between" mt={2}>
                  <Grid item xs={2.5}>
                    <TopList data={topListData.era} title="Top ERA" statKey="ERA"/>
                  </Grid>
                  <Grid item xs={2.5}>
                    <TopList data={topListData.k} title="Top K" statKey="strikeouts"/>
                  </Grid>
                  <Grid item xs={2.5}>
                    <TopList data={topListData.kp} title="Top K%" statKey="strikeout_percentage"/>
                  </Grid>
                  <Grid item xs={2.5}>
                    <TopList data={topListData.baa} title="Top BAA" statKey="batting_average_against"/>
                  </Grid>  
                </Grid>
              </Container>
            } />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  )
}
