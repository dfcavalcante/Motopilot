import React from 'react';
import { ResponsiveContainer } from 'recharts';
import { Box, Typography } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

// Componente esqueleto para mostrar dados sobre as motos concluídas, em andamento, etc
const Pizza = ({ title, data }) => {
  return (
    <Box width="100%" height="100%">
      <Typography variant="h6" align="center" gutterBottom>
        {title}
      </Typography>
      {data.length === 0 && <Typography> Nenhuma moto para exibir.</Typography>}

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%" // Posição X (centro)
            cy="50%" // Posição Y (centro)
            innerRadius={60} // Buraco da rosquinha
            outerRadius={100} // Tamanho total
            paddingAngle={5} // Espaço entre as fatias
            dataKey="value"
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
