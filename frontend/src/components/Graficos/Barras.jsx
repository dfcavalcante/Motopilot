import { Box, Typography } from '@mui/material';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const Barras = ({ title, data }) => {
  const chartData = Array.isArray(data) ? data : [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <Box width="100%" height="100%">
      <Typography variant="h6" align="center" gutterBottom>
        {title}
      </Typography>

      {chartData.length === 0 && <Typography> Nenhuma peça para exibir.</Typography>}
      <Box 
        sx={{ 
          width: '100%', 
          height: 440, 
          overflowY: 'auto', 
          overflowX: 'hidden',
          pr: 1,
          '&::-webkit-scrollbar': { width: '8px' },
          '&::-webkit-scrollbar-thumb': { backgroundColor: '#ddd', borderRadius: '4px' }
        }}
      >
        <Box sx={{ width: '100%', height: 600 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              layout="vertical"
              margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e0e0e0" />
              <XAxis 
                type="number" 
                allowDecimals={false} 
                tick={{ fontSize: 12, fill: '#666' }} 
                axisLine={false} 
                tickLine={false} 
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={({ x, y, payload }) => (
                  <text 
                    x={0} 
                    y={y} 
                    dy={4} 
                    textAnchor="start" 
                    fill="#222" 
                    fontSize={13} 
                    fontWeight="bold"
                  >
                    {payload.value}
                  </text>
                )} 
                axisLine={false} 
                tickLine={false} 
                width={150}
              />
              <Tooltip 
                cursor={{ fill: '#f5f5f5' }} 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar dataKey="value" name="Ocorrências" radius={[0, 6, 6, 0]} barSize={24}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default Barras;
