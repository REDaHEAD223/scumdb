import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Card,
  CardContent,
  Chip,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField
} from '@mui/material';
import {
  Person as PersonIcon,
  Group as GroupIcon,
  Star as StarIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';

const SquadsView = ({ squads }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const getRankColor = (rank) => {
    switch (rank) {
      case 4:
        return 'error';
      case 3:
        return 'warning';
      case 2:
        return 'info';
      default:
        return 'primary';
    }
  };

  // Фильтруем отряды по поисковому запросу
  const filteredSquads = React.useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    return squads.filter(squad => {
      return (
        squad.name.toLowerCase().includes(searchLower) ||
        squad.members.some(member => 
          member.name.toLowerCase().includes(searchLower) ||
          member.steamId.toString().includes(searchLower)
        )
      );
    });
  }, [squads, searchQuery]);

  const MembersList = ({ members, leaderSteamId }) => (
    <List>
      {members.map((member, index) => (
        <React.Fragment key={member.steamId}>
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: member.steamId === leaderSteamId ? 'warning.main' : 'primary.main' }}>
                {member.steamId === leaderSteamId ? <StarIcon /> : <PersonIcon />}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography>{member.name || member.steamId}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    ({member.steamId})
                  </Typography>
                </Box>
              }
            />
            <Stack direction="row" spacing={1} sx={{ ml: 2 }}>
              <Chip
                size="small"
                label={`${t('squadsView.details.memberRank')}: ${member.rank}`}
                color={getRankColor(member.rank)}
                variant="outlined"
                sx={{ bgcolor: 'background.paper' }}
              />
              {member.steamId === leaderSteamId && (
                <Chip
                  size="small"
                  icon={<StarIcon />}
                  label={t('squadsView.details.leaderInfo')}
                  color="warning"
                  variant="outlined"
                  sx={{ bgcolor: 'background.paper' }}
                />
              )}
            </Stack>
          </ListItem>
          {index < members.length - 1 && <Divider variant="inset" component="li" />}
        </React.Fragment>
      ))}
    </List>
  );

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={t('squadsView.search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ bgcolor: 'background.paper' }}
        />
      </Box>

      <Stack spacing={2}>
        {filteredSquads.map((squad) => {
          const leader = squad.members.find(m => m.steamId === squad.leaderSteamId);
          
          return (
            <Accordion key={squad.name} sx={{ bgcolor: 'background.paper' }}>
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon />}
                sx={{ 
                  '& .MuiAccordionSummary-content': {
                    alignItems: 'center'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <GroupIcon />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6">{squad.name}</Typography>
                    {leader && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <StarIcon fontSize="small" sx={{ color: 'warning.main' }} />
                        <Typography variant="body2" color="textSecondary">
                          {leader.name}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  <Chip
                    icon={<GroupIcon />}
                    label={squad.members.length}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ bgcolor: 'background.paper' }}
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {t('squadsView.details.membersList')}
                    </Typography>
                    <MembersList members={squad.members} leaderSteamId={squad.leaderSteamId} />
                  </CardContent>
                </Card>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Stack>
    </Box>
  );
};

export default SquadsView; 