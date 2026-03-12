import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const DonutChart = ({ data, title }) => {
  const chartData = Array.isArray(data) ? data : [];

  // Cores padrão caso não venham no objeto data
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div>
      {title && <h2 className="text-xl font-bold mb-4 text-gray-700">{title}</h2>}

      {chartData.length === 0 && (
        <p className="text-sm text-gray-500">Nenhum dado de relatorio para exibir.</p>
      )}

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%" // Posição X (centro)
            cy="50%" // Posição Y (centro)
            innerRadius={60} // Buraco da rosquinha
            outerRadius={100} // Tamanho total
            paddingAngle={5} // Espaço entre as fatias
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
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
    </div>
  );
};

export default DonutChart;
