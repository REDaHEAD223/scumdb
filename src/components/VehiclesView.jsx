import React from 'react';
import { Paper, Typography } from '@mui/material';

const VehiclesView = ({ vehicles }) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6">
        Транспорт ({vehicles ? vehicles.length : 0})
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Этот раздел будет доработан...
      </Typography>
    </Paper>
  );
};

export default VehiclesView; 