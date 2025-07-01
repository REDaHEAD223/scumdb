import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Collapse, IconButton } from '@mui/material';
import { ExpandMore, KeyboardArrowUp } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const DataInput = ({ onDataProcessed }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(true);
  const [playersData, setPlayersData] = useState(() => {
    return localStorage.getItem('scumdb_players_data') || '';
  });
  const [squadsData, setSquadsData] = useState(() => {
    return localStorage.getItem('scumdb_squads_data') || '';
  });
  const [flagsData, setFlagsData] = useState(() => {
    return localStorage.getItem('scumdb_flags_data') || '';
  });
  const [vehiclesData, setVehiclesData] = useState(() => {
    return localStorage.getItem('scumdb_vehicles_data') || '';
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);

  // Сохраняем данные при изменении
  useEffect(() => {
    localStorage.setItem('scumdb_players_data', playersData);
  }, [playersData]);

  useEffect(() => {
    localStorage.setItem('scumdb_squads_data', squadsData);
  }, [squadsData]);

  useEffect(() => {
    localStorage.setItem('scumdb_flags_data', flagsData);
  }, [flagsData]);

  useEffect(() => {
    localStorage.setItem('scumdb_vehicles_data', vehiclesData);
  }, [vehiclesData]);

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
        if (currentPlayer) {
          players.push(currentPlayer);
        }
        currentPlayer = {
          name: playerNumberMatch[1].trim(),
          steamId: '',
          fame: 0,
          money: 0,
          gold: 0,
          location: ''
        };
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
      const locationMatch = line.match(/^Location:\s+(.+)$/);
      if (locationMatch) {
        currentPlayer.location = locationMatch[1].trim();
      }
    }

    if (currentPlayer) {
      players.push(currentPlayer);
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
      const flagMatch = line.match(/^Flag ID:\s+(\d+)\s+\|\s+Owner:\s+\[(\d+)\]\s+(.+?)\s+\((\d+)\)\s+\|\s+Location:\s+(.+)$/);
      if (flagMatch) {
        const flag = {
          id: parseInt(flagMatch[1]),
          ownerSteamId: flagMatch[2],
          ownerName: flagMatch[3].trim(),
          ownerId: parseInt(flagMatch[4]),
          location: flagMatch[5].trim()
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

      // Ищем информацию о транспорте: #ID: TYPE DATETIME X=X Y=Y Z=Z OWNER_ID OWNER_INFO
      const vehicleMatch = line.match(/^#(\d+):\s+(.+?)\s+\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\s+(.+?)\s+(\d+)\s+(.*?)$/);
      if (vehicleMatch) {
        const vehicle = {
          id: vehicleMatch[1],
          type: vehicleMatch[2].trim(),
          location: vehicleMatch[3].trim(),
          ownerSteamId: null
        };

        // Проверяем владельца
        const ownerInfo = vehicleMatch[5].trim();
        
        // Если в ownerInfo есть Steam ID, используем его
        if (ownerInfo.includes('7656')) {
          vehicle.ownerSteamId = ownerInfo;
        }

        vehicles.push(vehicle);
      }
    }
    
    return vehicles;
  };

  const handleProcess = () => {
    setIsProcessing(true);
    setIsProcessed(false);

    try {
      const processedData = {
        players: parsePlayersData(playersData),
        squads: parseSquadsData(squadsData),
        flags: parseFlagsData(flagsData),
        vehicles: parseVehiclesData(vehiclesData)
      };
      onDataProcessed(processedData);
      setIsProcessed(true);
    } catch (error) {
      console.error('Error processing data:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearStoredData = () => {
    // Очищаем данные из localStorage
    localStorage.removeItem('scumdb_players_data');
    localStorage.removeItem('scumdb_squads_data');
    localStorage.removeItem('scumdb_flags_data');
    localStorage.removeItem('scumdb_vehicles_data');

    // Очищаем состояния
    setPlayersData('');
    setSquadsData('');
    setFlagsData('');
    setVehiclesData('');
    setIsProcessed(false);
  };

  return (
    <Box sx={{ mb: 2, bgcolor: 'background.paper', borderRadius: 1, overflow: 'hidden' }}>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          '&:hover': { bgcolor: 'action.hover' },
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Typography variant="h6" component="h2">
          {t('dataInput.title')}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isProcessed && !expanded && (
            <Typography color="success.main">
              {t('dataInput.success')}
            </Typography>
          )}
          <IconButton size="small">
            {expanded ? <KeyboardArrowUp /> : <ExpandMore />}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ p: 2 }}>
          <Typography sx={{ mb: 2 }} color="text.secondary">
            {t('dataInput.instruction')}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label={t('dataInput.sections.players')}
              multiline
              rows={4}
              value={playersData}
              onChange={(e) => setPlayersData(e.target.value)}
              fullWidth
            />
            <TextField
              label={t('dataInput.sections.squads')}
              multiline
              rows={4}
              value={squadsData}
              onChange={(e) => setSquadsData(e.target.value)}
              fullWidth
            />
            <TextField
              label={t('dataInput.sections.flags')}
              multiline
              rows={4}
              value={flagsData}
              onChange={(e) => setFlagsData(e.target.value)}
              fullWidth
            />
            <TextField
              label={t('dataInput.sections.vehicles')}
              multiline
              rows={4}
              value={vehiclesData}
              onChange={(e) => setVehiclesData(e.target.value)}
              fullWidth
            />
          </Box>

          <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              variant="outlined"
              color="error"
              onClick={clearStoredData}
              disabled={isProcessing}
            >
              {t('common.clearData')}
            </Button>
            <Button
              variant="contained"
              onClick={handleProcess}
              disabled={isProcessing}
            >
              {t('common.process')}
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default DataInput; 