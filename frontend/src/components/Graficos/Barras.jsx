import { Box, Typography } from '@mui/material';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const Barras = ({ title, data }) => {
  const realData = Array.isArray(data) ? [...data] : [];
  const maxDataValue = realData.length > 0 ? Math.max(...realData.map((d) => d.value)) : 0;
  const roundedMax = Math.ceil(maxDataValue / 100) * 100 || 100;

  const xAxisTicks = [0, roundedMax * 0.25, roundedMax * 0.5, roundedMax * 0.75, roundedMax];

  let chartData = [...realData];
  const MIN_BARS = 9;
  if (chartData.length > 0 && chartData.length < MIN_BARS) {
    const slotsFaltantes = MIN_BARS - chartData.length;
    for (let i = 0; i < slotsFaltantes; i++) {
      chartData.push({
        name: `_dummy_${i}`,
        value: 0.0001, 
        isDummy: true,
      });
    }
  }

  const CustomYTick = ({ y, payload }) => {
    if (payload.value.startsWith('_dummy_')) return <text />;
    return (
      <text
        x={0} 
        y={y - 20}
        textAnchor="start"
        fill="#000"
        fontSize={16}
        fontWeight="600"
      >
        {payload.value}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const rowData = payload[0].payload;
      if (rowData.isDummy) return null;

      return (
        <div
          style={{
            backgroundColor: '#fff',
            padding: '10px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
          <p style={{ margin: 0, color: '#F73838' }}>Ocorrências: {rowData.value}</p>
        </div>
      );
    }
    return null;
  };

  const hasRealData = realData.length > 0;

  return (
    <Box width="100%" height="100%">
      {title && (
        <Typography variant="h6" align="center" gutterBottom mb={2}>
          {title}
        </Typography>
      )}

      {!hasRealData ? (
        <Typography align="center" sx={{ mt: 5 }}>
          Nenhuma peça para exibir.
        </Typography>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 20, right: 20, left: 15, bottom: 25 }}
            barSize={20}
          >
            <XAxis
              type="number"
              domain={[0, roundedMax]}
              ticks={xAxisTicks}
              interval={0} 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 13, fill: '#666' }}
            />

            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={<CustomYTick />}
              width={1}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />

            <Bar
              dataKey="value"
              radius={[10, 10, 10, 10]}
              background={{ fill: '#FCE4E4', radius: 10 }}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.isDummy ? 'transparent' : '#F73838'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

export default Barras;
