import React from 'react';
import { Box, Stack, Typography, Checkbox } from '@mui/material';
const BoxNotificacao = ({ check, titulo, descricao, data }) => {
  const [isChecked, setIsChecked] = React.useState(check);

  React.useEffect(() => {
    setIsChecked(check);
  }, [check]);

  return (
    <Box
      width={1450}
      height={100}
      bgcolor={isChecked ? '#F3F3F3' : 'white'}
      borderRadius={3}
      p={4}
      display="flex"
      flexDirection="row"
      alignItems="flex-start"
      justifyContent="center"
      gap={2}
      boxSizing="border-box"
      marginLeft={4}
      marginBottom={2}
    >
      <Checkbox
        checked={isChecked}
        onChange={(event) => setIsChecked(event.target.checked)}
        disableRipple
        icon={
          <Box
            sx={{
              width: 18,
              height: 18,
              border: '1.5px solid black',
              borderRadius: '50%',
              boxSizing: 'border-box',
            }}
          />
        }
        checkedIcon={
          <Box
            sx={{
              width: 18,
              height: 18,
              border: '1.5px solid black',
              borderRadius: '50%',
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'black',
              fontSize: 12,
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            ✓
          </Box>
        }
        sx={{
          p: 0,
          mt: '6px',
          color: 'black',
          '&.Mui-checked': {
            color: 'black',
          },
          '& .MuiSvgIcon-root': {
            fontSize: 20,
          },
        }}
      />

      <Box sx={{ flex: 1, minWidth: 0, marginLeft: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
          <Typography fontSize={20} variant="body-1" marginBottom={1}>
            {titulo}
          </Typography>

          <Typography fontSize={14} variant="body-2">
            {data}
          </Typography>
        </Stack>

        <Typography fontSize={14} variant="body-2" color="text.secondary">
          {descricao}
        </Typography>
      </Box>
    </Box>
  );
};

export default BoxNotificacao;
