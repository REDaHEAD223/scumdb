import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Chip,
  Avatar,
  Grid,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Stack,
  Tooltip,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Person as PersonIcon,
  Close as CloseIcon,
  Group as GroupIcon,
  Flag as FlagIcon,
  DirectionsCar as VehicleIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  AttachMoney as MoneyIcon,
  CurrencyBitcoin as GoldIcon,
  ContentCopy as ContentCopyIcon,
  MyLocation as TeleportIcon,
  Numbers as NumbersIcon
} from '@mui/icons-material';

const PlayersView = ({ players, squads, flags, vehicles }) => {
  const { t } = useTranslation();
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: ''
  });

  const formatNumber = (number) => {
    return new Intl.NumberFormat('ru-RU').format(number || 0);
  };

  const filteredPlayers = useMemo(() => {
    return players.filter(player =>
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.steamId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [players, searchQuery]);

  const handlePlayerClick = (player) => {
    setSelectedPlayer(player);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleClose = () => {
    setSelectedPlayer(null);
  };

  const getPlayerSquad = (steamId) => {
    return squads.find(squad => 
      squad.members.some(member => member.steamId === steamId)
    );
  };

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

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={t('playersView.search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ bgcolor: 'background.paper' }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('playersView.details.basicInfo')}</TableCell>
              <TableCell>{t('playersView.details.fame')}</TableCell>
              <TableCell>{t('playersView.details.money')}</TableCell>
              <TableCell>{t('playersView.details.gold')}</TableCell>
              <TableCell>{t('playersView.details.squad')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPlayers.map((player) => {
              const playerSquad = getPlayerSquad(player.steamId);
              const isSquadLeader = playerSquad?.leaderSteamId === player.steamId;

              return (
                <TableRow 
                  key={player.steamId}
                  hover
                  onClick={() => handlePlayerClick(player)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: isSquadLeader ? 'warning.main' : 'primary.main' }}>
                        {isSquadLeader ? <StarIcon /> : <PersonIcon />}
                      </Avatar>
                      <Box>
                        <Typography>{player.name}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {player.steamId}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{formatNumber(player.fame)}</TableCell>
                  <TableCell>
                    <Typography color={player.money >= 0 ? 'success.main' : 'error.main'}>
                      {formatNumber(player.money)}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatNumber(player.gold)}</TableCell>
                  <TableCell>
                    {playerSquad && (
                      <Chip
                        icon={<GroupIcon />}
                        label={playerSquad.name}
                        size="small"
                        variant="outlined"
                        color={isSquadLeader ? 'warning' : 'primary'}
                      />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedPlayer && (
        <Dialog
          open={true}
          onClose={handleClose}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: 'background.paper',
              borderRadius: 2,
              backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))'
            },
            onClick: (e) => e.stopPropagation()
          }}
        >
          <DialogTitle 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              p: 2,
              pb: 2,
              borderBottom: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar 
                sx={{ 
                  width: 48, 
                  height: 48,
                  bgcolor: getPlayerSquad(selectedPlayer.steamId)?.leaderSteamId === selectedPlayer.steamId ? 'warning.main' : 'primary.main',
                  boxShadow: 2
                }}
              >
                {getPlayerSquad(selectedPlayer.steamId)?.leaderSteamId === selectedPlayer.steamId ? 
                  <StarIcon sx={{ fontSize: 28 }} /> : 
                  <PersonIcon sx={{ fontSize: 28 }} />
                }
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {selectedPlayer.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedPlayer.steamId}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handleClose} size="small" sx={{ ml: 2 }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent 
            dividers 
            sx={{ 
              p: 3,
              bgcolor: 'background.paper',
              backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))'
            }}
          >
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              {/* Basic Info */}
              <Box sx={{ flex: 1, bgcolor: 'background.default', borderRadius: 1, p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {t('playersView.details.basicInfo')}
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ 
                    p: 2,
                    borderRadius: 1,
                    bgcolor: 'warning.main',
                    color: 'warning.contrastText'
                  }}>
                    <Typography variant="caption">
                      {t('playersView.details.fame')}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <StarIcon />
                      <Typography variant="h5">
                        {formatNumber(selectedPlayer.fame)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ 
                    p: 2,
                    borderRadius: 1,
                    bgcolor: selectedPlayer.money >= 0 ? 'success.main' : 'error.main',
                    color: 'white'
                  }}>
                    <Typography variant="caption">
                      {t('playersView.details.money')}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <MoneyIcon />
                      <Typography variant="h5">
                        {formatNumber(selectedPlayer.money)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ 
                    p: 2,
                    borderRadius: 1,
                    bgcolor: '#FFD700',
                    color: 'grey.900'
                  }}>
                    <Typography variant="caption">
                      {t('playersView.details.gold')}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <GoldIcon />
                      <Typography variant="h5">
                        {formatNumber(selectedPlayer.gold)}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Box>

              {/* Location */}
              <Box sx={{ flex: 1, bgcolor: 'background.default', borderRadius: 1, p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {t('playersView.details.location')}
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  p: 2,
                  borderRadius: 1,
                  bgcolor: '#1E1E1E'
                }}>
                  <LocationIcon color="action" />
                  <Typography sx={{ flexGrow: 1 }}>
                    {selectedPlayer.location}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title={t('common.copyCoordinates')}>
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyLocation(selectedPlayer.location, 'full');
                        }}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('common.copyNumbers')}>
                      <IconButton 
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyLocation(selectedPlayer.location, 'numbers');
                        }}
                      >
                        <NumbersIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Squad Info */}
            {getPlayerSquad(selectedPlayer.steamId) && (
              <Grid sx={{ width: '100%', p: 1 }}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    borderRadius: 2,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 2
                    }
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                      {t('playersView.details.squad')}
                    </Typography>
                    <List sx={{ 
                      bgcolor: 'background.default',
                      borderRadius: 1,
                      p: 1
                    }}>
                      {getPlayerSquad(selectedPlayer.steamId).members.map((member) => (
                        <ListItem 
                          key={member.steamId}
                          sx={{
                            borderRadius: 1,
                            mb: 1,
                            '&:last-child': { mb: 0 },
                            '&:hover': { bgcolor: 'action.hover' }
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar 
                              sx={{ 
                                bgcolor: member.steamId === getPlayerSquad(selectedPlayer.steamId).leaderSteamId ? 'warning.main' : 'primary.main',
                                boxShadow: 1
                              }}
                            >
                              {member.steamId === getPlayerSquad(selectedPlayer.steamId).leaderSteamId ? <StarIcon /> : <PersonIcon />}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                {member.name}
                              </Typography>
                            }
                            secondary={
                              <Typography component="span" variant="body2" color="text.secondary">
                                {member.steamId}
                              </Typography>
                            }
                          />
                          <Stack direction="row" spacing={1}>
                            <Chip
                              size="small"
                              label={`${t('squadsView.details.memberRank')}: ${member.rank}`}
                              color="primary"
                              variant="outlined"
                              sx={{ borderRadius: 1 }}
                            />
                            {member.steamId === getPlayerSquad(selectedPlayer.steamId).leaderSteamId && (
                              <Chip
                                size="small"
                                icon={<StarIcon />}
                                label={t('squadsView.details.leaderInfo')}
                                color="warning"
                                sx={{ borderRadius: 1 }}
                              />
                            )}
                          </Stack>
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Squad Flags */}
            {getPlayerSquad(selectedPlayer.steamId) && (
              <Grid sx={{ width: '100%', p: 1 }}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    borderRadius: 2,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 2
                    }
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                      {t('playersView.details.squadFlags')}
                    </Typography>
                    <List sx={{ 
                      bgcolor: 'background.default',
                      borderRadius: 1,
                      p: 1
                    }}>
                      {flags
                        .filter(flag => getPlayerSquad(selectedPlayer.steamId).members
                          .some(member => member.steamId === flag.ownerSteamId))
                        .map((flag) => (
                          <ListItem 
                            key={flag.id}
                            sx={{
                              borderRadius: 1,
                              mb: 1,
                              '&:last-child': { mb: 0 },
                              '&:hover': { bgcolor: 'action.hover' }
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: 'warning.main', boxShadow: 1 }}>
                                <FlagIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                  {`Flag #${flag.id}`}
                                </Typography>
                              }
                              secondary={
                                <Typography component="div" variant="body2" color="textSecondary">
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <LocationIcon color="action" fontSize="small" />
                                    <Typography>{flag.location}</Typography>
                                    <Box sx={{ ml: 'auto', display: 'flex', gap: 0.5 }}>
                                      <Tooltip title={t('common.copyCoordinates')}>
                                        <IconButton 
                                          size="small" 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleCopyLocation(flag.location, 'full');
                                          }}
                                        >
                                          <ContentCopyIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip title={t('common.copyNumbers')}>
                                        <IconButton 
                                          size="small"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleCopyLocation(flag.location, 'numbers');
                                          }}
                                        >
                                          <NumbersIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    </Box>
                                  </Box>
                                </Typography>
                              }
                            />
                          </ListItem>
                        ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Vehicles */}
            {vehicles.filter(vehicle => vehicle.ownerSteamId === selectedPlayer.steamId).length > 0 && (
              <Grid sx={{ width: '100%', p: 1 }}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    borderRadius: 2,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 2
                    }
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                      {t('playersView.details.vehicles')}
                    </Typography>
                    <List sx={{ 
                      bgcolor: 'background.default',
                      borderRadius: 1,
                      p: 1
                    }}>
                      {vehicles.filter(vehicle => vehicle.ownerSteamId === selectedPlayer.steamId).map((vehicle) => (
                        <ListItem 
                          key={vehicle.id}
                          sx={{
                            borderRadius: 1,
                            mb: 1,
                            '&:last-child': { mb: 0 },
                            '&:hover': { bgcolor: 'action.hover' }
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'primary.main', boxShadow: 1 }}>
                              <VehicleIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                {`${vehicle.type} #${vehicle.id}`}
                              </Typography>
                            }
                            secondary={
                              <Typography component="div" variant="body2" color="textSecondary">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <LocationIcon color="action" fontSize="small" />
                                  <Typography>{vehicle.location}</Typography>
                                  <Box sx={{ ml: 'auto', display: 'flex', gap: 0.5 }}>
                                    <Tooltip title={t('common.copyCoordinates')}>
                                      <IconButton 
                                        size="small" 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleCopyLocation(vehicle.location, 'full');
                                        }}
                                      >
                                        <ContentCopyIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title={t('common.copyNumbers')}>
                                      <IconButton 
                                        size="small"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleCopyLocation(vehicle.location, 'numbers');
                                        }}
                                      >
                                        <NumbersIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                </Box>
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </DialogContent>

          <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button 
              onClick={handleClose} 
              variant="contained" 
              color="primary"
              sx={{ 
                borderRadius: 1,
                textTransform: 'none',
                px: 3
              }}
            >
              {t('common.close')}
            </Button>
          </DialogActions>
        </Dialog>
      )}

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

export default PlayersView; 