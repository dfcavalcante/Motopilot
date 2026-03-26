import { useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { MotoContext } from '../context/MotoContext.jsx';
import { useNavigate } from 'react-router-dom';

// Molde do formulário e regras de validação usando Zod
const motoSchema = z.object({
  modelo: z.string().min(1, 'O modelo é obrigatório.'),
  marca: z.string().min(1, 'A marca é obrigatória.'),
  ano: z.string().min(4, 'O ano deve ter 4 dígitos.'),
  numeroSerie: z.string().min(1, 'O número de série é obrigatório.'),
  descricao: z.string().optional(),
  foto: z.any().optional(),
});

export const HookCadastroMoto = () => {
  const {
    cadastrarMoto,
    erro: erroContexto,
    motos,
    listarMotos,
    verificarNumeroSerie,
    modeloPaiSelecionado,
  } = useContext(MotoContext);

  const navigate = useNavigate();
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(motoSchema),
    defaultValues: {
      modelo: '',
      marca: '',
      ano: '',
      numeroSerie: '',
      descricao: '',
    },
  });

  useEffect(() => {
    listarMotos();
  }, []);

  useEffect(() => {
    if (modeloPaiSelecionado) {
      setValue('marca', modeloPaiSelecionado.marca || '');
      setValue('modelo', modeloPaiSelecionado.modelo || '');
      setValue('ano', String(modeloPaiSelecionado.ano || ''));
      setValue(
        'foto',
        modeloPaiSelecionado.imagemMoto || modeloPaiSelecionado.imagem_moto || null,
        { shouldValidate: true }
      );
    }
  }, [modeloPaiSelecionado, setValue]);

  const handleProximo = async () => {
    console.log('🔵 handleProximo chamado');
    
    // Validação da etapa 1: campos obrigatórios
    const camposValidos = await trigger(['modelo', 'marca', 'ano', 'numeroSerie']);
    console.log('🔵 Campos válidos:', camposValidos);
    if (!camposValidos) {
      toast.warning('Preencha os campos obrigatórios.');
      return;
    }

    console.log('🔵 modeloPaiSelecionado:', modeloPaiSelecionado);
    if (!modeloPaiSelecionado?.id) {
      toast.warning('Selecione um modelo de moto pai antes de continuar.');
      return;
    }

    const numeroSerieAtual = watch('numeroSerie');
    console.log('🔵 Número de série:', numeroSerieAtual);

    // Validação de Duplicidade no State
    if (
      motos.some(
        (moto) => moto.numero_serie === numeroSerieAtual || moto.numeroSerie === numeroSerieAtual
      )
    ) {
      console.log('🔴 Série duplicada no state');
      setError('numeroSerie', {
        type: 'manual',
        message: 'Este número de série já está registrado.',
      });
      return;
    }

    // Validação de Duplicidade no Backend
    if (verificarNumeroSerie) {
      const exists = await verificarNumeroSerie(numeroSerieAtual);
      console.log('🔵 Série existe no backend:', exists);
      if (exists) {
        setError('numeroSerie', {
          type: 'manual',
          message: 'Este número de série já está registrado.',
        });
        return;
      }
    }

    // Todas as validações passaram → submeter o formulário
    console.log('🟢 Todas validações OK, submetendo...');
    handleSubmit(onSubmitForm)();
  };

  const handleVoltar = () => {
    navigate(-1);
  };

  // Submit Form da moto "filha" (sem manual, já foi pro pai)
  const onSubmitForm = async (data) => {
    setLoading(true);

    const marcaFinal = modeloPaiSelecionado?.marca || data.marca;
    const modeloFinal = modeloPaiSelecionado?.modelo || data.modelo;

    const formData = new FormData();
    formData.append('marca', marcaFinal);
    formData.append('modelo', modeloFinal);
    formData.append('ano', data.ano);
    formData.append('numeroSerie', data.numeroSerie);
    formData.append('descricao', data.descricao || '');
    if (data.foto instanceof File) {
      formData.append('imagem_moto', data.foto);
    }

    try {
      const sucesso = await cadastrarMoto(formData);

      if (sucesso) {
        setEtapaAtual(2); // Pula direto pra etapa final
      } else {
        const msgErro = erroContexto || 'Erro ao cadastrar moto.';
        toast.error(msgErro);
      }
    } catch (error) {
      toast.error('Erro inesperado de conexão.');
    } finally {
      setLoading(false);
    }
  };

  return {
    etapaAtual,
    loading,
    errors,
    register,
    setValue,
    handleSubmit,
    onSubmitForm,
    watch,
    handleProximo,
    handleVoltar,
    modeloPaiSelecionado,
  };
};

export default HookCadastroMoto;

