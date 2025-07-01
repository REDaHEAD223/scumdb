import React from 'react';
import { Paper, Typography } from '@mui/material';

const SquadsView = ({ squads }) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6">
        Отряды ({squads ? squads.length : 0})
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Этот раздел будет доработан...
      </Typography>
    </Paper>
  );
};

export default SquadsView; 