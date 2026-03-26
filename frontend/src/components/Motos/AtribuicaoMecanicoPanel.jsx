import React from 'react';
import { Box, Typography, Avatar, FormControl, Select, MenuItem, Button } from '@mui/material';
import { getAvatarColor, getUserInitials } from '../../utils/avatarUtils';

const AtribuicaoMecanicoPanel = ({
  isEditing,
  savingMecanico,
  tecnicos,
  mecanicoSelecionado,
  setMecanicoSelecionado,
  mecanicoAtual,
  onCancelarEdicao,
  onSalvarMecanico,
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 380,
        p: 1.5,
        borderRadius: '12px',
        border: '1px solid #E2E2E2',
      }}
    >
      <Typography variant="caption" sx={{ color: '#555', display: 'block', fontSize: 14, mb: 0.8 }}>
        Mecanico responsavel
      </Typography>

      {!isEditing && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {mecanicoAtual ? (
            <>
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  fontSize: 12,
                  bgcolor: getAvatarColor(mecanicoAtual.nome, mecanicoAtual.email),
                }}
              >
                {getUserInitials(mecanicoAtual.nome, mecanicoAtual.email)}
              </Avatar>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {mecanicoAtual.nome}
              </Typography>
            </>
          ) : (
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Nao atribuido
            </Typography>
          )}
        </Box>
      )}

      {isEditing && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <FormControl fullWidth size="small">
            <Select
              value={mecanicoSelecionado}
              onChange={(event) => setMecanicoSelecionado(event.target.value)}
              displayEmpty
            >
              <MenuItem value="">
                <Typography sx={{ color: '#888' }}>Selecione um mecanico</Typography>
              </MenuItem>

              {(tecnicos || []).map((tecnico) => (
                <MenuItem key={tecnico.id} value={tecnico.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar
                      sx={{
                        width: 26,
                        height: 26,
                        fontSize: 11,
                        bgcolor: getAvatarColor(tecnico.nome, tecnico.email),
                      }}
                    >
                      {getUserInitials(tecnico.nome, tecnico.email)}
                    </Avatar>
                    <Typography variant="body2">{tecnico.nome}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              onClick={onCancelarEdicao}
              variant="outlined"
              sx={{ textTransform: 'none', borderRadius: '10px' }}
              disabled={savingMecanico}
            >
              Cancelar edicao
            </Button>
            <Button
              onClick={onSalvarMecanico}
              variant="contained"
              sx={{
                textTransform: 'none',
                borderRadius: '10px',
                backgroundColor: '#F30000',
                '&:hover': { backgroundColor: '#C70000' },
              }}
              disabled={savingMecanico}
            >
              {savingMecanico ? 'Salvando...' : 'Salvar mecanico'}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AtribuicaoMecanicoPanel;
