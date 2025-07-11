import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  IconButton,
  Tooltip,
  Snackbar,
  Alert
} from '@mui/material';
import {
  DirectionsCar as VehicleIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  ExpandMore as ExpandMoreIcon,
  ContentCopy as ContentCopyIcon,
  Numbers as NumbersIcon
} from '@mui/icons-material';

const VehiclesView = ({ vehicles, players }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: ''
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Создаем мапу игроков для быстрого доступа
  const playerMap = React.useMemo(() => {
    return new Map(players.map(player => [player.steamId, player]));
  }, [players]);

  const handleCopyLocation = (location, format) => {
    if (!location) return;
    
    const text = format === 'full' ? location : location.match(/X=(-?\d+\.?\d*)\s+Y=(-?\d+\.?\d*)\s+Z=(-?\d+\.?\d*)/)?.slice(1).join(' ') || '';
    navigator.clipboard.writeText(text).then(() => {
      setSnackbar({
        open: true,
        message: format === 'full' ? t('common.coordinatesCopied') : t('common.numbersCopied')
      });
    });
  };

  // Группируем транспорт по владельцам
  const groupedVehicles = React.useMemo(() => {
    const groups = {};
    const noOwnerGroup = {
      ownerName: t('vehiclesView.noOwner'),
      ownerSteamId: null,
      vehicles: []
    };

    vehicles.forEach(vehicle => {
      if (!vehicle.ownerSteamId) {
        noOwnerGroup.vehicles.push(vehicle);
        return;
      }

      const owner = playerMap.get(vehicle.ownerSteamId);
      const key = vehicle.ownerSteamId;
      
      if (!groups[key]) {
        groups[key] = {
          ownerName: owner ? owner.name : `${t('vehiclesView.unknownPlayer')} (${vehicle.ownerSteamId})`,
          ownerSteamId: vehicle.ownerSteamId,
          vehicles: []
        };
      }
      groups[key].vehicles.push(vehicle);
    });

    // Преобразуем в массив и сортируем: сначала группы с владельцами, потом без владельца
    const groupsArray = Object.values(groups);
    if (noOwnerGroup.vehicles.length > 0) {
      groupsArray.push(noOwnerGroup);
    }

    return groupsArray;
  }, [vehicles, playerMap, t]);

  // Фильтруем группы по поисковому запросу
  const filteredGroups = React.useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    return groupedVehicles.filter(group => {
      return (
        (group.ownerName && group.ownerName.toLowerCase().includes(searchLower)) ||
        (group.ownerSteamId && group.ownerSteamId.toString().includes(searchLower)) ||
        group.vehicles.some(vehicle => 
          vehicle.type.toLowerCase().includes(searchLower) ||
          vehicle.id.toString().includes(searchLower)
        )
      );
    });
  }, [groupedVehicles, searchQuery]);

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={t('vehiclesView.search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ bgcolor: 'background.paper' }}
        />
      </Box>

      <Stack spacing={2}>
        {filteredGroups.map((group) => (
          <Accordion 
            key={group.ownerSteamId || 'no-owner'} 
            sx={{ bgcolor: 'background.paper' }}
            defaultExpanded={group.ownerSteamId !== null}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                <PersonIcon color="primary" />
                <Typography>{group.ownerName}</Typography>
                {group.ownerSteamId && (
                  <Typography variant="caption" color="textSecondary">
                    ({group.ownerSteamId})
                  </Typography>
                )}
                <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    icon={<VehicleIcon />}
                    label={group.vehicles.length}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell width="10%">{t('vehiclesView.columns.id')}</TableCell>
                      <TableCell width="30%">{t('vehiclesView.columns.type')}</TableCell>
                      <TableCell width="60%">{t('vehiclesView.columns.location')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {group.vehicles.map((vehicle) => (
                      <TableRow key={vehicle.id} hover>
                        <TableCell>
                          <Chip
                            icon={<VehicleIcon />}
                            label={`#${vehicle.id}`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography>{vehicle.type}</Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationIcon color="action" fontSize="small" />
                            <Typography>{vehicle.location}</Typography>
                            <Box sx={{ ml: 'auto', display: 'flex', gap: 0.5 }}>
                              <Tooltip title={t('common.copyCoordinates')}>
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleCopyLocation(vehicle.location, 'full')}
                                >
                                  <ContentCopyIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={t('common.copyNumbers')}>
                                <IconButton 
                                  size="small"
                                  onClick={() => handleCopyLocation(vehicle.location, 'numbers')}
                                >
                                  <NumbersIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VehiclesView; 