import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  CircularProgress,
} from "@mui/material";
import { firestore } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import Batting from "./Batting";
import Fielding from "./Fielding";
import Pitching from "./Pitching";
import teamInfo from "./assets/logos.json";
import "./assets/player.css";
import defaultLogo from "./assets/cbb-stats-logo.webp";
import { functions } from "../firebase";
import { httpsCallable } from "firebase/functions";

export default function Player() {
  const [playerData, setPlayerData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { stats_player_seq } = useParams();

  useEffect(() => {
    setIsLoading(true);
    const docRef = doc(firestore, "collegebaseballplayer", stats_player_seq);
    getDoc(docRef)
      .then((docSnap) => {
        if (!docSnap.exists()) {
          throw new Error("Player not found");
        }
        setPlayerData(docSnap.data());
        setIsLoading(false);

        const generateParagraph = httpsCallable(functions, "generateParagraph");
        generateParagraph({ playerInfo: docSnap.data() }) 
          .then((result) => {
            console.log("Generated Paragraph:", result.data.paragraph);
            // handle response
          })
          .catch((error) => {
            console.error("Error generating paragraph:", error);
          });
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, [stats_player_seq]);

  const { name } = playerData;

  let hasPitching = false;
  let hasBatting = false;
  let hasFielding = false;

  let years = [];
  if (playerData.stats) {
    for (let year in playerData.stats) {
      years.push(parseInt(year, 10));
    }
  }
  const latestYear = years.length > 0 ? Math.max(...years) : null;
  let playerClass, position, jerseyNumber, school;

  if (latestYear) {
    playerClass = playerData.stats[latestYear].class;
    position = playerData.stats[latestYear].position;
    jerseyNumber = playerData.stats[latestYear].jerseyNumber;
    school = playerData.stats[latestYear].school;
  }

  for (let year in playerData.stats) {
    if (
      playerData.stats[year].pitching &&
      playerData.stats[year].pitching.pitches > 0
    ) {
      hasPitching = true;
    }

    if (
      playerData.stats[year].batting &&
      playerData.stats[year].batting.AB > 0
    ) {
      hasBatting = true;
    }

    if (
      playerData.stats[year].fielding &&
      playerData.stats[year].fielding.GP > 0
    ) {
      hasFielding = true;
    }

    if (hasPitching && hasBatting && hasFielding) {
      break;
    }
  }

  const teamData = teamInfo.find((team) => team.ncaa_name === school) || {};

  function createFullYear(yearShort) {
    const yearMap = {
      Fr: "Freshman",
      So: "Sophomore",
      Jr: "Junior",
      Sr: "Senior",
    };
    return yearMap[yearShort] || yearShort;
  }

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }
  console.log(playerData);
  return (
    <Container>
      <Card variant="outlined">
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h4">{name}</Typography>
            <Box mt={2}>
              <Chip
                label={school}
                sx={{
                  mr: "5px",
                  mt: "5px",
                  backgroundColor: (theme) =>
                    teamData.primary || theme.palette.primary.main,
                  color: (theme) =>
                    theme.palette.getContrastText(
                      teamData.primary || theme.palette.primary.main
                    ),
                }}
              />
              <Chip
                label={`#${jerseyNumber}`}
                sx={{
                  mr: "5px",
                  mt: "5px",
                  backgroundColor: (theme) =>
                    teamData.primary || theme.palette.primary.main,
                  color: (theme) =>
                    theme.palette.getContrastText(
                      teamData.primary || theme.palette.primary.main
                    ),
                }}
              />
              <Chip
                label={position}
                sx={{
                  mr: "5px",
                  mt: "5px",
                  backgroundColor: (theme) =>
                    teamData.primary || theme.palette.primary.main,
                  color: (theme) =>
                    theme.palette.getContrastText(
                      teamData.primary || theme.palette.primary.main
                    ),
                }}
              />
              <Chip
                label={createFullYear(playerClass)}
                sx={{
                  backgroundColor: (theme) =>
                    teamData.primary || theme.palette.primary.main,
                  color: (theme) =>
                    theme.palette.getContrastText(
                      teamData.primary || theme.palette.primary.main
                    ),
                  mt: "5px",
                }}
              />
            </Box>
          </Box>
          <img
            src={teamData.logos || defaultLogo}
            alt={`${school} logo`}
            className="school-logo"
          />
        </CardContent>
      </Card>
      {hasBatting && (
        <Card variant="outlined" sx={{ mt: "10px" }}>
          <Batting data={playerData} />
        </Card>
      )}
      {hasPitching && (
        <Card variant="outlined" sx={{ mt: "10px" }}>
          <Pitching data={playerData} />
        </Card>
      )}
      {hasFielding && (
        <Card variant="outlined" sx={{ mt: "10px" }}>
          <Fielding data={playerData} />
        </Card>
      )}
    </Container>
  );
}
