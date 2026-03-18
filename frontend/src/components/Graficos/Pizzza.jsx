import React from 'react';
import { Box, Typography } from '@mui/material';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const Pizza = ({ title, data }) => {
  return (
    <Box width="100%" height="100%">
      {title && (
        <Typography variant="h6" align="center" gutterBottom>
          {title}
        </Typography>
      )}
      
      {data.length === 0 && <Typography align="center"> Nenhuma informação para exibir.</Typography>}

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%" 
            cy="50%" 
            outerRadius="95%" 
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: '8px',
              border: 'none',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
          />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default Pizza;