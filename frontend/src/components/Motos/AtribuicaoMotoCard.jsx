import React from 'react';
import { Box, Typography, FormControl, Select, MenuItem, Button } from '@mui/material';

const AtribuicaoMotoCard = ({
  motoId,
  tecnicos,
  mecanicoSelecionado,
  setMecanicoSelecionado,
  onAtribuir,
}) => {
  return (
    <Box sx={{ mt: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
      <Box
        sx={{
          mt: 1.2,
          width: 336,
          borderRadius: '14px',
          backgroundColor: '#D9D9D9',
          border: '1px solid #BDBDBD',
          p: 1.2,
        }}
      >
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#4A4A4A', mb: 0.8 }}>
          Atribuir técnico
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <FormControl
            size="small"
            sx={{
              flex: 1,
              backgroundColor: 'white',
              borderRadius: '10px',
            }}
          >
            <Select
              displayEmpty
              value={mecanicoSelecionado[motoId] || ''}
              onChange={(e) =>
                setMecanicoSelecionado((prev) => ({
                  ...prev,
                  [motoId]: e.target.value,
                }))
              }
              sx={{
                borderRadius: '10px',
                '& .MuiSelect-select': { py: 1 },
              }}
            >
              <MenuItem value="" disabled>
                Selecionar técnico
              </MenuItem>
              {tecnicos.map((tecnico) => (
                <MenuItem key={tecnico.id} value={tecnico.id}>
                  {tecnico.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            onClick={() => onAtribuir(motoId)}
            sx={{
              height: 40,
              minWidth: 88,
              borderRadius: '10px',
              backgroundColor: '#676767',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { backgroundColor: '#4f4f4f' },
            }}
          >
            Atribuir
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AtribuicaoMotoCard;
