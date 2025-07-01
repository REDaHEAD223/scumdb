import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Collapse,
  IconButton,
  CircularProgress
} from '@mui/material';
import {
  KeyboardArrowDown as ExpandMoreIcon,
  KeyboardArrowUp as ExpandLessIcon,
  CloudUpload as CloudUploadIcon,
  Check as CheckIcon
} from '@mui/icons-material';

const DataInput = ({ onDataProcessed }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [playersData, setPlayersData] = useState('');
  const [squadsData, setSquadsData] = useState('');
  const [flagsData, setFlagsData] = useState('');
  const [vehiclesData, setVehiclesData] = useState('');

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  const parsePlayersData = (data) => {
    if (!data) return [];
    
    const lines = data.split('\n');
    const players = [];
    let currentPlayer = null;
    
    for (let line of lines) {
      line = line.trim();
      if (!line) continue;

      // Ищем номер и имя игрока
      const playerNumberMatch = line.match(/^\d+\.\s+(.+)$/);
      if (playerNumberMatch) {
        currentPlayer = {
          name: playerNumberMatch[1].trim(),
          steamId: '',
          fame: 0,
          money: 0,
          gold: 0,
          location: null
        };
        players.push(currentPlayer);
        continue;
      }

      if (!currentPlayer) continue;

      // Ищем Steam ID
      const steamMatch = line.match(/^Steam:\s+.+?\s+\((\d+)\)$/);
      if (steamMatch) {
        currentPlayer.steamId = steamMatch[1];
        continue;
      }

      // Ищем Fame
      const fameMatch = line.match(/^Fame:\s+(\d+)/);
      if (fameMatch) {
        currentPlayer.fame = parseInt(fameMatch[1]);
        continue;
      }

      // Ищем Account balance
      const moneyMatch = line.match(/^Account balance:\s+(-?\d+)/);
      if (moneyMatch) {
        currentPlayer.money = parseInt(moneyMatch[1]);
        continue;
      }

      // Ищем Gold balance
      const goldMatch = line.match(/^Gold balance:\s+(\d+)/);
      if (goldMatch) {
        currentPlayer.gold = parseInt(goldMatch[1]);
        continue;
      }

      // Ищем Location
      const locationMatch = line.match(/^Location:\s+X=(-?\d+\.?\d*)\s+Y=(-?\d+\.?\d*)\s+Z=(-?\d+\.?\d*)/);
      if (locationMatch) {
        currentPlayer.location = {
          x: parseFloat(locationMatch[1]),
          y: parseFloat(locationMatch[2]),
          z: parseFloat(locationMatch[3])
        };
        continue;
      }
    }
    
    return players;
  };

  const parseSquadsData = (data) => {
    if (!data) return [];
    
    const lines = data.split('\n');
    const squads = [];
    let currentSquad = null;
    
    for (let line of lines) {
      line = line.trim();
      if (!line) continue;

      // Ищем начало информации об отряде
      const squadMatch = line.match(/^\[SquadId:\s+(\d+)\s+SquadName:\s+(.+?)\s*\]$/);
      if (squadMatch) {
        currentSquad = {
          id: parseInt(squadMatch[1]),
          name: squadMatch[2].trim(),
          leaderSteamId: '',
          members: []
        };
        squads.push(currentSquad);
        continue;
      }

      if (!currentSquad) continue;

      // Ищем информацию о членах отряда
      const memberMatch = line.match(/^SteamId:\s+(\d+)\s+SteamName:\s+(.+?)\s+CharacterName:\s+(.+?)\s+MemberRank:\s+(\d+)$/);
      if (memberMatch) {
        const member = {
          steamId: memberMatch[1],
          steamName: memberMatch[2].trim(),
          name: memberMatch[3].trim(),
          rank: parseInt(memberMatch[4])
        };

        if (member.rank === 4) { // Ранг 4 - лидер отряда
          currentSquad.leaderSteamId = member.steamId;
        }

        currentSquad.members.push(member);
        continue;
      }
    }
    
    return squads;
  };

  const parseFlagsData = (data) => {
    if (!data) return [];
    
    const lines = data.split('\n');
    const flags = [];
    
    for (let line of lines) {
      line = line.trim();
      if (!line || line.startsWith('Page')) continue;

      // Ищем информацию о флаге и его владельце
      const flagMatch = line.match(/^Flag ID:\s+(\d+)\s+\|\s+Owner:\s+\[(\d+)\]\s+(.+?)\s+\((\d+)\)\s+\|\s+Location:\s+X=(-?\d+\.?\d*)\s+Y=(-?\d+\.?\d*)\s+Z=(-?\d+\.?\d*)$/);
      if (flagMatch) {
        const flag = {
          id: parseInt(flagMatch[1]),
          ownerSteamId: flagMatch[2],
          ownerName: flagMatch[3].trim(),
          ownerId: parseInt(flagMatch[4]),
          location: {
            x: parseFloat(flagMatch[5]),
            y: parseFloat(flagMatch[6]),
            z: parseFloat(flagMatch[7])
          }
        };
        flags.push(flag);
      }
    }
    
    return flags;
  };

  const parseVehiclesData = (data) => {
    if (!data) return [];
    
    const lines = data.split('\n');
    const vehicles = [];
    
    for (let line of lines) {
      line = line.trim();
      if (!line) continue;

      // Ищем информацию о транспорте: #ID: TYPE X=X Y=Y Z=Z OWNER_ID OWNER_INFO
      const vehicleMatch = line.match(/^#(\d+):\s+(.+?)\s+\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\s+X=(-?\d+\.?\d*)\s+Y=(-?\d+\.?\d*)\s+Z=(-?\d+\.?\d*)\s+(\d*)\s+(.*)$/);
      if (vehicleMatch) {
        const vehicle = {
          id: parseInt(vehicleMatch[1]),
          type: vehicleMatch[2].trim(),
          location: {
            x: parseFloat(vehicleMatch[3]),
            y: parseFloat(vehicleMatch[4]),
            z: parseFloat(vehicleMatch[5])
          },
          ownerSteamId: null
        };

        // Проверяем владельца
        const ownerInfo = vehicleMatch[7].trim();
        if (ownerInfo && ownerInfo !== 'No owner') {
          const ownerMatch = ownerInfo.match(/^(\d+)$/);
          if (ownerMatch) {
            vehicle.ownerSteamId = ownerMatch[1];
          }
        }

        vehicles.push(vehicle);
      }
    }
    
    return vehicles;
  };

  const processData = () => {
    setLoading(true);
    
    // Обработка данных
    const processedData = {
      players: parsePlayersData(playersData),
      squads: parseSquadsData(squadsData),
      flags: parseFlagsData(flagsData),
      vehicles: parseVehiclesData(vehiclesData)
    };
    
    setTimeout(() => {
      onDataProcessed(processedData);
      setSuccess(true);
      setLoading(false);
      setExpanded(false);
    }, 1000);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: expanded ? 2 : 0 }}>
        <Typography variant="h6" component="div">
          {t('dataInput.title')}
        </Typography>
        <IconButton onClick={handleExpand}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Скопируйте дампы admin командами в SCUM и вставьте в поля ниже (Ctrl+V)
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Игроки (ListPlayers)"
            multiline
            rows={4}
            value={playersData}
            onChange={(e) => setPlayersData(e.target.value)}
            fullWidth
          />
          <TextField
            label="Отряды (DumpAllSquadsInfoList)"
            multiline
            rows={4}
            value={squadsData}
            onChange={(e) => setSquadsData(e.target.value)}
            fullWidth
          />
          <TextField
            label="Флаги (ListFlags)"
            multiline
            rows={4}
            value={flagsData}
            onChange={(e) => setFlagsData(e.target.value)}
            fullWidth
          />
          <TextField
            label="Транспорт (ListSpawnedVehicles)"
            multiline
            rows={4}
            value={vehiclesData}
            onChange={(e) => setVehiclesData(e.target.value)}
            fullWidth
          />

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={processData}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : success ? <CheckIcon /> : <CloudUploadIcon />}
            >
              {loading ? t('dataInput.loading') : success ? t('dataInput.filesLoaded') : t('dataInput.processData')}
            </Button>
          </Box>
        </Box>
      </Collapse>

      {success && !expanded && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {t('dataInput.filesLoaded')}
        </Alert>
      )}
    </Paper>
  );
};

export default DataInput; 