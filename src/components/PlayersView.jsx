import React, { useState, useMemo } from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  TextField,
  InputAdornment,
  Box,
  Avatar,
  TablePagination
} from '@mui/material';
import {
  Search,
  Person,
  Close
} from '@mui/icons-material';

const PlayersView = ({ players, squads, flags, vehicles }) => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  // Фильтрация игроков по поиску
  const filteredPlayers = useMemo(() => {
    if (!searchTerm) return players;
    return players.filter(player => 
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.steam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.steamId.includes(searchTerm)
    );
  }, [players, searchTerm]);

  // Пагинация
  const paginatedPlayers = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredPlayers.slice(start, end);
  }, [filteredPlayers, page, rowsPerPage]);

  // Поиск отряда игрока
  const getPlayerSquad = (player) => {
    return squads.find(squad => 
      squad.members.some(member => member.steamId === player.steamId)
    );
  };

  // Поиск флагов игрока
  const getPlayerFlags = (player) => {
    return flags.filter(flag => flag.ownerSteamId === player.steamId);
  };

  // Поиск транспорта игрока
  const getPlayerVehicles = (player) => {
    return vehicles.filter(vehicle => vehicle.ownerSteamId === player.steamId);
  };

  const formatCoordinate = (value) => {
    return Math.round(value).toLocaleString();
  };

  const formatBalance = (value) => {
    return value.toLocaleString();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const PlayerDetailsDialog = ({ player, open, onClose }) => {
    if (!player) return null;

    const playerSquad = getPlayerSquad(player);
    const playerFlags = getPlayerFlags(player);
    const playerVehicles = getPlayerVehicles(player);

    return (
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <Person />
            </Avatar>
            <Box>
              <Typography variant="h6">{player.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                Steam: {player.steam}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={3}>
            {/* Основная информация */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Основная информация
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Fame:</Typography>
                      <Chip label={player.fame} color="primary" size="small" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Деньги:</Typography>
                      <Typography color={player.accountBalance >= 0 ? 'success.main' : 'error.main'}>
                        {formatBalance(player.accountBalance)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Золото:</Typography>
                      <Typography color="warning.main">
                        {formatBalance(player.goldBalance)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Локация */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Местоположение
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>X:</Typography>
                      <Typography sx={{ fontFamily: 'monospace' }}>
                        {formatCoordinate(player.location.x)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Y:</Typography>
                      <Typography sx={{ fontFamily: 'monospace' }}>
                        {formatCoordinate(player.location.y)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Z:</Typography>
                      <Typography sx={{ fontFamily: 'monospace' }}>
                        {formatCoordinate(player.location.z)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Отряд */}
            {playerSquad && (
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Отряд: {playerSquad.name}
                    </Typography>
                    <Typography variant="body2">
                      Участников: {playerSquad.members.length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Флаги */}
            {playerFlags.length > 0 && (
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Мои флаги ({playerFlags.length})
                    </Typography>
                    {playerFlags.slice(0, 3).map((flag) => (
                      <Typography key={flag.id} variant="body2">
                        Флаг #{flag.id}
                      </Typography>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Транспорт */}
            {playerVehicles.length > 0 && (
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Мой транспорт ({playerVehicles.length})
                    </Typography>
                    {playerVehicles.slice(0, 3).map((vehicle) => (
                      <Typography key={vehicle.id} variant="body2">
                        {vehicle.type}
                      </Typography>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} startIcon={<Close />}>
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  if (!players || players.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          Нет данных об игроках для отображения
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      {/* Поиск */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Поиск игроков по имени, Steam имени или Steam ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Статистика поиска */}
      {searchTerm && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary">
            Найдено игроков: {filteredPlayers.length} из {players.length}
          </Typography>
        </Box>
      )}

      {/* Таблица игроков */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>№</TableCell>
              <TableCell>Имя</TableCell>
              <TableCell>Steam</TableCell>
              <TableCell align="right">Fame</TableCell>
              <TableCell align="right">Деньги</TableCell>
              <TableCell align="right">Золото</TableCell>
              <TableCell>Отряд</TableCell>
              <TableCell align="center">Флаги</TableCell>
              <TableCell align="center">Транспорт</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedPlayers.map((player) => {
              const playerSquad = getPlayerSquad(player);
              const playerFlags = getPlayerFlags(player);
              const playerVehicles = getPlayerVehicles(player);

              return (
                <TableRow
                  key={player.steamId}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => setSelectedPlayer(player)}
                >
                  <TableCell>{player.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                        {player.name.charAt(0)}
                      </Avatar>
                      {player.name}
                    </Box>
                  </TableCell>
                  <TableCell>{player.steam}</TableCell>
                  <TableCell align="right">
                    <Chip label={player.fame} size="small" />
                  </TableCell>
                  <TableCell align="right">
                    <Typography color={player.accountBalance >= 0 ? 'success.main' : 'error.main'}>
                      {formatBalance(player.accountBalance)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography color="warning.main">
                      {formatBalance(player.goldBalance)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {playerSquad ? (
                      <Chip label={playerSquad.name} size="small" color="primary" />
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        Нет отряда
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {playerFlags.length > 0 ? (
                      <Chip label={playerFlags.length} size="small" color="secondary" />
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {playerVehicles.length > 0 ? (
                      <Chip label={playerVehicles.length} size="small" color="info" />
                    ) : (
                      '-'
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={filteredPlayers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Игроков на странице:"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}–${to} из ${count !== -1 ? count : `более чем ${to}`}`
          }
        />
      </TableContainer>

      {/* Диалог с деталями игрока */}
      <PlayerDetailsDialog
        player={selectedPlayer}
        open={!!selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
      />
    </Box>
  );
};

export default PlayersView; 