import React from "react";
import { useState, useContext } from "react";
import { Box, Stack, Typography, TextField, Button, FormControl, InputLabel, Select,MenuItem } from '@mui/material';
import PdfUploader from "../components/PdfUploader";
import { useRelatorio } from "../context/Relatorio";
import { MotoContext} from '../context/MotoContext.jsx';

//Página apenas da CRIAÇÃO de relatórios
const Relatorio = () => {
  const { motos} = useContext(MotoContext);

  const [motoEscolhida, setMotoEscolhida] = useState('');

  const handleChange = (event) => {
    setMotoEscolhida(event.target.value);
  };

  const [formValues, setFormValues] = useState({
      moto: '',
      cliente: '',
      diagnostico: '',
      mecanicos: '',
      servicos: '',
      pecas_trocadas: '',
      observacoes: ''
    });

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    // Validação simples dos campos obrigatórios
    if (!formValues.moto || !formValues.cliente || !formValues.diagnostico || !formValues.mecanicos || !formValues.servicos) {
      alert("Por favor, preencha o relatórico completo antes de salvar.");
      return;
    }

    const formData = new FormData();
    formData.append('moto', formValues.moto);
    formData.append('cliente', formValues.cliente);
    formData.append('diagnostico', formValues.diagnostico);
    formData.append('mecanicos', formValues.mecanicos);
    formData.append('servicos', formValues.servicos);
    formData.append('pecas_trocadas', formValues.pecas_trocadas);
    formData.append('observacoes', formValues.observacoes);
    formData.append('ano', formValues.ano);
    formData.append('marca', formValues.marca);
    formData.append('documento_pdf', arquivoPdf);

    const sucesso = await salvarRelatorio(formData);

    if (sucesso) {
        alert("Relatório salvo com sucesso!");
        setFormValues({ moto: '', cliente: '', diagnostico: '', mecanicos: '', servicos: '', pecas_trocadas: '', observacoes: '' });
        //dps adicionar o navigate para o histórico de relatórios
    }
  };

    return (
        <Box>
            <Stack component="form" spacing={2} sx={{ p: 4 }}>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Relatório Page
              </Typography>

              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel id="select-moto-label">Selecione a Moto</InputLabel>
                <Select
                  labelId="select-moto-label"
                  id="select-moto"
                  value={motoEscolhida}
                  label="Selecione a Moto"
                  onChange={handleChange}
                >
                  {motos.map((moto) => (
                    <MenuItem key={moto.id} value={moto.id}>
                      {moto.modelo} - {moto.marca} ({moto.ano})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                placeholder="Digite o nome do cliente"
                variant="outlined"
                fullWidth
              />

              <TextField
                placeholder="Digite o diagnóstico"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
              />

              <TextField
                placeholder="Digite o(s) mecânico(s) responsável(s)"
                variant="outlined"
                fullWidth
              />

              {/*No schema está escrito como "atividades" */}
              <TextField
                placeholder="Digite o(s) serviço(s) realizado(s)"
                variant="outlined"
                fullWidth
              />

              <TextField
                placeholder="Digite as peças trocadas (se houver)"
                variant="outlined"
                fullWidth
              />

              <TextField
                placeholder="Digite observações adicionais"
                variant="outlined"
                fullWidth
                multiline
                rows={2}
              />

              {/*Depois criar o imageupload*/}
              <Typography variant="body2">
                Anexar fotos ou documentos (opcional)
                <PdfUploader onFileSelect={(file) => console.log(file)} />
              </Typography>

              <Button>
                Cancelar
              </Button>

              <Button onClick={handleSubmit}>
                Salvar Relatório
              </Button>
            </Stack>      
        </Box>
    );
}

export default Relatorio;