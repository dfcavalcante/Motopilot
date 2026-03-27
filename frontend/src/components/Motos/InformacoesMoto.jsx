import React, { useState } from 'react';
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Button,
  Chip,
  Avatar,
  FormControl,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import BaseFront from '../../utils/BaseFront.jsx';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HookInformacoesMoto from '../../hooks/HookInformacoesMoto.jsx';
import { getAvatarColor, getUserInitials } from '../../utils/avatarUtils';

const InformacoesMoto = ({ moto, onBack }) => {
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const {
    canManageMoto,
    isEditing,
    savingMecanico,
    tecnicos,
    mecanicoSelecionado,
    setMecanicoSelecionado,
    mecanicoAtual,
    fallbackSrc,
    motoConcluida,
    getImageUrl,
    getStatusStyles,
    handleEditar,
    handleExcluir,
    handleAbrirChat,
    handleSalvarMecanico,
    handleCancelarEdicao,
  } = HookInformacoesMoto({ moto });

  return (
    <BaseFront
      nome={moto.modelo}
      headerAction={
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            onClick={onBack}
            sx={{ color: '#000', bgcolor: '#FEDCDB', width: 40, height: 40, borderRadius: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          {canManageMoto && (
            <>
              <IconButton
                onClick={handleEditar}
                sx={{ color: '#000', bgcolor: '#FEDCDB', width: 40, height: 40, borderRadius: 2 }}
              >
                <img src="/images/lapis.png" width={15} height={15} alt="Editar" />
              </IconButton>
              <IconButton
                onClick={() => setOpenConfirmDelete(true)}
                sx={{ color: '#000', bgcolor: '#FEDCDB', width: 40, height: 40, borderRadius: 2 }}
              >
                <img src="/images/lixeira.png" width={15} height={15} alt="Excluir" />
              </IconButton>
            </>
          )}
        </Box>
      }
      headerRightAction={
        <IconButton
          sx={{
            bgcolor: '#F30000',
            width: 40,
            height: 40,
            borderRadius: 2,
          }}
        >
          <img src="/images/estrela.png" alt="Estrelinha" width={18} />
        </IconButton>
      }
    >
      {/* Box Principal Interna */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* Chip de Status */}
        <Chip
          label={moto.estado}
          sx={{
            position: 'absolute',
            top: 20,
            right: 20,
            ...getStatusStyles(moto.estado),
            padding: '4px 16px',
            borderRadius: '16px',
            fontSize: '1rem',
            fontWeight: 600,
            textTransform: 'capitalize',
          }}
        />

        {/* Botão de Atribuir mecanico */}
        <Box
          sx={{
            width: '100%',
            maxWidth: '1600px',
            display: 'flex',
            position: 'absolute',
            top: 30,
            left: 70,
          }}
        >
          {!isEditing ? (
            <Button
              onClick={canManageMoto ? handleEditar : undefined}
              variant="contained"
              disabled={!canManageMoto}
              sx={{
                boxShadow: 3,
                backgroundColor: '#ffffff',
                color: 'black',
                textTransform: 'none',
                borderRadius: '16px',
                padding: '8px 8px',
                minWidth: '300px',
                minHeight: '45px',
                fontSize: '20px',
                '&.Mui-disabled': {
                  backgroundColor: '#f5f5f5',
                  color: '#444',
                },
              }}
            >
              {mecanicoAtual ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar
                    sx={{
                      width: 34,
                      height: 34,
                      fontSize: 20,
                      bgcolor: getAvatarColor(mecanicoAtual.nome, mecanicoAtual.email),
                    }}
                  >
                    {getUserInitials(mecanicoAtual.nome, mecanicoAtual.email)}
                  </Avatar>
                  <Typography sx={{ color: 'black', fontSize: '20px', lineHeight: 1 }}>
                    {mecanicoAtual.nome}
                  </Typography>
                </Box>
              ) : (
                'Atribuir Mecânico'
              )}
            </Button>
          ) : (
            <Box
              sx={{
                width: '300px',
                borderRadius: '8px',
                boxShadow: 3,
                p: 1.2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <FormControl fullWidth size="small">
                <Select
                  value={mecanicoSelecionado}
                  onChange={(event) => setMecanicoSelecionado(event.target.value)}
                  displayEmpty
                  sx={{ backgroundColor: '#fff', borderRadius: '10px' }}
                  renderValue={(selected) => {
                    const tecnicoSelecionado = tecnicos.find(
                      (t) => Number(t.id) === Number(selected)
                    );
                    if (!tecnicoSelecionado) {
                      return <Typography sx={{ color: '#888' }}>Selecione um mecânico</Typography>;
                    }
                    return (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar
                          sx={{
                            width: 22,
                            height: 22,
                            fontSize: 11,
                            bgcolor: getAvatarColor(
                              tecnicoSelecionado.nome,
                              tecnicoSelecionado.email
                            ),
                          }}
                        >
                          {getUserInitials(tecnicoSelecionado.nome, tecnicoSelecionado.email)}
                        </Avatar>
                        <Typography variant="body2" sx={{ color: '#222' }}>
                          {tecnicoSelecionado.nome}
                        </Typography>
                      </Box>
                    );
                  }}
                >
                  <MenuItem value="">
                    <Typography sx={{ color: '#888' }}>Selecione um mecânico</Typography>
                  </MenuItem>

                  {tecnicos.map((tecnico) => (
                    <MenuItem key={tecnico.id} value={tecnico.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
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

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  onClick={handleCancelarEdicao}
                  variant="outlined"
                  disabled={savingMecanico}
                  sx={{
                    flex: 1,
                    textTransform: 'none',
                    borderColor: '#000000',
                    color: 'black',
                    borderRadius: '10px',
                    '&:hover': { borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.08)' },
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSalvarMecanico}
                  variant="contained"
                  disabled={savingMecanico}
                  sx={{
                    flex: 1,
                    textTransform: 'none',
                    backgroundColor: '#F30000',
                    color: 'white',
                    borderRadius: '10px',
                    '&:hover': { backgroundColor: '#F5F5F5' },
                  }}
                >
                  {savingMecanico ? 'Salvando...' : 'Salvar'}
                </Button>
              </Box>
            </Box>
          )}
        </Box>

        {/* Botão do Chat da Moto */}
        <Box
          sx={{
            width: '100%',
            maxWidth: '1600px',
            display: 'flex',
            position: 'absolute',
            top: 270,
            left: 70,
          }}
        >
          <Button
            onClick={handleAbrirChat}
            variant="contained"
            disabled={motoConcluida}
            sx={{
              backgroundColor: '#F30000',
              color: 'white',
              textTransform: 'none',
              gap: 1,
              borderRadius: '16px',
              padding: '8px 16px',
              width: '300px',
              height: '45px',
              fontSize: '20px',
              '&:disabled': { backgroundColor: '#9A9A9A', color: '#444' },
            }}
          >
            <img src="/images/estrela.png" alt="Estrelinha" width={18} />
            Chat da Moto
          </Button>
        </Box>

        {/* BOX DA IMAGEM CENTRALIZADA */}
        <Box
          sx={{
            border: '1px solid #A0A0A0',
            borderRadius: '16px',
            width: '380px',
            height: 270,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 4,
            mt: 4,
          }}
        >
          <img
            src={getImageUrl(moto.imagemPath)}
            alt="Imagem Moto"
            onError={(event) => {
              if (event.currentTarget.src !== fallbackSrc) {
                event.currentTarget.src = fallbackSrc;
              }
            }}
            style={{
              width: '100%',
              height: '268px',
              objectFit: 'cover',
              display: 'block',
              borderRadius: '16px',
            }}
          />
        </Box>

        {/* Box das Informações (Cinza) */}
        <Box
          sx={{
            boxShadow: 3,
            borderRadius: '16px',
            p: 4,
            width: '95%',
            maxWidth: '1600px',
            minHeight: '320px',
          }}
        >
          <Stack direction="row" justifyContent="space-between" spacing={4}>
            <Stack spacing={2} sx={{ flex: 2 }}>
              <Typography sx={{ fontWeight: 500, fontSize: 30 }}>
                {moto.modelo || 'Nome da Moto'}
              </Typography>
              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: '#555', display: 'block', fontSize: 16 }}
                >
                  Número de Série
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, fontSize: 20 }}>
                  {moto.numeroSerie}
                </Typography>
              </Box>
            </Stack>

            <Stack spacing={2} sx={{ flex: 1 }}>
              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: '#555', display: 'block', fontSize: 16 }}
                >
                  Modelo
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {moto.modelo}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: '#555', display: 'block', fontSize: 16 }}
                >
                  Marca
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: '500' }}>
                  {moto.marca}
                </Typography>
              </Box>
            </Stack>

            <Stack sx={{ flex: 1, textAlign: 'right' }}>
              <Typography variant="caption" sx={{ color: '#555', display: 'block', fontSize: 16 }}>
                Ano
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: '500' }}>
                {moto.ano}
              </Typography>
            </Stack>
          </Stack>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Descrição da máquina
            </Typography>
            <Box sx={{ maxHeight: '150px', overflowY: 'auto', pr: 1 }}>
              <Typography variant="body2" sx={{ color: '#444', textAlign: 'justify' }}>
                {moto.descricao || 'Sem descrição disponível.'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Dialog
        open={openConfirmDelete}
        onClose={() => setOpenConfirmDelete(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Excluir moto</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#444' }}>
            Tem certeza que deseja excluir esta moto? Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setOpenConfirmDelete(false)}
            sx={{ color: '#333', textTransform: 'none' }}
          >
            Cancelar
          </Button>
          <Button
            onClick={async () => {
              setOpenConfirmDelete(false);
              await handleExcluir();
            }}
            variant="contained"
            sx={{ bgcolor: '#F30000', textTransform: 'none', '&:hover': { bgcolor: '#D80000' } }}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </BaseFront>
  );
};

export default InformacoesMoto;
