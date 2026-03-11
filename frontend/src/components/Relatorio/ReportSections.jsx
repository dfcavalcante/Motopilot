import React from 'react';
import { Box, Typography } from '@mui/material';

export const ReportSection = ({ number, title, children }) => (
  <Box sx={{ mb: 4 }}>
    <Typography
      variant="subtitle2"
      sx={{
        color: '#9e9e9e',
        fontWeight: 800,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mb: 1.5,
        letterSpacing: 1,
      }}
    >
      <span style={{ color: '#212121' }}>{number}.</span> {title.toUpperCase()}
    </Typography>
    <Box sx={{ pl: 2, borderLeft: '2px solid #f0f0f0' }}>{children}</Box>
  </Box>
);

export const SectionTitle = ({ title }) => (
  <Typography
    variant="subtitle2"
    gutterBottom
    sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#424242', mt: 2 }}
  >
    {title}
  </Typography>
);