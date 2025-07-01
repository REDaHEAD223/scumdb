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
  Divider
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
  CurrencyBitcoin as GoldIcon
} from '@mui/icons-material';

const PlayersView = ({ players, squads }) => {
  const { t } = useTranslation();
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleClose = () => {
    setSelectedPlayer(null);
  };

  const getSquadMembers = (squadName) => {
    if (!squadName) return [];
    const squad = squads.find(s => s.name === squadName);
    return squad ? squad.members : [];
  };

  const formatCoordinate = (value) => {
    return Number(value).toFixed(3);
  };

  const PlayerDetailsDialog = ({ player, onClose }) => {
    if (!player) return null;

    const squadMembers = getSquadMembers(player.squad);

    return (
      <Dialog
        open={true}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            borderRadius: 2,
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography variant="h6">{player.name}</Typography>
              <Typography variant="caption" color="textSecondary">
                {player.steamId}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {t('playersView.details.basicInfo')}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <StarIcon color="warning" />
                      <Typography>
                        {t('playersView.details.fame')}: {formatNumber(player.fame)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <MoneyIcon color={player.money >= 0 ? 'success' : 'error'} />
                      <Typography color={player.money >= 0 ? 'success.main' : 'error.main'}>
                        {t('playersView.details.money')}: {formatNumber(player.money)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <GoldIcon sx={{ color: '#FFD700' }} />
                      <Typography>
                        {t('playersView.details.gold')}: {formatNumber(player.gold)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {t('playersView.details.location')}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationIcon color="action" />
                    <Typography>
                      X: {formatCoordinate(player.location.x)}, Y: {formatCoordinate(player.location.y)}, Z: {formatCoordinate(player.location.z)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            {player.squad && (
              <Grid sx={{ gridColumn: 'span 12' }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <GroupIcon color="primary" />
                      {t('playersView.details.squad')}: {player.squad}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      {t('playersView.details.memberCount')}: {squadMembers.length}
                    </Typography>
                    <List>
                      {squadMembers.map((member, index) => (
                        <React.Fragment key={member.steamId}>
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar>
                                <PersonIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={member.name}
                              secondary={
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                  <Chip
                                    size="small"
                                    label={`${t('squadsView.details.memberRank')}: ${member.rank}`}
                                    color="primary"
                                    variant="outlined"
                                  />
                                  {member.steamId === player.steamId && (
                                    <Chip
                                      size="small"
                                      icon={<StarIcon />}
                                      label={t('squadsView.details.leaderInfo')}
                                      color="warning"
                                    />
                                  )}
                                </Box>
                              }
                            />
                          </ListItem>
                          {index < squadMembers.length - 1 && <Divider variant="inset" component="li" />}
                        </React.Fragment>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={onClose} 
            color="primary" 
            variant="text"
            sx={{ textTransform: 'none' }}
          >
            {t('playersView.details.close')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box sx={{ width: '100%', p: 2 }}>
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
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell width="5%">{t('playersView.columns.number')}</TableCell>
              <TableCell width="20%">{t('playersView.columns.name')}</TableCell>
              <TableCell width="15%">{t('playersView.columns.steamId')}</TableCell>
              <TableCell width="10%" align="center">{t('playersView.columns.fame')}</TableCell>
              <TableCell width="10%" align="center">{t('playersView.columns.money')}</TableCell>
              <TableCell width="10%" align="center">{t('playersView.columns.gold')}</TableCell>
              <TableCell width="15%">{t('playersView.columns.squad')}</TableCell>
              <TableCell width="7.5%" align="center">{t('playersView.columns.flags')}</TableCell>
              <TableCell width="7.5%" align="center">{t('playersView.columns.vehicles')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPlayers.map((player, index) => (
              <TableRow
                key={player.steamId}
                hover
                onClick={() => handlePlayerClick(player)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.dark' }}>
                      <PersonIcon fontSize="small" />
                    </Avatar>
                    {player.name}
                  </Box>
                </TableCell>
                <TableCell sx={{ color: 'text.secondary' }}>{player.steamId}</TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <StarIcon fontSize="small" sx={{ color: 'warning.main' }} />
                    {formatNumber(player.fame)}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <MoneyIcon fontSize="small" color={player.money >= 0 ? 'success' : 'error'} />
                    <Typography color={player.money >= 0 ? 'success.main' : 'error.main'}>
                      {formatNumber(player.money)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <GoldIcon fontSize="small" sx={{ color: '#FFD700' }} />
                    {formatNumber(player.gold)}
                  </Box>
                </TableCell>
                <TableCell>
                  {player.squad ? (
                    <Chip
                      icon={<GroupIcon />}
                      label={player.squad}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ bgcolor: 'background.paper' }}
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">—</Typography>
                  )}
                </TableCell>
                <TableCell align="center">
                  {player.flags?.length > 0 ? (
                    <Chip
                      icon={<FlagIcon />}
                      label={player.flags.length}
                      size="small"
                      color="info"
                      variant="outlined"
                      sx={{ bgcolor: 'background.paper' }}
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">—</Typography>
                  )}
                </TableCell>
                <TableCell align="center">
                  {player.vehicles?.length > 0 ? (
                    <Chip
                      icon={<VehicleIcon />}
                      label={player.vehicles.length}
                      size="small"
                      color="info"
                      variant="outlined"
                      sx={{ bgcolor: 'background.paper' }}
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">—</Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <PlayerDetailsDialog player={selectedPlayer} onClose={handleClose} />
    </Box>
  );
};

export default PlayersView; 