import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
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
  Flag as FlagIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  ExpandMore as ExpandMoreIcon,
  ContentCopy as ContentCopyIcon,
  Numbers as NumbersIcon
} from '@mui/icons-material';

const FlagsView = ({ flags }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: ''
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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

  // Группируем флаги по владельцам
  const groupedFlags = useMemo(() => {
    const groups = {};
    flags.forEach(flag => {
      const key = flag.ownerSteamId;
      if (!groups[key]) {
        groups[key] = {
          ownerName: flag.ownerName,
          ownerSteamId: flag.ownerSteamId,
          flags: []
        };
      }
      groups[key].flags.push(flag);
    });
    return Object.values(groups);
  }, [flags]);

  // Фильтруем группы флагов по поисковому запросу
  const filteredGroups = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    return groupedFlags.filter(group => {
      return (
        group.ownerName.toLowerCase().includes(searchLower) ||
        group.ownerSteamId.toString().includes(searchLower) ||
        group.flags.some(flag => 
          flag.id.toString().includes(searchLower)
        )
      );
    });
  }, [groupedFlags, searchQuery]);

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={t('flagsView.search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ bgcolor: 'background.paper' }}
        />
      </Box>

      <Stack spacing={2}>
        {filteredGroups.map((group) => (
          <Accordion key={group.ownerSteamId} sx={{ bgcolor: 'background.paper' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                <PersonIcon color="primary" />
                <Typography>{group.ownerName}</Typography>
                <Typography variant="caption" color="textSecondary">
                  ({group.ownerSteamId})
                </Typography>
                <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    icon={<FlagIcon />}
                    label={group.flags.length}
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
                      <TableCell width="15%">{t('flagsView.columns.id')}</TableCell>
                      <TableCell width="85%">{t('flagsView.columns.location')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {group.flags.map((flag) => (
                      <TableRow key={flag.id} hover>
                        <TableCell>
                          <Chip
                            icon={<FlagIcon />}
                            label={`#${flag.id}`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationIcon color="action" fontSize="small" />
                            <Typography>{flag.location}</Typography>
                            <Box sx={{ ml: 'auto', display: 'flex', gap: 0.5 }}>
                              <Tooltip title={t('common.copyCoordinates')}>
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleCopyLocation(flag.location, 'full')}
                                >
                                  <ContentCopyIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={t('common.copyNumbers')}>
                                <IconButton 
                                  size="small"
                                  onClick={() => handleCopyLocation(flag.location, 'numbers')}
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

export default FlagsView; 