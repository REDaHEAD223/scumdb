import React from 'react';
import { Paper, Typography } from '@mui/material';

const FlagsView = ({ flags }) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6">
        Флаги ({flags ? flags.length : 0})
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Этот раздел будет доработан...
      </Typography>
    </Paper>
  );
};

export default FlagsView; 